import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speakers: '600M', region: 'India' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speakers: '97M', region: 'India' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speakers: '85M', region: 'India' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speakers: '95M', region: 'India' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speakers: '38M', region: 'India' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speakers: '50M', region: 'India' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speakers: '56M', region: 'India' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speakers: '99M', region: 'India' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speakers: '113M', region: 'India' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', speakers: '70M', region: 'India' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', speakers: '15M', region: 'India' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', speakers: '38M', region: 'India' },
  { code: 'en', name: 'English', nativeName: 'English', speakers: '1.5B', region: 'Global' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', speakers: '550M', region: 'Global' },
  { code: 'fr', name: 'French', nativeName: 'Français', speakers: '310M', region: 'Global' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', speakers: '130M', region: 'Global' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', speakers: '125M', region: 'Global' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', speakers: '80M', region: 'Global' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', speakers: '420M', region: 'Global' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', speakers: '260M', region: 'Global' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', speakers: '1.1B', region: 'Global' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', speakers: '258M', region: 'Global' },
]

export default function LanguageSupport() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [selectedLang, setSelectedLang] = useState(languages[0])
  const [filter, setFilter] = useState('all')

  const filteredLanguages = filter === 'all'
    ? languages
    : filter === 'india'
      ? languages.filter(l => l.region === 'India')
      : languages.filter(l => l.region === 'Global')

  return (
    <section id="languages" className="section-lg" style={{ background: 'var(--bg-surface)' }}>
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left - Language grid */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            {/* Filter tabs */}
            <div className="flex gap-2 mb-6">
              {['all', 'india', 'global'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                  style={{
                    background: filter === f ? 'var(--primary-ring)' : 'var(--input-bg)',
                    color: filter === f ? 'var(--primary)' : 'var(--text-tertiary)',
                    border: `1px solid ${filter === f ? 'var(--primary)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {f === 'all' ? 'All Languages' : f === 'india' ? 'Indian Languages' : 'Global'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
              {filteredLanguages.map((lang, i) => (
                <motion.div
                  key={lang.code}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.05 + i * 0.02 }}
                  onClick={() => setSelectedLang(lang)}
                  className="p-4 rounded-xl cursor-pointer transition-all duration-200"
                  style={{
                    background: selectedLang.code === lang.code ? 'var(--primary-ring)' : 'var(--card-bg)',
                    border: `1px solid ${selectedLang.code === lang.code ? 'var(--primary)' : 'var(--card-border)'}`,
                  }}
                >
                  <div className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{lang.name}</div>
                  <div className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--primary)' }}>{lang.nativeName}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{lang.speakers} speakers</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="overline-dot mb-4" style={{ color: 'var(--accent)' }}>
              <span style={{ color: 'var(--accent)' }}>India's Platform</span>
            </div>
            <h2 className="heading-1 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              One App.{' '}
              <span style={{ color: 'var(--primary)' }}>Every Language.</span>
            </h2>
            <p className="body-lg mb-8 max-w-lg" style={{ color: 'var(--text-secondary)' }}>
              All 22 Scheduled Languages of India plus 200+ global languages.
              Real-time translation with native script support.
            </p>

            {/* Selected language info */}
            <div className="mb-8 p-5 rounded-xl" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div>
                  <div className="heading-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{selectedLang.name}</div>
                  <div className="body" style={{ color: 'var(--primary)' }}>{selectedLang.nativeName}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 caption" style={{ color: 'var(--text-secondary)' }}>
                <span>{selectedLang.speakers} speakers</span>
                <span className="w-1 h-1 rounded-full" style={{ background: 'var(--text-tertiary)' }} />
                <span>{selectedLang.region === 'India' ? 'Scheduled Language' : 'Global'}</span>
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
                  initial={{ opacity: 0, x: -8 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <Globe className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  <span className="body" style={{ color: 'var(--text-secondary)' }}>{cap}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
