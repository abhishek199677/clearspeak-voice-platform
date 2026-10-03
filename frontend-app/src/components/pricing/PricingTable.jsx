import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Lock, FileText, Shield, Users, Headphones, Clock, Zap } from 'lucide-react'
import { useState } from 'react'

export default function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Professional',
      price: isAnnual ? '$490' : '$49',
      period: isAnnual ? 'per user/year (2 months free)' : 'per user/month',
      description: 'Perfect for small teams and professionals',
      features: [
        'Real-time translation (100 languages)',
        'Voice calls with AI enhancement',
        'Basic analytics dashboard',
        'Email support',
        'Up to 1000 monthly minutes',
      ],
      isPopular: false,
      color: 'primary',
    },
    {
      name: 'Enterprise',
      price: isAnnual ? '$1990' : '$199',
      period: isAnnual ? 'per user/year (2 months free)' : 'per user/month',
      description: 'Designed for growing businesses',
      features: [
        'Real-time translation (200+ languages)',
        'Voice cloning with lip sync',
        'Advanced analytics & reporting',
        'Priority support (24/7)',
        'Unlimited monthly minutes',
        'Custom AI agents',
        'SSO & SAML integration',
        'API access',
      ],
      isPopular: true,
      color: 'accent',
    },
    {
      name: 'Enterprise Plus',
      price: isAnnual ? '$3990' : '$399',
      period: isAnnual ? 'per user/year (2 months free)' : 'per user/month',
      description: 'For large organizations with complex needs',
      features: [
        'Everything in Enterprise, plus:',
        'Dedicated account manager',
        'Custom SLA & uptime guarantees',
        'On-premise deployment options',
        'Advanced security & compliance',
        'Custom AI model training',
        'White-label solutions',
        'Multi-tenancy management',
        'Dedicated infrastructure',
      ],
      isPopular: false,
      color: 'destructive',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="space-y-8 overflow-x-hidden"
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="text-center mb-12"
      >
        <span className="text-primary font-semibold tracking-wider uppercase text-[11px]">Pricing Plans</span>
        <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold mt-4 mb-4 tracking-tight">
          Choose Your Plan
        </h2>
        <p className="text-[17px] text-gray-400 max-w-2xl mx-auto">
          Flexible pricing for teams of all sizes. All plans include core ClearSpeak AI features.
        </p>

        {/* Billing Toggle */}
        <div className="mt-6 flex items-center justify-center">
          <span className="text-sm text-gray-500 mr-3">Billing Cycle:</span>
          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-white/[0.05]">
            <span
              onClick={() => setIsAnnual(false)}
              className={`px-3 py-1 rounded-lg text-sm font-medium
                         ${isAnnual ? 'text-white bg-primary/20' : 'text-white bg-primary/60'}`}
            >
              Monthly
            </span>
            <span
              onClick={() => setIsAnnual(true)}
              className={`px-3 py-1 rounded-lg text-sm font-medium
                         ${isAnnual ? 'text-white bg-primary/60' : 'text-white bg-primary/20'}`}
            >
              Annual
            </span>
            <span className="absolute left-0 top-0 h-6 w-11 bg-primary/20 rounded-full
                           transform transition-transform duration-200
                           ${isAnnual ? 'translate-x-5' : 'translate-x-0'}">
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="grid gap-6 md:grid-cols-1 lg:grid-cols-3"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`relative group`}
          >
            <Card className={`h-full border-${plan.color}/50 bg-${plan.color}/5
                              hover:border-${plan.color}/100 hover:bg-${plan.color}/10
                              transition-all duration-300
                              ${plan.isPopular ? 'border-[plan.color]/100 bg-[plan.color]/10 shadow-[0_0_20px_rgba(108,60,225,0.3)]' : ''}`}>
              {plan.isPopular && (
                <Badge
                  variant="outline"
                  className="absolute -top-3 left-3 bg-[plan.color]/20 text-[plan.color]-foreground font-medium px-3 py-1 rounded-full text-xs"
                >
                  Most Popular
                </Badge>
              )}
              <CardHeader className="pb-6">
                <CardTitle className={`text-[plan.color]-foreground font-bold text-[1.5rem]`}>
                  {plan.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-2">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[plan.color]-foreground">{plan.price}</span>
                  <span className="text-xs text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-4 h-4 text-[plan.color]-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </motion.div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full bg-[plan.color]-foreground text-[plan.color]
                             hover:bg-[plan.color]/90
                             hover:shadow-[0_0_15px_rgba(108,60,225,0.2)]
                             transition-all duration-300`}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="border-t border-muted/50 pt-8"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <h3 className="text-lg font-bold text-primary">Trusted by Industry Leaders</h3>
            <div className="flex items-center justify-center mt-4 space-x-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center"
              >
                <Shield className="w-8 h-8 text-primary" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center"
              >
                <Users className="w-8 h-8 text-accent" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-16 h-16 bg-success/20 rounded-lg flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-success" />
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Join 10,000+ companies using ClearSpeak AI for global communication
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-accent">Security & Compliance</h3>
            <div className="flex items-center justify-center mt-4 space-x-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center"
              >
                <Lock className="w-8 h-8 text-accent" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-primary" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-16 h-16 bg-muted/20 rounded-lg flex items-center justify-center"
              >
                <FileText className="w-8 h-8 text-muted" />
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              SOC 2 Type II, GDPR, HIPAA compliant with enterprise-grade security
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-success">Support & SLAs</h3>
            <div className="flex items-center justify-center mt-4 space-x-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-16 h-16 bg-success/20 rounded-lg flex items-center justify-center"
              >
                <Headphones className="w-8 h-8 text-success" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center"
              >
                <Clock className="w-8 h-8 text-accent" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center"
              >
                <Zap className="w-8 h-8 text-primary" />
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              24/7 expert support with 99.9% uptime SLA and &lt;15min response time
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}