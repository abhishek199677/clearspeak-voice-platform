"""Test all ChatBucket features."""

import asyncio
import sys
import os
import pytest
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.core.chat import ChatManager
from backend.core.calls import CallManager, CallType
from backend.core.translation import TranslationManager
from backend.core.streaming import StreamManager
from backend.core.agents import AgentManager, AgentType
from backend.core.spatial import SpatialAwarenessManager


@pytest.mark.asyncio
async def test_chat():
    """Test chat functionality."""
    print("\n=== Testing Chat Manager ===")
    manager = ChatManager()
    
    # Create channel
    channel = await manager.create_channel("test-channel", "user1", "Test Channel")
    print(f"✓ Created channel: {channel.name}")
    
    # Send message
    message = await manager.send_message(
        channel.channel_id, "user1", "User 1", "Hello everyone!"
    )
    print(f"✓ Sent message: {message.content}")
    
    # Get messages
    messages = await manager.get_messages(channel.channel_id)
    print(f"✓ Got {len(messages)} messages")
    
    # Join channel
    await manager.join_channel(channel.channel_id, "user2")
    print("✓ User 2 joined channel")
    
    # Typing indicator
    await manager.update_typing(channel.channel_id, "user2", "User 2")
    print("✓ Typing indicator set")
    
    print("✓ Chat tests passed!")


@pytest.mark.asyncio
async def test_calls():
    """Test voice call functionality."""
    print("\n=== Testing Call Manager ===")
    manager = CallManager()
    
    # Create call
    call = await manager.create_call("user1", CallType.DIRECT)
    print(f"✓ Created call: {call.call_id}")
    
    # Join call
    await manager.join_call(call.call_id, "user2")
    print("✓ User 2 joined call")
    
    # Mute user
    await manager.mute_user(call.call_id, "user1", True)
    print("✓ User 1 muted")
    
    # Start screen share
    await manager.start_screen_share(call.call_id, "user1")
    print("✓ User 1 started screen share")
    
    # End call
    await manager.end_call(call.call_id)
    print("✓ Call ended")
    
    print("✓ Call tests passed!")


@pytest.mark.asyncio
async def test_translation():
    """Test translation functionality."""
    print("\n=== Testing Translation Manager ===")
    manager = TranslationManager()
    
    # Translate text
    translated = await manager.translate("hello", "es")
    print(f"✓ Translated 'hello' to Spanish: {translated}")
    
    # Detect language
    lang = await manager.detect_language("Hello world")
    print(f"✓ Detected language: {lang}")
    
    # Set user language
    manager.set_user_language("user1", "fr")
    print("✓ Set user language to French")
    
    # Get supported languages
    languages = manager.get_supported_languages()
    print(f"✓ Supported languages: {len(languages)}")
    
    print("✓ Translation tests passed!")


@pytest.mark.asyncio
async def test_streaming():
    """Test live streaming functionality."""
    print("\n=== Testing Stream Manager ===")
    manager = StreamManager()
    
    # Create stream
    stream = await manager.create_stream("user1", "My Live Stream", "Testing live streaming")
    print(f"✓ Created stream: {stream.title}")
    
    # Start stream
    await manager.start_stream(stream.stream_id, "user1")
    print("✓ Stream started")
    
    # Join stream
    await manager.join_stream(stream.stream_id, "user2")
    print("✓ User 2 joined stream")
    
    # Send chat message
    await manager.send_chat_message(stream.stream_id, "user2", "User 2", "Great stream!")
    print("✓ Chat message sent")
    
    # End stream
    await manager.end_stream(stream.stream_id, "user1")
    print("✓ Stream ended")
    
    print("✓ Streaming tests passed!")


@pytest.mark.asyncio
async def test_agents():
    """Test AI agents functionality."""
    print("\n=== Testing Agent Manager ===")
    manager = AgentManager()
    
    # Create agent
    agent = await manager.create_agent(
        "Support Bot", AgentType.SUPPORT, "user1", "Customer support agent"
    )
    print(f"✓ Created agent: {agent.name}")
    
    # Activate agent
    await manager.activate_agent(agent.agent_id)
    print("✓ Agent activated")
    
    # Send message
    response = await manager.send_message(
        agent.agent_id, "user1", "I need help with my order"
    )
    print(f"✓ Agent response: {response[:50]}...")
    
    # Get analytics
    analytics = await manager.get_agent_analytics(agent.agent_id)
    print(f"✓ Agent analytics: {analytics['total_conversations']} conversations")
    
    print("✓ Agent tests passed!")


@pytest.mark.asyncio
async def test_spatial():
    """Test spatial awareness functionality."""
    print("\n=== Testing Spatial Awareness Manager ===")
    manager = SpatialAwarenessManager()
    
    # Register object
    obj = await manager.register_object(
        "Door", "furniture", {"x": 1.0, "y": 0.0, "z": 0.0}, "Main entrance door"
    )
    print(f"✓ Registered object: {obj.name}")
    
    # Process gesture
    action = await manager.process_gesture("user1", "swipe_up")
    print(f"✓ Gesture action: {action}")
    
    # Process voice command
    action = await manager.process_voice_command("user1", "go to top")
    print(f"✓ Voice command action: {action}")
    
    # Set user settings
    await manager.set_user_settings("user1", {"high_contrast": True, "screen_reader": True})
    print("✓ User settings updated")
    
    # Get nearby objects
    objects = await manager.get_nearby_objects({"x": 0.5, "y": 0.0, "z": 0.0}, 2.0)
    print(f"✓ Found {len(objects)} nearby objects")
    
    print("✓ Spatial awareness tests passed!")


async def main():
    """Run all tests."""
    print("=" * 50)
    print("Testing ChatBucket Features")
    print("=" * 50)
    
    await test_chat()
    await test_calls()
    await test_translation()
    await test_streaming()
    await test_agents()
    await test_spatial()
    
    print("\n" + "=" * 50)
    print("All tests passed! ✓")
    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
