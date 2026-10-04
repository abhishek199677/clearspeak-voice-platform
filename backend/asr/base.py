"""
Voice AI Platform - ASR (Automatic Speech Recognition) Providers
Abstract base class and implementations for speech-to-text services.
"""

from abc import ABC, abstractmethod
from typing import AsyncGenerator, Optional
import asyncio
import structlog
from backend.models.schemas import TranscriptMessage

logger = structlog.get_logger()

# Devanagari/Indic script hints for Whisper. Without a hint the base model
# often writes Hindi speech in Urdu/Arabic script instead of the native script.
_WHISPER_SCRIPT_HINTS = {
    "hi": "नमस्ते। हिंदी में उत्तर दें।",
    "mr": "नमस्कार। मराठीत उत्तर द्या।",
    "bn": "নমস্কার। বাংলায় উত্তর দিন।",
    "ta": "வணக்கம்। தமிழில் பதிலளிக்கவும்।",
    "te": "నమస్కారం। తెలుగులో సమాధానం ఇవ్వండి।",
    "ml": "നമസ്കാരം. മലയാളത്തിൽ ഉത്തരം നൽകുക.",
    "kn": "ನಮಸ್ಕಾರ. ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ.",
    "gu": "નમસ્તે. ગુજરાતીમાં જવાબ આપો.",
    "pa": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।",
    "ur": "السلام علیکم۔ اردو میں جواب دیں۔",
    "or": "ନମସ୍କାର। ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅ।",
    "as": "নমস্কাৰ। অসমীয়াত উত্তৰ দিয়ক।",
    "ne": "नमस्ते। नेपालीमा जवाफ दिनुहोस्।",
}


def _whisper_prompt(language: Optional[str]) -> Optional[str]:
    """Return a native-script prompt hint for Whisper for the given language."""
    if not language or language == "auto":
        return None
    return _WHISPER_SCRIPT_HINTS.get(language.lower().split("-")[0])


class ASRProvider(ABC):
    """Abstract base class for ASR providers."""
    
    @abstractmethod
    async def initialize(self) -> None:
        """Initialize the ASR provider."""
        pass
    
    @abstractmethod
    async def transcribe_stream(
        self, 
        audio_stream: AsyncGenerator[bytes, None],
        session_id: str,
        language: str = "en"
    ) -> AsyncGenerator[TranscriptMessage, None]:
        """
        Transcribe audio stream in real-time.
        
        Args:
            audio_stream: Async generator yielding audio chunks
            session_id: Session identifier
            language: Language code
            
        Yields:
            TranscriptMessage with transcription results
        """
        pass
    
    @abstractmethod
    async def transcribe_audio(
        self,
        audio_data: bytes,
        session_id: str,
        language: str = "en"
    ) -> Optional[TranscriptMessage]:
        """
        Transcribe a complete audio buffer.
        
        Args:
            audio_data: Complete audio data
            session_id: Session identifier
            language: Language code
            
        Returns:
            TranscriptMessage or None if transcription fails
        """
        pass
    
    @abstractmethod
    async def cleanup(self) -> None:
        """Cleanup provider resources."""
        pass


class DeepgramASR(ASRProvider):
    """
    Deepgram ASR provider with real-time streaming support.
    
    Features:
    - Low-latency streaming transcription
    - Interim and final results
    - Speaker diarization support
    - Multi-language support
    """
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = None
        
    async def initialize(self) -> None:
        """Initialize Deepgram client."""
        try:
            from deepgram import DeepgramClient, LiveTranscriptionEvents
            self.client = DeepgramClient(self.api_key)
            logger.info("Deepgram ASR initialized")
        except ImportError:
            logger.error("Deepgram SDK not installed")
            raise
        except Exception as e:
            logger.error("Failed to initialize Deepgram", error=str(e))
            raise
    
    async def transcribe_stream(
        self,
        audio_stream: AsyncGenerator[bytes, None],
        session_id: str,
        language: str = "en"
    ) -> AsyncGenerator[TranscriptMessage, None]:
        """Stream audio to Deepgram for real-time transcription."""
        from deepgram import DeepgramClient, LiveOptions
        
        dg_connection = self.client.listen.live.v("1")
        
        transcript_queue: asyncio.Queue = asyncio.Queue()
        is_connected = False
        
        async def on_open(self, **kwargs):
            nonlocal is_connected
            is_connected = True
            logger.debug("Deepgram connection opened", session_id=session_id)
        
        async def on_transcript(self, result, **kwargs):
            transcript = result.channel.alternatives[0]
            if transcript.transcript.strip():
                await transcript_queue.put(TranscriptMessage(
                    session_id=session_id,
                    transcript=transcript.transcript,
                    confidence=transcript.confidence,
                    is_final=result.is_final,
                    language=language
                ))
        
        async def on_close(self, **kwargs):
            nonlocal is_connected
            is_connected = False
            await transcript_queue.put(None)
            logger.debug("Deepgram connection closed", session_id=session_id)
        
        dg_connection.on(LiveTranscriptionEvents.Open, on_open)
        dg_connection.on(LiveTranscriptionEvents.Transcript, on_transcript)
        dg_connection.on(LiveTranscriptionEvents.Close, on_close)
        
        options = LiveOptions(
            model="nova-2",
            language="en" if language in (None, "", "auto") else language,
            encoding="linear16",
            sample_rate=16000,
            channels=1,
            interim_results=True,
            endpointing=300,
            smart_format=True
        )
        
        await dg_connection.start(options)
        
        async def feed_audio():
            try:
                async for audio_chunk in audio_stream:
                    if is_connected:
                        await dg_connection.send(audio_chunk)
            except Exception as e:
                logger.error("Stream transcription error", error=str(e), session_id=session_id)
            finally:
                await dg_connection.finish()
        
        feed_task = asyncio.create_task(feed_audio())
        
        try:
            while True:
                item = await transcript_queue.get()
                if item is None:
                    break
                yield item
        finally:
            if not feed_task.done():
                feed_task.cancel()
                try:
                    await feed_task
                except asyncio.CancelledError:
                    pass
    
    async def transcribe_audio(
        self,
        audio_data: bytes,
        session_id: str,
        language: str = "en"
    ) -> Optional[TranscriptMessage]:
        """Transcribe complete audio buffer."""
        from deepgram import DeepgramClient, PrerecordedOptions
        
        try:
            dg_client = self.client
            options = PrerecordedOptions(
                model="nova-2",
                language=language,
                encoding="linear16",
                sample_rate=16000,
                smart_format=True
            )
            
            response = await dg_client.listen.rest.v("1").transcribe_file(
                audio_data, options
            )
            
            if response.results.channels:
                transcript = response.results.channels[0].alternatives[0]
                return TranscriptMessage(
                    session_id=session_id,
                    transcript=transcript.transcript,
                    confidence=transcript.confidence,
                    is_final=True,
                    language=language
                )
        except Exception as e:
            logger.error("Audio transcription failed", error=str(e), session_id=session_id)
        
        return None
    
    async def cleanup(self) -> None:
        """Cleanup Deepgram resources."""
        logger.info("Deepgram ASR cleaned up")


