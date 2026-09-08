import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const partners = [
  { name: 'DPIIT', initials: 'DP' },
  { name: 'NVIDIA', initials: 'NV' },
  { name: 'AWS', initials: 'AW' },
  { name: 'ISO', initials: 'IS' },
  { name: 'GetAstra', initials: 'GA' },
  { name: 'TestRiq', initials: 'TR' },
]

export default function Partners() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="relative py-16" style={{ background: 'var(--bg-surface)' }}>
      <div ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="overline" style={{ color: 'var(--text-tertiary)' }}>Recognized & Supported By</span>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex items-center gap-2.5 px-4 py-3 rounded-lg cursor-default transition-colors duration-200"
              style={{ border: '1px solid var(--border-subtle)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div className="w-7 h-7 rounded flex items-center justify-center text-white text-[10px] font-bold" style={{ background: 'var(--text-tertiary)' }}>
                {partner.initials}
              </div>
              <span className="caption" style={{ color: 'var(--text-secondary)' }}>{partner.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
