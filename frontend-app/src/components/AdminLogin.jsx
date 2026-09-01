import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, Eye, EyeOff, ArrowRight } from 'lucide-react'

const VALID_CREDENTIALS = { username: 'admin', password: 'admin123' }

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 500))

    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      sessionStorage.setItem('clearspeak_admin', 'true')
      navigate('/admin/dashboard')
    } else {
      setError('Invalid credentials. Please try again.')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold leading-tight text-white">ClearSpeak</span>
              <span className="text-[10px] text-gray-500 leading-tight">Monitoring Portal</span>
            </div>
          </a>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to access the monitoring dashboard</p>
        </div>

        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#0A0A0F] border border-white/[0.08] rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#6C3CE1]/50 focus:ring-1 focus:ring-[#6C3CE1]/30 transition-all"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0A0A0F] border border-white/[0.08] rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#6C3CE1]/50 focus:ring-1 focus:ring-[#6C3CE1]/30 transition-all pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-[0_12px_32px_rgba(108,60,225,0.3)] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          <a href="/" className="hover:text-gray-300 transition-colors">
            Back to Home
          </a>
        </p>
      </motion.div>
    </div>
  )
}
