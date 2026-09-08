import { useState, useEffect } from 'react'
import { getChannels, createChannel } from '../api/platform'

export default function ChannelBrowser({ activeChannel, onSelect }) {
  const [channels, setChannels] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const data = await getChannels()
        setChannels(data.channels || [])
      } catch { /* backend offline */ }
      setLoading(false)
    }
    init()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      const res = await createChannel(newName.trim(), newDesc.trim())
      setChannels(prev => [...prev, {
        channel_id: res.channel_id,
        name: newName.trim(),
        description: newDesc.trim(),
        channel_type: 'public',
        members: [],
      }])
      setNewName('')
      setNewDesc('')
      setShowCreate(false)
    } catch { /* ignore */ }
  }

  const channelTypes = { public: '#', private: '🔒', group: '👥', direct: '💬' }

  return (
    <div className="channel-browser">
      <div className="channel-browser__header">
        <span className="overline-dot" style={{ margin: 0 }}>Channels</span>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => setShowCreate(!showCreate)}
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
        >
          {showCreate ? '✕' : '+ New'}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="channel-browser__form">
          <input
            className="input"
            placeholder="Channel name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            autoFocus
          />
          <input
            className="input"
            placeholder="Description (optional)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
          />
          <button className="btn btn--primary btn--sm" type="submit" style={{ width: '100%' }}>
            Create Channel
          </button>
        </form>
      )}

      <div className="channel-browser__list">
        {loading && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textAlign: 'center', padding: '1rem' }}>Loading...</p>}
        {!loading && channels.length === 0 && (
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textAlign: 'center', padding: '1rem' }}>
            No channels yet. Create one to get started.
          </p>
        )}
        {channels.map(ch => (
          <button
            key={ch.channel_id}
            className={`channel-browser__item ${activeChannel?.channel_id === ch.channel_id ? 'channel-browser__item--active' : ''}`}
            onClick={() => onSelect(ch)}
          >
            <span className="channel-browser__icon">
              {channelTypes[ch.channel_type] || '#'}
            </span>
            <div className="channel-browser__info">
              <span className="channel-browser__name">{ch.name}</span>
              {ch.description && (
                <span className="channel-browser__desc">{ch.description}</span>
              )}
            </div>
            <span className="channel-browser__members">
              {ch.members?.length || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
