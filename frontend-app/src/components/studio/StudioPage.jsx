import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowRight, Plus, Play, Sparkles } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionStreamingContent,
  AccordionTrigger,
} from '@/components/ui/accordion-generative-utils/accordion'
import DemoVideo from '@/components/DemoVideo'

const EASE = [0.16, 1, 0.3, 1]

const languages = [
  'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Gujarati',
  'Marathi', 'Punjabi', 'Urdu', 'English', 'Spanish', 'French', 'German',
  'Chinese', 'Japanese', 'Korean', 'Arabic',
]

const work = [
  {
    n: '01',
    tag: 'Healthcare',
    title: ['Doctor speaks Telugu.', 'Patient hears English.'],
    meta: 'Real-time consultation translation, under 300ms',
    grad: 'from-[#6C3CE1] via-[#9B6DFF] to-[#FF6B35]',
    href: '#/speech',
  },
  {
    n: '02',
    tag: 'Customer Support',
    title: ['One queue.', 'Every language.'],
    meta: 'AI voice agents answering 24/7 in 22 languages',
    grad: 'from-[#FF6B35] via-[#FF8F6B] to-[#6C3CE1]',
    href: '#/calls',
  },
  {
    n: '03',
    tag: 'Live Media',
    title: ['Streams translated', 'as they happen.'],
    meta: 'Live captions and dubs for broadcasts and events',
    grad: 'from-[#00D4AA] via-[#6C3CE1] to-[#9B6DFF]',
    href: '#/live',
  },
]

const services = [
  { n: '01', title: 'Speech-to-Speech', desc: 'Live voice translation, <300ms', href: '#/speech' },
  { n: '02', title: 'Voice Cloning', desc: '30 seconds of audio, any language', href: '#/clone' },
  { n: '03', title: 'AI Voice Agents', desc: 'Autonomous calls, human handoff', href: '#/calls' },
  { n: '04', title: 'Realtime Chat', desc: 'Text in, text out, every script', href: '#/chat' },
  { n: '05', title: 'Live Streaming', desc: 'Broadcast captions and dubs', href: '#/live' },
  { n: '06', title: 'Analytics', desc: 'Latency, spend and quality in one view', href: '#/analytics' },
]

const stats = [
  { to: 22, label: 'Indian languages', suffix: '' },
  { to: 200, label: 'Global languages', suffix: '+' },
  { to: 300, label: 'Milliseconds latency', prefix: '<', suffix: 'ms' },
  { to: 1.4, decimals: 1, label: 'Billion people served', suffix: 'B+' },
]

const testimonials = [
  {
    quote: 'Our support floor went from three language teams to one. Customers hear their own language, agents hear theirs.',
    who: 'VP, Customer Support',
    where: 'Indian fintech',
  },
  {
    quote: 'We cloned the clinic\u2019s front-desk voice once. Now every appointment reminder goes out in the patient\u2019s own language.',
    who: 'Head of Operations',
    where: 'Multi-city hospital network',
  },
  {
    quote: 'Latency was the dealbreaker everywhere else. Under 300ms is the difference between a conversation and a delay.',
    who: 'Engineering Lead',
    where: 'Livestream platform',
  },
]

const faqs = [
  {
    q: 'Which languages are supported?',
    a: 'All 22 scheduled languages of India plus 200+ global languages, in both native scripts and romanized text \u2014 meaning and cultural context preserved.',
  },
  {
    q: 'How fast is real-time translation?',
    a: 'Average voice translation latency is under 300ms using edge computing and optimized ML models, so conversations keep their natural rhythm.',
  },
  {
    q: 'How does voice cloning work?',
    a: 'Send 30 seconds of audio. Our models capture vocal character, accent and speaking style, then speak any text in 200+ languages.',
  },
  {
    q: 'How secure is the data?',
    a: 'End-to-end encryption, SOC 2 Type II and GDPR compliant. Your audio and transcripts are never used to train models without consent.',
  },
  {
    q: 'Can it integrate with existing tools?',
    a: 'REST API, webhooks and SDKs for Python, JavaScript and Swift \u2014 plus connectors for Slack, Zendesk, Salesforce and HubSpot.',
  },
]

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.08em] ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-8%' }}
      variants={{ hidden: {}, show: {} }}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHead({ index, kicker, children }) {
  return (
    <div className="mb-14 sm:mb-20">
      <FadeUp className="flex items-center gap-4 mb-6">
        <span className="text-[11px] tracking-[0.3em] uppercase text-[#9B6DFF]">({index})</span>
        <span className="text-[11px] tracking-[0.3em] uppercase text-gray-500">{kicker}</span>
        <span className="h-px flex-1 bg-white/[0.08]" />
      </FadeUp>
      <h2 className="font-light text-[clamp(2rem,5.5vw,4rem)] leading-[1.05] tracking-tight text-white">
        {children}
      </h2>
    </div>
  )
}

