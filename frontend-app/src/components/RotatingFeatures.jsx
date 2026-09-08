import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mic, Volume2, Bot, Languages } from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: 'Speech to Text',
    description: 'Convert speech to text with 98.5% accuracy across 200+ languages. Real-time streaming and batch processing.',
    color: 'var(--primary)',
    stat: '98.5%',
    statLabel: 'Accuracy',
  },
  {
    icon: Volume2,
    title: 'Text to Speech',
    description: 'Ultra-realistic neural voices with emotion control. Clone any voice with just 30 seconds of audio.',
    color: 'var(--accent)',
    stat: '20+',
    statLabel: 'Voices',
  },
  {
    icon: Bot,
    title: 'Voice Agents',
    description: 'Autonomous AI agents that handle calls, schedule meetings, and manage customer interactions 24/7.',
    color: 'var(--success)',
    stat: '24/7',
    statLabel: 'Available',
  },
  {
    icon: Languages,
    title: 'Translations',
    description: 'Real-time translation across 200+ languages. Preserve meaning, tone, and cultural context.',
    color: '#E040FB',
    stat: '200+',
    statLabel: 'Languages',
  },
]

export default function RotatingFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <section id="features" className="section-lg" style={{ background: 'var(--bg)' }}>
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="overline-dot justify-center mb-4" style={{ color: '#E040FB' }}>
            <span style={{ color: '#E040FB' }}>Features</span>
          </div>
          <h2 className="heading-1 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Built for <span style={{ color: 'var(--primary)' }}>Every Need</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            One platform. Every voice capability. Production-ready from day one.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group"
              onMouseEnter={() => setActiveIndex(i)}
            >
              <div className="card card-interactive p-6 h-full">
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110" style={{ background: feature.color }}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="heading-3 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.125rem' }}>{feature.title}</h3>
                <p className="caption mb-5" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>

                {/* Stat */}
                <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="mono text-xl font-medium" style={{ color: 'var(--text-primary)' }}>{feature.stat}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{feature.statLabel}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
