"""
ClearSpeak AI - Voice Pipeline Orchestrator
End-to-end voice processing pipeline with ASR, LLM, TTS, and translation integration.

Supports two distinct modes:
1. Agent Mode: User Audio → ASR → LLM Agent → TTS → Audio
2. Translation Mode (S2ST): Caller Audio (Lang A) → ASR → Translation → TTS (Lang B) → Callee Audio
"""

import asyncio
from typing import Optional, Dict, Any, AsyncGenerator, Callable
from datetime import datetime
from enum import Enum
import structlog
from backend.models.schemas import (
    VoiceSession, SessionState, TranscriptMessage,
    ConversationMessage, MessageRole, VoiceMessage
)
from backend.core.session import SessionManager
from backend.asr.base import ASRProvider
from backend.tts.base import TTSProvider
from backend.llm.base import LLMProvider, OllamaLLMProvider
from backend.monitoring.metrics import MetricsCollector

logger = structlog.get_logger()


class PipelineMode(str, Enum):
    """Pipeline operation modes."""
    AGENT = "agent"           # Voice AI Agent mode
    TRANSLATION = "translation"  # Real-time translation mode (S2ST)


# Default system prompts
AGENT_SYSTEM_PROMPT = """You are a helpful AI voice assistant for ClearSpeak AI, India's sovereign communication platform.

IMPORTANT: When users ask questions, answer them directly based on your knowledge. Do NOT give instructions about how to use tools or services. Just answer the question.

Key guidelines:
- Answer questions directly and concisely (2-3 sentences maximum)
- Use natural, spoken language suitable for voice
- Be friendly and professional
- Respond in the same language the user speaks
- Support code-switching (mixing languages) naturally

You can help with:
- Answering factual questions about any topic
- Explaining concepts and ideas
- Providing information and recommendations
- Translation between languages
- General conversation and assistance"""


