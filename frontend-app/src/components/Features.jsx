import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Languages, Mic, Volume2, ArrowRightLeft, Shield, Zap, Globe, Radio, Bot, Video, Headphones } from 'lucide-react'

const services = [
  {
    icon: ArrowRightLeft,
    title: 'Real-Time Translation',
    description: 'Speech-to-speech translation between 22 Indian languages. Speak Hindi, hear Tamil. Instantly.',
    color: '#6C3CE1',
    gradient: 'from-[#6C3CE1] to-[#9B6DFF]',
    stat: '<300ms',
    statLabel: 'Latency',
    animation: 'translation',
  },
  {
    icon: Languages,
    title: '22 Indian Languages',
    description: 'All Scheduled Languages of India: Hindi, Bengali, Tamil, Telugu, Malayalam, Kannada, and more.',
    color: '#FF6B35',
    gradient: 'from-[#FF6B35] to-[#FF8F6B]',
    stat: '22',
    statLabel: 'Languages',
    animation: 'languages',
  },
  {
    icon: Mic,
    title: 'Bhashini ASR',
    description: 'Speech recognition powered by Bhashini and AI4Bharat. Built for Indian accents and dialects.',
    color: '#00D4AA',
    gradient: 'from-[#00D4AA] to-[#00F5C4]',
    stat: '98.5%',
    statLabel: 'Accuracy',
    animation: 'asr',
  },
  {
    icon: Volume2,
    title: 'Neural TTS',
    description: 'Azure Neural voices for Indian languages. Natural-sounding speech in Hindi, Tamil, Telugu, and more.',
    color: '#E040FB',
    gradient: 'from-[#E040FB] to-[#F060FF]',
    stat: '20+',
    statLabel: 'Voices',
    animation: 'tts',
  },
  {
    icon: Shield,
    title: 'Data Sovereignty',
    description: 'India-first architecture. Your data stays in India. Compliant with Indian data protection laws.',
    color: '#00BCD4',
    gradient: 'from-[#00BCD4] to-[#00E5FF]',
    stat: '100%',
    statLabel: 'Indian',
    animation: 'shield',
  },
  {
    icon: Zap,
    title: 'IndicTrans2',
    description: 'Powered by AI4Bharat\'s IndicTrans2 for high-quality translation between Indian languages.',
    color: '#FF5722',
    gradient: 'from-[#FF5722] to-[#FF7043]',
    stat: '22+',
    statLabel: 'Pairs',
    animation: 'indictrans',
  },
]

const platformServices = [
  {
    icon: Radio,
    title: 'Voice Channels',
    description: 'Real-time voice channels for team communication. Join, speak, and collaborate instantly.',
    color: '#6C3CE1',
    gradient: 'from-[#6C3CE1] to-[#9B6DFF]',
    animation: 'channels',
  },
  {
    icon: Video,
    title: 'Voice & Video Calls',
    description: 'Start calls, share screens, record sessions. Crystal-clear quality with low latency.',
    color: '#FF6B35',
    gradient: 'from-[#FF6B35] to-[#FF8F6B]',
    animation: 'calls',
  },
  {
    icon: Bot,
    title: 'AI Agents',
    description: 'Deploy AI-powered voice agents that understand context and respond naturally in any Indian language.',
    color: '#00D4AA',
    gradient: 'from-[#00D4AA] to-[#00F5C4]',
    animation: 'agents',
  },
  {
    icon: Headphones,
    title: 'Voice Cloning',
    description: 'Clone any voice with just a few seconds of audio. Create custom voices for your brand.',
    color: '#E040FB',
    gradient: 'from-[#E040FB] to-[#F060FF]',
    animation: 'clone',
  },
]

