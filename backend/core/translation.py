"""AI Translation Manager for real-time translation across 200+ languages.

Core module for ClearSpeak - India's sovereign communication platform.
Supports all 22 Scheduled Languages of India with native script detection.
"""

import asyncio
import re
from typing import Dict, List, Optional, Tuple, Set
from datetime import datetime
import structlog
import httpx

logger = structlog.get_logger()


# Unicode ranges for Indian scripts
INDIAN_SCRIPT_RANGES = {
    "hi": (0x0900, 0x097F),   # Devanagari (Hindi, Marathi, Sanskrit, Konkani, Nepali, Dogri, Maithili)
    "bn": (0x0980, 0x09FF),   # Bengali-Assamese (Bengali, Assamese)
    "ta": (0x0B80, 0x0BFF),   # Tamil
    "te": (0x0C00, 0x0C7F),   # Telugu
    "ml": (0x0D00, 0x0D7F),   # Malayalam
    "kn": (0x0C80, 0x0CFF),   # Kannada
    "gu": (0x0A80, 0x0AFF),   # Gujarati
    "pa": (0x0A00, 0x0A7F),   # Gurmukhi (Punjabi)
    "or": (0x0B00, 0x0B7F),   # Odia
    "sd": (0x0560, 0x058F),   # Sindhi (Extended Arabic - also uses Devanagari)
    "ks": (0x0600, 0x06FF),   # Kashmiri (Arabic script)
    "ur": (0x0600, 0x06FF),   # Urdu (Arabic script)
    "mni": (0xABC0, 0xABFF),  # Meitei (Manipuri)
    "sat": (0x1C50, 0x1C7F),  # Ol Chiki (Santali)
    "brx": (0x1C00, 0x1C4F),  # Devanagari (Bodo uses Devanagari)
}

