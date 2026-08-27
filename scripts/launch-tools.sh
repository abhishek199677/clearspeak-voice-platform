#!/bin/bash
# Launch all voice AI tools
# Usage: ./scripts/launch-tools.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Voice AI Tools Launcher ===${NC}"
echo ""

TOOLS_DIR="$(cd "$(dirname "$0")/../tools" && pwd)"

# 1. Voicebox (TTS + Voice Cloning)
echo -e "${YELLOW}[1/3] Starting Voicebox...${NC}"
if [ -f "/Applications/Voicebox.app/Contents/MacOS/voicebox" ]; then
    open -a Voicebox
    echo -e "${GREEN}  ✓ Voicebox launched${NC}"
else
    echo -e "${YELLOW}  ! Voicebox not installed as app. Install DMG from:${NC}"
    echo "    $TOOLS_DIR/Voicebox_0.5.0_aarch64.dmg"
    echo "    Or run: hdiutil attach $TOOLS_DIR/Voicebox_0.5.0_aarch64.dmg && cp -R /Volumes/Voicebox/*.app /Applications/"
fi

# 2. VoiceStudio (646 languages)
echo -e "${YELLOW}[2/3] Starting VoiceStudio...${NC}"
if [ -f "/Applications/VoiceStudio.app/Contents/MacOS/voicestudio" ]; then
    open -a VoiceStudio
    echo -e "${GREEN}  ✓ VoiceStudio launched${NC}"
else
    echo -e "${YELLOW}  ! VoiceStudio not installed as app. Install DMG from:${NC}"
    echo "    $TOOLS_DIR/VoiceStudio_0.5.0_aarch64.dmg"
fi

# 3. Call Translator (real-time translation)
echo -e "${YELLOW}[3/3] Starting Call Translator...${NC}"
if [ -d "$TOOLS_DIR/call-translator/.venv" ]; then
    cd "$TOOLS_DIR/call-translator"
    export PATH="/opt/homebrew/bin:$PATH"
    nohup ./run.sh > /tmp/call-translator.log 2>&1 &
    sleep 2
    if curl -s http://127.0.0.1:5050 > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ Call Translator running at http://127.0.0.1:5050${NC}"
    else
        echo -e "${YELLOW}  ! Call Translator starting... check http://127.0.0.1:5050${NC}"
    fi
else
    echo -e "${YELLOW}  ! Call Translator not set up. Run:${NC}"
    echo "    cd $TOOLS_DIR/call-translator && ./setup.sh"
fi

echo ""
echo -e "${GREEN}=== All tools launched ===${NC}"
echo ""
echo "Voicebox API:      http://localhost:3333 (when running)"
echo "VoiceStudio API:   http://localhost:3900 (when running)"
echo "Call Translator:   http://127.0.0.1:5050"
echo ""
echo "Your Voice Platform: http://localhost:8000"
