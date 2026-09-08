import { useState, useEffect } from 'react'
import { getOnlineUsers } from '../api/platform'

export default function OnlineUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getOnlineUsers()
        setUsers(data.users || [])
      } catch { /* backend offline */ }
      setLoading(false)
    }
    init()
    const interval = setInterval(async () => {
      try {
        const data = await getOnlineUsers()
        setUsers(data.users || [])
      } catch { /* backend offline */ }
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const presenceColors = {
    online: '#10B981',
    away: '#F59E0B',
    busy: '#EF4444',
    offline: '#6B7280',
  }

  return (
    <div className="online-users">
      <span className="overline-dot" style={{ margin: 0 }}>Online</span>
      {loading && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Loading...</p>}
      {!loading && users.length === 0 && (
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>No users online</p>
      )}
      {users.map(user => (
        <div key={user.user_id} className="online-users__item">
          <span
            className="online-users__dot"
            style={{ background: presenceColors[user.presence] || presenceColors.offline }}
          />
          <span className="online-users__name">{user.display_name || user.username}</span>
        </div>
      ))}
    </div>
  )
}
