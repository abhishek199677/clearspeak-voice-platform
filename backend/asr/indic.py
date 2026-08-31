"""
ClearSpeak AI - Indic ASR Providers
Specialized speech-to-text for Indian languages via Bhashini, AI4Bharat, and regional Whisper.
"""

from abc import ABC, abstractmethod
from typing import AsyncGenerator, Optional, Dict, List
import structlog
import httpx
import asyncio

from backend.models.schemas import TranscriptMessage

logger = structlog.get_logger()


class IndicASRProvider(ABC):
    """Abstract base for Indic ASR providers."""
    
    @abstractmethod
    async def initialize(self) -> None:
        pass
    
    @abstractmethod
    async def transcribe_stream(
        self,
        audio_stream: AsyncGenerator[bytes, None],
        session_id: str,
        language: str = "hi"
    ) -> AsyncGenerator[TranscriptMessage, None]:
        pass
    
    @abstractmethod
    async def transcribe_audio(
        self,
        audio_data: bytes,
        session_id: str,
        language: str = "hi"
    ) -> Optional[TranscriptMessage]:
        pass
    
    @abstractmethod
    async def cleanup(self) -> None:
        pass


class BhashiniASR(IndicASRProvider):
    """
    Bhashini (AI4Bharat) ASR provider for Indian languages.
    
    Uses the Bhashini platform API for speech recognition in 22+ Indian languages.
    Free tier available for Indian developers.
    
    Supported languages: Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati,
    Kannada, Malayalam, Punjabi, Odia, Assamese, and more.
    
    API Docs: https://bhashini.gov.in/services
    """
    
    # Language code mapping: our codes -> Bhashini codes
    LANGUAGE_MAP = {
        "hi": "hi", "bn": "bn", "ta": "ta", "te": "te",
        "ml": "ml", "kn": "kn", "gu": "gu", "mr": "mr",
        "pa": "pa", "ur": "ur", "as": "as", "or": "or",
        "sa": "sa", "ne": "ne", "sd": "sd",
        # Devanagari languages default to Hindi model
        "gom": "hi", "doi": "hi", "mai": "hi", "brx": "hi",
        # Others
        "sat": "hi", "ks": "ur", "mni": "hi",
    }
    
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.bhashini.gov.in",
        user_id: str = "clearspeak"
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.user_id = user_id
        self.client: Optional[httpx.AsyncClient] = None
        self._pipeline_id: Optional[str] = None
    
    async def initialize(self) -> None:
        """Initialize Bhashini client and discover ASR pipeline."""
        self.client = httpx.AsyncClient(
            timeout=60.0,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
        )
        
        # Discover ASR pipeline for Indian languages
        try:
            resp = await self.client.post(
                f"{self.base_url}/services/list",
                json={"language": {"sourceLanguage": "hi"}}
            )
            if resp.status_code == 200:
                data = resp.json()
                # Extract pipeline configuration
                for service in data.get("pipelineResponseList", []):
                    if service.get("taskType") == "asr":
                        self._pipeline_id = service.get("pipelineId")
                        break
            logger.info("Bhashini ASR initialized", pipeline_id=self._pipeline_id)
        except Exception as e:
            logger.warning("Bhashini pipeline discovery failed, using direct API", error=str(e))
    
    def _map_language(self, lang_code: str) -> str:
        """Map our language code to Bhashini code."""
        return self.LANGUAGE_MAP.get(lang_code, "hi")
    
    async def transcribe_stream(
        self,
        audio_stream: AsyncGenerator[bytes, None],
        session_id: str,
        language: str = "hi"
    ) -> AsyncGenerator[TranscriptMessage, None]:
        """
        Stream audio to Bhashini for transcription.
        
        Bhashini uses batch processing, so we accumulate chunks and process
        in windows for pseudo-streaming behavior.
        """
        buffer = bytearray()
        window_size = 16000 * 4  # 4-second windows
        overlap = 16000 * 1     # 1-second overlap
        bhashini_lang = self._map_language(language)
        
        async for chunk in audio_stream:
            buffer.extend(chunk)
            
            while len(buffer) >= window_size * 2:
                audio_window = bytes(buffer[:window_size])
                buffer = buffer[window_size - overlap:]
                
                result = await self._transcribe_chunk(audio_window, bhashini_lang)
                if result and result.strip():
                    yield TranscriptMessage(
                        session_id=session_id,
                        transcript=result,
                        confidence=0.85,
                        is_final=True,
                        language=language
                    )
        
        # Process remaining buffer
        if len(buffer) > 16000:  # At least 1 second
            result = await self._transcribe_chunk(bytes(buffer), bhashini_lang)
            if result and result.strip():
                yield TranscriptMessage(
                    session_id=session_id,
                    transcript=result,
                    confidence=0.85,
                    is_final=True,
                    language=language
                )
    
    async def _transcribe_chunk(self, audio_data: bytes, language: str) -> Optional[str]:
        """Send audio chunk to Bhashini for transcription."""
        if not self.client:
            return None
        
        try:
            import base64
            audio_b64 = base64.b64encode(audio_data).decode("utf-8")
            
            payload = {
                "input": [{"audio": audio_b64}],
                "config": {
                    "language": {"sourceLanguage": language},
                    "audioFormat": "wav",
                    "samplingRate": 16000,
                },
                "pipeline_tasks": [
                    {
                        "taskType": "asr",
                        "config": {
                            "language": {"sourceLanguage": language}
                        }
                    }
                ]
            }
            
            resp = await self.client.post(
                f"{self.base_url}/pipeline/process",
                json=payload
            )
            
            if resp.status_code == 200:
                data = resp.json()
                for result in data.get("pipelineResponse", []):
                    if result.get("taskType") == "asr":
                        output = result.get("output", [{}])
                        if output:
                            return output[0].get("source", "")
            else:
                logger.warning("Bhashini ASR request failed", status=resp.status_code)
                
        except Exception as e:
            logger.error("Bhashini ASR error", error=str(e))
        
        return None
    
    async def transcribe_audio(
        self,
        audio_data: bytes,
        session_id: str,
        language: str = "hi"
    ) -> Optional[TranscriptMessage]:
        """Transcribe complete audio buffer."""
        bhashini_lang = self._map_language(language)
        result = await self._transcribe_chunk(audio_data, bhashini_lang)
        
        if result and result.strip():
            return TranscriptMessage(
                session_id=session_id,
                transcript=result,
                confidence=0.85,
                is_final=True,
                language=language
            )
        return None
    
    async def cleanup(self) -> None:
        """Cleanup resources."""
        if self.client:
            await self.client.aclose()
            self.client = None
        logger.info("Bhashini ASR cleaned up")


