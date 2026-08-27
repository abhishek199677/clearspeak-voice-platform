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

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <div className="section-divider" />
      <Partners />
      <div className="section-divider" />
      <HowItWorks />
      <div className="section-divider" />
      <UseCases />
      <div className="section-divider" />
      <RotatingFeatures />
      <div className="section-divider" />
      <DeployAgent />
      <div className="section-divider" />
      <AIConversations />
      <div className="section-divider" />
      <LanguageSupport />
      <div className="section-divider" />
      <VoiceClone />
      <div className="section-divider" />
      <Features />
      <div className="section-divider" />
      <VoiceChat />
      <div className="section-divider" />
      <Dashboard />
      <div className="section-divider" />
      <LanguageMarquee />
      <div className="section-divider" />
      <Pricing />
      <div className="section-divider" />
      <FAQ />
      <Footer />
      <BackToTop />
    </div>
  )
}

export default App
