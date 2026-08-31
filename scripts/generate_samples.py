#!/usr/bin/env python3
"""Generate sample audio files for voice cloning demo using Edge TTS."""

import asyncio
import os

# Edge TTS voices for sample voices
SAMPLE_VOICES = {
    "professional_male": {
        "name": "Professional Male",
        "voice": "en-US-GuyNeural",
        "text": "Hello, this is a professional male voice sample for voice cloning."
    },
    "warm_female": {
        "name": "Warm Female",
        "voice": "en-US-AvaNeural",
        "text": "Hello, this is a warm female voice sample for voice cloning."
    },
    "energetic_youth": {
        "name": "Energetic Youth",
        "voice": "en-US-AnaNeural",
        "text": "Hello, this is an energetic youth voice sample for voice cloning."
    },
    "calm_narrator": {
        "name": "Calm Narrator",
        "voice": "en-US-AndrewNeural",
        "text": "Hello, this is a calm narrator voice sample for voice cloning."
    }
}

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend-app", "public", "samples")

async def generate_sample(voice_id: str, voice_info: dict):
    """Generate a sample audio file using Edge TTS."""
    import edge_tts
    
    output_path = os.path.join(OUTPUT_DIR, f"{voice_id}.wav")
    
    print(f"Generating {voice_info['name']} using voice {voice_info['voice']}...")
    
    communicate = edge_tts.Communicate(voice_info["text"], voice_info["voice"])
    await communicate.save(output_path)
    
    file_size = os.path.getsize(output_path)
    print(f"  Saved to {output_path} ({file_size} bytes)")

async def main():
    """Generate all sample audio files."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("Generating sample audio files for voice cloning demo...\n")
    
    tasks = []
    for voice_id, voice_info in SAMPLE_VOICES.items():
        tasks.append(generate_sample(voice_id, voice_info))
    
    await asyncio.gather(*tasks)
    
    print(f"\nDone! Generated {len(SAMPLE_VOICES)} sample audio files in {OUTPUT_DIR}")

if __name__ == "__main__":
    asyncio.run(main())
