import { useState } from 'react'
import { aiChat } from '../api/platform'

export default function AIAssistant() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim()) return
    const msg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setLoading(true)
    try {
      const data = await aiChat(msg)
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'No response' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Backend offline. Try again later.' }])
    }
    setLoading(false)
  }

  return (
    <div className="ai-assistant">
      <div className="ai-assistant__header">
        <span className="overline-dot" style={{ margin: 0 }}>AI Assistant</span>
      </div>
      <div className="ai-assistant__messages">
        {messages.length === 0 && (
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textAlign: 'center', padding: '2rem 1rem' }}>
            Ask me to create tasks, set reminders, or help you plan your day!
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`ai-assistant__msg ai-assistant__msg--${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="ai-assistant__msg ai-assistant__msg--assistant">Thinking...</div>}
      </div>
      <form className="ai-assistant__input" onSubmit={handleSend}>
        <input className="input" placeholder="Ask your assistant..." value={input} onChange={e => setInput(e.target.value)} />
        <button className="btn btn--primary btn--sm" type="submit" disabled={!input.trim()}>Send</button>
      </form>
    </div>
  )
}
