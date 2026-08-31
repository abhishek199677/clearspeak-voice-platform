"""
Voice AI Platform - TTS (Text-to-Speech) Providers
Abstract base class and implementations for text-to-speech services.
"""

from abc import ABC, abstractmethod
from typing import AsyncGenerator, Optional
import structlog

logger = structlog.get_logger()


class TTSProvider(ABC):
    """Abstract base class for TTS providers."""
    
    @abstractmethod
    async def initialize(self) -> None:
        """Initialize the TTS provider."""
        pass
    
    @abstractmethod
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "en"
    ) -> AsyncGenerator[bytes, None]:
        """
        Synthesize text to audio stream.
        
        Args:
            text: Text to synthesize
            voice_id: Voice identifier
            language: Language code
            
        Yields:
            Audio chunks as bytes
        """
        pass
    
    @abstractmethod
    async def get_voices(self) -> list[dict]:
        """Get available voices."""
        pass
    
    @abstractmethod
    async def cleanup(self) -> None:
        """Cleanup provider resources."""
        pass


class ElevenLabsTTS(TTSProvider):
    """
    ElevenLabs TTS provider with streaming support.
    
    Features:
    - High-quality neural voices
    - Streaming audio output
    - Voice cloning support
    - Multiple languages
    """
    
    def __init__(self, api_key: str, voice_id: str = "21m00Tcm4TlvDq8ikWAM"):
        self.api_key = api_key
        self.default_voice_id = voice_id
        self.client = None
        
    async def initialize(self) -> None:
        """Initialize ElevenLabs client."""
        try:
            from elevenlabs.client import AsyncElevenLabs
            self.client = AsyncElevenLabs(api_key=self.api_key)
            logger.info("ElevenLabs TTS initialized")
        except ImportError:
            logger.error("ElevenLabs SDK not installed")
            raise
        except Exception as e:
            logger.error("Failed to initialize ElevenLabs", error=str(e))
            raise
    
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "en"
    ) -> AsyncGenerator[bytes, None]:
        """Stream text-to-speech audio."""
        voice = voice_id or self.default_voice_id
        
        try:
            # Use streaming TTS
            audio_stream = await self.client.generate(
                text=text,
                voice=voice,
                model="eleven_turbo_v2",
                stream=True
            )
            
            async for chunk in audio_stream:
                if chunk:
                    yield chunk
                    
        except Exception as e:
            logger.error("TTS synthesis failed", error=str(e), voice_id=voice)
            raise
    
    async def synthesize_chunked(
        self,
        text: str,
        chunk_size: int = 1024,
        voice_id: Optional[str] = None,
        language: str = "en"
    ) -> AsyncGenerator[bytes, None]:
        """Synthesize text in chunks for long content."""
        # Split text into sentences
        sentences = text.replace('!', '!|').replace('.', '.|').split('|')
        
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence:
                async for chunk in self.synthesize(sentence, voice_id, language):
                    yield chunk
    
    async def get_voices(self) -> list[dict]:
        """Get available ElevenLabs voices."""
        try:
            voices = await self.client.voices.get_all()
            return [
                {
                    "voice_id": voice.voice_id,
                    "name": voice.name,
                    "category": voice.category,
                    "labels": voice.labels
                }
                for voice in voices.voices
            ]
        except Exception as e:
            logger.error("Failed to get voices", error=str(e))
            return []
    
    async def cleanup(self) -> None:
        """Cleanup ElevenLabs resources."""
        self.client = None
        logger.info("ElevenLabs TTS cleaned up")


