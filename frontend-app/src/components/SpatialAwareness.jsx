import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Navigation, Compass, AlertTriangle, Clock,
  MapPin, Volume2, Brain, Shield, Zap,
  Coffee, Heart, Target, ArrowRight,
} from 'lucide-react'

const SPATIAL_OBJECTS = [
  { name: 'Coffee Shop', type: 'food', distance: '50m', x: 20, y: 30 },
  { name: 'Hospital', type: 'medical', distance: '200m', x: 60, y: 20 },
  { name: 'Bus Stop', type: 'transport', distance: '100m', x: 45, y: 55 },
  { name: 'ATM', type: 'finance', distance: '150m', x: 70, y: 70 },
  { name: 'Pharmacy', type: 'medical', distance: '80m', x: 30, y: 65 },
  { name: 'Park', type: 'leisure', distance: '300m', x: 80, y: 40 },
]

const VOICE_COMMANDS = [
  { command: 'What\'s nearby?', action: 'Lists nearby objects', icon: Compass },
  { command: 'Find hospital', action: 'Navigates to nearest hospital', icon: AlertTriangle },
  { command: 'Go back', action: 'Returns to previous location', icon: ArrowRight },
  { command: 'Describe surroundings', action: 'Audio description of area', icon: Volume2 },
]

export default function SpatialAwareness() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [nearby, setNearby] = useState([])
  const [commandHistory, setCommandHistory] = useState([])

  function handleVoiceCommand(cmd) {
    const newHistory = [...commandHistory, { command: cmd, time: new Date().toLocaleTimeString() }]
    setCommandHistory(newHistory.slice(-5))

    // Simulate movement
    if (cmd.includes('back')) {
      setPosition({ x: Math.max(10, position.x - 15), y: position.y })
    } else {
      setPosition({ x: Math.min(90, position.x + 15), y: Math.max(10, position.y - 10) })
    }

    // Find nearby objects
    const found = SPATIAL_OBJECTS.filter(obj => {
      const dist = Math.sqrt((obj.x - position.x) ** 2 + (obj.y - position.y) ** 2)
      return dist < 25
    })
    setNearby(found)
  }

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-[#6C3CE1]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#6C3CE1] font-semibold tracking-wider uppercase text-[11px]">Spatial Awareness</span>
          <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            <span className="gradient-text">Navigate the World.</span>
            <br />
            <span className="text-white">For Everyone.</span>
          </h2>
          <p className="text-[17px] text-gray-400 max-w-2xl mx-auto">
            AI-powered spatial awareness system helping visually impaired users navigate independently with real-time audio feedback.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Spatial Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-white">Live Spatial Map</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[11px] text-green-500">Active</span>
              </div>
            </div>

            <div className="relative bg-[#0A0A0F] rounded-xl aspect-square overflow-hidden border border-white/[0.04]">
              {/* Grid */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }} />

              {/* Spatial Objects */}
              {SPATIAL_OBJECTS.map((obj, i) => {
                const colors = { food: '#FF6B35', medical: '#E040FB', transport: '#6C3CE1', finance: '#FFD700', leisure: '#00D4AA' }
                return (
                  <motion.div
                    key={obj.name}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="absolute flex flex-col items-center cursor-pointer"
                    style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${colors[obj.type]}20`, border: `1px solid ${colors[obj.type]}40` }}
                    >
                      <MapPin className="w-4 h-4" style={{ color: colors[obj.type] }} />
                    </div>
                    <span className="text-[8px] text-gray-500 mt-1 whitespace-nowrap">{obj.name}</span>
                  </motion.div>
                )
              })}

              {/* User Position */}
              <motion.div
                className="absolute w-6 h-6 rounded-full bg-[#6C3CE1] border-2 border-white flex items-center justify-center shadow-lg shadow-[#6C3CE1]/50 z-10"
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Navigation className="w-3 h-3 text-white" />
              </motion.div>

              {/* Radius */}
              <div className="absolute w-20 h-20 rounded-full border border-[#6C3CE1]/20" style={{ left: `${position.x - 10}%`, top: `${position.y - 10}%` }} />
              <div className="absolute w-36 h-36 rounded-full border border-[#6C3CE1]/10" style={{ left: `${position.x - 18}%`, top: `${position.y - 18}%` }} />
            </div>

            {/* Nearby Objects */}
            {nearby.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-[#6C3CE1]/10 border border-[#6C3CE1]/20 rounded-xl"
              >
                <div className="text-[11px] text-[#6C3CE1] font-medium mb-1">Nearby Objects</div>
                <div className="flex flex-wrap gap-2">
                  {nearby.map((obj) => (
                    <span key={obj.name} className="px-2 py-1 bg-white/[0.04] rounded text-[11px] text-white">
                      {obj.name} ({obj.distance})
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Voice Commands */}
          <div className="space-y-4">
            <h3 className="text-[15px] font-semibold text-white mb-2">Voice Commands</h3>
            {VOICE_COMMANDS.map((vc, i) => (
              <motion.div
                key={vc.command}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/[0.04] transition-all"
                onClick={() => handleVoiceCommand(vc.command)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#6C3CE1]/10 flex items-center justify-center">
                    <vc.icon className="w-4 h-4 text-[#6C3CE1]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-white">"{vc.command}"</div>
                    <div className="text-[11px] text-gray-500">{vc.action}</div>
                  </div>
                  <Volume2 className="w-4 h-4 text-gray-600" />
                </div>
              </motion.div>
            ))}

            {/* Command History */}
            {commandHistory.length > 0 && (
              <div className="mt-6 p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                <h4 className="text-[12px] text-gray-500 uppercase tracking-wider font-semibold mb-3">Recent Commands</h4>
                <div className="space-y-2">
                  {commandHistory.map((cmd, i) => (
                    <div key={i} className="flex items-center justify-between text-[12px]">
                      <span className="text-gray-300">{cmd.command}</span>
                      <span className="text-gray-600">{cmd.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { label: 'Objects Detected', value: SPATIAL_OBJECTS.length, icon: Target, color: '#00D4AA' },
                { label: 'Accuracy', value: '98.2%', icon: Brain, color: '#6C3CE1' },
                { label: 'Uptime', value: '99.9%', icon: Shield, color: '#FF6B35' },
                { label: 'Latency', value: '<50ms', icon: Zap, color: '#E040FB' },
              ].map((stat, i) => (
                <div key={stat.label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                    <span className="text-[11px] text-gray-500">{stat.label}</span>
                  </div>
                  <div className="text-[18px] font-bold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}