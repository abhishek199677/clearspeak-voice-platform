import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#about' },
  { label: 'Languages', href: '#languages' },
  { label: 'Try Now', href: '#voice-chat' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-[#08080D]/80 backdrop-blur-xl border-b border-white/[0.04]' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-[72px]">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] sm:text-lg font-bold leading-tight">ClearSpeak</span>
              <span className="text-[9px] text-gray-500 leading-tight hidden sm:block">India's Voice Platform</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href="#voice-chat" className="px-5 py-2.5 text-[13px] font-medium text-gray-300 hover:text-white transition-colors duration-200">
              Try Demo
            </a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-full text-[13px] font-semibold hover:shadow-[0_12px_32px_rgba(108,60,225,0.3)] transition-all duration-300"
            >
              Get Started
            </motion.button>
          </div>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-50 bg-[#08080D]/95 backdrop-blur-xl border-b border-white/[0.06] lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-5 py-6">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-[15px] font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-4">
                <a href="#voice-chat" onClick={() => setIsMobileOpen(false)} className="block text-[15px] text-gray-400 hover:text-white">Try Demo</a>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-full text-[14px] font-semibold">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
