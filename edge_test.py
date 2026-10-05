import asyncio, edge_tts

TEXT = "Watch ClearSpeak translate live conversations across 22 Indian languages."

async def try_voice(text, voice):
    try:
        c = edge_tts.Communicate(text, voice)
        n = 0
        async for ch in c.stream():
            if ch["type"] == "audio":
                n += len(ch["data"])
        return n
    except Exception as e:
        return f"ERR {type(e).__name__}: {e}"

async def main():
    cases = [
        ("mr", "mr-IN-AarohiNeural"),
        ("pa", "pa-IN-GurpreetNeural"),
        ("or", "or-IN-GopikaNeural"),
        ("as", "as-IN-XorophuNeural"),
        ("sa", "sa-IN-MadhurNeural"),
        ("gom", "gom-IN-VallabhNeural"),
        ("hi", "hi-IN-SwaraNeural"),
        ("hi-multi", "en-US-AvaMultilingualNeural"),
        ("sa-multi", "en-US-AvaMultilingualNeural"),
    ]
    for name, voice in cases:
        print(name, voice, await try_voice(TEXT, voice))

asyncio.run(main())