function Waveform({ bars = 32, className = '' }) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-current origin-bottom"
          style={{ height: `${36 + ((i * 37) % 72)}%` }}
          animate={{ scaleY: [0.35, 1, 0.55, 0.9, 0.4] }}
          transition={{
            duration: 1.6 + (i % 5) * 0.25,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  )
}

function CountUp({ to, decimals = 0, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return undefined
    let raf
    const start = performance.now()
    const dur = 1400
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(to * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])

  return (
    <span ref={ref}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

function StudioHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '45%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.25])

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden flex items-center">
      {/* Color wash */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[10%] h-[120%]">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_15%,rgba(255,107,53,0.42),transparent_55%),radial-gradient(100%_80%_at_15%_85%,rgba(108,60,225,0.5),transparent_60%)]" />
        <div className="absolute top-[-15%] right-[-10%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] gradient-blob">
          <div className="w-full h-full bg-[#FF6B35]/20 rounded-full blur-[120px]" />
        </div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] gradient-blob-delayed">
          <div className="w-full h-full bg-[#6C3CE1]/30 rounded-full blur-[130px]" />
        </div>
      </motion.div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Voice rings motif */}
      <motion.div
        style={{ y: contentY, scale: ringScale }}
        className="absolute right-[8%] top-1/2 -translate-y-1/2 hidden md:block"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-white/[0.08] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[280px] h-[280px] lg:w-[420px] lg:h-[420px]"
            animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
          />
        ))}
        <div className="relative w-[280px] h-[280px] lg:w-[420px] lg:h-[420px] rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] flex items-center justify-center">
          <Waveform bars={24} className="h-[38%] w-[62%] justify-center text-white/80" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20"
      >
        <div className="flex items-start justify-between gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
              className="mb-8 flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-white/60"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
              ClearSpeak Studio
            </motion.div>

            <h1 className="font-light text-white text-[clamp(2.75rem,9vw,7rem)] leading-[0.98] tracking-[-0.03em]">
              <Reveal delay={0.15}>Every Voice</Reveal>
              <Reveal delay={0.28}>Understood</Reveal>
              <Reveal delay={0.41}>
                <span className="gradient-text">Everywhere.</span>
              </Reveal>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.8, ease: EASE }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <motion.a
                href="#/speech"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#08080D] rounded-full text-[14px] font-medium hover:shadow-[0_16px_40px_rgba(255,255,255,0.18)] transition-shadow"
              >
                <span className="w-2 h-2 rounded-full bg-[#6C3CE1]" />
                Listen to a demo
              </motion.a>
              <motion.a
                href="#studio-work"
                onClick={(e) => {
                  const el = document.getElementById('studio-work')
                  if (el) {
                    e.preventDefault()
                    el.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[14px] font-medium text-white/80 border border-white/[0.14] hover:bg-white/[0.06] transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Selected work
              </motion.a>
            </motion.div>
          </div>

          {/* Floating meta labels */}
          <div className="hidden lg:flex flex-col items-end justify-between h-[46vh] text-right">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: EASE }}
              className="text-[13px] leading-snug text-white/70"
            >
              Real-time voice
              <br />
              translation
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
              className="text-[13px] leading-snug text-white/70"
            >
              Built for India,
              <br />
              ready for the world
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="block w-px h-10 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </section>
  )
}

