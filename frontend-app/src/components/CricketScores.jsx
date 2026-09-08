import { useState, useEffect } from 'react'
import { getCricketScores } from '../api/platform'

export default function CricketScores() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadScores() }, [])

  async function loadScores() {
    try {
      const data = await getCricketScores()
      setMatches(data.matches || [])
    } catch { /* backend offline */ }
    setLoading(false)
  }

  const statusColors = { Live: '#10B981', Upcoming: '#F59E0B' }

  return (
    <div className="cricket-scores">
      <div className="cricket-scores__header">
        <span className="overline-dot" style={{ margin: 0 }}>Cricket</span>
        <button className="btn btn--ghost btn--sm" onClick={loadScores} style={{ fontSize: '0.6875rem' }}>↻ Refresh</button>
      </div>

      {loading && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Loading scores...</p>}

      {!loading && matches.length === 0 && (
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>No matches</p>
      )}

      <div className="cricket-scores__list">
        {matches.map(match => (
          <div key={match.id} className={`cricket-match cricket-match--${match.status?.toLowerCase()}`}>
            <div className="cricket-match__header">
              <span className="cricket-match__teams">{match.teams}</span>
              <span className="cricket-match__format">{match.format}</span>
              <span className="cricket-match__status" style={{ color: statusColors[match.status] || 'var(--text-tertiary)' }}>
                {match.status === 'Live' && <span className="cricket-match__live-dot" />}
                {match.status}
              </span>
            </div>
            <p className="cricket-match__score">{match.score}</p>
            <p className="cricket-match__venue">{match.venue}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
