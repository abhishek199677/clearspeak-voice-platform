import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Headphones, Stethoscope, Globe2, GraduationCap, ArrowRight, MessageSquare, Mic, BarChart3, Users } from 'lucide-react'

const useCases = [
  {
    id: 'support',
    icon: Headphones,
    title: 'Customer Support',
    tagline: 'Deploy AI agents that handle 80% of tickets automatically',
    description: 'Deploy voice agents that answer calls 24/7, resolve common issues, escalate complex ones, and learn from every interaction. Reduce wait times from minutes to seconds.',
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
    color: '#6C3CE1',
    gradient: 'from-[#6C3CE1] to-[#9B6DFF]',
    demo: {
      user: 'My order hasn\'t arrived yet',
      agent: 'I can help with that. Let me look up your order... Found it — it\'s out for delivery and should arrive within 2 hours. Would you like me to send you a tracking link?',
    },
  },
  {
    id: 'healthcare',
    icon: Stethoscope,
    title: 'Healthcare',
    tagline: 'HIPAA-compliant voice documentation for clinical workflows',
    description: 'Automate medical transcription, patient intake, and clinical note-taking. Doctors dictate notes → transcribed → coded → filed. Patients get multilingual appointment reminders.',
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
    color: '#00D4AA',
    gradient: 'from-[#00D4AA] to-[#00F5C4]',
    demo: {
      user: 'Patient presents with persistent cough for 3 weeks, no fever',
      agent: 'Transcribed and coded: ICD-10 R05.1 (Acute cough). Suggested follow-up: chest X-ray. Notes filed to patient record.',
    },
  },
  {
    id: 'global',
    icon: Globe2,
    title: 'Global Teams',
    tagline: 'Real-time translation for international collaboration',
    description: 'Two people speak different languages → both hear real-time translation. Perfect for international meetings, global customer support, and cross-border deals.',
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
    color: '#FF6B35',
    gradient: 'from-[#FF6B35] to-[#FF8F6B]',
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
    description: 'Create AI tutors that explain concepts in any language, transcribe lectures automatically, and provide personalized feedback to every student.',
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
    gradient: 'from-[#E040FB] to-[#F060FF]',
    demo: {
      user: 'Explain quantum computing in simple terms',
      agent: 'Think of a regular computer like a light switch — it\'s either ON or OFF. A quantum computer is like a special light that can be ON, OFF, or both at the same time. This lets it solve certain problems much faster.',
    },
  },
]

const icons = { Headphones, Stethoscope, Globe2, GraduationCap }

export default function UseCases() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [activeId, setActiveId] = useState('support')
  const active = useCases.find((c) => c.id === activeId)

  return (
    <section id="about" className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-dark-light" />

      {/* Background blobs */}
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-[#6C3CE1]/5 rounded-full blur-[120px] gradient-blob" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">Use Cases</span>
          <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Built for <span className="gradient-text">Every Industry</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
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
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.06 }}
                className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center gap-3.5 ${
                  activeId === uc.id
                    ? 'glass-card bg-white/[0.04] border-white/[0.1]'
                    : 'bg-transparent border border-transparent hover:bg-white/[0.02]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  activeId === uc.id ? `bg-gradient-to-br ${uc.gradient}` : 'bg-white/[0.04]'
                }`}>
                  <uc.icon className={`w-5 h-5 ${activeId === uc.id ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`text-[14px] font-semibold transition-colors ${
                    activeId === uc.id ? 'text-white' : 'text-gray-400'
                  }`}>
                    {uc.title}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-0.5 hidden sm:block">{uc.tagline}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right - Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="glass-card rounded-[24px] p-8 sm:p-10">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${active.gradient} flex items-center justify-center flex-shrink-0`}>
                    <active.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[22px] font-bold text-white">{active.title}</h3>
                    <p className="text-[13px] text-gray-500 mt-0.5">{active.tagline}</p>
                  </div>
                </div>

                <p className="text-[14px] text-gray-400 leading-relaxed mb-8">{active.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {active.stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-center"
                    >
                      <div className="text-[18px] font-bold text-white">{stat.value}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Features */}
                  <div>
                    <h4 className="text-[13px] font-semibold text-white mb-4 uppercase tracking-wider">Capabilities</h4>
                    <ul className="space-y-2.5">
                      {active.features.map((feature, i) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.04 }}
                          className="flex items-start gap-2.5"
                        >
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: active.color }} />
                          <span className="text-[13px] text-gray-400">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Demo */}
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Live Demo</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B] flex items-center justify-center flex-shrink-0">
                          <Mic className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="px-3 py-2.5 rounded-xl rounded-tl-md bg-[#FF6B35]/10 text-[12px] text-white leading-relaxed">
                          {active.demo.user}
                        </div>
                      </div>

                      <div className="flex gap-2.5">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${active.gradient} flex items-center justify-center flex-shrink-0`}>
                          <BarChart3 className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="px-3 py-2.5 rounded-xl rounded-tl-md bg-white/[0.04] text-[12px] text-gray-300 leading-relaxed">
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
