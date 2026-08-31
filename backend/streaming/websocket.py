"""
ClearSpeak AI - WebSocket Handler
Real-time bidirectional audio streaming via WebSocket with chat support.
Supports binary audio chunks for efficient streaming and translation mode.
"""

import asyncio
import json
import struct
from datetime import datetime
from typing import Dict, Optional, Set, Any
import structlog
from fastapi import WebSocket, WebSocketDisconnect
from backend.models.schemas import (
    VoiceMessage, SessionState, ChatMessage, TypingIndicator,
    ReadReceipt, Reaction, MessageType, UserPresence
)
from backend.core.session import SessionManager
from backend.core.pipeline import VoicePipeline, PipelineMode
from backend.core.chat import ChatManager
from backend.monitoring.metrics import MetricsCollector

logger = structlog.get_logger()

# Audio format constants
AUDIO_FORMAT_PCM = "pcm"
AUDIO_FORMAT_OPUS = "opus"
AUDIO_HEADER_MAGIC = b"CSA1"  # ClearSpeak Audio v1


class ConnectionManager:
    """
    Manages WebSocket connections for concurrent sessions.
    
    Features:
    - Connection pooling
    - Room/channel-based broadcasting
    - Heartbeat monitoring
    - Binary audio streaming
    - Graceful disconnect handling
    - Message queuing for slow clients
    - User presence tracking
    """
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_sessions: Dict[str, str] = {}  # user_id -> session_id
        self.session_users: Dict[str, str] = {}  # session_id -> user_id
        self.user_channels: Dict[str, Set[str]] = {}  # user_id -> set of channel_ids
        self.session_modes: Dict[str, PipelineMode] = {}  # session_id -> pipeline mode
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
                if user_id in self.user_channels:
                    del self.user_channels[user_id]
            
            # Clean up mode
            self.session_modes.pop(session_id, None)
            
            self._metrics.websocket_connections.dec()
            logger.info("WebSocket disconnected", session_id=session_id)
    
    def set_session_mode(self, session_id: str, mode: PipelineMode):
        """Set pipeline mode for a session."""
        self.session_modes[session_id] = mode
    
    def get_session_mode(self, session_id: str) -> PipelineMode:
        """Get pipeline mode for a session."""
        return self.session_modes.get(session_id, PipelineMode.AGENT)
    
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
            # For audio messages, send as binary for efficiency
            if message.type == "audio" and message.audio_data:
                audio_bytes = bytes.fromhex(message.audio_data)
                
                # Create a header with metadata
                header = {
                    "type": "audio",
                    "session_id": message.session_id,
                    "sample_rate": message.sample_rate or 24000,
                    "format": "pcm",
                    "timestamp": message.timestamp.isoformat()
                }
                
                if hasattr(message, 'metadata') and message.metadata:
                    header["metadata"] = message.metadata
                
                # Send header as JSON, then binary audio
                header_json = json.dumps(header)
                header_bytes = header_json.encode("utf-8")
                
                # Format: [4 bytes header length][header bytes][audio bytes]
                header_len = len(header_bytes).to_bytes(4, byteorder="big")
                await websocket.send_bytes(header_len + header_bytes + audio_bytes)
            else:
                # Send JSON for non-audio messages
                data = {
                    "type": message.type,
                    "session_id": message.session_id,
                    "text": message.text,
                    "format": message.format.value if message.format else None,
                    "sample_rate": message.sample_rate,
                    "timestamp": message.timestamp.isoformat()
                }
                
                if hasattr(message, 'metadata') and message.metadata:
                    data["metadata"] = message.metadata
                
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
    
    Supports:
    - Binary audio chunks (raw PCM/Opus)
    - JSON control messages
    - Agent mode and Translation mode
    - Chat messaging
    - Real-time translation
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
    
    async def handle_connection(
        self,
        websocket: WebSocket,
        session_id: str,
        user_id: Optional[str] = None
    ):
        """
        Handle a WebSocket connection for voice streaming and chat.
        
        Protocol:
        - Client sends: JSON control messages OR binary audio chunks
        - Server responds: JSON messages OR binary audio chunks
        
        Binary Audio Format:
        - 4 bytes: header length (big-endian)
        - N bytes: JSON header with metadata
        - Remaining bytes: raw PCM audio (16-bit, 16kHz, mono)
        """
        # Connect
        if not await self.connection_manager.connect(websocket, session_id, user_id):
            return
        
        # Update session state
        await self.sessions.update_session_state(session_id, SessionState.READY)
        
        # Update user presence
        if user_id:
            await self.chat.update_user_presence(user_id, UserPresence.ONLINE)
        
        # Send welcome message with supported features
        await self.connection_manager.send_json(session_id, {
            "type": "welcome",
            "session_id": session_id,
            "features": {
                "binary_audio": True,
                "translation_mode": True,
                "agent_mode": True,
                "supported_formats": ["pcm", "opus"],
                "sample_rates": [16000, 24000],
            }
        })
        
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
                # Try to receive as binary first, then JSON
                message = await websocket.receive()
                
                if message.get("type") == "websocket.receive":
                    # Check if it's binary or text
                    if "bytes" in message and message["bytes"]:
                        await self._handle_binary_audio(session_id, message["bytes"])
                    elif "text" in message and message["text"]:
                        try:
                            data = json.loads(message["text"])
                            await self._handle_json_message(session_id, user_id, data)
                        except json.JSONDecodeError:
                            logger.warning("Invalid JSON received", session_id=session_id)
                
        except WebSocketDisconnect:
            logger.info("Client disconnected", session_id=session_id)
        except Exception as e:
            logger.error("WebSocket error", session_id=session_id, error=str(e))
        finally:
            await self._cleanup_connection(session_id, user_id)
    
    async def _handle_json_message(self, session_id: str, user_id: Optional[str], data: dict):
        """Handle JSON control messages."""
        msg_type = data.get("type", "")
        
        # Chat messages
        if msg_type in ["chat_message", "typing", "read_receipt", "reaction"]:
            await self._handle_chat_message(session_id, user_id, data)
        
        # Mode switching
        elif msg_type == "set_mode":
            mode = data.get("mode", "agent")
            pipeline_mode = PipelineMode.TRANSLATION if mode == "translation" else PipelineMode.AGENT
            self.connection_manager.set_session_mode(session_id, pipeline_mode)
            
            await self.connection_manager.send_json(session_id, {
                "type": "mode_set",
                "mode": mode,
                "session_id": session_id
            })
            
            logger.info("Pipeline mode set", session_id=session_id, mode=mode)
        
        # Set translation languages
        elif msg_type == "set_languages":
            source_lang = data.get("source_language", "hi")
            target_lang = data.get("target_language", "en")
            
            await self.pipeline.set_translation_languages(
                session_id, source_lang, target_lang
            )
            
            await self.connection_manager.send_json(session_id, {
                "type": "languages_set",
                "source_language": source_lang,
                "target_language": target_lang,
                "session_id": session_id
            })
        
        # Voice/text messages
        elif msg_type in ["audio", "text", "control", "heartbeat"]:
            message = VoiceMessage(**data)
            
            if message.type == "audio":
                await self._handle_audio_message(session_id, message)
            elif message.type == "text":
                await self._handle_text_message(session_id, message)
            elif message.type == "control":
                await self._handle_control_message(session_id, message)
            elif message.type == "heartbeat":
                pass  # Acknowledged implicitly
    
    async def _handle_binary_audio(self, session_id: str, data: bytes):
        """
        Handle binary audio data.
        
        Format: [4 bytes header length][JSON header][PCM audio data]
        """
        if len(data) < 4:
            return
        
        try:
            # Parse header length
            header_len = int.from_bytes(data[:4], byteorder="big")
            
            if len(data) < 4 + header_len:
                logger.warning("Incomplete audio message", session_id=session_id)
                return
            
            # Parse header
            header_bytes = data[4:4 + header_len]
            header = json.loads(header_bytes.decode("utf-8"))
            
            # Extract audio data
            audio_data = data[4 + header_len:]
            
            if not audio_data:
                return
            
            # Get pipeline mode
            mode = self.connection_manager.get_session_mode(session_id)
            
            # Create audio generator
            async def audio_generator():
                yield audio_data
            
            # Process through pipeline
            async for response in self.pipeline.process_audio_stream(
                session_id,
                audio_generator(),
                mode=mode
            ):
                await self.connection_manager.send_message(session_id, response)
                
        except Exception as e:
            logger.error("Failed to process binary audio", session_id=session_id, error=str(e))
    
    async def _handle_audio_message(self, session_id: str, message: VoiceMessage):
        """Handle incoming audio message (legacy base64 format)."""
        import base64
        
        # Decode audio data
        audio_data = base64.b64decode(message.audio_data) if message.audio_data else b""
        
        if not audio_data:
            return
        
        # Get pipeline mode
        mode = self.connection_manager.get_session_mode(session_id)
        
        # Create audio stream from single chunk
        async def audio_generator():
            yield audio_data
        
        # Process through pipeline
        async for response in self.pipeline.process_audio_stream(
            session_id,
            audio_generator(),
            mode=mode
        ):
            await self.connection_manager.send_message(session_id, response)
    
    async def _handle_text_message(self, session_id: str, message: VoiceMessage):
        """Handle incoming text message."""
        if not message.text:
            return
        
        # Get pipeline mode
        mode = self.connection_manager.get_session_mode(session_id)
        
        # Process through pipeline
        async for response in self.pipeline.process_text_input(
            session_id,
            message.text,
            mode=mode
        ):
            await self.connection_manager.send_message(session_id, response)
    
    async def _handle_control_message(self, session_id: str, message: VoiceMessage):
        """Handle control messages (pause, resume, etc.)."""
        if message.text == "pause":
            await self.sessions.update_session_state(session_id, SessionState.WAITING)
        elif message.text == "resume":
            await self.sessions.update_session_state(session_id, SessionState.READY)
        elif message.text == "interrupt":
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
                        "message": message.model_dump(mode='json')
                    }
                )
            
            # If in agent mode, process through LLM pipeline
            mode = self.connection_manager.get_session_mode(session_id)
            if mode == PipelineMode.AGENT and content:
                try:
                    async for response in self.pipeline.process_text_input(
                        session_id, content, mode=mode
                    ):
                        await self.connection_manager.send_message(session_id, response)
                except Exception as e:
                    logger.error("Agent processing failed", session_id=session_id, error=str(e))
                    await self.connection_manager.send_json(session_id, {
                        "type": "text",
                        "text": f"Error: {str(e)}",
                        "session_id": session_id
                    })
            
            # If in translation mode, process translation
            elif mode == PipelineMode.TRANSLATION and content:
                try:
                    async for response in self.pipeline.process_text_input(
                        session_id, content, mode=mode
                    ):
                        await self.connection_manager.send_message(session_id, response)
                except Exception as e:
                    logger.error("Translation processing failed", session_id=session_id, error=str(e))
                    await self.connection_manager.send_json(session_id, {
                        "type": "text",
                        "text": f"Translation error: {str(e)}",
                        "session_id": session_id
                    })
        
        elif msg_type == "typing":
            channel_id = data.get("channel_id", "general")
            indicator = await self.chat.update_typing(channel_id, user_id, user_id)
            
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
    
    async def _cleanup_connection(self, session_id: str, user_id: Optional[str] = None):
        """Clean up connection and session."""
        if user_id:
            await self.chat.update_user_presence(user_id, UserPresence.OFFLINE)
            
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
