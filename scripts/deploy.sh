#!/bin/bash
set -e

echo "🚀 Deploying Voice AI Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it first."
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Copying from template..."
    cp .env.example .env
    echo "Please edit .env with your API keys before continuing."
    exit 1
fi

# Build and start services
echo "Building Docker images..."
docker-compose build

echo "Starting services..."
docker-compose up -d

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Services:"
echo "  - Voice API: http://localhost:8000"
echo "  - Prometheus: http://localhost:9090"
echo "  - Grafana: http://localhost:3000"
echo ""
echo "Check status: docker-compose ps"
echo "View logs: docker-compose logs -f"
echo "Stop services: docker-compose down"
