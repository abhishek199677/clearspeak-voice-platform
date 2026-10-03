import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const variants = {
  primary: 'bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] text-white hover:shadow-[0_12px_32px_rgba(108,60,225,0.35)] hover:shadow-[#6C3CE1]/25',
  orange: 'bg-gradient-to-r from-[#FF6B35] to-[#FF8F6B] text-white hover:shadow-[0_12px_32px_rgba(255,107,53,0.35)] hover:shadow-[#FF6B35]/25',
  accent: 'bg-gradient-to-r from-[#00D4AA] to-[#00F5C4] text-[#0A0A0F] hover:shadow-[0_12px_32px_rgba(0,212,170,0.35)] hover:shadow-[#00D4AA]/25',
  ghost: 'bg-white/[0.03] text-white border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12]',
  purple: 'bg-[#6C3CE1]/10 text-[#6C3CE1] border border-[#6C3CE1]/20 hover:bg-[#6C3CE1]/20',
}

const sizes = {
  sm: 'px-4 py-2 text-[12px]',
  md: 'px-6 py-3 text-[14px]',
  lg: 'px-8 py-4 text-[16px]',
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function PremiumCard({ children, className = '', glow = true, ...props }) {
  return (
    <div className={`relative ${glow ? 'gradient-border' : ''} ${className}`} {...props}>
      <div className="glass-card rounded-[20px] p-6 h-full">
        {children}
      </div>
    </div>
  )
}

export function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-[#6C3CE1]/10 text-[#6C3CE1]',
    orange: 'bg-[#FF6B35]/10 text-[#FF6B35]',
    green: 'bg-[#00D4AA]/10 text-[#00D4AA]',
    purple: 'bg-[#E040FB]/10 text-[#E040FB]',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${styles[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function AnimatedNumber({ value, suffix = '', prefix = '' }) {
  const [display, setDisplay] = useState(0)
  
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplay(value)
        clearInterval(interval)
      } else {
        setDisplay(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [value])

  return <span>{prefix}{display}{suffix}</span>
}