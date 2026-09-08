import { useState, useEffect } from 'react'
import { getProductivity, addReminder, updateReminder, deleteReminder } from '../api/platform'

export default function ReminderBoard({ userId }) {
  const [reminders, setReminders] = useState([])
  const [title, setTitle] = useState('')
  const [remindAt, setRemindAt] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { loadReminders() }, [])

  async function loadReminders() {
    try {
      const data = await getProductivity(userId)
      setReminders(data.reminders || [])
    } catch { /* backend offline */ }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim() || !remindAt) return
    try {
      await addReminder(userId, title.trim(), remindAt)
      setTitle('')
      setRemindAt('')
      setShowForm(false)
      loadReminders()
    } catch { /* ignore */ }
  }

  async function handleComplete(id) {
    try {
      await updateReminder(userId, id, true)
      loadReminders()
    } catch { /* ignore */ }
  }

  async function handleDelete(id) {
    try {
      await deleteReminder(userId, id)
      loadReminders()
    } catch { /* ignore */ }
  }

  function formatTime(iso) {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  const now = new Date()
  const upcoming = reminders.filter(r => !r.completed && new Date(r.remind_at) >= now)
  const overdue = reminders.filter(r => !r.completed && new Date(r.remind_at) < now)
  const done = reminders.filter(r => r.completed)

  return (
    <div className="reminder-board">
      <div className="reminder-board__header">
        <span className="overline-dot" style={{ margin: 0 }}>Reminders</span>
        <button className="btn btn--primary btn--sm" onClick={() => setShowForm(!showForm)} style={{ fontSize: '0.6875rem' }}>
          {showForm ? '✕' : '+ New'}
        </button>
      </div>

      {showForm && (
        <form className="reminder-board__form" onSubmit={handleAdd}>
          <input className="input" placeholder="Reminder title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <input className="input" type="datetime-local" value={remindAt} onChange={e => setRemindAt(e.target.value)} />
          <button className="btn btn--primary" type="submit" style={{ width: '100%' }}>Set Reminder</button>
        </form>
      )}

      {overdue.length > 0 && (
        <div className="reminder-board__section">
          <span className="caption" style={{ color: '#EF4444', fontWeight: 600 }}>Overdue</span>
          {overdue.map(r => (
            <div key={r.id} className="reminder-item reminder-item--overdue">
              <div className="reminder-item__content">
                <span className="reminder-item__title">{r.title}</span>
                <span className="reminder-item__time">{formatTime(r.remind_at)}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button className="btn btn--ghost btn--sm" onClick={() => handleComplete(r.id)} style={{ fontSize: '0.625rem' }}>✓ Done</button>
                <button className="btn btn--ghost btn--sm" onClick={() => handleDelete(r.id)} style={{ fontSize: '0.625rem', color: '#EF4444' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="reminder-board__section">
        <span className="caption" style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Upcoming</span>
        {upcoming.length === 0 && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>No upcoming reminders</p>}
        {upcoming.map(r => (
          <div key={r.id} className="reminder-item">
            <div className="reminder-item__content">
              <span className="reminder-item__title">{r.title}</span>
              <span className="reminder-item__time">{formatTime(r.remind_at)}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button className="btn btn--ghost btn--sm" onClick={() => handleComplete(r.id)} style={{ fontSize: '0.625rem' }}>✓ Done</button>
              <button className="btn btn--ghost btn--sm" onClick={() => handleDelete(r.id)} style={{ fontSize: '0.625rem', color: '#EF4444' }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      {done.length > 0 && (
        <div className="reminder-board__section">
          <span className="caption" style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Completed</span>
          {done.map(r => (
            <div key={r.id} className="reminder-item reminder-item--done">
              <div className="reminder-item__content">
                <span className="reminder-item__title">{r.title}</span>
                <span className="reminder-item__time">{formatTime(r.remind_at)}</span>
              </div>
              <button className="btn btn--ghost btn--sm" onClick={() => handleDelete(r.id)} style={{ fontSize: '0.625rem', color: '#EF4444' }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
