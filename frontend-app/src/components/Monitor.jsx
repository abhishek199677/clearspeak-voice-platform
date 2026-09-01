import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, LogOut, ExternalLink, RefreshCw } from 'lucide-react'

const GRAFANA_URL = `${window.location.protocol}//${window.location.hostname}:3000/d/clearspeak-main/clearspeak-voice-platform?orgId=1&kiosk`

export default function Monitor() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem('clearspeak_admin')
    if (!auth) {
      navigate('/admin')
      return
    }
    setIsAuthenticated(true)
  }, [navigate])

  const handleLogout = () => {
    sessionStorage.removeItem('clearspeak_admin')
    navigate('/admin')
  }

  const handleReload = () => {
    setIsLoaded(false)
    const iframe = document.getElementById('grafana-iframe')
    if (iframe) {
      iframe.src = GRAFANA_URL
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="h-screen bg-[#0A0A0F] flex flex-col">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-14 bg-[#08080D]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-6 z-10"
      >
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white hidden sm:block">ClearSpeak</span>
          </a>
          <span className="text-gray-600 text-xs hidden sm:block">/</span>
          <span className="text-xs font-medium text-gray-400">Monitoring Dashboard</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReload}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href={`http://${window.location.hostname}:3000/d/clearspeak-main/clearspeak-voice-platform?orgId=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
            title="Open in Grafana"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </motion.header>

      <div className="flex-1 relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0F] z-10">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-[#6C3CE1]/30 border-t-[#6C3CE1] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        )}
        <iframe
          id="grafana-iframe"
          src={GRAFANA_URL}
          onLoad={() => setIsLoaded(true)}
          className="w-full h-full border-0"
          title="ClearSpeak Monitoring Dashboard"
          allow="fullscreen"
        />
      </div>
    </div>
  )
}
