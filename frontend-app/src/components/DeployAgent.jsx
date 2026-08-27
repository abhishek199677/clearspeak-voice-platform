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
    <section className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">Deploy Anywhere</span>
          <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Deploy Voice Agents on{' '}
            <span className="gradient-text">Any Platform</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Launch production-ready voice agents across web, mobile, desktop, and cloud — with enterprise-grade infrastructure baked in.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Platform badges + capabilities */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              {platforms.map((platform, i) => (
                <motion.div
                  key={platform.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-2.5 px-5 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                >
                  <platform.icon className="w-4 h-4 text-[#6C3CE1]" />
                  <span className="text-[14px] font-medium text-gray-300">{platform.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap.text}
                  initial={{ opacity: 0, x: -15 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00D4AA]/10 flex items-center justify-center flex-shrink-0">
                    <cap.icon className="w-4 h-4 text-[#00D4AA]" />
                  </div>
                  <span className="text-[14px] text-gray-400">{cap.text}</span>
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
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Right - Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6C3CE1]/10 to-[#FF6B35]/5 rounded-[24px] blur-[40px]" />
            <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-[20px] overflow-hidden">
              {/* Dashboard header */}
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-[#6C3CE1]" />
                  <span className="text-[13px] font-semibold text-white">Agent Dashboard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
                  <span className="text-[11px] text-gray-500">Live</span>
                </div>
              </div>

              {/* Dashboard table */}
              <div className="px-6 py-4">
                <div className="grid grid-cols-[1fr_80px_80px_60px] gap-3 text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-3 px-1">
                  <span>Agent</span>
                  <span>Status</span>
                  <span>Latency</span>
                  <span className="text-right">Calls</span>
                </div>
                {dashboardRows.map((row, i) => (
                  <motion.div
                    key={row.agent}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="grid grid-cols-[1fr_80px_80px_60px] gap-3 items-center py-3 border-t border-white/[0.04]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[13px] text-white font-medium">{row.agent}</span>
                    </div>
                    <span className={`text-[11px] font-medium ${row.status === 'active' ? 'text-[#00D4AA]' : 'text-gray-500'}`}>
                      {row.status}
                    </span>
                    <span className="text-[12px] text-gray-400">{row.latency}</span>
                    <span className="text-[13px] text-white font-medium text-right">{row.calls}</span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="px-6 py-3 border-t border-white/[0.06] bg-white/[0.01]">
                <div className="flex items-center justify-between text-[11px] text-gray-500">
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
