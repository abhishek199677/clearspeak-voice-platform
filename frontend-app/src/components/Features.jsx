import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Languages, Brain, Users, MessageSquare, Volume2, FileText } from 'lucide-react'

const features = [
  {
    icon: Volume2,
    title: 'Speech Intelligence',
    description: 'State-of-the-art speech recognition and synthesis. Deploy across mobile, browsers, and edge devices with privacy-first architecture.',
    color: '#6C3CE1',
    gradient: 'from-[#6C3CE1] to-[#9B6DFF]',
    stat: '98.5%',
    statLabel: 'Accuracy',
  },
  {
    icon: Languages,
    title: '200+ Languages',
    description: 'Real-time translation across 200+ languages with native script support. Preserve meaning, tone, and cultural context.',
    color: '#FF6B35',
    gradient: 'from-[#FF6B35] to-[#FF8F6B]',
    stat: '200+',
    statLabel: 'Languages',
  },
  {
    icon: Brain,
    title: 'AI Agents',
    description: 'Intelligent conversational agents with persistent memory, tool calling, and multi-turn orchestration.',
    color: '#00D4AA',
    gradient: 'from-[#00D4AA] to-[#00F5C4]',
    stat: '<100ms',
    statLabel: 'Response',
  },
  {
    icon: MessageSquare,
    title: 'Voice Agents',
    description: 'Natural voice interactions that understand dialects, code-switching, and mixed-language conversations.',
    color: '#E040FB',
    gradient: 'from-[#E040FB] to-[#F060FF]',
    stat: '24/7',
    statLabel: 'Available',
  },
  {
    icon: Users,
    title: 'Enterprise Scale',
    description: 'Support millions of concurrent users with sub-100ms latency. Auto-scaling infrastructure that grows with you.',
    color: '#00BCD4',
    gradient: 'from-[#00BCD4] to-[#00E5FF]',
    stat: '1M+',
    statLabel: 'Concurrent',
  },
  {
    icon: FileText,
    title: 'Document Intelligence',
    description: 'Extract, analyze, and process documents with AI. Automate workflows and transform unstructured data.',
    color: '#FF5722',
    gradient: 'from-[#FF5722] to-[#FF7043]',
    stat: '99.9%',
    statLabel: 'Uptime',
  },
]

function FeatureCard({ feature, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="relative glass-card rounded-2xl p-7 h-full overflow-hidden">
        {/* Top gradient line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient} rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Background glow on hover */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full blur-[60px] opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700`} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
              <feature.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-right">
              <div className="text-[18px] font-bold text-white">{feature.stat}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">{feature.statLabel}</div>
            </div>
          </div>

          <h3 className="text-[17px] font-semibold mb-2.5 text-white group-hover:text-white transition-colors">{feature.title}</h3>
          <p className="text-[13px] text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{feature.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      {/* Background blobs */}
      <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-[#6C3CE1]/5 rounded-full blur-[100px] gradient-blob" />
      <div className="absolute bottom-[10%] right-[-5%] w-[350px] h-[350px] bg-[#FF6B35]/4 rounded-full blur-[80px] gradient-blob-delayed" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">Platform</span>
          <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Everything You Need to{' '}
            <span className="gradient-text">Build at Scale</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A unified platform for speech intelligence, language models, and autonomous agents. Production-ready from day one.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
