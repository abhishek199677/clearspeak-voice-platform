import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, User, ArrowRight, Play, Sparkles } from 'lucide-react'

const chatMessages = [
  { id: 1, type: 'user', text: "Hi, I'd like to schedule a demo for our team." },
  { id: 2, type: 'bot', text: "Great! I've booked a demo slot for Thursday at 2 PM. You'll receive a calendar invite shortly." },
  { id: 3, type: 'user', text: "Can you also send me the pricing details?" },
  { id: 4, type: 'bot', text: "Done! I've sent the enterprise pricing sheet to your email. Let me know if you have any questions." },
]

const trustedBy = [
  'Synerion', 'StrongArm', 'WorkBright', 'TSheets', 'Gusto', 'Homebase',
]

export default function Hero() {
  const [visibleMessages, setVisibleMessages] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleMessages((prev) => (prev < chatMessages.length ? prev + 1 : prev))
    }, 1200)
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
            <span className="text-[12px] text-gray-400 font-medium">Now with real-time voice agents</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-[2.5rem] sm:text-[3.25rem] lg:text-[4.5rem] font-bold leading-[1.05] tracking-tight mb-6"
          >
            <span className="text-white">NextGen</span>
            <br />
            <span className="text-white">Communications</span>
            <br />
            <span className="gradient-text">with Voice AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[15px] sm:text-[17px] text-gray-400 mb-8 sm:mb-10 max-w-lg leading-relaxed"
          >
            One platform for all your voice AI needs. Build, deploy, and scale AI communication across 200+ languages — with enterprise-grade infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center gap-3 sm:gap-5 mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 20px 50px rgba(108,60,225,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-full font-semibold text-sm sm:text-[15px] flex items-center gap-2 transition-all duration-300"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 sm:px-8 sm:py-4 glass-strong rounded-full font-semibold text-sm sm:text-[15px] hover:bg-white/[0.08] transition-all duration-300 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              Book a call
            </motion.button>
          </motion.div>

          {/* Trust logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-[11px] text-gray-600 uppercase tracking-widest font-medium mb-4">Trusted By</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {trustedBy.map((name, i) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 + i * 0.06 }}
                  className="text-[13px] sm:text-[14px] font-semibold text-gray-600 hover:text-gray-400 transition-colors cursor-default"
                >
                  {name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right - Chat Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C3CE1]/20 to-[#FF6B35]/10 rounded-[32px] blur-[60px] gradient-blob" />

          <div className="relative glass-card rounded-[24px] lg:rounded-[32px] p-6 sm:p-8 max-w-[420px] mx-auto">
            {/* Chat header */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/[0.06]">
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center">
                  <Bot className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00D4AA] rounded-full border-2 border-[#08080D]" />
              </div>
              <div>
                <h4 className="font-semibold text-[14px] sm:text-[15px] text-white">ClearSpeak AI</h4>
                <p className="text-[11px] sm:text-[12px] text-gray-500">Online • Ready to help</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="space-y-4">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={i < visibleMessages ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B]'
                      : 'bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF]'
                  }`}>
                    {msg.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[78%] ${msg.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                      msg.type === 'user'
                        ? 'bg-[#FF6B35]/10 text-white rounded-tr-md'
                        : 'bg-white/[0.04] text-white rounded-tl-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {visibleMessages >= chatMessages.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white/[0.04] rounded-tl-md">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#6C3CE1] rounded-full typing-dot" />
                      <div className="w-1.5 h-1.5 bg-[#6C3CE1] rounded-full typing-dot" />
                      <div className="w-1.5 h-1.5 bg-[#6C3CE1] rounded-full typing-dot" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input bar */}
            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                <span className="text-[13px] text-gray-500 flex-1">Type a message...</span>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
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
