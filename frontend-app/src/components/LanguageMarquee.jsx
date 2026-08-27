import { motion } from 'framer-motion'

const languages = [
  'Tamil', 'Kannada', 'Malayalam', 'Punjabi', 'Bengali',
  'Hindi', 'Telugu', 'Gujarati', 'Marathi', 'English',
  'Spanish', 'French', 'German', 'Chinese', 'Japanese',
  'Korean', 'Arabic', 'Portuguese', 'Russian', 'Italian',
]

export default function LanguageMarquee() {
  return (
    <section className="relative py-24 overflow-hidden bg-dark">
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#08080D] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#08080D] to-transparent z-10" />

      <div className="relative mb-5">
        <div className="marquee flex gap-4 whitespace-nowrap">
          {[...languages, ...languages].map((lang, i) => (
            <motion.div
              key={`row1-${i}`}
              whileHover={{ scale: 1.05 }}
              className="px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full text-[13px] font-medium text-gray-500 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1] transition-all cursor-default"
            >
              {lang}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="marquee-reverse flex gap-4 whitespace-nowrap">
          {[...languages.reverse(), ...languages].map((lang, i) => (
            <motion.div
              key={`row2-${i}`}
              whileHover={{ scale: 1.05 }}
              className="px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full text-[13px] font-medium text-gray-500 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1] transition-all cursor-default"
            >
              {lang}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="px-8 py-4 bg-[#08080D]/90 backdrop-blur-xl rounded-2xl border border-white/[0.08]">
          <span className="text-2xl font-bold gradient-text">200+ Languages</span>
        </div>
      </div>
    </section>
  )
}
