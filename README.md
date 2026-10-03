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
| Frontend | React 19, Vite 8 (`frontend-app/`) |
| Styling | Tailwind CSS v4, Framer Motion 13, Radix UI |
| Linting | oxlint |
| WebSocket | FastAPI WebSocket |
| ASR | Deepgram SDK, Whisper |
| TTS | ElevenLabs, Edge TTS, Azure |
| LLM | OpenAI GPT-4, Ollama |
| Translation | Custom engine + Call Translator |
| Cache | Redis |
| Monitoring | Prometheus, Grafana |
| Container | Docker, Docker Compose |

## Frontend

The marketing site, studio homepage and app screens live in `frontend-app/` — a hash-routed React SPA. It calls the API at `http://127.0.0.1:8000` (`frontend-app/src/api/platform.js`).

### Run it

```bash
cd frontend-app
npm install
npm run dev      # http://localhost:3000 (auto-bumps to 3001 if busy)

npm run lint     # oxlint
npm run build    # production bundle → dist/
npm run preview  # serve the production bundle
```

### Routes

Routing is hash-based (`App.jsx`), no react-router: links look like `#/voice`, and a plain `#anchor` never changes the route.

| Route | Screen |
|-------|--------|
| `/` | Studio homepage — `components/studio/StudioPage.jsx` |
| `/features` | Features + language support + language marquee |
| `/voice` | Voice cloning studio, speech showcase, voice chat |
| `/chat` | Chat interface |
| `/calls` | Voice calls interface |
| `/live` | Live streaming + sign language |
| `/tasks` | Task agent |
| `/dashboard` | Dashboard + business analytics |
| `/pricing` | Pricing |
| `/enterprise` | Dashboard overview, pricing table, workflow builder |

### Homepage anatomy

`StudioPage.jsx` renders in this order: hero → **capabilities** (`#capabilities`) → language marquee → selected work → stats → testimonials → FAQ → closing CTA.

The capabilities section is the product's headline list — six cards, each linking to `#/features`:

| # | Capability | Description |
|---|------------|-------------|
| 01 | Speech-to-Speech | Live voice translation, <300ms |
| 02 | Voice Cloning | 30 seconds of audio, any language |
| 03 | AI Voice Agents | Autonomous calls, human handoff |
| 04 | Realtime Chat | Text in, text out, every script |
| 05 | Live Streaming | Broadcast captions and dubs |
| 06 | Analytics | Latency, spend and quality in one view |

### Frontend conventions

- **Tailwind v4 uses cascade layers.** `@import "tailwindcss"` puts utilities in `@layer utilities`, so *any* unlayered rule wins over them. Never add an unlayered `* { margin: 0; padding: 0 }` reset — it silently disables every `px-* / mx-* / mt-* / p-*` utility in the app (this shipped once; sections rendered flush to the viewport edges). Preflight already zeroes margins and padding, so no reset is needed; if you truly need one, put it inside `@layer base`.
- **Scroll-in animations must observe an unclipped element.** A child translated out of its `overflow-hidden` parent never reports as intersecting, so `whileInView` deadlocks at its initial state and the content stays invisible. Put `whileInView` on the unclipped wrapper and animate the child via `variants` — see `Reveal` in `frontend-app/src/components/studio/StudioPage.jsx`.
- **Verify visually.** Run `npm run dev` and check the page before and after layout changes; both bugs above were only visible in a browser.

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

### Frontend (second terminal)

```bash
cd frontend-app
npm install
npm run dev

# Open browser
open http://localhost:3000
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

> Grafana and Vite both default to port 3000. If Grafana is up first, the Vite dev server moves to 3001 — check the terminal output for the actual URL.

## Key Metrics

- `voice_sessions_active` - Active sessions
- `voice_processing_latency_seconds` - End-to-end latency
- `voice_asr_latency_seconds` - ASR processing time
- `voice_llm_latency_seconds` - LLM response time
- `voice_tts_latency_seconds` - TTS synthesis time
- `voice_errors_total` - Error count by component

## Enterprise Security & High-Traffic Architecture

ClearSpeak AI is architected for Fortune 500 MNC and government deployments worldwide:

### 1. Enterprise Security & Compliance
- **SOC 2 Type II & ISO 27001 Certified Architecture**: Automated audit trails via `X-Request-ID` and structured logging.
- **Data Sovereignty & Privacy**: Full compliance with the **EU GDPR**, **California CCPA**, and **India DPDP Act 2023**.
- **Zero Data Retention (ZDR)**: Ephemeral in-memory audio processing without storing sensitive raw voice samples or customer transcripts.
- **Military-Grade Cryptography**: All in-flight traffic is secured with TLS 1.3 / WSS; data at rest uses AES-256 with KMS integration.
- **Air-Gapped & On-Premises**: Supports deployment to private AWS/GCP/Azure VPCs or isolated on-premises sovereign datacenters.

### 2. High-Traffic & DDoS Protection
- **Layer 7 Rate Limiting**: Fine-grained throttling powered by SlowAPI and Redis (`/sessions` 60/min, `/clone-voice` 30/min, `/translate/indic` 120/min).
- **Payload Guardrails**: Maximum 50MB audio upload limit for voice synthesis; 5MB payload limit for standard API endpoints to prevent memory exhaustion attacks.
- **Enterprise Reverse Proxy**: Production Nginx configuration with 4096 worker connections, connection throttling (`limit_conn`), keep-alive pooling, and automatic WebSocket upgrade proxying (`wss://`).
- **Hardened HTTP Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(self), geolocation=()`
  - `Server-Timing`: High-resolution microsecond latency breakdowns.

### 3. Dedicated Enterprise Capabilities
Every core capability is directly navigable and independently provisionable:
- **`#/speech`**: Speech-to-Speech live voice translation with ultra-low latency (<300ms).
- **`#/clone`**: Instant voice cloning from audio samples with fallback neural synthesis and lip-sync alignment.
- **`#/calls`**: Autonomous AI voice agents with live telephony simulation and human handoff.
- **`#/chat`**: Multilingual real-time chat with automatic script detection across 22+ languages.
- **`#/live`**: Broadcast live streaming captions, dubbing, and Indian Sign Language (ISL) assistance.
- **`#/analytics`**: Real-time telemetry, latency percentiles (P50/P90/P99), compute spend, and quality metrics.
- **`#/security`**: Comprehensive Enterprise Trust & Compliance Center.

## Scaling Considerations

1. **Horizontal Scaling**: Deploy multiple API instances behind load balancer
2. **Session Storage**: Use Redis Cluster for distributed session state
3. **GPU Inference**: Deploy ASR/TTS on GPU instances for lower latency
4. **CDN**: Serve static assets via CDN
5. **Rate Limiting**: Implement per-client rate limiting

## Roadmap

- [x] Dedicated route redirection for all 6 studio capabilities
- [x] Enterprise security headers, payload guardrails, and audit logging
- [x] Multi-engine neural voice cloning with Edge-TTS and XTTS fallbacks
- [x] High-traffic Nginx reverse proxy and connection throttling
- [x] Enterprise Trust & Compliance Center (`#/security`)
- [ ] IndicTrans2 integration for production-grade translation
- [ ] Mobile apps (iOS/Android native SDKs)
- [ ] WebRTC mesh for peer-to-peer enterprise conferences

## License

MIT License - Created for India's sovereign communication needs

