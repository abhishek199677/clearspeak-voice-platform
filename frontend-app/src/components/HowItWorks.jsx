import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Mic, Brain, Volume2, ArrowRight, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Mic,
    title: 'Speak or Upload',
    description: 'Talk into your microphone or upload an audio file. ClearSpeak supports 200+ languages and handles any accent or dialect.',
    details: ['Live microphone input', 'Audio file upload', 'Real-time streaming', 'Any language, any accent'],
    color: '#6C3CE1',
    gradient: 'from-[#6C3CE1] to-[#9B6DFF]',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI Processes',
    description: 'Our AI transcribes, translates, and understands context in real-time. Sub-100ms response with enterprise-grade accuracy.',
    details: ['98.5% transcription accuracy', 'Context-aware responses', 'Multi-language translation', 'Sentiment analysis'],
    color: '#FF6B35',
    gradient: 'from-[#FF6B35] to-[#FF8F6B]',
  },
  {
    number: '03',
    icon: Volume2,
    title: 'Get Results',
    description: 'Receive text transcripts, voice responses, or translated audio. Export, integrate, or deploy as an agent.',
    details: ['Text transcripts', 'Voice output in any language', 'API integration', 'Deploy as 24/7 agent'],
    color: '#00D4AA',
    gradient: 'from-[#00D4AA] to-[#00F5C4]',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      {/* Background blobs */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#6C3CE1]/5 rounded-full blur-[120px] gradient-blob" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-[#FF6B35]/4 rounded-full blur-[100px] gradient-blob-delayed" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[#00D4AA] font-semibold tracking-wider uppercase text-[11px]">How It Works</span>
          <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Three Steps to{' '}
            <span className="gradient-text">Smarter Communication</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            From speech to insight in seconds. No complex setup, no coding required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-[72px] left-[16%] right-[16%] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-[#6C3CE1]/30 via-[#FF6B35]/30 to-[#00D4AA]/30" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.15 }}
              className="relative"
            >
              {/* Step number circle */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className={`w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg relative z-10`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-2xl blur-[20px] opacity-30`} />
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#08080D] border-2 border-white/10 flex items-center justify-center z-20">
                    <span className="text-[10px] font-bold text-white">{step.number}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-[18px] font-bold text-white mb-3">{step.title}</h3>
                <p className="text-[13px] text-gray-400 leading-relaxed mb-5 max-w-xs mx-auto">{step.description}</p>

                {/* Details */}
                <div className="glass-card rounded-xl p-5">
                  <ul className="space-y-2.5">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2.5 text-left">
                        <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0`} style={{ color: step.color }} />
                        <span className="text-[12px] text-gray-400">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Arrow between steps */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-[60px] -right-4 lg:-right-4 z-20">
                  <ArrowRight className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
