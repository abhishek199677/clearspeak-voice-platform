import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Hand, Volume2, Languages, ArrowRightLeft,
  Sparkles, Zap, Target, Heart,
  MessageCircle, Video, Mic,
} from 'lucide-react'
// Shadcn/ui imports
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const SIGN_LANGUAGES = [
  { name: 'Indian Sign Language', code: 'ISL', users: '1.8M+', icon: '🇮🇳' },
  { name: 'American Sign Language', code: 'ASL', users: '500K+', icon: '🇺🇸' },
  { name: 'British Sign Language', code: 'BSL', users: '150K+', icon: '🇬🇧' },
  { name: 'Japanese Sign Language', code: 'JSL', users: '300K+', icon: '🇯🇵' },
  { name: 'French Sign Language', code: 'LSF', users: '200K+', icon: '🇫🇷' },
  { name: 'German Sign Language', code: 'DGS', users: '100K+', icon: '🇩🇪' },
]

const features = [
  { icon: ArrowRightLeft, title: 'Gesture to Speech', desc: 'Sign language translated to spoken words in real-time', color: '#6C3CE1' },
  { icon: Volume2, title: 'Speech to Gesture', desc: 'Spoken words translated to sign language animations', color: '#FF6B35' },
  { icon: Video, title: 'Video Avatar', desc: 'AI avatar performs sign language with natural expressions', color: '#00D4AA' },
  { icon: Mic, title: 'Voice Output', desc: 'Clear TTS output in the user\'s preferred language', color: '#E040FB' },
]

export default function SignLanguage() {
  const [demoGesture, setDemoGesture] = useState(0)
  const gestures = ['Hello', 'Thank You', 'Please', 'Help', 'Yes', 'No', 'Welcome', 'Love']

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-dark-light" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#00D4AA]/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#00D4AA] font-semibold tracking-wider uppercase text-[11px]">Sign Language</span>
          <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            <span className="gradient-text">Hands That Speak.</span>
            <br />
            <span className="text-white">Minds That Understand.</span>
          </h2>
          <p className="text-[17px] text-gray-400 max-w-2xl mx-auto">
            Breaking barriers with AI-powered sign language recognition and translation across 6+ sign languages.
          </p>
        </motion.div>

        {/* Gesture Demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="glass-card rounded-[24px] p-8 sm:p-10 text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#6C3CE1]/20 to-[#00D4AA]/20 flex items-center justify-center border border-white/[0.06]">
              <Hand className="w-16 h-16 text-[#6C3CE1]" />
            </div>
            <h3 className="text-[24px] font-bold text-white mb-2">{gestures[demoGesture]}</h3>
            <p className="text-[14px] text-gray-500 mb-6">Gesture recognition in progress...</p>

            <div className="flex justify-center gap-2 mb-6">
              {gestures.map((g, i) => (
                <button
                  key={g}
                  onClick={() => setDemoGesture(i)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    demoGesture === i
                      ? 'bg-[#6C3CE1]/20 text-[#6C3CE1] border border-[#6C3CE1]/30'
                      : 'bg-white/[0.02] text-gray-500 border border-white/[0.04] hover:bg-white/[0.04]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#6C3CE1]/10 rounded-lg">
                <ArrowRightLeft className="w-4 h-4 text-[#6C3CE1]" />
                <span className="text-[12px] text-[#6C3CE1]">Detected</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#00D4AA]/10 rounded-lg">
                <Volume2 className="w-4 h-4 text-[#00D4AA]" />
                <span className="text-[12px] text-[#00D4AA]">{gestures[demoGesture]} (English)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card rounded-2xl p-6">
                <CardContent>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4"
                      style={{ background: `linear-gradient(135deg, ${feat.color}30, ${feat.color}10)` }}
                    >
                      <feat.icon className="w-5 h-5" style={{ color: feat.color }} />
                    </div>
                  </div>
                  <h4 className="text-[15px] font-semibold text-white mb-2">{feat.title}</h4>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{feat.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Supported Sign Languages */}
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-[18px] font-semibold text-white mb-6 text-center">Supported Sign Languages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SIGN_LANGUAGES.map((lang, i) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all cursor-pointer">
                  <div className="text-2xl mb-2">{lang.icon}</div>
                  <div className="text-[12px] font-medium text-white">{lang.code}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{lang.users} users</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}