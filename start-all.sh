#!/bin/bash
echo "=== Starting Voice AI Platform ==="

mkdir -p /tmp/voice-ai-logs

# Start Voicebox
echo "[1/3] Starting Voicebox..."
cd /Users/mac/Desktop/voice/tools/voicebox
source .venv/bin/activate
nohup python -m uvicorn backend.app:app --host 127.0.0.1 --port 17493 > /tmp/voice-ai-logs/voicebox.log 2>&1 &
echo $! > /tmp/voice-ai-logs/voicebox.pid
sleep 2

# Start Frontend
echo "[2/3] Starting Frontend..."
cd /Users/mac/Desktop/voice/frontend-app
nohup npm run dev > /tmp/voice-ai-logs/frontend.log 2>&1 &
echo $! > /tmp/voice-ai-logs/frontend.pid
sleep 2

echo ""
echo "=== Services Running ==="
echo "  Frontend:      http://localhost:3000"
echo "  Voicebox:      http://127.0.0.1:17493"
echo ""
echo "To stop: kill \$(cat /tmp/voice-ai-logs/*.pid)"
