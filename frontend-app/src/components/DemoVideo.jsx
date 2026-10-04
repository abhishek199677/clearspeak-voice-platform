import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Maximize2 } from 'lucide-react'
import { Button, Badge } from './ui/PremiumComponents'

const EASE = [0.16, 1, 0.3, 1]

export default function DemoVideo() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play().catch(() => {})
    else video.pause()
  }

  return (
    <section id="demo" className="py-24 sm:py-36 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="mb-14 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#9B6DFF]">(02)</span>
          <span className="text-[11px] tracking-[0.3em] uppercase text-gray-500">In Motion</span>
          <span className="h-px flex-1 bg-white/[0.08]" />
          <Badge variant="orange">Product demo</Badge>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-light text-[clamp(2rem,5.5vw,4rem)] leading-[1.05] tracking-tight text-white"
        >
          Watch ClearSpeak work.
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: EASE }}
        className="relative"
      >
        <div className="absolute -inset-8 pointer-events-none gradient-blob opacity-60">
          <div className="w-full h-full bg-[#6C3CE1]/25 rounded-full blur-[110px]" />
        </div>

        <div className="relative rounded-[24px] overflow-hidden border border-white/[0.1] bg-black shadow-[0_40px_120px_-40px_rgba(108,60,225,0.5)]">
          <video
            ref={videoRef}
            src="/demo.mp4"
            controls
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="block w-full aspect-video"
          />

          {!playing && (
            <button
              type="button"
              onClick={toggle}
              aria-label="Play demo video"
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/20 to-black/40 transition-colors hover:from-black/60"
            >
              <motion.span
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[#08080D] text-[14px] font-semibold shadow-[0_16px_48px_rgba(255,255,255,0.22)]"
              >
                <Play className="w-4 h-4 fill-current" />
                Play demo
              </motion.span>
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[13px] text-gray-500"
      >
        <span>Speech, chat, calls, live streams and accessibility — one continuous run.</span>
        <div className="flex items-center gap-5">
          <span className="inline-flex items-center gap-2">
            <Pause className="w-3.5 h-3.5" /> Captions &amp; controls built in
          </span>
          <span className="inline-flex items-center gap-2">
            <Maximize2 className="w-3.5 h-3.5" /> Fullscreen supported
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => videoRef.current?.requestFullscreen?.()}
          >
            Watch fullscreen
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
