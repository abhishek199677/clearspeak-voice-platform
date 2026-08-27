"""
Voice AI Platform - Pipeline Tests
Integration tests for the voice processing pipeline.
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from backend.models.schemas import (
    TranscriptMessage, ConversationMessage, MessageRole,
    VoiceMessage, SessionState
)
from backend.core.session import SessionManager
from backend.core.pipeline import VoicePipeline
from backend.asr.base import ASRProvider
from backend.tts.base import TTSProvider
from backend.llm.base import LLMProvider


# Mock ASR Provider
class MockASR(ASRProvider):
    def __init__(self):
        self.initialized = False
        
    async def initialize(self):
        self.initialized = True
    
    async def transcribe_stream(self, audio_stream, session_id, language="en"):
        async for _ in audio_stream:
            yield TranscriptMessage(
                session_id=session_id,
                transcript="Hello, how are you?",
                confidence=0.95,
                is_final=True,
                language=language
            )
    
    async def transcribe_audio(self, audio_data, session_id, language="en"):
        return TranscriptMessage(
            session_id=session_id,
            transcript="Hello, how are you?",
            confidence=0.95,
            is_final=True,
            language=language
        )
    
    async def cleanup(self):
        pass


# Mock TTS Provider
class MockTTS(TTSProvider):
    def __init__(self):
        self.initialized = False
        
    async def initialize(self):
        self.initialized = True
    
    async def synthesize(self, text, voice_id=None, language="en"):
        # Return mock audio chunks
        for i in range(3):
            yield b'\x00' * 1024
    
    async def get_voices(self):
        return [{"voice_id": "mock", "name": "Mock Voice"}]
    
    async def cleanup(self):
        pass


# Mock LLM Provider
class MockLLM(LLMProvider):
    def __init__(self):
        self.initialized = False
        
    async def initialize(self):
        self.initialized = True
    
    async def generate_response(self, conversation_history, system_prompt=None):
        return "I'm doing well, thank you! How can I help you today?"
    
    async def generate_response_with_tools(self, conversation_history, system_prompt=None):
        yield {
            "type": "text",
            "content": "I'm doing well, thank you! How can I help you today?"
        }
    
    async def generate_streaming_response(self, conversation_history, system_prompt=None):
        yield "I'm doing well, thank you! "
        yield "How can I help you today?"
    
    async def cleanup(self):
        pass


@pytest.fixture
def session_manager():
    return SessionManager(max_sessions=10, session_timeout_seconds=60)


@pytest.fixture
def mock_asr():
    return MockASR()


@pytest.fixture
def mock_tts():
    return MockTTS()


@pytest.fixture
def mock_llm():
    return MockLLM()


@pytest.fixture
def pipeline(mock_asr, mock_llm, mock_tts, session_manager):
    return VoicePipeline(
        asr_provider=mock_asr,
        llm_provider=mock_llm,
        tts_provider=mock_tts,
        session_manager=session_manager
    )


class TestSessionManager:
    """Tests for session management."""
    
    @pytest.mark.asyncio
    async def test_create_session(self, session_manager):
        session = await session_manager.create_session(user_id="test_user")
        assert session is not None
        assert session.session_id is not None
        assert session.user_id == "test_user"
        assert session.state == SessionState.INITIALIZING
    
    @pytest.mark.asyncio
    async def test_get_session(self, session_manager):
        session = await session_manager.create_session()
        retrieved = await session_manager.get_session(session.session_id)
        assert retrieved is not None
        assert retrieved.session_id == session.session_id
    
    @pytest.mark.asyncio
    async def test_update_session_state(self, session_manager):
        session = await session_manager.create_session()
        success = await session_manager.update_session_state(
            session.session_id,
            SessionState.READY
        )
        assert success is True
        
        updated = await session_manager.get_session(session.session_id)
        assert updated.state == SessionState.READY
    
    @pytest.mark.asyncio
    async def test_add_message(self, session_manager):
        session = await session_manager.create_session()
        success = await session_manager.add_message(
            session.session_id,
            MessageRole.USER,
            "Hello"
        )
        assert success is True
        
        history = await session_manager.get_conversation_history(session.session_id)
        assert len(history) == 1
        assert history[0].content == "Hello"
    
    @pytest.mark.asyncio
    async def test_close_session(self, session_manager):
        session = await session_manager.create_session()
        success = await session_manager.close_session(session.session_id)
        assert success is True
        
        retrieved = await session_manager.get_session(session.session_id)
        assert retrieved is None
    
    @pytest.mark.asyncio
    async def test_max_sessions_eviction(self):
        manager = SessionManager(max_sessions=2)
        
        s1 = await manager.create_session()
        s2 = await manager.create_session()
        s3 = await manager.create_session()  # Should evict s1
        
        assert await manager.get_session(s1.session_id) is None
        assert await manager.get_session(s2.session_id) is not None
        assert await manager.get_session(s3.session_id) is not None


class TestVoicePipeline:
    """Tests for the voice processing pipeline."""
    
    @pytest.mark.asyncio
    async def test_pipeline_initialization(self, pipeline, mock_asr, mock_tts):
        await pipeline.initialize()
        assert mock_asr.initialized is True
        assert mock_tts.initialized is True
    
    @pytest.mark.asyncio
    async def test_process_text_input(self, pipeline, session_manager):
        await pipeline.initialize()
        session = await session_manager.create_session()
        
        responses = []
        async for message in pipeline.process_text_input(
            session.session_id,
            "Hello, how are you?"
        ):
            responses.append(message)
        
        assert len(responses) > 0
        assert any(m.type == "text" for m in responses)
    
    @pytest.mark.asyncio
    async def test_process_audio_stream(self, pipeline, session_manager):
        await pipeline.initialize()
        session = await session_manager.create_session()
        
        async def audio_generator():
            yield b'\x00' * 4096  # Mock audio data
        
        responses = []
        async for message in pipeline.process_audio_stream(
            session.session_id,
            audio_generator()
        ):
            responses.append(message)
        
        assert len(responses) > 0
    
    @pytest.mark.asyncio
    async def test_session_state_transitions(self, pipeline, session_manager):
        await pipeline.initialize()
        session = await session_manager.create_session()
        
        # Process a message and check state transitions
        async for message in pipeline.process_text_input(
            session.session_id,
            "Test message"
        ):
            pass
        
        final_session = await session_manager.get_session(session.session_id)
        assert final_session.state == SessionState.READY


class TestToolRegistry:
    """Tests for tool registration and execution."""
    
    @pytest.mark.asyncio
    async def test_tool_registration(self, mock_llm):
        tools = mock_llm.tool_registry.get_tools_schema()
        assert len(tools) > 0
        assert any(t["function"]["name"] == "get_current_time" for t in tools)
    
    @pytest.mark.asyncio
    async def test_tool_execution(self, mock_llm):
        from backend.models.schemas import ToolCall
        
        tool_call = ToolCall(
            name="get_current_time",
            arguments={}
        )
        
        result = await mock_llm.tool_registry.execute(tool_call)
        assert result.success is True
        assert result.result is not None


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
