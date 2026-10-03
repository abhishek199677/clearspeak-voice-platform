import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, Hash, Users, Phone, Video, Search,
  MoreVertical, Send, Paperclip, Smile, Reply, ThumbsUp,
  Pin, Lock, Globe, CheckCheck, Clock, ArrowLeft,
  Mic, Image, FileText, Plus, ChevronDown, X,
  Volume2, VideoOff, PhoneOff, ScreenShare, Users2,
  Sparkles, Zap, TrendingUp, Shield, Coffee, Bot,
  Heart, Share2, Bookmark, AlertCircle, Info,
} from 'lucide-react'
import { getChannels, getMessages, sendMessage, getOnlineUsers } from '../api/platform'
// Shadcn/ui imports
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Toast, ToastAction, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// ── Sidebar ──────────────────────────────────────────────
function Sidebar({ activeView, setActiveView, activeChannel, setActiveChannel, searchOpen, setSearchOpen }) {
  const [channels, setChannels] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [showMembers, setShowMembers] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const ch = await getChannels()
        setChannels(ch.channels || [])
      } catch {}
      try {
        const users = await getOnlineUsers()
        setOnlineUsers(users.users || [])
      } catch {}
    }
    load()
    const iv = setInterval(load, 15000)
    return () => clearInterval(iv)
  }, [])

  const channelTypes = {
    public: { icon: Globe, color: 'text-primary' },
    private: { icon: Lock, color: 'text-destructive' },
    direct: { icon: Users, color: 'text-success' },
    group: { icon: Users2, color: 'text-accent' },
  }

  return (
    <Card className="h-full w-[270px] lg:w-[320px]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[15px] text-foreground">ClearSpeak</span>
          </div>
          <DropdownMenu className="z-50">
            <DropdownMenuTrigger className="p-1.5 rounded-md hover:bg-muted">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-0">
              <DropdownMenuItem onClick={() => setSearchOpen(true)}>
                <Search className="w-4 h-4 mr-3" />
                Search
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="w-4 h-4 mr-3" />
                New Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* View Tabs */}
        <div className="flex gap-1 rounded-md bg-muted/50 p-0.5">
          {[
            { key: 'chat', label: 'Chat', icon: MessageSquare },
            { key: 'calls', label: 'Calls', icon: Phone },
            { key: 'groups', label: 'Groups', icon: Users2 },
          ].map((v) => (
            <button
              type="button"
              key={v.key}
              onClick={() => { setActiveView(v.key); setActiveChannel(null) }}
              className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                activeView === v.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-muted/80'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Channel List */}
        <div className="space-y-4">
          {activeView === 'chat' && (
            <>
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Channels</span>
              </div>
              <ScrollArea className="h-[200px]">
                {channels.filter(c => c.channel_type === 'public').map((ch) => {
                  const Icon = channelTypes.public.icon
                  return (
                    <Button
                      key={ch.channel_id}
                      variant="outline"
                      onClick={() => setActiveChannel(ch)}
                      className={`w-full flex items-center gap-3 px-3 py-2 mb-2 rounded-md transition-all ${
                        activeChannel?.channel_id === ch.channel_id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-muted/80'
                      }`}
                    >
                      <Hash className="w-4 h-4 flex-shrink-0 text-muted-foreground/50" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-foreground truncate">{ch.name}</span>
                      </div>
                    </Button>
                  )
                })}
              </ScrollArea>
              <div className="mt-4">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Direct Messages</span>
              </div>
              <ScrollArea className="h-[200px]">
                {channels.filter(c => c.channel_type === 'direct').map((ch) => (
                  <Button
                    key={ch.channel_id}
                    variant="outline"
                    onClick={() => setActiveChannel(ch)}
                    className={`w-full flex items-center gap-3 px-3 py-2 mb-2 rounded-md transition-all ${
                      activeChannel?.channel_id === ch.channel_id
                        ? 'bg-success text-success-foreground'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-muted/80'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-success to-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-[9px] font-bold text-white">{ch.name[0]}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground truncate">{ch.name}</span>
                  </Button>
                ))}
              </ScrollArea>
            </>
          )}

          {activeView === 'groups' && (
            <>
              <div className="mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Groups</span>
              </div>
              <ScrollArea className="h-[400px]">
                {channels.filter(c => c.channel_type === 'group').map((ch) => (
                  <Button
                    key={ch.channel_id}
                    variant="outline"
                    onClick={() => setActiveChannel(ch)}
                    className={`w-full flex items-center gap-3 px-3 py-2 mb-2 rounded-md transition-all ${
                      activeChannel?.channel_id === ch.channel_id
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-muted/80'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-destructive to-accent flex items-center justify-center flex-shrink-0">
                      <Users2 className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground truncate">{ch.name}</span>
                    </div>
                    <span className="ml-auto text-xs text-muted">{ch.member_count || 0}</span>
                  </Button>
                ))}
              </ScrollArea>
            </>
          )}

          {activeView === 'calls' && (
            <div className="space-y-4">
              {[
                { name: 'Voice Rooms', icon: Phone, color: 'text-primary', desc: 'Instant voice channels' },
                { name: 'Video Calls', icon: Video, color: 'text-destructive', desc: 'Face to face' },
                { name: 'Screen Share', icon: ScreenShare, color: 'text-success', desc: 'Share your screen' },
              ].map((item) => (
                <Button
                  key={item.name}
                  variant="outline"
                  className={`w-full flex items-center gap-3 p-4 rounded-lg border border-muted hover:bg-muted/50 transition-all`}
                >
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">{item.name}</div>
                    <div className="text-xs text-muted">{item.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Online Users */}
        {activeView !== 'calls' && (
          <div className="mt-6 p-4 rounded-md bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Online</span>
              <span className="text-sm font-medium text-success">{onlineUsers.length}</span>
            </div>
            <div className="flex -space-x-1.5">
              {onlineUsers.slice(0, 8).map((user, i) => (
                <div key={user.user_id || i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-border flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">{(user.username || 'U')[0].toUpperCase()}</span>
                </div>
              ))}
              {onlineUsers.length > 8 && (
                <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center">
                  <span className="text-[8px] text-muted">+{onlineUsers.length - 8}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Chat Area ─────────────────────────────────────────────
function ChatArea({ channel, onBack }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!channel) return
    async function load() {
      try {
        const msgs = await getMessages(channel.channel_id, 50)
        setMessages(msgs.messages || [])
      } catch { setMessages([]) }
    }
    load()
  }, [channel?.channel_id])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function handleSend() {
    if (!input.trim() || !channel) return
    try {
      const msg = await sendMessage(channel.channel_id, input.trim(), 'web-user', 'You')
      setMessages(prev => [...prev, { ...msg, is_self: true }])
      setInput('')
      setReplyingTo(null)
    } catch {}
  }

  if (!channel) {
    return (
      <Card className="h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-[18px] font-semibold text-muted-foreground mb-2">Select a conversation</h3>
          <p className="text-[13px] text-muted-foreground">Choose a channel or start a new message</p>
        </div>
      </Card>
    )
  }

  const isGroup = channel.channel_type === 'group'

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="lg:hidden p-2"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </Button>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            {isGroup ? <Users2 className="w-4 h-4 text-primary" /> : <Users className="w-4 h-4 text-success" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground truncate">{channel.name}</span>
              {channel.is_pinned && <Pin className="w-3 h-3 text-accent" />}
            </div>
            <span className="text-xs text-muted">
              {channel.member_count || 0} members • {channel.channel_type}
            </span>
          </div>
          <DropdownMenu className="z-50">
            <DropdownMenuTrigger className="p-1 rounded-md hover:bg-muted">
              <MoreVertical className="w-3 h-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-0">
              <DropdownMenuItem>
                <Search className="w-3 h-3 mr-2" />
                Search
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pin className="w-3 h-3 mr-2" />
                Pin
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MoreVertical className="w-3 h-3 mr-2" />
                More
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        {/* Messages */}
        <ScrollArea className="h-full w-full">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <div
                key={msg.message_id || i}
                className={clsx(
                  "group px-3 py-2 rounded-md mb-2",
                  msg.is_self ? "bg-primary/10" : "",
                  msg.is_self ? "text-primary-foreground" : "text-muted-foreground"
                )}
              >
                <div className="flex items-baseline gap-2">
                  {!msg.is_self && (
                    <span className="text-xs font-semibold text-primary flex-shrink-0">
                      {msg.sender_name || 'User'}
                    </span>
                  )}
                  <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                  <span className="text-xs text-muted-foreground ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100">
                    {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                {msg.reactions?.length > 0 && (
                  <div className="flex gap-1 mt-2 ml-6">
                    {msg.reactions.map((r, ri) => (
                      <span key={ri} className="text-xs px-1.5 py-0.5 rounded-full bg-muted/50">{r.emoji}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </ScrollArea>

        {/* Reply Preview */}
        <AnimatePresence>
          {replyingTo && (
            <div className="mx-4 mb-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
              <span className="text-sm text-primary">Replying to {replyingTo}</span>
              <Button onClick={() => setReplyingTo(null)} variant="ghost" size="icon" className="p-0.5">
                <X className="w-3 h-3 text-muted-foreground" />
              </Button>
            </div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="p-4 rounded-md bg-muted/50">
          <div className="flex items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="p-1"
            >
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Message"
              rows={1}
              className="flex-1 bg-transparent text-sm font-medium text-muted-foreground placeholder:text-muted-foreground/50 resize-none py-1 outline-none"
            />
            <Button
              variant="ghost"
              size="icon"
              className="p-1"
            >
              <Smile className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-1 bg-primary rounded-lg text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-30"
            >
              <Send className="w-3 h-3 text-white" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Right Panel (Thread/Info) ─────────────────────────────
function RightPanel({ channel }) {
  if (!channel) {
    return (
      <Card className="h-full w-[270px] lg:w-[320px] hidden xl:flex flex-col items-center justify-center text-muted-foreground">
        <Info className="w-8 h-8 mb-3 opacity-50" />
        <p className="text-sm">Conversation details</p>
      </Card>
    )
  }

  return (
    <Card className="h-full w-[270px] lg:w-[320px] hidden xl:flex flex-col">
      <CardHeader>
        <h3 className="text-xl font-bold text-foreground mb-4">About</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {channel.description || `Chat in ${channel.name}`}
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Stats</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Messages</span>
                <span className="text-sm font-medium text-foreground">{channel.message_count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Members</span>
                <span className="text-sm font-medium text-foreground">{channel.member_count || 0}</span>
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</h4>
            <div className="space-y-2">
              {[
                { icon: Bookmark, label: 'Save Messages', color: 'text-success' },
                { icon: Share2, label: 'Share Link', color: 'text-primary' },
                { icon: Heart, label: 'Favorite', color: 'text-accent' },
              ].map((a) => (
                <Button
                  key={a.label}
                  variant="outline"
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-muted/50 transition-colors"
                >
                  <a.icon className={`w-3 h-3 ${a.color}`} />
                  <span className="flex-1">{a.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main Export ───────────────────────────────────────────
export default function ChatInterface() {
  const [activeView, setActiveView] = useState('chat')
  const [activeChannel, setActiveChannel] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent font-semibold tracking-wider uppercase text-[11px]">Chat & Collaboration</span>
          <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            <span className="gradient-text">Chat Anywhere.</span>
            <br />
            <span className="text-white">Understand Everything.</span>
          </h2>
          <p className="text-[17px] text-gray-400 max-w-2xl mx-auto">
            Channels, direct messages, voice calls, and live streams — all with real-time AI translation built in.
          </p>
        </motion.div>

        {/* Chat UI Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="h-[560px] lg:h-[620px] rounded-lg bg-background/50 border border-muted/50 overflow-hidden flex flex-col"
        >
          <div className="flex-1 flex overflow-hidden">
            <Sidebar
              activeView={activeView}
              setActiveView={setActiveView}
              activeChannel={activeChannel}
              setActiveChannel={setActiveChannel}
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
            />
            <ChatArea channel={activeChannel} onBack={() => setActiveChannel(null)} />
            <RightPanel channel={activeChannel} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}