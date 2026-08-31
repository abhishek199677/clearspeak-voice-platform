"""
ClearSpeak AI - Indic TTS Providers
Text-to-speech for Indian languages via Azure Neural Voices and Bhashini.
"""

from abc import ABC, abstractmethod
from typing import AsyncGenerator, Optional, Dict, List
import structlog
import httpx
import asyncio

logger = structlog.get_logger()


class IndicTTSProvider(ABC):
    """Abstract base for Indic TTS providers."""
    
    @abstractmethod
    async def initialize(self) -> None:
        pass
    
    @abstractmethod
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "hi"
    ) -> AsyncGenerator[bytes, None]:
        pass
    
    @abstractmethod
    async def get_voices(self, language: Optional[str] = None) -> List[dict]:
        pass
    
    @abstractmethod
    async def cleanup(self) -> None:
        pass


class AzureIndicTTS(IndicTTSProvider):
    """
    Azure Cognitive Services TTS with Indian neural voices.
    
    Provides high-quality neural voices for all major Indian languages.
    Supports SSML for pronunciation control and prosody adjustment.
    
    Indian Neural Voices Available:
    - Hindi: IN-NeerjaNeural (F), IN-PrabhatNeural (M)
    - Tamil: IN-PallaviNeural (F)
    - Telugu: IN-ShrutiNeural (F)
    - Bengali: IN-TanishaaNeural (F)
    - Marathi: IN-AarohiNeural (F)
    - Gujarati: IN-DhwaniNeural (F)
    - Kannada: IN-SapnaNeural (F)
    - Malayalam: IN-SobhanaNeural (F)
    - Punjabi: IN-GurpreetNeural (F/M)
    - Urdu: PK-SalmaNeural (F), PK-AsadNeural (M)
    - English (India): IN-PrabhatNeural (M)
    """
    
    # Language -> Voice mapping
    INDIC_VOICES = {
        "hi": {
            "female": "hi-IN-NeerjaNeural",
            "male": "hi-IN-PrabhatNeural",
            "default": "hi-IN-NeerjaNeural",
        },
        "bn": {
            "female": "bn-IN-TanishaaNeural",
            "male": "bn-IN-BashkarNeural",
            "default": "bn-IN-TanishaaNeural",
        },
        "ta": {
            "female": "ta-IN-PallaviNeural",
            "male": "ta-IN-ValluvarNeural",
            "default": "ta-IN-PallaviNeural",
        },
        "te": {
            "female": "te-IN-ShrutiNeural",
            "male": "te-IN-MohanNeural",
            "default": "te-IN-ShrutiNeural",
        },
        "ml": {
            "female": "ml-IN-SobhanaNeural",
            "male": "ml-IN-MidhunNeural",
            "default": "ml-IN-SobhanaNeural",
        },
        "kn": {
            "female": "kn-IN-SapnaNeural",
            "male": "kn-IN-GaganNeural",
            "default": "kn-IN-SapnaNeural",
        },
        "gu": {
            "female": "gu-IN-DhwaniNeural",
            "male": "gu-IN-NiranjanNeural",
            "default": "gu-IN-DhwaniNeural",
        },
        "mr": {
            "female": "mr-IN-AarohiNeural",
            "male": "mr-IN-ManoharNeural",
            "default": "mr-IN-AarohiNeural",
        },
        "pa": {
            "female": "pa-IN-GurpreetNeural",
            "male": "pa-IN-GurpreetNeural",
            "default": "pa-IN-GurpreetNeural",
        },
        "ur": {
            "female": "ur-PK-SalmaNeural",
            "male": "ur-PK-AsadNeural",
            "default": "ur-PK-SalmaNeural",
        },
        "en": {
            "female": "en-IN-NeerjaNeural",
            "male": "en-IN-PrabhatNeural",
            "default": "en-IN-NeerjaNeural",
        },
    }
    
    # Language code for SSML
    SSML_LANG = {
        "hi": "hi-IN", "bn": "bn-IN", "ta": "ta-IN", "te": "te-IN",
        "ml": "ml-IN", "kn": "kn-IN", "gu": "gu-IN", "mr": "mr-IN",
        "pa": "pa-IN", "ur": "ur-PK", "en": "en-IN",
    }
    
    def __init__(
        self,
        subscription_key: str,
        region: str = "centralindia",
        gender: str = "female"
    ):
        self.subscription_key = subscription_key
        self.region = region
        self.gender = gender
        self.synthesizer = None
        self.client: Optional[httpx.AsyncClient] = None
    
    async def initialize(self) -> None:
        """Initialize Azure TTS client."""
        try:
            import azure.cognitiveservices.speech as speechsdk
            
            speech_config = speechsdk.SpeechConfig(
                subscription=self.subscription_key,
                region=self.region
            )
            
            # Set output format for streaming
            speech_config.set_speech_synthesis_output_format(
                speechsdk.SpeechSynthesisOutputFormat.Audio24Khz16BitMonoPcm
            )
            
            self.synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=speech_config
            )
            
            # Also create HTTP client for REST API fallback
            self.client = httpx.AsyncClient(timeout=30.0)
            
            logger.info("Azure Indic TTS initialized", region=self.region)
            
        except ImportError:
            logger.error("Azure Speech SDK not installed. Run: pip install azure-cognitiveservices-speech")
            raise
        except Exception as e:
            logger.error("Failed to initialize Azure Indic TTS", error=str(e))
            raise
    
    def _get_voice(self, language: str, voice_id: Optional[str] = None) -> str:
        """Get voice name for language."""
        if voice_id:
            return voice_id
        
        lang_voices = self.INDIC_VOICES.get(language, self.INDIC_VOICES.get("en", {}))
        return lang_voices.get(self.gender, lang_voices.get("default", "en-IN-NeerjaNeural"))
    
    def _build_ssml(self, text: str, voice: str, language: str) -> str:
        """Build SSML for synthesis."""
        lang = self.SSML_LANG.get(language, "en-IN")
        
        return f"""<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='{lang}'>
            <voice name='{voice}'>
                {text}
            </voice>
        </speak>"""
    
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "hi"
    ) -> AsyncGenerator[bytes, None]:
        """
        Synthesize text to audio stream.
        
        Uses Azure Speech SDK for real-time streaming.
        """
        voice = self._get_voice(language, voice_id)
        ssml = self._build_ssml(text, voice, language)
        
        try:
            # Run synthesis in thread pool (Azure SDK is synchronous)
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                lambda: self.synthesizer.speak_ssml(ssml)
            )
            
            if result.reason.name == "SynthesizingAudioCompleted":
                # Stream audio in chunks
                audio_data = result.audio_data
                chunk_size = 4096
                
                for i in range(0, len(audio_data), chunk_size):
                    yield audio_data[i:i + chunk_size]
            else:
                logger.error("Azure TTS synthesis failed", reason=result.reason)
                
        except Exception as e:
            logger.error("Azure Indic TTS error", error=str(e), voice=voice)
            raise
    
    async def get_voices(self, language: Optional[str] = None) -> List[dict]:
        """Get available Indian voices."""
        voices = []
        
        for lang, lang_voices in self.INDIC_VOICES.items():
            if language and lang != language:
                continue
            
            for gender_key, voice_id in lang_voices.items():
                if gender_key == "default":
                    continue
                voices.append({
                    "voice_id": voice_id,
                    "language": lang,
                    "gender": gender_key,
                    "name": voice_id.split("-")[-1].replace("Neural", ""),
                })
        
        return voices
    
    async def cleanup(self) -> None:
        """Cleanup resources."""
        self.synthesizer = None
        if self.client:
            await self.client.aclose()
            self.client = None
        logger.info("Azure Indic TTS cleaned up")


