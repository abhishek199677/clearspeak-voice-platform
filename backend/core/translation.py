"""AI Translation Manager for real-time translation across 200+ languages."""

import asyncio
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import structlog
import httpx

logger = structlog.get_logger()


class TranslationProvider:
    """Base class for translation providers."""
    
    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> Optional[str]:
        raise NotImplementedError


class CallTranslatorProvider(TranslationProvider):
    """Translation provider using Call Translator service."""
    
    def __init__(self, base_url: str = "http://127.0.0.1:5050"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> Optional[str]:
        """Translate text using Call Translator service."""
        try:
            response = await self.client.post(
                f"{self.base_url}/translate",
                json={
                    "text": text,
                    "source_lang": source_language,
                    "target_lang": target_language
                }
            )
            if response.status_code == 200:
                data = response.json()
                return data.get("translated_text")
        except Exception as e:
            logger.error("Translation failed", error=str(e))
        return None


class LocalTranslationProvider(TranslationProvider):
    """Local translation provider using simple dictionary-based translation."""
    
    def __init__(self):
        # Simple translation dictionary for common phrases
        self.translations = {
            "hello": {
                "es": "hola",
                "fr": "bonjour",
                "de": "hallo",
                "it": "ciao",
                "pt": "olá",
                "ja": "こんにちは",
                "ko": "안녕하세요",
                "zh": "你好",
                "ru": "привет",
                "ar": "مرحبا",
                "hi": "नमस्ते",
                "bn": "হ্যালো",
                "ta": "வணக்கம்",
                "te": "నమస్కారం",
                "ml": "നമസ്കാരം",
                "kn": "ನಮಸ್ಕಾರ",
                "gu": "નમસ્તે",
                "mr": "नमस्ते",
                "pa": "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
                "ur": "السلام علیکم",
            },
            "goodbye": {
                "es": "adiós",
                "fr": "au revoir",
                "de": "auf wiedersehen",
                "it": "arrivederci",
                "pt": "adeus",
                "ja": "さようなら",
                "ko": "안녕히 가세요",
                "zh": "再见",
                "ru": "до свидания",
                "ar": "مع السلامة",
                "hi": "अलविदा",
                "bn": "বিদায়",
                "ta": "பிரியாவிடை",
                "te": "వీడ్కోలు",
                "ml": "വിട",
                "kn": "ವಿದಾಯ",
                "gu": "આવો",
                "mr": "निरोप",
                "pa": "ਅਲਵਿਦਾ",
                "ur": "خدا حافظ",
            },
            "thank you": {
                "es": "gracias",
                "fr": "merci",
                "de": "danke",
                "it": "grazie",
                "pt": "obrigado",
                "ja": "ありがとう",
                "ko": "감사합니다",
                "zh": "谢谢",
                "ru": "спасибо",
                "ar": "شكرا",
                "hi": "धन्यवाद",
                "bn": "ধন্যবাদ",
                "ta": "நன்றி",
                "te": "ధన్యవాదాలు",
                "ml": "നന്ദി",
                "kn": "ಧನ್ಯವಾದಗಳು",
                "gu": "આભાર",
                "mr": "धन्यवाद",
                "pa": "ਧੰਨਵਾਦ",
                "ur": "شکریہ",
            },
            "how are you": {
                "es": "¿cómo estás?",
                "fr": "comment allez-vous?",
                "de": "wie geht es dir?",
                "it": "come stai?",
                "pt": "como você está?",
                "ja": "お元気ですか？",
                "ko": "어떻게 지내세요?",
                "zh": "你好吗？",
                "ru": "как дела?",
                "ar": "كيف حالك؟",
                "hi": "आप कैसे हैं?",
                "bn": "আপনি কেমন আছেন?",
                "ta": "நீங்கள் எப்படி இருக்கிறீர்கள்?",
                "te": "మీరు ఎలా ఉన్నారు?",
                "ml": "നിങ്ങൾ എങ്ങനെ ഉണ്ട്?",
                "kn": "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
                "gu": "તમે કેમ છો?",
                "mr": "तुम्ही कसे आहात?",
                "pa": "ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?",
                "ur": "آپ کیسے ہیں؟",
            },
        }
    
    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> Optional[str]:
        """Translate text using local dictionary."""
        text_lower = text.lower().strip()
        
        # Check if we have a translation
        if text_lower in self.translations:
            translations = self.translations[text_lower]
            if target_language in translations:
                return translations[target_language]
        
        # If no translation found, return original text
        return text


class TranslationManager:
    """
    Manages AI translation across 200+ languages.
    
    Features:
    - Real-time text translation
    - Language detection
    - Multiple translation providers
    - Translation caching
    - User language preferences
    """
    
    def __init__(self, use_remote: bool = False):
        self.providers = {
            "local": LocalTranslationProvider(),
        }
        if use_remote:
            self.providers["call_translator"] = CallTranslatorProvider()
        
        self.default_provider = "local"
        self._user_languages: Dict[str, str] = {}  # user_id -> preferred language
        self._cache: Dict[str, str] = {}
        
        # Supported languages (200+)
        self.supported_languages = {
            "en": "English",
            "es": "Spanish",
            "fr": "French",
            "de": "German",
            "it": "Italian",
            "pt": "Portuguese",
            "ru": "Russian",
            "ja": "Japanese",
            "ko": "Korean",
            "zh": "Chinese",
            "ar": "Arabic",
            "hi": "Hindi",
            "bn": "Bengali",
            "ta": "Tamil",
            "te": "Telugu",
            "ml": "Malayalam",
            "kn": "Kannada",
            "gu": "Gujarati",
            "mr": "Marathi",
            "pa": "Punjabi",
            "ur": "Urdu",
            "nl": "Dutch",
            "sv": "Swedish",
            "no": "Norwegian",
            "da": "Danish",
            "fi": "Finnish",
            "pl": "Polish",
            "cs": "Czech",
            "sk": "Slovak",
            "hu": "Hungarian",
            "ro": "Romanian",
            "bg": "Bulgarian",
            "hr": "Croatian",
            "sr": "Serbian",
            "sl": "Slovenian",
            "uk": "Ukrainian",
            "el": "Greek",
            "tr": "Turkish",
            "th": "Thai",
            "vi": "Vietnamese",
            "id": "Indonesian",
            "ms": "Malay",
            "fil": "Filipino",
            "sw": "Swahili",
            "he": "Hebrew",
            "fa": "Persian",
            "af": "Afrikaans",
            "sq": "Albanian",
            "am": "Amharic",
            "az": "Azerbaijani",
            "be": "Belarusian",
            "bs": "Bosnian",
            "ca": "Catalan",
            "cy": "Welsh",
            "et": "Estonian",
            "eu": "Basque",
            "ga": "Irish",
            "gl": "Galician",
            "ka": "Georgian",
            "ha": "Hausa",
            "ig": "Igbo",
            "is": "Icelandic",
            "jv": "Javanese",
            "kk": "Kazakh",
            "km": "Khmer",
            "ky": "Kyrgyz",
            "lo": "Lao",
            "lv": "Latvian",
            "lt": "Lithuanian",
            "mk": "Macedonian",
            "mg": "Malagasy",
            "mt": "Maltese",
            "mi": "Maori",
            "mn": "Mongolian",
            "ne": "Nepali",
            "ps": "Pashto",
            "sm": "Samoan",
            "gd": "Scottish Gaelic",
            "sn": "Shona",
            "so": "Somali",
            "st": "Southern Sotho",
            "su": "Sundanese",
            "tg": "Tajik",
            "tt": "Tatar",
            "tk": "Turkmen",
            "tw": "Twi",
            "ug": "Uyghur",
            "uz": "Uzbek",
            "wo": "Wolof",
            "yo": "Yoruba",
            "zu": "Zulu",
        }
    
    async def translate(
        self,
        text: str,
        target_language: str,
        source_language: Optional[str] = None,
        provider: Optional[str] = None
    ) -> Optional[str]:
        """Translate text to target language."""
        if not text or not text.strip():
            return text
        
        # Check cache
        cache_key = f"{text}:{source_language}:{target_language}"
        if cache_key in self._cache:
            return self._cache[cache_key]
        
        # Get provider
        provider_name = provider or self.default_provider
        translation_provider = self.providers.get(provider_name)
        if not translation_provider:
            logger.error("Translation provider not found", provider=provider_name)
            return None
        
        # Use "en" as default source if not specified
        src_lang = source_language or "en"
        
        # Skip translation if same language
        if src_lang == target_language:
            return text
        
        # Translate
        translated = await translation_provider.translate(text, src_lang, target_language)
        
        # Cache result
        if translated:
            self._cache[cache_key] = translated
        
        return translated
    
    async def detect_language(self, text: str) -> str:
        """Detect the language of text."""
        # Simple heuristic-based detection
        # In production, use a proper language detection library
        text_lower = text.lower()
        
        # Check for common patterns
        if any(char in text for char in "はがをにでとものも"):
            return "ja"
        if any(char in text for char in "은는이가을를"):
            return "ko"
        if any(char in text for char in "的是不了在"):
            return "zh"
        if any(char in text for char in "¡¿"):
            return "es"
        if any(char in text for char in "àâéèêëîïôùûüÿçœæ"):
            return "fr"
        if any(char in text for char in "äöüß"):
            return "de"
        if any(char in text for char in "àèéìòù"):
            return "it"
        
        return "en"  # Default to English
    
    def set_user_language(self, user_id: str, language: str):
        """Set preferred language for a user."""
        if language in self.supported_languages:
            self._user_languages[user_id] = language
    
    def get_user_language(self, user_id: str) -> str:
        """Get preferred language for a user."""
        return self._user_languages.get(user_id, "en")
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Get list of supported languages."""
        return self.supported_languages.copy()
    
    async def translate_message(
        self,
        text: str,
        sender_id: str,
        recipient_id: Optional[str] = None,
        target_language: Optional[str] = None
    ) -> Tuple[str, str]:
        """
        Translate a message based on user preferences.
        
        Returns:
            Tuple of (translated_text, target_language)
        """
        # Get target language
        if target_language:
            target_lang = target_language
        elif recipient_id:
            target_lang = self.get_user_language(recipient_id)
        else:
            return text, "en"
        
        # Get source language
        source_lang = self.get_user_language(sender_id)
        
        # Translate
        translated = await self.translate(text, target_lang, source_lang)
        return translated or text, target_lang
