"""
Voice AI Platform - Pydantic Models
Data schemas for request/response and internal state management.
"""

from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
import uuid


class AudioFormat(str, Enum):
    """Supported audio formats."""
    PCM = "pcm"
    WAV = "wav"
    MP3 = "mp3"
    OGG = "ogg"


class MessageRole(str, Enum):
    """Message roles in conversation."""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"


class VoiceMessage(BaseModel):
    """WebSocket message for voice streaming."""
    type: str = Field(..., description="Message type: audio, text, control")
    session_id: Optional[str] = None
    audio_data: Optional[str] = None  # Base64 encoded
    text: Optional[str] = None
    format: AudioFormat = AudioFormat.PCM
    sample_rate: int = 16000
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TranscriptMessage(BaseModel):
    """ASR transcript message."""
    session_id: str
    transcript: str
    confidence: float
    is_final: bool
    speaker_id: Optional[str] = None
    language: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ConversationMessage(BaseModel):
    """Single message in conversation history."""
    role: MessageRole
    content: str
    name: Optional[str] = None
    tool_call_id: Optional[str] = None
    tool_calls: Optional[List[Dict[str, Any]]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ToolCall(BaseModel):
    """Tool call request from LLM."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    arguments: Dict[str, Any]


class ToolResult(BaseModel):
    """Result from tool execution."""
    tool_call_id: str
    name: str
    result: Any
    success: bool
    error: Optional[str] = None
    execution_time_ms: float = 0


class SessionState(str, Enum):
    """Session lifecycle states."""
    INITIALIZING = "initializing"
    READY = "ready"
    LISTENING = "listening"
    PROCESSING = "processing"
    SPEAKING = "speaking"
    WAITING = "waiting"
    ERROR = "error"
    CLOSED = "closed"


class VoiceSession(BaseModel):
    """Voice session state and metadata."""
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    state: SessionState = SessionState.INITIALIZING
    conversation_history: List[ConversationMessage] = []
    context: Dict[str, Any] = {}
    language: str = "en"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    
    # Metrics
    total_turns: int = 0
    total_audio_duration_ms: float = 0
    avg_latency_ms: float = 0
    error_count: int = 0


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str
    uptime_seconds: float
    active_sessions: int
    asr_provider: str
    tts_provider: str
    llm_model: str


class MetricsResponse(BaseModel):
    """Metrics response."""
    total_sessions: int
    active_sessions: int
    total_conversations: int
    avg_latency_ms: float
    error_rate: float
    audio_processed_hours: float


# Chat and Messaging Models

class MessageType(str, Enum):
    """Chat message types."""
    TEXT = "text"
    AUDIO = "audio"
    VIDEO = "video"
    IMAGE = "image"
    FILE = "file"
    SYSTEM = "system"


class UserPresence(str, Enum):
    """User presence status."""
    ONLINE = "online"
    AWAY = "away"
    BUSY = "busy"
    OFFLINE = "offline"


class ChannelType(str, Enum):
    """Channel types."""
    DIRECT = "direct"
    GROUP = "group"
    PUBLIC = "public"
    PRIVATE = "private"


class ChatMessage(BaseModel):
    """Chat message in a channel."""
    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    channel_id: str
    sender_id: str
    sender_name: str
    content: str
    message_type: MessageType = MessageType.TEXT
    reply_to: Optional[str] = None
    reactions: Dict[str, List[str]] = {}
    edited: bool = False
    deleted: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None


class ChatChannel(BaseModel):
    """Chat channel."""
    channel_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    channel_type: ChannelType = ChannelType.PUBLIC
    owner_id: str
    members: List[str] = []
    admins: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_message_at: Optional[datetime] = None
    pinned_messages: List[str] = []


class User(BaseModel):
    """User model."""
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    display_name: str
    email: Optional[str] = None
    avatar_url: Optional[str] = None
    presence: UserPresence = UserPresence.OFFLINE
    status: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_seen: Optional[datetime] = None


class TypingIndicator(BaseModel):
    """Typing indicator."""
    channel_id: str
    user_id: str
    username: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ReadReceipt(BaseModel):
    """Read receipt for messages."""
    channel_id: str
    user_id: str
    last_read_message_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class Reaction(BaseModel):
    """Message reaction."""
    message_id: str
    channel_id: str
    user_id: str
    emoji: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
