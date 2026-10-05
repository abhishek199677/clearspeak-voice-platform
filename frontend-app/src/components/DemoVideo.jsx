import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Maximize2, Globe, Volume2, Search, Check } from 'lucide-react'
import { Button, Badge } from './ui/PremiumComponents'
import { getApiBaseUrl } from '@/api/platform'

const EASE = [0.16, 1, 0.3, 1]

// All 22 Scheduled Indian Languages + English
export const LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', popular: true },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', popular: true },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', popular: true },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', popular: true },
  { code: 'mr', name: 'Marathi', native: 'मराठी', popular: true },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', popular: true },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', popular: true },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', popular: true },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', popular: true },
  { code: 'ur', name: 'Urdu', native: 'اردو', popular: true },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', popular: false },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', popular: false },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', popular: false },
  { code: 'gom', name: 'Konkani', native: 'कोंकणी', popular: false },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', popular: false },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', popular: false },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', popular: false },
  { code: 'ks', name: 'Kashmiri', native: 'کٲشُر', popular: false },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', popular: false },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', popular: false },
  { code: 'brx', name: 'Bodo', native: 'बड़ो', popular: false },
  { code: 'mni', name: 'Manipuri', native: 'ꯃꯤꯇꯩꯂꯣꯟ', popular: false },
  { code: 'en', name: 'English', native: 'English', popular: true },
]