function TranslationAnimation() {
  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C3CE1]/5 to-transparent rounded-xl" />
      
      {/* Left side - Input */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.06] rounded-lg px-3 py-2 border border-white/[0.08]"
        >
          <div className="text-[10px] text-gray-500 mb-1">Hindi</div>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[13px] text-white font-medium"
          >
            नमस्ते
          </motion.div>
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-2 flex justify-center"
        >
          <Mic className="w-4 h-4 text-[#6C3CE1]" />
        </motion.div>
      </div>

      {/* Center - Arrow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-1"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-[#6C3CE1]"
            />
          ))}
        </motion.div>
        <ArrowRightLeft className="w-5 h-5 text-[#6C3CE1] absolute -top-3 left-1/2 -translate-x-1/2" />
      </div>

      {/* Right side - Output */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/[0.06] rounded-lg px-3 py-2 border border-white/[0.08]"
        >
          <div className="text-[10px] text-gray-500 mb-1">Tamil</div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-[13px] text-white font-medium"
          >
            வணக்கம்
          </motion.div>
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          className="mt-2 flex justify-center"
        >
          <Volume2 className="w-4 h-4 text-[#9B6DFF]" />
        </motion.div>
      </div>

      {/* Latency badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#6C3CE1]/20 border border-[#6C3CE1]/30 rounded-full px-3 py-1"
      >
        <span className="text-[10px] text-[#9B6DFF] font-medium">~280ms end-to-end</span>
      </motion.div>
    </div>
  )
}

function LanguagesAnimation() {
  const languages = ['हि', 'বা', 'த', 'తె', 'മ', 'ಕ', 'ગુ', 'म', 'ਪ', 'اُ', 'অ', 'ଓ']
  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 to-transparent rounded-xl" />
      
      {/* Globe */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="relative w-24 h-24"
      >
        <div className="absolute inset-0 border-2 border-[#FF6B35]/20 rounded-full" />
        <div className="absolute inset-2 border border-[#FF6B35]/10 rounded-full" />
        <Globe className="absolute inset-0 m-auto w-8 h-8 text-[#FF6B35]/40" />
      </motion.div>

      {/* Orbiting language bubbles */}
      {languages.map((lang, i) => {
        const angle = (i / languages.length) * 360
        const radius = 70
        const x = Math.cos((angle * Math.PI) / 180) * radius
        const y = Math.sin((angle * Math.PI) / 180) * radius
        return (
          <motion.div
            key={lang}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="absolute bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-lg px-2 py-1"
            style={{
              left: `calc(50% + ${x}px - 16px)`,
              top: `calc(50% + ${y}px - 12px)`,
            }}
          >
            <span className="text-[10px] text-[#FF8F6B] font-medium">{lang}</span>
          </motion.div>
        )
      })}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#FF6B35]/20 border border-[#FF6B35]/30 rounded-full px-3 py-1"
      >
        <span className="text-[10px] text-[#FF8F6B] font-medium">All 22 Scheduled Languages</span>
      </motion.div>
    </div>
  )
}

