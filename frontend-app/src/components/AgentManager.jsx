import { useState, useEffect } from 'react'
import {
  getAgents,
  createAgent,
  getAgent,
  activateAgent,
  deactivateAgent,
  sendAgentMessage,
  getAgentAnalytics,
} from '../api/platform'

const AGENT_TYPES = ['marketing', 'sales', 'support', 'voice', 'custom']
const AGENT_ICONS = { marketing: '📢', sales: '💰', support: '🎧', voice: '🎙', custom: '🤖' }

export default function AgentManager() {
  const [agents, setAgents] = useState([])
  const [selected, setSelected] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('support')
  const [newDesc, setNewDesc] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadAgents() }, [])

  async function loadAgents() {
    try {
      const data = await getAgents()
      setAgents(data.agents || [])
    } catch { /* backend offline */ }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await createAgent(newName.trim(), newType, newDesc.trim())
      setNewName('')
      setNewDesc('')
      setShowCreate(false)
      loadAgents()
    } catch { /* backend offline */ }
  }

  async function handleSelect(agent) {
    setSelected(agent)
    setChatMessages([])
    setAnalytics(null)
    try {
      const data = await getAgent(agent.agent_id)
      setSelected(data)
    } catch { /* backend offline */ }
  }

  async function handleActivate() {
    if (!selected) return
    try {
      await activateAgent(selected.agent_id)
      setSelected({ ...selected, state: 'active' })
      loadAgents()
    } catch { /* backend offline */ }
  }

  async function handleDeactivate() {
    if (!selected) return
    try {
      await deactivateAgent(selected.agent_id)
      setSelected({ ...selected, state: 'inactive' })
      loadAgents()
    } catch { /* backend offline */ }
  }

  async function handleChat(e) {
    e.preventDefault()
    if (!chatInput.trim() || !selected) return
    const msg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)
    try {
      const data = await sendAgentMessage(selected.agent_id, msg)
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response || 'No response' }])
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Backend offline. Try again later.' }])
    }
    setLoading(false)
  }

  async function handleAnalytics() {
    if (!selected) return
    try {
      const data = await getAgentAnalytics(selected.agent_id)
      setAnalytics(data)
    } catch { /* backend offline */ }
  }

  return (
    <div className="agent-manager">
      <div className="agent-manager__header">
        <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>AI Agents</h2>
        <button className="btn btn--primary btn--sm" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? '✕ Cancel' : '+ Create Agent'}
        </button>
      </div>

      {showCreate && (
        <form className="agent-manager__form" onSubmit={handleCreate}>
          <input className="input" placeholder="Agent name" value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
          <select className="input" value={newType} onChange={e => setNewType(e.target.value)}>
            {AGENT_TYPES.map(t => <option key={t} value={t}>{AGENT_ICONS[t]} {t}</option>)}
          </select>
          <input className="input" placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          <button className="btn btn--primary" type="submit">Create Agent</button>
        </form>
      )}

      <div className="agent-manager__grid">
        <div className="agent-manager__list">
          {agents.length === 0 && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>No agents yet</p>}
          {agents.map(agent => (
            <button
              key={agent.agent_id}
              className={`agent-manager__item ${selected?.agent_id === agent.agent_id ? 'agent-manager__item--active' : ''}`}
              onClick={() => handleSelect(agent)}
            >
              <span className="agent-manager__icon">{AGENT_ICONS[agent.agent_type] || '🤖'}</span>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <span className="agent-manager__name">{agent.name}</span>
                <span className="agent-manager__type">{agent.agent_type}</span>
              </div>
              <span className={`agent-manager__status agent-manager__status--${agent.state}`}>
                {agent.state}
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="agent-manager__detail">
            <div className="agent-manager__detail-header">
              <span className="agent-manager__icon agent-manager__icon--lg">{AGENT_ICONS[selected.agent_type] || '🤖'}</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{selected.name}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{selected.description || 'No description'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {selected.state === 'inactive' ? (
                <button className="btn btn--primary btn--sm" onClick={handleActivate} style={{ fontSize: '0.75rem' }}>▶ Activate</button>
              ) : (
                <button className="btn btn--secondary btn--sm" onClick={handleDeactivate} style={{ fontSize: '0.75rem' }}>⏸ Deactivate</button>
              )}
              <button className="btn btn--secondary btn--sm" onClick={handleAnalytics} style={{ fontSize: '0.75rem' }}>📊 Analytics</button>
            </div>

            {analytics && (
              <div className="agent-manager__analytics">
                <div className="agent-manager__stat">
                  <span className="stat-value">{analytics.conversations || 0}</span>
                  <span className="stat-label">Conversations</span>
                </div>
                <div className="agent-manager__stat">
                  <span className="stat-value">{analytics.success_rate ? `${Math.round(analytics.success_rate * 100)}%` : '0%'}</span>
                  <span className="stat-label">Success Rate</span>
                </div>
                <div className="agent-manager__stat">
                  <span className="stat-value">{analytics.avg_response_time ? `${Math.round(analytics.avg_response_time)}ms` : 'N/A'}</span>
                  <span className="stat-label">Avg Response</span>
                </div>
              </div>
            )}

            <div className="agent-manager__chat">
              <span className="overline-dot" style={{ margin: 0 }}>Chat with Agent</span>
              <div className="agent-manager__chat-messages">
                {chatMessages.length === 0 && (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textAlign: 'center' }}>
                    Send a message to start
                  </p>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`agent-manager__chat-msg agent-manager__chat-msg--${msg.role}`}>
                    {msg.content}
                  </div>
                ))}
                {loading && (
                  <div className="agent-manager__chat-msg agent-manager__chat-msg--assistant">
                    Thinking...
                  </div>
                )}
              </div>
              <form className="agent-manager__chat-input" onSubmit={handleChat}>
                <input
                  className="input"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                />
                <button className="btn btn--primary btn--sm" type="submit" disabled={!chatInput.trim()}>
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
