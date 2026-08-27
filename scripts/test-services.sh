#!/bin/bash
# Quick test script for Voice AI services
# Usage: ./scripts/test-services.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Voice AI Quick Test ===${NC}"
echo ""

# ---- Test 1: Edge TTS (free, no profile needed) ----
echo -e "${YELLOW}[1/3] Testing Edge TTS (free Microsoft voices)...${NC}"
python3 -c "
import asyncio
import edge_tts

async def test():
    communicate = edge_tts.Communicate('Hello! This is a test of the free Edge TTS engine. It sounds natural and requires no API key.', 'en-US-AvaNeural')
    await communicate.save('/tmp/test-edge-tts.mp3')
    print('✓ Edge TTS: Generated /tmp/test-edge-tts.mp3')

asyncio.run(test())
" 2>&1

if [ -f /tmp/test-edge-tts.mp3 ]; then
    echo -e "${GREEN}  ✓ Edge TTS working!${NC}"
    echo "    Play: afplay /tmp/test-edge-tts.mp3"
else
    echo -e "${RED}  ✗ Edge TTS failed${NC}"
fi

echo ""

# ---- Test 2: Voicebox API ----
echo -e "${YELLOW}[2/3] Testing Voicebox API...${NC}"
HEALTH=$(curl -s http://127.0.0.1:17493/health 2>/dev/null)
if echo "$HEALTH" | grep -q "healthy"; then
    echo -e "${GREEN}  ✓ Voicebox API running on http://127.0.0.1:17493${NC}"
    echo "    GPU: $(echo $HEALTH | python3 -c 'import sys,json; print(json.load(sys.stdin).get("gpu_type","unknown"))' 2>/dev/null)"
else
    echo -e "${YELLOW}  ! Voicebox not running (start with: ./scripts/start-services.sh)${NC}"
fi

echo ""

# ---- Test 3: Call Translator ----
echo -e "${YELLOW}[3/3] Testing Call Translator...${NC}"
if curl -s http://127.0.0.1:5050 > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ Call Translator running on http://127.0.0.1:5050${NC}"
    echo "    Open in browser for real-time voice translation"
else
    echo -e "${YELLOW}  ! Call Translator not running${NC}"
fi

echo ""

# ---- Summary ----
echo -e "${GREEN}=== Test Complete ===${NC}"
echo ""
echo "Quick commands:"
echo "  Play test audio:     afplay /tmp/test-edge-tts.mp3"
echo "  Open Voicebox UI:    open http://127.0.0.1:17493"
echo "  Open Translator UI:  open http://127.0.0.1:5050"
echo "  Start all services:  ./scripts/start-services.sh"
echo ""
