import { useState, useEffect, useRef } from 'react'
import {
  getChannelMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
  getTypingUsers,
  joinChannel,
} from '../api/platform'
import VoiceNoteRecorder from './VoiceNoteRecorder'
import AISummary from './AISummary'

const REACTIONS = ['👍', '❤️', '😂', '🔥', '👀', '🎉']

export default function ChatRoom({ channel, userId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typingUsers, setTypingUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [showReactions, setShowReactions] = useState(null)
  const messagesEnd = useRef(null)

  const senderName = userId || 'user_' + Date.now()

  useEffect(() => {
    if (channel) {
      joinChannel(channel.channel_id).catch(() => {})
      loadMessages()
      const interval = setInterval(() => loadTyping(), 3000)
      return () => clearInterval(interval)
    }
  }, [channel])

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages() {
    if (!channel) return
    try {
      const data = await getChannelMessages(channel.channel_id)
      setMessages(data.messages || [])
    } catch { /* backend offline */ }
  }

  async function loadTyping() {
    if (!channel) return
    try {
      const data = await getTypingUsers(channel.channel_id)
      setTypingUsers((data.typing || []).filter(t => t.user_id !== senderName))
    } catch { /* ignore */ }
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim()) return
    try {
      await sendMessage(channel.channel_id, input.trim(), senderName, senderName)
      setInput('')
      loadMessages()
    } catch { /* ignore */ }
  }

  async function handleEdit(msg) {
    setEditingId(msg.message_id)
    setEditText(msg.content)
  }

  async function handleEditSave() {
    if (!editText.trim()) return
    try {
      await editMessage(channel.channel_id, editingId, editText.trim())
      setEditingId(null)
      setEditText('')
      loadMessages()
    } catch { /* ignore */ }
  }

  async function handleDelete(msg) {
    try {
      await deleteMessage(channel.channel_id, msg.message_id)
      loadMessages()
    } catch { /* ignore */ }
  }

  async function handleReaction(msg, emoji) {
    try {
      const existing = msg.reactions?.[emoji] || []
      if (existing.includes(senderName)) {
        await removeReaction(channel.channel_id, msg.message_id, emoji, senderName)
      } else {
        await addReaction(channel.channel_id, msg.message_id, emoji, senderName)
      }
      loadMessages()
    } catch { /* ignore */ }
    setShowReactions(null)
  }

  function timeAgo(date) {
    if (!date) return ''
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  if (!channel) {
    return (
      <div className="chat-room chat-room--empty">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</p>
          <p style={{ color: 'var(--text-tertiary)' }}>Select a channel to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-room">
      <div className="chat-room__header">
        <div>
          <h3 className="chat-room__title">#{channel.name}</h3>
          {channel.description && (
            <p className="chat-room__desc">{channel.description}</p>
          )}
        </div>
        <AISummary type="channel" id={channel.channel_id} name={channel.name} />
      </div>

      <div className="chat-room__messages">
        {messages.length === 0 && (
          <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem' }}>
            No messages yet. Say something!
          </p>
        )}
        {messages.map((msg, i) => {
          const isOwn = msg.sender_name === senderName
          const reactions = msg.reactions || {}
          const reactionEntries = Object.entries(reactions).filter(([, users]) => users.length > 0)

          return (
            <div key={msg.message_id || i} className={`chat-msg ${isOwn ? 'chat-msg--own' : ''}`}>
              {!isOwn && (
                <div className="chat-msg__avatar">
                  {msg.sender_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <div className="chat-msg__body">
                <div className="chat-msg__meta">
                  <span className="chat-msg__sender">{msg.sender_name}</span>
                  <span className="chat-msg__time">{timeAgo(msg.created_at)}</span>
                  {msg.edited && <span className="chat-msg__edited">(edited)</span>}
                </div>

                {editingId === msg.message_id ? (
                  <div className="chat-msg__edit">
                    <input
                      className="input"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditingId(null) }}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button className="btn btn--primary btn--sm" onClick={handleEditSave} style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem' }}>Save</button>
                      <button className="btn btn--ghost btn--sm" onClick={() => setEditingId(null)} style={{ fontSize: '0.625rem', padding: '0.125rem 0.5rem' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="chat-msg__text">{msg.content}</p>
                )}

                {reactionEntries.length > 0 && (
                  <div className="chat-msg__reactions">
                    {reactionEntries.map(([emoji, users]) => (
                      <button
                        key={emoji}
                        className={`chat-msg__reaction ${users.includes(senderName) ? 'chat-msg__reaction--active' : ''}`}
                        onClick={() => handleReaction(msg, emoji)}
                      >
                        {emoji} {users.length}
                      </button>
                    ))}
                  </div>
                )}

                {isOwn && !editingId && (
                  <div className="chat-msg__actions">
                    <button className="chat-msg__action" onClick={() => handleEdit(msg)} title="Edit">✎</button>
                    <button className="chat-msg__action" onClick={() => handleDelete(msg)} title="Delete">🗑</button>
                    <button className="chat-msg__action" onClick={() => setShowReactions(showReactions === msg.message_id ? null : msg.message_id)} title="React">😊</button>
                  </div>
                )}
                {!isOwn && (
                  <button
                    className="chat-msg__action chat-msg__action--inline"
                    onClick={() => setShowReactions(showReactions === msg.message_id ? null : msg.message_id)}
                    title="React"
                  >
                    😊
                  </button>
                )}

                {showReactions === msg.message_id && (
                  <div className="chat-msg__picker">
                    {REACTIONS.map(r => (
                      <button key={r} className="chat-msg__picker-btn" onClick={() => handleReaction(msg, r)}>
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {typingUsers.length > 0 && (
          <div className="chat-room__typing">
            {typingUsers.map(u => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      <form className="chat-room__input" onSubmit={handleSend}>
        <VoiceNoteRecorder
          channelId={channel.channel_id}
          userId={senderName}
          userName={senderName}
          onSent={loadMessages}
        />
        <input
          className="input"
          placeholder={`Message #${channel.name}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="btn btn--primary" type="submit" disabled={!input.trim()}>
          Send
        </button>
      </form>
    </div>
  )
}
