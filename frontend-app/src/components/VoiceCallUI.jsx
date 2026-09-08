import { useState, useEffect, useRef } from 'react'
import {
  getChannels,
  getCallHistory,
  createCall,
  joinCall,
  endCall,
  toggleMute,
  toggleScreenShare,
  toggleRecording,
  getChannelSummary,
} from '../api/platform'

export default function VoiceCallUI() {
  const [channels, setChannels] = useState([])
  const [activeCall, setActiveCall] = useState(null)
  const [callHistory, setCallHistory] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [summary, setSummary] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [callType, setCallType] = useState('group')
  const timerRef = useRef(null)

  const userId = 'user_' + useState(() => Math.random().toString(36).slice(2, 8))[0]

  useEffect(() => {
    loadChannels()
    loadHistory()
  }, [])

  useEffect(() => {
    if (activeCall?.state === 'active') {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [activeCall?.state])

  async function loadChannels() {
    try {
      const data = await getChannels()
      setChannels(data.channels || [])
    } catch { /* backend offline */ }
  }

  async function loadHistory() {
    try {
      const data = await getCallHistory()
      setCallHistory(data.history || [])
    } catch { /* backend offline */ }
  }

  async function startCall() {
    try {
      const res = await createCall(selectedChannel || undefined, userId, callType)
      setActiveCall(res)
      setIsMuted(false)
      setIsScreenSharing(false)
      setIsRecording(false)
      setCallDuration(0)
      setSummary('')
    } catch { /* backend offline */ }
  }

  async function joinExistingCall(callId) {
    try {
      await joinCall(callId, userId, 'User')
      loadHistory()
    } catch { /* backend offline */ }
  }

  async function handleEndCall() {
    if (!activeCall) return
    try {
      await endCall(activeCall.call_id, userId)
      setActiveCall(null)
      setCallDuration(0)
      loadHistory()
    } catch { /* backend offline */ }
  }

  async function handleMute() {
    if (!activeCall) return
    try {
      await toggleMute(activeCall.call_id, userId)
      setIsMuted(!isMuted)
    } catch { /* backend offline */ }
  }

  async function handleScreenShare() {
    if (!activeCall) return
    try {
      await toggleScreenShare(activeCall.call_id, userId)
      setIsScreenSharing(!isScreenSharing)
    } catch { /* backend offline */ }
  }

  async function handleRecording() {
    if (!activeCall) return
    try {
      await toggleRecording(activeCall.call_id, userId)
      setIsRecording(!isRecording)
    } catch { /* backend offline */ }
  }

  async function handleSummarize() {
    if (!activeCall) return
    try {
      const data = await getChannelSummary(activeCall.call_id)
      setSummary(data.summary)
    } catch { /* backend offline */ }
  }

  function formatDuration(secs) {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="voice-call-ui">
      <div className="voice-call-ui__header">
        <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Voice Calls</h2>
      </div>

      <div className="voice-call-ui__grid">
        <div className="voice-call-ui__panel voice-call-ui__controls">
          <span className="overline-dot">New Call</span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label className="input-label">Channel</label>
              <select
                className="input"
                value={selectedChannel}
                onChange={e => setSelectedChannel(e.target.value)}
              >
                <option value="">Select channel (optional)</option>
                {channels.map(ch => (
                  <option key={ch.channel_id} value={ch.channel_id}>{ch.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Call Type</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['direct', 'group', 'video'].map(type => (
                  <button
                    key={type}
                    className={`btn ${callType === type ? 'btn--primary' : 'btn--secondary'} btn--sm`}
                    onClick={() => setCallType(type)}
                    style={{ flex: 1, textTransform: 'capitalize', fontSize: '0.75rem' }}
                  >
                    {type === 'video' ? '📹' : type === 'group' ? '👥' : '👤'} {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn btn--primary"
              onClick={startCall}
              disabled={!!activeCall}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {activeCall ? 'Call Active' : '📞 Start Call'}
            </button>
          </div>

          {activeCall && (
            <div className="voice-call-ui__active">
              <div className="voice-call-ui__status">
                <span className="voice-call-ui__dot" />
                <span>{activeCall.state}</span>
                <span className="voice-call-ui__timer">{formatDuration(callDuration)}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className={`btn ${isMuted ? 'btn--primary' : 'btn--secondary'} btn--sm`}
                  onClick={handleMute}
                  style={{ fontSize: '0.75rem' }}
                >
                  {isMuted ? '🔇 Unmute' : '🎙 Mute'}
                </button>
                <button
                  className={`btn ${isScreenSharing ? 'btn--primary' : 'btn--secondary'} btn--sm`}
                  onClick={handleScreenShare}
                  style={{ fontSize: '0.75rem' }}
                >
                  {isScreenSharing ? '⏹ Stop Share' : '🖥 Share'}
                </button>
                <button
                  className={`btn ${isRecording ? 'btn--primary' : 'btn--secondary'} btn--sm`}
                  onClick={handleRecording}
                  style={{ fontSize: '0.75rem' }}
                >
                  {isRecording ? '⏹ Stop Rec' : '⏺ Record'}
                </button>
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={handleSummarize}
                  style={{ fontSize: '0.75rem' }}
                >
                  ✨ Summarize
                </button>
                <button
                  className="btn btn--primary btn--sm"
                  onClick={handleEndCall}
                  style={{ fontSize: '0.75rem', background: '#EF4444', borderColor: '#EF4444' }}
                >
                  📞 End
                </button>
              </div>

              {summary && (
                <div className="ai-summary__content" style={{ marginTop: '0.5rem' }}>
                  {summary}
                </div>
              )}

              <div style={{ marginTop: '0.75rem' }}>
                <span className="caption" style={{ color: 'var(--text-tertiary)' }}>
                  Participants: {activeCall.participants?.join(', ') || activeCall.caller_id}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="voice-call-ui__panel">
          <span className="overline-dot">Call History</span>
          {callHistory.length === 0 && (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>No call history yet</p>
          )}
          {callHistory.map((call, i) => (
            <div key={call.call_id || i} className="voice-call-ui__history-item">
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="voice-call-ui__history-type">{call.call_type}</span>
                <span className="voice-call-ui__history-id">{call.call_id}</span>
              </div>
              <span className="voice-call-ui__history-duration">
                {call.duration_seconds ? `${Math.round(call.duration_seconds)}s` : 'N/A'}
              </span>
              {call.state === 'active' && (
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => joinExistingCall(call.call_id)}
                  style={{ fontSize: '0.625rem', padding: '0.25rem 0.5rem' }}
                >
                  Join
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
