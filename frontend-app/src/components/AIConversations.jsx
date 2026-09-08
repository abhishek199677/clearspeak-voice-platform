import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Zap, TrendingUp, Clock, Shield, ArrowRight, CheckCircle } from 'lucide-react'

const stats = [
  { value: '10x', label: 'Faster Than Humans', icon: Zap, color: 'var(--primary)' },
  { value: '1/10', label: 'The Cost', icon: TrendingUp, color: 'var(--accent)' },
  { value: '24/7', label: 'Availability', icon: Clock, color: 'var(--success)' },
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
    <section className="section-lg" style={{ background: 'var(--bg)' }}>
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="overline-dot mb-4" style={{ color: 'var(--success)' }}>
              <span style={{ color: 'var(--success)' }}>Why ClearSpeak</span>
            </div>
            <h2 className="heading-1 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              10x Faster.{' '}
              <span style={{ color: 'var(--primary)' }}>1/10th Cost.</span>
            </h2>
            <p className="body-lg mb-10 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              AI-powered conversations that scale infinitely while cutting costs dramatically. Replace repetitive tasks with intelligent agents that never sleep.
            </p>

            <div className="space-y-3.5 mb-10">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--success)' }} />
                  <span className="body" style={{ color: 'var(--text-secondary)' }}>{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              Start Building <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Right - Stats + conversation demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-5"
          >
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="card p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: stat.color }}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="mono text-xl font-medium" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Conversation demo */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-5 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                  <Shield className="w-4 h-4" style={{ color: 'var(--success)' }} />
                  <span className="caption" style={{ color: 'var(--text-tertiary)' }}>Enterprise-grade conversation</span>
                </div>

                <div className="space-y-4">
                  {[
                    { type: 'user', text: 'What are your enterprise pricing options?' },
                    { type: 'agent', text: 'We offer flexible enterprise plans starting at $499/mo with dedicated support, custom integrations, and SLA guarantees.' },
                    { type: 'user', text: 'Yes, and do you support HIPAA compliance?' },
                    { type: 'agent', text: 'Absolutely. Our HIPAA-compliant plan includes encrypted data handling, audit logs, and BAA agreements.' },
                  ].map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                        background: msg.type === 'user' ? 'var(--accent)' : 'var(--primary)',
                      }}>
                        {msg.type === 'user' ? (
                          <span className="text-[10px] text-white font-bold">U</span>
                        ) : (
                          <Zap className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="max-w-[80%] px-3.5 py-2.5 rounded-xl text-[13px] leading-relaxed" style={{
                        background: msg.type === 'user' ? 'var(--primary-ring)' : 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        borderRadius: msg.type === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                        border: '1px solid var(--border-subtle)',
                      }}>
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
