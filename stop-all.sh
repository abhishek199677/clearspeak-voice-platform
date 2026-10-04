#!/bin/bash
# ==============================================================================
# ClearSpeak AI Voice Platform - Server Stopper
# ==============================================================================
LOG_DIR="/tmp/clearspeak-logs"

echo "=========================================================="
echo " Stopping ClearSpeak Enterprise Voice AI Platform"
echo "=========================================================="

# 1. Stop Backend (port 8000)
if [ -f "$LOG_DIR/backend.pid" ]; then
    PID=$(cat "$LOG_DIR/backend.pid")
    if kill -0 "$PID" 2>/dev/null; then
        echo "Stopping Backend PID: $PID"
        kill "$PID" 2>/dev/null || true
    fi
    rm -f "$LOG_DIR/backend.pid"
fi

# Fallback port 8000 cleanup
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
echo "✓ Backend server stopped (port 8000 freed)"

# 2. Stop Frontend (port 3000 / 3001)
if [ -f "$LOG_DIR/frontend.pid" ]; then
    PID=$(cat "$LOG_DIR/frontend.pid")
    if kill -0 "$PID" 2>/dev/null; then
        echo "Stopping Frontend PID: $PID"
        kill "$PID" 2>/dev/null || true
    fi
    rm -f "$LOG_DIR/frontend.pid"
fi

# Fallback Vite ports cleanup
lsof -ti:5173 -ti:3000 -ti:3001 | xargs kill -9 2>/dev/null || true
echo "✓ Frontend server stopped (ports 5173, 3000 & 3001 freed)"

echo "=========================================================="
echo " All ClearSpeak servers have been stopped."
echo "=========================================================="
