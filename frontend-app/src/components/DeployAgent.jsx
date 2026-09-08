import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Server, Globe, Smartphone, Monitor, Cloud, Shield, Zap, ArrowRight } from 'lucide-react'

const platforms = [
  { icon: Globe, label: 'Web' },
  { icon: Smartphone, label: 'Mobile' },
  { icon: Monitor, label: 'Desktop' },
  { icon: Cloud, label: 'Cloud' },
]

const capabilities = [
  { icon: Shield, text: 'End-to-end encryption' },
  { icon: Zap, text: 'Sub-200ms response' },
  { icon: Globe, text: '200+ languages' },
  { icon: Server, text: 'Auto-scaling' },
]

const dashboardRows = [
  { agent: 'Customer Support', status: 'active', latency: '142ms', calls: '12.4K' },
  { agent: 'Sales Assistant', status: 'active', latency: '98ms', calls: '8.7K' },
  { agent: 'Onboarding Guide', status: 'idle', latency: '156ms', calls: '3.2K' },
  { agent: 'Technical Help', status: 'active', latency: '112ms', calls: '21.1K' },
]

export default function DeployAgent() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="section-lg" style={{ background: 'var(--bg-surface)' }}>
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="overline-dot justify-center mb-4" style={{ color: 'var(--accent)' }}>
            <span style={{ color: 'var(--accent)' }}>Deploy Anywhere</span>
          </div>
          <h2 className="heading-1 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Deploy Voice Agents on{' '}
            <span style={{ color: 'var(--primary)' }}>Any Platform</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Launch production-ready voice agents across web, mobile, desktop, and cloud — with enterprise-grade infrastructure baked in.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Platform badges + capabilities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              {platforms.map((platform, i) => (
                <motion.div
                  key={platform.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl transition-colors duration-200"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                >
                  <platform.icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <span className="caption" style={{ color: 'var(--text-primary)' }}>{platform.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-ring)' }}>
                    <cap.icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <span className="body" style={{ color: 'var(--text-secondary)' }}>{cap.text}</span>
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
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Right - Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="card overflow-hidden">
              {/* Dashboard header */}
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  <span className="caption" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Agent Dashboard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--success)' }} />
                  <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Live</span>
                </div>
              </div>

              {/* Dashboard table */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-[1fr_80px_80px_60px] gap-3 text-[11px] uppercase tracking-wider font-medium mb-3 px-1" style={{ color: 'var(--text-tertiary)' }}>
                  <span>Agent</span>
                  <span>Status</span>
                  <span>Latency</span>
                  <span className="text-right">Calls</span>
                </div>
                {dashboardRows.map((row, i) => (
                  <motion.div
                    key={row.agent}
                    initial={{ opacity: 0, y: 8 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="grid grid-cols-[1fr_80px_80px_60px] gap-3 items-center py-3"
                    style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <span className="caption" style={{ color: 'var(--text-primary)' }}>{row.agent}</span>
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: row.status === 'active' ? 'var(--success)' : 'var(--text-tertiary)' }}>
                      {row.status}
                    </span>
                    <span className="text-[12px] mono" style={{ color: 'var(--text-secondary)' }}>{row.latency}</span>
                    <span className="caption text-right" style={{ color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{row.calls}</span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="px-6 py-3" style={{ borderTop: '1px solid var(--border)', background: 'var(--input-bg)' }}>
                <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                  <span>4 agents deployed</span>
                  <span>Total: 45.4K calls</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
