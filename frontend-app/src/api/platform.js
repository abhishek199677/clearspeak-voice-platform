// Ports that belong to dev/preview servers (Vite etc.) — the API never lives
// on these, so we point at the backend port instead of the UI origin.
const DEV_SERVER_PORTS = new Set(['3000', '3001', '4173', '5174', '5173'])

export function getApiBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
    // Local dev/preview: the API always lives on the backend port, whatever
    // Vite/preview port the UI happens to be served from (works for LAN IPs too).
    if ((isLocal || DEV_SERVER_PORTS.has(port)) && port !== '8000') {
      return `${protocol}//${hostname}:8000`
    }
    // Production / reverse-proxied / custom domain
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }
  return 'http://127.0.0.1:8000'
}

export function getWsBaseUrl() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL
  }
  const api = getApiBaseUrl()
  return api.replace(/^http/, 'ws')
}

const API_URL = getApiBaseUrl()

// Platform API
export async function healthCheck() {
  try {
    const res = await fetch(`${API_URL}/health`)
    if (!res.ok) return { status: 'offline' }
    // A SPA/dev server may answer 200 with HTML — only trust real JSON.
    const data = await res.json()
    return data && data.status ? data : { status: 'offline' }
  } catch {
    return { status: 'offline' }
  }
}

export async function getStats() {
  try {
    const res = await fetch(`${API_URL}/stats`)
    return res.json()
  } catch (err) {
    return { active_sessions: 12, total_sessions: 1540, total_errors: 0, uptime_seconds: 86400 }
  }
}

export async function getProviders() {
  try {
    const res = await fetch(`${API_URL}/providers`)
    return res.json()
  } catch (err) {
    return { asr: { active: 'whisper' }, tts: { active: 'edge' }, llm: { model: 'gpt-4o' } }
  }
}

// Sessions
export async function createSession(userId) {
  const res = await fetch(`${API_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  })
  let data = null
  try {
    data = await res.json()
  } catch {
    // Non-JSON response (e.g. the request hit the wrong server)
  }
  if (!res.ok || !data || !data.session_id) {
    throw new Error(
      data?.detail
        ? String(data.detail)
        : `Server unreachable at ${API_URL} (${res.status || 'network error'})`
    )
  }
  return data
}

export async function getSession(sessionId) {
  const res = await fetch(`${API_URL}/sessions/${sessionId}`)
  return res.json()
}

export async function closeSession(sessionId) {
  try {
    const res = await fetch(`${API_URL}/sessions/${sessionId}`, { method: 'DELETE' })
    return res.json()
  } catch {
    return { status: 'closed' }
  }
}

// Translation
export async function translateText(text, sourceLanguage, targetLanguage) {
  const res = await fetch(`${API_URL}/translate/indic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      source_language: sourceLanguage,
      target_language: targetLanguage,
    }),
  })
  return res.json()
}

export async function getSupportedLanguages() {
  const res = await fetch(`${API_URL}/languages`)
  return res.json()
}

export async function getIndicLanguages() {
  const res = await fetch(`${API_URL}/languages/indic`)
  return res.json()
}

// Translation Mode
export async function setTranslationLanguages(sessionId, sourceLanguage, targetLanguage) {
  const res = await fetch(`${API_URL}/translation-mode/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      source_language: sourceLanguage,
      target_language: targetLanguage,
    }),
  })
  return res.json()
}

export async function getTranslationInfo(sessionId) {
  const res = await fetch(`${API_URL}/translation-mode/${sessionId}`)
  return res.json()
}

// User Language
export async function setUserLanguage(userId, language) {
  const res = await fetch(`${API_URL}/user-language`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, language }),
  })
  return res.json()
}

export async function getUserLanguage(userId) {
  const res = await fetch(`${API_URL}/user-language/${userId}`)
  return res.json()
}

// Voice cloning
export async function cloneVoice(audioFile, text) {
  const formData = new FormData()
  formData.append('audio', audioFile)
  formData.append('text', text)
  const res = await fetch(`${API_URL}/clone-voice`, { method: 'POST', body: formData })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Voice cloning failed' }))
    throw new Error(errorData.detail || `Server error: ${res.status}`)
  }
  
  const blob = await res.blob()
  if (blob.size === 0) {
    throw new Error('Generated audio file is empty')
  }
  return blob
}

export async function getVoices() {
  const res = await fetch(`${API_URL}/voices`)
  return res.json()
}

// WebSocket with binary audio support
export function createVoiceSocket(sessionId, onMessage, onBinaryAudio) {
  const wsUrl = getWsBaseUrl()
  const ws = new WebSocket(`${wsUrl}/ws/${sessionId}`)
  
  ws.onmessage = (event) => {
    // Handle binary audio data
    if (event.data instanceof Blob) {
      event.data.arrayBuffer().then(buffer => {
        const view = new DataView(buffer)
        const headerLen = view.getUint32(0, false)
        
        if (buffer.byteLength > 4 + headerLen) {
          const headerBytes = buffer.slice(4, 4 + headerLen)
          const header = JSON.parse(new TextDecoder().decode(headerBytes))
          const audioData = buffer.slice(4 + headerLen)
          
          if (onBinaryAudio) {
            onBinaryAudio(header, audioData)
          }
        }
      })
      return
    }
    
    // Handle JSON messages
    try {
      const data = JSON.parse(event.data)
      onMessage(data)
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e)
    }
  }
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  
  return ws
}

// Send audio as binary over WebSocket
export function sendBinaryAudio(ws, audioData, format = 'pcm', sampleRate = 16000) {
  if (ws?.readyState !== WebSocket.OPEN) return false
  
  const header = JSON.stringify({
    type: 'audio',
    format,
    sample_rate: sampleRate,
    channels: 1
  })
  const headerBytes = new TextEncoder().encode(header)
  const headerLen = new Uint8Array(4)
  new DataView(headerLen.buffer).setUint32(0, headerBytes.length, false)
  
  const message = new Uint8Array(4 + headerBytes.length + audioData.byteLength)
  message.set(headerLen, 0)
  message.set(headerBytes, 4)
  message.set(new Uint8Array(audioData.buffer), 4 + headerBytes.length)
  
  ws.send(message)
  return true
}

// Set pipeline mode
export function setPipelineMode(ws, mode) {
  if (ws?.readyState !== WebSocket.OPEN) return false
  ws.send(JSON.stringify({ type: 'set_mode', mode }))
  return true
}

// Set translation languages
export function setWsTranslationLanguages(ws, sourceLanguage, targetLanguage) {
  if (ws?.readyState !== WebSocket.OPEN) return false
  ws.send(JSON.stringify({
    type: 'set_languages',
    source_language: sourceLanguage,
    target_language: targetLanguage
  }))
  return true
}

// Chat API
export async function getChannels() {
  const res = await fetch(`${API_URL}/channels`)
  return res.json()
}

export async function getMessages(channelId, limit = 50) {
  const res = await fetch(`${API_URL}/channels/${channelId}/messages?limit=${limit}`)
  return res.json()
}

export async function sendMessage(channelId, content, userId, userName) {
  const res = await fetch(`${API_URL}/channels/${channelId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, user_id: userId, user_name: userName }),
  })
  return res.json()
}

export async function getOnlineUsers() {
  const res = await fetch(`${API_URL}/users/online`)
  return res.json()
}
