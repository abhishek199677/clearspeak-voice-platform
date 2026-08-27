"""Live Streaming Manager for real-time broadcasting."""

import asyncio
import uuid
from typing import Dict, List, Optional, Set
from datetime import datetime
import structlog

logger = structlog.get_logger()


class StreamState:
    """Stream states."""
    SCHEDULED = "scheduled"
    PREPARING = "preparing"
    LIVE = "live"
    PAUSED = "paused"
    ENDING = "ending"
    ENDED = "ended"


class LiveStream:
    """Represents a live stream."""
    
    def __init__(
        self,
        stream_id: str,
        broadcaster_id: str,
        title: str,
        description: Optional[str] = None
    ):
        self.stream_id = stream_id
        self.broadcaster_id = broadcaster_id
        self.title = title
        self.description = description
        self.state = StreamState.SCHEDULED
        self.viewers: Set[str] = set()
        self.max_viewers: int = 0
        self.created_at = datetime.utcnow()
        self.started_at: Optional[datetime] = None
        self.ended_at: Optional[datetime] = None
        self.duration_seconds: float = 0
        self.chat_enabled: bool = True
        self.chat_messages: List[dict] = []
        self.stream_url: Optional[str] = None
        self.thumbnail_url: Optional[str] = None
        self.tags: List[str] = []
        
    def to_dict(self) -> dict:
        return {
            "stream_id": self.stream_id,
            "broadcaster_id": self.broadcaster_id,
            "title": self.title,
            "description": self.description,
            "state": self.state,
            "viewer_count": len(self.viewers),
            "max_viewers": self.max_viewers,
            "created_at": self.created_at.isoformat(),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
            "duration_seconds": self.duration_seconds,
            "chat_enabled": self.chat_enabled,
            "stream_url": self.stream_url,
            "thumbnail_url": self.thumbnail_url,
            "tags": self.tags
        }


