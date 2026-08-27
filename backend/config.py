"""
Voice AI Platform - Configuration Management
Production-grade configuration with environment-based settings.
"""

from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    app_name: str = Field(default="VoiceAIPlatform", env="APP_NAME")
    app_env: str = Field(default="development", env="APP_ENV")
    debug: bool = Field(default=False, env="DEBUG")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    
    # Server
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    ws_port: int = Field(default=8001, env="WS_PORT")
    
    # ASR Configuration
    asr_provider: str = Field(default="deepgram", env="ASR_PROVIDER")
    deepgram_api_key: Optional[str] = Field(default=None, env="DEEPGRAM_API_KEY")
    whisper_model: str = Field(default="base", env="WHISPER_MODEL")
    
    # TTS Configuration
    tts_provider: str = Field(default="elevenlabs", env="TTS_PROVIDER")
    elevenlabs_api_key: Optional[str] = Field(default=None, env="ELEVENLABS_API_KEY")
    elevenlabs_voice_id: str = Field(default="21m00Tcm4TlvDq8ikWAM", env="ELEVENLABS_VOICE_ID")
    tts_sample_rate: int = Field(default=24000, env="TTS_SAMPLE_RATE")
    
    # LLM Configuration
    openai_api_key: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    llm_model: str = Field(default="gpt-4", env="LLM_MODEL")
    llm_temperature: float = Field(default=0.7, env="LLM_TEMPERATURE")
    llm_max_tokens: int = Field(default=150, env="LLM_MAX_TOKENS")
    
    # LLM Provider
    llm_provider: str = Field(default="openai", env="LLM_PROVIDER")
    ollama_model: str = Field(default="llama3.2", env="OLLAMA_MODEL")
    
    # Voicebox
    voicebox_url: str = Field(default="http://127.0.0.1:17493", env="VOICEBOX_URL")
    
    # Translator
    translator_url: str = Field(default="http://127.0.0.1:5050", env="TRANSLATOR_URL")
    
    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    
    # Monitoring
    prometheus_enabled: bool = Field(default=True, env="PROMETHEUS_ENABLED")
    prometheus_port: int = Field(default=9090, env="PROMETHEUS_PORT")
    
    # Audio Settings
    audio_sample_rate: int = Field(default=16000, env="AUDIO_SAMPLE_RATE")
    audio_channels: int = Field(default=1, env="AUDIO_CHANNELS")
    audio_chunk_size: int = Field(default=4096, env="AUDIO_CHUNK_SIZE")
    
    # API Key (optional)
    api_key: Optional[str] = Field(default=None, env="API_KEY")
    
    # Security
    allowed_hosts: list = Field(default=["*"], env="ALLOWED_HOSTS")
    cors_origins: list = Field(default=["*"], env="CORS_ORIGINS")
    https_redirect: bool = Field(default=False, env="HTTPS_REDIRECT")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
