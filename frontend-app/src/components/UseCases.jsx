import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Headphones, Stethoscope, Globe2, GraduationCap, MessageSquare, Mic, BarChart3 } from 'lucide-react'

const useCases = [
  {
    id: 'support',
    icon: Headphones,
    title: 'Customer Support',
    tagline: 'Deploy AI agents that handle 80% of tickets automatically',
    description: 'Deploy voice agents that answer calls 24/7, resolve common issues, escalate complex ones, and learn from every interaction.',
    stats: [
      { value: '80%', label: 'Tickets resolved' },
      { value: '<2s', label: 'Response time' },
      { value: '24/7', label: 'Availability' },
      { value: '60%', label: 'Cost reduction' },
    ],
    features: [
      'Automatic call routing and triage',
      'Multi-language support out of the box',
      'Seamless handoff to human agents',
      'Sentiment analysis on every call',
      'Post-call summaries and analytics',
    ],
    color: 'var(--primary)',
    demo: {
      user: 'My order hasn\'t arrived yet',
      agent: 'I can help with that. Let me look up your order... Found it — it\'s out for delivery and should arrive within 2 hours.',
    },
  },
  {
    id: 'healthcare',
    icon: Stethoscope,
    title: 'Healthcare',
    tagline: 'HIPAA-compliant voice documentation for clinical workflows',
    description: 'Automate medical transcription, patient intake, and clinical note-taking. Doctors dictate notes → transcribed → coded → filed.',
    stats: [
      { value: '98.5%', label: 'Accuracy' },
      { value: '3x', label: 'Faster documentation' },
      { value: 'HIPAA', label: 'Compliant' },
      { value: '40+', label: 'Languages' },
    ],
    features: [
      'HIPAA-compliant data handling',
      'Medical terminology recognition',
      'Automatic ICD-10 code suggestions',
      'Patient intake voice forms',
      'Multilingual appointment reminders',
    ],
    color: 'var(--success)',
    demo: {
      user: 'Patient presents with persistent cough for 3 weeks, no fever',
      agent: 'Transcribed and coded: ICD-10 R05.1 (Acute cough). Suggested follow-up: chest X-ray. Notes filed.',
    },
  },
  {
    id: 'global',
    icon: Globe2,
    title: 'Global Teams',
    tagline: 'Real-time translation for international collaboration',
    description: 'Two people speak different languages → both hear real-time translation. Perfect for international meetings and cross-border deals.',
    stats: [
      { value: '200+', label: 'Languages' },
      { value: '<100ms', label: 'Translation latency' },
      { value: 'Real-time', label: 'Bidirectional' },
      { value: '99%', label: 'Accuracy' },
    ],
    features: [
      'Bidirectional real-time translation',
      'Preserves tone and context',
      'Code-switching support',
      'Meeting transcription in all languages',
      'Custom vocabulary per team',
    ],
    color: 'var(--accent)',
    demo: {
      user: 'Japanese speaker: このプロジェクトの締め切りはいつですか？',
      agent: 'Translated to English: "When is the deadline for this project?" → Response in Japanese sent back.',
    },
  },
  {
    id: 'education',
    icon: GraduationCap,
    title: 'Education',
    tagline: 'AI tutors and multilingual learning at scale',
    description: 'Create AI tutors that explain concepts in any language, transcribe lectures automatically, and provide personalized feedback.',
    stats: [
      { value: '1-on-1', label: 'AI tutoring' },
      { value: '200+', label: 'Languages' },
      { value: 'Real-time', label: 'Transcription' },
      { value: '10x', label: 'Reach' },
    ],
    features: [
      'AI tutors with subject expertise',
      'Automatic lecture transcription',
      'Multilingual course content',
      'Voice-based language learning',
      'Student progress analytics',
    ],
    color: '#E040FB',
    demo: {
      user: 'Explain quantum computing in simple terms',
      agent: 'Think of a regular computer like a light switch — ON or OFF. A quantum computer can be ON, OFF, or both at the same time.',
    },
  },
]

export default function UseCases() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [activeId, setActiveId] = useState('support')
  const active = useCases.find((c) => c.id === activeId)

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
            <span style={{ color: 'var(--accent)' }}>Use Cases</span>
          </div>
          <h2 className="heading-1 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Built for <span style={{ color: 'var(--primary)' }}>Every Industry</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            From healthcare to education, ClearSpeak transforms how organizations communicate.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          {/* Left - Industry tabs */}
          <div className="space-y-2">
            {useCases.map((uc, i) => (
              <motion.button
                key={uc.id}
                onClick={() => setActiveId(uc.id)}
                initial={{ opacity: 0, x: -15 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06 }}
                className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center gap-3.5 ${
                  activeId === uc.id ? 'card' : 'hover:opacity-80'
                }`}
                style={activeId === uc.id ? {} : { background: 'transparent', border: '1px solid transparent' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200" style={{
                  background: activeId === uc.id ? uc.color : 'var(--input-bg)',
                }}>
                  <uc.icon className="w-5 h-5" style={{ color: activeId === uc.id ? 'white' : 'var(--text-tertiary)' }} />
                </div>
                <div>
                  <p className="caption" style={{ color: activeId === uc.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {uc.title}
                  </p>
                  <p className="text-[11px] mt-0.5 hidden sm:block" style={{ color: 'var(--text-tertiary)' }}>{uc.tagline}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right - Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="card p-8 sm:p-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: active.color }}>
                    <active.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="heading-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{active.title}</h3>
                    <p className="caption mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{active.tagline}</p>
                  </div>
                </div>

                <p className="body mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>{active.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {active.stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="p-3 rounded-xl text-center" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)' }}
                    >
                      <div className="text-[18px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-primary)' }}>{stat.value}</div>
                      <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Features */}
                  <div>
                    <h4 className="caption mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Capabilities</h4>
                    <ul className="space-y-2.5">
                      {active.features.map((feature, i) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.04 }}
                          className="flex items-start gap-2.5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: active.color }} />
                          <span className="caption" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Demo */}
                  <div className="rounded-xl p-5" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-3.5 h-3.5" style={{ color: 'var(--text-tertiary)' }} />
                      <span className="overline" style={{ color: 'var(--text-tertiary)' }}>Live Demo</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent)' }}>
                          <Mic className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="px-3 py-2.5 rounded-xl rounded-tl-md text-[12px] leading-relaxed" style={{ background: 'var(--primary-ring)', color: 'var(--text-primary)' }}>
                          {active.demo.user}
                        </div>
                      </div>

                      <div className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: active.color }}>
                          <BarChart3 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="px-3 py-2.5 rounded-xl rounded-tl-md text-[12px] leading-relaxed" style={{ background: 'var(--card-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                          {active.demo.agent}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
