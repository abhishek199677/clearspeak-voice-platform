"""
Voice AI Platform - Voice Pipeline Orchestrator
End-to-end voice processing pipeline with ASR, LLM, and TTS integration.
"""

import asyncio
from typing import Optional, Dict, Any, AsyncGenerator
from datetime import datetime
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

# Default system prompt for voice agent
DEFAULT_SYSTEM_PROMPT = """You are a helpful AI voice assistant. You provide clear, concise, and accurate responses.

Key guidelines:
- Keep responses brief and conversational (2-3 sentences maximum)
- Use natural, spoken language
- Avoid complex formatting or lists
- Be friendly and professional
- If you need to use a tool, do so naturally in conversation
- Confirm understanding before taking actions
- Ask clarifying questions when needed

You can help with:
- Answering questions
- Looking up information
- Performing calculations
- Scheduling and time management
- General assistance and support
"""


class VoicePipeline:
    """
    End-to-end voice processing pipeline.
    
    Orchestrates the flow:
    Audio Input → ASR → LLM (with tools) → TTS → Audio Output
    
    Features:
    - Real-time streaming processing
    - Session state management
    - Tool calling orchestration
    - Error recovery and fallback
    - Latency optimization
    - Multi-language support
    """
    
    def __init__(
        self,
        asr_provider: ASRProvider,
        llm_provider: LLMProvider | OllamaLLMProvider,
        tts_provider: TTSProvider,
        session_manager: SessionManager,
        system_prompt: Optional[str] = None
    ):
        self.asr = asr_provider
        self.llm = llm_provider
        self.tts = tts_provider
        self.sessions = session_manager
        self.system_prompt = system_prompt or DEFAULT_SYSTEM_PROMPT
        self._metrics = MetricsCollector()
        
    async def initialize(self):
        """Initialize all pipeline components."""
        await self.asr.initialize()
        await self.tts.initialize()
        logger.info("Voice pipeline initialized")
    
    async def process_audio_stream(
        self,
        session_id: str,
        audio_stream: AsyncGenerator[bytes, None]
    ) -> AsyncGenerator[VoiceMessage, None]:
        """
        Process audio stream through the complete pipeline.
        
        Args:
            session_id: Session identifier
            audio_stream: Async generator of audio chunks
            
        Yields:
            VoiceMessage with audio response or text
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
            
            # Add user message to historyb
            await self.sessions.add_message(
                session_id,
                MessageRole.USER,
                user_text
            )
            
            await self.sessions.update_session_state(session_id, SessionState.PROCESSING)
            
            # Step 2: LLM - Generate response with tool calling
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
            
            # Add assistant message to history
            if response_text:
                await self.sessions.add_message(
                    session_id,
                    MessageRole.ASSISTANT,
                    response_text
                )
            
            await self.sessions.update_session_state(session_id, SessionState.SPEAKING)
            
            # Step 3: TTS - Convert response to audio
            audio_chunk_count = 0
            async for audio_chunk in self.tts.synthesize(response_text):
                yield VoiceMessage(
                    type="audio",
                    session_id=session_id,
                    audio_data=audio_chunk.hex()  # Encode as hex for WebSocket
                )
                audio_chunk_count += 1
            
            # Update metrics
            latency_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
            self._metrics.processing_latency.labels(session_id=session_id).observe(latency_ms)
            self._metrics.audio_chunks_generated.labels(session_id=session_id).inc(audio_chunk_count)
            
            await self.sessions.update_session_state(session_id, SessionState.READY)
            
            logger.info(
                "Audio stream processed",
                session_id=session_id,
                latency_ms=latency_ms,
                audio_chunks=audio_chunk_count
            )
            
        except Exception as e:
            logger.error(
                "Pipeline processing failed",
                session_id=session_id,
                error=str(e)
            )
            await self.sessions.update_session_state(session_id, SessionState.ERROR)
            yield VoiceMessage(
                type="error",
                session_id=session_id,
                text="I'm sorry, I encountered an error processing your request."
            )
    
    async def process_text_input(
        self,
        session_id: str,
        text: str
    ) -> AsyncGenerator[VoiceMessage, None]:
        """
        Process text input through the pipeline (for typed messages).
        
        Args:
            session_id: Session identifier
            text: User text input
            
        Yields:
            VoiceMessage with response
        """
        start_time = datetime.utcnow()
        
        session = await self.sessions.get_session(session_id)
        if not session:
            logger.error("Session not found", session_id=session_id)
            return
        
        await self.sessions.update_session_state(session_id, SessionState.PROCESSING)
        
        try:
            # Add user message
            await self.sessions.add_message(session_id, MessageRole.USER, text)
            
            # Generate response
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
            
            # Add response to history
            if response_text:
                await self.sessions.add_message(
                    session_id,
                    MessageRole.ASSISTANT,
                    response_text
                )
            
            # Generate audio
            await self.sessions.update_session_state(session_id, SessionState.SPEAKING)
            
            async for audio_chunk in self.tts.synthesize(response_text):
                yield VoiceMessage(
                    type="audio",
                    session_id=session_id,
                    audio_data=audio_chunk.hex()
                )
            
            latency_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
            self._metrics.processing_latency.labels(session_id=session_id).observe(latency_ms)
            
            await self.sessions.update_session_state(session_id, SessionState.READY)
            
        except Exception as e:
            logger.error("Text processing failed", session_id=session_id, error=str(e))
            await self.sessions.update_session_state(session_id, SessionState.ERROR)
            yield VoiceMessage(
                type="error",
                session_id=session_id,
                text="I'm sorry, I encountered an error."
            )
    
    async def cleanup(self):
        """Cleanup pipeline resources."""
        await self.asr.cleanup()
        await self.tts.cleanup()
        logger.info("Voice pipeline cleaned up")
