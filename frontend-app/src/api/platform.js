const API_URL = 'http://127.0.0.1:8000'
const VOICEBOX_URL = 'http://127.0.0.1:17493'

// Platform API
export async function healthCheck() {
  const res = await fetch(`${API_URL}/health`)
  return res.json()
}

export async function getStats() {
  const res = await fetch(`${API_URL}/stats`)
  return res.json()
}

export async function getVoices() {
  const res = await fetch(`${API_URL}/voices`)
  return res.json()
}

// Sessions
export async function createSession(userId) {
  const res = await fetch(`${API_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  })
  return res.json()
}

export async function getSession(sessionId) {
  const res = await fetch(`${API_URL}/sessions/${sessionId}`)
  return res.json()
}

export async function closeSession(sessionId) {
  const res = await fetch(`${API_URL}/sessions/${sessionId}`, { method: 'DELETE' })
  return res.json()
}

// Voice cloning
export async function cloneVoice(audioFile, text) {
  const formData = new FormData()
  formData.append('audio', audioFile)
  formData.append('text', text)
  const res = await fetch(`${API_URL}/clone-voice`, { method: 'POST', body: formData })
  return res.blob()
}

// Voicebox API
export async function voiceboxHealth() {
  const res = await fetch(`${VOICEBOX_URL}/health`)
  return res.json()
}

export async function getVoiceboxProfiles() {
  const res = await fetch(`${VOICEBOX_URL}/profiles`)
  return res.json()
}

export async function generateSpeech(text, profileId) {
  const res = await fetch(`${VOICEBOX_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, profile_id: profileId }),
  })
  return res.json()
}

export async function getGenerationStatus(generationId) {
  const res = await fetch(`${VOICEBOX_URL}/generate/${generationId}/status`)
  return res.json()
}

export function getAudioUrl(generationId) {
  return `${VOICEBOX_URL}/audio/${generationId}`
}

// WebSocket
export function createVoiceSocket(sessionId, onMessage) {
  const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${sessionId}`)
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage(data)
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  
  return ws
}
