"""
Voice AI Platform - Prometheus Metrics
Comprehensive metrics collection for monitoring and observability.
"""

from prometheus_client import Counter, Histogram, Gauge, Summary
from typing import Optional


class MetricsCollector:
    """
    Centralized metrics collection for the voice platform.
    
    Metrics categories:
    - Session metrics (active, created, closed, expired)
    - Processing latency (ASR, LLM, TTS, end-to-end)
    - Error rates (by component)
    - Audio metrics (chunks, duration)
    - WebSocket metrics (connections, messages)
    """
    
    _instance: Optional["MetricsCollector"] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        
        # Session Metrics
        self.sessions_created = Counter(
            "voice_sessions_created_total",
            "Total number of sessions created"
        )
        self.sessions_closed = Counter(
            "voice_sessions_closed_total",
            "Total number of sessions closed"
        )
        self.sessions_expired = Counter(
            "voice_sessions_expired_total",
            "Total number of sessions expired due to inactivity"
        )
        self.sessions_evicted = Counter(
            "voice_sessions_evicted_total",
            "Total number of sessions evicted due to capacity"
        )
        self.sessions_active = Gauge(
            "voice_sessions_active",
            "Number of currently active sessions"
        )
        
        # Processing Latency
        self.processing_latency = Histogram(
            "voice_processing_latency_seconds",
            "End-to-end processing latency",
            ["session_id"],
            buckets=[0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0]
        )
        self.asr_latency = Histogram(
            "voice_asr_latency_seconds",
            "ASR processing latency",
            buckets=[0.05, 0.1, 0.25, 0.5, 0.75, 1.0]
        )
        self.llm_latency = Histogram(
            "voice_llm_latency_seconds",
            "LLM processing latency",
            buckets=[0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0]
        )
        self.tts_latency = Histogram(
            "voice_tts_latency_seconds",
            "TTS processing latency",
            buckets=[0.1, 0.25, 0.5, 0.75, 1.0]
        )
        
        # Error Metrics
        self.errors_total = Counter(
            "voice_errors_total",
            "Total number of errors",
            ["component", "error_type"]
        )
        
        # Audio Metrics
        self.audio_chunks_processed = Counter(
            "voice_audio_chunks_processed_total",
            "Total audio chunks processed"
        )
        self.audio_chunks_generated = Counter(
            "voice_audio_chunks_generated_total",
            "Total audio chunks generated",
            ["session_id"]
        )
        self.audio_duration_seconds = Counter(
            "voice_audio_duration_seconds_total",
            "Total audio duration processed"
        )
        
        # WebSocket Metrics
        self.websocket_connections = Gauge(
            "voice_websocket_connections",
            "Number of active WebSocket connections"
        )
        self.websocket_messages_received = Counter(
            "voice_websocket_messages_received_total",
            "Total WebSocket messages received"
        )
        self.websocket_messages_sent = Counter(
            "voice_websocket_messages_sent_total",
            "Total WebSocket messages sent"
        )
        
        # Session State Changes
        self.session_state_changes = Counter(
            "voice_session_state_changes_total",
            "Total session state transitions",
            ["from_state", "to_state"]
        )
        
        # Tool Metrics
        self.tool_calls_total = Counter(
            "voice_tool_calls_total",
            "Total tool calls",
            ["tool_name"]
        )
        self.tool_call_duration = Histogram(
            "voice_tool_call_duration_seconds",
            "Tool call execution duration",
            ["tool_name"],
            buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0]
        )


def get_metrics() -> MetricsCollector:
    """Get the singleton metrics collector."""
    return MetricsCollector()
