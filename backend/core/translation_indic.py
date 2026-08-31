"""
ClearSpeak AI - Indic Translation Providers
Intermediate translation nodes for Indian languages via IndicTrans2 and Azure Translator.
"""

from abc import ABC, abstractmethod
from typing import Optional, Dict, List, Tuple
import structlog
import httpx

logger = structlog.get_logger()


class IndicTranslationProvider(ABC):
    """Abstract base for Indic translation providers."""
    
    @abstractmethod
    async def initialize(self) -> None:
        pass
    
    @abstractmethod
    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> Optional[str]:
        pass
    
    @abstractmethod
    async def detect_language(self, text: str) -> Optional[str]:
        pass
    
    @abstractmethod
    async def get_supported_languages(self) -> Dict[str, str]:
        pass
    
    @abstractmethod
    async def cleanup(self) -> None:
        pass


class IndicTrans2Provider(IndicTranslationProvider):
    """
    IndicTrans2 translation provider for Indian languages.
    
    Uses AI4Bharat's IndicTrans2 model for high-quality translation between
    Indian languages and English. Supports 22+ Indian languages.
    
    Models available:
    - IndicTrans2-en-indic (English -> Indian languages)
    - IndicTrans2-indic-en (Indian languages -> English)
    - IndicTrans2-indic-indic (Indian language -> Indian language, via pivot)
    
    API: https://github.com/AI4Bharat/IndicTrans2
    """
    
    # Language code mapping
    LANGUAGE_MAP = {
        "hi": "hin_Deva", "bn": "ben_Beng", "ta": "tam_Taml", "te": "tel_Telu",
        "ml": "mal_Mlym", "kn": "kan_Knda", "gu": "guj_Gujr", "mr": "mar_Deva",
        "pa": "pan_Guru", "ur": "urd_Arab", "as": "asm_Beng", "or": "ory_Orya",
        "sa": "san_Deva", "ne": "nep_Deva", "sd": "snd_Arab",
        "en": "eng_Latn",
    }
    
    # Reverse map for output
    REVERSE_MAP = {v: k for k, v in LANGUAGE_MAP.items()}
    
    def __init__(
        self,
        base_url: str = "http://localhost:8001",
        api_key: Optional[str] = None,
        model: str = "indictrans2"
    ):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self.client: Optional[httpx.AsyncClient] = None
    
    async def initialize(self) -> None:
        """Initialize IndicTrans2 client."""
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        
        self.client = httpx.AsyncClient(timeout=60.0, headers=headers)
        
        # Test connection
        try:
            resp = await self.client.get(f"{self.base_url}/health")
            if resp.status_code == 200:
                logger.info("IndicTrans2 provider initialized", url=self.base_url)
            else:
                logger.warning("IndicTrans2 may not be running", url=self.base_url)
        except Exception as e:
            logger.warning("IndicTrans2 connection failed (service may not be running)", error=str(e))
    
    def _map_lang(self, lang_code: str) -> str:
        """Map ISO 639-1 code to IndicTrans2 format."""
        return self.LANGUAGE_MAP.get(lang_code, f"{lang_code}_Latn")
    
    def _reverse_map(self, it2_code: str) -> str:
        """Map IndicTrans2 code back to ISO 639-1."""
        return self.REVERSE_MAP.get(it2_code, it2_code.split("_")[0])
    
    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> Optional[str]:
        """
        Translate text using IndicTrans2.
        
        For indic-to-indic translation, uses English as pivot:
        Lang A -> English -> Lang B
        """
        if not self.client:
            logger.warning("IndicTrans2 client not initialized")
            return None
        
        src = self._map_lang(source_language)
        tgt = self._map_lang(target_language)
        
        # Same language
        if src == tgt:
            return text
        
        try:
            # Direct translation (en->indic or indic->en)
            if source_language == "en" or target_language == "en":
                payload = {
                    "input": text,
                    "source_language": src,
                    "target_language": tgt,
                    "model": self.model,
                }
                
                resp = await self.client.post(f"{self.base_url}/translate", json=payload)
                
                if resp.status_code == 200:
                    data = resp.json()
                    return data.get("translated_text", data.get("output", ""))
                else:
                    logger.warning("IndicTrans2 translation failed", status=resp.status_code)
                    return None
            
            # Indic-to-Indic: pivot through English
            else:
                # Step 1: Source -> English
                en_payload = {
                    "input": text,
                    "source_language": src,
                    "target_language": self.LANGUAGE_MAP["en"],
                    "model": self.model,
                }
                
                resp1 = await self.client.post(f"{self.base_url}/translate", json=en_payload)
                if resp1.status_code != 200:
                    return None
                
                en_text = resp1.json().get("translated_text", "")
                if not en_text:
                    return None
                
                # Step 2: English -> Target
                tgt_payload = {
                    "input": en_text,
                    "source_language": self.LANGUAGE_MAP["en"],
                    "target_language": tgt,
                    "model": self.model,
                }
                
                resp2 = await self.client.post(f"{self.base_url}/translate", json=tgt_payload)
                if resp2.status_code == 200:
                    return resp2.json().get("translated_text", "")
                
                return None
                
        except Exception as e:
            logger.error("IndicTrans2 translation error", error=str(e))
            return None
    
    async def detect_language(self, text: str) -> Optional[str]:
        """Detect language using IndicTrans2's language identification."""
        if not self.client:
            return None
        
        try:
            resp = await self.client.post(
                f"{self.base_url}/detect",
                json={"text": text}
            )
            if resp.status_code == 200:
                data = resp.json()
                it2_code = data.get("language", "")
                return self._reverse_map(it2_code)
        except Exception as e:
            logger.error("IndicTrans2 language detection failed", error=str(e))
        
        return None
    
    async def get_supported_languages(self) -> Dict[str, str]:
        """Get supported languages."""
        return {
            "hi": "Hindi", "bn": "Bengali", "ta": "Tamil", "te": "Telugu",
            "ml": "Malayalam", "kn": "Kannada", "gu": "Gujarati", "mr": "Marathi",
            "pa": "Punjabi", "ur": "Urdu", "as": "Assamese", "or": "Odia",
            "sa": "Sanskrit", "ne": "Nepali", "sd": "Sindhi", "en": "English",
        }
    
    async def cleanup(self) -> None:
        """Cleanup resources."""
        if self.client:
            await self.client.aclose()
            self.client = None
        logger.info("IndicTrans2 provider cleaned up")