class VoicePipeline:
    """
    End-to-end voice processing pipeline with dual-mode support.
    
    Modes:
    
    1. AGENT MODE (Default):
       Audio Input → ASR → [Translation] → LLM (with tools) → [Translation] → TTS → Audio Output
       
    2. TRANSLATION MODE (S2ST):
       Caller Audio (Lang A) → ASR → Translation Engine (Lang A → Lang B) → TTS (Lang B) → Callee Audio
       
    Features:
    - Real-time streaming processing
    - Session state management
    - Tool calling orchestration
    - Error recovery and fallback
    - Latency optimization
    - Cross-lingual support (22 Indian languages + 200+ global)
    - Automatic language detection
    - Real-time translation between speakers
    - Binary audio streaming for efficiency
    """
    
    def __init__(
        self,
        asr_provider: ASRProvider,
        llm_provider: LLMProvider | OllamaLLMProvider,
        tts_provider: TTSProvider,
        session_manager: SessionManager,
        translation_manager=None,
        indic_translation_provider=None,
        system_prompt: Optional[str] = None,
        default_mode: PipelineMode = PipelineMode.AGENT
    ):
        self.asr = asr_provider
        self.llm = llm_provider
        self.tts = tts_provider
        self.sessions = session_manager
        self.translation_manager = translation_manager
        self.indic_translation = indic_translation_provider
        self.system_prompt = system_prompt or AGENT_SYSTEM_PROMPT
        self.default_mode = default_mode
        self._metrics = MetricsCollector()
        
        # Translation mode state
        self._translation_sessions: Dict[str, Dict[str, Any]] = {}
        
    async def initialize(self):
        """Initialize all pipeline components."""
        await self.asr.initialize()
        await self.tts.initialize()
        logger.info(
            "Voice pipeline initialized",
            has_translation=self.translation_manager is not None,
            has_indic_translation=self.indic_translation is not None,
            default_mode=self.default_mode
        )
    
    async def process_audio_stream(
        self,
        session_id: str,
        audio_stream: AsyncGenerator[bytes, None],
        mode: Optional[PipelineMode] = None
    ) -> AsyncGenerator[VoiceMessage, None]:
        """
        Process audio stream through the pipeline.
        
        Args:
            session_id: Session identifier
            audio_stream: Async generator of audio chunks
            mode: Pipeline mode (agent or translation)
            
        Yields:
            VoiceMessage with audio response or text
        """
        pipeline_mode = mode or self.default_mode
        
        if pipeline_mode == PipelineMode.TRANSLATION:
            async for msg in self._process_translation_mode(session_id, audio_stream):
                yield msg
        else:
            async for msg in self._process_agent_mode(session_id, audio_stream):
                yield msg
    
    async def _process_agent_mode(
        self,
        session_id: str,
        audio_stream: AsyncGenerator[bytes, None]
    ) -> AsyncGenerator[VoiceMessage, None]:
        """
        Agent Mode: User Audio → ASR → [Translation] → LLM → [Translation] → TTS → Audio
        
        The AI agent processes the user's request and responds in their language.
        """
        start_time = datetime.utcnow()
        
        # Get session
        session = await self.sessions.get_session(session_id)
        if not session:
            logger.error("Session not found", session_id=session_id)
            return
        
        await self.sessions.update_session_state(session_id, SessionState.LISTENING)
        
        try:
            # Step 1: ASR - Convert audio to text
            transcripts = []
            async for transcript in self.asr.transcribe_stream(
                audio_stream,
                session_id,
                session.language
            ):
                if transcript.is_final and transcript.transcript.strip():
                    transcripts.append(transcript)
                    yield VoiceMessage(
                        type="transcript",
                        session_id=session_id,
                        text=transcript.transcript,
                        confidence=transcript.confidence
                    )
            
            if not transcripts:
                await self.sessions.update_session_state(session_id, SessionState.READY)
                return
            
            # Combine transcripts
            user_text = " ".join(t.transcript for t in transcripts)
            
            # Step 2: Detect user's language and translate if needed
            user_language = session.language or "en"
            text_for_llm = user_text
            
            if self.translation_manager and user_language != "en":
                detected_lang = await self.translation_manager.detect_language(user_text)
                if detected_lang and detected_lang != user_language:
                    user_language = detected_lang
                
                text_for_llm = await self.translation_manager.translate(
                    user_text, "en", user_language
                ) or user_text
                
                logger.info(
                    "Translated user input",
                    session_id=session_id,
                    source_lang=user_language,
                    translated=text_for_llm[:100]
                )
            
            # Add user message to history
            await self.sessions.add_message(
                session_id,
                MessageRole.USER,
                text_for_llm
            )
            
            await self.sessions.update_session_state(session_id, SessionState.PROCESSING)
            
            # Step 3: LLM - Generate response with tool calling
            response_text = ""
            async for event in self.llm.generate_response_with_tools(
                await self.sessions.get_conversation_history(session_id),
                self.system_prompt
            ):
                if event["type"] == "text":
                    response_text = event["content"]
                    yield VoiceMessage(
                        type="text",
                        session_id=session_id,
                        text=response_text
                    )
                elif event["type"] == "tool_call":
                    yield VoiceMessage(
                        type="tool_call",
                        session_id=session_id,
                        text=f"Using tool: {event['tool']}"
                    )
                elif event["type"] == "tool_result":
                    yield VoiceMessage(
                        type="tool_result",
                        session_id=session_id,
                        text=f"Result: {event['result']}"
                    )
            
            # Step 4: Translate response back to user's language
            response_for_tts = response_text
            
            if self.translation_manager and user_language != "en" and response_text:
                response_for_tts = await self.translation_manager.translate(
                    response_text, user_language, "en"
                ) or response_text
                
                logger.info(
                    "Translated response",
                    session_id=session_id,
                    target_lang=user_language,
                    translated=response_for_tts[:100]
                )
            
            # Add assistant message to history
            if response_text:
                await self.sessions.add_message(
                    session_id,
                    MessageRole.ASSISTANT,
                    response_text
                )
            
            await self.sessions.update_session_state(session_id, SessionState.SPEAKING)
            
            # Step 5: TTS - Convert response to audio
            audio_chunk_count = 0
            async for audio_chunk in self.tts.synthesize(response_for_tts, language=user_language):
                yield VoiceMessage(
                    type="audio",
                    session_id=session_id,
                    audio_data=audio_chunk.hex()
                )
                audio_chunk_count += 1
            
            # Update metrics
            latency_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
            self._metrics.processing_latency.labels(session_id=session_id).observe(latency_ms)
            self._metrics.audio_chunks_generated.labels(session_id=session_id).inc(audio_chunk_count)
            
            await self.sessions.update_session_state(session_id, SessionState.READY)
            
            logger.info(
                "Agent mode processed",
                session_id=session_id,
                latency_ms=latency_ms,
                audio_chunks=audio_chunk_count,
                user_language=user_language
            )
            
        except Exception as e:
            logger.error("Agent mode processing failed", session_id=session_id, error=str(e))
            await self.sessions.update_session_state(session_id, SessionState.ERROR)
            yield VoiceMessage(
                type="error",
                session_id=session_id,
                text="I'm sorry, I encountered an error processing your request."
            )
    
    async def _process_translation_mode(
        self,
        session_id: str,
        audio_stream: AsyncGenerator[bytes, None]
    ) -> AsyncGenerator[VoiceMessage, None]:
        """
        Translation Mode (S2ST): Caller Audio (Lang A) → ASR → Translation (Lang A → Lang B) → TTS (Lang B) → Callee Audio
        
        Real-time speech-to-speech translation between two parties.
        """
        start_time = datetime.utcnow()
        
        # Get or create translation session state
        if session_id not in self._translation_sessions:
            self._translation_sessions[session_id] = {
                "source_language": None,
                "target_language": None,
                "caller_id": None,
                "callee_id": None,
            }
        
        trans_session = self._translation_sessions[session_id]
        source_lang = trans_session.get("source_language") or "hi"
        target_lang = trans_session.get("target_language") or "en"
        
        await self.sessions.update_session_state(session_id, SessionState.LISTENING)
        
        try:
            # Step 1: ASR - Convert audio to text in source language
            transcripts = []
            async for transcript in self.asr.transcribe_stream(
                audio_stream,
                session_id,
                source_lang
            ):
                if transcript.is_final and transcript.transcript.strip():
                    transcripts.append(transcript)
                    yield VoiceMessage(
                        type="transcript",
                        session_id=session_id,
                        text=transcript.transcript,
                        confidence=transcript.confidence,
                        metadata={"source_language": source_lang}
                    )
            
            if not transcripts:
                await self.sessions.update_session_state(session_id, SessionState.READY)
                return
            
            # Combine transcripts
            source_text = " ".join(t.transcript for t in transcripts)
            
            await self.sessions.update_session_state(session_id, SessionState.PROCESSING)
            
            # Step 2: Translate from source to target language
            translated_text = source_text
            
            # Use Indic translation provider if available
            if self.indic_translation:
                translated_text = await self.indic_translation.translate(
                    source_text, source_lang, target_lang
                ) or source_text
            elif self.translation_manager:
                translated_text = await self.translation_manager.translate(
                    source_text, target_lang, source_lang
                ) or source_text
            
            # Emit translation result
            yield VoiceMessage(
                type="translation",
                session_id=session_id,
                text=translated_text,
                metadata={
                    "source_text": source_text,
                    "source_language": source_lang,
                    "target_language": target_lang,
                }
            )
            
            logger.info(
                "Translation completed",
                session_id=session_id,
                source_lang=source_lang,
                target_lang=target_lang,
                source_length=len(source_text),
                target_length=len(translated_text)
            )
            
            # Step 3: TTS - Convert translated text to audio in target language
            await self.sessions.update_session_state(session_id, SessionState.SPEAKING)
            
            audio_chunk_count = 0
            async for audio_chunk in self.tts.synthesize(translated_text, language=target_lang):
                yield VoiceMessage(
                    type="audio",
                    session_id=session_id,
                    audio_data=audio_chunk.hex(),
                    metadata={"target_language": target_lang}
                )
                audio_chunk_count += 1
            
            # Update metrics
            latency_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
            self._metrics.processing_latency.labels(session_id=session_id).observe(latency_ms)
            
            await self.sessions.update_session_state(session_id, SessionState.READY)
            
            logger.info(
                "Translation mode processed",
                session_id=session_id,
                latency_ms=latency_ms,
                audio_chunks=audio_chunk_count,
                source_lang=source_lang,
                target_lang=target_lang
            )
            
        except Exception as e:
            logger.error("Translation mode processing failed", session_id=session_id, error=str(e))
            await self.sessions.update_session_state(session_id, SessionState.ERROR)
            yield VoiceMessage(
                type="error",
                session_id=session_id,
                text="Translation error occurred."
            )
    
    async def process_text_input(
        self,
        session_id: str,
        text: str,
        mode: Optional[PipelineMode] = None
    ) -> AsyncGenerator[VoiceMessage, None]:
        """
        Process text input through the pipeline.
        
        Args:
            session_id: Session identifier
            text: User text input
            mode: Pipeline mode (agent or translation)
            
        Yields:
            VoiceMessage with response
        """
        pipeline_mode = mode or self.default_mode
        
        if pipeline_mode == PipelineMode.TRANSLATION:
            async for msg in self._process_text_translation(session_id, text):
                yield msg
        else:
            async for msg in self._process_text_agent(session_id, text):
                yield msg
    
    async def _process_text_agent(
        self,
        session_id: str,
        text: str
    ) -> AsyncGenerator[VoiceMessage, None]:
        """Process text through agent mode."""
        start_time = datetime.utcnow()
        
        session = await self.sessions.get_session(session_id)
        if not session:
            logger.error("Session not found", session_id=session_id)
            return
        
        await self.sessions.update_session_state(session_id, SessionState.PROCESSING)
        
        try:
            user_language = session.language or "en"
            text_for_llm = text
            
            if self.translation_manager and user_language != "en":
                detected_lang = await self.translation_manager.detect_language(text)
                if detected_lang and detected_lang != user_language:
                    user_language = detected_lang
                
                if user_language != "en":
                    text_for_llm = await self.translation_manager.translate(
                        text, "en", user_language
                    ) or text
            
            await self.sessions.add_message(session_id, MessageRole.USER, text_for_llm)
            
            response_text = ""
            async for event in self.llm.generate_response_with_tools(
                await self.sessions.get_conversation_history(session_id),
                self.system_prompt
            ):
                if event["type"] == "text":
                    response_text = event["content"]
                    yield VoiceMessage(
                        type="text",
                        session_id=session_id,
                        text=response_text
                    )
                elif event["type"] == "tool_call":
                    yield VoiceMessage(
                        type="tool_call",
                        session_id=session_id,
                        text=f"Using tool: {event['tool']}"
                    )
            
            response_for_tts = response_text
            
            if self.translation_manager and user_language != "en" and response_text:
                response_for_tts = await self.translation_manager.translate(
                    response_text, user_language, "en"
                ) or response_text
            
            if response_text:
                await self.sessions.add_message(
                    session_id,
                    MessageRole.ASSISTANT,
                    response_text
                )
            
            await self.sessions.update_session_state(session_id, SessionState.SPEAKING)
            
            async for audio_chunk in self.tts.synthesize(response_for_tts, language=user_language):
                yield VoiceMessage(
                    type="audio",
                    session_id=session_id,
                    audio_data=audio_chunk.hex()
                )
            
            latency_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
            self._metrics.processing_latency.labels(session_id=session_id).observe(latency_ms)
            
            await self.sessions.update_session_state(session_id, SessionState.READY)
            
        except Exception as e:
            logger.error("Text agent processing failed", session_id=session_id, error=str(e))
            await self.sessions.update_session_state(session_id, SessionState.ERROR)
            yield VoiceMessage(
                type="error",
                session_id=session_id,
                text="I'm sorry, I encountered an error."
            )
    
    def _is_question(self, text: str) -> bool:
        """Detect if text is a question that should be answered rather than translated."""
        text_lower = text.lower().strip()
        question_words = [
            "what", "how", "why", "when", "where", "who", "which",
            "tell me about", "explain", "define", "describe",
            "can you", "could you", "would you", "do you",
            "is there", "are there", "does", "do", "is", "are",
            "who is", "who are", "what is", "what are",
            "how do", "how does", "how to", "how can",
            "why do", "why does", "why is", "why are",
            "where is", "where are", "where do", "where does",
            "when is", "when are", "when do", "when does",
            "which is", "which are", "which one"
        ]
        
        if text.rstrip().endswith("?"):
            return True
        
        for word in question_words:
            if text_lower.startswith(word):
                return True
        
        return False

    async def _process_text_translation(
        self,
        session_id: str,
        text: str
    ) -> AsyncGenerator[VoiceMessage, None]:
        """Process text through translation mode. Detects questions and answers them via LLM."""
        start_time = datetime.utcnow()
        
        # If it's a question, route to agent mode for answering
        if self._is_question(text):
            logger.info("Question detected in translation mode, routing to agent", text=text[:50])
            async for msg in self._process_text_agent(session_id, text):
                yield msg
            return
        
        if session_id not in self._translation_sessions:
            self._translation_sessions[session_id] = {
                "source_language": "hi",
                "target_language": "en",
            }
        
        trans_session = self._translation_sessions[session_id]
        source_lang = trans_session.get("source_language") or "hi"
        target_lang = trans_session.get("target_language") or "en"
        
        try:
            # Detect source language if not set
            if self.translation_manager:
                detected = await self.translation_manager.detect_language(text)
                if detected:
                    source_lang = detected
                    trans_session["source_language"] = source_lang
            
            # Translate
            translated_text = text
            
            if self.indic_translation:
                translated_text = await self.indic_translation.translate(
                    text, source_lang, target_lang
                ) or text
            elif self.translation_manager:
                translated_text = await self.translation_manager.translate(
                    text, target_lang, source_lang
                ) or text
            
            yield VoiceMessage(
                type="translation",
                session_id=session_id,
                text=translated_text,
                metadata={
                    "source_text": text,
                    "source_language": source_lang,
                    "target_language": target_lang,
                }
            )
            
            # TTS
            await self.sessions.update_session_state(session_id, SessionState.SPEAKING)
            
            async for audio_chunk in self.tts.synthesize(translated_text, language=target_lang):
                yield VoiceMessage(
                    type="audio",
                    session_id=session_id,
                    audio_data=audio_chunk.hex(),
                    metadata={"target_language": target_lang}
                )
            
            latency_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
            self._metrics.processing_latency.labels(session_id=session_id).observe(latency_ms)
            
            await self.sessions.update_session_state(session_id, SessionState.READY)
            
        except Exception as e:
            logger.error("Text translation processing failed", session_id=session_id, error=str(e))
            await self.sessions.update_session_state(session_id, SessionState.ERROR)
            yield VoiceMessage(
                type="error",
                session_id=session_id,
                text="Translation error occurred."
            )
    
    async def set_translation_languages(
        self,
        session_id: str,
        source_language: str,
        target_language: str
    ):
        """Set languages for translation mode."""
        if session_id not in self._translation_sessions:
            self._translation_sessions[session_id] = {}
        
        self._translation_sessions[session_id]["source_language"] = source_language
        self._translation_sessions[session_id]["target_language"] = target_language
        
        logger.info(
            "Translation languages set",
            session_id=session_id,
            source=source_language,
            target=target_language
        )
    
    async def get_translation_info(self, session_id: str) -> Optional[Dict[str, str]]:
        """Get current translation session info."""
        return self._translation_sessions.get(session_id)
    
    async def translate_text(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> Optional[str]:
        """Direct text translation helper."""
        if self.indic_translation:
            return await self.indic_translation.translate(text, source_language, target_language)
        elif self.translation_manager:
            return await self.translation_manager.translate(text, target_language, source_language)
        return None
    
    async def detect_language(self, text: str) -> str:
        """Detect the language of text."""
        if self.indic_translation:
            detected = await self.indic_translation.detect_language(text)
            if detected:
                return detected
        
        if self.translation_manager:
            return await self.translation_manager.detect_language(text)
        
        return "en"
    
    async def cleanup(self):
        """Cleanup pipeline resources."""
        await self.asr.cleanup()
        await self.tts.cleanup()
        self._translation_sessions.clear()
        logger.info("Voice pipeline cleaned up")