export const NARRATION_TEXTS = {
  en: 'Watch ClearSpeak translate live conversations across 22 Indian languages in real time. Every voice, understood, everywhere.',
  hi: '22 भारतीय भाषाओं में लाइव बातचीत का वास्तविक समय में अनुवाद करते हुए क्लियरस्पीक देखें। हर आवाज़, हर जगह समझी जाती है।',
  bn: '২২টি ভারতীয় ভাষায় লাইভ কথোপকথনের বাস্তব সময়ে অনুবাদ করতে দেখুন ক্লিয়ারস্পিক। প্রতিটি কণ্ঠস্বর সর্বত্র বোধগম্য।',
  ta: '22 இந்திய மொழிகளில் நேரலை உரையாடல்களை நிகழ்நேரத்தில் மொழிபெயர்க்கும் க்ளியர்ஸ்பீக்-ஐக் காணுங்கள். ஒவ்வொரு குரலும் எங்கும் புரிந்துகொள்ளப்படுகிறது.',
  te: '22 భారతీయ భాషల్లో ప్రత్యక్ష సంభాషణలను నిజ సమయంలో అనువదిస్తున్న క్లియర్‌స్పీక్‌ను చూడండి. ప్రతి గొంతు అంతటా అర్థమవుతుంది.',
  ml: '22 ഇന്ത്യൻ ഭാഷകളിൽ തത്സമയ സംഭാഷണങ്ങൾ വ്യാഖ്യാനിക്കുന്ന ക്ലിയർസ്പീക്ക് കാണൂ. ഓരോ ശബ്ദവും എവിടെയും മനസ്സിലാക്കപ്പെടുന്നു.',
  kn: '22 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ನೇರ ಸಂಭಾಷಣೆಗಳನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ಅನುವಾದಿಸುತ್ತಿರುವ ಕ್ಲಿಯರ್‌ಸ್ಪೀಕ್ ನೋಡಿ. ಪ್ರತಿ ಧ್ವನಿಯೂ ಎಲ್ಲೆಡೆ ಅರ್ಥವಾಗುತ್ತದೆ.',
  gu: '22 ભારતીય ભાષાઓમાં લાઈવ વાર્તાલાપનું વાસ્તવિક સમયે અનુવાદ કરતાં ક્લિયરસ્પીક જુઓ. દરેક અવાજ સર્વત્ર સમજાય છે.',
  mr: '22 भारतीय भाषांत लाइव संवादांचे वेळेवर अनुवाद करताना क्लियरस्पीक पहा. प्रत्येक आवाज ठिकाणी समजली जाते.',
  pa: '22 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਲਾਈਵ ਗੱਲਬਾਤ ਦਾ ਰੀਅਲ-ਟਾਈਮ ਅਨੁਵਾਦ ਕਰਦਾ ਕਲੀਅਰਸਪੀਕ ਵੇਖੋ। ਹਰ ਆਵਾਜ਼ ਹਰ ਥਾਂ ਸਮਝੀ ਜਾਂਦੀ ਹੈ।',
  ur: '22 ہندوستانی زبانوں میں لائیو گفتگو کا حقیقی وقت میں ترجمہ کرتے ہوئے کلیئر اسپیک دیکھیں۔ ہر آواز ہر جگہ سمجھی جاتی ہے۔',
  as: '২২টি ভাৰতীয় ভাষাত লাইভ কথোপকথনৰ প্ৰকৃত সময়ত অনুবাদ কৰি থকা ক্লিয়াৰস্পিক চাওক। প্ৰতিটো কণ্ঠস্বৰ সৰ্বত্ৰ বুজি পোৱা যায়।',
  or: '୨୨ଟି ଭାରତୀୟ ଭାଷାରେ ଲାଇଭ୍ କଥାବାର୍ତ୍ତାର ପ୍ରକୃତ ସମୟରେ ଅନୁବାଦ କରୁଥିବା କ୍ଲିୟର୍ସ୍ପିକ୍ ଦେଖନ୍ତୁ। ପ୍ରତିଟି ସ୍ଵର ସର୍ବତ୍ର ବୁଝାପଡ଼େ।',
  sa: '२२ भारतीयभाषासु सजीवसंवादस्य वास्तविकसमये अनुवादं कुर्वन्तं क्लियरस्पीकं पश्यत। प्रत्येकः स्वरः सर्वत्र अवगच्छ्यते।',
  gom: '22 भारतीय भासांत थें लायव्ह संवादांचो रियल-टायमांत अनुवाद करपी क्लियरस्पीक पळयात. दर एक आवाज सगळ्यांग खरो मुळता.',
  doi: '22 भारतीय भाषां विच लाइव गल्लां दा असली समय विच अनुवाद करदे क्लियरस्पीक देखो। हर आवाज हर थां समझी जांदी ऐ।',
  mai: '22 भारतीय भाषा मे लाइव बातचीत के रियल टाइम मे अनुवाद करैत अछि क्लियरस्पीक। हर आवाज सब ठाम बुझल जाइत अछि।',
  sat: 'ᱠᱞᱤᱭᱟᱨᱥᱯᱤᱠ ᱥᱟᱨᱵᱟᱣ ᱡᱟᱦᱟᱸ ᱫᱩᱦᱲᱟᱹ ᱨᱮ ᱞᱟᱭᱤᱵᱽ ᱜᱟᱞᱢᱟᱨᱟᱣ ᱞᱟᱛᱩᱭᱮᱢ ᱢᱮ. ᱢᱮᱱᱟᱜ ᱥᱟᱶ ᱠᱟᱛᱚ ᱠᱮᱞ ᱱᱤᱛᱚᱢ ᱵᱩᱦᱟᱹᱨᱟᱭ ᱢᱮ.',
  ks: '22 ہندستانؠ زبانان چھ لایو گوفتگو کا حقیقی وقت چھ ترجمہ کرنہٕ ٹھٲٹھ کلیٖر سپیک دیوُن۔ ہر آواز ہر شے سمجھنہٕ ییوان۔',
  mni: 'ꯂꯨꯛ ꯂꯣꯟ ꯲꯲ ꯭ꯃꯤꯇꯨꯝ ꯭ꯃꯤꯃꯛ꯭ ꯗꯣꯟꯗꯦ ꯑꯃꯁꯣꯢ ꯃꯨꯜ꯫ꯁꯣꯏ ꯆꯥꯎꯕ ꯃꯤꯇꯩꯂꯣꯟ꯭ ꯊꯛ꯭ꯇꯦꯗꯦ ꯉꯁꯣꯢ ꯈꯤꯃꯥꯛ꯭ꯀꯥ ꯂꯨꯖꯦꯜ꯭ꯁꯛꯇꯣꯢ ꯂꯣꯞꯈꯤ꯫',
  brx: '22 भारतीय भाषानि मा बियोरि समयाव अनुवादा दिसा क्लियरस्पीक नोनो। नोनो आवखाया नोनो थायाव माननाय होबाय।',
  sd: '22 ھندستاني ٻولين ۾ سڌاري ڳالهائي جي حققي وقت ۾ ترجمو ڪندي كلير اسپيڪ ڏسو. هر آواز هر ٺي سمجھي وڃي آهي.',
  ne: '२२ भारतीय भाषाहरूमा लाइभ कुराकानीको वास्तविक समयमा अनुवाद गर्दै क्लियरस्पीक हेर्नुहोस्। हरेक आवाज सबैतिर बुझिन्छ।',
}

