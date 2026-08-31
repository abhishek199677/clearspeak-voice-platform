"""
ClearSpeak AI - Main Application
FastAPI application with WebSocket support and REST API.
Enterprise-grade voice AI platform for MNC deployment.
"""

import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional, List
import structlog
from fastapi import FastAPI, WebSocket, HTTPException, Depends, Request, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from prometheus_client import generate_latest
from prometheus_fastapi_instrumentator import Instrumentator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from backend.config import get_settings
from backend.models.schemas import (
    HealthResponse, MetricsResponse, VoiceSession, SessionState,
    ChatChannel, ChatMessage, MessageType, ChannelType
)
from backend.core.session import SessionManager
from backend.core.pipeline import VoicePipeline, PipelineMode
from backend.core.chat import ChatManager
from backend.core.calls import CallManager
from backend.core.translation import TranslationManager
from backend.core.translation_indic import (
    IndicTranslationProvider,
    create_indic_translation_provider,
    IndicTrans2Provider,
    AzureTranslatorProvider,
    BhashiniTranslationProvider,
)
from backend.core.streaming import StreamManager
from backend.core.agents import AgentManager
from backend.core.spatial import SpatialAwarenessManager
from backend.streaming.websocket import VoiceWebSocketHandler
from backend.asr.base import create_asr_provider
from backend.asr.indic import IndicASRProvider, create_indic_asr_provider
from backend.tts.base import create_tts_provider
from backend.tts.indic import IndicTTSProvider, create_indic_tts_provider
from backend.llm.base import create_llm_provider
from backend.monitoring.metrics import MetricsCollector
from backend.monitoring.logging import setup_logging
from backend.auth.api_key import verify_api_key

