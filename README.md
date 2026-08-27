# Voice AI Agent Platform

A production-grade voice AI agent platform with real-time streaming, built for Chatbucket's Voice AI Engineer role demonstration.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Voice AI Platform                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐             │
│   │  Client  │────▶│WebSocket│────▶│ Pipeline│────▶│  LLM    │             │
│   │ (Browser)│◀────│ Handler │◀────│Orchestr.│◀────│(GPT-4)  │             │
│   └─────────┘     └─────────┘     └─────────┘     └─────────┘             │
│        │               │               │               │                    │
│        │               │          ┌────┴────┐     ┌────┴────┐             │
│        │               │          │  ASR    │     │  TTS    │             │
│        │               │          │(Deepgram│     │(ElevenLabs)            │
│        │               │          │ Whisper)│     │  Azure  │             │
│        │               │          └─────────┘     └─────────┘             │
│        │               │                                                   │
│   ┌────┴───────────────┴───────────────────────────────────────────┐      │
│   │                    Session Manager (Redis-backed)              │      │
│   │  - Concurrent session handling                                 │      │
│   │  - State machine management                                    │      │
│   │  - Conversation history                                        │      │
│   └────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│   ┌────────────────────────────────────────────────────────────────────┐  │
│   │                     Monitoring & Observability                     │  │
│   │  - Prometheus metrics  │  - Structured logging  │  - Grafana     │  │
│   └────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Features Demonstrated

### 1. Real-Time Streaming
- WebSocket-based bidirectional audio streaming
- Low-latency audio processing pipeline
- Real-time transcription and synthesis

### 2. Voice Agent Orchestration
- End-to-end pipeline: Audio → ASR → LLM → TTS → Audio
- Session state management
- Tool calling with function execution

### 3. Multi-Provider Support
- **ASR**: Deepgram (streaming), Whisper (local)
- **TTS**: ElevenLabs (neural), Azure (enterprise)
- **LLM**: OpenAI GPT-4 with function calling

### 4. Production Engineering
- Structured logging with correlation IDs
- Prometheus metrics collection
- Health checks and monitoring
- Graceful error handling

### 5. Scalability Features
- Async/await architecture
- Connection pooling
- Session eviction policies
- Redis-backed state management

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Python 3.11+, FastAPI |
| WebSocket | FastAPI WebSocket |
| ASR | Deepgram SDK, Whisper |
| TTS | ElevenLabs, Azure Cognitive Services |
| LLM | OpenAI GPT-4 |
| Cache | Redis |
| Monitoring | Prometheus, Grafana |
| Container | Docker, Docker Compose |

## Project Structure

```
voice-ai-platform/
├── backend/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration management
│   ├── core/
│   │   ├── session.py       # Session manager
│   │   └── pipeline.py      # Voice pipeline orchestrator
│   ├── asr/
│   │   └── base.py          # ASR providers (Deepgram, Whisper)
│   ├── tts/
│   │   └── base.py          # TTS providers (ElevenLabs, Azure)
│   ├── llm/
│   │   └── base.py          # LLM with tool calling
│   ├── streaming/
│   │   └── websocket.py     # WebSocket handler
│   ├── monitoring/
│   │   ├── metrics.py       # Prometheus metrics
│   │   └── logging.py       # Structured logging
│   └── models/
│       └── schemas.py       # Pydantic models
├── frontend/
│   └── index.html           # Voice agent UI
├── tests/
│   └── test_pipeline.py     # Integration tests
├── infrastructure/
│   ├── prometheus.yml       # Prometheus config
│   └── grafana/             # Grafana dashboards
├── scripts/
│   ├── setup.sh             # Development setup
│   └── deploy.sh            # Deployment script
├── docker-compose.yml       # Container orchestration
├── Dockerfile               # Container build
├── requirements.txt         # Python dependencies
└── .env.example             # Environment template
```

## Quick Start

### Local Development

```bash
# Clone and setup
chmod +x scripts/setup.sh
./scripts/setup.sh

# Configure API keys
cp .env.example .env
# Edit .env with your keys

# Start server
source venv/bin/activate
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Open browser
open http://localhost:8000
```

### Docker Deployment

```bash
# Configure API keys
cp .env.example .env
# Edit .env with your keys

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f voice-api
```

### API Keys Required

1. **Deepgram** (ASR): Get key at https://console.deepgram.com
2. **ElevenLabs** (TTS): Get key at https://elevenlabs.io
3. **OpenAI** (LLM): Get key at https://platform.openai.com

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Voice agent UI |
| GET | `/health` | Health check |
| POST | `/sessions` | Create session |
| GET | `/sessions/{id}` | Get session |
| DELETE | `/sessions/{id}` | Close session |
| GET | `/metrics` | Prometheus metrics |
| WS | `/ws/{session_id}` | WebSocket streaming |

## WebSocket Protocol

### Client → Server

```json
{
  "type": "audio",
  "session_id": "uuid",
  "audio_data": "base64_encoded_audio",
  "format": "pcm",
  "sample_rate": 16000
}
```

### Server → Client

```json
{
  "type": "text",
  "session_id": "uuid",
  "text": "Response text",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Monitoring

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)
- **Health Check**: http://localhost:8000/health

## Key Metrics

- `voice_sessions_active` - Active sessions
- `voice_processing_latency_seconds` - End-to-end latency
- `voice_asr_latency_seconds` - ASR processing time
- `voice_llm_latency_seconds` - LLM response time
- `voice_tts_latency_seconds` - TTS synthesis time
- `voice_errors_total` - Error count by component

## Scaling Considerations

1. **Horizontal Scaling**: Deploy multiple API instances behind load balancer
2. **Session Storage**: Use Redis Cluster for distributed session state
3. **GPU Inference**: Deploy ASR/TTS on GPU instances for lower latency
4. **CDN**: Serve static assets via CDN
5. **Rate Limiting**: Implement per-client rate limiting

## License

MIT License - Created for Chatbucket Voice AI Engineer application
