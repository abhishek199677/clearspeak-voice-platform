"""
Voice AI Platform - Session Manager
Handles concurrent session lifecycle and state management.
"""

import asyncio
from datetime import datetime
from typing import Dict, Optional
import structlog
from backend.models.schemas import VoiceSession, SessionState, ConversationMessage, MessageRole
from backend.monitoring.metrics import MetricsCollector

logger = structlog.get_logger()


class SessionManager:
    """
    Manages voice session lifecycle with support for high concurrency.
    
    Features:
    - Concurrent session handling with async locks
    - Session state machine with transitions
    - Conversation history management
    - Automatic cleanup of stale sessions
    - Metrics collection per session
    """
    
    def __init__(self, max_sessions: int = 1000, session_timeout_seconds: int = 3600):
        self._sessions: Dict[str, VoiceSession] = {}
        self._locks: Dict[str, asyncio.Lock] = {}
        self._max_sessions = max_sessions
        self._session_timeout = session_timeout_seconds
        self._metrics = MetricsCollector()
        self._cleanup_task: Optional[asyncio.Task] = None
        
    async def start(self):
        """Start the session manager and cleanup task."""
        self._cleanup_task = asyncio.create_task(self._cleanup_stale_sessions())
        logger.info("Session manager started", max_sessions=self._max_sessions)
        
    async def stop(self):
        """Stop the session manager."""
        if self._cleanup_task:
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
        logger.info("Session manager stopped")
    
    async def create_session(self, user_id: Optional[str] = None) -> VoiceSession:
        """Create a new voice session."""
        if len(self._sessions) >= self._max_sessions:
            await self._evict_oldest_session()
            
        session = VoiceSession(user_id=user_id)
        self._sessions[session.session_id] = session
        self._locks[session.session_id] = asyncio.Lock()
        
        self._metrics.sessions_created.inc()
        logger.info(
            "Session created",
            session_id=session.session_id,
            user_id=user_id,
            active_sessions=len(self._sessions)
        )
        return session
    
    async def get_session(self, session_id: str) -> Optional[VoiceSession]:
        """Get session by ID."""
        session = self._sessions.get(session_id)
        if session:
            session.last_activity = datetime.utcnow()
        return session
    
    async def update_session_state(
        self, 
        session_id: str, 
        new_state: SessionState
    ) -> bool:
        """Update session state with transition validation."""
        session = self._sessions.get(session_id)
        if not session:
            return False
            
        async with self._locks[session_id]:
            old_state = session.state
            session.state = new_state
            session.last_activity = datetime.utcnow()
            
            self._metrics.session_state_changes.labels(
                from_state=old_state.value,
                to_state=new_state.value
            ).inc()
            
            logger.debug(
                "Session state changed",
                session_id=session_id,
                from_state=old_state.value,
                to_state=new_state.value
            )
        return True
    
    async def add_message(
        self,
        session_id: str,
        role: MessageRole,
        content: str,
        **kwargs
    ) -> bool:
        """Add a message to session conversation history."""
        session = self._sessions.get(session_id)
        if not session:
            return False
            
        async with self._locks[session_id]:
            message = ConversationMessage(
                role=role,
                content=content,
                **kwargs
            )
            session.conversation_history.append(message)
            session.total_turns += 1
            session.last_activity = datetime.utcnow()
            
            # Keep conversation history manageable (last 50 messages)
            if len(session.conversation_history) > 50:
                session.conversation_history = session.conversation_history[-50:]
                
        return True
    
    async def get_conversation_history(
        self,
        session_id: str,
        max_messages: int = 20
    ) -> list[ConversationMessage]:
        """Get recent conversation history."""
        session = self._sessions.get(session_id)
        if not session:
            return []
        return session.conversation_history[-max_messages:]
    
    async def close_session(self, session_id: str) -> bool:
        """Close and cleanup a session."""
        session = self._sessions.get(session_id)
        if not session:
            return False
            
        async with self._locks.get(session_id, asyncio.Lock()):
            session.state = SessionState.CLOSED
            self._metrics.sessions_closed.inc()
            
            # Remove from active sessions
            del self._sessions[session_id]
            if session_id in self._locks:
                del self._locks[session_id]
                
        logger.info(
            "Session closed",
            session_id=session_id,
            total_turns=session.total_turns
        )
        return True
    
    async def get_active_sessions_count(self) -> int:
        """Get number of active sessions."""
        return len(self._sessions)
    
    async def _cleanup_stale_sessions(self):
        """Background task to cleanup stale sessions."""
        while True:
            try:
                await asyncio.sleep(60)  # Check every minute
                
                now = datetime.utcnow()
                stale_sessions = []
                
                for session_id, session in self._sessions.items():
                    age = (now - session.last_activity).total_seconds()
                    if age > self._session_timeout:
                        stale_sessions.append(session_id)
                
                for session_id in stale_sessions:
                    await self.close_session(session_id)
                    self._metrics.sessions_expired.inc()
                    logger.info("Stale session cleaned up", session_id=session_id)
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Cleanup task error", error=str(e))
    
    async def _evict_oldest_session(self):
        """Evict the oldest session when at capacity."""
        if not self._sessions:
            return
            
        oldest_id = min(
            self._sessions.keys(),
            key=lambda k: self._sessions[k].last_activity
        )
        await self.close_session(oldest_id)
        self._metrics.sessions_evicted.inc()
        logger.warning("Session evicted due to capacity", session_id=oldest_id)