class StreamManager:
    """
    Manages live streams.
    
    Features:
    - Stream creation and management
    - Viewer management
    - Chat during streams
    - Stream scheduling
    - Analytics
    """
    
    def __init__(self):
        self._streams: Dict[str, LiveStream] = {}
        self._user_streams: Dict[str, str] = {}  # user_id -> stream_id (if broadcasting)
        self._viewer_streams: Dict[str, str] = {}  # user_id -> stream_id (if viewing)
        self._scheduled_streams: List[dict] = []
        
    async def create_stream(
        self,
        broadcaster_id: str,
        title: str,
        description: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> LiveStream:
        """Create a new live stream."""
        stream_id = f"stream-{uuid.uuid4().hex[:12]}"
        stream = LiveStream(stream_id, broadcaster_id, title, description)
        stream.tags = tags or []
        
        self._streams[stream_id] = stream
        self._user_streams[broadcaster_id] = stream_id
        
        logger.info("Stream created", stream_id=stream_id, broadcaster_id=broadcaster_id)
        return stream
    
    async def start_stream(self, stream_id: str, broadcaster_id: str) -> bool:
        """Start a live stream."""
        stream = self._streams.get(stream_id)
        if not stream or stream.broadcaster_id != broadcaster_id:
            return False
        
        stream.state = StreamState.LIVE
        stream.started_at = datetime.utcnow()
        
        logger.info("Stream started", stream_id=stream_id)
        return True
    
    async def end_stream(self, stream_id: str, broadcaster_id: str) -> bool:
        """End a live stream."""
        stream = self._streams.get(stream_id)
        if not stream or stream.broadcaster_id != broadcaster_id:
            return False
        
        stream.state = StreamState.ENDED
        stream.ended_at = datetime.utcnow()
        
        if stream.started_at:
            stream.duration_seconds = (stream.ended_at - stream.started_at).total_seconds()
        
        # Remove broadcaster mapping
        self._user_streams.pop(broadcaster_id, None)
        
        # Remove all viewers
        for viewer_id in list(stream.viewers):
            self._viewer_streams.pop(viewer_id, None)
        stream.viewers.clear()
        
        logger.info("Stream ended", stream_id=stream_id, duration=stream.duration_seconds)
        return True
    
    async def pause_stream(self, stream_id: str, broadcaster_id: str) -> bool:
        """Pause a live stream."""
        stream = self._streams.get(stream_id)
        if not stream or stream.broadcaster_id != broadcaster_id:
            return False
        
        if stream.state == StreamState.LIVE:
            stream.state = StreamState.PAUSED
            logger.info("Stream paused", stream_id=stream_id)
            return True
        
        return False
    
    async def resume_stream(self, stream_id: str, broadcaster_id: str) -> bool:
        """Resume a paused stream."""
        stream = self._streams.get(stream_id)
        if not stream or stream.broadcaster_id != broadcaster_id:
            return False
        
        if stream.state == StreamState.PAUSED:
            stream.state = StreamState.LIVE
            logger.info("Stream resumed", stream_id=stream_id)
            return True
        
        return False
    
    async def join_stream(self, stream_id: str, user_id: str) -> bool:
        """Join a live stream as a viewer."""
        stream = self._streams.get(stream_id)
        if not stream or stream.state != StreamState.LIVE:
            return False
        
        stream.viewers.add(user_id)
        self._viewer_streams[user_id] = stream_id
        
        # Update max viewers
        if len(stream.viewers) > stream.max_viewers:
            stream.max_viewers = len(stream.viewers)
        
        logger.info("Viewer joined", stream_id=stream_id, user_id=user_id)
        return True
    
    async def leave_stream(self, stream_id: str, user_id: str) -> bool:
        """Leave a live stream."""
        stream = self._streams.get(stream_id)
        if not stream:
            return False
        
        stream.viewers.discard(user_id)
        self._viewer_streams.pop(user_id, None)
        
        logger.info("Viewer left", stream_id=stream_id, user_id=user_id)
        return True
    
    async def send_chat_message(
        self,
        stream_id: str,
        user_id: str,
        username: str,
        message: str
    ) -> Optional[dict]:
        """Send a chat message during a stream."""
        stream = self._streams.get(stream_id)
        if not stream or not stream.chat_enabled:
            return None
        
        chat_msg = {
            "message_id": str(uuid.uuid4()),
            "user_id": user_id,
            "username": username,
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        stream.chat_messages.append(chat_msg)
        
        # Keep only last 1000 messages
        if len(stream.chat_messages) > 1000:
            stream.chat_messages = stream.chat_messages[-1000:]
        
        return chat_msg
    
    async def toggle_chat(self, stream_id: str, broadcaster_id: str) -> bool:
        """Toggle chat enabled/disabled."""
        stream = self._streams.get(stream_id)
        if not stream or stream.broadcaster_id != broadcaster_id:
            return False
        
        stream.chat_enabled = not stream.chat_enabled
        logger.info("Chat toggled", stream_id=stream_id, enabled=stream.chat_enabled)
        return True
    
    async def get_stream(self, stream_id: str) -> Optional[LiveStream]:
        """Get stream by ID."""
        return self._streams.get(stream_id)
    
    async def get_user_stream(self, user_id: str) -> Optional[LiveStream]:
        """Get stream a user is broadcasting."""
        stream_id = self._user_streams.get(user_id)
        if stream_id:
            return self._streams.get(stream_id)
        return None
    
    async def get_viewing_stream(self, user_id: str) -> Optional[LiveStream]:
        """Get stream a user is viewing."""
        stream_id = self._viewer_streams.get(user_id)
        if stream_id:
            return self._streams.get(stream_id)
        return None
    
    async def list_live_streams(self) -> List[LiveStream]:
        """List all live streams."""
        return [
            stream for stream in self._streams.values()
            if stream.state == StreamState.LIVE
        ]
    
    async def list_user_streams(self, user_id: str) -> List[LiveStream]:
        """List streams by a user."""
        return [
            stream for stream in self._streams.values()
            if stream.broadcaster_id == user_id
        ]
    
    async def get_stream_viewers(self, stream_id: str) -> List[str]:
        """Get list of viewers in a stream."""
        stream = self._streams.get(stream_id)
        if not stream:
            return []
        return list(stream.viewers)
    
    async def get_stream_chat_history(
        self,
        stream_id: str,
        limit: int = 100
    ) -> List[dict]:
        """Get chat history for a stream."""
        stream = self._streams.get(stream_id)
        if not stream:
            return []
        return stream.chat_messages[-limit:]
    
    async def schedule_stream(
        self,
        broadcaster_id: str,
        title: str,
        scheduled_at: datetime,
        description: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> dict:
        """Schedule a future stream."""
        scheduled = {
            "broadcaster_id": broadcaster_id,
            "title": title,
            "description": description,
            "scheduled_at": scheduled_at.isoformat(),
            "tags": tags or []
        }
        self._scheduled_streams.append(scheduled)
        logger.info("Stream scheduled", broadcaster_id=broadcaster_id, scheduled_at=scheduled_at)
        return scheduled
    
    async def get_stream_analytics(self, stream_id: str) -> dict:
        """Get analytics for a stream."""
        stream = self._streams.get(stream_id)
        if not stream:
            return {}
        
        return {
            "stream_id": stream.stream_id,
            "total_viewers": stream.max_viewers,
            "current_viewers": len(stream.viewers),
            "duration_seconds": stream.duration_seconds,
            "chat_messages": len(stream.chat_messages),
            "started_at": stream.started_at.isoformat() if stream.started_at else None,
            "ended_at": stream.ended_at.isoformat() if stream.ended_at else None
        }
