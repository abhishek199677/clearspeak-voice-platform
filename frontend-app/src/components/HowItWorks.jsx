import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Mic, Languages, Volume2 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Mic,
    title: 'Speak',
    description: 'Speak in any Indian language. Our ASR powered by Bhashini and AI4Bharat recognizes your speech with 98.5% accuracy.',
    details: ['Bhashini ASR for 22 Indian languages', 'AI4Bharat IndicWav2Vec models', 'Real-time streaming', 'Handles Indian accents'],
    color: 'var(--primary)',
  },
  {
    number: '02',
    icon: Languages,
    title: 'Translate',
    description: 'IndicTrans2 translates between Indian languages with context-aware accuracy. No meaning lost.',
    details: ['IndicTrans2 by AI4Bharat', 'Azure Multilingual Translator', 'Indic-to-Indic via English pivot', 'Context-aware translation'],
    color: 'var(--accent)',
  },
  {
    number: '03',
    icon: Volume2,
    title: 'Speak',
    description: 'Azure Neural TTS speaks the translation in natural-sounding Indian voices. Hindi, Tamil, Telugu, and more.',
    details: ['Azure Neural Indian voices', 'Edge TTS (free)', '20+ voice options', 'Natural prosody'],
    color: 'var(--success)',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="about" className="section-lg" style={{ background: 'var(--bg)' }}>
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="overline-dot justify-center mb-4" style={{ color: 'var(--success)' }}>
            <span style={{ color: 'var(--success)' }}>How It Works</span>
          </div>
          <h2 className="heading-1 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Speak Any Language,{' '}
            <span style={{ color: 'var(--primary)' }}>Be Understood Everywhere</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Three simple steps. Real-time translation between 22 Indian languages.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-[40px] left-[16%] right-[16%] h-[1px]" style={{ background: 'var(--border)' }} />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.15 }}
              className="relative"
            >
              {/* Step icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center relative z-10" style={{ background: step.color }}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center z-20" style={{ background: 'var(--bg)', border: '2px solid var(--border)' }}>
                    <span className="text-[10px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-primary)' }}>{step.number}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="heading-3 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{step.title}</h3>
                <p className="caption max-w-xs mx-auto mb-5" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>

                {/* Details */}
                <div className="card p-5">
                  <ul className="space-y-2.5">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2.5 text-left">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: step.color }} />
                        <span className="caption" style={{ color: 'var(--text-secondary)' }}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Example conversation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 p-8 card max-w-3xl mx-auto"
        >
          <h3 className="text-center heading-3 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Example Conversation</h3>
          
          <div className="space-y-4">
            {/* Person A speaks Telugu */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent)' }}>
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>Person A (Telugu)</div>
                <div className="inline-block px-4 py-2.5 rounded-2xl text-[13px] rounded-tl-md" style={{ background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                  నమస్తే, మీరు ఎలా ఉన్నారు?
                </div>
              </div>
            </div>

            {/* Translation arrow */}
            <div className="flex items-center gap-2 ml-11">
              <div className="w-6 h-px" style={{ background: 'var(--primary-ring)' }} />
              <Languages className="w-3.5 h-3.5" style={{ color: 'var(--primary)' }} />
              <span className="text-[10px]" style={{ color: 'var(--primary)' }}>Translating Telugu → English</span>
              <div className="flex-1 h-px" style={{ background: 'var(--primary-ring)' }} />
            </div>

            {/* Person B hears English */}
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary)' }}>
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>Person B (English)</div>
                <div className="inline-block px-4 py-2.5 rounded-2xl text-[13px] rounded-tr-md" style={{ background: 'var(--primary-ring)', color: 'var(--text-primary)' }}>
                  Hello, how are you?
                </div>
              </div>
            </div>

            {/* Person B responds in English */}
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary)' }}>
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>Person B (English)</div>
                <div className="inline-block px-4 py-2.5 rounded-2xl text-[13px] rounded-tr-md" style={{ background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                  I'm doing well, thank you!
                </div>
              </div>
            </div>

            {/* Translation arrow back */}
            <div className="flex items-center gap-2 ml-11 flex-row-reverse">
              <div className="w-6 h-px" style={{ background: 'var(--primary-ring)' }} />
              <Languages className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span className="text-[10px]" style={{ color: 'var(--accent)' }}>Translating English → Telugu</span>
              <div className="flex-1 h-px" style={{ background: 'var(--primary-ring)' }} />
            </div>

            {/* Person A hears Telugu */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent)' }}>
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] mb-1" style={{ color: 'var(--text-tertiary)' }}>Person A (Telugu)</div>
                <div className="inline-block px-4 py-2.5 rounded-2xl text-[13px] rounded-tl-md" style={{ background: 'var(--primary-ring)', color: 'var(--text-primary)' }}>
                  నేను బాగున్నాను, ధన్యవాదాలు!
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