# Devanagari script languages (share same script, need disambiguation via dictionary)
DEVANAGARI_LANGUAGES = {"hi", "mr", "sa", "gom", "doi", "mai", "brx", "ne"}


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
    """Local translation provider using dictionary-based translation for 22 Indian languages."""
    
    def __init__(self):
        # Common phrases in all 22 Scheduled Languages of India
        self.translations = {
            "hello": {
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
                "as": "নমস্কাৰ",
                "or": "ନମସ୍କାର",
                "sa": "नमस्ते",
                "gom": "नमस्कार",
                "doi": "नमस्ते",
                "mai": "नमस्ते",
                "sat": "ᱡᱟᱨᱟᱣᱱᱚᱠᱚ",
                "ks": "سلام علیکم",
                "mni": "ꯈꯔꯌꯟ",
                "brx": "नमस्ते",
                "sd": "هيلو",
                "ne": "नमस्ते",
                "en": "Hello",
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
            },
            "how are you": {
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
                "as": "আপুনি কেনেকৈ আছে?",
                "or": "ଆପଣ କେମିତି ଅଛନ୍ତି?",
                "sa": "भवतः कथं अस्ति?",
                "gom": "तुम कशे आसात?",
                "doi": "तुसां केह् हाल?",
                "mai": "अहाँ कसन छी?",
                "sat": "ᱤᱚᱱᱚᱜᱚ?",
                "ks": "توہیٛ چھُس کیٛوٕس?",
                "mni": "ꯑꯣꯏꯕꯗꯥ ꯁ꯭ꯔꯒꯗꯥꯕꯁꯛꯀꯅꯒꯗꯦ?",
                "brx": "नां बायदि गोबाय नां?",
                "sd": "توهين ڪيئن آهيو؟",
                "ne": "तपाईं कसरी हुनुहुन्छ?",
                "en": "How are you?",
            },
            "thank you": {
                "hi": "धन्यवाद",
                "te": "ధన్యవాదాలు",
                "en": "Thank you",
            },
            "yes": {
                "hi": "हाँ",
                "te": "అవును",
                "en": "Yes",
            },
            "no": {
                "hi": "नहीं",
                "te": "కాదు",
                "en": "No",
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


class OpenAITranslationProvider(TranslationProvider):
    """Translation provider using OpenAI GPT for accurate translations."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = None
        
    async def initialize(self):
        """Initialize OpenAI client."""
        try:
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(api_key=self.api_key)
        except Exception as e:
            logger.error("Failed to initialize OpenAI translation", error=str(e))
    
    async def translate(
        self,
        text: str,
        source_language: str,
        target_language: str
    ) -> Optional[str]:
        """Translate text using OpenAI GPT."""
        if not self.client:
            await self.initialize()
        
        if not self.client:
            return None
        
        # Language code to name mapping
        lang_names = {
            "hi": "Hindi", "bn": "Bengali", "ta": "Tamil", "te": "Telugu",
            "ml": "Malayalam", "kn": "Kannada", "gu": "Gujarati", "mr": "Marathi",
            "pa": "Punjabi", "ur": "Urdu", "as": "Assamese", "or": "Odia",
            "sa": "Sanskrit", "en": "English", "es": "Spanish", "fr": "French",
            "de": "German", "ja": "Japanese", "ko": "Korean", "zh": "Chinese",
            "ar": "Arabic", "pt": "Portuguese", "ru": "Russian"
        }
        
        src_name = lang_names.get(source_language, source_language)
        tgt_name = lang_names.get(target_language, target_language)
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": f"You are a professional translator. Translate the following text from {src_name} to {tgt_name}. Return ONLY the translated text, nothing else."},
                    {"role": "user", "content": text}
                ],
                max_tokens=500,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error("OpenAI translation failed", error=str(e))
            return None


class TranslationManager:
    """
    Manages AI translation across 200+ languages with focus on 22 Indian languages.
    
    Features:
    - Real-time text translation
    - Indian script language detection
    - Multiple translation providers
    - Translation caching
    - User language preferences
    - All 22 Scheduled Languages of India
    """
    
    # All 22 Scheduled Languages of India
    INDIA_SCHEDULED_LANGUAGES = {
        "hi": {"name": "Hindi", "native_name": "हिन्दी", "script": "devanagari", "speakers": "600M"},
        "bn": {"name": "Bengali", "native_name": "বাংলা", "script": "bengali", "speakers": "97M"},
        "ta": {"name": "Tamil", "native_name": "தமிழ்", "script": "tamil", "speakers": "85M"},
        "te": {"name": "Telugu", "native_name": "తెలుగు", "script": "telugu", "speakers": "95M"},
        "ml": {"name": "Malayalam", "native_name": "മലയാളം", "script": "malayalam", "speakers": "38M"},
        "kn": {"name": "Kannada", "native_name": "ಕನ್ನಡ", "script": "kannada", "speakers": "50M"},
        "gu": {"name": "Gujarati", "native_name": "ગુજરાતી", "script": "gujarati", "speakers": "56M"},
        "mr": {"name": "Marathi", "native_name": "मराठी", "script": "devanagari", "speakers": "99M"},
        "pa": {"name": "Punjabi", "native_name": "ਪੰਜਾਬੀ", "script": "gurmukhi", "speakers": "113M"},
        "ur": {"name": "Urdu", "native_name": "اردو", "script": "arabic", "speakers": "70M"},
        "as": {"name": "Assamese", "native_name": "অসমীয়া", "script": "bengali", "speakers": "15M"},
        "or": {"name": "Odia", "native_name": "ଓଡ଼ିଆ", "script": "odia", "speakers": "38M"},
        "sa": {"name": "Sanskrit", "native_name": "संस्कृतम्", "script": "devanagari", "speakers": "0.02M"},
        "gom": {"name": "Konkani", "native_name": "कोंकणी", "script": "devanagari", "speakers": "7.6M"},
        "doi": {"name": "Dogri", "native_name": "डोगरी", "script": "devanagari", "speakers": "3.2M"},
        "mai": {"name": "Maithili", "native_name": "मैथिली", "script": "devanagari", "speakers": "52M"},
        "sat": {"name": "Santali", "native_name": "ᱥᱟᱱᱛᱟᱲᱤ", "script": "ol_chiki", "speakers": "7.4M"},
        "ks": {"name": "Kashmiri", "native_name": "कॉशुर", "script": "arabic", "speakers": "6.8M"},
        "mni": {"name": "Manipuri", "native_name": "মৈতৈলোন্", "script": "meitei", "speakers": "1.8M"},
        "brx": {"name": "Bodo", "native_name": "बड़ो", "script": "devanagari", "speakers": "1.5M"},
        "sd": {"name": "Sindhi", "native_name": "سنڌي", "script": "arabic", "speakers": "30M"},
        "ne": {"name": "Nepali", "native_name": "नेपाली", "script": "devanagari", "speakers": "25M"},
    }
    
    def __init__(self, use_remote: bool = False):
        self.providers = {
            "local": LocalTranslationProvider(),
        }
        
        # Add OpenAI provider if API key is available
        try:
            from backend.config import get_settings
            settings = get_settings()
            if settings.openai_api_key:
                self.providers["openai"] = OpenAITranslationProvider(settings.openai_api_key)
        except Exception:
            pass
        
        self.default_provider = "openai" if "openai" in self.providers else "local"
        self._user_languages: Dict[str, str] = {}  # user_id -> preferred language
        self._cache: Dict[str, str] = {}
        
        # Build supported languages dict - India's 22 Scheduled Languages first
        self.supported_languages = {}
        for code, info in self.INDIA_SCHEDULED_LANGUAGES.items():
            self.supported_languages[code] = info["name"]
        
        # Add global languages
        global_languages = {
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
        self.supported_languages.update(global_languages)
    
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
        
        # Auto-detect source language if not specified
        src_lang = source_language or await self.detect_language(text)
        
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
        """
        Detect the language of text with support for Indian scripts.
        
        Uses Unicode script detection for Indian languages, then heuristic
        patterns for other languages.
        """
        if not text:
            return "en"
        
        # Phase 1: Indian script detection via Unicode ranges
        script_counts: Dict[str, int] = {}
        for char in text:
            char_code = ord(char)
            for lang_code, (start, end) in INDIAN_SCRIPT_RANGES.items():
                if start <= char_code <= end:
                    script_counts[lang_code] = script_counts.get(lang_code, 0) + 1
        
        if script_counts:
            # Get the dominant script
            dominant_script = max(script_counts, key=script_counts.get)
            
            # For Devanagari script, we need to disambiguate between languages
            if dominant_script in DEVANAGARI_LANGUAGES:
                # Default to Hindi for Devanagari (most common)
                # In production, use a proper NLP model for disambiguation
                return "hi"
            
            return dominant_script
        
        # Phase 2: Non-Indian script detection
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
        if any(char in text for char in "أبتثجحخدذرزسشصضطظعغفقكلمنهوي"):
            return "ar"
        
        return "en"  # Default to English
    
    def get_india_languages(self) -> Dict[str, dict]:
        """Get all 22 Scheduled Languages of India with metadata."""
        return self.INDIA_SCHEDULED_LANGUAGES.copy()
    
    def is_indian_language(self, language_code: str) -> bool:
        """Check if a language is one of India's 22 Scheduled Languages."""
        return language_code in self.INDIA_SCHEDULED_LANGUAGES
    
    def get_script(self, language_code: str) -> Optional[str]:
        """Get the script used by a language."""
        lang_info = self.INDIA_SCHEDULED_LANGUAGES.get(language_code)
        return lang_info["script"] if lang_info else None
    
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
