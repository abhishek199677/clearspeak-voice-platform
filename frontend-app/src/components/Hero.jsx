import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, ArrowRight, Play, Languages, Globe, Sparkles } from 'lucide-react'

const translationDemo = [
  { id: 1, lang: 'hi', speaker: 'Person A', text: 'नमस्ते, आप कैसे हैं?', translation: 'Hello, how are you?', langCode: 'Hindi' },
  { id: 2, lang: 'en', speaker: 'Person B', text: 'I am fine, thank you!', translation: null, langCode: 'English' },
  { id: 3, lang: 'ta', speaker: 'Person A', text: 'நான் நன்றாக இருக்கிறேன்', translation: 'I am doing well', langCode: 'Tamil' },
  { id: 4, lang: 'te', speaker: 'Person B', text: 'మీరు ఎలా ఉన్నారు?', translation: 'How are you?', langCode: 'Telugu' },
]

const stats = [
  { value: '22', label: 'Indian Languages' },
  { value: '200+', label: 'Global Languages' },
  { value: '<300ms', label: 'Translation Latency' },
  { value: '1.4B+', label: 'People Served' },
]

export default function Hero() {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [activeDemo, setActiveDemo] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleMessages((prev) => (prev < translationDemo.length ? prev + 1 : prev))
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-12">
      <div className="absolute inset-0 bg-dark" />

      {/* Animated gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] gradient-blob">
        <div className="w-full h-full bg-[#6C3CE1]/8 rounded-full blur-[100px] lg:blur-[140px]" />
      </div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] lg:w-[700px] h-[400px] lg:h-[700px] gradient-blob-delayed">
        <div className="w-full h-full bg-[#FF6B35]/6 rounded-full blur-[80px] lg:blur-[120px]" />
      </div>
      <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] gradient-blob">
        <div className="w-full h-full bg-[#00D4AA]/5 rounded-full blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center flex-1">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
            <span className="text-[12px] text-gray-400 font-medium">India's Sovereign Communication Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-[2.5rem] sm:text-[3.25rem] lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-white">One App.</span>
            <br />
            <span className="gradient-text">Every Language.</span>
            <br />
            <span className="text-white">Limitless Possibilities.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[15px] sm:text-[17px] text-gray-400 mb-8 sm:mb-10 max-w-lg leading-relaxed"
          >
            Real-time voice translation across 22 Indian languages. Speak your language, be understood everywhere. 
            <span className="text-[#FF6B35] font-medium"> For India. By India. With India.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-3 sm:gap-5 mb-12"
          >
            <motion.a
              href="#voice-chat"
              whileHover={{ scale: 1.03, boxShadow: '0 20px 50px rgba(108,60,225,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-full font-semibold text-sm sm:text-[15px] flex items-center gap-2 transition-all duration-300"
            >
              Try Translation Mode
              <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 sm:px-8 sm:py-4 glass-strong rounded-full font-semibold text-sm sm:text-[15px] hover:bg-white/[0.08] transition-all duration-300 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1 }}
                className="text-center sm:text-left"
              >
                <div className="text-[20px] sm:text-[24px] font-bold text-white">{stat.value}</div>
                <div className="text-[11px] text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right - Translation Demo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C3CE1]/20 to-[#FF6B35]/10 rounded-[32px] blur-[60px] gradient-blob" />

          <div className="relative glass-card rounded-[24px] lg:rounded-[32px] p-6 sm:p-8 max-w-[440px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center">
                  <Languages className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[14px] sm:text-[15px] text-white">Real-Time Translation</h4>
                  <p className="text-[11px] sm:text-[12px] text-gray-500">Speak any language, understood everywhere</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-gray-500">Live</span>
              </div>
            </div>

            {/* Translation messages */}
            <div className="space-y-4">
              {translationDemo.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={i < visibleMessages ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.lang === 'hi' || msg.lang === 'ta' || msg.lang === 'te'
                      ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B]'
                      : 'bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF]'
                  }`}>
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-[#6C3CE1] uppercase">{msg.langCode}</span>
                      <span className="text-[10px] text-gray-600">{msg.speaker}</span>
                    </div>
                    <div className="inline-block px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed bg-white/[0.04] text-white rounded-tl-md">
                      {msg.text}
                    </div>
                    {msg.translation && (
                      <div className="mt-1.5 inline-block px-4 py-2 rounded-2xl text-[12px] leading-relaxed bg-[#6C3CE1]/10 text-[#9B6DFF] rounded-tl-md">
                        → {msg.translation}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {visibleMessages >= translationDemo.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-[11px] text-gray-600 pt-2"
                >
                  <Mic className="w-3.5 h-3.5 inline mr-1" />
                  Listening for next speech...
                </motion.div>
              )}
            </div>

            {/* Mode indicator */}
            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['Hindi', 'Tamil', 'Telugu', 'Bengali'].map((lang) => (
                    <span key={lang} className="px-2 py-1 bg-white/[0.03] border border-white/[0.06] rounded text-[10px] text-gray-500">
                      {lang}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-gray-600">+18 more</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-5 h-8 rounded-full border-2 border-gray-700 flex justify-center pt-1.5">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-[#6C3CE1] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
