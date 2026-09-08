import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTheme } from './ThemeContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import UseCases from './components/UseCases'
import RotatingFeatures from './components/RotatingFeatures'
import DeployAgent from './components/DeployAgent'
import AIConversations from './components/AIConversations'
import LanguageSupport from './components/LanguageSupport'
import VoiceClone from './components/VoiceClone'
import Features from './components/Features'
import VoiceChat from './components/VoiceChat'
import Dashboard from './components/Dashboard'
import LanguageMarquee from './components/LanguageMarquee'
import Partners from './components/Partners'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import AdminLogin from './components/AdminLogin'
import Monitor from './components/Monitor'
import ChannelBrowser from './components/ChannelBrowser'
import ChatRoom from './components/ChatRoom'
import OnlineUsers from './components/OnlineUsers'
import VoiceCallUI from './components/VoiceCallUI'
import AgentManager from './components/AgentManager'
import StreamManager from './components/StreamManager'
import ProductivityDashboard from './components/ProductivityDashboard'

function LandingPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Partners />
      <HowItWorks />
      <UseCases />
      <RotatingFeatures />
      <DeployAgent />
      <AIConversations />
      <LanguageSupport />
      <VoiceClone />
      <Features />
      <VoiceChat />
      <Dashboard />
      <LanguageMarquee />
      <Pricing />
      <FAQ />
      <Footer />
      <BackToTop />
    </>
  )
}

function ChatPage() {
  const [activeChannel, setActiveChannel] = useState(null)
  const userId = useState(() => 'user_' + Math.random().toString(36).slice(2, 8))[0]

  return (
    <div className="chat-page">
      <Navbar />
      <div className="chat-layout">
        <aside className="chat-sidebar chat-sidebar--left">
          <ChannelBrowser activeChannel={activeChannel} onSelect={setActiveChannel} />
        </aside>
        <main className="chat-main">
          <ChatRoom channel={activeChannel} userId={userId} />
        </main>
        <aside className="chat-sidebar chat-sidebar--right">
          <OnlineUsers />
        </aside>
      </div>
    </div>
  )
}

function CallsPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <VoiceCallUI />
      </main>
    </div>
  )
}

function AgentsPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <AgentManager />
      </main>
    </div>
  )
}

function StreamsPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <StreamManager />
      </main>
    </div>
  )
}

function ProductivityPage() {
  return (
    <div className="page-container">
      <Navbar />
      <main className="page-content">
        <ProductivityDashboard />
      </main>
    </div>
  )
}

function App() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen transition-theme ${theme}`} style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/calls" element={<CallsPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/streams" element={<StreamsPage />} />
        <Route path="/productivity" element={<ProductivityPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Monitor />} />
      </Routes>
    </div>
  )
}

export default App
