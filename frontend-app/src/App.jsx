import { useEffect, useState } from 'react'

import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AudioGuidance from './components/AudioGuidance'

import LanguageSupport from './components/LanguageSupport'
import Features from './components/Features'
import LanguageMarquee from './components/LanguageMarquee'

import VoiceClone from './components/VoiceClone'
import SpeechShowcase from './components/SpeechShowcase'
import VoiceChat from './components/VoiceChat'

import ChatInterface from './components/ChatInterface'
import CallsInterface from './components/CallsInterface'
import LiveStreams from './components/LiveStreams'
import SignLanguage from './components/SignLanguage'
import SpatialAwareness from './components/SpatialAwareness'
import ToDoZeeAI from './components/ToDoZeeAI'
import DemoVideo from './components/DemoVideo'
import Dashboard from './components/Dashboard'
import BusinessAnalytics from './components/BusinessAnalytics'
import Pricing from './components/Pricing'

import DashboardOverview from './components/dashboard/Overview'
import PricingTable from './components/pricing/PricingTable'
import WorkflowBuilder from './components/agent-builder/WorkflowBuilder'
import DeployAgent from './components/DeployAgent'
import AIConversations from './components/AIConversations'
import EnterpriseSecurity from './components/EnterpriseSecurity'
import FAQ from './components/FAQ'
import AccordionGenerativeDemo from './components/AccordionGenerativeDemo'
import DemoTestimonialsVerticalMarquee from './components/DemoTestimonialsVerticalMarquee'
import StudioPage from './components/studio/StudioPage'
import InfoPage from './components/InfoPage'
import { INFO_PAGES } from './data/footerPages'


const Div = () => <div className="section-divider" />

const pages = {
  '/': <StudioPage />,
  '/features': (
    <>
      <Features />
      <Div />
      <LanguageSupport />
      <Div />
      <LanguageMarquee />
    </>
  ),
  // 01 Speech-to-Speech
  '/speech': (
    <>
      <SpeechShowcase />
      <Div />
      <VoiceChat />
    </>
  ),
  '/speech-to-speech': (
    <>
      <SpeechShowcase />
      <Div />
      <VoiceChat />
    </>
  ),
  // 02 Voice Cloning
  '/clone': <VoiceClone />,
  '/voice-clone': <VoiceClone />,
  '/voice': (
    <>
      <VoiceClone />
      <Div />
      <SpeechShowcase />
      <Div />
      <VoiceChat />
    </>
  ),
  // 03 AI Voice Agents
  '/agents': (
    <>
      <CallsInterface />
      <Div />
      <DeployAgent />
      <Div />
      <AIConversations />
    </>
  ),
  '/calls': (
    <>
      <CallsInterface />
      <Div />
      <DeployAgent />
      <Div />
      <AIConversations />
    </>
  ),
  // 04 Realtime Chat
  '/chat': <ChatInterface />,
  // 05 Live Streaming
  '/live': (
    <>
      <LiveStreams />
      <Div />
      <SignLanguage />
    </>
  ),
  '/streaming': (
    <>
      <LiveStreams />
      <Div />
      <SignLanguage />
    </>
  ),
  // 06 Accessibility (sign language + spatial awareness)
  '/accessibility': (
    <>
      <SignLanguage />
      <Div />
      <SpatialAwareness />
    </>
  ),
  '/spatial': (
    <>
      <SignLanguage />
      <Div />
      <SpatialAwareness />
    </>
  ),
  // 07 Analytics
  '/analytics': (
    <>
      <Dashboard />
      <Div />
      <BusinessAnalytics />
    </>
  ),
  '/dashboard': (
    <>
      <Dashboard />
      <Div />
      <BusinessAnalytics />
    </>
  ),
  '/tasks': <ToDoZeeAI />,
  // 08 Product demo video
  '/demo': <DemoVideo />,
  '/pricing': <Pricing />,
  '/security': <EnterpriseSecurity />,
  '/compliance': <EnterpriseSecurity />,
  '/faq': <FAQ />,
  '/faq-demo': (
    <div className="pt-24 pb-20">
      <AccordionGenerativeDemo />
    </div>
  ),
  '/testimonials': (
    <div className="pt-24 pb-10">
      <DemoTestimonialsVerticalMarquee />
    </div>
  ),
  '/enterprise': (
    <>
      <EnterpriseSecurity />
      <Div />
      <DashboardOverview />
      <Div />
      <PricingTable />
      <Div />
      <WorkflowBuilder />
    </>
  ),
}

// ponytail: hash routing, no react-router — swap for react-router when you need
// nested routes, loaders or history-based URLs.
function readRoute() {
  const hash = window.location.hash
  if (!hash.startsWith('#/')) return '/'
  const path = hash.slice(1).split('#')[0].split('?')[0].replace(/\/+$/, '') || '/'
  return path
}

export default function App() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <ScrollProgress />
      <Navbar />
      <main>
        {pages[route] ?? (INFO_PAGES[route] ? <InfoPage {...INFO_PAGES[route]} /> : pages['/'])}
      </main>
      <Footer />
      <BackToTop />
      <AudioGuidance />
    </div>
  )
}