class AzureTranslatorProvider(IndicTranslationProvider):
    """
    Azure Cognitive Services Translator for Indian languages.
    
    Supports 100+ languages including all 22 Indian Scheduled Languages.
    Production-grade with high availability and low latency.
    
    API: https://learn.microsoft.com/azure/cognitive-services/translator/
    """
    
    # Azure language codes (most are ISO 639-1)
    AZURE_LANGUAGES = {
        "hi": "hi", "bn": "bn", "ta": "ta", "te": "te",
        "ml": "ml", "kn": "kn", "gu": "gu", "mr": "mr",
        "pa": "pa", "ur": "ur", "as": "as", "or": "or",
        "sa": "sa", "ne": "ne", "sd": "sd",
        "gom": "gom", "doi": "doi", "mai": "mai",
        "sat": "sat", "ks": "ks", "mni": "mni", "brx": "brx",
        "en": "en", "es": "es", "fr": "fr", "de": "de",
    }
    
    def __init__(
        self,
        subscription_key: str,
        region: str = "centralindia",
        endpoint: str = "https://api.cognitive.microsofttranslator.com"
    ):
        self.subscription_key = subscription_key
        self.region = region
        self.endpoint = endpoint.rstrip("/")
        self.client: Optional[httpx.AsyncClient] = None
    
    async def initialize(self) -> None:
        """Initialize Azure Translator client."""
        self.client = httpx.AsyncClient(
            timeout=30.0,
            headers={
                "Ocp-Apim-Subscription-Key": self.subscription_key,
                "Ocp-Apim-Subscription-Region": self.region,
                "Content-Type": "application/json",
            }
        )
        logger.info("Azure Translator initialized", region=self.region)
    
    def _map_lang(self, lang_code: str) -> str:
        """Map our language code to Azure code."""
        return self.AZURE_LANGUAGES.get(lang_code, lang_code)
    
    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> Optional[str]:
        """Translate text using Azure Translator."""
        if not self.client:
            return None
        
        src = self._map_lang(source_language)
        tgt = self._map_lang(target_language)
        
        if src == tgt:
            return text
        
        try:
            params = {"api-version": "3.0"}
            
            body = [{"text": text}]
            
            resp = await self.client.post(
                f"{self.endpoint}/translate",
                params=params,
                json=body,
                headers={"From": src, "To": tgt}
            )
            
            if resp.status_code == 200:
                data = resp.json()
                if data and len(data) > 0:
                    translations = data[0].get("translations", [])
                    if translations:
                        return translations[0].get("text", "")
            else:
                logger.warning("Azure Translator failed", status=resp.status_code)
                
        except Exception as e:
            logger.error("Azure Translator error", error=str(e))
        
        return None
    
    async def detect_language(self, text: str) -> Optional[str]:
        """Detect language using Azure Translator."""
        if not self.client:
            return None
        
        try:
            params = {"api-version": "3.0"}
            body = [{"text": text}]
            
            resp = await self.client.post(
                f"{self.endpoint}/detect",
                params=params,
                json=body
            )
            
            if resp.status_code == 200:
                data = resp.json()
                if data and len(data) > 0:
                    return data[0].get("language", "")
                    
        except Exception as e:
            logger.error("Azure language detection failed", error=str(e))
        
        return None
    
    async def get_supported_languages(self) -> Dict[str, str]:
        """Get Azure Translator supported languages."""
        if not self.client:
            return {}
        
        try:
            params = {"api-version": "3.0", "scope": "translation"}
            resp = await self.client.get(
                f"{self.endpoint}/languages",
                params=params
            )
            
            if resp.status_code == 200:
                data = resp.json()
                translations = data.get("translation", {})
                return {
                    code: info.get("name", code)
                    for code, info in translations.items()
                    if code in self.AZURE_LANGUAGES.values()
                }
        except Exception as e:
            logger.error("Failed to get Azure languages", error=str(e))
        
        return {}
    
    async def cleanup(self) -> None:
        """Cleanup resources."""
        if self.client:
            await self.client.aclose()
            self.client = None
        logger.info("Azure Translator cleaned up")


