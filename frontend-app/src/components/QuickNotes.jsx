import { useState, useEffect } from 'react'
import { getProductivity, addNote, updateNote, deleteNote } from '../api/platform'

export default function QuickNotes({ userId }) {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => { loadNotes() }, [])

  async function loadNotes() {
    try {
      const data = await getProductivity(userId)
      setNotes(data.notes || [])
    } catch { /* backend offline */ }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    try {
      await addNote(userId, title.trim(), content.trim())
      setTitle('')
      setContent('')
      setShowForm(false)
      loadNotes()
    } catch { /* ignore */ }
  }

  async function handleEdit(note) {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  async function handleEditSave() {
    if (!editContent.trim()) return
    try {
      await updateNote(userId, editingId, editContent.trim())
      setEditingId(null)
      setEditContent('')
      loadNotes()
    } catch { /* ignore */ }
  }

  async function handleDelete(id) {
    try {
      await deleteNote(userId, id)
      loadNotes()
    } catch { /* ignore */ }
  }

  return (
    <div className="quick-notes">
      <div className="quick-notes__header">
        <span className="overline-dot" style={{ margin: 0 }}>Quick Notes</span>
        <button className="btn btn--primary btn--sm" onClick={() => setShowForm(!showForm)} style={{ fontSize: '0.6875rem' }}>
          {showForm ? '✕' : '+ New'}
        </button>
      </div>

      {showForm && (
        <form className="quick-notes__form" onSubmit={handleAdd}>
          <input className="input" placeholder="Note title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <textarea className="input quick-notes__textarea" placeholder="Write your note..." value={content} onChange={e => setContent(e.target.value)} rows={3} />
          <button className="btn btn--primary" type="submit" style={{ width: '100%' }}>Save Note</button>
        </form>
      )}

      <div className="quick-notes__grid">
        {notes.length === 0 && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>No notes yet</p>}
        {notes.map(note => (
          <div key={note.id} className="quick-note">
            <div className="quick-note__header">
              <span className="quick-note__title">{note.title}</span>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button className="quick-note__action" onClick={() => handleEdit(note)} title="Edit">✎</button>
                <button className="quick-note__action quick-note__action--delete" onClick={() => handleDelete(note.id)} title="Delete">✕</button>
              </div>
            </div>
            {editingId === note.id ? (
              <div className="quick-note__edit">
                <textarea className="input quick-notes__textarea" value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} />
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className="btn btn--primary btn--sm" onClick={handleEditSave} style={{ fontSize: '0.625rem' }}>Save</button>
                  <button className="btn btn--ghost btn--sm" onClick={() => setEditingId(null)} style={{ fontSize: '0.625rem' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <p className="quick-note__content">{note.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
