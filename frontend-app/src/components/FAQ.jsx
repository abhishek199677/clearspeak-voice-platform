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

function FaqItem({ faq, isOpen, toggle }) {
  return (
    <div className="accordion-item">
      <button
        onClick={toggle}
        className="accordion-trigger"
      >
        <span style={{ color: isOpen ? 'var(--primary)' : 'var(--text-primary)' }}>{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          {isOpen ? (
            <Minus className="w-4 h-4" style={{ color: 'var(--primary)' }} />
          ) : (
            <Plus className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
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
            <p className="body pb-5" style={{ color: 'var(--text-secondary)' }}>{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="section-lg" style={{ background: 'var(--bg)' }}>
      <div ref={ref} className="max-w-3xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="overline-dot justify-center mb-4" style={{ color: 'var(--success)' }}>
            <span style={{ color: 'var(--success)' }}>FAQ</span>
          </div>
          <h2 className="heading-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Frequently Asked{' '}
            <span style={{ color: 'var(--primary)' }}>Questions</span>
          </h2>
        </motion.div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
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
