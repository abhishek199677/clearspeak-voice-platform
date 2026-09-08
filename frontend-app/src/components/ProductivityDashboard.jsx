import TodoList from './TodoList'
import ReminderBoard from './ReminderBoard'
import WeatherWidget from './WeatherWidget'
import CricketScores from './CricketScores'
import QuickNotes from './QuickNotes'
import AIAssistant from './AIAssistant'

export default function ProductivityDashboard() {
  const userId = 'prod_' + useState(() => Math.random().toString(36).slice(2, 8))[0]

  return (
    <div className="productivity-dashboard">
      <div className="productivity-dashboard__header">
        <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Productivity Hub</h2>
      </div>

      <div className="productivity-dashboard__grid">
        <div className="productivity-dashboard__col productivity-dashboard__col--main">
          <TodoList userId={userId} />
          <QuickNotes userId={userId} />
        </div>

        <div className="productivity-dashboard__col productivity-dashboard__col--side">
          <ReminderBoard userId={userId} />
          <WeatherWidget />
          <CricketScores />
        </div>

        <div className="productivity-dashboard__col productivity-dashboard__col--ai">
          <AIAssistant />
        </div>
      </div>
    </div>
  )
}