class AzureTTS(TTSProvider):
    """
    Azure Cognitive Services TTS provider.
    
    Features:
    - Enterprise-grade reliability
    - Multiple neural voices
    - SSML support
    - Low latency streaming
    """
    
    def __init__(self, subscription_key: str, region: str = "eastus"):
        self.subscription_key = subscription_key
        self.region = region
        self.synthesizer = None
        
    async def initialize(self) -> None:
        """Initialize Azure TTS client."""
        try:
            import azure.cognitiveservices.speech as speechsdk
            
            self.synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=speechsdk.SpeechConfig(
                    subscription=self.subscription_key,
                    region=self.region
                )
            )
            logger.info("Azure TTS initialized")
        except ImportError:
            logger.error("Azure Speech SDK not installed")
            raise
        except Exception as e:
            logger.error("Failed to initialize Azure TTS", error=str(e))
            raise
    
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "en"
    ) -> AsyncGenerator[bytes, None]:
        """Synthesize text using Azure TTS."""
        import asyncio
        
        voice_name = voice_id or "en-US-JennyNeural"
        
        ssml = f"""
        <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='{language}'>
            <voice name='{voice_name}'>
                {text}
            </voice>
        </speak>
        """
        
        try:
            # Run synthesis in thread pool
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                lambda: self.synthesizer.speak_ssml(ssml)
            )
            
            # Stream audio data
            audio_data = result.audio_data
            chunk_size = 4096
            
            for i in range(0, len(audio_data), chunk_size):
                yield audio_data[i:i + chunk_size]
                
        except Exception as e:
            logger.error("Azure TTS synthesis failed", error=str(e))
            raise
    
    async def get_voices(self) -> list[dict]:
        """Get available Azure voices."""
        # Azure voices are typically configured via SSML
        # Return common neural voices
        return [
            {"voice_id": "en-US-JennyNeural", "name": "Jenny", "language": "en-US"},
            {"voice_id": "en-US-GuyNeural", "name": "Guy", "language": "en-US"},
            {"voice_id": "en-US-AriaNeural", "name": "Aria", "language": "en-US"},
            {"voice_id": "en-GB-SoniaNeural", "name": "Sonia", "language": "en-GB"},
            {"voice_id": "en-IN-PrabhatNeural", "name": "Prabhat", "language": "en-IN"},
        ]
    
    async def cleanup(self) -> None:
        """Cleanup Azure TTS resources."""
        self.synthesizer = None
        logger.info("Azure TTS cleaned up")


class MockTTS(TTSProvider):
    """
    Mock TTS provider for testing.
    Generates silent audio with proper timing.
    """
    
    def __init__(self, sample_rate: int = 24000):
        self.sample_rate = sample_rate
        
    async def initialize(self) -> None:
        """No initialization needed."""
        pass
    
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "en"
    ) -> AsyncGenerator[bytes, None]:
        """Generate mock audio."""
        import asyncio
        
        # Calculate approximate duration based on text length
        word_count = len(text.split())
        duration_seconds = word_count * 0.5  # Assume 0.5s per word
        
        # Generate silence
        num_samples = int(self.sample_rate * duration_seconds)
        chunk_size = 4096
        
        for i in range(0, num_samples, chunk_size):
            chunk_samples = min(chunk_size, num_samples - i)
            # Generate silent PCM audio
            yield b'\x00' * (chunk_samples * 2)  # 16-bit audio
            await asyncio.sleep(0.01)  # Simulate streaming delay
    
    async def get_voices(self) -> list[dict]:
        """Get mock voices."""
        return [
            {"voice_id": "mock-voice", "name": "Mock Voice", "language": "en"}
        ]
    
    async def cleanup(self) -> None:
        """No cleanup needed."""
        pass


class EdgeTTS(TTSProvider):
    """
    Microsoft Edge TTS provider - FREE, no API key needed.
    
    Features:
    - High-quality neural voices (same as Azure)
    - Streaming audio output
    - Multiple languages and voices
    - Completely free, no rate limits
    """
    
    def __init__(self, voice: str = "en-US-AvaNeural"):
        self.voice = voice
        self.client = None
        
    async def initialize(self) -> None:
        """Initialize Edge TTS client."""
        try:
            import edge_tts
            self.client = edge_tts
            logger.info("Edge TTS initialized", voice=self.voice)
        except ImportError:
            logger.error("edge-tts not installed. Run: pip install edge-tts")
            raise
    
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "en"
    ) -> AsyncGenerator[bytes, None]:
        """Stream text-to-speech audio using Edge TTS."""
        voice = voice_id or self.voice
        
        try:
            communicate = self.client.Communicate(text, voice)
            
            # Collect all audio data
            audio_data = b""
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_data += chunk["data"]
            
            if not audio_data:
                logger.error("Edge TTS returned no audio data")
                return
            
            # Yield in chunks for streaming
            chunk_size = 4096
            for i in range(0, len(audio_data), chunk_size):
                yield audio_data[i:i + chunk_size]
                    
        except Exception as e:
            logger.error("Edge TTS synthesis failed", error=str(e), voice=voice)
            raise
    
    async def get_voices(self) -> list[dict]:
        """Get available Edge TTS voices."""
        try:
            voices = await self.client.list_voices()
            return [
                {
                    "voice_id": v["ShortName"],
                    "name": v["FriendlyName"],
                    "language": v["Locale"],
                    "gender": v["Gender"]
                }
                for v in voices
                if v["Locale"].startswith("en")
            ]
        except Exception as e:
            logger.error("Failed to get Edge TTS voices", error=str(e))
            return [{"voice_id": self.voice, "name": self.voice, "language": "en"}]
    
    async def cleanup(self) -> None:
        """No cleanup needed."""
        self.client = None
        logger.info("Edge TTS cleaned up")


