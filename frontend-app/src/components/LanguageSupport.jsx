import { useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { ChevronDown, Globe, CheckCircle } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', speakers: '1.5B' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', speakers: '600M' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', speakers: '550M' },
  { code: 'fr', name: 'French', flag: '🇫🇷', speakers: '310M' },
  { code: 'de', name: 'German', flag: '🇩🇪', speakers: '130M' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', speakers: '125M' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', speakers: '80M' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', speakers: '420M' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', speakers: '260M' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', speakers: '1.1B' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', speakers: '85M' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', speakers: '95M' },
]

export default function LanguageSupport() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [selectedLang, setSelectedLang] = useState(languages[0])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left - Language cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {languages.map((lang, i) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.1 + i * 0.04 }}
                whileHover={{ scale: 1.03, y: -2 }}
                onClick={() => setSelectedLang(lang)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedLang.code === lang.code
                    ? 'bg-[#6C3CE1]/15 border border-[#6C3CE1]/30'
                    : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]'
                }`}
              >
                <div className="text-[28px] mb-2">{lang.flag}</div>
                <div className="text-[13px] font-semibold text-white">{lang.name}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{lang.speakers} speakers</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right - Dropdown + info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">Global Reach</span>
            <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-6 tracking-tight leading-[1.1]">
              Every Language.{' '}
              <span className="gradient-text">Every Dialect.</span>
            </h2>
            <p className="text-[15px] sm:text-[17px] text-gray-400 mb-8 leading-relaxed max-w-lg">
              Real-time translation across 200+ languages with native script support. Preserve meaning, tone, and cultural context in every conversation.
            </p>

            {/* Language dropdown */}
            <div className="relative mb-8">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full max-w-sm px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl flex items-center justify-between hover:bg-white/[0.06] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[22px]">{selectedLang.flag}</span>
                  <span className="text-[15px] text-white font-medium">{selectedLang.name}</span>
                  <span className="text-[12px] text-gray-500">({selectedLang.speakers} speakers)</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 max-w-sm mt-2 bg-[#12121A] border border-white/[0.08] rounded-xl overflow-hidden z-20 shadow-2xl"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setSelectedLang(lang); setIsOpen(false) }}
                        className="w-full px-5 py-3 flex items-center gap-3 hover:bg-white/[0.04] transition-colors text-left"
                      >
                        <span className="text-[18px]">{lang.flag}</span>
                        <span className="text-[13px] text-white">{lang.name}</span>
                        <span className="text-[11px] text-gray-500 ml-auto">{lang.speakers}</span>
                        {selectedLang.code === lang.code && (
                          <CheckCircle className="w-3.5 h-3.5 text-[#6C3CE1]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Capabilities */}
            <div className="space-y-3">
              {[
                'Automatic language detection',
                'Real-time translation in conversations',
                'Native script rendering',
                'Code-switching support',
              ].map((cap, i) => (
                <motion.div
                  key={cap}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <Globe className="w-4 h-4 text-[#6C3CE1] flex-shrink-0" />
                  <span className="text-[14px] text-gray-400">{cap}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