logger = structlog.get_logger()
settings = get_settings()

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Application start time
START_TIME = datetime.now(timezone.utc)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    setup_logging(log_level=settings.log_level, json_output=settings.app_env == "production")
    logger.info("Starting ClearSpeak AI", env=settings.app_env)
    
    # Initialize components
    app.state.session_manager = SessionManager()
    app.state.metrics = MetricsCollector()
    app.state.chat_manager = ChatManager()
    app.state.call_manager = CallManager()
    app.state.translation_manager = TranslationManager()
    app.state.stream_manager = StreamManager()
    app.state.agent_manager = AgentManager()
    app.state.spatial_manager = SpatialAwarenessManager()
    
    # Initialize pipeline
    try:
        # ASR Provider (standard or Indic)
        asr = None
        if settings.indic_asr_provider:
            # Use Indic ASR provider
            indic_asr_kwargs = {}
            if settings.indic_asr_provider == "bhashini":
                indic_asr_kwargs["api_key"] = settings.bhashini_api_key
                indic_asr_kwargs["user_id"] = settings.bhashini_user_id
            elif settings.indic_asr_provider == "ai4bharat":
                indic_asr_kwargs["base_url"] = settings.ai4bharat_base_url
                indic_asr_kwargs["api_key"] = settings.ai4bharat_api_key
            elif settings.indic_asr_provider == "indic_whisper":
                indic_asr_kwargs["model_name"] = settings.indic_whisper_model
            
            asr = create_indic_asr_provider(settings.indic_asr_provider, **indic_asr_kwargs)
            logger.info("Using Indic ASR provider", provider=settings.indic_asr_provider)
        else:
            # Use standard ASR provider
            asr_kwargs = {}
            if settings.asr_provider == "deepgram":
                asr_kwargs["api_key"] = settings.deepgram_api_key
            elif settings.asr_provider == "whisper":
                asr_kwargs["model_name"] = settings.whisper_model
            asr = create_asr_provider(settings.asr_provider, **asr_kwargs)
        
        # TTS Provider (standard or Indic)
        tts = None
        if settings.indic_tts_provider:
            # Use Indic TTS provider
            indic_tts_kwargs = {}
            if settings.indic_tts_provider == "azure_indic":
                indic_tts_kwargs["subscription_key"] = settings.azure_speech_key
                indic_tts_kwargs["region"] = settings.azure_speech_region
                indic_tts_kwargs["gender"] = settings.indic_tts_gender
            elif settings.indic_tts_provider == "bhashini_tts":
                indic_tts_kwargs["api_key"] = settings.bhashini_api_key
                indic_tts_kwargs["voice_gender"] = settings.bhashini_tts_gender
            elif settings.indic_tts_provider == "edge_indic":
                indic_tts_kwargs["gender"] = settings.indic_tts_gender
            
            tts = create_indic_tts_provider(settings.indic_tts_provider, **indic_tts_kwargs)
            logger.info("Using Indic TTS provider", provider=settings.indic_tts_provider)
        else:
            # Use standard TTS provider
            tts_kwargs = {}
            if settings.tts_provider == "elevenlabs":
                tts_kwargs["api_key"] = settings.elevenlabs_api_key
                tts_kwargs["voice_id"] = settings.elevenlabs_voice_id
            elif settings.tts_provider == "azure":
                pass  # Azure TTS uses default constructor
            tts = create_tts_provider(settings.tts_provider, **tts_kwargs)
        
        llm = create_llm_provider()
        
        # Indic Translation Provider
        indic_translation = None
        if settings.indic_translation_provider:
            indic_trans_kwargs = {}
            if settings.indic_translation_provider == "indictrans2":
                indic_trans_kwargs["base_url"] = settings.indictrans2_url
            elif settings.indic_translation_provider == "azure_translator":
                indic_trans_kwargs["subscription_key"] = settings.azure_translator_key
                indic_trans_kwargs["region"] = settings.azure_translator_region
                indic_trans_kwargs["endpoint"] = settings.azure_translator_endpoint
            elif settings.indic_translation_provider == "bhashini_translate":
                indic_trans_kwargs["api_key"] = settings.bhashini_api_key
            
            indic_translation = create_indic_translation_provider(
                settings.indic_translation_provider,
                **indic_trans_kwargs
            )
            logger.info("Using Indic translation provider", provider=settings.indic_translation_provider)
        
        # Pipeline mode
        pipeline_mode = PipelineMode.TRANSLATION if settings.default_pipeline_mode == "translation" else PipelineMode.AGENT
        
        app.state.pipeline = VoicePipeline(
            asr_provider=asr,
            tts_provider=tts,
            llm_provider=llm,
            session_manager=app.state.session_manager,
            translation_manager=app.state.translation_manager,
            indic_translation_provider=indic_translation,
            default_mode=pipeline_mode
        )
        
        await app.state.pipeline.initialize()
        await app.state.session_manager.start()
        
        logger.info(
            "Voice AI Platform initialized",
            asr_provider=settings.indic_asr_provider or settings.asr_provider,
            tts_provider=settings.indic_tts_provider or settings.tts_provider,
            llm_model=settings.llm_model,
            translation_provider=settings.indic_translation_provider or settings.translation_provider,
            pipeline_mode=pipeline_mode.value
        )
    except Exception as e:
        logger.error("Failed to initialize pipeline", error=str(e))
        # Create mock pipeline for development
        app.state.pipeline = None
    
    yield
    
    # Shutdown
    logger.info("Shutting down ClearSpeak AI")
    if hasattr(app.state, "pipeline") and app.state.pipeline:
        await app.state.pipeline.cleanup()
    if hasattr(app.state, "session_manager"):
        await app.state.session_manager.stop()


app = FastAPI(
    title="ClearSpeak AI - Voice Intelligence Platform",
    description="Enterprise-grade voice AI platform with real-time streaming, multi-language support, and MCP integration",
    version="2.0.0",
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None,
    openapi_url="/api/openapi.json" if settings.debug else None,
    lifespan=lifespan
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security middleware
if settings.app_env == "production":
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts)
    if settings.https_redirect:
        app.add_middleware(HTTPSRedirectMiddleware)

# CORS middleware - locked down for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-API-Key"],
)