class CoquiTTS(TTSProvider):
    """
    Coqui TTS provider with voice cloning support - FREE, open source.
    
    Features:
    - Voice cloning from short audio sample (6-30 seconds)
    - XTTS v2 model for high-quality synthesis
    - Runs locally, no API key needed
    - Multi-language support
    """
    
    def __init__(self, model_name: str = "tts_models/multilingual/multi-dataset/xtts_v2"):
        self.model_name = model_name
        self.model = None
        
    async def initialize(self) -> None:
        """Initialize Coqui TTS model."""
        try:
            from TTS.api import TTS
            import torch
            import os
            
            # Accept CPML license automatically
            os.environ["COQUI_TOS_AGREED"] = "1"
            
            # Use GPU if available
            device = "cuda" if torch.cuda.is_available() else "cpu"
            
            logger.info("Loading Coqui TTS model", model=self.model_name, device=device)
            self.model = TTS(self.model_name).to(device)
            logger.info("Coqui TTS initialized")
        except ImportError:
            logger.error("TTS not installed. Run: pip install TTS")
            raise
        except Exception as e:
            logger.error("Failed to initialize Coqui TTS", error=str(e))
            raise
    
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "en"
    ) -> AsyncGenerator[bytes, None]:
        """
        Synthesize text to audio. If voice_id is a file path, use it for voice cloning.
        
        Args:
            text: Text to synthesize
            voice_id: Path to reference audio file for cloning, or None for default voice
            language: Language code (en, es, fr, de, it, pt, pl, tr, ru, nl, cs, ar, zh, ja, ko, hu, hi)
        """
        import tempfile
        import os
        
        tmp_path = None
        try:
            # Create temp output file (tts_to_file needs a file path, not BytesIO)
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
                tmp_path = tmp.name
            
            if voice_id and voice_id.endswith(('.wav', '.mp3', '.flac', '.ogg')):
                # Voice cloning mode - use reference audio
                logger.info("Cloning voice from reference", reference=voice_id)
                self.model.tts_to_file(
                    text=text,
                    file_path=tmp_path,
                    speaker_wav=voice_id,
                    language=language
                )
            else:
                # Default voice synthesis
                self.model.tts_to_file(
                    text=text,
                    file_path=tmp_path,
                    speaker=voice_id
                )
            
            # Read the generated audio file
            with open(tmp_path, 'rb') as f:
                audio_bytes = f.read()
            
            if len(audio_bytes) == 0:
                logger.error("Coqui TTS generated empty audio")
                raise ValueError("TTS model generated empty audio data")
            
            # Yield in chunks for streaming
            chunk_size = 4096
            for i in range(0, len(audio_bytes), chunk_size):
                yield audio_bytes[i:i + chunk_size]
                
        except Exception as e:
            logger.error("Coqui TTS synthesis failed", error=str(e))
            raise
        finally:
            if tmp_path and os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    async def synthesize_with_clone(
        self,
        text: str,
        reference_audio_path: str,
        language: str = "en"
    ) -> AsyncGenerator[bytes, None]:
        """
        Synthesize text with voice cloning from a reference audio file.
        
        Args:
            text: Text to synthesize
            reference_audio_path: Path to reference audio file (6-30 seconds of speech)
            language: Language code
        """
        async for chunk in self.synthesize(text, voice_id=reference_audio_path, language=language):
            yield chunk
    
    async def get_voices(self) -> list[dict]:
        """Get available voices/languages."""
        languages = [
            {"voice_id": "en", "name": "English", "language": "en"},
            {"voice_id": "es", "name": "Spanish", "language": "es"},
            {"voice_id": "fr", "name": "French", "language": "fr"},
            {"voice_id": "de", "name": "German", "language": "de"},
            {"voice_id": "it", "name": "Italian", "language": "it"},
            {"voice_id": "pt", "name": "Portuguese", "language": "pt"},
            {"voice_id": "pl", "name": "Polish", "language": "pl"},
            {"voice_id": "tr", "name": "Turkish", "language": "tr"},
            {"voice_id": "ru", "name": "Russian", "language": "ru"},
            {"voice_id": "nl", "name": "Dutch", "language": "nl"},
            {"voice_id": "zh", "name": "Chinese", "language": "zh"},
            {"voice_id": "ja", "name": "Japanese", "language": "ja"},
            {"voice_id": "ko", "name": "Korean", "language": "ko"},
        ]
        return languages
    
    async def cleanup(self) -> None:
        """Cleanup Coqui TTS resources."""
        if self.model:
            del self.model
            self.model = None
        logger.info("Coqui TTS cleaned up")


