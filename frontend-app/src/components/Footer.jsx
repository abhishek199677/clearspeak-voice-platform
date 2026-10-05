import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, ArrowRight, Globe, MessageCircle, Hash, Video, Users, ExternalLink } from 'lucide-react'
import { getApiBaseUrl } from '@/api/platform'

// Every footer link points at a real route. Product items map to their product
// pages; everything else renders the content page in src/data/footerPages.js.
const footerLinks = {
  Product: [
    { label: 'Voice Agents', href: '#/agents' },
    { label: 'Speech to Text', href: '#/speech' },
    { label: 'Text to Speech', href: '#/voice' },
    { label: 'Translations', href: '#/speech-to-speech' },
    { label: 'Analytics', href: '#/analytics' },
    { label: 'Voice Cloning', href: '#/clone' },
    { label: 'Live Streaming', href: '#/live' },
    { label: 'Sign Language', href: '#/accessibility' },
    { label: 'Spatial Awareness', href: '#/spatial' },
    { label: 'Product Demo', href: '#/demo' },
  ],
  'Use Cases': [
    { label: 'Customer Support', href: '#/use-cases/customer-support' },
    { label: 'Sales', href: '#/use-cases/sales' },
    { label: 'Marketing', href: '#/use-cases/marketing' },
    { label: 'Onboarding', href: '#/use-cases/onboarding' },
    { label: 'Healthcare', href: '#/use-cases/healthcare' },
    { label: 'Education', href: '#/use-cases/education' },
    { label: 'Enterprise Solutions', href: '#/enterprise' },
  ],
  Resources: [
    { label: 'Documentation', href: '#/resources/documentation' },
    { label: 'API Reference', href: `${getApiBaseUrl()}/docs`, external: true },
    { label: 'Blog', href: '#/resources/blog' },
    { label: 'Case Studies', href: '#/resources/case-studies' },
    { label: 'Whitepapers', href: '#/resources/whitepapers' },
    { label: 'Webinars', href: '#/resources/webinars' },
    { label: 'Status', href: '#/resources/status' },
    { label: 'Developer Hub', href: '#/resources/developer-hub' },
  ],
  Company: [
    { label: 'About Us', href: '#/company/about' },
    { label: 'Careers', href: '#/company/careers' },
    { label: 'Partners', href: '#/company/partners' },
    { label: 'News', href: '#/company/news' },
    { label: 'Investor Relations', href: '#/company/investor-relations' },
    { label: 'Enterprise', href: '#/enterprise' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#/legal/privacy-policy' },
    { label: 'Terms of Service', href: '#/legal/terms-of-service' },
    { label: 'Cookie Policy', href: '#/legal/cookie-policy' },
    { label: 'GDPR', href: '#/legal/gdpr' },
    { label: 'Security', href: '#/security' },
    { label: 'Compliance', href: '#/compliance' },
    { label: 'SOC 2', href: '#/legal/soc-2' },
  ],
}

const socialLinks = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: MessageCircle, href: '#', label: 'Chat' },
  { icon: Hash, href: '#', label: 'Twitter/X' },
  { icon: Video, href: '#', label: 'YouTube' },
  { icon: Users, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [email, setEmail] = useState('')

  return (
    <footer id="enterprise" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-[2.5rem] sm:text-[3.5rem] lg:text-[5rem] font-bold mb-5 tracking-tight"
          >
            Ready to Get <span className="gradient-text">Started?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-[15px] sm:text-[17px] text-gray-400 mb-8"
          >
            Join hundreds of companies already using ClearSpeak.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="max-w-lg mx-auto"
          >
            <p className="text-[13px] text-gray-500 mb-3">Get started for free. No credit card required.</p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[14px] text-white placeholder-gray-600 focus:outline-none transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="px-7 py-3.5 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-xl text-[14px] font-semibold flex items-center gap-2 hover:shadow-[0_12px_32px_rgba(108,60,225,0.3)] transition-all duration-300"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10 mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-bold">ClearSpeak</span>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Enterprise-grade AI communication platform.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-[13px] text-white mb-4 uppercase tracking-wider">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noreferrer' : undefined}
                      className="text-[13px] text-gray-500 hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      {link.label}
                      {link.external && <ExternalLink className="w-3 h-3 shrink-0" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.06] pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-gray-600">
            © 2026 ClearSpeak. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, y: -1 }}
                className="w-8 h-8 bg-white/[0.04] border border-white/[0.06] rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                aria-label={social.label}
              >
                <social.icon className="w-3.5 h-3.5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
