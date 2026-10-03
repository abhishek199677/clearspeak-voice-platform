import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Phone, PhoneOff, Video, VideoOff, Mic, MicOff,
  ScreenShare, Users, Clock, Signal, MoreVertical,
  Copy, Headphones, Globe, ArrowLeft, Sparkles,
  Cpu, Wifi, Lock, Sliders,
} from 'lucide-react'
// Shadcn/ui imports
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

const SIMULATED_CALLS = [
  { id: 1, name: 'Team Standup', participants: 5, duration: '12:34', type: 'video', active: true },
  { id: 2, name: 'Client Call', participants: 2, duration: '08:21', type: 'voice', active: true },
  { id: 3, name: 'Product Demo', participants: 8, duration: '24:15', type: 'video', active: false },
  { id: 4, name: 'Language Practice', participants: 3, duration: '05:47', type: 'voice', active: true },
]

export default function CallsInterface() {
  const [activeCall, setActiveCall] = useState(null)
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  const [duration, setDuration] = useState(0)
  const [callUsers, setCallUsers] = useState([])
  const mediaRef = useRef(null)

  useEffect(() => {
    let interval
    if (activeCall) {
      interval = setInterval(() => setDuration(d => d + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [activeCall])

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  function startCall(call) {
    setActiveCall(call)
    setDuration(0)
    setMuted(false)
    setVideoOff(false)
    setScreenSharing(false)
    setCallUsers(Array(call.participants).fill(null).map((_, i) => ({
      id: i,
      name: `User ${i + 1}`,
      speaking: i === 0,
      videoOn: true,
    })))
  }

  function endCall() {
    setActiveCall(null)
    setDuration(0)
  }

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-dark-light" />
      <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-[#FF6B35]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#6C3CE1] font-semibold tracking-wider uppercase text-[11px]">Voice & Video</span>
          <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            <span className="gradient-text">Crystal Clear Calls.</span>
            <br />
            <span className="text-white">No Latency. No Boundaries.</span>
          </h2>
          <p className="text-[17px] text-gray-400 max-w-2xl mx-auto">
            HD voice and video calls with real-time translation, screen sharing, and AI noise cancellation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Call View */}
          {activeCall && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white/[0.02] border border-white/[0.06] rounded-[24px] overflow-hidden">
                <CardContent className="p-0">
                  {/* Video Grid */}
                  <div className="relative bg-[#0A0A0F] aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center mx-auto mb-3">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-[14px] text-gray-400">{activeCall.name}</p>
                        <p className="text-[12px] text-gray-600">{formatTime(duration)}</p>
                      </div>
                    </div>

                    {/* Participant Tiles */}
                    <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-2">
                      {callUsers.slice(0, 6).map((user, i) => (
                        <div key={i} className="w-20 h-16 bg-white/[0.04] border border-white/[0.06] rounded-lg flex items-center justify-center relative">
                          <Users className="w-5 h-5 text-gray-600" />
                          <span className="absolute bottom-0.5 text-[8px] text-gray-500">{user.name}</span>
                          {!user.videoOn && (
                            <div className="absolute inset-0 bg-black/40 rounded-lg flex_items-center justify-center">
                              <VideoOff className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                      {callUsers.length > 6 && (
                        <div className="w-20 h-16 bg-white/[0.04] border border-white/[0.06] rounded-lg flex_items-center justify-center">
                          <span className="text-[11px] text-gray-400">+{callUsers.length - 6}</span>
                        </div>
                      )}
                    </div>

                    {/* Live Badge */}
                    <div className="absolute top-4 left-4 flex_items-center gap-2 px-3 py-1.5">
                      <Badge variant="destructive" className="text-[11px] px-3 py-1.5">
                        Live • {formatTime(duration)}
                      </Badge>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex_items-center justify-center gap-3 p-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMuted(!muted)}
                      className={`${muted ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-white/[0.08] hover:bg-white/[0.12]'}`}
                    >
                      {muted ? <MicOff className="w-5 h-5 text-red-400" /> : <Mic className="w-5 h-5 text-white" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setVideoOff(!videoOff)}
                      className={`${videoOff ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-white/[0.08] hover:bg-white/[0.12]'}`}
                    >
                      {videoOff ? <VideoOff className="w-5 h-5 text-red-400" /> : <Video className="w-5 h-5 text-white" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setScreenSharing(!screenSharing)}
                      className={`${screenSharing ? 'bg-[#6C3CE1]/30' : 'bg-white/[0.08] hover:bg-white/[0.12]'}`}
                    >
                      <ScreenShare className="w-5 h-5 text-white" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Headphones className="w-5 h-5 text-white" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Sliders className="w-5 h-5 text-white" />
                    </Button>
                    <Button
                      onClick={endCall}
                      className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-500/30"
                    >
                      <PhoneOff className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Call List */}
          <div className="space-y-3">
            {SIMULATED_CALLS.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className={`flex items-center gap-4 p-4 hover:bg-white/[0.04] transition-all cursor-pointer ${
                  activeCall?.id === call.id ? 'border-[#6C3CE1]/30' : 'border-white/[0.04]'
                }`}
                onClick={() => startCall(call)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    call.type === 'video' ? 'bg-[#6C3CE1]/20' : 'bg-[#FF6B35]/20'
                  }`}>
                    {call.type === 'video' ? (
                      <Video className="w-5 h-5 text-[#6C3CE1]" />
                    ) : (
                      <Phone className="w-5 h-5 text-[#FF6B35]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-white truncate">{call.name}</span>
                      {call.active && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{call.participants} participants</span>
                      <Clock className="w-3 h-3 ml-1" />
                      <span>{call.duration}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="p-2">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Call Features */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-semibold text-white mb-4">Call Features</h3>
            {[
              { icon: Cpu, title: 'AI Noise Cancellation', desc: 'Remove background noise in real-time', color: 'from-[#6C3CE1] to-[#9B6DFF]' },
              { icon: Globe, title: 'Live Translation', desc: 'Translate calls across 200+ languages', color: 'from-[#FF6B35] to-[#FF8F6B]' },
              { icon: Wifi, title: 'Ultra Low Latency', desc: 'Sub-50ms latency for natural conversation', color: 'from-[#00D4AA] to-[#00F5C4]' },
              { icon: Lock, title: 'End-to-End Encrypted', desc: 'Military-grade encryption for privacy', color: 'from-[#E040FB] to-[#F060FF]' },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 hover:bg-white/[0.04] transition-all">
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${feat.color} flex items-center justify-center`}>
                        <feat.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-medium text-white">{feat.title}</h4>
                        <p className="text-[11px] text-gray-500">{feat.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}