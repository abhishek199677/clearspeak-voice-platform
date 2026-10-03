import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles, MessageSquare, Mic, TrendingUp,
  Zap, Heart, Star, ArrowRight, Coffee,
  Bot, Plus, Clock,
  ChevronDown, MoreVertical,
} from 'lucide-react'
// Shadcn/ui imports
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const TODOZEE_FEATURES = [
  {
    icon: Bot,
    title: '29 Powerful Features',
    desc: 'From reminders to translation, ToDoZee AI handles 8 life domains with ease.',
    color: '#6C3CE1',
  },
  {
    icon: MessageSquare,
    title: 'Conversational AI',
    desc: 'Natural dialogue that understands context, emotion, and intent across 200+ languages.',
    color: '#FF6B35',
  },
  {
    icon: Mic,
    title: 'Voice First',
    desc: 'Speak naturally and get intelligent responses. No typing required.',
    color: '#00D4AA',
  },
  {
    icon: TrendingUp,
    title: 'Learns Your Habits',
    desc: 'AI adapts to your routine, preferences, and communication style over time.',
    color: '#E040FB',
  },
]

const FAQS = [
  { q: 'What is ToDoZee AI?', a: 'ToDoZee is your everyday AI companion packed with 29 powerful features across 8 life domains, built on ChatBucket\'s sovereign AI platform.' },
  { q: 'How many languages does it support?', a: 'ToDoZee AI supports 200+ languages for text and voice, with native support for all 22 Scheduled Languages of India.' },
  { q: 'Is my data safe?', a: 'Yes. End-to-end encryption, data sovereignty, and on-device processing ensure your conversations stay private.' },
  { q: 'Can I customize ToDoZee?', a: 'Absolutely. You can customize the AI\'s personality, voice, language, and domain focus to match your needs.' },
]

export default function ToDoZeeAI() {
  const [activeFaq, setActiveFaq] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Namaste! I am ToDoZee AI. How can I help you today?', time: '10:00 AM' },
  ])

  function handleSend() {
    if (!chatInput.trim()) return
    const userMsg = { type: 'user', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')

    // Simulate bot response
    setTimeout(() => {
      const botMsg = {
        type: 'bot',
        text: 'I understand! Let me help you with that. ToDoZee AI is designed to assist across 8 life domains — productivity, health, finance, travel, safety, family, lifestyle, and entertainment.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setChatMessages(prev => [...prev, botMsg])
    }, 1500)
  }

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-dark-light" />
      <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-[#FF6B35]/5 rounded-full blur-[100px] gradient-blob" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">ToDoZee AI</span>
          <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            <span className="gradient-text">Your AI Companion.</span>
            <br />
            <span className="text-white">29 Features. One App.</span>
          </h2>
          <p className="text-[17px] text-gray-400 max-w-2xl mx-auto">
            New & Exclusive on ChatBucket. Your everyday AI companion packed with powerful features across 8 life domains.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Features */}
          <div className="lg:col-span-2 space-y-4">
            {TODOZEE_FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card rounded-2xl p-5">
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${feat.color}15` }}
                      >
                        <feat.icon className="w-5 h-5" style={{ color: feat.color }} />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold text-white mb-1">{feat.title}</h4>
                        <p className="text-[12px] text-gray-500 leading-relaxed">{feat.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '29', label: 'Features', color: '#6C3CE1' },
                { value: '8', label: 'Domains', color: '#FF6B35' },
                { value: '200+', label: 'Languages', color: '#00D4AA' },
              ].map((stat, i) => (
                <div key={stat.label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 text-center">
                  <div className="text-[24px] font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Demo */}
          <div className="lg:col-span-3">
            <Card className="bg-[#0D0D14] border border-white/[0.06] rounded-[24px] overflow-hidden">
              <CardContent className="p-0">
                {/* Chat Header */}
                <div className="px-5 py-4 border-b border-white/[0.04] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-white">ToDoZee AI</span>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <span className="text-[10px] text-gray-500">Online • Last seen just now</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1.5"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-3 h-[300px] overflow-y-auto">
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B]'
                          : 'bg-gradient-to-br from-[#6C3CE1] to-[#9B6DFF]'
                      }`}>
                        {msg.type === 'user' ? (
                          <span className="text-[8px] text-white font-bold">U</span>
                        ) : (
                          <Bot className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-[12px] leading-relaxed ${
                        msg.type === 'user'
                          ? 'bg-[#FF6B35]/10 text-white rounded-tr-md'
                          : 'bg-white/[0.04] text-gray-200 rounded-tl-md'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-white/[0.04] flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask ToDoZee anything..."
                    className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2 text-[13px] text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B35]/40"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!chatInput.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-[#FF8F6B] rounded-xl text-[13px] font-medium text-white hover:shadow-[0_8px_20px_rgba(255,107,53,0.3)] transition-all disabled:opacity-40"
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <div className="mt-6 space-y-2">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center justify-between text-left p-4">
                        <h3 className="text-[13px] font-medium text-white">{faq.q}</h3>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                      </div>
                    </CardHeader>
                    {activeFaq === i && (
                      <CardContent className="p-4">
                        <p className="text-[12px] text-gray-400 leading-relaxed">{faq.a}</p>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}