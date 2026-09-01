"""
ClearSpeak AI - Configuration Management
Production-grade configuration with environment-based settings.
India's sovereign communication platform.
"""

import json
from functools import lru_cache
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    app_name: str = Field(default="ClearSpeak AI", env="APP_NAME")
    app_env: str = Field(default="development", env="APP_ENV")
    debug: bool = Field(default=False, env="DEBUG")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    
    # Server
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    ws_port: int = Field(default=8001, env="WS_PORT")
    
    # ASR Configuration (Standard)
    asr_provider: str = Field(default="deepgram", env="ASR_PROVIDER")
    deepgram_api_key: Optional[str] = Field(default=None, env="DEEPGRAM_API_KEY")
    whisper_model: str = Field(default="base", env="WHISPER_MODEL")
    
    # ASR Configuration (Indic)
    indic_asr_provider: Optional[str] = Field(default=None, env="INDIC_ASR_PROVIDER")
    bhashini_api_key: Optional[str] = Field(default=None, env="BHASHINI_API_KEY")
    bhashini_user_id: str = Field(default="clearspeak", env="BHASHINI_USER_ID")
    ai4bharat_api_key: Optional[str] = Field(default=None, env="AI4BHARAT_API_KEY")
    ai4bharat_base_url: str = Field(default="https://api.ai4bharat.iitm.ac.in", env="AI4BHARAT_BASE_URL")
    indic_whisper_model: str = Field(default="large-v3", env="INDIC_WHISPER_MODEL")
    
    # TTS Configuration (Standard)
    tts_provider: str = Field(default="elevenlabs", env="TTS_PROVIDER")
    elevenlabs_api_key: Optional[str] = Field(default=None, env="ELEVENLABS_API_KEY")
    elevenlabs_voice_id: str = Field(default="21m00Tcm4TlvDq8ikWAM", env="ELEVENLABS_VOICE_ID")
    tts_sample_rate: int = Field(default=24000, env="TTS_SAMPLE_RATE")
    
    # TTS Configuration (Indic)
    indic_tts_provider: Optional[str] = Field(default=None, env="INDIC_TTS_PROVIDER")
    azure_speech_key: Optional[str] = Field(default=None, env="AZURE_SPEECH_KEY")
    azure_speech_region: str = Field(default="centralindia", env="AZURE_SPEECH_REGION")
    indic_tts_gender: str = Field(default="female", env="INDIC_TTS_GENDER")
    bhashini_tts_gender: str = Field(default="female", env="BHASHINI_TTS_GENDER")
    
    # LLM Configuration
    openai_api_key: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    llm_model: str = Field(default="gpt-4", env="LLM_MODEL")
    llm_temperature: float = Field(default=0.7, env="LLM_TEMPERATURE")
    llm_max_tokens: int = Field(default=150, env="LLM_MAX_TOKENS")
    
    # LLM Provider
    llm_provider: str = Field(default="openai", env="LLM_PROVIDER")
    ollama_model: str = Field(default="llama3.2", env="OLLAMA_MODEL")
    
    # Translation Configuration (Standard)
    translation_provider: str = Field(default="local", env="TRANSLATION_PROVIDER")
    translator_url: str = Field(default="http://127.0.0.1:5050", env="TRANSLATOR_URL")
    default_language: str = Field(default="en", env="DEFAULT_LANGUAGE")
    enable_auto_translate: bool = Field(default=True, env="ENABLE_AUTO_TRANSLATE")
    
    # Translation Configuration (Indic)
    indic_translation_provider: Optional[str] = Field(default=None, env="INDIC_TRANSLATION_PROVIDER")
    indictrans2_url: str = Field(default="http://localhost:8001", env="INDICTRANS2_URL")
    azure_translator_key: Optional[str] = Field(default=None, env="AZURE_TRANSLATOR_KEY")
    azure_translator_region: str = Field(default="centralindia", env="AZURE_TRANSLATOR_REGION")
    azure_translator_endpoint: str = Field(
        default="https://api.cognitive.microsofttranslator.com",
        env="AZURE_TRANSLATOR_ENDPOINT"
    )
    
    # Pipeline Configuration
    default_pipeline_mode: str = Field(default="agent", env="DEFAULT_PIPELINE_MODE")
    
    # India-specific Settings
    india_default_language: str = Field(default="hi", env="INDIA_DEFAULT_LANGUAGE")
    enable_india_languages: bool = Field(default=True, env="ENABLE_INDIA_LANGUAGES")
    india_language_codes: List[str] = Field(
        default=[
            "hi", "bn", "ta", "te", "ml", "kn", "gu", "mr", "pa", "ur",
            "as", "or", "sa", "gom", "doi", "mai", "sat", "ks", "mni", "brx", "sd", "ne"
        ],
        env="INDIA_LANGUAGE_CODES"
    )
    
    @field_validator("india_language_codes", mode="before")
    @classmethod
    def parse_language_codes(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [code.strip() for code in v.split(",") if code.strip()]
        return v
    
    # Voicebox
    voicebox_url: str = Field(default="http://127.0.0.1:17493", env="VOICEBOX_URL")
    
    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    
    # Monitoring
    prometheus_enabled: bool = Field(default=True, env="PROMETHEUS_ENABLED")
    prometheus_port: int = Field(default=9090, env="PROMETHEUS_PORT")
    
    # Audio Settings
    audio_sample_rate: int = Field(default=16000, env="AUDIO_SAMPLE_RATE")
    audio_channels: int = Field(default=1, env="AUDIO_CHANNELS")
    audio_chunk_size: int = Field(default=4096, env="AUDIO_CHUNK_SIZE")
    
    # WebSocket Settings
    ws_binary_audio: bool = Field(default=True, env="WS_BINARY_AUDIO")
    ws_max_message_size: int = Field(default=1048576, env="WS_MAX_MESSAGE_SIZE")  # 1MB
    
    # API Key (optional)
    api_key: Optional[str] = Field(default=None, env="API_KEY")
    
    # Security
    allowed_hosts: list = Field(default=["*"], env="ALLOWED_HOSTS")
    cors_origins: list = Field(default=["*"], env="CORS_ORIGINS")
    https_redirect: bool = Field(default=False, env="HTTPS_REDIRECT")
    
    # WebRTC (Future)
    webrtc_enabled: bool = Field(default=False, env="WEBRTC_ENABLED")
    webrtc_turn_url: Optional[str] = Field(default=None, env="WEBRTC_TURN_URL")
    webrtc_turn_username: Optional[str] = Field(default=None, env="WEBRTC_TURN_USERNAME")
    webrtc_turn_password: Optional[str] = Field(default=None, env="WEBRTC_TURN_PASSWORD")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
