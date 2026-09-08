import { useState, useEffect } from 'react'
import {
  getStreams,
  createStream,
  startStream,
  endStream,
} from '../api/platform'

export default function StreamManager() {
  const [streams, setStreams] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => { loadStreams() }, [])

  async function loadStreams() {
    try {
      const data = await getStreams()
      setStreams(data.streams || [])
    } catch { /* backend offline */ }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      await createStream(newTitle.trim(), newDesc.trim())
      setNewTitle('')
      setNewDesc('')
      setShowCreate(false)
      loadStreams()
    } catch { /* backend offline */ }
  }

  async function handleStart(streamId) {
    try {
      await startStream(streamId)
      loadStreams()
    } catch { /* backend offline */ }
  }

  async function handleEnd(streamId) {
    try {
      await endStream(streamId)
      loadStreams()
    } catch { /* backend offline */ }
  }

  const stateColors = {
    scheduled: 'var(--text-tertiary)',
    preparing: '#F59E0B',
    live: '#EF4444',
    paused: '#F59E0B',
    ended: 'var(--text-tertiary)',
  }

  return (
    <div className="stream-manager">
      <div className="stream-manager__header">
        <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Live Streams</h2>
        <button className="btn btn--primary btn--sm" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? '✕ Cancel' : '+ New Stream'}
        </button>
      </div>

      {showCreate && (
        <form className="stream-manager__form" onSubmit={handleCreate}>
          <input className="input" placeholder="Stream title" value={newTitle} onChange={e => setNewTitle(e.target.value)} autoFocus />
          <input className="input" placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <button className="btn btn--primary" type="submit">Create Stream</button>
        </form>
      )}

      {streams.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📡</p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>No streams yet. Create one to go live!</p>
        </div>
      )}

      <div className="stream-manager__grid">
        {streams.map(stream => (
          <div
            key={stream.stream_id}
            className={`stream-manager__card ${selected?.stream_id === stream.stream_id ? 'stream-manager__card--active' : ''}`}
            onClick={() => setSelected(stream)}
          >
            <div className="stream-manager__card-header">
              <span
                className="stream-manager__state"
                style={{ color: stateColors[stream.state] || 'var(--text-tertiary)' }}
              >
                ● {stream.state}
              </span>
              {stream.state === 'live' && (
                <span className="stream-manager__viewers">
                  👁 {stream.viewer_count || 0}
                </span>
              )}
            </div>
            <h4 className="stream-manager__title">{stream.title}</h4>
            {stream.description && (
              <p className="stream-manager__desc">{stream.description}</p>
            )}
            <div className="stream-manager__card-footer">
              {stream.state === 'scheduled' && (
                <button className="btn btn--primary btn--sm" onClick={(e) => { e.stopPropagation(); handleStart(stream.stream_id) }} style={{ fontSize: '0.625rem' }}>
                  ▶ Go Live
                </button>
              )}
              {(stream.state === 'live' || stream.state === 'paused') && (
                <button className="btn btn--primary btn--sm" onClick={(e) => { e.stopPropagation(); handleEnd(stream.stream_id) }} style={{ fontSize: '0.625rem', background: '#EF4444', borderColor: '#EF4444' }}>
                  ⏹ End
                </button>
              )}
              {stream.state === 'ended' && (
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                  {stream.duration_seconds ? `${Math.round(stream.duration_seconds)}s` : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
