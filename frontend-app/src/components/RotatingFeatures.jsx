import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Volume2, Bot, BarChart3, MessageSquare, Languages } from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: 'Speech to Text',
    description: 'Convert speech to text with 98.5% accuracy across 200+ languages. Real-time streaming and batch processing.',
    color: '#6C3CE1',
    gradient: 'from-[#6C3CE1] to-[#9B6DFF]',
  },
  {
    icon: Volume2,
    title: 'Text to Speech',
    description: 'Ultra-realistic neural voices with emotion control. Clone any voice with just 30 seconds of audio.',
    color: '#FF6B35',
    gradient: 'from-[#FF6B35] to-[#FF8F6B]',
  },
  {
    icon: Bot,
    title: 'Voice Agents',
    description: 'Autonomous AI agents that handle calls, schedule meetings, and manage customer interactions 24/7.',
    color: '#00D4AA',
    gradient: 'from-[#00D4AA] to-[#00F5C4]',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Deep insights into call patterns, sentiment analysis, conversation quality, and agent performance.',
    color: '#E040FB',
    gradient: 'from-[#E040FB] to-[#F060FF]',
  },
  {
    icon: MessageSquare,
    title: 'Chat Agents',
    description: 'Intelligent chat agents with persistent memory, tool calling, and multi-turn orchestration.',
    color: '#00BCD4',
    gradient: 'from-[#00BCD4] to-[#00E5FF]',
  },
  {
    icon: Languages,
    title: 'Translations',
    description: 'Real-time translation across 200+ languages. Preserve meaning, tone, and cultural context.',
    color: '#FF5722',
    gradient: 'from-[#FF5722] to-[#FF7043]',
  },
]

export default function RotatingFeatures() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[#E040FB] font-semibold tracking-wider uppercase text-[11px]">Features</span>
          <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Built for <span className="gradient-text">Every Need</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            One platform. Every voice capability. Production-ready from day one.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
          {/* Left - Feature list */}
          <div className="space-y-2">
            {features.map((feature, i) => (
              <motion.button
                key={feature.title}
                onClick={() => setActiveIndex(i)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center gap-3.5 ${
                  i === activeIndex
                    ? 'bg-white/[0.06] border border-white/[0.1]'
                    : 'bg-transparent border border-transparent hover:bg-white/[0.03]'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  i === activeIndex ? `bg-gradient-to-br ${feature.gradient}` : 'bg-white/[0.04]'
                }`}>
                  <feature.icon className={`w-4 h-4 ${i === activeIndex ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`text-[14px] font-semibold transition-colors ${
                    i === activeIndex ? 'text-white' : 'text-gray-400'
                  }`}>
                    {feature.title}
                  </p>
                  {i === activeIndex && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-[12px] text-gray-500 mt-1 leading-relaxed"
                    >
                      {feature.description}
                    </motion.p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right - Feature showcase */}
          <div className="relative min-h-[320px] lg:min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${features[activeIndex].gradient} opacity-[0.06] rounded-[24px] blur-[30px]`} />
                <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-[24px] p-8 sm:p-10 h-full">
                  {/* Feature icon header */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${features[activeIndex].gradient} flex items-center justify-center mb-6`}>
                    {(() => {
                      const Icon = features[activeIndex].icon
                      return <Icon className="w-7 h-7 text-white" />
                    })()}
                  </div>

                  <h3 className="text-[22px] sm:text-2xl font-bold text-white mb-4">
                    {features[activeIndex].title}
                  </h3>
                  <p className="text-[15px] text-gray-400 leading-relaxed mb-8 max-w-md">
                    {features[activeIndex].description}
                  </p>

                  {/* Feature details grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + j * 0.08 }}
                        className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-xl"
                      >
                        <div className="text-[20px] font-bold text-white mb-0.5">
                          {['98.5%', '<100ms', '200+', '99.9%'][j]}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {['Accuracy', 'Latency', 'Languages', 'Uptime'][j]}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
