"""Chat Manager for real-time messaging."""

import json
import asyncio
from typing import Dict, List, Optional, Set
from datetime import datetime, timedelta
import structlog
from backend.models.schemas import (
    ChatMessage, ChatChannel, User, TypingIndicator,
    ReadReceipt, Reaction, MessageType, ChannelType, UserPresence
)

logger = structlog.get_logger()


class ChatManager:
    """
    Manages real-time chat functionality.
    
    Features:
    - Channel management
    - Message storage and retrieval
    - User presence tracking
    - Typing indicators
    - Read receipts
    - Message reactions
    """
    
    def __init__(self, redis_client=None):
        self.redis = redis_client
        self._channels: Dict[str, ChatChannel] = {}
        self._messages: Dict[str, List[ChatMessage]] = {}
        self._users: Dict[str, User] = {}
        self._typing: Dict[str, Dict[str, TypingIndicator]] = {}
        self._read_receipts: Dict[str, Dict[str, ReadReceipt]] = {}
        
        # Initialize default channels
        self._init_default_channels()
    
    def _init_default_channels(self):
        """Initialize default channels."""
        default_channel = ChatChannel(
            channel_id="general",
            name="General",
            description="General discussion channel",
            channel_type=ChannelType.PUBLIC,
            owner_id="system",
            members=["system"]
        )
        self._channels["general"] = default_channel
        self._messages["general"] = []
    
    async def create_channel(
        self,
        name: str,
        owner_id: str,
        description: Optional[str] = None,
        channel_type: ChannelType = ChannelType.PUBLIC
    ) -> ChatChannel:
        """Create a new channel."""
        channel = ChatChannel(
            name=name,
            owner_id=owner_id,
            description=description,
            channel_type=channel_type,
            members=[owner_id],
            admins=[owner_id]
        )
        self._channels[channel.channel_id] = channel
        self._messages[channel.channel_id] = []
        
        logger.info("Channel created", channel_id=channel.channel_id, name=name)
        return channel
    
    async def get_channel(self, channel_id: str) -> Optional[ChatChannel]:
        """Get channel by ID."""
        return self._channels.get(channel_id)
    
    async def list_channels(self, user_id: Optional[str] = None) -> List[ChatChannel]:
        """List channels, optionally filtered by user membership."""
        channels = list(self._channels.values())
        if user_id:
            channels = [c for c in channels if user_id in c.members or c.channel_type == ChannelType.PUBLIC]
        return channels
    
    async def join_channel(self, channel_id: str, user_id: str) -> bool:
        """Join a channel."""
        channel = self._channels.get(channel_id)
        if not channel:
            return False
        
        if user_id not in channel.members:
            channel.members.append(user_id)
            logger.info("User joined channel", channel_id=channel_id, user_id=user_id)
        
        return True
    
    async def leave_channel(self, channel_id: str, user_id: str) -> bool:
        """Leave a channel."""
        channel = self._channels.get(channel_id)
        if not channel:
            return False
        
        if user_id in channel.members:
            channel.members.remove(user_id)
            if user_id in channel.admins:
                channel.admins.remove(user_id)
            logger.info("User left channel", channel_id=channel_id, user_id=user_id)
        
        return True
    
    async def send_message(
        self,
        channel_id: str,
        sender_id: str,
        sender_name: str,
        content: str,
        message_type: MessageType = MessageType.TEXT,
        reply_to: Optional[str] = None
    ) -> Optional[ChatMessage]:
        """Send a message to a channel."""
        channel = self._channels.get(channel_id)
        if not channel:
            logger.error("Channel not found", channel_id=channel_id)
            return None
        
        message = ChatMessage(
            channel_id=channel_id,
            sender_id=sender_id,
            sender_name=sender_name,
            content=content,
            message_type=message_type,
            reply_to=reply_to
        )
        
        if channel_id not in self._messages:
            self._messages[channel_id] = []
        
        self._messages[channel_id].append(message)
        channel.last_message_at = datetime.utcnow()
        
        # Store in Redis if available
        if self.redis:
            await self._store_message_redis(message)
        
        logger.info("Message sent", channel_id=channel_id, sender_id=sender_id)
        return message
    
    async def get_messages(
        self,
        channel_id: str,
        limit: int = 50,
        before: Optional[str] = None,
        after: Optional[str] = None
    ) -> List[ChatMessage]:
        """Get messages from a channel."""
        messages = self._messages.get(channel_id, [])
        
        # Apply filters
        if before:
            messages = [m for m in messages if m.created_at.isoformat() < before]
        if after:
            messages = [m for m in messages if m.created_at.isoformat() > after]
        
        # Return most recent messages
        return messages[-limit:]
    
    async def edit_message(
        self,
        channel_id: str,
        message_id: str,
        user_id: str,
        new_content: str
    ) -> bool:
        """Edit a message."""
        messages = self._messages.get(channel_id, [])
        for message in messages:
            if message.message_id == message_id and message.sender_id == user_id:
                message.content = new_content
                message.edited = True
                message.updated_at = datetime.utcnow()
                return True
        return False
    
    async def delete_message(
        self,
        channel_id: str,
        message_id: str,
        user_id: str
    ) -> bool:
        """Delete a message (soft delete)."""
        messages = self._messages.get(channel_id, [])
        for message in messages:
            if message.message_id == message_id and message.sender_id == user_id:
                message.deleted = True
                message.content = "This message has been deleted"
                message.updated_at = datetime.utcnow()
                return True
        return False
    
    async def add_reaction(
        self,
        channel_id: str,
        message_id: str,
        user_id: str,
        emoji: str
    ) -> bool:
        """Add a reaction to a message."""
        messages = self._messages.get(channel_id, [])
        for message in messages:
            if message.message_id == message_id:
                if emoji not in message.reactions:
                    message.reactions[emoji] = []
                if user_id not in message.reactions[emoji]:
                    message.reactions[emoji].append(user_id)
                return True
        return False
    
    async def remove_reaction(
        self,
        channel_id: str,
        message_id: str,
        user_id: str,
        emoji: str
    ) -> bool:
        """Remove a reaction from a message."""
        messages = self._messages.get(channel_id, [])
        for message in messages:
            if message.message_id == message_id:
                if emoji in message.reactions and user_id in message.reactions[emoji]:
                    message.reactions[emoji].remove(user_id)
                    if not message.reactions[emoji]:
                        del message.reactions[emoji]
                return True
        return False
    
    async def update_typing(
        self,
        channel_id: str,
        user_id: str,
        username: str
    ) -> TypingIndicator:
        """Update typing indicator."""
        indicator = TypingIndicator(
            channel_id=channel_id,
            user_id=user_id,
            username=username
        )
        
        if channel_id not in self._typing:
            self._typing[channel_id] = {}
        
        self._typing[channel_id][user_id] = indicator
        return indicator
    
    async def get_typing_users(self, channel_id: str) -> List[TypingIndicator]:
        """Get users currently typing in a channel."""
        typing_in_channel = self._typing.get(channel_id, {})
        # Remove old typing indicators (older than 5 seconds)
        cutoff = datetime.utcnow() - timedelta(seconds=5)
        return [
            indicator for indicator in typing_in_channel.values()
            if indicator.timestamp > cutoff
        ]
    
    async def update_read_receipt(
        self,
        channel_id: str,
        user_id: str,
        last_read_message_id: str
    ) -> ReadReceipt:
        """Update read receipt."""
        receipt = ReadReceipt(
            channel_id=channel_id,
            user_id=user_id,
            last_read_message_id=last_read_message_id
        )
        
        if channel_id not in self._read_receipts:
            self._read_receipts[channel_id] = {}
        
        self._read_receipts[channel_id][user_id] = receipt
        return receipt
    
    async def get_unread_count(
        self,
        channel_id: str,
        user_id: str
    ) -> int:
        """Get unread message count for a user in a channel."""
        messages = self._messages.get(channel_id, [])
        receipt = self._read_receipts.get(channel_id, {}).get(user_id)
        
        if not receipt:
            return len(messages)
        
        # Count messages after last read
        count = 0
        for msg in messages:
            if msg.message_id == receipt.last_read_message_id:
                break
            count += 1
        
        return count
    
    async def update_user_presence(
        self,
        user_id: str,
        presence: UserPresence,
        status: Optional[str] = None
    ):
        """Update user presence."""
        user = self._users.get(user_id)
        if user:
            user.presence = presence
            if status:
                user.status = status
            user.last_seen = datetime.utcnow()
    
    async def get_online_users(self) -> List[User]:
        """Get all online users."""
        return [
            user for user in self._users.values()
            if user.presence == UserPresence.ONLINE
        ]
    
    async def _store_message_redis(self, message: ChatMessage):
        """Store message in Redis for persistence."""
        if not self.redis:
            return
        
        try:
            key = f"channel:{message.channel_id}:messages"
            data = json.dumps(message.model_dump(mode='json'), default=str)
            await self.redis.rpush(key, data)
            # Keep only last 1000 messages per channel
            await self.redis.ltrim(key, -1000, -1)
        except Exception as e:
            logger.error("Failed to store message in Redis", error=str(e))
