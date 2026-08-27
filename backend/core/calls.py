"""Voice Call Manager for real-time voice calls."""

import asyncio
import uuid
from typing import Dict, List, Optional, Set
from datetime import datetime
import structlog
from backend.models.schemas import UserPresence

logger = structlog.get_logger()


class CallState:
    """Call states."""
    RINGING = "ringing"
    CONNECTING = "connecting"
    ACTIVE = "active"
    ON_HOLD = "on_hold"
    ENDING = "ending"
    ENDED = "ended"


class CallType:
    """Call types."""
    DIRECT = "direct"
    GROUP = "group"
    VIDEO = "video"


class VoiceCall:
    """Represents a voice call."""
    
    def __init__(
        self,
        call_id: str,
        caller_id: str,
        call_type: str = CallType.DIRECT
    ):
        self.call_id = call_id
        self.caller_id = caller_id
        self.call_type = call_type
        self.state = CallState.RINGING
        self.participants: Set[str] = {caller_id}
        self.admin_id = caller_id
        self.created_at = datetime.utcnow()
        self.started_at: Optional[datetime] = None
        self.ended_at: Optional[datetime] = None
        self.duration_seconds: float = 0
        self.is_muted: Dict[str, bool] = {}
        self.is_speaking: Dict[str, bool] = {}
        self.is_screen_sharing: Optional[str] = None
        self.is_recording: bool = False
        self.recording_url: Optional[str] = None
        
    def to_dict(self) -> dict:
        return {
            "call_id": self.call_id,
            "caller_id": self.caller_id,
            "call_type": self.call_type,
            "state": self.state,
            "participants": list(self.participants),
            "admin_id": self.admin_id,
            "created_at": self.created_at.isoformat(),
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
            "duration_seconds": self.duration_seconds,
            "is_muted": self.is_muted,
            "is_screen_sharing": self.is_screen_sharing,
            "is_recording": self.is_recording
        }


