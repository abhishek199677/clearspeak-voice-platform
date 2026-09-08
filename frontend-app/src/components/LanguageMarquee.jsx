const languages = [
  'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Malayalam',
  'Kannada', 'Gujarati', 'Marathi', 'Punjabi', 'Urdu',
  'Assamese', 'Odia', 'English', 'Spanish', 'French',
  'German', 'Chinese', 'Japanese', 'Korean', 'Arabic',
  'Portuguese', 'Russian',
]

export default function LanguageMarquee() {
  return (
    <section className="relative py-16 overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="absolute left-0 top-0 bottom-0 w-40 z-10" style={{ background: `linear-gradient(to right, var(--bg), transparent)` }} />
      <div className="absolute right-0 top-0 bottom-0 w-40 z-10" style={{ background: `linear-gradient(to left, var(--bg), transparent)` }} />

      <div className="relative mb-4">
        <div className="flex gap-3 whitespace-nowrap" style={{ animation: 'marquee 40s linear infinite' }}>
          {[...languages, ...languages].map((lang, i) => (
            <div
              key={`row1-${i}`}
              className="px-4 py-2 rounded-full caption cursor-default transition-colors duration-200"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}
            >
              {lang}
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-3 whitespace-nowrap" style={{ animation: 'marquee-reverse 40s linear infinite' }}>
          {[...languages.reverse(), ...languages].map((lang, i) => (
            <div
              key={`row2-${i}`}
              className="px-4 py-2 rounded-full caption cursor-default transition-colors duration-200"
              style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}
            >
              {lang}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="px-6 py-3 rounded-xl backdrop-blur-xl" style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border)' }}>
          <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--primary)' }}>22 Indian Languages</span>
        </div>
      </div>
    </section>
  )
}