class BhashiniTTS(IndicTTSProvider):
    """
    Bhashini TTS for Indian languages.
    
    Uses Bhashini's neural TTS for official Indian languages.
    Free tier available for Indian developers.
    
    API: https://bhashini.gov.in/services
    """
    
    LANGUAGE_MAP = {
        "hi": "hi", "bn": "bn", "ta": "ta", "te": "te",
        "ml": "ml", "kn": "kn", "gu": "gu", "mr": "mr",
        "pa": "pa", "ur": "ur", "as": "as", "or": "or",
        "en": "en",
    }
    
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.bhashini.gov.in",
        voice_gender: str = "female"
    ):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.voice_gender = voice_gender
        self.client: Optional[httpx.AsyncClient] = None
    
    async def initialize(self) -> None:
        """Initialize Bhashini TTS client."""
        self.client = httpx.AsyncClient(
            timeout=60.0,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
        )
        logger.info("Bhashini TTS initialized")
    
    def _map_lang(self, lang_code: str) -> str:
        return self.LANGUAGE_MAP.get(lang_code, "hi")
    
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "hi"
    ) -> AsyncGenerator[bytes, None]:
        """Synthesize text using Bhashini TTS."""
        if not self.client:
            logger.warning("Bhashini TTS client not initialized")
            return
        
        bhashini_lang = self._map_lang(language)
        
        try:
            payload = {
                "input": [{"source": text}],
                "config": {
                    "language": {"sourceLanguage": bhashini_lang},
                    "gender": self.voice_gender,
                },
                "pipeline_tasks": [
                    {
                        "taskType": "tts",
                        "config": {
                            "language": {"sourceLanguage": bhashini_lang},
                            "gender": self.voice_gender,
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
                import base64
                
                for result in data.get("pipelineResponse", []):
                    if result.get("taskType") == "tts":
                        output = result.get("output", [])
                        if output:
                            audio_b64 = output[0].get("audio", "")
                            if audio_b64:
                                audio_data = base64.b64decode(audio_b64)
                                # Stream in chunks
                                chunk_size = 4096
                                for i in range(0, len(audio_data), chunk_size):
                                    yield audio_data[i:i + chunk_size]
            else:
                logger.warning("Bhashini TTS failed", status=resp.status_code)
                
        except Exception as e:
            logger.error("Bhashini TTS error", error=str(e))
    
    async def get_voices(self, language: Optional[str] = None) -> List[dict]:
        """Get available Bhashini voices."""
        return [
            {"voice_id": f"bhashini-{lang}-female", "language": lang, "gender": "female"}
            for lang in self.LANGUAGE_MAP.keys()
        ]
    
    async def cleanup(self) -> None:
        """Cleanup resources."""
        if self.client:
            await self.client.aclose()
            self.client = None
        logger.info("Bhashini TTS cleaned up")


class EdgeIndicTTS(IndicTTSProvider):
    """
    Microsoft Edge TTS with Indian voices - FREE, no API key needed.
    
    Uses the same neural voices as Azure but via free Edge TTS API.
    Supports Hindi, Tamil, Telugu, Bengali, and more.
    
    Voice list: https://learn.microsoft.com/azure/cognitive-services/speech-service/language-support
    """
    
    # Edge TTS voice IDs for Indian languages
    EDGE_VOICES = {
        "hi": {"female": "hi-IN-NeerjaNeural", "male": "hi-IN-PrabhatNeural"},
        "bn": {"female": "bn-IN-TanishaaNeural", "male": "bn-IN-BashkarNeural"},
        "ta": {"female": "ta-IN-PallaviNeural", "male": "ta-IN-ValluvarNeural"},
        "te": {"female": "te-IN-ShrutiNeural", "male": "te-IN-MohanNeural"},
        "ml": {"female": "ml-IN-SobhanaNeural", "male": "ml-IN-MidhunNeural"},
        "kn": {"female": "kn-IN-SapnaNeural", "male": "kn-IN-GaganNeural"},
        "gu": {"female": "gu-IN-DhwaniNeural", "male": "gu-IN-NiranjanNeural"},
        "mr": {"female": "mr-IN-AarohiNeural", "male": "mr-IN-ManoharNeural"},
        "pa": {"female": "pa-IN-GurpreetNeural", "male": "pa-IN-GurpreetNeural"},
        "ur": {"female": "ur-PK-SalmaNeural", "male": "ur-PK-AsadNeural"},
        "en": {"female": "en-IN-NeerjaNeural", "male": "en-IN-PrabhatNeural"},
    }
    
    def __init__(self, voice: str = "hi-IN-NeerjaNeural", gender: str = "female"):
        self.voice = voice
        self.gender = gender
        self.client = None
    
    async def initialize(self) -> None:
        """Initialize Edge TTS."""
        try:
            import edge_tts
            self.client = edge_tts
            logger.info("Edge Indic TTS initialized", voice=self.voice)
        except ImportError:
            logger.error("edge-tts not installed. Run: pip install edge-tts")
            raise
    
    def _get_voice(self, language: str, voice_id: Optional[str] = None) -> str:
        """Get voice ID for language."""
        if voice_id:
            return voice_id
        
        lang_voices = self.EDGE_VOICES.get(language, self.EDGE_VOICES.get("en", {}))
        return lang_voices.get(self.gender, lang_voices.get("female", self.voice))
    
    async def synthesize(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "hi"
    ) -> AsyncGenerator[bytes, None]:
        """Synthesize text using Edge TTS."""
        voice = self._get_voice(language, voice_id)
        
        try:
            communicate = self.client.Communicate(text, voice)
            
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    yield chunk["data"]
                    
        except Exception as e:
            logger.error("Edge Indic TTS error", error=str(e), voice=voice)
            raise
    
    async def get_voices(self, language: Optional[str] = None) -> List[dict]:
        """Get available Edge TTS Indian voices."""
        voices = []
        
        for lang, lang_voices in self.EDGE_VOICES.items():
            if language and lang != language:
                continue
            
            for gender_key, voice_id in lang_voices.items():
                voices.append({
                    "voice_id": voice_id,
                    "language": lang,
                    "gender": gender_key,
                    "name": voice_id.split("-")[-1].replace("Neural", ""),
                })
        
        return voices
    
    async def cleanup(self) -> None:
        """Cleanup resources."""
        self.client = None
        logger.info("Edge Indic TTS cleaned up")


def create_indic_tts_provider(provider: str, **kwargs) -> IndicTTSProvider:
    """Factory function to create Indic TTS provider."""
    providers = {
        "azure_indic": AzureIndicTTS,
        "bhashini_tts": BhashiniTTS,
        "edge_indic": EdgeIndicTTS,
    }
    
    if provider not in providers:
        raise ValueError(f"Unknown Indic TTS provider: {provider}. Available: {list(providers.keys())}")
    
    return providers[provider](**kwargs)
