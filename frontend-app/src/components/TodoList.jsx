import { useState, useEffect } from 'react'
import { getProductivity, addTodo, updateTodo, deleteTodo } from '../api/platform'

const PRIORITIES = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' }

export default function TodoList({ userId }) {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState('medium')
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadTodos() }, [])

  async function loadTodos() {
    try {
      const data = await getProductivity(userId)
      setTodos(data.todos || [])
    } catch { /* backend offline */ }
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await addTodo(userId, title.trim(), desc.trim(), priority)
      setTitle('')
      setDesc('')
      setShowForm(false)
      loadTodos()
    } catch { /* ignore */ }
  }

  async function handleToggle(todo) {
    try {
      await updateTodo(userId, todo.id, !todo.completed)
      loadTodos()
    } catch { /* ignore */ }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(userId, id)
      loadTodos()
    } catch { /* ignore */ }
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const counts = { all: todos.length, active: todos.filter(t => !t.completed).length, done: todos.filter(t => t.completed).length }

  return (
    <div className="todo-list">
      <div className="todo-list__header">
        <span className="overline-dot" style={{ margin: 0 }}>To-Do List</span>
        <button className="btn btn--primary btn--sm" onClick={() => setShowForm(!showForm)} style={{ fontSize: '0.6875rem' }}>
          {showForm ? '✕' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <form className="todo-list__form" onSubmit={handleAdd}>
          <input className="input" placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <input className="input" placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} />
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {Object.entries(PRIORITIES).map(([p, color]) => (
              <button key={p} type="button" className={`btn ${priority === p ? 'btn--primary' : 'btn--secondary'} btn--sm`}
                onClick={() => setPriority(p)} style={{ flex: 1, fontSize: '0.625rem', borderColor: priority === p ? color : undefined, color: priority === p ? color : undefined }}>
                {p}
              </button>
            ))}
          </div>
          <button className="btn btn--primary" type="submit" style={{ width: '100%' }}>Add Task</button>
        </form>
      )}

      <div className="todo-list__filters">
        {['all', 'active', 'done'].map(f => (
          <button key={f} className={`btn btn--ghost btn--sm ${filter === f ? 'todo-list__filter--active' : ''}`}
            onClick={() => setFilter(f)} style={{ fontSize: '0.6875rem', textTransform: 'capitalize' }}>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      <div className="todo-list__items">
        {filtered.length === 0 && <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', textAlign: 'center', padding: '1rem' }}>No tasks</p>}
        {filtered.map(todo => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'todo-item--done' : ''}`}>
            <button className="todo-item__check" onClick={() => handleToggle(todo)}>
              {todo.completed ? '☑' : '☐'}
            </button>
            <div className="todo-item__content">
              <span className="todo-item__title">{todo.title}</span>
              {todo.description && <span className="todo-item__desc">{todo.description}</span>}
            </div>
            <span className="todo-item__priority" style={{ background: PRIORITIES[todo.priority] + '20', color: PRIORITIES[todo.priority] }}>
              {todo.priority}
            </span>
            <button className="todo-item__delete" onClick={() => handleDelete(todo.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}
