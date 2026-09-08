import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Users, Zap, Clock, CheckCircle, XCircle, Server, Shield, Volume2, Brain } from 'lucide-react'
import { healthCheck, getStats } from '../api/platform'

function StatCard({ icon: Icon, label, value, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: color }}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="mono text-2xl font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
          <p className="caption" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const [health, setHealth] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  async function loadData() {
    try {
      const h = await healthCheck()
      setHealth(h)
      const s = await getStats()
      setStats(s)
    } catch {
      setHealth(null)
      setStats(null)
    }
  }

  return (
    <section id="dashboard" className="section-lg" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="overline-dot justify-center mb-4" style={{ color: 'var(--success)' }}>
            <span style={{ color: 'var(--success)' }}>Dashboard</span>
          </div>
          <h2 className="heading-1 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Platform <span style={{ color: 'var(--primary)' }}>Overview</span>
          </h2>
          <p className="body-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Monitor your voice AI infrastructure in real-time
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={Activity}
            label="System Status"
            value={health?.status === 'healthy' ? 'Online' : 'Offline'}
            color={health?.status === 'healthy' ? 'var(--success)' : '#EF4444'}
            index={0}
          />
          <StatCard
            icon={Users}
            label="Active Sessions"
            value={stats?.active_sessions ?? 0}
            color="var(--primary)"
            index={1}
          />
          <StatCard
            icon={Zap}
            label="Total Sessions"
            value={stats?.total_sessions ?? 0}
            color="var(--accent)"
            index={2}
          />
          <StatCard
            icon={Clock}
            label="Uptime"
            value={stats?.uptime ? `${Math.floor(stats.uptime / 60)}m` : '0m'}
            color="var(--success)"
            index={3}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-8"
        >
          <h3 className="heading-3 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Service Health</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'ASR Provider', value: health?.asr_provider || 'Not configured', icon: Activity },
              { name: 'TTS Provider', value: health?.tts_provider || 'Not configured', icon: Volume2 },
              { name: 'LLM Provider', value: health?.llm_provider || 'Not configured', icon: Brain },
              { name: 'GPU Available', value: health?.gpu_available ? 'Yes' : 'No', icon: Server },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <item.icon className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  <p className="overline" style={{ color: 'var(--text-tertiary)' }}>{item.name}</p>
                </div>
                <p className="caption flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  {item.value !== 'Not configured' ? (
                    <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                  ) : (
                    <XCircle className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                  )}
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 flex flex-wrap items-center gap-6 caption" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)' }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: 'var(--success)' }} />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
              <span>GDPR Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
