import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Mail, ArrowRight, Globe, MessageCircle, Hash, Video, Users } from 'lucide-react'

const footerLinks = {
  Product: ['Voice Agents', 'Speech to Text', 'Text to Speech', 'Translations', 'Analytics'],
  'Use Cases': ['Customer Support', 'Sales', 'Onboarding', 'Healthcare', 'Education'],
  Resources: ['Documentation', 'API Reference', 'Blog', 'Case Studies', 'Status'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Security'],
}

const socialLinks = [
  { icon: Globe, href: '#', label: 'Website' },
  { icon: MessageCircle, href: '#', label: 'Chat' },
  { icon: Hash, href: '#', label: 'Social' },
  { icon: Video, href: '#', label: 'Video' },
  { icon: Users, href: '#', label: 'Community' },
]

export default function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [email, setEmail] = useState('')

  return (
    <footer id="enterprise" className="relative" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.98 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="display mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ready to Get <span style={{ color: 'var(--primary)' }}>Started?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="body-lg mb-8"
            style={{ color: 'var(--text-secondary)' }}
          >
            Join hundreds of companies already using ClearSpeak.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="max-w-lg mx-auto"
          >
            <p className="caption mb-3" style={{ color: 'var(--text-tertiary)' }}>Get started for free. No credit card required.</p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl caption"
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-10 mb-14">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
                <span className="text-white font-bold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>C</span>
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ClearSpeak</span>
            </div>
            <p className="caption leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              Enterprise-grade AI communication platform.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="caption mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="caption transition-colors duration-200" style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-tertiary)'}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
            © 2026 ClearSpeak. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, y: -1 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}
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
