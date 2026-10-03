import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Mic, Volume2, ArrowRightLeft, Play, Pause,
  CheckCircle, XCircle, Globe, Brain
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// Mock speech samples
const speechSamples = [
  {
    id: 1,
    language: 'English',
    text: 'Hello, how can I assist you today?',
    audioUrl: '#',
    duration: '2.3s'
  },
  {
    id: 2,
    language: 'Spanish',
    text: 'Hola, ¿cómo puedo ayudarte hoy?',
    audioUrl: '#',
    duration: '2.5s'
  },
  {
    id: 3,
    language: 'French',
    text: 'Bonjour, comment puis-je vous aider aujourd\'hui?',
    audioUrl: '#',
    duration: '2.7s'
  },
  {
    id: 4,
    language: 'German',
    text: 'Hallo, wie kann ich Ihnen heute helfen?',
    audioUrl: '#',
    duration: '2.4s'
  },
  {
    id: 5,
    language: 'Japanese',
    text: 'こんにちは、今日どのようにお手伝いできますか？',
    audioUrl: '#',
    duration: '3.1s'
  }
]

export default function SpeechShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSample, setCurrentSample] = useState(speechSamples[0])
  const [isProcessing, setIsProcessing] = useState(false)

  // Simulate speech-to-text conversion
  const handleSpeechToText = async (text) => {
    setIsProcessing(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    // In a real app, this would return the transcribed text
    return text.toUpperCase() // Mock transformation
  }

  // Simulate text-to-speech conversion
  const handleTextToSpeech = async (text) => {
    setIsProcessing(true)
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    // In a real app, this would generate and play audio
    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), 3000) // Simulate audio duration
  }

  const handlePlaySample = async () => {
    setIsPlaying(true)
    await handleTextToSpeech(currentSample.text)
  }

  const handleConvertSpeech = async () => {
    const result = await handleSpeechToText(currentSample.text)
    alert(`Speech-to-Text Result: ${result}`)
  }

  return (
    <section id="speech-showcase" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#FF6B35] font-semibold tracking-wider uppercase text-[11px]">Speech AI</span>
          <h2 className="text-[2.5rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Experience the Power of{' '}
            <span className="gradient-text">Speech-to-Speech AI</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Watch as our AI seamlessly converts speech to text and back to natural-sounding speech in multiple languages.
          </p>
        </motion.div>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-12"
        >
          {/* Left - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="space-y-6">
              {/* Language Selector */}
              <div className="space-y-3">
                <p className="text-[14px] font-medium text-white mb-2">Select Language</p>
                <div className="space-y-2">
                  {speechSamples.map((sample) => (
                    <motion.div
                      key={sample.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + speechSamples.indexOf(sample) * 0.02 }}
                      className={`flex items-center p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl ${currentSample.id === sample.id ? 'bg-white/[0.08] border-white/[0.1]' : 'hover:bg-white/[0.03] hover:border-white/[0.06]'}`}
                      onClick={() => setCurrentSample(sample)}
                    >
                      <div className="flex-1">
                        <p className="text-[14px] font-medium text-white">{sample.language}</p>
                        <p className="text-[12px] text-gray-400">{sample.text}</p>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center">
                        {currentSample.id === sample.id && (
                          <Globe className="w-4 h-4 text-[#6C3CE1] animate-pulse" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handlePlaySample}
                  isLoading={isPlaying}
                  className="w-full py-3 px-5 bg-gradient-to-r from-[#6C3CE1] to-[#9B6DFF] text-white text-[14px] font-medium rounded-lg hover:shadow-[0_8px_25px_rgba(108,60,225,0.3)] transition-all duration-300"
                >
                  {isPlaying ? 'Playing...' : 'Play Speech Sample'}
                </Button>

                <Button
                  onClick={handleConvertSpeech}
                  isLoading={isProcessing}
                  className="w-full py-3 px-5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white text-[14px] font-medium hover:bg-white/[0.04] transition-all duration-300"
                >
                  {isProcessing ? 'Processing...' : 'Convert Speech to Text'}
                </Button>
              </div>

              {/* Status Indicators */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${isPlaying ? 'bg-[#00D4AA]/20' : 'bg-white/[0.02]'} flex items-center justify-center`}>
                    {isPlaying ? <Pause className="w-4 h-4 text-[#00D4AA]" /> : <Play className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-[13px] text-gray-400">{isPlaying ? 'Playing audio...' : 'Ready to play'}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${isProcessing ? 'bg-[#FF6B35]/20' : 'bg-white/[0.02]'} flex items-center justify-center`}>
                    {isProcessing ? <Brain className="w-4 h-4 text-[#FF6B35] animate-pulse" /> : <Mic className="w-4 h-4 text-white" />}
                  </div>
                  <span className="text-[13px] text-gray-400">{isProcessing ? 'Processing speech...' : 'Ready for STT'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            {/* Speech Waveform Visualization */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6C3CE1]/10 to-[#FF6B35]/5 rounded-[24px] blur-[40px]" />
            <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-[20px] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-[#6C3CE1]" />
                  <span className="text-[13px] font-semibold text-white">Speech Visualization</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#00D4AA] animate-pulse' : 'bg-gray-500'}`} />
                  <span className="text-[11px] text-gray-500">{isPlaying ? 'Active' : 'Idle'}</span>
                </div>
              </div>

              {/* Waveform */}
              <div className="px-6 py-6">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <motion.div
                      key={row}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.2 + row * 0.05 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-white/[0.03]" />
                      <div className="flex-1 h-1 bg-gradient-to-r from-[#6C3CE1] to-[#FF6B35] rounded"
                           style={{ height: `${30 + Math.sin(Date.now() / 300 + row) * 20}%` }} />
                      <div className="w-2 h-2 rounded-full bg-white/[0.03]" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Controls Bar */}
              <div className="px-6 py-3 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-[11px] text-gray-500">
                <span>Sample: {currentSample.language}</span>
                <span>Duration: {currentSample.duration}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: Mic,
              label: 'Speech Recognition',
              desc: 'Accurate speech-to-text in 200+ languages',
              color: 'from-[#6C3CE1] to-[#9B6DFF]'
            },
            {
              icon: Volume2,
              label: 'Natural TTS',
              desc: 'Human-like voice synthesis with emotion',
              color: 'from-[#FF6B35] to-[#FF8F6B]'
            },
            {
              icon: ArrowRightLeft,
              label: 'Real-time Translation',
              desc: 'Speech-to-speech with <300ms latency',
              color: 'from-[#00D4AA] to-[#00F5C4]'
            },
            {
              icon: Brain,
              label: 'AI Understanding',
              desc: 'Context-aware processing and intent recognition',
              color: 'from-[#E040FB] to-[#F060FF]'
            }
          ].map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-white">{feature.label}</p>
                  <p className="text-[13px] text-gray-400">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}