class BhashiniTranslationProvider(IndicTranslationProvider):
    """
    Bhashini Translation API for Indian languages.
    
    Uses Bhashini's neural machine translation for official Indian languages.
    Free tier available for Indian developers.
    
    API: https://bhashini.gov.in/services
    """
    
    LANGUAGE_MAP = {
        "hi": "hi", "bn": "bn", "ta": "ta", "te": "te",
        "ml": "ml", "kn": "kn", "gu": "gu", "mr": "mr",
        "pa": "pa", "ur": "ur", "as": "as", "or": "or",
        "sa": "hi", "ne": "hi", "sd": "hi",
        "en": "en",
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
    
    async def initialize(self) -> None:
        """Initialize Bhashini translation client."""
        self.client = httpx.AsyncClient(
            timeout=30.0,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            }
        )
        logger.info("Bhashini Translation initialized")
    
    def _map_lang(self, lang_code: str) -> str:
        return self.LANGUAGE_MAP.get(lang_code, "hi")
    
    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> Optional[str]:
        """Translate text using Bhashini."""
        if not self.client:
            return None
        
        src = self._map_lang(source_language)
        tgt = self._map_lang(target_language)
        
        if src == tgt:
            return text
        
        try:
            payload = {
                "input": [{"source": text}],
                "config": {
                    "sourceLanguage": src,
                    "targetLanguage": tgt,
                },
                "pipeline_tasks": [
                    {
                        "taskType": "translation",
                        "config": {
                            "sourceLanguage": src,
                            "targetLanguage": tgt,
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
                    if result.get("taskType") == "translation":
                        output = result.get("output", [])
                        if output:
                            return output[0].get("target", "")
            else:
                logger.warning("Bhashini translation failed", status=resp.status_code)
                
        except Exception as e:
            logger.error("Bhashini translation error", error=str(e))
        
        return None
    
    async def detect_language(self, text: str) -> Optional[str]:
        """Detect language using Bhashini."""
        if not self.client:
            return None
        
        try:
            payload = {
                "input": [{"source": text}],
                "pipeline_tasks": [
                    {"taskType": "language-detection", "config": {}}
                ]
            }
            
            resp = await self.client.post(
                f"{self.base_url}/pipeline/process",
                json=payload
            )
            
            if resp.status_code == 200:
                data = resp.json()
                for result in data.get("pipelineResponse", []):
                    if result.get("taskType") == "language-detection":
                        output = result.get("output", [])
                        if output:
                            return output[0].get("langCode", "")
                            
        except Exception as e:
            logger.error("Bhashini language detection failed", error=str(e))
        
        return None
    
    async def get_supported_languages(self) -> Dict[str, str]:
        """Get Bhashini supported languages."""
        return {
            "hi": "Hindi", "bn": "Bengali", "ta": "Tamil", "te": "Telugu",
            "ml": "Malayalam", "kn": "Kannada", "gu": "Gujarati", "mr": "Marathi",
            "pa": "Punjabi", "ur": "Urdu", "as": "Assamese", "or": "Odia",
            "en": "English",
        }
    
    async def cleanup(self) -> None:
        """Cleanup resources."""
        if self.client:
            await self.client.aclose()
            self.client = None
        logger.info("Bhashini Translation cleaned up")


def create_indic_translation_provider(provider: str, **kwargs) -> IndicTranslationProvider:
    """Factory function to create Indic translation provider."""
    providers = {
        "indictrans2": IndicTrans2Provider,
        "azure_translator": AzureTranslatorProvider,
        "bhashini_translate": BhashiniTranslationProvider,
    }
    
    if provider not in providers:
        raise ValueError(f"Unknown Indic translation provider: {provider}. Available: {list(providers.keys())}")
    
    return providers[provider](**kwargs)