# Prometheus instrumentation
if settings.prometheus_enabled:
    Instrumentator().instrument(app).expose(app, endpoint="/metrics")


# REST API Endpoints

@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the main UI."""
    import os
    frontend_path = "frontend-app/index.html" if os.path.exists("frontend-app/index.html") else "frontend/index.html"
    if os.path.exists(frontend_path):
        with open(frontend_path, "r") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>ClearSpeak AI - Backend Running</h1><p>API docs: <a href='/api/docs'>/api/docs</a></p>")


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint with provider status."""
    uptime = (datetime.now(timezone.utc) - START_TIME).total_seconds()
    
    return HealthResponse(
        status="healthy",
        version="2.0.0",
        uptime_seconds=uptime,
        active_sessions=await app.state.session_manager.get_active_sessions_count(),
        asr_provider=settings.indic_asr_provider or settings.asr_provider,
        tts_provider=settings.indic_tts_provider or settings.tts_provider,
        llm_model=settings.ollama_model if settings.llm_provider == "ollama" else settings.llm_model
    )


@app.get("/providers")
async def get_providers():
    """Get active provider configuration."""
    return {
        "asr": {
            "standard": settings.asr_provider,
            "indic": settings.indic_asr_provider,
            "active": settings.indic_asr_provider or settings.asr_provider,
        },
        "tts": {
            "standard": settings.tts_provider,
            "indic": settings.indic_tts_provider,
            "active": settings.indic_tts_provider or settings.tts_provider,
        },
        "llm": {
            "provider": settings.llm_provider,
            "model": settings.ollama_model if settings.llm_provider == "ollama" else settings.llm_model,
        },
        "translation": {
            "standard": settings.translation_provider,
            "indic": settings.indic_translation_provider,
            "active": settings.indic_translation_provider or settings.translation_provider,
        },
        "pipeline_mode": settings.default_pipeline_mode,
    }


@app.get("/metrics", response_class=HTMLResponse)
async def prometheus_metrics():
    """Prometheus metrics endpoint."""
    return generate_latest()


@app.post("/sessions", response_model=dict)
async def create_session(user_id: Optional[str] = None):
    """Create a new voice session."""
    session = await app.state.session_manager.create_session(user_id)
    app.state.metrics.sessions_active.inc()
    return {
        "session_id": session.session_id,
        "state": session.state.value,
        "created_at": session.created_at.isoformat()
    }


