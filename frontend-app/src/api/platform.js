const API_URL = 'http://127.0.0.1:8000'

// Platform API
export async function healthCheck() {
  const res = await fetch(`${API_URL}/health`)
  return res.json()
}

export async function getStats() {
  const res = await fetch(`${API_URL}/stats`)
  return res.json()
}

export async function getProviders() {
  const res = await fetch(`${API_URL}/providers`)
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
  const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${sessionId}`)
  
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

// ─── Channels ───

export async function getChannels() {
  const res = await fetch(`${API_URL}/channels`)
  return res.json()
}

export async function createChannel(name, description, channelType = 'public') {
  const res = await fetch(`${API_URL}/channels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, channel_type: channelType, owner_id: 'user_' + Date.now() }),
  })
  return res.json()
}

export async function getChannel(channelId) {
  const res = await fetch(`${API_URL}/channels/${channelId}`)
  return res.json()
}

export async function joinChannel(channelId) {
  const res = await fetch(`${API_URL}/channels/${channelId}/join`, { method: 'POST' })
  return res.json()
}

export async function leaveChannel(channelId) {
  const res = await fetch(`${API_URL}/channels/${channelId}/leave`, { method: 'POST' })
  return res.json()
}

// ─── Messages ───

export async function getChannelMessages(channelId, limit = 50) {
  const res = await fetch(`${API_URL}/channels/${channelId}/messages?limit=${limit}`)
  return res.json()
}

export async function sendMessage(channelId, content, senderId, senderName, messageType = 'text') {
  const res = await fetch(`${API_URL}/channels/${channelId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, sender_id: senderId, sender_name: senderName, message_type: messageType }),
  })
  return res.json()
}

export async function editMessage(channelId, messageId, content) {
  const res = await fetch(`${API_URL}/channels/${channelId}/messages/${messageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  return res.json()
}

export async function deleteMessage(channelId, messageId) {
  const res = await fetch(`${API_URL}/channels/${channelId}/messages/${messageId}`, { method: 'DELETE' })
  return res.json()
}

// ─── Reactions ───

export async function addReaction(channelId, messageId, emoji, userId) {
  const res = await fetch(`${API_URL}/channels/${channelId}/messages/${messageId}/reaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emoji, user_id: userId }),
  })
  return res.json()
}

export async function removeReaction(channelId, messageId, emoji, userId) {
  const res = await fetch(`${API_URL}/channels/${channelId}/messages/${messageId}/reaction`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emoji, user_id: userId }),
  })
  return res.json()
}

// ─── Typing / Presence ───

export async function getTypingUsers(channelId) {
  const res = await fetch(`${API_URL}/channels/${channelId}/typing`)
  return res.json()
}

export async function getOnlineUsers() {
  const res = await fetch(`${API_URL}/users/online`)
  return res.json()
}

// ─── Calls ───

export async function createCall(channelId, callerId, callerName) {
  const res = await fetch(`${API_URL}/calls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ channel_id: channelId, caller_id: callerId, caller_name: callerName }),
  })
  return res.json()
}

export async function joinCall(callId, userId, userName) {
  const res = await fetch(`${API_URL}/calls/${callId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, user_name: userName }),
  })
  return res.json()
}

export async function leaveCall(callId, userId) {
  const res = await fetch(`${API_URL}/calls/${callId}/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  })
  return res.json()
}

export async function endCall(callId) {
  const res = await fetch(`${API_URL}/calls/${callId}/end`, { method: 'POST' })
  return res.json()
}

export async function toggleMute(callId, userId) {
  const res = await fetch(`${API_URL}/calls/${callId}/mute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  })
  return res.json()
}

export async function toggleScreenShare(callId, userId) {
  const res = await fetch(`${API_URL}/calls/${callId}/screen-share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  })
  return res.json()
}

export async function toggleRecording(callId) {
  const res = await fetch(`${API_URL}/calls/${callId}/recording`, { method: 'POST' })
  return res.json()
}

export async function getCallHistory() {
  const res = await fetch(`${API_URL}/calls/history`)
  return res.json()
}

