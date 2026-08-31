# ClearSpeak AI - India's Sovereign Communication Platform

**For India. By India. With India.**

One App. Every Language. Limitless Possibilities.

## Vision

ClearSpeak AI is an indigenous (Atmanirbhar), secure, compliant, and sovereign communication platform tailored to India's scale (1.4B+ people, 22+ languages). It solves the dependency on foreign apps by providing:

- **Real-time AI translation** across 22 Scheduled Languages of India
- **Voice AI calls** with live translation
- **Smart messaging** with language detection
- **Enterprise/group collaboration** with multi-language support

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ClearSpeak AI Platform                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐             │
│   │  Client  │────▶│WebSocket│────▶│Pipeline │────▶│  LLM    │             │
│   │ (Browser)│◀────│ Handler │◀────│  with   │◀────│(GPT-4/  │             │
│   └─────────┘     └─────────┘     │Translate│     │ Ollama) │             │
│        │               │          └────┬────┘     └─────────┘             │
│        │               │               │                                   │
│        │               │          ┌────┴────┐     ┌─────────┐             │
│        │               │          │  ASR    │     │  TTS    │             │
│        │               │          │(Deepgram│     │(ElevenLabs│            │
│        │               │          │ Whisper)│     │ Edge TTS)│             │
│        │               │          └─────────┘     └─────────┘             │
│        │               │                                                   │
│   ┌────┴───────────────┴───────────────────────────────────────────┐      │
│   │              Translation Engine (22 Indian Languages)           │      │
│   │  - Hindi, Bengali, Tamil, Telugu, Malayalam, Kannada          │      │
│   │  - Gujarati, Marathi, Punjabi, Urdu, Assamese, Odia           │      │
│   │  - Sanskrit, Konkani, Dogri, Maithili, Santali                │      │
│   │  - Kashmiri, Manipuri, Bodo, Sindhi, Nepali                   │      │
│   └────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│   ┌────────────────────────────────────────────────────────────────────┐  │
│   │                     Session Manager (Redis-backed)                 │  │
│   │  - Concurrent session handling                                     │  │
│   │  - State machine management                                        │  │
│   │  - Conversation history                                            │  │
│   └────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   ┌────────────────────────────────────────────────────────────────────┐  │
│   │                     Monitoring & Observability                     │  │
│   │  - Prometheus metrics  │  - Structured logging  │  - Grafana     │  │
│   └────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Features

### 1. 22 Indian Scheduled Languages
Full support for all 22 Scheduled Languages of India:

| Language | Code | Script | Speakers |
|----------|------|--------|----------|
| Hindi | hi | Devanagari | 600M |
| Bengali | bn | Bengali | 97M |
| Tamil | ta | Tamil | 85M |
| Telugu | te | Telugu | 95M |
| Malayalam | ml | Malayalam | 38M |
| Kannada | kn | Kannada | 50M |
| Gujarati | gu | Gujarati | 56M |
| Marathi | mr | Devanagari | 99M |
| Punjabi | pa | Gurmukhi | 113M |
| Urdu | ur | Arabic | 70M |
| Assamese | as | Bengali | 15M |
| Odia | or | Odia | 38M |
| Sanskrit | sa | Devanagari | 0.02M |
| Konkani | gom | Devanagari | 7.6M |
| Dogri | doi | Devanagari | 3.2M |
| Maithili | mai | Devanagari | 52M |
| Santali | sat | Ol Chiki | 7.4M |
| Kashmiri | ks | Arabic | 6.8M |
| Manipuri | mni | Meitei | 1.8M |
| Bodo | brx | Devanagari | 1.5M |
| Sindhi | sd | Arabic | 30M |
| Nepali | ne | Devanagari | 25M |

### 2. Real-Time Translation
- Automatic language detection via Unicode script analysis
- Cross-lingual communication (speak Hindi, get English response)
- Translation caching for performance
- User language preferences

### 3. Voice AI Pipeline
- Audio → ASR → Translation → LLM → Translation → TTS → Audio
- Support for multiple ASR providers (Deepgram, Whisper)
- Multiple TTS providers (ElevenLabs, Edge TTS, Azure)
- Real-time streaming with low latency

### 4. Chat & Collaboration
- Channels (public/private/direct/group)
- Real-time messaging with translation
- Reactions, typing indicators, read receipts
- Voice calls with live translation

### 5. Enterprise Features
- API key authentication
- Rate limiting
- Prometheus metrics
- Structured logging
- Redis-backed session management

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Python 3.11+, FastAPI |
| WebSocket | FastAPI WebSocket |
| ASR | Deepgram SDK, Whisper |
| TTS | ElevenLabs, Edge TTS, Azure |
| LLM | OpenAI GPT-4, Ollama |
| Translation | Custom engine + Call Translator |
| Cache | Redis |
| Monitoring | Prometheus, Grafana |
| Container | Docker, Docker Compose |

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

### Environment Variables

```env
# Application
APP_NAME=ClearSpeak AI
APP_ENV=production
DEBUG=false

# ASR
ASR_PROVIDER=deepgram
DEEPGRAM_API_KEY=your_key_here

# TTS
TTS_PROVIDER=edge
# TTS_PROVIDER=elevenlabs
# ELEVENLABS_API_KEY=your_key_here

# LLM
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here
# Or use Ollama for free local inference
# LLM_PROVIDER=ollama
# OLLAMA_MODEL=llama3.2

# Translation
TRANSLATION_PROVIDER=local
DEFAULT_LANGUAGE=en
INDIA_DEFAULT_LANGUAGE=hi
ENABLE_AUTO_TRANSLATE=true

# All 22 Indian Scheduled Languages
INDIA_LANGUAGE_CODES=hi,bn,ta,te,ml,kn,gu,mr,pa,ur,as,or,sa,gom,doi,mai,sat,ks,mni,brx,sd,ne
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Voice agent UI |
| GET | `/health` | Health check |
| POST | `/sessions` | Create session |
| GET | `/sessions/{id}` | Get session |
| DELETE | `/sessions/{id}` | Close session |
| POST | `/translate` | Translate text |
| GET | `/languages` | Get supported languages |
| POST | `/user-language` | Set user language |
| GET | `/channels` | List channels |
| POST | `/channels` | Create channel |
| POST | `/channels/{id}/messages` | Send message |
| POST | `/calls` | Create voice call |
| WS | `/ws/{session_id}` | WebSocket streaming |

## Translation API

### Translate Text

```bash
curl -X POST "http://localhost:8000/translate" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "target_language": "hi"}'

# Response: {"translated_text": "नमस्ते", "target_language": "hi"}
```

### Get Supported Languages

```bash
curl "http://localhost:8000/languages"

# Response: {"languages": {"hi": "Hindi", "bn": "Bengali", ...}}
```

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
  "text": "Response text in user's language",
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

## Roadmap

- [ ] IndicTrans2 integration for production-grade translation
- [ ] Whisper fine-tuning for Indian languages
- [ ] Edge TTS voices for all 22 Indian languages
- [ ] End-to-end encryption
- [ ] Mobile apps (iOS/Android)
- [ ] WebRTC for peer-to-peer calls
- [ ] File sharing with translation
- [ ] Screen sharing with live translation

## License

MIT License - Created for India's sovereign communication needs