function ASRAnimation() {
  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/5 to-transparent rounded-xl" />
      
      {/* Waveform */}
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: [8, Math.random() * 40 + 10, 8],
            }}
            transition={{
              duration: 0.8 + Math.random() * 0.4,
              repeat: Infinity,
              delay: i * 0.05,
            }}
            className="w-[3px] rounded-full bg-gradient-to-t from-[#00D4AA] to-[#00F5C4]"
          />
        ))}
      </div>

      {/* Text output */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/[0.06] rounded-lg px-4 py-2 border border-white/[0.08]"
      >
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-[11px] text-[#00D4AA] font-mono"
          >
            |
          </motion.span>
          <span className="text-[11px] text-white">"Hello, how are you?"</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-4 right-4 bg-[#00D4AA]/20 border border-[#00D4AA]/30 rounded-full px-3 py-1"
      >
        <span className="text-[10px] text-[#00F5C4] font-medium">98.5% Accuracy</span>
      </motion.div>
    </div>
  )
}

function TTSAnimation() {
  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#E040FB]/5 to-transparent rounded-xl" />
      
      {/* Text input */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/[0.06] rounded-lg px-4 py-2 border border-white/[0.08]"
      >
        <span className="text-[11px] text-white">"Welcome to ClearSpeak"</span>
      </motion.div>

      {/* Arrow down */}
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute top-16 left-1/2 -translate-x-1/2"
      >
        <div className="w-0.5 h-4 bg-gradient-to-b from-[#E040FB] to-transparent" />
      </motion.div>

      {/* Audio output */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <Volume2 className="w-4 h-4 text-[#E040FB]" />
        <div className="flex items-center gap-[2px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: [4, Math.random() * 20 + 4, 4],
              }}
              transition={{
                duration: 0.6 + Math.random() * 0.3,
                repeat: Infinity,
                delay: i * 0.05,
              }}
              className="w-[2px] rounded-full bg-[#E040FB]"
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute top-4 left-4 bg-[#E040FB]/20 border border-[#E040FB]/30 rounded-full px-3 py-1"
      >
        <span className="text-[10px] text-[#F060FF] font-medium">Neural Voice</span>
      </motion.div>
    </div>
  )
}

function ShieldAnimation() {
  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00BCD4]/5 to-transparent rounded-xl" />
      
      {/* Shield */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative"
      >
        <Shield className="w-16 h-16 text-[#00BCD4]" strokeWidth={1.5} />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-[10px] text-[#00BCD4] font-bold">IN</span>
        </motion.div>
      </motion.div>

      {/* Data flow indicators */}
      {[
        { x: -60, y: -20 },
        { x: 60, y: -20 },
        { x: -60, y: 20 },
        { x: 60, y: 20 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          animate={{
            x: [pos.x, 0],
            y: [pos.y, 0],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute w-2 h-2 rounded-full bg-[#00BCD4]"
        />
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#00BCD4]/20 border border-[#00BCD4]/30 rounded-full px-3 py-1"
      >
        <span className="text-[10px] text-[#00E5FF] font-medium">India-First Security</span>
      </motion.div>
    </div>
  )
}

function IndicTransAnimation() {
  const scripts = [
    { text: 'नमस्ते', lang: 'Hindi' },
    { text: 'வணக்கம்', lang: 'Tamil' },
    { text: 'నమస్కారం', lang: 'Telugu' },
    { text: 'নমস্কার', lang: 'Bengali' },
  ]
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % scripts.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722]/5 to-transparent rounded-xl" />
      
      {/* Central node */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative z-10 w-12 h-12 rounded-full bg-[#FF5722]/20 border border-[#FF5722]/30 flex items-center justify-center"
      >
        <Zap className="w-5 h-5 text-[#FF5722]" />
      </motion.div>

      {/* Orbiting scripts */}
      {scripts.map((script, i) => {
        const angle = (i / scripts.length) * 360 - 90
        const radius = 55
        const x = Math.cos((angle * Math.PI) / 180) * radius
        const y = Math.sin((angle * Math.PI) / 180) * radius
        return (
          <motion.div
            key={script.lang}
            animate={{
              scale: i === active ? 1.1 : 0.9,
              opacity: i === active ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
            className="absolute bg-white/[0.06] rounded-lg px-3 py-2 border border-white/[0.08]"
            style={{
              left: `calc(50% + ${x}px - 30px)`,
              top: `calc(50% + ${y}px - 18px)`,
            }}
          >
            <div className="text-[11px] text-white font-medium text-center">{script.text}</div>
            <div className="text-[8px] text-gray-500 text-center">{script.lang}</div>
          </motion.div>
        )
      })}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#FF5722]/20 border border-[#FF5722]/30 rounded-full px-3 py-1"
      >
        <span className="text-[10px] text-[#FF7043] font-medium">IndicTrans2 Engine</span>
      </motion.div>
    </div>
  )
}

function ChannelsAnimation() {
  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C3CE1]/5 to-transparent rounded-xl" />
      
      {/* Channel bar */}
      <div className="flex items-center gap-3">
        {['General', 'Support', 'Sales'].map((ch, i) => (
          <motion.div
            key={ch}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`px-3 py-2 rounded-lg border ${
              i === 1
                ? 'bg-[#6C3CE1]/20 border-[#6C3CE1]/30'
                : 'bg-white/[0.03] border-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-[#6C3CE1] animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-[11px] text-white">{ch}</span>
            </div>
            {i === 1 && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-1.5 flex items-center gap-1"
              >
                <div className="w-1 h-1 rounded-full bg-[#6C3CE1]" />
                <span className="text-[9px] text-[#9B6DFF]">3 speaking</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#6C3CE1]/20 border border-[#6C3CE1]/30 rounded-full px-3 py-1"
      >
        <span className="text-[10px] text-[#9B6DFF] font-medium">Real-Time Voice Channels</span>
      </motion.div>
    </div>
  )
}

function CallsAnimation() {
  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/5 to-transparent rounded-xl" />
      
      {/* Call participants */}
      <div className="flex items-center gap-6">
        {['A', 'B', 'C'].map((user, i) => (
          <motion.div
            key={user}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 }}
            className="relative"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B] flex items-center justify-center"
            >
              <span className="text-[13px] font-bold text-white">{user}</span>
            </motion.div>
            {i === 0 && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 border-2 border-[#FF6B35] rounded-full"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Call controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        </motion.div>
        <span className="text-[10px] text-gray-400">02:34</span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute top-4 right-4 bg-[#FF6B35]/20 border border-[#FF6B35]/30 rounded-full px-3 py-1"
      >
        <span className="text-[10px] text-[#FF8F6B] font-medium">HD Audio</span>
      </motion.div>
    </div>
  )
}

function AgentsAnimation() {
  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/5 to-transparent rounded-xl" />
      
      {/* Agent avatar */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00D4AA] to-[#00F5C4] flex items-center justify-center">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-2 border-2 border-[#00D4AA]/30 rounded-full"
        />
      </motion.div>

      {/* Speech bubbles */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute left-6 top-8 bg-white/[0.06] rounded-lg px-3 py-1.5 border border-white/[0.08]"
      >
        <span className="text-[10px] text-gray-300">"How can I help?"</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute right-6 bottom-10 bg-[#00D4AA]/10 rounded-lg px-3 py-1.5 border border-[#00D4AA]/20"
      >
        <span className="text-[10px] text-[#00D4AA]">"مرحبا" (Arabic)</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#00D4AA]/20 border border-[#00D4AA]/30 rounded-full px-3 py-1"
      >
        <span className="text-[10px] text-[#00F5C4] font-medium">Multilingual AI Agent</span>
      </motion.div>
    </div>
  )
}

function CloneAnimation() {
  return (
    <div className="relative h-40 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#E040FB]/5 to-transparent rounded-xl" />
      
      {/* Source voice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute left-6 top-1/2 -translate-y-1/2"
      >
        <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
          <Mic className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-[9px] text-gray-500 text-center mt-1">Original</div>
      </motion.div>

      {/* Processing */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 rounded-full border-2 border-[#E040FB]/20 border-t-[#E040FB]"
        />
        <Zap className="w-4 h-4 text-[#E040FB] absolute inset-0 m-auto" />
      </div>

      {/* Cloned voice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute right-6 top-1/2 -translate-y-1/2"
      >
        <div className="w-10 h-10 rounded-full bg-[#E040FB]/20 border border-[#E040FB]/30 flex items-center justify-center">
          <Volume2 className="w-4 h-4 text-[#E040FB]" />
        </div>
        <div className="text-[9px] text-[#F060FF] text-center mt-1">Cloned</div>
      </motion.div>

      {/* Waveform connection */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-[2px]">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: [2, Math.random() * 12 + 2, 2],
              backgroundColor: ['#E040FB40', '#E040FB', '#E040FB40'],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.05,
            }}
            className="w-[2px] rounded-full"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#E040FB]/20 border border-[#E040FB]/30 rounded-full px-3 py-1"
      >
        <span className="text-[10px] text-[#F060FF] font-medium">Voice Cloning</span>
      </motion.div>
    </div>
  )
}

const animationComponents = {
  translation: TranslationAnimation,
  languages: LanguagesAnimation,
  asr: ASRAnimation,
  tts: TTSAnimation,
  shield: ShieldAnimation,
  indictrans: IndicTransAnimation,
  channels: ChannelsAnimation,
  calls: CallsAnimation,
  agents: AgentsAnimation,
  clone: CloneAnimation,
}

function ServiceCard({ service, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const AnimationComponent = animationComponents[service.animation]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="relative glass-card rounded-2xl overflow-hidden h-full">
        {/* Top gradient line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${service.gradient} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Animated illustration */}
        {AnimationComponent && <AnimationComponent />}

        {/* Content */}
        <div className="relative z-10 p-6 pt-2">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <service.icon className="w-4 h-4 text-white" />
            </div>
          </div>

          <h3 className="text-[16px] font-semibold mb-2 text-white group-hover:text-white transition-colors">{service.title}</h3>
          <p className="text-[12px] text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{service.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      {/* Background blobs */}
      <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-[#6C3CE1]/5 rounded-full blur-[100px] gradient-blob" />
      <div className="absolute bottom-[10%] right-[-5%] w-[350px] h-[350px] bg-[#FF6B35]/4 rounded-full blur-[80px] gradient-blob-delayed" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        {/* Core Translation Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">Platform</span>
          <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Built for{' '}
            <span className="gradient-text">India's Languages</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Real-time translation, speech recognition, and voice synthesis for all 22 Scheduled Languages of India. See how each service works.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        {/* Platform Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <span className="text-[#6C3CE1] font-semibold tracking-wider uppercase text-[11px]">Communication</span>
          <h2 className="text-[2rem] sm:text-[2.5rem] font-bold mt-4 mb-5 tracking-tight">
            Complete{' '}
            <span className="gradient-text">Voice Platform</span>
          </h2>
          <p className="text-[15px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Beyond translation — a full suite of voice communication tools for teams, customers, and AI agents.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {platformServices.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        {/* Language grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-8 glass-card rounded-2xl"
        >
          <h3 className="text-center text-[15px] font-semibold text-white mb-6">All 22 Scheduled Languages of India</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-3">
            {[
              { code: 'hi', name: 'Hindi' },
              { code: 'bn', name: 'Bengali' },
              { code: 'ta', name: 'Tamil' },
              { code: 'te', name: 'Telugu' },
              { code: 'ml', name: 'Malayalam' },
              { code: 'kn', name: 'Kannada' },
              { code: 'gu', name: 'Gujarati' },
              { code: 'mr', name: 'Marathi' },
              { code: 'pa', name: 'Punjabi' },
              { code: 'ur', name: 'Urdu' },
              { code: 'as', name: 'Assamese' },
              { code: 'or', name: 'Odia' },
              { code: 'sa', name: 'Sanskrit' },
              { code: 'gom', name: 'Konkani' },
              { code: 'doi', name: 'Dogri' },
              { code: 'mai', name: 'Maithili' },
              { code: 'sat', name: 'Santali' },
              { code: 'ks', name: 'Kashmiri' },
              { code: 'mni', name: 'Manipuri' },
              { code: 'brx', name: 'Bodo' },
              { code: 'sd', name: 'Sindhi' },
              { code: 'ne', name: 'Nepali' },
            ].map((lang) => (
              <div
                key={lang.code}
                className="px-2 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-center hover:bg-white/[0.06] transition-all cursor-default"
              >
                <div className="text-[11px] font-semibold text-white">{lang.name}</div>
                <div className="text-[9px] text-gray-500 mt-0.5">{lang.code}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
