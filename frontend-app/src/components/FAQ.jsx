import { useState } from 'react'
import { Sparkles, Cpu, Sliders, Volume2, ShieldCheck, Globe } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionStreamingContent,
  AccordionTrigger,
} from '@/components/ui/accordion-generative-utils/accordion'

const clearspeakAnswers = [
  {
    value: 'languages',
    question: 'What languages does ClearSpeak support?',
    icon: Globe,
    answer:
      'ClearSpeak supports all 22 Scheduled Languages of India (Hindi, Tamil, Telugu, Bengali, Kannada, Marathi, Gujarati, etc.) plus 200+ global languages. Our multilingual transformer models process both native Unicode scripts and romanized phonetic inputs with cultural sentiment preservation.',
  },
  {
    value: 'latency',
    question: 'What is the end-to-end latency for voice translation?',
    icon: Volume2,
    answer:
      'End-to-end voice-to-voice translation averages sub-300ms. By streaming PCM audio chunks through WebSocket pipelines directly into edge-accelerated Whisper and neural synthesis models, conversations maintain natural, human conversational cadence.',
  },
  {
    value: 'cloning',
    question: 'How does instantaneous voice cloning work?',
    icon: Sparkles,
    answer:
      'Send 30 seconds of clean reference audio. Our deep neural acoustic encoders isolate fundamental timbre, pitch range, and cadence style tokens, enabling the cloned persona to converse dynamically across 200+ languages with synchronized lip-sync metadata.',
  },
  {
    value: 'security',
    question: 'How is enterprise voice and transcript data protected?',
    icon: ShieldCheck,
    answer:
      'ClearSpeak operates under a strict Zero Data Retention (ZDR) policy. Audio packets and transcripts are processed ephemerally in RAM and never stored or retained for model training. Architected for SOC 2 Type II, ISO 27001, EU GDPR, and India DPDP Act 2023 compliance with TLS 1.3 in-flight and AES-256 at rest.',
  },
  {
    value: 'integration',
    question: 'Can ClearSpeak integrate with our enterprise contact center?',
    icon: Cpu,
    answer:
      'Yes. ClearSpeak provides drop-in SIP/WebRTC trunking, REST APIs, WebSocket streaming endpoints, and pre-built connectors for Genesys, Twilio, Zendesk, Salesforce, and HubSpot. Native SDKs are provided for Python, JavaScript, and iOS/Android.',
  },
]

const generativeAnswers = [
  {
    value: 'what',
    question: 'What does this component do?',
    answer:
      'It streams the answer in one character at a time, the way a model writes it. The panel opens to the height of the finished text first, so nothing below it jumps while the words arrive.',
  },
  {
    value: 'how',
    question: 'How is the effect built?',
    answer:
      'A timer reveals a growing slice of the string while a caret trails the last character. The full text sits underneath at zero visibility to reserve the space, and it is the copy a screen reader reads.',
  },
  {
    value: 'speed',
    question: 'Can I change the pace?',
    answer:
      'Yes. Set speed for milliseconds per character and startDelay for the pause before the first word. Punctuation adds a beat on its own, and a reduced-motion preference skips straight to the finished answer.',
  },
]

export default function FAQ() {
  const [activeTab, setActiveTab] = useState('clearspeak')
  const [speed, setSpeed] = useState(12)

  const currentList = activeTab === 'clearspeak' ? clearspeakAnswers : generativeAnswers

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#0A0A0F]">
      {/* Background glow accents */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[#FF6B35]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Generative Intelligence FAQ
          </div>
          <h2 className="text-[2.25rem] sm:text-[3rem] font-bold text-white tracking-tight">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-violet-400 via-[#9B6DFF] to-[#FF6B35] bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Experience real-time AI streaming disclosure. Responses generate dynamically with full layout stability and zero layout shift.
          </p>
        </div>

        {/* Tab & Speed Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#0E0E15]/90 border border-white/[0.08] p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('clearspeak')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'clearspeak'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              ClearSpeak Enterprise AI
            </button>
            <button
              onClick={() => setActiveTab('generative')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'generative'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Component Architecture
            </button>
          </div>

          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <Sliders className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs text-neutral-400">Pace:</span>
            <div className="flex items-center gap-1.5">
              {[8, 12, 20].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    speed === s
                      ? 'bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {s === 8 ? 'Fast' : s === 12 ? 'Normal' : 'Slow'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generative Accordion */}
        <Accordion
          key={`${activeTab}-${speed}`}
          type="single"
          collapsible
          variant="card"
          defaultValue={currentList[0]?.value}
          className="w-full space-y-3"
        >
          {currentList.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>
                <span className="flex items-center gap-3">
                  <Sparkles
                    aria-hidden="true"
                    className="size-4 shrink-0 text-violet-500 dark:text-violet-400"
                    strokeWidth={2}
                  />
                  <span className="text-left font-medium text-white/90 group-hover:text-white transition-colors">
                    {item.question}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionStreamingContent text={item.answer} speed={speed} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export { AccordionGenerativeDemo } from './AccordionGenerativeDemo'
