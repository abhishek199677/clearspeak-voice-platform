FROM node:20-slim AS frontend-build

WORKDIR /app/frontend-app
COPY frontend-app/package.json frontend-app/package-lock.json ./
RUN npm ci
COPY frontend-app/ ./
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies including ffmpeg for whisper audio processing
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    ffmpeg \
    libsndfile1 \
    pkg-config \
    libavformat-dev \
    libavcodec-dev \
    libavdevice-dev \
    libavutil-dev \
    libswscale-dev \
    libswresample-dev \
    libavfilter-dev \
    && rm -rf /var/lib/apt/lists/*

# Install CPU-only PyTorch first to avoid downloading CUDA packages (~1.5GB)
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Pre-install packaging tools with setuptools<70 for openai-whisper
RUN pip install --no-cache-dir --upgrade pip "setuptools<70" wheel

# Pre-install openai-whisper with --no-build-isolation to use setuptools<70 (pkg_resources)
RUN pip install --no-cache-dir --no-build-isolation openai-whisper==20231117

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Copy built frontend from build stage
COPY --from=frontend-build /app/frontend-app/dist ./frontend-app/dist

# Expose ports
EXPOSE 8000
EXPOSE 8001

# Run the application
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
