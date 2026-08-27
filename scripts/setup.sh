#!/bin/bash
set -e

echo "🚀 Setting up Voice AI Platform..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}' | cut -d. -f1,2)
echo "Python version: $python_version"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Copy environment file
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  source venv/bin/activate"
echo "  uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "Or with Docker:"
echo "  docker-compose up"
echo ""
echo "Open http://localhost:8000 in your browser"