class WhisperASR(ASRProvider):
    """
    OpenAI Whisper ASR provider for local inference.
    
    Features:
    - Local processing (no API calls)
    - Multiple model sizes
    - GPU acceleration support
    """
    
    def __init__(self, model_name: str = "base"):
        self.model_name = model_name
        self.model = None
        
    async def initialize(self) -> None:
        """Load Whisper model."""
        try:
            import whisper
            self.model = whisper.load_model(self.model_name)
            logger.info("Whisper ASR initialized", model=self.model_name)
        except ImportError:
            logger.warning("Whisper not installed, using mock ASR")
            self.model = None
        except Exception as e:
            logger.error("Failed to initialize Whisper", error=str(e))
            self.model = None
    
    async def transcribe_stream(
        self,
        audio_stream: AsyncGenerator[bytes, None],
        session_id: str,
        language: str = "en"
    ) -> AsyncGenerator[TranscriptMessage, None]:
        """
        Transcribe audio stream using a sliding 30s window.

        Buffers accumulate across chunks for the lifetime of the stream, and
        any remainder is flushed when the stream ends so short utterances are
        never silently dropped. `language="auto"` lets Whisper detect the
        spoken language itself.
        """
        if not self.model:
            logger.warning("Whisper model not available, skipping transcription")
            return
            
        import numpy as np
        
        buffer = bytearray()
        window_bytes = 16000 * 2 * 30   # Whisper's native 30-second window
        overlap_bytes = 16000 * 2       # 1 second overlap between windows
        min_bytes = 1600                # ~0.05s — ignore crumbs

        async def transcribe_chunk(data: bytes):
            if len(data) < min_bytes:
                return
            audio_np = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0
            lang = None if language in (None, "", "auto") else language
            prompt = _whisper_prompt(language)
            try:
                result = await asyncio.to_thread(
                    self.model.transcribe,
                    audio_np,
                    language=lang,
                    initial_prompt=prompt,
                    fp16=False
                )
            except Exception as e:
                logger.error("Whisper transcription failed", session_id=session_id, error=str(e))
                return
            if result["text"].strip():
                yield TranscriptMessage(
                    session_id=session_id,
                    transcript=result["text"],
                    confidence=1.0,
                    is_final=True,
                    language=result.get("language", language)
                )
        
        async for chunk in audio_stream:
            if not chunk:
                continue
            buffer.extend(chunk)
            while len(buffer) >= window_bytes:
                window = bytes(buffer[:window_bytes])
                buffer = buffer[window_bytes - overlap_bytes:]
                async for transcript in transcribe_chunk(window):
                    yield transcript

        # End of stream: transcribe whatever is left
        if buffer:
            async for transcript in transcribe_chunk(bytes(buffer)):
                yield transcript
    
    async def transcribe_audio(
        self,
        audio_data: bytes,
        session_id: str,
        language: str = "en"
    ) -> Optional[TranscriptMessage]:
        """Transcribe complete audio buffer."""
        if not self.model:
            logger.warning("Whisper model not available, skipping transcription")
            return None
            
        import numpy as np
        
        try:
            audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
            
            result = self.model.transcribe(
                audio_np,
                language=language if language not in (None, "", "auto") else None,
                initial_prompt=_whisper_prompt(language),
                fp16=False
            )
            
            return TranscriptMessage(
                session_id=session_id,
                transcript=result["text"],
                confidence=1.0,
                is_final=True,
                language=result.get("language", language)
            )
        except Exception as e:
            logger.error("Whisper transcription failed", error=str(e))
            return None
    
    async def cleanup(self) -> None:
        """Cleanup Whisper resources."""
        self.model = None
        logger.info("Whisper ASR cleaned up")


def create_asr_provider(provider: str, **kwargs) -> ASRProvider:
    """Factory function to create ASR provider."""
    providers = {
        "deepgram": DeepgramASR,
        "whisper": WhisperASR
    }
    
    if provider not in providers:
        raise ValueError(f"Unknown ASR provider: {provider}")
    
    return providers[provider](**kwargs)
