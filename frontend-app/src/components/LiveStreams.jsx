import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Play, Pause, Heart, MessageCircle, Share2,
  Users, Clock, Gift, Star, Zap, Crown,
  Volume2, VideoOff, Phone, MoreVertical,
  Coffee, Sparkles, Radio, TrendingUp,
} from 'lucide-react'
// Shadcn/ui imports
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LIVE_STREAMS = [
  { id: 1, title: 'Hindi Poetry Night', host: 'Priya M.', viewers: 1240, avatar: 'P', category: 'Literature', live: true, duration: '2h 15m' },
  { id: 2, title: 'Tamil Tech Talk', host: 'Arjun R.', viewers: 856, avatar: 'A', category: 'Technology', live: true, duration: '45m' },
  { id: 3, title: 'Bengali Cooking Live', host: 'Sunita D.', viewers: 2340, avatar: 'S', category: 'Food', live: true, duration: '1h 30m' },
  { id: 4, title: 'Kannada Music Session', host: 'Ravi K.', viewers: 567, avatar: 'R', category: 'Music', live: false, duration: '' },
  { id: 5, title: 'Telugu Dance Class', host: 'Meera L.', viewers: 432, avatar: 'M', category: 'Fitness', live: true, duration: '30m' },
  { id: 6, title: 'Marathi Storytelling', host: 'Vikram S.', viewers: 923, avatar: 'V', category: 'Entertainment', live: false, duration: '' },
  { id: 7, title: 'Gujarati Art Workshop', host: 'Neha P.', viewers: 345, avatar: 'N', category: 'Art', live: true, duration: '1h' },
  { id: 8, title: 'Punjabi Folk Songs', host: 'Gurdeep S.', viewers: 1567, avatar: 'G', category: 'Music', live: true, duration: '2h' },
]

const CATEGORIES = ['All', 'Music', 'Technology', 'Food', 'Literature', 'Art', 'Fitness', 'Entertainment']

export default function LiveStreams() {
  const [category, setCategory] = useState('All')
  const [liveOnly, setLiveOnly] = useState(true)
  const [playing, setPlaying] = useState(null)

  const filtered = LIVE_STREAMS.filter(s => {
    const catMatch = category === 'All' || s.category === category
    const liveMatch = !liveOnly || s.live
    return catMatch && liveMatch
  })

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-[#FF6B35]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">Live Streaming</span>
          <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            <span className="gradient-text">Go Live.</span>
            <br />
            <span className="text-white">Reach the World.</span>
          </h2>
          <p className="text-[17px] text-gray-400 max-w-2xl mx-auto">
            Broadcast in your language to thousands. Real-time translation keeps everyone connected.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between w-[280px]">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full px-4 py-2 rounded-lg border text-left bg-white/[0.02] hover-bg-white/[0.04] transition-all">
                <span className="text-gray-400">{category}</span>
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 p-0">
                {CATEGORIES.map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 text-sm ${
                      category === cat
                        ? 'bg-[#6C3CE1]/20 text-[#6C3CE1]'
                        : 'text-gray-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLiveOnly(!liveOnly)}
              className="px-3 py-1.5 text-[12px]"
            >
              {liveOnly ? 'Show All' : 'Live Only'}
            </Button>
          </div>
        </div>

        {/* Stream Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((stream, i) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group cursor-pointer hover:border-white/[0.08] transition-all">
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-[#6C3CE1]/10 to-[#FF6B35]/5">
                    {stream.live ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <button
                          onClick={(e) => { e.stopPropagation(); setPlaying(playing === stream.id ? null : stream.id) }}
                          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-all z-10"
                        >
                          {playing === stream.id ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          )}
                        </button>
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-red-500/90 rounded-full">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          <Badge variant="destructive" className="text-[9px] px-2 py-0.5">
                            LIVE
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <Radio className="absolute bottom-2 right-2 w-8 h-8 text-gray-600" />
                    )}
                    <span className="absolute bottom-2 left-2 text-[10px] text-gray-300 bg-black/50 px-1.5 py-0.5 rounded">
                      {stream.duration || 'Upcoming'}
                    </span>
                  </div>

                  {/* Stream Info */}
                  <div className="p-4">
                    <h4 className="text-[13px] font-medium text-white truncate mb-2">{stream.title}</h4>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF] flex items-center justify-center">
                          <span className="text-[9px] font-bold text-white">{stream.avatar}</span>
                        </div>
                        <span className="text-[11px] text-gray-400">{stream.host}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{stream.viewers.toLocaleString()}</span>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-gray-400">{stream.category}</span>
                      <span className="text-gray-400">{stream.live ? 'LIVE' : 'Upcoming'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}