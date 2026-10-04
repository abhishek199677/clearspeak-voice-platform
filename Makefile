.PHONY: dev start stop clean test docker-up docker-down

# First Python env that has the backend dependencies
PY := $(shell for p in .venv312/bin/python .venv/bin/python venv/bin/python python3; do $$p -c "import fastapi, whisper, edge_tts, httpx" >/dev/null 2>&1 && echo $$p && break; done)

# Start both servers in background with logging and health checks
start:
	@./start-all.sh

# Stop both servers and free ports 8000, 3000, 3001
stop:
	@./stop-all.sh

# Run both servers in the foreground (Ctrl+C stops both)
dev:
	@echo "Starting backend and frontend together with: $(PY)"
	@trap 'kill 0' EXIT; \
	$(PY) -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload & \
	(cd frontend-app && npm run dev) & \
	wait

# Run with Docker Compose
docker-up:
	docker compose up --build

docker-down:
	docker compose down
