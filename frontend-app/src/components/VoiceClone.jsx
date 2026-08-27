import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mic, Upload, Play, Download, Sparkles, AudioWaveform, CheckCircle } from 'lucide-react'

const sampleVoices = [
  { name: 'Professional Male', accent: 'American English', duration: '5s' },
  { name: 'Warm Female', accent: 'British English', duration: '8s' },
  { name: 'Energetic Youth', accent: 'Indian English', duration: '6s' },
  { name: 'Calm Narrator', accent: 'Australian English', duration: '10s' },
]

const features = [
  'Zero-shot cloning from just 3 seconds of audio',
  'Preserves tone, accent, and speaking style',
  'Works in 200+ languages',
  'Runs locally — your voice data never leaves your machine',
  'Export as WAV or MP3',
  'Batch processing for large volumes',
]

export default function VoiceClone() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [activeStep, setActiveStep] = useState(0)
  const [isCloning, setIsCloning] = useState(false)
  const [clonedText, setClonedText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(0)

  const steps = [
    { label: 'Upload Sample', icon: Upload },
    { label: 'AI Learns', icon: Sparkles },
    { label: 'Generate', icon: AudioWaveform },
  ]

  function handleClone() {
    if (!clonedText.trim()) return
    setIsCloning(true)
    setActiveStep(1)
    setTimeout(() => {
      setActiveStep(2)
      setTimeout(() => {
        setIsCloning(false)
      }, 1500)
    }, 2000)
  }

  return (
    <section className="relative py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />

      {/* Background blobs */}
      <div className="absolute top-[15%] right-[-8%] w-[500px] h-[500px] bg-[#E040FB]/5 rounded-full blur-[120px] gradient-blob" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-[#6C3CE1]/5 rounded-full blur-[100px] gradient-blob-delayed" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#E040FB] font-semibold tracking-wider uppercase text-[11px]">Voice Cloning</span>
          <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Clone Any Voice{' '}
            <span className="gradient-text">in Seconds</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload a 3-second audio sample. Our AI learns the voice characteristics and generates new speech that sounds exactly like the original.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left - Interactive demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="glass-card rounded-[24px] p-7 sm:p-8">
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-8">
                {steps.map((step, i) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      i <= activeStep
                        ? 'bg-gradient-to-br from-[#E040FB] to-[#F060FF]'
                        : 'bg-white/[0.04]'
                    }`}>
                      <step.icon className={`w-4 h-4 ${i <= activeStep ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <span className={`text-[12px] font-medium hidden sm:block ${
                      i <= activeStep ? 'text-white' : 'text-gray-500'
                    }`}>
                      {step.label}
                    </span>
                    {i < steps.length - 1 && (
                      <div className={`w-8 sm:w-12 h-[2px] mx-1 rounded transition-colors ${
                        i < activeStep ? 'bg-[#E040FB]/50' : 'bg-white/[0.06]'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Upload area */}
              <div className="mb-6">
                <label className="text-[12px] text-gray-500 uppercase tracking-wider font-medium mb-3 block">
                  Voice Sample
                </label>
                <div className="border-2 border-dashed border-white/[0.08] rounded-xl p-6 text-center hover:border-[#E040FB]/30 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-[13px] text-gray-400 mb-1">Drop audio file here or click to upload</p>
                  <p className="text-[11px] text-gray-600">MP3, WAV, M4A — 3 to 30 seconds</p>
                </div>
              </div>

              {/* Sample voices */}
              <div className="mb-6">
                <label className="text-[12px] text-gray-500 uppercase tracking-wider font-medium mb-3 block">
                  Or Try a Sample Voice
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sampleVoices.map((voice, i) => (
                    <button
                      key={voice.name}
                      onClick={() => setSelectedVoice(i)}
                      className={`p-3 rounded-xl text-left transition-all duration-300 ${
                        selectedVoice === i
                          ? 'bg-[#E040FB]/10 border border-[#E040FB]/30'
                          : 'bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                          selectedVoice === i ? 'bg-[#E040FB]' : 'bg-white/[0.06]'
                        }`}>
                          <Mic className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-[12px] font-medium text-white">{voice.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 ml-8">
                        <span>{voice.accent}</span>
                        <span>•</span>
                        <span>{voice.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text input */}
              <div className="mb-6">
                <label className="text-[12px] text-gray-500 uppercase tracking-wider font-medium mb-3 block">
                  Text to Speak
                </label>
                <textarea
                  value={clonedText}
                  onChange={(e) => setClonedText(e.target.value)}
                  placeholder="Type what you want the cloned voice to say..."
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-[13px] text-white placeholder-gray-600 resize-none focus:outline-none focus:border-[#E040FB]/50 transition-colors"
                />
              </div>

              {/* Generate button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClone}
                disabled={isCloning || !clonedText.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-[#E040FB] to-[#F060FF] rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 hover:shadow-[0_12px_32px_rgba(224,64,251,0.3)] transition-all duration-300 disabled:opacity-40"
              >
                {isCloning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {activeStep === 1 ? 'Learning voice...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Clone Voice
                  </>
                )}
              </motion.button>

              {/* Result */}
              {activeStep === 2 && !isCloning && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-[#00D4AA]/5 border border-[#00D4AA]/20 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-[#00D4AA]" />
                    <span className="text-[13px] text-[#00D4AA] font-medium">Voice cloned successfully</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] rounded-lg text-[12px] text-white hover:bg-white/[0.06] transition-colors">
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Play
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] rounded-lg text-[12px] text-white hover:bg-white/[0.06] transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      Download WAV
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right - Features + info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="text-[20px] sm:text-[22px] font-bold text-white mb-4">
              Your Voice. Your Data. Your Control.
            </h3>
            <p className="text-[14px] text-gray-400 leading-relaxed mb-8">
              Unlike cloud-based cloning services, ClearSpeak runs entirely on your machine. Your voice samples never leave your device. Zero cloud dependency, zero data leakage.
            </p>

            {/* Feature list */}
            <div className="space-y-3 mb-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-4 h-4 text-[#E040FB] flex-shrink-0 mt-0.5" />
                  <span className="text-[13px] text-gray-400">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Audio wave visualization */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <AudioWaveform className="w-4 h-4 text-[#E040FB]" />
                <span className="text-[12px] text-gray-500 uppercase tracking-wider font-medium">Voice Profile</span>
              </div>
              <div className="flex items-end gap-[3px] h-16 mb-4">
                {[...Array(40)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [`${20 + Math.random() * 60}%`, `${10 + Math.random() * 80}%`, `${20 + Math.random() * 60}%`],
                    }}
                    transition={{
                      duration: 1.5 + Math.random(),
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.05,
                    }}
                    className="flex-1 bg-gradient-to-t from-[#E040FB]/40 to-[#F060FF]/60 rounded-full min-w-[2px]"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>{sampleVoices[selectedVoice].name}</span>
                <span>{sampleVoices[selectedVoice].accent}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
