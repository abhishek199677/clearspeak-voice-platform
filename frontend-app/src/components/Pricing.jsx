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
    gradient: 'from-gray-500 to-gray-600',
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
    gradient: 'from-[#6C3CE1] to-[#9B6DFF]',
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
    gradient: 'from-[#FF6B35] to-[#FF8F6B]',
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
    <section id="pricing" className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      {/* Background blobs */}
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-[#6C3CE1]/5 rounded-full blur-[120px] gradient-blob" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-[#FF6B35]/4 rounded-full blur-[100px] gradient-blob-delayed" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-[#00D4AA] font-semibold tracking-wider uppercase text-[11px]">Pricing</span>
          <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Simple, Transparent{' '}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
            Start free, scale as you grow. No hidden fees.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-[13px] font-medium transition-colors ${!isYearly ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`pricing-toggle ${isYearly ? 'active' : ''}`}
            />
            <span className={`text-[13px] font-medium transition-colors ${isYearly ? 'text-white' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-1.5 text-[11px] text-[#00D4AA] font-semibold">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className={`relative group ${plan.highlight ? 'md:-mt-4 md:mb-[-16px]' : ''}`}
            >
              {/* Highlight glow */}
              {plan.highlight && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#6C3CE1]/15 to-transparent rounded-[24px] blur-[2px]" />
              )}

              <div className={`relative h-full glass-card rounded-[20px] p-7 sm:p-8 ${
                plan.highlight ? 'border-[#6C3CE1]/30 bg-white/[0.03]' : ''
              }`}>
                {/* Popular badge */}
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-full text-[11px] font-semibold text-white shadow-lg shadow-[#6C3CE1]/30">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                    <plan.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[18px] font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-[13px] text-gray-500">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/[0.06]">
                  {plan.price.monthly === null ? (
                    <div className="text-[32px] font-bold text-white">Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-[36px] font-bold text-white">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-[14px] text-gray-500">/mo</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-[#6C3CE1]' : 'text-[#00D4AA]'}`} />
                      <span className="text-[13px] text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] text-white hover:shadow-[0_12px_32px_rgba(108,60,225,0.3)]'
                      : 'glass-strong text-white hover:bg-white/[0.08]'
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
