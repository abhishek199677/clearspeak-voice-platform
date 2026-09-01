import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, MicOff, Phone, PhoneOff, Volume2, Radio, Wifi, 
  Languages, ArrowRightLeft, Bot, MessageSquare, Settings,
  Globe, ChevronDown
} from 'lucide-react'
import { createSession, closeSession, healthCheck, getIndicLanguages } from '../api/platform'

const INDIA_LANGUAGES = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'en', name: 'English', nativeName: 'English' },
]

const GLOBAL_LANGUAGES = [
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
]

const ALL_LANGUAGES = [...INDIA_LANGUAGES, ...GLOBAL_LANGUAGES]

function LanguageSelector({ value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = ALL_LANGUAGES.find(l => l.code === value) || ALL_LANGUAGES[0]

  return (
    <div className="relative">
      <label className="text-[10px] text-gray-600 uppercase tracking-wider mb-1 block">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg flex items-center justify-between hover:bg-white/[0.06] transition-all"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-white font-medium">{selected.name}</span>
          <span className="text-[11px] text-gray-500">{selected.nativeName}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-1 bg-[#12121A] border border-white/[0.08] rounded-lg overflow-hidden z-50 max-h-48 overflow-y-auto"
          >
            {INDIA_LANGUAGES.length > 0 && (
              <div className="px-2 py-1.5 text-[9px] text-gray-600 uppercase tracking-wider">Indian Languages</div>
            )}
            {INDIA_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { onChange(lang.code); setIsOpen(false) }}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/[0.04] transition-colors text-left"
              >
                <span className="text-[12px] text-white">{lang.name}</span>
                <span className="text-[10px] text-gray-500">{lang.nativeName}</span>
                {value === lang.code && <span className="ml-auto text-[#6C3CE1] text-[10px]">●</span>}
              </button>
            ))}
            <div className="px-2 py-1.5 text-[9px] text-gray-600 uppercase tracking-wider border-t border-white/[0.04]">Global Languages</div>
            {GLOBAL_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { onChange(lang.code); setIsOpen(false) }}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-white/[0.04] transition-colors text-left"
              >
                <span className="text-[12px] text-white">{lang.name}</span>
                <span className="text-[10px] text-gray-500">{lang.nativeName}</span>
                {value === lang.code && <span className="ml-auto text-[#6C3CE1] text-[10px]">●</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LanguageSelectionModal({ isOpen, onClose, onConfirm, sourceLanguage, targetLanguage, onSourceChange, onTargetChange }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#12121A] border border-white/[0.08] rounded-[24px] p-8 w-full max-w-md shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#6C3CE1]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Languages className="w-8 h-8 text-[#6C3CE1]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Select Languages</h3>
              <p className="text-sm text-gray-400">Choose which languages you want to translate between</p>
            </div>

            {/* Language Selection */}
            <div className="space-y-4 mb-8">
              <LanguageSelector
                value={sourceLanguage}
                onChange={onSourceChange}
                label="Speak In"
              />

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    onSourceChange(targetLanguage)
                    onTargetChange(sourceLanguage)
                  }}
                  className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-all"
                >
                  <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <LanguageSelector
                value={targetLanguage}
                onChange={onTargetChange}
                label="Hear In"
              />
            </div>

            {/* Preview */}
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-8">
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">From</div>
                  <div className="text-sm font-medium text-white">
                    {ALL_LANGUAGES.find(l => l.code === sourceLanguage)?.name}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#6C3CE1]/20 flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4 text-[#6C3CE1]" />
                </div>
                <div className="text-center">
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">To</div>
                  <div className="text-sm font-medium text-white">
                    {ALL_LANGUAGES.find(l => l.code === targetLanguage)?.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-sm font-medium text-gray-400 hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm(sourceLanguage, targetLanguage)
                  onClose()
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-xl text-sm font-medium text-white hover:shadow-[0_8px_20px_rgba(108,60,225,0.3)] transition-all"
              >
                Start Translation
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function VoiceChat() {
  const [connected, setConnected] = useState(false)
  const [session, setSession] = useState(null)
  const [recording, setRecording] = useState(false)
  const [status, setStatus] = useState('idle')
  const [messages, setMessages] = useState([])
  const [backendStatus, setBackendStatus] = useState('checking')
  const [textInput, setTextInput] = useState('')
  const [userId, setUserId] = useState(null)
  
  // Mode and language settings
  const [pipelineMode, setPipelineMode] = useState('translation') // 'agent' or 'translation'
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('te')
  const [translationEnabled, setTranslationEnabled] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [languagesConfirmed, setLanguagesConfirmed] = useState(false)
  
  const wsRef = useRef(null)
  const mediaRef = useRef(null)
  const messagesEndRef = useRef(null)
  const audioContextRef = useRef(null)

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
      
      const newUserId = `user-${Math.random().toString(36).substr(2, 9)}`
      setUserId(newUserId)
      
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${sess.session_id}?user_id=${newUserId}`)
      wsRef.current = ws

      ws.onopen = () => {
        setConnected(true)
        setStatus('ready')
        
        // Set pipeline mode
        ws.send(JSON.stringify({ type: 'set_mode', mode: pipelineMode }))
        
        // Set translation languages if in translation mode
        if (pipelineMode === 'translation') {
          ws.send(JSON.stringify({ 
            type: 'set_languages', 
            source_language: sourceLanguage, 
            target_language: targetLanguage 
          }))
        }
        
        addMessage('system', `Connected in ${pipelineMode === 'translation' ? 'Translation' : 'Agent'} mode`)
        addMessage('system', pipelineMode === 'translation' 
          ? `Translating: ${getLangName(sourceLanguage)} → ${getLangName(targetLanguage)}`
          : 'AI assistant ready')
      }

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
              
              if (header.type === 'audio') {
                playBinaryAudio(audioData)
              }
            }
          })
          return
        }
        
        // Handle JSON messages
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'audio') playAudio(data.audio_data)
          else if (data.type === 'text') addMessage('agent', data.text)
          else if (data.type === 'transcript') addMessage('transcript', data.text, data.language)
          else if (data.type === 'translation') {
            addMessage('translation', data.text, data.metadata)
          }
          else if (data.type === 'mode_set') {
            addMessage('system', `Mode set to: ${data.mode}`)
          }
          else if (data.type === 'languages_set') {
            addMessage('system', `Languages: ${getLangName(data.source_language)} → ${getLangName(data.target_language)}`)
          }
          else if (data.type === 'welcome') {
            addMessage('system', 'Connected to ClearSpeak AI')
          }
        } catch (e) {}
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
    setRecording(false)
  }

  function getLangName(code) {
    return ALL_LANGUAGES.find(l => l.code === code)?.name || code
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
      
      audioContextRef.current = new AudioContext({ sampleRate: 16000 })
      const source = audioContextRef.current.createMediaStreamSource(stream)
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1)

      source.connect(processor)
      processor.connect(audioContextRef.current.destination)

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0)
          
          // Convert Float32 to Int16 PCM
          const pcm = new Int16Array(inputData.length)
          for (let i = 0; i < inputData.length; i++) {
            const s = Math.max(-1, Math.min(1, inputData[i]))
            pcm[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
          }
          
          // Send as binary for efficiency
          const header = JSON.stringify({
            type: 'audio',
            format: 'pcm',
            sample_rate: 16000,
            channels: 1
          })
          const headerBytes = new TextEncoder().encode(header)
          const headerLen = new Uint8Array(4)
          new DataView(headerLen.buffer).setUint32(0, headerBytes.length, false)
          
          const message = new Uint8Array(4 + headerBytes.length + pcm.byteLength)
          message.set(headerLen, 0)
          message.set(headerBytes, 4)
          message.set(new Uint8Array(pcm.buffer), 4 + headerBytes.length)
          
          wsRef.current.send(message)
        }
      }

      setRecording(true)
      setStatus('listening')
      addMessage('system', 'Listening...')
    } catch {
      addMessage('system', 'Microphone access denied')
    }
  }

  function playBinaryAudio(audioData) {
    setStatus('speaking')
    
    // Create blob from audio data and play via Audio element
    // Edge TTS outputs MP3, so we play it as a media file
    const blob = new Blob([audioData], { type: 'audio/mpeg' })
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    
    audio.onended = () => {
      URL.revokeObjectURL(url)
      setStatus('ready')
    }
    
    audio.onerror = (e) => {
      console.error('Audio playback error:', e)
      URL.revokeObjectURL(url)
      setStatus('ready')
    }
    
    audio.play().catch(e => {
      console.error('Audio play failed:', e)
      setStatus('ready')
    })
  }

  async function playAudio(base64Data) {
    setStatus('speaking')
    
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 })
    }
    
    const audioBuffer = audioContextRef.current.createBuffer(1, 24000, 24000)
    const float32Array = new Float32Array(atob(base64Data).length)
    for (let i = 0; i < float32Array.length; i++) {
      float32Array[i] = atob(base64Data).charCodeAt(i) / 128.0
    }
    audioBuffer.getChannelData(0).set(float32Array)
    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContextRef.current.destination)
    source.start()
    source.onended = () => setStatus('ready')
  }

  function addMessage(type, text, extra = null) {
    setMessages(prev => [...prev, { 
      type, 
      text, 
      extra,
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

  function swapLanguages() {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    if (connected && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'set_languages',
        source_language: targetLanguage,
        target_language: sourceLanguage
      }))
    }
  }

  return (
    <section id="voice-chat" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark-light" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6C3CE1]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">Real-Time Translation</span>
          <h2 className="text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            <span className="gradient-text">Speak Your Language.</span>
            <br />
            <span className="text-white">Be Understood Everywhere.</span>
          </h2>
          <p className="text-[17px] text-gray-400 max-w-2xl mx-auto">
            Real-time voice translation across 22 Indian languages. Choose Agent mode for AI assistance or Translation mode for live conversations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-[24px] p-6"
          >
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.06]">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-[13px] font-semibold text-white">Settings</span>
            </div>

            {/* Translation Toggle */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-gray-600 uppercase tracking-wider">Real-Time Translation</label>
                <button
                  onClick={() => {
                    setTranslationEnabled(!translationEnabled)
                    if (!translationEnabled) {
                      setLanguagesConfirmed(false)
                    }
                  }}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    translationEnabled ? 'bg-[#6C3CE1]' : 'bg-white/[0.06]'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      translationEnabled ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
              {translationEnabled && !languagesConfirmed && (
                <p className="text-[10px] text-[#FF6B35] mt-2">Select languages to enable translation</p>
              )}
              {translationEnabled && languagesConfirmed && (
                <p className="text-[10px] text-[#00D4AA] mt-2">
                  {getLangName(sourceLanguage)} → {getLangName(targetLanguage)}
                </p>
              )}
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="text-[10px] text-gray-600 uppercase tracking-wider mb-2 block">Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPipelineMode('translation')}
                  className={`px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${
                    pipelineMode === 'translation'
                      ? 'bg-[#6C3CE1]/20 text-[#6C3CE1] border border-[#6C3CE1]/30'
                      : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5 inline mr-1" />
                  Translation
                </button>
                <button
                  onClick={() => setPipelineMode('agent')}
                  className={`px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${
                    pipelineMode === 'agent'
                      ? 'bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/30'
                      : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 inline mr-1" />
                  Agent
                </button>
              </div>
            </div>

            {/* Language Selection */}
            {translationEnabled && (
              <div className="space-y-4">
                <LanguageSelector
                  value={sourceLanguage}
                  onChange={(lang) => {
                    setSourceLanguage(lang)
                    setLanguagesConfirmed(false)
                  }}
                  label="Speak In"
                />

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      swapLanguages()
                      setLanguagesConfirmed(false)
                    }}
                    className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.08] transition-all"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>

                <LanguageSelector
                  value={targetLanguage}
                  onChange={(lang) => {
                    setTargetLanguage(lang)
                    setLanguagesConfirmed(false)
                  }}
                  label="Hear In"
                />

                {!languagesConfirmed && (
                  <button
                    onClick={() => setShowLanguageModal(true)}
                    className="w-full px-4 py-2 bg-[#6C3CE1]/20 border border-[#6C3CE1]/30 rounded-lg text-[12px] font-medium text-[#6C3CE1] hover:bg-[#6C3CE1]/30 transition-colors"
                  >
                    Confirm Languages
                  </button>
                )}
              </div>
            )}

            {/* Mode description */}
            <div className="mt-6 p-3 bg-white/[0.02] border border-white/[0.04] rounded-lg">
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {pipelineMode === 'translation' 
                  ? translationEnabled
                    ? 'Speak in your language, hear the translation in real-time. Perfect for cross-language conversations.'
                    : 'Enable real-time translation to start translating between languages.'
                  : 'AI assistant that understands and responds in your language. Ask questions, get help, and more.'
                }
              </p>
            </div>
          </motion.div>

          {/* Center - Voice Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-[28px] p-10"
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
              <div className="flex items-center gap-4">
                {session && (
                  <div className="flex items-center gap-2 text-[12px] text-gray-500">
                    <Wifi className="w-3.5 h-3.5" />
                    {session.session_id?.slice(0, 8)}...
                  </div>
                )}
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                  pipelineMode === 'translation' 
                    ? 'bg-[#6C3CE1]/10 text-[#6C3CE1]' 
                    : 'bg-[#FF6B35]/10 text-[#FF6B35]'
                }`}>
                  {pipelineMode === 'translation' ? 'Translation Mode' : 'Agent Mode'}
                </div>
              </div>
            </div>

            {/* Voice visualization */}
            <div className="relative h-52 flex items-center justify-center mb-10">
              {[1, 2, 3, 4].map((ring) => (
                <div
                  key={ring}
                  className={`absolute rounded-full transition-all duration-700 ${
                    recording
                      ? pipelineMode === 'translation' ? 'bg-[#6C3CE1]/10' : 'bg-[#FF6B35]/10'
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
                
                {pipelineMode === 'translation' && connected && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-gray-500">
                    <Globe className="w-3.5 h-3.5" />
                    {getLangName(sourceLanguage)} → {getLangName(targetLanguage)}
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="h-48 overflow-y-auto mb-8 space-y-2.5 scrollbar-thin">
              {messages.length === 0 ? (
                <div className="text-center text-gray-600 text-[13px] py-8">
                  {pipelineMode === 'translation' 
                    ? translationEnabled
                      ? 'Start speaking to translate in real-time'
                      : 'Enable real-time translation to get started'
                    : 'Start a session to chat with AI assistant'
                  }
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`text-[13px] ${
                    msg.type === 'system' ? 'text-gray-600 text-center' :
                    msg.type === 'user' ? 'text-[#FF6B35]' : 
                    msg.type === 'transcript' ? 'text-white' :
                    msg.type === 'translation' ? 'text-[#00D4AA]' : 
                    msg.type === 'chat' ? 'text-[#00D4AA]' : 'text-[#6C3CE1]'
                  }`}>
                    <span className="text-[11px] text-gray-700 mr-2">{msg.time}</span>
                    {msg.type === 'translation' && msg.extra && (
                      <span className="text-[10px] text-[#6C3CE1] mr-1">[Translated]</span>
                    )}
                    {msg.type === 'transcript' && (
                      <span className="text-[10px] text-gray-500 mr-1">[{msg.extra}]</span>
                    )}
                    {msg.text}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Text Input */}
            <div className="mb-6 flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={pipelineMode === 'translation' ? 'Type text to translate...' : 'Type a message...'}
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

            {/* Controls */}
            <div className="flex items-center justify-center gap-5">
              {!connected ? (
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (pipelineMode === 'translation' && !languagesConfirmed) {
                      setShowLanguageModal(true)
                    } else {
                      startSession()
                    }
                  }}
                  disabled={backendStatus !== 'connected' || (pipelineMode === 'translation' && !translationEnabled)}
                  className={`px-10 py-4 rounded-full font-semibold text-[15px] flex items-center gap-2.5 disabled:opacity-40 transition-all duration-300 ${
                    pipelineMode === 'translation'
                      ? 'bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] hover:shadow-[0_16px_40px_rgba(108,60,225,0.3)]'
                      : 'bg-gradient-to-r from-[#FF6B35] to-[#FF8F6B] hover:shadow-[0_16px_40px_rgba(255,107,53,0.3)]'
                  }`}
                >
                  {pipelineMode === 'translation' ? <Languages className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  Start {pipelineMode === 'translation' ? 'Translation' : 'Agent'}
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
      </div>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onConfirm={(source, target) => {
          setSourceLanguage(source)
          setTargetLanguage(target)
          setLanguagesConfirmed(true)
          setShowLanguageModal(false)
          startSession()
        }}
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        onSourceChange={setSourceLanguage}
        onTargetChange={setTargetLanguage}
      />
    </section>
  )
}
