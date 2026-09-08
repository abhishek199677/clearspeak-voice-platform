import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mic, Upload, Play, Pause, Download, Sparkles, CheckCircle } from 'lucide-react'
import { cloneVoice } from '../api/platform'

const sampleVoices = [
  { name: 'Professional Male', accent: 'American English', duration: '5s', file: '/samples/professional_male.wav' },
  { name: 'Warm Female', accent: 'British English', duration: '8s', file: '/samples/warm_female.wav' },
  { name: 'Energetic Youth', accent: 'Indian English', duration: '6s', file: '/samples/energetic_youth.wav' },
  { name: 'Calm Narrator', accent: 'Australian English', duration: '10s', file: '/samples/calm_narrator.wav' },
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
  const [uploadedFile, setUploadedFile] = useState(null)
  const [clonedAudioUrl, setClonedAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const fileInputRef = useRef(null)

  const steps = [
    { label: 'Upload Sample', icon: Upload },
    { label: 'AI Learns', icon: Sparkles },
    { label: 'Generate', icon: Mic },
  ]

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      setActiveStep(1)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('audio/')) {
      setUploadedFile(file)
      setActiveStep(1)
    }
  }

  function handleSelectSampleVoice(index) {
    setSelectedVoice(index)
    if (!uploadedFile) {
      setActiveStep(1)
    }
  }

  async function handleClone() {
    if (!clonedText.trim()) return
    setIsCloning(true)
    setActiveStep(1)
    setError(null)
    setClonedAudioUrl(null)

    try {
      let audioFileToClone = uploadedFile

      if (!audioFileToClone) {
        const sampleFile = sampleVoices[selectedVoice].file
        const response = await fetch(sampleFile)
        if (!response.ok) {
          throw new Error('Failed to load sample voice audio')
        }
        const blob = await response.blob()
        audioFileToClone = new File([blob], `${sampleVoices[selectedVoice].name}.wav`, { type: 'audio/wav' })
      }

      const audioBlob = await cloneVoice(audioFileToClone, clonedText)
      const url = URL.createObjectURL(audioBlob)
      setClonedAudioUrl(url)
      setActiveStep(2)
    } catch (err) {
      console.error('Clone failed:', err)
      setError(err.message || 'Voice cloning failed. Please try again.')
      setActiveStep(0)
    } finally {
      setIsCloning(false)
    }
  }

  function handlePlay() {
    if (clonedAudioUrl) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
        setIsPlaying(false)
        return
      }

      audioRef.current = new Audio(clonedAudioUrl)
      audioRef.current.play()
      setIsPlaying(true)

      audioRef.current.onended = () => {
        setIsPlaying(false)
        audioRef.current = null
      }
    }
  }

  function handleDownload() {
    if (clonedAudioUrl) {
      const a = document.createElement('a')
      a.href = clonedAudioUrl
      a.download = `cloned-voice-${Date.now()}.wav`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <section className="section-lg" style={{ background: 'var(--bg)' }}>
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="overline-dot justify-center mb-4" style={{ color: '#E040FB' }}>
            <span style={{ color: '#E040FB' }}>Voice Cloning</span>
          </div>
          <h2 className="heading-1 mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Clone Any Voice{' '}
            <span style={{ color: 'var(--primary)' }}>in Seconds</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Upload a 3-second audio sample. Our AI learns the voice characteristics and generates new speech that sounds exactly like the original.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left - Interactive demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="card p-7 sm:p-8">
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-8">
                {steps.map((step, i) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200" style={{
                      background: i <= activeStep ? '#E040FB' : 'var(--input-bg)',
                    }}>
                      <step.icon className="w-4 h-4" style={{ color: i <= activeStep ? 'white' : 'var(--text-tertiary)' }} />
                    </div>
                    <span className="caption hidden sm:block" style={{
                      color: i <= activeStep ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    }}>
                      {step.label}
                    </span>
                    {i < steps.length - 1 && (
                      <div className="w-8 sm:w-12 h-[2px] mx-1 rounded" style={{
                        background: i < activeStep ? '#E040FB' : 'var(--border)',
                      }} />
                    )}
                  </div>
                ))}
              </div>

              {/* Upload area */}
              <div className="mb-6">
                <label className="overline mb-3 block" style={{ color: 'var(--text-tertiary)' }}>Voice Sample</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="rounded-xl p-6 text-center cursor-pointer transition-colors"
                  style={{
                    border: `2px dashed ${uploadedFile ? 'var(--success)' : 'var(--border)'}`,
                    background: uploadedFile ? 'var(--primary-ring)' : 'transparent',
                  }}
                >
                  {uploadedFile ? (
                    <>
                      <CheckCircle className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--success)' }} />
                      <p className="caption mb-1" style={{ color: 'var(--success)' }}>{uploadedFile.name}</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Click to change file</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
                      <p className="caption mb-1" style={{ color: 'var(--text-secondary)' }}>Drop audio file here or click to upload</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>MP3, WAV, M4A — 3 to 30 seconds</p>
                    </>
                  )}
                </div>
              </div>

              {/* Sample voices */}
              <div className="mb-6">
                <label className="overline mb-3 block" style={{ color: 'var(--text-tertiary)' }}>Or Try a Sample Voice</label>
                <div className="grid grid-cols-2 gap-2">
                  {sampleVoices.map((voice, i) => (
                    <button
                      key={voice.name}
                      onClick={() => handleSelectSampleVoice(i)}
                      className="p-3 rounded-xl text-left transition-all duration-200"
                      style={{
                        background: selectedVoice === i ? '#E040FB15' : 'var(--input-bg)',
                        border: `1px solid ${selectedVoice === i ? '#E040FB40' : 'var(--border-subtle)'}`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{
                          background: selectedVoice === i ? '#E040FB' : 'var(--border)',
                        }}>
                          <Mic className="w-3 h-3 text-white" />
                        </div>
                        <span className="caption" style={{ color: 'var(--text-primary)' }}>{voice.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] ml-8" style={{ color: 'var(--text-tertiary)' }}>
                        <span>{voice.accent}</span>
                        <span>·</span>
                        <span>{voice.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text input */}
              <div className="mb-6">
                <label className="overline mb-3 block" style={{ color: 'var(--text-tertiary)' }}>Text to Speak</label>
                <textarea
                  value={clonedText}
                  onChange={(e) => setClonedText(e.target.value)}
                  placeholder="Type what you want the cloned voice to say..."
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 caption resize-none"
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Generate button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClone}
                disabled={isCloning || !clonedText.trim()}
                className="w-full py-3.5 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40"
                style={{ background: '#E040FB', color: 'white' }}
              >
                {isCloning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {activeStep === 1 ? 'Learning voice...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {uploadedFile ? 'Clone Uploaded Voice' : `Clone ${sampleVoices[selectedVoice].name}`}
                  </>
                )}
              </motion.button>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                  <span className="caption" style={{ color: '#EF4444' }}>{error}</span>
                </motion.div>
              )}

              {/* Result */}
              {activeStep === 2 && !isCloning && clonedAudioUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl"
                  style={{ background: 'var(--primary-ring)', border: '1px solid var(--success)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                    <span className="caption" style={{ color: 'var(--success)' }}>Voice cloned successfully</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlay}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg caption transition-colors"
                      style={{ background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    >
                      {isPlaying ? (
                        <><Pause className="w-3.5 h-3.5" /> Pause</>
                      ) : (
                        <><Play className="w-3.5 h-3.5" /> Play</>
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg caption transition-colors"
                      style={{ background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    >
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
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="heading-3 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Your Voice. Your Data. Your Control.
            </h3>
            <p className="body mb-8" style={{ color: 'var(--text-secondary)' }}>
              Unlike cloud-based cloning services, ClearSpeak runs entirely on your machine. Your voice samples never leave your device. Zero cloud dependency, zero data leakage.
            </p>

            <div className="space-y-3 mb-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -8 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#E040FB' }} />
                  <span className="caption" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Voice profile visualization */}
            <div className="card p-5">
              <div className="overline mb-4" style={{ color: 'var(--text-tertiary)' }}>Voice Profile</div>
              <div className="flex items-end gap-[3px] h-16 mb-4">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-full min-w-[2px]"
                    style={{
                      height: `${20 + Math.random() * 60}%`,
                      background: `linear-gradient(to top, #E040FB40, #E040FB90)`,
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
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
