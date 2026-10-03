.PHONY: dev start stop clean test docker-up docker-down

# Start both servers in background with logging and health checks
start:
	@./start-all.sh

# Stop both servers and free ports 8000, 3000, 3001
stop:
	@./stop-all.sh

# Run both servers in the foreground (Ctrl+C stops both)
dev:
	@echo "Starting backend and frontend together..."
	@trap 'kill 0' EXIT; \
	.venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload & \
	(cd frontend-app && npm run dev) & \
	wait

# Run with Docker Compose
docker-up:
	docker compose up --build

docker-down:
	docker compose down
