import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, ArrowRight, Play, Languages, Globe } from 'lucide-react'

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

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleMessages((prev) => (prev < translationDemo.length ? prev + 1 : prev))
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-12">
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center flex-1">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="overline-dot mb-8"
          >
            India's Sovereign Communication Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="display mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span>One App.</span>
            <br />
            <span style={{ color: 'var(--primary)' }}>Every Language.</span>
            <br />
            <span>Limitless Possibilities.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="body-lg max-w-lg mb-8 sm:mb-10"
            style={{ color: 'var(--text-secondary)' }}
          >
            Real-time voice translation across 22 Indian languages. Speak your language, be understood everywhere.
            <span style={{ color: 'var(--accent)' }} className="font-medium"> For India. By India. With India.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-3 sm:gap-5 mb-12"
          >
            <motion.a
              href="#voice-chat"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              Try Translation Mode
              <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
              >
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right - Translation Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="card p-6 sm:p-8 max-w-[440px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                  <Languages className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-[14px] sm:text-[15px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Real-Time Translation</h4>
                  <p className="text-[11px] sm:text-[12px]" style={{ color: 'var(--text-tertiary)' }}>Speak any language, understood everywhere</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Live</span>
              </div>
            </div>

            {/* Translation messages */}
            <div className="space-y-4">
              {translationDemo.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={i < visibleMessages ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                    background: msg.lang === 'hi' || msg.lang === 'ta' || msg.lang === 'te'
                      ? 'var(--accent)'
                      : 'var(--primary)'
                  }}>
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--primary)' }}>{msg.langCode}</span>
                      <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{msg.speaker}</span>
                    </div>
                    <div className="inline-block px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed rounded-tl-md" style={{ background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                      {msg.text}
                    </div>
                    {msg.translation && (
                      <div className="mt-1.5 inline-block px-4 py-2 rounded-2xl text-[12px] leading-relaxed rounded-tl-md" style={{ background: 'var(--primary-ring)', color: 'var(--primary-hover)' }}>
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
                  className="text-center text-[11px] pt-2"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <Mic className="w-3.5 h-3.5 inline mr-1" />
                  Listening for next speech...
                </motion.div>
              )}
            </div>

            {/* Mode indicator */}
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['Hindi', 'Tamil', 'Telugu', 'Bengali'].map((lang) => (
                    <span key={lang} className="px-2 py-1 rounded text-[10px]" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                      {lang}
                    </span>
                  ))}
                </div>
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>+18 more</span>
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
        <div className="w-5 h-8 rounded-full flex justify-center pt-1.5" style={{ border: '2px solid var(--border)' }}>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 rounded-full"
            style={{ background: 'var(--primary)' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
