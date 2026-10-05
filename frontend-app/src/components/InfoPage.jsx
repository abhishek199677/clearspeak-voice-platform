import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Home } from 'lucide-react'
import { healthCheck } from '@/api/platform'

// Generic content page for footer links that don't have a dedicated product
// page. Content comes from src/data/footerPages.js.
export default function InfoPage({ kicker, title, blurb, points = [], status = false }) {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    if (!status) return
    let alive = true
    healthCheck().then((h) => alive && setHealth(h))
    return () => {
      alive = false
    }
  }, [status])

  const online = health?.status === 'online' || health?.status === 'ok'

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#6C3CE1]/8 rounded-full blur-[130px] gradient-blob" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">
            {kicker}
          </span>
          <h1 className="text-[2.25rem] sm:text-[3rem] font-bold mt-4 mb-5 tracking-tight">
            {title}
          </h1>
          <p className="text-[15px] sm:text-[17px] text-gray-400 leading-relaxed max-w-2xl">
            {blurb}
          </p>

          {status && (
            <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-full">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  health === null
                    ? 'bg-gray-500 animate-pulse'
                    : online
                      ? 'bg-emerald-400'
                      : 'bg-red-400'
                }`}
              />
              <span className="text-[13px] text-gray-300">
                {health === null ? 'Checking API status…' : online ? 'All systems operational' : 'API unreachable'}
              </span>
            </div>
          )}
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-4 mt-12">
          {points.map((point, i) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              className="glass-card bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5"
            >
              <CheckCircle2 className="w-5 h-5 text-[#9B6DFF] mb-3" />
              <p className="text-[14px] text-gray-300 leading-relaxed">{point}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-10">
          <motion.a
            href="#/speech"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-xl text-[14px] font-semibold flex items-center gap-2 hover:shadow-[0_12px_32px_rgba(108,60,225,0.3)] transition-all duration-300"
          >
            Try the live demo <ArrowRight className="w-4 h-4" />
          </motion.a>
          <a
            href="#/pricing"
            className="px-6 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[14px] font-medium text-gray-300 hover:text-white hover:bg-white/[0.07] transition-all duration-200"
          >
            View pricing
          </a>
          <a
            href="#/"
            className="px-6 py-3 text-[14px] text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Back to home
          </a>
        </div>
      </div>
    </section>
  )
}
