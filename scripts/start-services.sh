#!/bin/bash
# Launch all voice AI services (headless, no desktop apps needed)
# Usage: ./scripts/start-services.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Starting Voice AI Services ===${NC}"
echo ""

TOOLS_DIR="$(cd "$(dirname "$0")/../tools" && pwd)"
LOG_DIR="/tmp/voice-ai-logs"
mkdir -p "$LOG_DIR"

# ---- 1. Voicebox Server (TTS + Voice Cloning) ----
echo -e "${YELLOW}[1/3] Starting Voicebox Server...${NC}"
if [ -d "$TOOLS_DIR/voicebox" ]; then
    cd "$TOOLS_DIR/voicebox"
    
    # Check if venv exists, create if not
    if [ ! -d ".venv" ]; then
        echo "    Creating Python venv..."
        python3 -m venv .venv
        source .venv/bin/activate
        pip install --quiet -r requirements.txt 2>&1 | tail -3
    else
        source .venv/bin/activate
    fi
    
    # Start voicebox server in background
    nohup python -m backend.server --host 127.0.0.1 --port 17493 \
        > "$LOG_DIR/voicebox.log" 2>&1 &
    VOICEBOX_PID=$!
    echo "$VOICEBOX_PID" > "$LOG_DIR/voicebox.pid"
    
    # Wait for server to start
    sleep 3
    if kill -0 $VOICEBOX_PID 2>/dev/null; then
        echo -e "${GREEN}  ✓ Voicebox Server running on http://127.0.0.1:17493 (PID: $VOICEBOX_PID)${NC}"
    else
        echo -e "${RED}  ✗ Voicebox failed to start. Check $LOG_DIR/voicebox.log${NC}"
    fi
else
    echo -e "${RED}  ✗ Voicebox not found at $TOOLS_DIR/voicebox${NC}"
fi

# ---- 2. VoiceStudio Backend (646 languages) ----
echo -e "${YELLOW}[2/3] Starting VoiceStudio Backend...${NC}"
if [ -d "$TOOLS_DIR/OmniVoice-Studio" ]; then
    cd "$TOOLS_DIR/OmniVoice-Studio"
    
    # Check if bun is available
    if command -v bun &>/dev/null; then
        nohup bun run backend > "$LOG_DIR/voicestudio.log" 2>&1 &
        VS_PID=$!
        echo "$VS_PID" > "$LOG_DIR/voicestudio.pid"
        sleep 3
        if kill -0 $VS_PID 2>/dev/null; then
            echo -e "${GREEN}  ✓ VoiceStudio Backend running on http://127.0.0.1:3900 (PID: $VS_PID)${NC}"
        else
            echo -e "${RED}  ✗ VoiceStudio failed to start. Check $LOG_DIR/voicestudio.log${NC}"
        fi
    else
        echo -e "${YELLOW}  ! bun not found. Install: curl -fsSL https://bun.sh/install | bash${NC}"
        echo "    Or run manually: cd $TOOLS_DIR/OmniVoice-Studio && bun run dev"
    fi
else
    echo -e "${RED}  ✗ VoiceStudio not found at $TOOLS_DIR/OmniVoice-Studio${NC}"
fi

# ---- 3. Call Translator (real-time translation) ----
echo -e "${YELLOW}[3/3] Starting Call Translator...${NC}"
if [ -d "$TOOLS_DIR/call-translator/.venv" ]; then
    cd "$TOOLS_DIR/call-translator"
    export PATH="/opt/homebrew/bin:$PATH"
    
    nohup ./run.sh > "$LOG_DIR/translator.log" 2>&1 &
    TRANSLATOR_PID=$!
    echo "$TRANSLATOR_PID" > "$LOG_DIR/translator.pid"
    sleep 3
    if curl -s http://127.0.0.1:5050 > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Call Translator running on http://127.0.0.1:5050 (PID: $TRANSLATOR_PID)${NC}"
    else
        echo -e "${YELLOW}  ! Call Translator starting... check http://127.0.0.1:5050${NC}"
    fi
else
    echo -e "${YELLOW}  ! Call Translator not set up. Run: cd $TOOLS_DIR/call-translator && ./setup.sh${NC}"
fi

echo ""
echo -e "${GREEN}=== All Services Started ===${NC}"
echo ""
echo "Service URLs:"
echo "  Voicebox (TTS):        http://127.0.0.1:17493"
echo "  VoiceStudio (646 lang): http://127.0.0.1:3900"
echo "  Call Translator:        http://127.0.0.1:5050"
echo "  Your Platform:          http://localhost:8000"
echo ""
echo "Logs: $LOG_DIR/"
echo ""
echo "To stop all services:"
echo "  kill \$(cat $LOG_DIR/*.pid)"