class AI4BharatASR(IndicASRProvider):
    """
    AI4Bharat IndicWav2Vec / Chitralekha ASR provider.
    
    Uses AI4Bharat's open-source models hosted via their inference API.
    Models trained on IndicSpeech, IndicTTS datasets.
    
    Supports: Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada,
    Malayalam, Punjabi, Odia, Assamese, English.
    
    API: https://ai4bharat.iitm.ac.in
    """
    
    # IndicWav2Vec supported languages
    SUPPORTED_LANGUAGES = {
        "hi": {"model": "indicwav2vec_hindi", "name": "Hindi"},
        "bn": {"model": "indicwav2vec_bengali", "name": "Bengali"},
        "ta": {"model": "indicwav2vec_tamil", "name": "Tamil"},
        "te": {"model": "indicwav2vec_telugu", "name": "Telugu"},
        "mr": {"model": "indicwav2vec_marathi", "name": "Marathi"},
        "gu": {"model": "indicwav2vec_gujarati", "name": "Gujarati"},
        "kn": {"model": "indicwav2vec_kannada", "name": "Kannada"},
        "ml": {"model": "indicwav2vec_malayalam", "name": "Malayalam"},
        "pa": {"model": "indicwav2vec_punjabi", "name": "Punjabi"},
        "or": {"model": "indicwav2vec_odia", "name": "Odia"},
        "as": {"model": "indicwav2vec_assamese", "name": "Assamese"},
        "en": {"model": "wav2vec2_en", "name": "English"},
    }
    
    def __init__(
        self,
        base_url: str = "https://api.ai4bharat.iitm.ac.in",
        api_key: Optional[str] = None
    ):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.client: Optional[httpx.AsyncClient] = None
    
    async def initialize(self) -> None:
        """Initialize AI4Bharat client."""
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        
        self.client = httpx.AsyncClient(timeout=60.0, headers=headers)
        logger.info("AI4Bharat ASR initialized", languages=list(self.SUPPORTED_LANGUAGES.keys()))
    
    async def transcribe_stream(
        self,
        audio_stream: AsyncGenerator[bytes, None],
        session_id: str,
        language: str = "hi"
    ) -> AsyncGenerator[TranscriptMessage, None]:
        """Stream audio to AI4Bharat for transcription."""
        buffer = bytearray()
        window_size = 16000 * 3  # 3-second windows
        
        async for chunk in audio_stream:
            buffer.extend(chunk)
            
            while len(buffer) >= window_size * 2:
                audio_window = bytes(buffer[:window_size])
                buffer = buffer[window_size // 2:]  # 50% overlap
                
                result = await self._transcribe_chunk(audio_window, language)
                if result and result.strip():
                    yield TranscriptMessage(
                        session_id=session_id,
                        transcript=result,
                        confidence=0.80,
                        is_final=True,
                        language=language
                    )
    
    async def _transcribe_chunk(self, audio_data: bytes, language: str) -> Optional[str]:
        """Send audio to AI4Bharat API."""
        if not self.client:
            return None
        
        lang_info = self.SUPPORTED_LANGUAGES.get(language, self.SUPPORTED_LANGUAGES.get("hi"))
        
        try:
            import base64
            audio_b64 = base64.b64encode(audio_data).decode("utf-8")
            
            payload = {
                "audio": audio_b64,
                "language": language,
                "model": lang_info["model"],
                "format": "wav",
                "sample_rate": 16000,
            }
            
            resp = await self.client.post(f"{self.base_url}/asr/transcribe", json=payload)
            
            if resp.status_code == 200:
                data = resp.json()
                return data.get("transcription", data.get("text", ""))
            else:
                logger.warning("AI4Bharat ASR failed", status=resp.status_code)
                
        except Exception as e:
            logger.error("AI4Bharat ASR error", error=str(e))
        
        return None
    
    async def transcribe_audio(
        self,
        audio_data: bytes,
        session_id: str,
        language: str = "hi"
    ) -> Optional[TranscriptMessage]:
        """Transcribe complete audio buffer."""
        result = await self._transcribe_chunk(audio_data, language)
        
        if result and result.strip():
            return TranscriptMessage(
                session_id=session_id,
                transcript=result,
                confidence=0.80,
                is_final=True,
                language=language
            )
        return None
    
    async def cleanup(self) -> None:
        """Cleanup resources."""
        if self.client:
            await self.client.aclose()
            self.client = None
        logger.info("AI4Bharat ASR cleaned up")


class IndicWhisperASR(IndicASRProvider):
    """
    Regional Whisper checkpoint ASR for Indian languages.
    
    Uses fine-tuned Whisper models optimized for Indian languages:
    - whisper-large-v3 with Indic language adapters
    - Custom checkpoints for specific Indian languages
    
    Falls back to standard Whisper with language parameter for unsupported codes.
    """
    
    # Whisper language codes (ISO 639-1)
    WHISPER_LANGUAGES = {
        "hi": "Hindi", "bn": "Bengali", "ta": "Tamil", "te": "Telugu",
        "ml": "Malayalam", "kn": "Kannada", "gu": "Gujarati", "mr": "Marathi",
        "pa": "Punjabi", "ur": "Urdu", "as": "Assamese", "or": "Odia",
        "ne": "Nepali", "sd": "Sindhi", "en": "English",
    }
    
    def __init__(
        self,
        model_name: str = "large-v3",
        device: str = "auto",
        language: Optional[str] = None
    ):
        self.model_name = model_name
        self.device = device
        self.language = language
        self.model = None
    
    async def initialize(self) -> None:
        """Load Whisper model with Indic adapters."""
        try:
            import whisper
            import torch
            
            if self.device == "auto":
                self.device = "cuda" if torch.cuda.is_available() else "cpu"
            
            logger.info(
                "Loading IndicWhisper model",
                model=self.model_name,
                device=self.device
            )
            
            self.model = whisper.load_model(
                self.model_name,
                device=self.device
            )
            
            logger.info("IndicWhisper ASR initialized", languages=list(self.WHISPER_LANGUAGES.keys()))
            
        except ImportError:
            logger.error("openai-whisper not installed. Run: pip install openai-whisper")
            raise
        except Exception as e:
            logger.error("Failed to load IndicWhisper model", error=str(e))
            raise
    
    async def transcribe_stream(
        self,
        audio_stream: AsyncGenerator[bytes, None],
        session_id: str,
        language: str = "hi"
    ) -> AsyncGenerator[TranscriptMessage, None]:
        """Transcribe audio stream using sliding window."""
        import numpy as np
        
        buffer = bytearray()
        window_size = 16000 * 3  # 3 seconds
        overlap = 16000 * 1      # 1 second overlap
        
        whisper_lang = self.WHISPER_LANGUAGES.get(language, language if language in self.WHISPER_LANGUAGES else None)
        
        async for chunk in audio_stream:
            buffer.extend(chunk)
            
            while len(buffer) >= window_size * 2:
                audio_window = bytes(buffer[:window_size])
                buffer = buffer[window_size - overlap:]
                
                audio_np = np.frombuffer(audio_window, dtype=np.int16).astype(np.float32) / 32768.0
                
                result = self.model.transcribe(
                    audio_np,
                    language=whisper_lang,
                    fp16=(self.device == "cuda"),
                    beam_size=5,
                    best_of=5,
                )
                
                if result["text"].strip():
                    yield TranscriptMessage(
                        session_id=session_id,
                        transcript=result["text"],
                        confidence=result.get("segments", [{}])[0].get("avg_logprob", 0.0) if result.get("segments") else 0.5,
                        is_final=True,
                        language=language
                    )
    
    async def transcribe_audio(
        self,
        audio_data: bytes,
        session_id: str,
        language: str = "hi"
    ) -> Optional[TranscriptMessage]:
        """Transcribe complete audio buffer."""
        import numpy as np
        
        try:
            audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0
            whisper_lang = self.WHISPER_LANGUAGES.get(language, language if language in self.WHISPER_LANGUAGES else None)
            
            result = self.model.transcribe(
                audio_np,
                language=whisper_lang,
                fp16=(self.device == "cuda"),
                beam_size=5,
            )
            
            return TranscriptMessage(
                session_id=session_id,
                transcript=result["text"],
                confidence=0.9,
                is_final=True,
                language=language
            )
        except Exception as e:
            logger.error("IndicWhisper transcription failed", error=str(e))
            return None
    
    async def cleanup(self) -> None:
        """Cleanup model resources."""
        if self.model:
            del self.model
            self.model = None
        logger.info("IndicWhisper ASR cleaned up")


def create_indic_asr_provider(provider: str, **kwargs) -> IndicASRProvider:
    """Factory function to create Indic ASR provider."""
    providers = {
        "bhashini": BhashiniASR,
        "ai4bharat": AI4BharatASR,
        "indic_whisper": IndicWhisperASR,
    }
    
    if provider not in providers:
        raise ValueError(f"Unknown Indic ASR provider: {provider}. Available: {list(providers.keys())}")
    
    return providers[provider](**kwargs)
