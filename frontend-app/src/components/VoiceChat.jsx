import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Phone, PhoneOff, Volume2, Radio, Wifi, MessageSquare } from 'lucide-react'
import { createSession, closeSession, healthCheck } from '../api/platform'

export default function VoiceChat() {
  const [connected, setConnected] = useState(false)
  const [session, setSession] = useState(null)
  const [recording, setRecording] = useState(false)
  const [status, setStatus] = useState('idle')
  const [messages, setMessages] = useState([])
  const [backendStatus, setBackendStatus] = useState('checking')
  const [textInput, setTextInput] = useState('')
  const [userId, setUserId] = useState(null)
  const wsRef = useRef(null)
  const mediaRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    checkBackend()
    return () => {
      if (wsRef.current) wsRef.current.close()
      if (mediaRef.current) mediaRef.current.getTracks().forEach(t => t.stop())
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function checkBackend() {
    try {
      const data = await healthCheck()
      setBackendStatus(data.status === 'healthy' ? 'connected' : 'error')
    } catch {
      setBackendStatus('error')
    }
  }

  async function startSession() {
    try {
      setStatus('connecting')
      const sess = await createSession('web-user')
      setSession(sess)
      
      // Generate a random user ID
      const newUserId = `user-${Math.random().toString(36).substr(2, 9)}`
      setUserId(newUserId)
      
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${sess.session_id}?user_id=${newUserId}`)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        setStatus('ready')
        addMessage('system', 'Connected to voice agent')
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'audio') playAudio(data.audio_data)
        else if (data.type === 'text') addMessage('agent', data.text)
        else if (data.type === 'chat_message') {
          const msg = data.message
          if (msg.sender_id !== 'system') {
            addMessage('chat', msg.content, msg.sender_name)
          }
        }
        else if (data.type === 'typing') {
          // Handle typing indicator
          setStatus(`typing (${data.user_id})`)
          setTimeout(() => setStatus('ready'), 3000)
        }
      }

      ws.onclose = () => {
        setConnected(false)
        setStatus('disconnected')
        addMessage('system', 'Disconnected')
      }
    } catch {
      setStatus('error')
      addMessage('system', 'Failed to connect')
    }
  }

  async function endSession() {
    if (wsRef.current) wsRef.current.close()
    if (session) await closeSession(session.session_id)
    setConnected(false)
    setSession(null)
    setStatus('idle')
    setMessages([])
  }

  async function toggleRecording() {
    if (recording) {
      if (mediaRef.current) {
        mediaRef.current.getTracks().forEach(t => t.stop())
        mediaRef.current = null
      }
      setRecording(false)
      setStatus('ready')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRef.current = stream
      
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(4096, 1, 1)

      source.connect(processor)
      processor.connect(audioContext.destination)

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0)
          const base64 = arrayBufferToBase64(inputData.buffer)
          wsRef.current.send(JSON.stringify({ type: 'audio', data: base64 }))
        }
      }

      setRecording(true)
      setStatus('listening')
      addMessage('system', 'Listening...')
    } catch {
      addMessage('system', 'Microphone access denied')
    }
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Float32Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  async function playAudio(base64Data) {
    setStatus('speaking')
    const audioContext = new AudioContext()
    const audioBuffer = audioContext.createBuffer(1, 24000, 24000)
    const float32Array = new Float32Array(atob(base64Data).length)
    for (let i = 0; i < float32Array.length; i++) {
      float32Array[i] = atob(base64Data).charCodeAt(i) / 128.0
    }
    audioBuffer.getChannelData(0).set(float32Array)
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.start()
    source.onended = () => setStatus('ready')
  }

  function addMessage(type, text, sender = null) {
    setMessages(prev => [...prev, { 
      type, 
      text, 
      sender,
      time: new Date().toLocaleTimeString() 
    }])
  }

  function sendChatMessage() {
    if (!textInput.trim() || !connected || !wsRef.current) return
    
    const message = {
      type: 'chat_message',
      channel_id: 'general',
      content: textInput.trim(),
      message_type: 'text'
    }
    
    wsRef.current.send(JSON.stringify(message))
    addMessage('user', textInput.trim())
    setTextInput('')
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  return (
    <section id="voice-chat" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark-light" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6C3CE1]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">Real-Time</span>
          <h2 className="text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            <span className="gradient-text">Chat</span> & Voice
          </h2>
          <p className="text-[17px] text-gray-400 max-w-2xl mx-auto">
            Real-time messaging with AI translation and voice support. Connect across 200+ languages.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-[28px] p-10"
        >
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${
                backendStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`} />
              <span className="text-[13px] text-gray-400 font-medium">
                {backendStatus === 'connected' ? 'System Online' : 'System Offline'}
              </span>
            </div>
            {session && (
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <Wifi className="w-3.5 h-3.5" />
                Session: {session.session_id?.slice(0, 8)}...
              </div>
            )}
          </div>

          <div className="relative h-52 flex items-center justify-center mb-10">
            {[1, 2, 3, 4].map((ring) => (
              <div
                key={ring}
                className={`absolute rounded-full transition-all duration-700 ${
                  recording
                    ? 'bg-[#6C3CE1]/10'
                    : 'bg-[#6C3CE1]/5'
                }`}
                style={{
                  width: `${60 + ring * 35}px`,
                  height: `${60 + ring * 35}px`,
                  animation: recording ? `pulseGlow ${1.5 + ring * 0.3}s ease-in-out infinite` : 'none',
                }}
              />
            ))}
            
            <div className="relative z-10 text-center">
              {status === 'speaking' && <Volume2 className="w-8 h-8 text-[#6C3CE1] mx-auto mb-2 animate-pulse" />}
              {recording && <Radio className="w-8 h-8 text-[#FF6B35] mx-auto mb-2 animate-pulse" />}
              <span className="text-[13px] text-gray-400 capitalize font-medium">{status}</span>
            </div>
          </div>

          <div className="h-48 overflow-y-auto mb-8 space-y-2.5 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="text-center text-gray-600 text-[13px] py-8">
                Start a call to begin conversation
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`text-[13px] ${
                  msg.type === 'system' ? 'text-gray-600 text-center' :
                  msg.type === 'user' ? 'text-[#FF6B35]' : 
                  msg.type === 'chat' ? 'text-[#00D4AA]' : 'text-[#6C3CE1]'
                }`}>
                  <span className="text-[11px] text-gray-700 mr-2">{msg.time}</span>
                  {msg.sender && <span className="font-semibold mr-2">[{msg.sender}]</span>}
                  {msg.text}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Text Input for Chat */}
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={!connected}
              className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-4 py-2 text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-[#6C3CE1]/50 disabled:opacity-40"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendChatMessage}
              disabled={!connected || !textInput.trim()}
              className="px-4 py-2 bg-[#6C3CE1] rounded-lg text-[13px] font-medium disabled:opacity-40 hover:bg-[#5A2DC0] transition-colors"
            >
              Send
            </motion.button>
          </div>

          <div className="flex items-center justify-center gap-5">
            {!connected ? (
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={startSession}
                disabled={backendStatus !== 'connected'}
                className="px-10 py-4 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-full font-semibold text-[15px] flex items-center gap-2.5 disabled:opacity-40 hover:shadow-[0_16px_40px_rgba(108,60,225,0.3)] transition-all duration-300"
              >
                <MessageSquare className="w-5 h-5" />
                Start Chat
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleRecording}
                  className={`w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                    recording
                      ? 'w-18 h-18 bg-red-500 hover:bg-red-600 shadow-red-500/30'
                      : 'w-18 h-18 bg-[#6C3CE1] hover:bg-[#5A2DC0] shadow-purple-500/30'
                  }`}
                >
                  {recording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={endSession}
                  className="w-14 h-14 rounded-full bg-white/[0.04] hover:bg-red-500/10 border border-white/[0.06] hover:border-red-500/20 flex items-center justify-center transition-all duration-300"
                >
                  <PhoneOff className="w-6 h-6 text-red-500" />
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
