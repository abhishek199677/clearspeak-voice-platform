import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Users, Zap, Clock, CheckCircle, XCircle, Server, Shield, Volume2, Brain } from 'lucide-react'
import { healthCheck, getStats } from '../api/platform'

function StatCard({ icon: Icon, label, value, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.1] transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-[13px] text-gray-500">{label}</p>
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
    <section id="dashboard" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#00D4AA] font-semibold tracking-wider uppercase text-[11px]">Dashboard</span>
          <h2 className="text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Platform <span className="gradient-text">Overview</span>
          </h2>
          <p className="text-[17px] text-gray-400 max-w-xl mx-auto">
            Monitor your voice AI infrastructure in real-time
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            icon={Activity}
            label="System Status"
            value={health?.status === 'healthy' ? 'Online' : 'Offline'}
            color={health?.status === 'healthy' ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500'}
            index={0}
          />
          <StatCard
            icon={Users}
            label="Active Sessions"
            value={stats?.active_sessions ?? 0}
            color="from-[#6C3CE1] to-[#9B6DFF]"
            index={1}
          />
          <StatCard
            icon={Zap}
            label="Total Sessions"
            value={stats?.total_sessions ?? 0}
            color="from-[#FF6B35] to-[#FF8F6B]"
            index={2}
          />
          <StatCard
            icon={Clock}
            label="Uptime"
            value={stats?.uptime ? `${Math.floor(stats.uptime / 60)}m` : '0m'}
            color="from-[#00D4AA] to-[#00F5C4]"
            index={3}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8"
        >
          <h3 className="text-lg font-semibold mb-6 text-white">Service Health</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'ASR Provider', value: health?.asr_provider || 'Not configured', icon: Activity },
              { name: 'TTS Provider', value: health?.tts_provider || 'Not configured', icon: Volume2 },
              { name: 'LLM Provider', value: health?.llm_provider || 'Not configured', icon: Brain },
              { name: 'GPU Available', value: health?.gpu_available ? 'Yes' : 'No', icon: Server },
            ].map((item, i) => (
              <div key={i} className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <div className="flex items-center gap-2.5 mb-3">
                  <item.icon className="w-4 h-4 text-gray-500" />
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">{item.name}</p>
                </div>
                <p className="text-[14px] font-medium text-white flex items-center gap-2">
                  {item.value !== 'Not configured' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-600" />
                  )}
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.06] flex flex-wrap items-center gap-6 text-[13px] text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00D4AA]" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>GDPR Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
