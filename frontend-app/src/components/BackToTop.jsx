import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsVisible(latest > 500)
    })
    return () => unsubscribe()
  }, [scrollY])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[#6C3CE1] to-[#FF6B35] rounded-full flex items-center justify-center shadow-xl shadow-purple-500/30 z-40"
    >
      <ArrowUp className="w-6 h-6 text-white" />
    </motion.button>
  )
}