function LanguageStrip() {
  return (
    <div className="relative py-8 border-y border-white/[0.06] overflow-hidden bg-[#0A0A0F]">
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#0A0A0F] to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#0A0A0F] to-transparent" />
      <div className="marquee flex gap-10 whitespace-nowrap">
        {[...languages, ...languages].map((lang, i) => (
          <span
            key={`${lang}-${i}`}
            className="font-light text-[clamp(1.25rem,2.5vw,2rem)] text-white/35 hover:text-white transition-colors duration-300"
          >
            {lang}
            <span className="text-[#FF6B35] ml-10">&bull;</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function WorkSection() {
  return (
    <section id="studio-work" className="py-24 sm:py-36 px-5 sm:px-8 max-w-7xl mx-auto">
      <SectionHead index="03" kicker="Selected Work">
        <Reveal>Where ClearSpeak</Reveal>
        <Reveal delay={0.1}>earns its keep.</Reveal>
      </SectionHead>

      <div className="space-y-24 sm:space-y-32">
        {work.map((item, i) => (
          <WorkRow key={item.n} item={item} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  )
}

function WorkRow({ item, flip }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const visualY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <div ref={ref} className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${flip ? 'lg:[direction:rtl]' : ''}`}>
      <div className="[direction:ltr]">
        <FadeUp className="flex items-center gap-4 mb-5">
          <span className="text-[11px] tracking-[0.3em] text-[#9B6DFF]">{item.n}</span>
          <span className="text-[11px] tracking-[0.3em] uppercase text-gray-500">{item.tag}</span>
        </FadeUp>
        <h3 className="font-light text-[clamp(1.75rem,4vw,3rem)] leading-[1.08] tracking-tight text-white">
          {item.title.map((line, j) => (
            <Reveal key={line} delay={j * 0.08}>
              {line}
            </Reveal>
          ))}
        </h3>
        <FadeUp delay={0.2}>
          <p className="mt-5 text-[15px] text-gray-400 max-w-md leading-relaxed">{item.meta}</p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <a
            href={item.href || '#/speech'}
            className="mt-7 inline-flex items-center gap-2 text-[13px] tracking-wide text-white/80 border-b border-white/20 pb-1 hover:border-[#FF6B35] hover:text-white transition-colors group"
          >
            View case
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </FadeUp>
      </div>

      <motion.div
        style={{ y: visualY }}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: EASE }}
        className="[direction:ltr]"
      >
        <div className={`group relative aspect-[4/3] rounded-[24px] overflow-hidden bg-gradient-to-br ${item.grad}`}>
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_20%,rgba(255,255,255,0.22),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <span className="absolute top-6 left-7 font-light text-[clamp(3rem,7vw,5.5rem)] leading-none text-white/85">
            {item.n}
          </span>
          <Waveform
            bars={28}
            className="absolute bottom-8 left-7 right-7 h-[34%] text-white/90 transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute bottom-6 right-7 text-[11px] tracking-[0.2em] uppercase text-white/70">
            {item.tag}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ServicesSection() {
  return (
    <section id="capabilities" className="py-24 sm:py-36 px-5 sm:px-8 max-w-7xl mx-auto">
      <SectionHead index="01" kicker="Capabilities">
        <Reveal>Six ways to be</Reveal>
        <Reveal delay={0.1}>understood.</Reveal>
      </SectionHead>

      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 bg-white/[0.08] border border-white/[0.08] rounded-[24px] overflow-hidden">
        {services.map((s, i) => (
          <FadeUp key={s.n} delay={i * 0.06} className="bg-[#0A0A0F]">
            <a
              href={s.href || '#/features'}
              className="group relative flex flex-col h-full p-7 sm:p-9 min-h-[210px] overflow-hidden"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-b from-[#6C3CE1]/16 via-[#6C3CE1]/5 to-transparent" />
              <span className="relative flex items-start justify-between">
                <span className="text-[11px] tracking-[0.25em] text-gray-600 group-hover:text-[#9B6DFF] transition-colors">
                  {s.n}
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-700 group-hover:text-[#FF6B35] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
              <span className="relative mt-auto block pt-10 font-light text-[clamp(1.35rem,2.4vw,1.9rem)] leading-tight tracking-tight text-white/80 group-hover:text-white transition-colors">
                {s.title}
              </span>
              <span className="relative mt-3 block text-[13px] leading-relaxed text-gray-500 group-hover:text-gray-300 transition-colors">
                {s.desc}
              </span>
            </a>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="py-24 sm:py-36 px-5 sm:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,rgba(108,60,225,0.14),transparent_70%)]" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHead index="04" kicker="By the Numbers">
          <Reveal>Speed is the feature.</Reveal>
        </SectionHead>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.1}>
              <div className="border-t border-white/[0.1] pt-6">
                <div className="font-light text-white text-[clamp(2.5rem,6vw,4.5rem)] leading-none tracking-tight">
                  <CountUp to={s.to} decimals={s.decimals || 0} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                </div>
                <div className="mt-4 text-[12px] tracking-[0.15em] uppercase text-gray-500">
                  {s.label}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-36 px-5 sm:px-8 max-w-7xl mx-auto">
      <SectionHead index="05" kicker="Words">
        <Reveal>From the people</Reveal>
        <Reveal delay={0.1}>who stopped translating.</Reveal>
      </SectionHead>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <FadeUp key={t.who} delay={i * 0.12}>
            <figure className="h-full flex flex-col justify-between p-7 sm:p-9 rounded-[20px] bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-400">
              <blockquote className="font-light text-[17px] sm:text-[19px] leading-relaxed text-white/85">
                <span className="text-[#FF6B35] mr-1">&ldquo;</span>
                {t.quote}
                <span className="text-[#FF6B35] ml-1">&rdquo;</span>
              </blockquote>
              <figcaption className="mt-8 pt-5 border-t border-white/[0.08]">
                <div className="text-[13px] text-white">{t.who}</div>
                <div className="text-[12px] text-gray-500 mt-0.5">{t.where}</div>
              </figcaption>
            </figure>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section id="faq" className="py-24 sm:py-36 px-5 sm:px-8 max-w-4xl mx-auto">
      <SectionHead index="06" kicker="Generative AI FAQ">
        <Reveal>Good to know.</Reveal>
      </SectionHead>

      <Accordion
        type="single"
        collapsible
        variant="card"
        defaultValue="faq-0"
        className="w-full space-y-3.5"
      >
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`faq-${i}`}>
            <AccordionTrigger>
              <span className="flex items-center gap-3.5 text-left">
                <span className="text-[11px] tracking-[0.25em] font-mono text-gray-500">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Sparkles
                  aria-hidden="true"
                  className="size-4 shrink-0 text-violet-400"
                  strokeWidth={2}
                />
                <span className="font-light text-[clamp(1.05rem,2vw,1.35rem)] text-white/90 group-hover:text-white transition-colors">
                  {f.q}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionStreamingContent text={f.a} speed={12} />
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

function ClosingSection() {
  return (
    <section className="relative py-28 sm:py-40 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_100%,rgba(108,60,225,0.3),transparent_65%),radial-gradient(60%_50%_at_80%_10%,rgba(255,107,53,0.16),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto text-center">
        <h2 className="font-light text-white text-[clamp(2.75rem,10vw,8rem)] leading-[0.95] tracking-[-0.03em]">
          <Reveal>Let&#39;s</Reveal>
          <Reveal delay={0.12}>
            <span className="gradient-text-alt">speak.</span>
          </Reveal>
        </h2>
        <FadeUp delay={0.35}>
          <p className="mt-8 text-[15px] text-gray-400 max-w-md mx-auto leading-relaxed">
            One endpoint for voice, chat and live translation across 22 Indian languages
            and 200+ global ones.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href="#/voice"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] text-white text-[14px] font-semibold hover:shadow-[0_16px_40px_rgba(108,60,225,0.4)] transition-shadow"
            >
              Start free
              <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="#/pricing"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center px-8 py-4 rounded-full border border-white/[0.14] text-white/80 text-[14px] font-medium hover:bg-white/[0.06] transition-colors"
            >
              See pricing
            </motion.a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

export default function StudioPage() {
  return (
    <div className="bg-[#0A0A0F]">
      <StudioHero />
      <ServicesSection />
      <div className="section-divider" />
      <LanguageStrip />
      <DemoVideo />
      <div className="section-divider" />
      <WorkSection />
      <div className="section-divider" />
      <StatsSection />
      <div className="section-divider" />
      <TestimonialsSection />
      <div className="section-divider" />
      <FaqSection />
      <ClosingSection />
    </div>
  )
}
