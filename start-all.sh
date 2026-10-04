#!/bin/bash
# ==============================================================================
# ClearSpeak AI Voice Platform - Enterprise Production & Dev Launcher
# ==============================================================================
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="/tmp/clearspeak-logs"
mkdir -p "$LOG_DIR"

echo "=========================================================="
echo " Starting ClearSpeak Enterprise Voice AI Platform"
echo " Location: $PROJECT_DIR"
echo "=========================================================="

# 1. Start Backend Server
echo "[1/2] Launching Enterprise Backend (FastAPI + WebSocket + ASR/TTS/LLM)..."
cd "$PROJECT_DIR"

# Don't start a second backend if one is already listening
if lsof -iTCP:8000 -sTCP:LISTEN > /dev/null 2>&1; then
    echo "      ✓ Backend already running on port 8000"
else
    # Pick the first Python environment that actually has the backend dependencies
    PYTHON_BIN=""
    for CAND in "$PROJECT_DIR/.venv312/bin/python" "$PROJECT_DIR/.venv/bin/python" "$PROJECT_DIR/venv/bin/python" "python3"; do
        if [ -x "$CAND" ] || command -v "$CAND" > /dev/null 2>&1; then
            if "$CAND" -c "import fastapi, uvicorn, whisper, edge_tts, httpx" > /dev/null 2>&1; then
                PYTHON_BIN="$CAND"
                break
            fi
        fi
    done
    if [ -z "$PYTHON_BIN" ]; then
        echo "ERROR: No Python environment with backend dependencies found."
        echo "       Install them with: pip install -r requirements.txt"
        exit 1
    fi
    echo "      Using Python: $PYTHON_BIN ($("$PYTHON_BIN" -V 2>&1))"

    nohup "$PYTHON_BIN" -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 > "$LOG_DIR/backend.log" 2>&1 &
    BACKEND_PID=$!
    echo "$BACKEND_PID" > "$LOG_DIR/backend.pid"

    # Wait for backend to be ready
    echo "      Waiting for backend health check..."
    for i in {1..30}; do
        if curl -s http://127.0.0.1:8000/health > /dev/null 2>&1; then
            echo "      ✓ Backend running on http://127.0.0.1:8000 (PID: $BACKEND_PID)"
            break
        fi
        sleep 1
    done
fi

# 2. Start Frontend App
echo "[2/2] Launching Frontend Interface..."
cd "$PROJECT_DIR/frontend-app"

# Check if already running (Vite uses 5173, older configs 3000/3001)
if lsof -iTCP:5173 -sTCP:LISTEN > /dev/null 2>&1; then
    echo "      ✓ Frontend is already running on port 5173"
elif lsof -iTCP:3001 -sTCP:LISTEN > /dev/null 2>&1; then
    echo "      ✓ Frontend is already running on port 3001"
elif lsof -iTCP:3000 -sTCP:LISTEN > /dev/null 2>&1; then
    echo "      ✓ Frontend is already running on port 3000"
else
    nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    echo "$FRONTEND_PID" > "$LOG_DIR/frontend.pid"
    sleep 2
    echo "      ✓ Frontend launched (PID: $FRONTEND_PID)"
fi

echo ""
echo "=========================================================="
echo " ClearSpeak Enterprise Platform is LIVE"
echo "=========================================================="
echo "  Frontend Application: http://localhost:5173"
echo "  Backend API Server:   http://localhost:8000"
echo "  API Documentation:    http://localhost:8000/api/docs"
echo "  Health & Metrics:     http://localhost:8000/health"
echo "  Prometheus Metrics:   http://localhost:8000/metrics"
echo "  Log Directory:        $LOG_DIR"
echo "=========================================================="
echo "To stop: kill \$(cat $LOG_DIR/*.pid 2>/dev/null)"