const ENGLISH_TRANSLATION =
  'Watch ClearSpeak translate live conversations across 22 Indian languages in real time. Every voice, understood, everywhere.'

export default function DemoVideo() {
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const langRef = useRef('original')
  const replayTimerRef = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [lang, setLang] = useState('original')
  const [caption, setCaption] = useState('')
  const [mutedByAutoplay, setMutedByAutoplay] = useState(false)
  const [filterTab, setFilterTab] = useState('all') // 'all' | 'popular'
  const [searchQuery, setSearchQuery] = useState('')

  // Video and Audio Synchronization
  useEffect(() => {
    const video = videoRef.current
    const audio = audioRef.current
    if (!video) return

    const handlePlay = () => {
      setPlaying(true)
      if (langRef.current !== 'original' && audio) {
        audio.play().catch(() => {})
      }
    }

    const handlePause = () => {
      setPlaying(false)
      if (langRef.current !== 'original' && audio) {
        audio.pause()
      }
    }

    const handleVolume = () => {
      if (langRef.current !== 'original' && audio) {
        audio.volume = video.volume
        audio.muted = video.muted
      }
    }

    const handleEnded = () => {
      setPlaying(false)
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('volumechange', handleVolume)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('volumechange', handleVolume)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Audio loop replay when video is still running
  const handleAudioEnded = () => {
    const video = videoRef.current
    if (video && !video.paused && !video.ended && langRef.current !== 'original') {
      if (replayTimerRef.current) clearTimeout(replayTimerRef.current)
      replayTimerRef.current = setTimeout(() => {
        const v = videoRef.current
        const a = audioRef.current
        if (v && !v.paused && !v.ended && a && langRef.current !== 'original') {
          a.currentTime = 0
          a.play().catch(() => {})
        }
      }, 2000)
    }
  }

  // Handle direct play trigger from 'Listen to a demo' button
  useEffect(() => {
    const handleDirectPlay = () => {
      const video = videoRef.current
      const audio = audioRef.current
      if (!video) return

      if (langRef.current === 'original') {
        video.muted = false
        setMutedByAutoplay(false)
        video.play().catch(() => {
          video.muted = true
          video.play().catch(() => {})
        })
      } else {
        video.muted = true
        video.play().catch(() => {})
        if (audio) {
          audio.muted = false
          audio.play().catch(() => {})
        }
      }
    }

    window.addEventListener('clearspeak:play-demo', handleDirectPlay)
    return () => window.removeEventListener('clearspeak:play-demo', handleDirectPlay)
  }, [])

  // Autoplay on mount (tries unmuted first, falls back to muted)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let dead = false

    const tryPlay = () => {
      if (dead || !video.paused) return
      video.play().catch(() => {
        if (dead || !video.paused) return
        video.muted = true
        video
          .play()
          .then(() => !dead && setMutedByAutoplay(true))
          .catch(() => {})
      })
    }

    tryPlay()
    video.addEventListener('loadeddata', tryPlay)
    video.addEventListener('canplay', tryPlay)

    const unblock = () => {
      const v = videoRef.current
      if (!v || langRef.current !== 'original') return
      if (v.muted) {
        v.muted = false
        setMutedByAutoplay(false)
        if (v.paused) v.play().catch(() => {})
      }
      window.removeEventListener('pointerdown', unblock)
    }
    window.addEventListener('pointerdown', unblock)

    return () => {
      dead = true
      if (replayTimerRef.current) clearTimeout(replayTimerRef.current)
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
      window.removeEventListener('pointerdown', unblock)
    }
  }, [])

  function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  function unmute() {
    const video = videoRef.current
    if (!video || langRef.current !== 'original') return
    video.muted = false
    setMutedByAutoplay(false)
    if (video.paused) video.play().catch(() => {})
  }

  function selectLanguage(code) {
    setLang(code)
    langRef.current = code
    if (replayTimerRef.current) clearTimeout(replayTimerRef.current)

    const video = videoRef.current
    const audio = audioRef.current

    if (code === 'original') {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
      setCaption('')
      if (video) {
        video.muted = false
        setMutedByAutoplay(false)
        if (video.paused) video.play().catch(() => {})
      }
      return
    }

    // Dubbed language selected
    const text = NARRATION_TEXTS[code] || ''
    setCaption(text)

    if (video) {
      video.muted = true
      setMutedByAutoplay(false)
      if (video.paused || video.ended) {
        video.play().catch(() => {})
      }
    }

    if (audio) {
      audio.pause()
      audio.src = `/samples/demo-narration/${code}.mp3`
      audio.currentTime = 0
      audio.volume = video ? video.volume : 1
      audio.muted = false
      const promise = audio.play()
      if (promise !== undefined) {
        promise.catch(() => {
          // Fallback to backend narration endpoint
          audio.src = `${getApiBaseUrl()}/demo/narration/${code}`
          audio.currentTime = 0
          audio.play().catch(() => {})
        })
      }
    }
  }

  const activeLangObj = LANGUAGES.find((l) => l.code === lang)
  const isOriginal = lang === 'original'

  const filteredLanguages = LANGUAGES.filter((l) => {
    if (filterTab === 'popular' && !l.popular) return false
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q) || l.code.includes(q)
  })

  return (
    <section id="demo" className="py-14 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Hidden audio element for synchronous multi-language narration */}
      <audio
        ref={audioRef}
        preload="auto"
        onEnded={handleAudioEnded}
        onError={() => {
          if (langRef.current !== 'original' && audioRef.current) {
            audioRef.current.src = `${getApiBaseUrl()}/demo/narration/${langRef.current}`
            audioRef.current.play().catch(() => {})
          }
        }}
      />

      {/* Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center justify-center gap-3 mb-3"
        >
          <span className="text-[11px] tracking-[0.3em] uppercase text-[#9B6DFF] font-semibold">(02)</span>
          <span className="text-[11px] tracking-[0.3em] uppercase text-gray-500">Live Demo</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
          <Badge variant="orange">Product demo</Badge>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-light text-[clamp(1.85rem,4vw,2.75rem)] leading-tight tracking-tight text-white mb-2"
        >
          Watch ClearSpeak work.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="text-[13px] sm:text-[14px] text-gray-400"
        >
          Experience real-time voice translation in all 22 Indian scheduled languages. Click any language below to hear the demo live in that language.
        </motion.p>
      </div>

      {/* Compact Video Frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative mx-auto w-full max-w-[480px] sm:max-w-[500px]"
      >
        <div className="absolute -inset-4 pointer-events-none gradient-blob opacity-40">
          <div className="w-full h-full bg-[#6C3CE1]/30 rounded-full blur-[70px]" />
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/[0.14] bg-black shadow-[0_20px_60px_-15px_rgba(108,60,225,0.4)]">
          <video
            ref={videoRef}
            src="/demo.mp4"
            autoPlay
            controls
            playsInline
            preload="auto"
            className="block w-full aspect-video object-cover"
          />

          {/* Floating Language Indicator Badge */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-white/15 text-[11px] font-medium text-white/90 backdrop-blur-md shadow-sm">
              {!isOriginal && (
                <span className="flex items-center gap-0.5 text-[#FF6B35]">
                  <span className="w-1 h-3 rounded-full bg-[#FF6B35] animate-pulse" />
                  <span className="w-1 h-2 rounded-full bg-[#FF6B35] animate-pulse delay-75" />
                  <span className="w-1 h-3 rounded-full bg-[#FF6B35] animate-pulse delay-150" />
                </span>
              )}
              {isOriginal ? (
                <>
                  <Volume2 className="w-3 h-3 text-[#9B6DFF]" />
                  Original Audio
                </>
              ) : (
                <>
                  Speaking: <span className="text-white font-semibold">{activeLangObj?.native}</span> ({activeLangObj?.name})
                </>
              )}
            </span>
          </div>

          {/* Unmute prompt if muted by browser autoplay on original track */}
          {playing && mutedByAutoplay && isOriginal && (
            <button
              type="button"
              onClick={unmute}
              className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#FF6B35] text-white text-[11px] font-medium shadow-md hover:bg-[#ff7b4b] transition-all cursor-pointer"
            >
              Tap for sound
            </button>
          )}

          {/* Subtle center play icon if paused */}
          {!playing && (
            <div
              onClick={toggle}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-white text-[#08080D] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Live Captions in Selected Language */}
      <div className="mx-auto mt-4 max-w-[480px] sm:max-w-[500px]">
        {caption ? (
          <motion.div
            key={lang}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm text-center"
          >
            <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-[#FF6B35] font-semibold mb-1">
              <Globe className="w-3 h-3" />
              {activeLangObj?.native} ({activeLangObj?.name}) Narration
            </div>
            <p className="text-[14px] text-white font-medium leading-snug">
              &ldquo;{caption}&rdquo;
            </p>
            <p className="mt-1.5 text-[11.5px] text-gray-400 italic">
              &ldquo;{ENGLISH_TRANSLATION}&rdquo;
            </p>
          </motion.div>
        ) : (
          <div className="text-center py-2 text-[12px] text-gray-500">
            Original soundtrack playing. Click any language below to hear the voice dub live in all 22 Indian languages!
          </div>
        )}
      </div>

      {/* 22 Indian Languages Switcher */}
      <div className="mt-8 pt-6 border-t border-white/[0.08]">
        {/* Controls row: Tabs + Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-white/90 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#FF6B35]" />
              Listen in 22 Languages:
            </span>
            <div className="flex items-center bg-white/[0.05] p-0.5 rounded-lg border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  filterTab === 'all' ? 'bg-[#6C3CE1] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                All (22)
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('popular')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  filterTab === 'popular' ? 'bg-[#6C3CE1] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Popular
              </button>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-48">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find language..."
              className="w-full pl-7 pr-3 py-1 text-[11px] rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]"
            />
          </div>
        </div>

        {/* Language Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-h-[190px] overflow-y-auto pr-1 py-1">
          {/* Original Audio Option */}
          <button
            type="button"
            onClick={() => selectLanguage('original')}
            aria-pressed={lang === 'original'}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              lang === 'original'
                ? 'bg-white text-[#08080D] shadow-[0_4px_12px_rgba(255,255,255,0.25)] ring-2 ring-white/50'
                : 'text-gray-300 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.1] hover:text-white'
            }`}
          >
            {lang === 'original' && <Check className="w-3 h-3 text-[#08080D]" />}
            Original Audio
          </button>

          {/* All 22 Indian Language Chips */}
          {filteredLanguages.map((l) => {
            const isActive = lang === l.code
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => selectLanguage(l.code)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 rounded-full text-[12px] transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#FF885B] text-white font-semibold shadow-[0_4px_16px_rgba(255,107,53,0.35)] ring-2 ring-[#FF6B35]/60 scale-105'
                    : 'text-gray-300 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/25 hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="flex items-center gap-0.5">
                    <span className="w-1 h-2 rounded-full bg-white animate-pulse" />
                    <span className="w-1 h-3 rounded-full bg-white animate-pulse delay-75" />
                  </span>
                )}
                <span className="font-medium">{l.native}</span>
                <span className={`text-[10px] ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                  ({l.name})
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Action footer */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[12px] text-gray-500 border-t border-white/[0.04] pt-4">
        <span>Instant neural speech dubbing across all 22 official Indian languages.</span>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => videoRef.current?.requestFullscreen?.()}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Watch fullscreen
          </Button>
        </div>
      </div>
    </section>
  )
}
