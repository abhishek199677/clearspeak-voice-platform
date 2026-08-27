import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const partners = [
  { name: 'DPIIT', color: '#6C3CE1' },
  { name: 'NVIDIA', color: '#76B900' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'ISO', color: '#00D4AA' },
  { name: 'GetAstra', color: '#E040FB' },
  { name: 'TestRiq', color: '#00BCD4' },
]

export default function Partners() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-dark-light" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="text-gray-500 text-[12px] uppercase tracking-widest font-medium">Recognized & Supported By</span>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="flex items-center gap-2.5 px-5 py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ background: partner.color }}
              >
                {partner.name.charAt(0)}
              </div>
              <span className="text-gray-400 text-[14px] font-medium">{partner.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
