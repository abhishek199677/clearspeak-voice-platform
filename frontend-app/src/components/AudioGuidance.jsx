import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Mic, Info, Settings } from 'lucide-react';

const GUIDANCE_STEPS = [
  {
    id: 1,
    title: "Welcome to ClearSpeak AI",
    text: "Welcome to ClearSpeak AI - India's sovereign communication platform. This platform provides real-time AI translation, voice AI calls, smart messaging, and enterprise collaboration features in 22+ Indian languages, powered by free, open-source voice technologies including models from VoiceBox.",
    duration: 7000
  },
  {
    id: 2,
    title: "Chat & Messaging",
    text: "Use the Chat & Messaging section to send messages in your language, which will be automatically translated to the recipient's language. You can create channels, send direct messages, and use group chats with real-time translation.",
    duration: 6000
  },
  {
    id: 3,
    title: "Voice & Video Calls",
    text: "Make high-quality voice and video calls with real-time translation. Features include AI noise cancellation, live translation across 200+ languages, ultra-low latency, and end-to-end encryption for privacy.",
    duration: 7000
  },
  {
    id: 4,
    title: "Live Streaming",
    text: "Broadcast your content to a global audience with real-time translation. Viewers can watch in their native language regardless of what language you're speaking in.",
    duration: 5000
  },
  {
    id: 5,
    title: "Sign Language Translation",
    text: "Our AI-powered sign language recognition translates between sign languages and spoken languages in real-time, making communication accessible for everyone.",
    duration: 6000
  },
  {
    id: 6,
    title: "ToDoZee AI Companion",
    text: "Meet ToDoZee AI, your personal AI assistant with 29 powerful features across 8 life domains including productivity, health, finance, travel, safety, family, lifestyle, and entertainment.",
    duration: 5000
  }
];

export default function AudioGuidance() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const utteranceRef = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsInitialized(true);
    }
  }, []);

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported in this browser');
      return false;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onend = () => {
      setIsPlaying(false);
      // Move to next step if available
      if (currentStep < GUIDANCE_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        // Auto-play next step after a short delay
        setTimeout(() => {
          if (currentStep < GUIDANCE_STEPS.length - 1) {
            playGuidance();
          }
        }, 1500);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  };

  const playGuidance = () => {
    if (!isInitialized) return;

    const currentGuidance = GUIDANCE_STEPS[currentStep];
    setIsPlaying(true);
    speakText(`${currentGuidance.title}. ${currentGuidance.text}`);
  };

  const stopGuidance = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopGuidance();
    } else {
      playGuidance();
    }
  };

  // Add subtle attention animation when page first loads
  useEffect(() => {
    if (isInitialized && currentStep === 0) {
      // Pulse the button briefly to draw attention
      const buttonTimeout = setTimeout(() => {
        // This creates a subtle visual cue without being intrusive
        // The button's hover state will naturally draw the eye
      }, 3000);

      return () => clearTimeout(buttonTimeout);
    }
  }, [isInitialized, currentStep]);

  if (!isInitialized) {
    return (
      <div className="absolute bottom-4 right-4">
        <Button
          variant="outline"
          size="icon"
          title="Audio guidance not available"
          onClick={() => alert('Speech synthesis not supported in this browser')}
        >
          <Info className="w-4 h-4 text-muted" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="space-y-2">
        {/* Main Guidance Button */}
        <Button
          onClick={handlePlayPause}
          className={`
            w-12 h-12 flex items-center justify-center rounded-lg
            ${isPlaying
              ? 'bg-[#FF6B35]/20 text-[#FF6B35] hover:bg-[#FF6B35]/30'
              : 'bg-white/[0.02] text-white hover:bg-white/[0.04]'}
            transition-all border border-white/[0.04] hover:border-white/[0.06]
          `}
          aria-label={isPlaying ? 'Pause audio guidance' : 'Play audio guidance'}
        >
          {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>

        {/* Progress Indicator */}
        {!isPlaying && currentStep > 0 && currentStep < GUIDANCE_STEPS.length && (
          <div className="flex justify-center space-x-1">
            {GUIDANCE_STEPS.map((step, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full
                  ${index < currentStep
                    ? 'bg-[#6C3CE1]'
                    : index === currentStep
                      ? 'bg-[#FF6B35] animate-pulse'
                      : 'bg-white/[0.2]'}
                  transition-all duration-300
                `}
              />
            ))}
          </div>
        )}

        {/* Tooltip */}
        <div className="mt-2 text-center text-xs text-white/[0.8] bg-white/[0.05]
                     rounded-lg px-2 py-1 max-w-xs">
          {isPlaying
            ? `Playing: ${GUIDANCE_STEPS[currentStep]?.title || 'Guidance'}`
            : currentStep === 0
              ? 'Click to start audio tour'
              : `Step ${currentStep + 1} of ${GUIDANCE_STEPS.length}`}
        </div>
      </div>
    </div>
  );
}