class CallManager:
    """
    Manages voice calls.
    
    Features:
    - Call creation and management
    - Participant management
    - Call controls (mute, hold, screen share, recording)
    - Call history
    """
    
    def __init__(self):
        self._calls: Dict[str, VoiceCall] = {}
        self._user_calls: Dict[str, str] = {}  # user_id -> call_id
        self._call_history: List[dict] = []
        
    async def create_call(
        self,
        caller_id: str,
        call_type: str = CallType.DIRECT
    ) -> VoiceCall:
        """Create a new voice call."""
        call_id = f"call-{uuid.uuid4().hex[:12]}"
        call = VoiceCall(call_id, caller_id, call_type)
        self._calls[call_id] = call
        self._user_calls[caller_id] = call_id
        
        logger.info("Call created", call_id=call_id, caller_id=caller_id)
        return call
    
    async def join_call(self, call_id: str, user_id: str) -> bool:
        """Join an existing call."""
        call = self._calls.get(call_id)
        if not call:
            return False
        
        if call.state == CallState.ENDED:
            return False
        
        call.participants.add(user_id)
        self._user_calls[user_id] = call_id
        
        if call.state == CallState.RINGING and len(call.participants) > 1:
            call.state = CallState.CONNECTING
            call.started_at = datetime.utcnow()
            await asyncio.sleep(1)  # Simulate connection
            call.state = CallState.ACTIVE
        
        logger.info("User joined call", call_id=call_id, user_id=user_id)
        return True
    
    async def leave_call(self, call_id: str, user_id: str) -> bool:
        """Leave a call."""
        call = self._calls.get(call_id)
        if not call:
            return False
        
        call.participants.discard(user_id)
        self._user_calls.pop(user_id, None)
        
        # If admin leaves, end the call
        if user_id == call.admin_id:
            await self.end_call(call_id)
        # If no participants left, end the call
        elif len(call.participants) == 0:
            await self.end_call(call_id)
        
        logger.info("User left call", call_id=call_id, user_id=user_id)
        return True
    
    async def end_call(self, call_id: str) -> bool:
        """End a call."""
        call = self._calls.get(call_id)
        if not call:
            return False
        
        call.state = CallState.ENDING
        call.ended_at = datetime.utcnow()
        
        if call.started_at:
            call.duration_seconds = (call.ended_at - call.started_at).total_seconds()
        
        call.state = CallState.ENDED
        
        # Remove all participants
        for user_id in list(call.participants):
            self._user_calls.pop(user_id, None)
        
        # Add to history
        self._call_history.append(call.to_dict())
        
        logger.info("Call ended", call_id=call_id, duration=call.duration_seconds)
        return True
    
    async def mute_user(self, call_id: str, user_id: str, muted: bool = True) -> bool:
        """Mute or unmute a user."""
        call = self._calls.get(call_id)
        if not call or user_id not in call.participants:
            return False
        
        call.is_muted[user_id] = muted
        logger.info("User muted", call_id=call_id, user_id=user_id, muted=muted)
        return True
    
    async def set_speaking(self, call_id: str, user_id: str, speaking: bool) -> bool:
        """Set user speaking status."""
        call = self._calls.get(call_id)
        if not call or user_id not in call.participants:
            return False
        
        call.is_speaking[user_id] = speaking
        return True
    
    async def start_screen_share(self, call_id: str, user_id: str) -> bool:
        """Start screen sharing."""
        call = self._calls.get(call_id)
        if not call or user_id not in call.participants:
            return False
        
        # Only one person can share screen at a time
        if call.is_screen_sharing and call.is_screen_sharing != user_id:
            return False
        
        call.is_screen_sharing = user_id
        logger.info("Screen share started", call_id=call_id, user_id=user_id)
        return True
    
    async def stop_screen_share(self, call_id: str, user_id: str) -> bool:
        """Stop screen sharing."""
        call = self._calls.get(call_id)
        if not call:
            return False
        
        if call.is_screen_sharing == user_id:
            call.is_screen_sharing = None
            logger.info("Screen share stopped", call_id=call_id, user_id=user_id)
            return True
        
        return False
    
    async def toggle_recording(self, call_id: str, user_id: str) -> bool:
        """Toggle call recording."""
        call = self._calls.get(call_id)
        if not call or user_id != call.admin_id:
            return False
        
        call.is_recording = not call.is_recording
        logger.info("Recording toggled", call_id=call_id, recording=call.is_recording)
        return True
    
    async def put_on_hold(self, call_id: str, user_id: str) -> bool:
        """Put call on hold."""
        call = self._calls.get(call_id)
        if not call or user_id != call.admin_id:
            return False
        
        if call.state == CallState.ACTIVE:
            call.state = CallState.ON_HOLD
            logger.info("Call on hold", call_id=call_id)
            return True
        
        return False
    
    async def resume_call(self, call_id: str, user_id: str) -> bool:
        """Resume call from hold."""
        call = self._calls.get(call_id)
        if not call or user_id != call.admin_id:
            return False
        
        if call.state == CallState.ON_HOLD:
            call.state = CallState.ACTIVE
            logger.info("Call resumed", call_id=call_id)
            return True
        
        return False
    
    async def get_call(self, call_id: str) -> Optional[VoiceCall]:
        """Get call by ID."""
        return self._calls.get(call_id)
    
    async def get_user_call(self, user_id: str) -> Optional[VoiceCall]:
        """Get active call for a user."""
        call_id = self._user_calls.get(user_id)
        if call_id:
            return self._calls.get(call_id)
        return None
    
    async def list_active_calls(self) -> List[VoiceCall]:
        """List all active calls."""
        return [
            call for call in self._calls.values()
            if call.state in [CallState.RINGING, CallState.CONNECTING, CallState.ACTIVE, CallState.ON_HOLD]
        ]
    
    async def get_call_history(self, limit: int = 50) -> List[dict]:
        """Get call history."""
        return self._call_history[-limit:]
    
    async def get_call_participants(self, call_id: str) -> List[str]:
        """Get list of participants in a call."""
        call = self._calls.get(call_id)
        if not call:
            return []
        return list(call.participants)