@app.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get session details."""
    session = await app.state.session_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session.session_id,
        "state": session.state.value,
        "total_turns": session.total_turns,
        "created_at": session.created_at.isoformat(),
        "last_activity": session.last_activity.isoformat()
    }


@app.delete("/sessions/{session_id}")
async def close_session(session_id: str):
    """Close a session."""
    success = await app.state.session_manager.close_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "closed"}


@app.get("/stats")
async def get_stats():
    """Get platform statistics."""
    session_manager = app.state.session_manager
    return {
        "active_sessions": await session_manager.get_active_sessions_count(),
        "total_sessions": 0,
        "total_errors": 0,
        "uptime_seconds": (datetime.now(timezone.utc) - START_TIME).total_seconds()
    }


# Chat API Endpoints

@app.get("/channels")
async def list_channels(user_id: Optional[str] = None):
    """List all channels."""
    channels = await app.state.chat_manager.list_channels(user_id)
    return {"channels": [ch.model_dump(mode='json') for ch in channels]}


@app.post("/channels", response_model=dict)
async def create_channel(
    name: str,
    description: Optional[str] = None,
    channel_type: ChannelType = ChannelType.PUBLIC,
    owner_id: str = "anonymous"
):
    """Create a new channel."""
    channel = await app.state.chat_manager.create_channel(
        name=name,
        owner_id=owner_id,
        description=description,
        channel_type=channel_type
    )
    return channel.model_dump(mode='json')


@app.get("/channels/{channel_id}")
async def get_channel(channel_id: str):
    """Get channel details."""
    channel = await app.state.chat_manager.get_channel(channel_id)
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    return channel.model_dump(mode='json')


@app.post("/channels/{channel_id}/join")
async def join_channel(channel_id: str, user_id: str):
    """Join a channel."""
    success = await app.state.chat_manager.join_channel(channel_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Channel not found")
    return {"status": "joined"}


@app.post("/channels/{channel_id}/leave")
async def leave_channel(channel_id: str, user_id: str):
    """Leave a channel."""
    success = await app.state.chat_manager.leave_channel(channel_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Channel not found")
    return {"status": "left"}


@app.get("/channels/{channel_id}/messages")
async def get_messages(
    channel_id: str,
    limit: int = 50,
    before: Optional[str] = None,
    after: Optional[str] = None
):
    """Get messages from a channel."""
    messages = await app.state.chat_manager.get_messages(
        channel_id=channel_id,
        limit=limit,
        before=before,
        after=after
    )
    return {"messages": [msg.model_dump(mode='json') for msg in messages]}


@app.post("/channels/{channel_id}/messages", response_model=dict)
async def send_message(
    channel_id: str,
    content: str,
    sender_id: str = "anonymous",
    sender_name: str = "Anonymous",
    message_type: MessageType = MessageType.TEXT,
    reply_to: Optional[str] = None
):
    """Send a message to a channel."""
    message = await app.state.chat_manager.send_message(
        channel_id=channel_id,
        sender_id=sender_id,
        sender_name=sender_name,
        content=content,
        message_type=message_type,
        reply_to=reply_to
    )
    if not message:
        raise HTTPException(status_code=404, detail="Channel not found")
    return message.model_dump(mode='json')


@app.put("/channels/{channel_id}/messages/{message_id}")
async def edit_message(
    channel_id: str,
    message_id: str,
    user_id: str,
    new_content: str
):
    """Edit a message."""
    success = await app.state.chat_manager.edit_message(
        channel_id=channel_id,
        message_id=message_id,
        user_id=user_id,
        new_content=new_content
    )
    if not success:
        raise HTTPException(status_code=404, detail="Message not found or unauthorized")
    return {"status": "edited"}


@app.delete("/channels/{channel_id}/messages/{message_id}")
async def delete_message(channel_id: str, message_id: str, user_id: str):
    """Delete a message."""
    success = await app.state.chat_manager.delete_message(
        channel_id=channel_id,
        message_id=message_id,
        user_id=user_id
    )
    if not success:
        raise HTTPException(status_code=404, detail="Message not found or unauthorized")
    return {"status": "deleted"}


@app.post("/channels/{channel_id}/messages/{message_id}/reaction")
async def add_reaction(
    channel_id: str,
    message_id: str,
    user_id: str,
    emoji: str
):
    """Add a reaction to a message."""
    success = await app.state.chat_manager.add_reaction(
        channel_id=channel_id,
        message_id=message_id,
        user_id=user_id,
        emoji=emoji
    )
    if not success:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"status": "reaction_added"}


@app.delete("/channels/{channel_id}/messages/{message_id}/reaction")
async def remove_reaction(
    channel_id: str,
    message_id: str,
    user_id: str,
    emoji: str
):
    """Remove a reaction from a message."""
    success = await app.state.chat_manager.remove_reaction(
        channel_id=channel_id,
        message_id=message_id,
        user_id=user_id,
        emoji=emoji
    )
    if not success:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"status": "reaction_removed"}


@app.get("/channels/{channel_id}/typing")
async def get_typing_users(channel_id: str):
    """Get users currently typing in a channel."""
    typing_users = await app.state.chat_manager.get_typing_users(channel_id)
    return {"typing": [t.model_dump(mode='json') for t in typing_users]}


@app.get("/users/online")
async def get_online_users():
    """Get all online users."""
    users = await app.state.chat_manager.get_online_users()
    return {"users": [u.model_dump(mode='json') for u in users]}


# Voice Call Endpoints

@app.post("/calls", response_model=dict)
async def create_call(caller_id: str, call_type: str = "direct"):
    """Create a new voice call."""
    call = await app.state.call_manager.create_call(caller_id, call_type)
    return call.to_dict()


@app.post("/calls/{call_id}/join")
async def join_call(call_id: str, user_id: str):
    """Join a voice call."""
    success = await app.state.call_manager.join_call(call_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Call not found or ended")
    return {"status": "joined"}


@app.post("/calls/{call_id}/leave")
async def leave_call(call_id: str, user_id: str):
    """Leave a voice call."""
    success = await app.state.call_manager.leave_call(call_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Call not found")
    return {"status": "left"}


@app.post("/calls/{call_id}/end")
async def end_call(call_id: str, user_id: str):
    """End a voice call."""
    success = await app.state.call_manager.end_call(call_id)
    if not success:
        raise HTTPException(status_code=404, detail="Call not found")
    return {"status": "ended"}


@app.post("/calls/{call_id}/mute")
async def mute_user(call_id: str, user_id: str, muted: bool = True):
    """Mute or unmute a user."""
    success = await app.state.call_manager.mute_user(call_id, user_id, muted)
    if not success:
        raise HTTPException(status_code=404, detail="Call or user not found")
    return {"status": "muted" if muted else "unmuted"}


@app.post("/calls/{call_id}/screen-share")
async def toggle_screen_share(call_id: str, user_id: str):
    """Toggle screen sharing."""
    call = await app.state.call_manager.get_call(call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    if call.is_screen_sharing == user_id:
        await app.state.call_manager.stop_screen_share(call_id, user_id)
        return {"status": "stopped"}
    else:
        success = await app.state.call_manager.start_screen_share(call_id, user_id)
        if not success:
            raise HTTPException(status_code=400, detail="Cannot start screen share")
        return {"status": "started"}


@app.post("/calls/{call_id}/recording")
async def toggle_recording(call_id: str, user_id: str):
    """Toggle call recording."""
    success = await app.state.call_manager.toggle_recording(call_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Call not found or not admin")
    return {"status": "toggled"}


@app.get("/calls/{call_id}")
async def get_call(call_id: str):
    """Get call details."""
    call = await app.state.call_manager.get_call(call_id)
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    return call.to_dict()


@app.get("/calls")
async def list_active_calls():
    """List all active calls."""
    calls = await app.state.call_manager.list_active_calls()
    return {"calls": [call.to_dict() for call in calls]}


@app.get("/calls/history")
async def get_call_history(limit: int = 50):
    """Get call history."""
    history = await app.state.call_manager.get_call_history(limit)
    return {"history": history}


# Translation Endpoints

@app.post("/translate")
async def translate_text(
    text: str,
    target_language: str,
    source_language: Optional[str] = None
):
    """Translate text to target language."""
    translated = await app.state.translation_manager.translate(
        text, target_language, source_language
    )
    return {"translated_text": translated, "target_language": target_language}


@app.get("/languages")
async def get_supported_languages():
    """Get list of supported languages."""
    languages = app.state.translation_manager.get_supported_languages()
    return {"languages": languages}


@app.post("/user-language")
async def set_user_language(user_id: str, language: str):
    """Set preferred language for a user."""
    app.state.translation_manager.set_user_language(user_id, language)
    return {"status": "set", "language": language}


@app.get("/user-language/{user_id}")
async def get_user_language(user_id: str):
    """Get preferred language for a user."""
    language = app.state.translation_manager.get_user_language(user_id)
    return {"user_id": user_id, "language": language}


# Indic Translation Endpoints

@app.post("/translate/indic")
async def translate_indic_text(
    text: str,
    source_language: str,
    target_language: str
):
    """
    Translate text using Indic translation providers.
    
    Supports all 22 Scheduled Languages of India via IndicTrans2,
    Azure Translator, or Bhashini.
    """
    if not app.state.pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not initialized")
    
    translated = await app.state.pipeline.translate_text(
        text, source_language, target_language
    )
    
    return {
        "translated_text": translated,
        "source_language": source_language,
        "target_language": target_language,
        "provider": settings.indic_translation_provider or "local"
    }


@app.get("/languages/indic")
async def get_indic_languages():
    """Get all 22 Scheduled Languages of India."""
    if app.state.translation_manager:
        india_langs = app.state.translation_manager.get_india_languages()
        return {"languages": india_langs}
    return {"languages": {}}


@app.post("/translation-mode/set")
async def set_translation_languages(
    session_id: str,
    source_language: str,
    target_language: str
):
    """
    Set languages for real-time translation mode (S2ST).
    
    Once set, the pipeline will translate audio from source to target language.
    """
    if not app.state.pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not initialized")
    
    await app.state.pipeline.set_translation_languages(
        session_id, source_language, target_language
    )
    
    return {
        "session_id": session_id,
        "source_language": source_language,
        "target_language": target_language,
        "mode": "translation"
    }


@app.get("/translation-mode/{session_id}")
async def get_translation_info(session_id: str):
    """Get current translation session info."""
    if not app.state.pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not initialized")
    
    info = await app.state.pipeline.get_translation_info(session_id)
    return {"session_id": session_id, "translation_info": info}


# Live Streaming Endpoints

@app.post("/streams", response_model=dict)
async def create_stream(
    broadcaster_id: str,
    title: str,
    description: Optional[str] = None,
    tags: Optional[List[str]] = None
):
    """Create a new live stream."""
    stream = await app.state.stream_manager.create_stream(
        broadcaster_id, title, description, tags
    )
    return stream.to_dict()


@app.post("/streams/{stream_id}/start")
async def start_stream(stream_id: str, broadcaster_id: str):
    """Start a live stream."""
    success = await app.state.stream_manager.start_stream(stream_id, broadcaster_id)
    if not success:
        raise HTTPException(status_code=404, detail="Stream not found")
    return {"status": "started"}


@app.post("/streams/{stream_id}/end")
async def end_stream(stream_id: str, broadcaster_id: str):
    """End a live stream."""
    success = await app.state.stream_manager.end_stream(stream_id, broadcaster_id)
    if not success:
        raise HTTPException(status_code=404, detail="Stream not found")
    return {"status": "ended"}


@app.post("/streams/{stream_id}/join")
async def join_stream(stream_id: str, user_id: str):
    """Join a live stream as a viewer."""
    success = await app.state.stream_manager.join_stream(stream_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Stream not found or not live")
    return {"status": "joined"}


@app.post("/streams/{stream_id}/leave")
async def leave_stream(stream_id: str, user_id: str):
    """Leave a live stream."""
    success = await app.state.stream_manager.leave_stream(stream_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Stream not found")
    return {"status": "left"}


@app.post("/streams/{stream_id}/chat")
async def send_stream_chat(
    stream_id: str,
    user_id: str,
    username: str,
    message: str
):
    """Send a chat message during a stream."""
    chat_msg = await app.state.stream_manager.send_chat_message(
        stream_id, user_id, username, message
    )
    if not chat_msg:
        raise HTTPException(status_code=404, detail="Stream not found or chat disabled")
    return chat_msg


@app.get("/streams/{stream_id}")
async def get_stream(stream_id: str):
    """Get stream details."""
    stream = await app.state.stream_manager.get_stream(stream_id)
    if not stream:
        raise HTTPException(status_code=404, detail="Stream not found")
    return stream.to_dict()


@app.get("/streams")
async def list_live_streams():
    """List all live streams."""
    streams = await app.state.stream_manager.list_live_streams()
    return {"streams": [s.to_dict() for s in streams]}


@app.get("/streams/{stream_id}/analytics")
async def get_stream_analytics(stream_id: str):
    """Get stream analytics."""
    analytics = await app.state.stream_manager.get_stream_analytics(stream_id)
    return analytics


# AI Agents Endpoints

@app.post("/agents", response_model=dict)
async def create_agent(
    name: str,
    agent_type: str,
    owner_id: str,
    description: Optional[str] = None,
    system_prompt: Optional[str] = None,
    model: str = "gpt-4",
    temperature: float = 0.7,
    tools: Optional[List[str]] = None
):
    """Create a new AI agent."""
    agent = await app.state.agent_manager.create_agent(
        name, agent_type, owner_id, description, system_prompt, model, temperature, tools
    )
    return agent.to_dict()


@app.post("/agents/{agent_id}/activate")
async def activate_agent(agent_id: str):
    """Activate an agent."""
    success = await app.state.agent_manager.activate_agent(agent_id)
    if not success:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"status": "activated"}


@app.post("/agents/{agent_id}/deactivate")
async def deactivate_agent(agent_id: str):
    """Deactivate an agent."""
    success = await app.state.agent_manager.deactivate_agent(agent_id)
    if not success:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"status": "deactivated"}


@app.post("/agents/{agent_id}/message")
async def send_agent_message(agent_id: str, user_id: str, message: str):
    """Send a message to an agent."""
    response = await app.state.agent_manager.send_message(agent_id, user_id, message)
    if not response:
        raise HTTPException(status_code=404, detail="Agent not found or inactive")
    return {"response": response}


@app.get("/agents/{agent_id}")
async def get_agent(agent_id: str):
    """Get agent details."""
    agent = await app.state.agent_manager.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent.to_dict()


@app.get("/agents")
async def list_agents(agent_type: Optional[str] = None, state: Optional[str] = None):
    """List all agents."""
    agents = await app.state.agent_manager.list_agents(agent_type, state)
    return {"agents": [a.to_dict() for a in agents]}


@app.get("/agents/{agent_id}/analytics")
async def get_agent_analytics(agent_id: str):
    """Get agent analytics."""
    analytics = await app.state.agent_manager.get_agent_analytics(agent_id)
    return analytics


@app.delete("/agents/{agent_id}")
async def delete_agent(agent_id: str):
    """Delete an agent."""
    success = await app.state.agent_manager.delete_agent(agent_id)
    if not success:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"status": "deleted"}


# Spatial Awareness Endpoints

@app.post("/spatial/objects")
async def register_spatial_object(
    name: str,
    object_type: str,
    position: dict,
    description: Optional[str] = None,
    audio_feedback: Optional[str] = None
):
    """Register a spatial object."""
    obj = await app.state.spatial_manager.register_object(
        name, object_type, position, description, audio_feedback
    )
    return obj.to_dict()


@app.post("/spatial/gesture")
async def process_gesture(user_id: str, gesture: str):
    """Process a gesture."""
    action = await app.state.spatial_manager.process_gesture(user_id, gesture)
    if not action:
        raise HTTPException(status_code=400, detail="Unknown gesture")
    return {"gesture": gesture, "action": action}


@app.post("/spatial/voice-command")
async def process_voice_command(user_id: str, command: str):
    """Process a voice command."""
    action = await app.state.spatial_manager.process_voice_command(user_id, command)
    if not action:
        raise HTTPException(status_code=400, detail="Unknown command")
    return {"command": command, "action": action}


@app.post("/spatial/settings")
async def set_accessibility_settings(user_id: str, settings: dict):
    """Set accessibility settings."""
    success = await app.state.spatial_manager.set_user_settings(user_id, settings)
    return {"status": "set"}


@app.get("/spatial/settings/{user_id}")
async def get_accessibility_settings(user_id: str):
    """Get accessibility settings."""
    settings = await app.state.spatial_manager.get_user_settings(user_id)
    return settings


@app.get("/spatial/shortcuts")
async def get_keyboard_shortcuts():
    """Get keyboard shortcuts."""
    shortcuts = await app.state.spatial_manager.get_keyboard_shortcuts()
    return {"shortcuts": shortcuts}


@app.get("/spatial/nearby")
async def get_nearby_objects(x: float, y: float, z: float, radius: float = 10.0):
    """Get nearby spatial objects."""
    position = {"x": x, "y": y, "z": z}
    objects = await app.state.spatial_manager.get_nearby_objects(position, radius)
    return {"objects": [o.to_dict() for o in objects]}


@app.post("/clone-voice")
async def clone_voice(
    audio: UploadFile = File(...),
    text: str = Form("Hello, this is a test of voice cloning.")
):
    """
    Clone a voice from uploaded audio and synthesize text.
    
    - Upload a 6-30 second audio sample of the voice to clone
    - Provide text to speak in that voice
    - Returns audio data synthesized in the cloned voice
    """
    import tempfile
    import os
    from fastapi.responses import StreamingResponse
    
    # Get or initialize TTS provider for cloning (cache on app.state)
    tts_provider = None
    if app.state.pipeline and hasattr(app.state.pipeline.tts, 'synthesize_with_clone'):
        tts_provider = app.state.pipeline.tts
    elif hasattr(app.state, 'clone_tts_provider') and app.state.clone_tts_provider:
        # Reuse cached TTS provider
        tts_provider = app.state.clone_tts_provider
    else:
        # Initialize TTS once and cache it
        try:
            if settings.tts_provider == "coqui":
                from backend.tts.base import create_tts_provider
                tts_provider = create_tts_provider("coqui")
                await tts_provider.initialize()
                app.state.clone_tts_provider = tts_provider
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Voice cloning requires Coqui TTS provider. Current provider: {settings.tts_provider}. Set TTS_PROVIDER=coqui in .env"
                )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to initialize TTS for cloning: {str(e)}"
            )
    
    if not tts_provider or not hasattr(tts_provider, 'synthesize_with_clone'):
        raise HTTPException(
            status_code=400,
            detail="Voice cloning requires Coqui TTS provider. Set TTS_PROVIDER=coqui in .env"
        )
    
    if not audio:
        raise HTTPException(status_code=400, detail="Audio sample required for voice cloning")
    
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Text to synthesize is required")
    
    # Read audio bytes from the uploaded file
    audio_bytes = await audio.read()
    
    # Save audio to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name
    
    # Clone voice and synthesize — collect all audio before returning
    # so the temp file isn't deleted before it's read
    async def generate_audio():
        try:
            async for chunk in tts_provider.synthesize_with_clone(
                text, tmp_path, language="en"
            ):
                yield chunk
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    return StreamingResponse(
        generate_audio(),
        media_type="audio/wav",
        headers={"Content-Disposition": f"attachment; filename=cloned_voice.wav"}
    )


@app.get("/voices")
async def get_voices():
    """Get available TTS voices."""
    if not app.state.pipeline:
        raise HTTPException(status_code=503, detail="Pipeline not initialized")
    
    voices = await app.state.pipeline.tts.get_voices()
    return {"voices": voices, "provider": settings.tts_provider}


# WebSocket endpoint

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str, user_id: Optional[str] = None):
    """
    WebSocket endpoint for real-time voice streaming and chat.
    
    Protocol:
    - Client sends audio/text messages
    - Server responds with audio/text/control messages
    - Chat messages supported via chat_message type
    
    Message types:
    - audio: Base64 encoded audio data
    - text: Text message
    - control: Control commands (pause, resume, interrupt, end)
    - chat_message: Chat message to a channel
    - typing: Typing indicator
    - read_receipt: Read receipt
    - reaction: Message reaction
    - heartbeat: Keepalive ping
    """
    handler = VoiceWebSocketHandler(
        pipeline=app.state.pipeline,
        session_manager=app.state.session_manager,
        chat_manager=app.state.chat_manager
    )
    await handler.handle_connection(websocket, session_id, user_id)


# Mount static files - must be last to avoid catching API routes
# Only mount if the frontend directory exists
import os
if os.path.exists("frontend"):
    app.mount("/static", StaticFiles(directory="frontend"), name="static")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "backend.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
