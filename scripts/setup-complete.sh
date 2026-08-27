#!/bin/bash
# Complete Voice AI Platform Setup
# Sets up free, open-source alternatives to paid APIs
# Usage: ./scripts/setup-complete.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Voice AI Platform - Complete Setup${NC}"
echo -e "${GREEN}  (Free Open-Source Alternatives)${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TOOLS_DIR="$PROJECT_DIR/tools"

# ---- 1. Install Python dependencies ----
echo -e "${YELLOW}[1/6] Installing Python dependencies...${NC}"
cd "$PROJECT_DIR"
pip3 install httpx edge-tts 2>/dev/null || pip install httpx edge-tts
echo -e "${GREEN}  ✓ Python packages installed${NC}"

# ---- 2. Download Voicebox DMG ----
echo -e "${YELLOW}[2/6] Setting up Voicebox (TTS + Voice Cloning)...${NC}"
if [ -f "$TOOLS_DIR/Voicebox_0.5.0_aarch64.dmg" ]; then
    echo -e "${GREEN}  ✓ Voicebox DMG already downloaded${NC}"
    echo "    To install: hdiutil attach $TOOLS_DIR/Voicebox_0.5.0_aarch64.dmg"
    echo "    Then drag Voicebox.app to /Applications/"
else
    echo "    Downloading Voicebox..."
    curl -L -o "$TOOLS_DIR/Voicebox_0.5.0_aarch64.dmg" \
        "https://github.com/jamiepine/voicebox/releases/download/v0.5.0/Voicebox_0.5.0_aarch64.dmg"
    echo -e "${GREEN}  ✓ Voicebox DMG downloaded${NC}"
fi

# ---- 3. Download VoiceStudio DMG ----
echo -e "${YELLOW}[3/6] Setting up VoiceStudio (646 languages)...${NC}"
if [ -f "$TOOLS_DIR/VoiceStudio_0.5.0_aarch64.dmg" ]; then
    echo -e "${GREEN}  ✓ VoiceStudio DMG already downloaded${NC}"
    echo "    To install: hdiutil attach $TOOLS_DIR/VoiceStudio_0.5.0_aarch64.dmg"
    echo "    Then drag VoiceStudio.app to /Applications/"
else
    echo "    Downloading VoiceStudio..."
    curl -L -o "$TOOLS_DIR/VoiceStudio_0.5.0_aarch64.dmg" \
        "https://github.com/debpalash/VoiceStudio/releases/download/v0.5.0/VoiceStudio_0.5.0_aarch64.dmg"
    echo -e "${GREEN}  ✓ VoiceStudio DMG downloaded${NC}"
fi

# ---- 4. Setup Call Translator ----
echo -e "${YELLOW}[4/6] Setting up Call Translator (real-time translation)...${NC}"
if [ -d "$TOOLS_DIR/call-translator/.venv" ]; then
    echo -e "${GREEN}  ✓ Call Translator already set up${NC}"
else
    cd "$TOOLS_DIR/call-translator"
    export PATH="/opt/homebrew/bin:$PATH"
    ./setup.sh
    echo -e "${GREEN}  ✓ Call Translator set up${NC}"
fi

# ---- 5. Configure .env ----
echo -e "${YELLOW}[5/6] Configuring environment...${NC}"
ENV_FILE="$PROJECT_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" << 'EOF'
# Voice AI Platform - Environment Configuration
# Free alternatives to paid APIs

# ASR Provider (choose one)
# Option 1: Local Whisper (recommended, free)
ASR_PROVIDER=whisper

# Option 2: Deepgram (free tier: 200 min/month)
# ASR_PROVIDER=deepgram
# DEEPGRAM_API_KEY=your_key_here

# TTS Provider (choose one)
# Option 1: Voicebox (recommended, free, local)
TTS_PROVIDER=voicebox
VOICEBOX_URL=http://localhost:3333

# Option 2: VoiceStudio (646 languages, free, local)
# TTS_PROVIDER=voicestudio
# VOICESTUDIO_URL=http://localhost:3900

# Option 3: Edge TTS (free, cloud)
# TTS_PROVIDER=edge

# Option 4: ElevenLabs (paid)
# TTS_PROVIDER=elevenlabs
# ELEVENLABS_API_KEY=your_key_here

# LLM Provider (choose one)
# Option 1: Local Ollama (recommended, free)
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.2

# Option 2: OpenAI (paid)
# LLM_PROVIDER=openai
# OPENAI_API_KEY=your_key_here

# Real-time Translation (optional)
TRANSLATOR_URL=http://127.0.0.1:5050

# Redis
REDIS_URL=redis://localhost:6379/0

# Server
APP_ENV=development
DEBUG=true
LOG_LEVEL=INFO
EOF
    echo -e "${GREEN}  ✓ .env file created${NC}"
    echo -e "${YELLOW}  ! Edit .env to configure your preferred providers${NC}"
else
    echo -e "${GREEN}  ✓ .env file exists${NC}"
fi

# ---- 6. Start services ----
echo -e "${YELLOW}[6/6] Starting services...${NC}"

# Start Redis if not running
if ! pgrep -x redis-server > /dev/null; then
    if command -v redis-server &> /dev/null; then
        redis-server --daemonize yes
        echo -e "${GREEN}  ✓ Redis started${NC}"
    else
        echo -e "${YELLOW}  ! Redis not installed. Install with: brew install redis${NC}"
    fi
else
    echo -e "${GREEN}  ✓ Redis already running${NC}"
fi

# ---- Done ----
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo "Installed Tools:"
echo "  • Voicebox:      Voice cloning + TTS (7 engines, 23 languages)"
echo "  • VoiceStudio:   646 languages, video dubbing, dictation"
echo "  • Call Translator: Real-time voice translation for calls"
echo ""
echo "To install desktop apps:"
echo "  1. hdiutil attach $TOOLS_DIR/Voicebox_0.5.0_aarch64.dmg"
echo "  2. cp -R /Volumes/Voicebox/*.app /Applications/"
echo "  3. hdiutil detach /Volumes/Voicebox"
echo "  4. hdiutil attach $TOOLS_DIR/VoiceStudio_0.5.0_aarch64.dmg"
echo "  5. cp -R /Volumes/VoiceStudio/*.app /Applications/"
echo "  6. hdiutil detach /Volumes/VoiceStudio"
echo ""
echo "To start the platform:"
echo "  1. cd $PROJECT_DIR"
echo "  2. source venv/bin/activate"
echo "  3. uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"
echo "  4. Open http://localhost:8000"
echo ""
echo "To start Call Translator:"
echo "  cd $TOOLS_DIR/call-translator && ./run.sh"
echo "  Open http://127.0.0.1:5050"
echo ""
echo "API Endpoints:"
echo "  • Voicebox:    http://localhost:3333/api/tts"
echo "  • VoiceStudio: http://localhost:3900/api/tts"
echo "  • Platform:    http://localhost:8000"
echo ""
