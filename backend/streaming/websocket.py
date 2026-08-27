"""
Voice AI Platform - WebSocket Handler
Real-time bidirectional audio streaming via WebSocket with chat support.
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, Optional, Set
import structlog
from fastapi import WebSocket, WebSocketDisconnect
from backend.models.schemas import (
    VoiceMessage, SessionState, ChatMessage, TypingIndicator,
    ReadReceipt, Reaction, MessageType, UserPresence
)
from backend.core.session import SessionManager
from backend.core.pipeline import VoicePipeline
from backend.core.chat import ChatManager
from backend.monitoring.metrics import MetricsCollector

logger = structlog.get_logger()


class ConnectionManager:
    """
    Manages WebSocket connections for concurrent sessions.
    
    Features:
    - Connection pooling
    - Room/channel-based broadcasting
    - Heartbeat monitoring
    - Graceful disconnect handling
    - Message queuing for slow clients
    - User presence tracking
    """
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_sessions: Dict[str, str] = {}  # user_id -> session_id
        self.session_users: Dict[str, str] = {}  # session_id -> user_id
        self.user_channels: Dict[str, Set[str]] = {}  # user_id -> set of channel_ids
        self._heartbeat_task: Optional[asyncio.Task] = None
        self._metrics = MetricsCollector()
    
    async def connect(self, websocket: WebSocket, session_id: str, user_id: Optional[str] = None) -> bool:
        """Accept and register a WebSocket connection."""
        try:
            await websocket.accept()
            self.active_connections[session_id] = websocket
            
            if user_id:
                self.user_sessions[user_id] = session_id
                self.session_users[session_id] = user_id
                if user_id not in self.user_channels:
                    self.user_channels[user_id] = set()
            
            self._metrics.websocket_connections.inc()
            logger.info("WebSocket connected", session_id=session_id, user_id=user_id)
            return True
        except Exception as e:
            logger.error("WebSocket connection failed", error=str(e))
            return False
    
    def disconnect(self, session_id: str):
        """Remove a WebSocket connection."""
        if session_id in self.active_connections:
            del self.active_connections[session_id]
            
            # Clean up user mappings
            user_id = self.session_users.pop(session_id, None)
            if user_id:
                self.user_sessions.pop(user_id, None)
                # Remove user from all channels
                if user_id in self.user_channels:
                    del self.user_channels[user_id]
            
            self._metrics.websocket_connections.dec()
            logger.info("WebSocket disconnected", session_id=session_id)
    
    def join_channel(self, user_id: str, channel_id: str):
        """User joins a channel."""
        if user_id not in self.user_channels:
            self.user_channels[user_id] = set()
        self.user_channels[user_id].add(channel_id)
    
    def leave_channel(self, user_id: str, channel_id: str):
        """User leaves a channel."""
        if user_id in self.user_channels:
            self.user_channels[user_id].discard(channel_id)
    
    def get_channel_users(self, channel_id: str) -> list[str]:
        """Get all user IDs in a channel."""
        users = []
        for user_id, channels in self.user_channels.items():
            if channel_id in channels:
                users.append(user_id)
        return users
    
    async def send_message(self, session_id: str, message: VoiceMessage) -> bool:
        """Send a message to a specific session."""
        websocket = self.active_connections.get(session_id)
        if not websocket:
            return False
        
        try:
            # Serialize message
            data = {
                "type": message.type,
                "session_id": message.session_id,
                "text": message.text,
                "audio_data": message.audio_data,
                "format": message.format.value if message.format else None,
                "sample_rate": message.sample_rate,
                "timestamp": message.timestamp.isoformat()
            }
            
            await websocket.send_json(data)
            self._metrics.websocket_messages_sent.inc()
            return True
            
        except Exception as e:
            logger.error("Failed to send message", session_id=session_id, error=str(e))
            return False
    
    async def send_json(self, session_id: str, data: dict) -> bool:
        """Send raw JSON to a specific session."""
        websocket = self.active_connections.get(session_id)
        if not websocket:
            return False
        
        try:
            await websocket.send_json(data)
            self._metrics.websocket_messages_sent.inc()
            return True
        except Exception as e:
            logger.error("Failed to send JSON", session_id=session_id, error=str(e))
            return False
    
    async def broadcast_to_channel(
        self,
        channel_id: str,
        data: dict,
        exclude_user: Optional[str] = None
    ):
        """Broadcast a message to all users in a channel."""
        tasks = []
        for user_id in self.get_channel_users(channel_id):
            if user_id != exclude_user:
                session_id = self.user_sessions.get(user_id)
                if session_id:
                    tasks.append(self.send_json(session_id, data))
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
    
    async def broadcast(self, message: VoiceMessage, exclude_session: Optional[str] = None):
        """Broadcast a message to all connected sessions."""
        tasks = []
        for session_id, websocket in self.active_connections.items():
            if session_id != exclude_session:
                tasks.append(self.send_message(session_id, message))
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
    
    async def start_heartbeat(self, interval: int = 30):
        """Start heartbeat monitoring task."""
        self._heartbeat_task = asyncio.create_task(self._heartbeat_loop(interval))
    
    async def stop_heartbeat(self):
        """Stop heartbeat monitoring."""
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
            try:
                await self._heartbeat_task
            except asyncio.CancelledError:
                pass
    
    async def _heartbeat_loop(self, interval: int):
        """Send periodic heartbeats to detect stale connections."""
        while True:
            try:
                await asyncio.sleep(interval)
                stale_sessions = []
                
                for session_id, websocket in list(self.active_connections.items()):
                    try:
                        await websocket.send_json({"type": "heartbeat"})
                    except Exception:
                        stale_sessions.append(session_id)
                
                for session_id in stale_sessions:
                    self.disconnect(session_id)
                    
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("Heartbeat error", error=str(e))


class VoiceWebSocketHandler:
    """
    WebSocket handler for voice streaming and chat.
    
    Handles the complete lifecycle:
    - Connection establishment
    - Audio streaming
    - Chat messaging
    - Message processing
    - Error handling
    - Disconnection
    """
    
    def __init__(
        self,
        pipeline: VoicePipeline,
        session_manager: SessionManager,
        chat_manager: Optional[ChatManager] = None
    ):
        self.pipeline = pipeline
        self.sessions = session_manager
        self.chat = chat_manager or ChatManager()
        self.connection_manager = ConnectionManager()
        self._metrics = MetricsCollector()
    
    async def handle_connection(self, websocket: WebSocket, session_id: str, user_id: Optional[str] = None):
        """
        Handle a WebSocket connection for voice streaming and chat.
        
        Args:
            websocket: WebSocket connection
            session_id: Session identifier
            user_id: Optional user identifier
        """
        # Connect
        if not await self.connection_manager.connect(websocket, session_id, user_id):
            return
        
        # Update session state
        await self.sessions.update_session_state(session_id, SessionState.READY)
        
        # Update user presence
        if user_id:
            await self.chat.update_user_presence(user_id, UserPresence.ONLINE)
        
        # Send welcome message
        await self.connection_manager.send_message(
            session_id,
            VoiceMessage(
                type="text",
                session_id=session_id,
                text="Hello! I'm your AI voice assistant. How can I help you today?"
            )
        )
        
        # Auto-join general channel
        if user_id:
            await self.chat.join_channel("general", user_id)
            self.connection_manager.join_channel(user_id, "general")
            
            # Notify channel
            await self.connection_manager.broadcast_to_channel(
                "general",
                {
                    "type": "chat_message",
                    "message": {
                        "message_id": f"system-{session_id}",
                        "channel_id": "general",
                        "sender_id": "system",
                        "sender_name": "System",
                        "content": f"{user_id} joined the chat",
                        "message_type": "system",
                        "created_at": datetime.utcnow().isoformat()
                    }
                },
                exclude_user=user_id
            )
        
        try:
            while True:
                # Receive message from client
                data = await websocket.receive_json()
                self._metrics.websocket_messages_received.inc()
                
                # Handle chat messages
                if data.get("type") in ["chat_message", "typing", "read_receipt", "reaction"]:
                    await self._handle_chat_message(session_id, user_id, data)
                else:
                    # Handle voice/text messages
                    message = VoiceMessage(**data)
                    
                    if message.type == "audio":
                        await self._handle_audio_message(session_id, message)
                    elif message.type == "text":
                        await self._handle_text_message(session_id, message)
                    elif message.type == "control":
                        await self._handle_control_message(session_id, message)
                    elif message.type == "heartbeat":
                        pass  # Acknowledged implicitly
                
        except WebSocketDisconnect:
            logger.info("Client disconnected", session_id=session_id)
        except Exception as e:
            logger.error("WebSocket error", session_id=session_id, error=str(e))
        finally:
            await self._cleanup_connection(session_id, user_id)
    
    async def _handle_chat_message(self, session_id: str, user_id: Optional[str], data: dict):
        """Handle chat-related messages."""
        if not user_id:
            return
        
        msg_type = data.get("type")
        
        if msg_type == "chat_message":
            channel_id = data.get("channel_id", "general")
            content = data.get("content", "")
            message_type = MessageType(data.get("message_type", "text"))
            reply_to = data.get("reply_to")
            
            # Get user info
            user = self.chat._users.get(user_id)
            sender_name = user.display_name if user else user_id
            
            # Send message
            message = await self.chat.send_message(
                channel_id=channel_id,
                sender_id=user_id,
                sender_name=sender_name,
                content=content,
                message_type=message_type,
                reply_to=reply_to
            )
            
            if message:
                # Broadcast to channel
                await self.connection_manager.broadcast_to_channel(
                    channel_id,
                    {
                        "type": "chat_message",
                        "message": message.model_dump()
                    }
                )
        
        elif msg_type == "typing":
            channel_id = data.get("channel_id", "general")
            indicator = await self.chat.update_typing(channel_id, user_id, user_id)
            
            # Broadcast typing indicator
            await self.connection_manager.broadcast_to_channel(
                channel_id,
                {
                    "type": "typing",
                    "user_id": user_id,
                    "channel_id": channel_id
                },
                exclude_user=user_id
            )
        
        elif msg_type == "read_receipt":
            channel_id = data.get("channel_id", "general")
            last_message_id = data.get("last_message_id", "")
            
            await self.chat.update_read_receipt(channel_id, user_id, last_message_id)
            
            # Broadcast read receipt
            await self.connection_manager.broadcast_to_channel(
                channel_id,
                {
                    "type": "read_receipt",
                    "user_id": user_id,
                    "channel_id": channel_id,
                    "last_message_id": last_message_id
                },
                exclude_user=user_id
            )
        
        elif msg_type == "reaction":
            channel_id = data.get("channel_id", "general")
            message_id = data.get("message_id", "")
            emoji = data.get("emoji", "")
            action = data.get("action", "add")
            
            if action == "add":
                await self.chat.add_reaction(channel_id, message_id, user_id, emoji)
            else:
                await self.chat.remove_reaction(channel_id, message_id, user_id, emoji)
            
            # Broadcast reaction
            await self.connection_manager.broadcast_to_channel(
                channel_id,
                {
                    "type": "reaction",
                    "message_id": message_id,
                    "channel_id": channel_id,
                    "user_id": user_id,
                    "emoji": emoji,
                    "action": action
                }
            )
    
    async def _handle_audio_message(self, session_id: str, message: VoiceMessage):
        """Handle incoming audio message."""
        import base64
        
        # Decode audio data
        audio_data = base64.b64decode(message.audio_data) if message.audio_data else b""
        
        if not audio_data:
            return
        
        # Create audio stream from single chunk
        async def audio_generator():
            yield audio_data
        
        # Process through pipeline
        async for response in self.pipeline.process_audio_stream(
            session_id,
            audio_generator()
        ):
            await self.connection_manager.send_message(session_id, response)
    
    async def _handle_text_message(self, session_id: str, message: VoiceMessage):
        """Handle incoming text message."""
        if not message.text:
            return
        
        # Process through pipeline
        async for response in self.pipeline.process_text_input(
            session_id,
            message.text
        ):
            await self.connection_manager.send_message(session_id, response)
    
    async def _handle_control_message(self, session_id: str, message: VoiceMessage):
        """Handle control messages (pause, resume, etc.)."""
        if message.text == "pause":
            await self.sessions.update_session_state(session_id, SessionState.WAITING)
        elif message.text == "resume":
            await self.sessions.update_session_state(session_id, SessionState.READY)
        elif message.text == "interrupt":
            # Handle interruption - stop current TTS and process new input
            await self.sessions.update_session_state(session_id, SessionState.PROCESSING)
        elif message.text == "end":
            await self.connection_manager.send_message(
                session_id,
                VoiceMessage(
                    type="control",
                    session_id=session_id,
                    text="session_ended"
                )
            )
    
    async def _cleanup_connection(self, session_id: str, user_id: Optional[str] = None):
        """Clean up connection and session."""
        # Update user presence
        if user_id:
            await self.chat.update_user_presence(user_id, UserPresence.OFFLINE)
            
            # Leave all channels
            for channel_id in list(self.connection_manager.user_channels.get(user_id, set())):
                self.connection_manager.leave_channel(user_id, channel_id)
                await self.connection_manager.broadcast_to_channel(
                    channel_id,
                    {
                        "type": "chat_message",
                        "message": {
                            "message_id": f"system-{session_id}-leave",
                            "channel_id": channel_id,
                            "sender_id": "system",
                            "sender_name": "System",
                            "content": f"{user_id} left the chat",
                            "message_type": "system",
                            "created_at": datetime.utcnow().isoformat()
                        }
                    }
                )
        
        self.connection_manager.disconnect(session_id)
        await self.sessions.close_session(session_id)
        self._metrics.sessions_active.dec()
