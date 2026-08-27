import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, TrendingUp, Clock, Shield, ArrowRight, CheckCircle } from 'lucide-react'

const stats = [
  { value: '10x', label: 'Faster Than Humans', icon: Zap, color: '#6C3CE1' },
  { value: '1/10', label: 'The Cost', icon: TrendingUp, color: '#FF6B35' },
  { value: '24/7', label: 'Availability', icon: Clock, color: '#00D4AA' },
]

const benefits = [
  'Handle 1000+ concurrent conversations',
  'Instant response, zero hold time',
  'Consistent quality every interaction',
  'Automatic scaling on demand',
  'Multi-language out of the box',
  'Seamless handoff to human agents',
]

export default function AIConversations() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-dark-light" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[#00D4AA] font-semibold tracking-wider uppercase text-[11px]">Why ClearSpeak</span>
            <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-6 tracking-tight leading-[1.1]">
              10x Faster.{' '}
              <span className="gradient-text">1/10th Cost.</span>
            </h2>
            <p className="text-[15px] sm:text-[17px] text-gray-400 mb-10 leading-relaxed max-w-lg">
              AI-powered conversations that scale infinitely while cutting costs dramatically. Replace repetitive tasks with intelligent agents that never sleep.
            </p>

            <div className="space-y-3.5 mb-10">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-4 h-4 text-[#00D4AA] flex-shrink-0" />
                  <span className="text-[14px] text-gray-400">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-7 py-3.5 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-xl text-[14px] font-semibold flex items-center gap-2 hover:shadow-[0_12px_32px_rgba(108,60,225,0.3)] transition-all duration-300"
            >
              Start Building <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Right - Stats + conversation demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-[22px] font-bold text-white">{stat.value}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Conversation demo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#6C3CE1]/8 to-[#00D4AA]/5 rounded-[20px] blur-[30px]" />
              <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-[20px] p-6">
                <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.06]">
                  <Shield className="w-4 h-4 text-[#00D4AA]" />
                  <span className="text-[12px] text-gray-500">Enterprise-grade conversation</span>
                </div>

                <div className="space-y-4">
                  {[
                    { type: 'user', text: 'What are your enterprise pricing options?' },
                    { type: 'agent', text: 'We offer flexible enterprise plans starting at $499/mo with dedicated support, custom integrations, and SLA guarantees. Would you like a detailed breakdown?' },
                    { type: 'user', text: 'Yes, and do you support HIPAA compliance?' },
                    { type: 'agent', text: 'Absolutely. Our HIPAA-compliant plan includes encrypted data handling, audit logs, and BAA agreements. Shall I schedule a call with our compliance team?' },
                  ].map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.7 + i * 0.12 }}
                      className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B]'
                          : 'bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF]'
                      }`}>
                        {msg.type === 'user' ? (
                          <span className="text-[10px] text-white font-bold">U</span>
                        ) : (
                          <Zap className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed ${
                        msg.type === 'user'
                          ? 'bg-[#FF6B35]/10 text-white rounded-tr-md'
                          : 'bg-[#6C3CE1]/10 text-white rounded-tl-md'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