class VoiceboxTTS(TTSProvider):
    """
    Voicebox TTS provider - FREE, local voice cloning + synthesis.
    
    Features:
    - Zero-shot voice cloning from 3s audio
    - 7 TTS engines (Qwen3-TTS, Chatterbox, Kokoro, etc.)
    - 23 languages
    - Local-first, no API key needed
    - REST API for integration
    """
    
    def __init__(self, base_url: str = "http://localhost:3333"):
        self.base_url = base_url
        self.client = None
        
    async def initialize(self) -> None:
        """Initialize Voicebox client."""
        try:
            import httpx
            self.client = httpx.AsyncClient(base_url=self.base_url, timeout=60.0)
            # Test connection
            resp = await self.client.get("/api/health")
            if resp.status_code == 200:
                logger.info("Voicebox TTS initialized", url=self.base_url)
            else:
                logger.warning("Voicebox may not be running", url=self.base_url)
        except ImportError:
            logger.error("httpx not installed. Run: pip install httpx")
            raise
        except Exception as e:
            logger.warning("Voicebox connection failed (app may not be running)", error=str(e))
    
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "en"
    ) -> AsyncGenerator[bytes, None]:
        """Stream text-to-speech audio using Voicebox."""
        try:
            resp = await self.client.post(
                "/api/tts",
                json={
                    "text": text,
                    "voice_id": voice_id,
                    "language": language,
                },
            )
            resp.raise_for_status()
            
            # Stream audio in chunks
            chunk_size = 4096
            audio_data = resp.content
            for i in range(0, len(audio_data), chunk_size):
                yield audio_data[i:i + chunk_size]
                
        except Exception as e:
            logger.error("Voicebox TTS synthesis failed", error=str(e))
            raise
    
    async def get_voices(self) -> list[dict]:
        """Get available Voicebox voices."""
        try:
            resp = await self.client.get("/api/voices")
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            logger.error("Failed to get Voicebox voices", error=str(e))
            return []
    
    async def cleanup(self) -> None:
        """Cleanup Voicebox resources."""
        if self.client:
            await self.client.aclose()
        logger.info("Voicebox TTS cleaned up")


class VoiceStudioTTS(TTSProvider):
    """
    VoiceStudio TTS provider - FREE, 646 languages, 16 TTS engines.
    
    Features:
    - Voice cloning (3s reference)
    - Video dubbing
    - 646 TTS languages
    - 16 TTS engines (Chatterbox, Qwen3-TTS, Kokoro, etc.)
    - 11 ASR engines
    - Local-first, no API key needed
    """
    
    def __init__(self, base_url: str = "http://localhost:3900"):
        self.base_url = base_url
        self.client = None
        
    async def initialize(self) -> None:
        """Initialize VoiceStudio client."""
        try:
            import httpx
            self.client = httpx.AsyncClient(base_url=self.base_url, timeout=60.0)
            # Test connection
            resp = await self.client.get("/api/health")
            if resp.status_code == 200:
                logger.info("VoiceStudio TTS initialized", url=self.base_url)
            else:
                logger.warning("VoiceStudio may not be running", url=self.base_url)
        except Exception as e:
            logger.warning("VoiceStudio connection failed (app may not be running)", error=str(e))
    
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "en"
    ) -> AsyncGenerator[bytes, None]:
        """Stream text-to-speech audio using VoiceStudio."""
        try:
            resp = await self.client.post(
                "/api/tts",
                json={
                    "text": text,
                    "voice_id": voice_id,
                    "language": language,
                    "engine": "chatterbox",
                },
            )
            resp.raise_for_status()
            
            chunk_size = 4096
            audio_data = resp.content
            for i in range(0, len(audio_data), chunk_size):
                yield audio_data[i:i + chunk_size]
                
        except Exception as e:
            logger.error("VoiceStudio TTS synthesis failed", error=str(e))
            raise
    
    async def get_voices(self) -> list[dict]:
        """Get available VoiceStudio voices."""
        try:
            resp = await self.client.get("/api/voices")
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            logger.error("Failed to get VoiceStudio voices", error=str(e))
            return []
    
    async def cleanup(self) -> None:
        """Cleanup VoiceStudio resources."""
        if self.client:
            await self.client.aclose()
        logger.info("VoiceStudio TTS cleaned up")


def create_tts_provider(provider: str, **kwargs) -> TTSProvider:
    """Factory function to create TTS provider."""
    providers = {
        "elevenlabs": ElevenLabsTTS,
        "azure": AzureTTS,
        "edge": EdgeTTS,
        "coqui": CoquiTTS,
        "voicebox": VoiceboxTTS,
        "voicestudio": VoiceStudioTTS,
        "mock": MockTTS
    }
    
    if provider not in providers:
        raise ValueError(f"Unknown TTS provider: {provider}")
    
    return providers[provider](**kwargs)
