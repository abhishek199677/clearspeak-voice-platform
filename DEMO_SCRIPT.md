# ClearSpeak Voice AI Platform - Demo Video Script

## Prerequisites
- Platform running: `docker compose up -d`
- Open two browser tabs:
  - Tab 1: `http://localhost:8000` (Landing page)
  - Tab 2: `http://localhost:8000/admin` (Login: admin / admin123)
- Terminal open for API calls
- Screen recording software (OBS, QuickTime, etc.)

---

## Part 1: Landing Page (30 seconds)

**Action:** Open `http://localhost:8000` in Tab 1

1. **(5s)** Show the hero section with animated text "One App. Every Language. Limitless Possibilities."
2. **(5s)** Point to the stats bar: 22 Indian Languages, 200+ Global, <300ms Latency, 1.4B+ People
3. **(5s)** Scroll down to the animated feature cards (Real-Time Translation, Neural TTS, Bhashini ASR, etc.)
4. **(5s)** Show the 22-language scrolling marquee
5. **(5s)** Scroll to "How It Works" - show the 3-step pipeline (Speak → Translate → Speak)
6. **(5s)** Show the pricing section briefly

---

## Part 2: Translation Mode Demo (45 seconds)

**Action:** Click "Try Translation Mode" on the landing page, or navigate to the VoiceChat

1. **(5s)** Show the settings panel:
   - Mode: **Translation** (highlighted in purple)
   - Source Language: **English**
   - Target Language: **Telugu**
   - Click "Confirm Languages"

2. **(10s)** Type in the text input and send:
   ```
   Hello, how are you today?
   ```
   → Show the Telugu translation appearing: "హలో, మీరు ఈ రోజు ఎలా ఉన్నారు?"

3. **(10s)** Send another message:
   ```
   My name is Abhishek. What is your name?
   ```
   → Show: "నా పేరు అభిషేక్. మీ పేరు ఏమిటి?"

4. **(10s)** Try a different language pair - click the language swap button:
   - Source: Telugu → Target: English
   - Type in Telugu (or paste): "నమస్కారం, మీరు ఎలా ఉన్నారు?"
   → Show English translation: "Hello, how are you?"

5. **(10s)** Show the microphone button and animated pulse rings while recording

---

## Part 3: Agent Mode Demo (30 seconds)

**Action:** Switch to Agent mode in the settings panel

1. **(5s)** Click the "Agent" button in the Mode selection (highlighted in orange)
   - Show "AI assistant ready" message

2. **(10s)** Type a question:
   ```
   What are the top 3 programming languages in 2026?
   ```
   → Show the AI response streaming in

3. **(10s)** Send another question:
   ```
   Explain the difference between AI and machine learning
   ```
   → Show the detailed response

4. **(5s)** Show the transcript appearing in real-time

---

## Part 4: API Demo (30 seconds)

**Action:** Run these commands in the terminal while recording

### Show Health Check
```bash
curl -s http://localhost:8000/health | python3 -m json.tool
```
→ Show the provider status (Deepgram ASR, Edge TTS, GPT-4 LLM)

### Show Translation API
```bash
curl -s -X POST "http://localhost:8000/translate?text=Hello%20world&target_language=hi" | python3 -m json.tool
```
→ Show Hindi translation

### Show Indic Translation
```bash
curl -s -X POST "http://localhost:8000/translate/indic?text=Welcome%20to%20India&source_language=en&target_language=ta" | python3 -m json.tool
```
→ Show Tamil translation using IndicTrans2

### Show Supported Languages
```bash
curl -s http://localhost:8000/languages | python3 -m json.tool
```
→ Show the 32 supported languages

---

## Part 5: Monitoring Dashboard (15 seconds)

**Action:** Navigate to the Monitor page

1. **(5s)** Click "Monitor" in the navigation bar
2. **(5s)** Show the embedded Grafana dashboard with:
   - HTTP request metrics
   - System resource usage
   - Active sessions

---

## Part 6: Closing (10 seconds)

**Action:** Return to the landing page

1. **(5s)** Show the hero section again with the tagline
2. **(5s)** End with the CTA "Get Started Free"

---

## Total Duration: ~2:40

## Quick Recording Checklist

- [ ] Platform running on localhost:8000
- [ ] Screen recording started
- [ ] Landing page loaded and animated
- [ ] Translation mode tested (English → Telugu)
- [ ] Agent mode tested with questions
- [ ] API calls shown in terminal
- [ ] Grafana dashboard shown
- [ ] Recording stopped and exported
