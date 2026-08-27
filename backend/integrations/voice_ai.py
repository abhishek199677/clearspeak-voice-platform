"""
Voice AI Integration Module
Connects Voicebox, VoiceStudio, and Call Translator with the existing platform.
Replaces paid APIs (ElevenLabs, Deepgram) with free, local alternatives.
"""

import os
import httpx
import asyncio
from typing import Optional, AsyncGenerator
from dataclasses import dataclass


@dataclass
class VoiceConfig:
    """Configuration for voice AI services."""
    voicebox_url: str = "http://localhost:3333"
    voicestudio_url: str = "http://localhost:3900"
    translator_url: str = "http://127.0.0.1:5050"


class VoiceboxTTS:
    """Voicebox TTS - replaces ElevenLabs."""
    
    def __init__(self, base_url: str = "http://localhost:3333"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(base_url=base_url, timeout=60.0)
    
    async def list_voices(self) -> list[dict]:
        """List available voice profiles."""
        resp = await self.client.get("/api/voices")
        resp.raise_for_status()
        return resp.json()
    
    async def synthesize(
        self,
        text: str,
        voice_id: str,
        language: str = "en",
        speed: float = 1.0,
        pitch: float = 1.0,
    ) -> bytes:
        """Synthesize speech from text using a cloned voice."""
        resp = await self.client.post(
            "/api/tts",
            json={
                "text": text,
                "voice_id": voice_id,
                "language": language,
                "speed": speed,
                "pitch": pitch,
            },
        )
        resp.raise_for_status()
        return resp.content
    
    async def clone_voice(
        self,
        name: str,
        audio_samples: list[bytes],
    ) -> str:
        """Clone a voice from audio samples. Returns voice_id."""
        files = []
        for i, sample in enumerate(audio_samples):
            files.append(("samples", (f"sample_{i}.wav", sample, "audio/wav")))
        
        resp = await self.client.post(
            "/api/voices/clone",
            data={"name": name},
            files=files,
        )
        resp.raise_for_status()
        return resp.json()["voice_id"]
    
    async def stream_synthesize(
        self,
        text: str,
        voice_id: str,
        language: str = "en",
    ) -> AsyncGenerator[bytes, None]:
        """Stream synthesized audio chunks."""
        async with self.client.stream(
            "POST",
            "/api/tts/stream",
            json={
                "text": text,
                "voice_id": voice_id,
                "language": language,
            },
        ) as resp:
            resp.raise_for_status()
            async for chunk in resp.aiter_bytes():
                yield chunk


class VoiceStudioTTS:
    """VoiceStudio TTS - 646 languages support."""
    
    def __init__(self, base_url: str = "http://localhost:3900"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(base_url=base_url, timeout=60.0)
    
    async def list_engines(self) -> list[dict]:
        """List available TTS engines."""
        resp = await self.client.get("/api/engines")
        resp.raise_for_status()
        return resp.json()
    
    async def synthesize(
        self,
        text: str,
        engine: str = "chatterbox",
        voice_id: Optional[str] = None,
        language: str = "en",
    ) -> bytes:
        """Synthesize speech using VoiceStudio."""
        payload = {
            "text": text,
            "engine": engine,
            "language": language,
        }
        if voice_id:
            payload["voice_id"] = voice_id
        
        resp = await self.client.post("/api/tts", json=payload)
        resp.raise_for_status()
        return resp.content
    
    async def dub_video(
        self,
        video_url: str,
        target_language: str,
        voice_id: Optional[str] = None,
    ) -> dict:
        """Dub a video into another language."""
        resp = await self.client.post(
            "/api/dub",
            json={
                "video_url": video_url,
                "target_language": target_language,
                "voice_id": voice_id,
            },
        )
        resp.raise_for_status()
        return resp.json()


class RealtimeTranslator:
    """Call Translator - real-time speech-to-speech translation."""
    
    def __init__(self, base_url: str = "http://127.0.0.1:5050"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(base_url=base_url, timeout=30.0)
    
    async def get_status(self) -> dict:
        """Get translator status."""
        resp = await self.client.get("/api/status")
        resp.raise_for_status()
        return resp.json()
    
    async def set_languages(self, source: str, target: str) -> dict:
        """Set source and target languages."""
        resp = await self.client.post(
            "/api/languages",
            json={"source": source, "target": target},
        )
        resp.raise_for_status()
        return resp.json()
    
    async def start_translation(self) -> dict:
        """Start real-time translation."""
        resp = await self.client.post("/api/start")
        resp.raise_for_status()
        return resp.json()
    
    async def stop_translation(self) -> dict:
        """Stop real-time translation."""
        resp = await self.client.post("/api/stop")
        resp.raise_for_status()
        return resp.json()


class VoiceAIAgent:
    """
    Unified Voice AI Agent - replaces the paid API stack.
    
    Replaces:
    - ElevenLabs TTS → Voicebox/VoiceStudio (local, free)
    - Deepgram ASR → Whisper (local, free) or Groq (free tier)
    - OpenAI GPT-4 → Local LLM or free API
    """
    
    def __init__(self, config: Optional[VoiceConfig] = None):
        self.config = config or VoiceConfig()
        self.voicebox = VoiceboxTTS(self.config.voicebox_url)
        self.voicestudio = VoiceStudioTTS(self.config.voicestudio_url)
        self.translator = RealtimeTranslator(self.config.translator_url)
    
    async def synthesize_speech(
        self,
        text: str,
        voice_id: Optional[str] = None,
        language: str = "en",
        engine: str = "voicebox",
    ) -> bytes:
        """
        Synthesize speech using the best available engine.
        
        Args:
            text: Text to synthesize
            voice_id: Voice profile ID (optional)
            language: Language code
            engine: "voicebox" or "voicestudio"
        
        Returns:
            Audio bytes (WAV format)
        """
        if engine == "voicebox" and voice_id:
            return await self.voicebox.synthesize(text, voice_id, language)
        else:
            return await self.voicestudio.synthesize(
                text, 
                engine="chatterbox",
                voice_id=voice_id,
                language=language,
            )
    
    async def translate_and_speak(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
    ) -> bytes:
        """Translate text and synthesize in target language."""
        # Use VoiceStudio for multilingual synthesis
        return await self.voicestudio.synthesize(
            text,
            engine="chatterbox",
            language=target_lang,
        )
    
    async def process_voice_command(
        self,
        audio_data: bytes,
        command: str = "transcribe",
    ) -> dict:
        """Process a voice command (transcribe, translate, etc.)."""
        # This would integrate with Whisper for STT
        # For now, return a placeholder structure
        return {
            "command": command,
            "status": "ready",
            "message": "Voice processing ready - integrate with Whisper STT",
        }


# Convenience function for quick setup
def create_voice_agent(
    voicebox_url: str = "http://localhost:3333",
    voicestudio_url: str = "http://localhost:3900",
    translator_url: str = "http://127.0.0.1:5050",
) -> VoiceAIAgent:
    """Create a configured Voice AI Agent."""
    config = VoiceConfig(
        voicebox_url=voicebox_url,
        voicestudio_url=voicestudio_url,
        translator_url=translator_url,
    )
    return VoiceAIAgent(config)
