import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Mic, Upload, Play, Pause, Download, Sparkles,
  AudioWaveform, CheckCircle, Volume2, Video,
  MessageSquare, Copy, Check, ArrowRight,
  Headphones, Wand2, Layers, Wind, AlertTriangle,
} from 'lucide-react'
import { cloneVoice } from '../api/platform'
// Shadcn/ui imports
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Stat, StatLabel, StatValue } from './ui/stat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Toast, ToastAction, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './ui/toast'

const sampleVoices = [
  { name: 'Professional Male', accent: 'American English', duration: '5s', file: '/samples/professional_male.wav' },
  { name: 'Warm Female', accent: 'British English', duration: '8s', file: '/samples/warm_female.wav' },
  { name: 'Energetic Youth', accent: 'Indian English', duration: '6s', file: '/samples/energetic_youth.wav' },
  { name: 'Calm Narrator', accent: 'Australian English', duration: '10s', file: '/samples/calm_narrator.wav' },
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
  const [lipSyncEnabled, setLipSyncEnabled] = useState(false)
  const [cloneName, setCloneName] = useState('')
  const audioRef = useRef(null)
  const fileInputRef = useRef(null)

  const steps = [
    { label: 'Upload Sample', icon: Upload },
    { label: 'AI Learns', icon: Sparkles },
    { label: 'Generate', icon: AudioWaveform },
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
        if (!response.ok) throw new Error('Failed to load sample voice audio')
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

  function handleCopyText() {
    navigator.clipboard?.writeText(clonedText)
  }

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute top-[15%] right-[-8%] w-[500px] h-[500px] bg-[#E040FB]/5 rounded-full blur-[120px] gradient-blob" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-[#6C3CE1]/5 rounded-full blur-[100px] gradient-blob-delayed" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#E040FB] font-semibold tracking-wider uppercase text-[11px]">Voice Cloning & Lip Sync</span>
          <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.5rem] font-bold mt-4 mb-5 tracking-tight">
            Clone Any Voice{' '}
            <span className="gradient-text">in Seconds</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload a 3-second audio sample. Our AI learns the voice characteristics and generates new speech that sounds exactly like the original — with lip sync for video avatars.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left - Interactive demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <h2 className="text-2xl font-bold">Voice Cloning Studio</h2>
                <p className="text-muted-foreground">
                  Create realistic voice clones with lip sync capabilities
                </p>
              </CardHeader>
              <CardContent>
                {/* Step indicator */}
                <div className="mb-6 flex items-center justify-between">
                  {steps.map((step, i) => (
                    <div key={step.label} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        i <= activeStep
                          ? 'bg-gradient-to-br from-[#E040FB] to-[#F060FF]'
                          : 'border-muted'
                      }`}>
                        <step.icon className={`w-4 h-4 ${i <= activeStep ? 'text-white' : 'text-muted'}`} />
                      </div>
                      <span className={`text-[12px] font-medium hidden sm:block ${
                        i <= activeStep ? 'text-white' : 'text-muted'
                      }`}>
                        {step.label}
                      </span>
                      {i < steps.length - 1 && (
                        <div className={`w-8 sm:w-12 h-[2px] mx-1 rounded transition-colors ${
                          i < activeStep ? 'bg-[#E040FB]/50' : 'border-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Upload area */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Voice Sample</span>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 w-10"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <div>
                        <p className="text-sm font-medium">
                          {uploadedFile ? uploadedFile.name : 'No file selected'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          MP3, WAV, M4A — 3 to 30 seconds
                        </p>
                      </div>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      uploadedFile
                        ? 'border-success/50 bg-success/5'
                        : 'border-muted hover:border-primary/30'
                    }`}
                  >
                    {uploadedFile ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" />
                        <p className="text-sm font-medium text-success">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted mx-auto mb-3" />
                        <p className="text-sm text-muted">Drop audio file here or click to upload</p>
                        <p className="text-xs text-muted-foreground">MP3, WAV, M4A — 3 to 30 seconds</p>
                      </>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Sample voices */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Or Try a Sample Voice</span>
                  </div>
                  <div className="grid gap-4">
                    {sampleVoices.map((voice, i) => (
                      <Button
                        key={voice.name}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectSampleVoice(i)}
                        className={`flex items-center gap-3 ${
                          selectedVoice === i
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-muted hover:bg-muted/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                            selectedVoice === i ? 'bg-primary' : 'border-muted'
                          }`}>
                            <Mic className="w-3 h-3 text-white" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-medium text-foreground">{voice.name}</span>
                            <span className="text-xs text-muted">
                              {voice.accent} • {voice.duration}
                            </span>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Text input */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Text to Speak</span>
                  </div>
                  <textarea
                    value={clonedText}
                    onChange={(e) => setClonedText(e.target.value)}
                    placeholder="Type what you want the cloned voice to say..."
                    rows={4}
                    className="w-full min-h-[80px] resize-none border-border bg-background/50 px-4 py-2 text-sm font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Clone Name */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">Voice Profile Name</span>
                  </div>
                  <input
                    type="text"
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                    placeholder="e.g., My Custom Voice"
                    className="w-full border-border bg-background/50 px-4 py-2 text-sm font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Lip Sync Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Video className="w-4 h-4 text-primary" />
                      <div>
                        <span className="text-sm font-medium text-foreground">Lip Sync</span>
                        <p className="text-xs text-muted">Sync voice with avatar mouth movement</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={lipSyncEnabled}
                      onChange={(e) => setLipSyncEnabled(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>

                {/* Generate button */}
                <div className="mt-6">
                  <Button
                    onClick={handleClone}
                    disabled={isCloning || !clonedText.trim()}
                    className="w-full py-3 px-6 text-sm font-medium"
                  >
                    {isCloning ? (
                      <>
                        <div className="h-4 w-4 border border-muted border-t-white rounded-full animate-spin" />
                        {activeStep === 1 ? 'Learning voice...' : 'Generating...'}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {uploadedFile ? 'Clone Uploaded Voice' : `Clone ${sampleVoices[selectedVoice].name}`}
                      </>
                    )}
                  </Button>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-destructive">{error}</span>
                    </div>
                  </div>
                )}

                {/* Result */}
                {activeStep === 2 && !isCloning && clonedAudioUrl && (
                  <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm font-medium text-success">Voice cloned successfully</span>
                    </div>
                    {cloneName && (
                      <p className="text-xs text-muted mt-2">Profile: {cloneName}</p>
                    )}
                    <div className="mt-4 flex items-center gap-3">
                      <Button
                        onClick={handlePlay}
                        variant="outline"
                        className="flex items-center gap-2 px-4 py-2 text-sm"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3 h-3" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            Play
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="flex items-center gap-2 px-4 py-2 text-sm"
                      >
                        <Download className="w-3 h-3" />
                        Download WAV
                      </Button>
                      <Button
                        onClick={handleCopyText}
                        variant="outline"
                        className="flex items-center gap-2 px-4 py-2 text-sm"
                      >
                        <Copy className="w-3 h-3" />
                        Copy Text
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right - Features + info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <h2 className="text-2xl font-bold">Your Voice. Your Data. Your Control.</h2>
                <p className="text-muted-foreground">
                  Experience secure, private voice cloning with local processing
                </p>
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-sm text-muted-foreground">
                  Unlike cloud-based cloning services, ClearSpeak runs entirely on your machine. Your voice samples never leave your device. Zero cloud dependency, zero data leakage.
                </p>

                {/* Feature list */}
                <div className="space-y-3">
                  {[
                    'Zero-shot cloning from just 3 seconds of audio',
                    'Preserves tone, accent, and speaking style',
                    'Works in 200+ languages',
                    'Runs locally — your voice data never leaves your machine',
                    'Export as WAV or MP3',
                    'Batch processing for large volumes',
                    'Lip sync for video avatars',
                    'Voice profile naming and management',
                  ].map((feature, i) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Audio wave visualization */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold">Voice Profile Preview</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <AudioWaveform className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Voice Profile</span>
                      </div>
                      <div className="flex items-end gap-2 h-16">
                        {[...Array(40)].map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 bg-gradient-to-t from-primary/40 to-secondary/60 rounded-full min-w-[2px] ${
                              i % 3 === 0
                                ? 'animate-[pulse_2s_ease-in-out_infinite]'
                                : i % 3 === 1
                                  ? 'animate-[pulse_3s_ease-in-out_infinite_delay-1s]'
                                  : 'animate-[pulse_4s_ease-in-out_infinite_delay-2s]'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                        <span>{sampleVoices[selectedVoice].name}</span>
                        <span>{sampleVoices[selectedVoice].accent}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Separator className="my-6" />

                {/* Lip Sync Preview */}
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold">Lip Sync Preview</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-success" />
                        <span className="text-sm font-medium text-muted-foreground">Lip Sync Preview</span>
                      </div>
                      <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                        {/* Avatar placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-muted/20 flex items-center justify-center">
                            <Volume2 className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        {/* Animated mouth */}
                        <motion.div
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-3 bg-primary/60 rounded-full"
                          animate={{
                            scaleY: [1, 1.5, 1, 1.3, 1],
                            scaleX: [1, 0.8, 1, 1.2, 1],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          style={{ originX: 0.5, originY: 0.5 }}
                        />
                        {/* Lip sync indicator */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 bg-success/20 rounded-full">
                          <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                          <span className="text-xs text-success font-medium">LIP SYNC ACTIVE</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
)
}