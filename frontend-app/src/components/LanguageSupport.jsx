import { useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { ChevronDown, Globe, CheckCircle } from 'lucide-react'

const languages = [
  // 22 Scheduled Languages of India
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speakers: '600M', region: 'India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', speakers: '97M', region: 'India' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speakers: '85M', region: 'India' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speakers: '95M', region: 'India' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', speakers: '38M', region: 'India' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speakers: '50M', region: 'India' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', speakers: '56M', region: 'India' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', speakers: '99M', region: 'India' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', speakers: '113M', region: 'India' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', speakers: '70M', region: 'India' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', speakers: '15M', region: 'India' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', speakers: '38M', region: 'India' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳', speakers: '0.02M', region: 'India' },
  { code: 'gom', name: 'Konkani', nativeName: 'कोंकणी', flag: '🇮🇳', speakers: '7.6M', region: 'India' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', flag: '🇮🇳', speakers: '3.2M', region: 'India' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', flag: '🇮🇳', speakers: '52M', region: 'India' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🇮🇳', speakers: '7.4M', region: 'India' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर', flag: '🇮🇳', speakers: '6.8M', region: 'India' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্', flag: '🇮🇳', speakers: '1.8M', region: 'India' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', flag: '🇮🇳', speakers: '1.5M', region: 'India' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇮🇳', speakers: '30M', region: 'India' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇮🇳', speakers: '25M', region: 'India' },
  // Global languages
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌍', speakers: '1.5B', region: 'Global' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speakers: '550M', region: 'Global' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speakers: '310M', region: 'Global' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', speakers: '130M', region: 'Global' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', speakers: '125M', region: 'Global' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', speakers: '80M', region: 'Global' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', speakers: '420M', region: 'Global' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', speakers: '260M', region: 'Global' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', speakers: '1.1B', region: 'Global' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', speakers: '258M', region: 'Global' },
]

export default function LanguageSupport() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [selectedLang, setSelectedLang] = useState(languages[0])
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  const filteredLanguages = filter === 'all' 
    ? languages 
    : filter === 'india' 
      ? languages.filter(l => l.region === 'India')
      : languages.filter(l => l.region === 'Global')

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
          >
            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
              {['all', 'india', 'global'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                    filter === f
                      ? 'bg-[#6C3CE1]/20 text-[#6C3CE1] border border-[#6C3CE1]/30'
                      : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                >
                  {f === 'all' ? 'All Languages' : f === 'india' ? '🇮🇳 Indian Languages' : '🌍 Global'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {filteredLanguages.map((lang, i) => (
                <motion.div
                  key={lang.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.1 + i * 0.02 }}
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
                  <div className="text-[11px] text-[#6C3CE1] font-medium mt-0.5">{lang.nativeName}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{lang.speakers} speakers</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Dropdown + info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">India's Platform</span>
            <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-6 tracking-tight leading-[1.1]">
              One App.{' '}
              <span className="gradient-text">Every Language.</span>
            </h2>
            <p className="text-[15px] sm:text-[17px] text-gray-400 mb-8 leading-relaxed max-w-lg">
              All 22 Scheduled Languages of India plus 200+ global languages. 
              Real-time translation with native script support. For India. By India. With India.
            </p>

            {/* Selected language info */}
            <div className="mb-8 p-5 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[32px]">{selectedLang.flag}</span>
                <div>
                  <div className="text-[18px] font-bold text-white">{selectedLang.name}</div>
                  <div className="text-[14px] text-[#6C3CE1]">{selectedLang.nativeName}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[13px] text-gray-400">
                <span>{selectedLang.speakers} speakers</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span>{selectedLang.region === 'India' ? '🇮🇳 Scheduled Language' : '🌍 Global'}</span>
              </div>
            </div>

            {/* Capabilities */}
            <div className="space-y-3">
              {[
                'All 22 Indian Scheduled Languages',
                'Automatic language detection',
                'Real-time translation in conversations',
                'Native script rendering (Devanagari, Bengali, Tamil, etc.)',
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
