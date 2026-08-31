import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Languages, Mic, Volume2, ArrowRightLeft, Shield, Zap, Globe, Users } from 'lucide-react'

const features = [
  {
    icon: ArrowRightLeft,
    title: 'Real-Time Translation',
    description: 'Speech-to-speech translation between 22 Indian languages. Speak Hindi, hear Tamil. Instantly.',
    color: '#6C3CE1',
    gradient: 'from-[#6C3CE1] to-[#9B6DFF]',
    stat: '<300ms',
    statLabel: 'Latency',
  },
  {
    icon: Languages,
    title: '22 Indian Languages',
    description: 'All Scheduled Languages of India: Hindi, Bengali, Tamil, Telugu, Malayalam, Kannada, and more.',
    color: '#FF6B35',
    gradient: 'from-[#FF6B35] to-[#FF8F6B]',
    stat: '22',
    statLabel: 'Languages',
  },
  {
    icon: Mic,
    title: 'Bhashini ASR',
    description: 'Speech recognition powered by Bhashini and AI4Bharat. Built for Indian accents and dialects.',
    color: '#00D4AA',
    gradient: 'from-[#00D4AA] to-[#00F5C4]',
    stat: '98.5%',
    statLabel: 'Accuracy',
  },
  {
    icon: Volume2,
    title: 'Neural TTS',
    description: 'Azure Neural voices for Indian languages. Natural-sounding speech in Hindi, Tamil, Telugu, and more.',
    color: '#E040FB',
    gradient: 'from-[#E040FB] to-[#F060FF]',
    stat: '20+',
    statLabel: 'Voices',
  },
  {
    icon: Shield,
    title: 'Data Sovereignty',
    description: 'India-first architecture. Your data stays in India. Compliant with Indian data protection laws.',
    color: '#00BCD4',
    gradient: 'from-[#00BCD4] to-[#00E5FF]',
    stat: '100%',
    statLabel: 'Indian',
  },
  {
    icon: Zap,
    title: 'IndicTrans2',
    description: 'Powered by AI4Bharat\'s IndicTrans2 for high-quality translation between Indian languages.',
    color: '#FF5722',
    gradient: 'from-[#FF5722] to-[#FF7043]',
    stat: '22+',
    statLabel: 'Pairs',
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
            Built for{' '}
            <span className="gradient-text">India's Languages</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Real-time translation, speech recognition, and voice synthesis for all 22 Scheduled Languages of India. Powered by Indian AI research.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        {/* Language grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-8 glass-card rounded-2xl"
        >
          <h3 className="text-center text-[15px] font-semibold text-white mb-6">All 22 Scheduled Languages of India</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-3">
            {[
              { code: 'hi', name: 'Hindi' },
              { code: 'bn', name: 'Bengali' },
              { code: 'ta', name: 'Tamil' },
              { code: 'te', name: 'Telugu' },
              { code: 'ml', name: 'Malayalam' },
              { code: 'kn', name: 'Kannada' },
              { code: 'gu', name: 'Gujarati' },
              { code: 'mr', name: 'Marathi' },
              { code: 'pa', name: 'Punjabi' },
              { code: 'ur', name: 'Urdu' },
              { code: 'as', name: 'Assamese' },
              { code: 'or', name: 'Odia' },
              { code: 'sa', name: 'Sanskrit' },
              { code: 'gom', name: 'Konkani' },
              { code: 'doi', name: 'Dogri' },
              { code: 'mai', name: 'Maithili' },
              { code: 'sat', name: 'Santali' },
              { code: 'ks', name: 'Kashmiri' },
              { code: 'mni', name: 'Manipuri' },
              { code: 'brx', name: 'Bodo' },
              { code: 'sd', name: 'Sindhi' },
              { code: 'ne', name: 'Nepali' },
            ].map((lang) => (
              <div
                key={lang.code}
                className="px-2 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-center hover:bg-white/[0.06] transition-all cursor-default"
              >
                <div className="text-[11px] font-semibold text-white">{lang.name}</div>
                <div className="text-[9px] text-gray-500 mt-0.5">{lang.code}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
