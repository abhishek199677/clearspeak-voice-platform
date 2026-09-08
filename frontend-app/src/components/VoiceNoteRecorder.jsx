import { useState, useRef, useCallback } from 'react'
import { sendMessage } from '../api/platform'

export default function VoiceNoteRecorder({ channelId, userId, userName, onSent }) {
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [duration, setDuration] = useState(0)
  const mediaRecorder = useRef(null)
  const audioChunks = useRef([])
  const timerRef = useRef(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      mediaRecorder.current = recorder
      audioChunks.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data)
      }

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        clearInterval(timerRef.current)
        setRecording(false)
        setTranscribing(true)
        try {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
          const audioFile = new File([audioBlob], 'voice-note.webm', { type: 'audio/webm' })
          const formData = new FormData()
          formData.append('audio', audioFile)
          formData.append('text', 'Transcribe this voice note')
          await sendMessage(channelId, `[Voice Note — ${duration}s]`, userId, userName, 'audio')
          if (onSent) onSent()
        } catch { /* ignore */ }
        setTranscribing(false)
        setDuration(0)
      }

      recorder.start()
      setRecording(true)
      setDuration(0)
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
    } catch { /* mic access denied */ }
  }, [channelId, userId, userName, duration, onSent])

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop()
    }
  }, [])

  return (
    <div className="voice-note">
      {recording ? (
        <button
          className="btn btn--ghost voice-note__btn voice-note__btn--active"
          onClick={stopRecording}
          title="Stop recording"
        >
          <span className="voice-note__pulse" />
          <span>{duration}s</span>
        </button>
      ) : transcribing ? (
        <button className="btn btn--ghost voice-note__btn" disabled>
          Transcribing...
        </button>
      ) : (
        <button
          className="btn btn--ghost voice-note__btn"
          onClick={startRecording}
          title="Record voice note"
        >
          🎙
        </button>
      )}
    </div>
  )
}