// ─── AI Agents ───

export async function getAgents() {
  const res = await fetch(`${API_URL}/agents`)
  return res.json()
}

export async function createAgent(name, agentType, description) {
  const res = await fetch(`${API_URL}/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, agent_type: agentType, description }),
  })
  return res.json()
}

export async function getAgent(agentId) {
  const res = await fetch(`${API_URL}/agents/${agentId}`)
  return res.json()
}

export async function activateAgent(agentId) {
  const res = await fetch(`${API_URL}/agents/${agentId}/activate`, { method: 'POST' })
  return res.json()
}

export async function deactivateAgent(agentId) {
  const res = await fetch(`${API_URL}/agents/${agentId}/deactivate`, { method: 'POST' })
  return res.json()
}

export async function sendAgentMessage(agentId, message) {
  const res = await fetch(`${API_URL}/agents/${agentId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  return res.json()
}

export async function getAgentAnalytics(agentId) {
  const res = await fetch(`${API_URL}/agents/${agentId}/analytics`)
  return res.json()
}

// ─── AI Summaries ───

export async function getChannelSummary(channelId) {
  const res = await fetch(`${API_URL}/channels/${channelId}/summary`, { method: 'POST' })
  return res.json()
}

export async function getCallSummary(callId) {
  const res = await fetch(`${API_URL}/calls/${callId}/summary`, { method: 'POST' })
  return res.json()
}

// ─── Live Streams ───

export async function getStreams() {
  const res = await fetch(`${API_URL}/streams`)
  return res.json()
}

export async function createStream(title, description) {
  const res = await fetch(`${API_URL}/streams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, owner_id: 'user_' + Date.now() }),
  })
  return res.json()
}

export async function startStream(streamId) {
  const res = await fetch(`${API_URL}/streams/${streamId}/start`, { method: 'POST' })
  return res.json()
}

export async function endStream(streamId) {
  const res = await fetch(`${API_URL}/streams/${streamId}/end`, { method: 'POST' })
  return res.json()
}

// ─── Productivity ───

export async function getProductivity(userId) {
  const res = await fetch(`${API_URL}/productivity/${userId}`)
  return res.json()
}

export async function addTodo(userId, title, description = '', priority = 'medium') {
  const res = await fetch(`${API_URL}/productivity/${userId}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, priority }),
  })
  return res.json()
}

export async function updateTodo(userId, todoId, completed) {
  const res = await fetch(`${API_URL}/productivity/${userId}/todos/${todoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
  return res.json()
}

export async function deleteTodo(userId, todoId) {
  const res = await fetch(`${API_URL}/productivity/${userId}/todos/${todoId}`, { method: 'DELETE' })
  return res.json()
}

export async function addReminder(userId, title, remindAt) {
  const res = await fetch(`${API_URL}/productivity/${userId}/reminders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, remind_at: remindAt }),
  })
  return res.json()
}

export async function updateReminder(userId, reminderId, completed) {
  const res = await fetch(`${API_URL}/productivity/${userId}/reminders/${reminderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })
  return res.json()
}

export async function deleteReminder(userId, reminderId) {
  const res = await fetch(`${API_URL}/productivity/${userId}/reminders/${reminderId}`, { method: 'DELETE' })
  return res.json()
}

export async function addNote(userId, title, content) {
  const res = await fetch(`${API_URL}/productivity/${userId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  })
  return res.json()
}

export async function updateNote(userId, noteId, content) {
  const res = await fetch(`${API_URL}/productivity/${userId}/notes/${noteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  return res.json()
}

export async function deleteNote(userId, noteId) {
  const res = await fetch(`${API_URL}/productivity/${userId}/notes/${noteId}`, { method: 'DELETE' })
  return res.json()
}

export async function aiChat(message, userId = 'default') {
  const res = await fetch(`${API_URL}/productivity/ai-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, user_id: userId }),
  })
  return res.json()
}

export async function getWeather(city = 'Delhi') {
  const res = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`)
  return res.json()
}

export async function getCricketScores() {
  const res = await fetch(`${API_URL}/cricket`)
  return res.json()
}
