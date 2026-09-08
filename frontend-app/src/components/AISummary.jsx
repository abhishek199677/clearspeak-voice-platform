import { useState } from 'react'
import { getChannelSummary, getCallSummary } from '../api/platform'

export default function AISummary({ type, id }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSummarize() {
    setLoading(true)
    setError('')
    setSummary('')
    try {
      const data = type === 'channel'
        ? await getChannelSummary(id)
        : await getCallSummary(id)
      setSummary(data.summary || 'No summary available.')
    } catch {
      setError('Failed to generate summary. Backend may be offline.')
    }
    setLoading(false)
  }

  return (
    <div className="ai-summary">
      <button
        className="btn btn--secondary btn--sm"
        onClick={handleSummarize}
        disabled={loading}
        style={{ fontSize: '0.75rem', gap: '0.375rem' }}
      >
        <span style={{ fontSize: '0.875rem' }}>{loading ? '⏳' : '✨'}</span>
        {loading ? 'Summarizing...' : `Summarize ${type === 'channel' ? 'Channel' : 'Call'}`}
      </button>
      {summary && (
        <div className="ai-summary__content">
          {summary}
        </div>
      )}
      {error && (
        <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</p>
      )}
    </div>
  )
}
