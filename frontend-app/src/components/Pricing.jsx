import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, ArrowRight, Zap, Building2, Rocket } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    icon: Rocket,
    description: 'Perfect for individuals and small projects',
    price: { monthly: 0, yearly: 0 },
    highlight: false,
    features: [
      '1,000 API calls/month',
      'Speech to Text',
      'Text to Speech',
      '5 languages',
      'Community support',
      'Basic analytics',
    ],
    cta: 'Start Free',
  },
  {
    name: 'Professional',
    icon: Zap,
    description: 'For growing teams and production apps',
    price: { monthly: 49, yearly: 39 },
    highlight: true,
    features: [
      '50,000 API calls/month',
      'Everything in Starter',
      'Voice Agents',
      '200+ languages',
      'Real-time streaming',
      'Priority support',
      'Advanced analytics',
      'Custom voice cloning',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Enterprise',
    icon: Building2,
    description: 'For organizations that need scale and security',
    price: { monthly: null, yearly: null },
    highlight: false,
    features: [
      'Unlimited API calls',
      'Everything in Professional',
      'Dedicated infrastructure',
      'SLA guarantee (99.99%)',
      'SOC 2 & HIPAA compliance',
      'Custom integrations',
      'Dedicated account manager',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
  },
]

export default function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section id="pricing" className="section-lg" style={{ background: 'var(--bg-surface)' }}>
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="overline-dot justify-center mb-4" style={{ color: 'var(--success)' }}>
            <span style={{ color: 'var(--success)' }}>Pricing</span>
          </div>
          <h2 className="heading-1 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Simple, Transparent{' '}
            <span style={{ color: 'var(--primary)' }}>Pricing</span>
          </h2>
          <p className="body-lg max-w-xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            Start free, scale as you grow. No hidden fees.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className="caption" style={{ color: !isYearly ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`pricing-toggle ${isYearly ? 'active' : ''}`}
            />
            <span className="caption" style={{ color: isYearly ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
              Yearly
              <span className="ml-1.5 text-[11px] font-semibold" style={{ color: 'var(--success)' }}>Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className={`relative group ${plan.highlight ? 'md:-mt-4 md:mb-[-16px]' : ''}`}
            >
              <div className={`relative h-full p-7 sm:p-8 rounded-[20px] ${plan.highlight ? 'card-featured' : 'card'}`} style={plan.highlight ? {
                background: 'var(--card-bg)',
                border: '1px solid var(--primary)',
              } : {}}>
                {/* Popular badge */}
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full text-[11px] font-semibold text-white" style={{ background: 'var(--primary)' }}>
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{
                    background: plan.highlight ? 'var(--primary)' : 'var(--input-bg)',
                  }}>
                    <plan.icon className="w-5 h-5" style={{ color: plan.highlight ? 'white' : 'var(--text-tertiary)' }} />
                  </div>
                  <h3 className="heading-3 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{plan.name}</h3>
                  <p className="caption" style={{ color: 'var(--text-tertiary)' }}>{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                  {plan.price.monthly === null ? (
                    <div className="mono text-3xl font-medium" style={{ color: 'var(--text-primary)' }}>Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="mono text-4xl font-medium" style={{ color: 'var(--text-primary)' }}>
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="caption" style={{ color: 'var(--text-tertiary)' }}>/mo</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: plan.highlight ? 'var(--primary)' : 'var(--success)' }} />
                      <span className="caption" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                    plan.highlight ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
