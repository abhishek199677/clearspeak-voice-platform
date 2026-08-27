import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'What languages does ClearSpeak support?',
    answer: 'ClearSpeak supports 200+ languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Hindi, and many more. Our AI models understand both romanized text and native scripts, preserving meaning and cultural context.',
  },
  {
    question: 'How does the voice cloning work?',
    answer: 'Our voice cloning uses advanced deep learning to analyze 30 seconds of audio, capturing your unique vocal characteristics, accent, and speaking style. The cloned voice can then speak any text in 200+ languages.',
  },
  {
    question: 'Is there a free plan?',
    answer: 'Yes! The Starter plan is free forever with 1,000 messages/month, 5 languages, and basic analytics. You can upgrade anytime.',
  },
  {
    question: 'How secure is my data?',
    answer: 'All data is encrypted end-to-end (E2EE). We are SOC 2 Type II and GDPR compliant. Your data is never used to train models without consent.',
  },
  {
    question: 'Can I integrate with existing tools?',
    answer: 'Absolutely! We offer REST API and webhooks for Slack, HubSpot, Salesforce, Zendesk, and more. SDKs available for Python, JavaScript, and Swift.',
  },
  {
    question: 'What is the latency for voice translation?',
    answer: 'Average latency is under 100ms for voice translation using edge computing and optimized ML models.',
  },
]

function FaqItem({ faq, index, isOpen, toggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-white/[0.06]"
    >
      <button
        onClick={toggle}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-[15px] font-medium text-white group-hover:text-[#6C3CE1] transition-colors pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          {isOpen ? (
            <Minus className="w-4 h-4 text-[#6C3CE1]" />
          ) : (
            <Plus className="w-4 h-4 text-gray-500" />
          )}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-[14px] text-gray-400 pb-5 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#00D4AA] font-semibold tracking-wider uppercase text-[11px]">FAQ</span>
          <h2 className="text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              toggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
