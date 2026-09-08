import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, Sun, Moon } from 'lucide-react'
import { useTheme } from '../ThemeContext'

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Languages', href: '#languages' },
  { label: 'Chat', path: '/chat' },
  { label: 'Calls', path: '/calls' },
  { label: 'Agents', path: '/agents' },
  { label: 'Streams', path: '/streams' },
  { label: 'Hub', path: '/productivity' },
  { label: 'Try Now', href: '#voice-chat' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'backdrop-blur-xl border-b' : 'bg-transparent'
        }`}
        style={{
          backgroundColor: isScrolled ? 'var(--bg-overlay)' : 'transparent',
          borderColor: isScrolled ? 'var(--border-subtle)' : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-[72px]">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] sm:text-lg font-bold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>ClearSpeak</span>
              <span className="text-[9px] leading-tight hidden sm:block" style={{ color: 'var(--text-tertiary)' }}>India's Voice Platform</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => item.path ? (
              <Link
                key={item.label}
                to={item.path}
                className="caption"
                style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="caption"
                style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="btn-ghost"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/admin"
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
            >
              Monitor
            </Link>
            <a href="#voice-chat" className="btn-ghost" style={{ fontSize: '0.8125rem' }}>
              Try Demo
            </a>
            <button className="btn-primary" style={{ padding: '0.625rem 1.25rem', fontSize: '0.8125rem' }}>
              Get Started
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2"
              style={{ color: 'var(--text-secondary)' }}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-50 backdrop-blur-xl border-b lg:hidden"
            style={{
              backgroundColor: 'var(--bg-overlay)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="max-w-7xl mx-auto px-5 py-6">
              <div className="space-y-4">
                {navItems.map((item) => item.path ? (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className="block body"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block body"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-6 pt-6 space-y-4" style={{ borderTop: '1px solid var(--border)' }}>
                <Link
                  to="/admin"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-2 body"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Monitor
                </Link>
                <a href="#voice-chat" onClick={() => setIsMobileOpen(false)} className="block body" style={{ color: 'var(--text-secondary)' }}>
                  Try Demo
                </a>
                <button className="btn-primary w-full justify-center">
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
