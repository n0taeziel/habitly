import { useState } from 'react'
import { Header }   from './components/Header'
import { Sidebar }  from './components/Sidebar'
import { TodayPage }  from './components/pages/TodayPage'
import { HabitsPage } from './components/pages/HabitsPage'
import { StatsPage }  from './components/pages/StatsPage'
import { LoginPage }  from './components/pages/LoginPage'
import { SignupPage } from './components/pages/SignupPage'
import { Toast, showToast } from './components/ui/Toast'
import { useHabits } from './hooks/useHabits'

function getSession() {
  try { const s = localStorage.getItem('habitly_session'); return s ? JSON.parse(s) : null }
  catch { return null }
}

export default function App() {
  const [user, setUser]         = useState(getSession)
  const [authPage, setAuthPage] = useState('login')
  const [page, setPage]         = useState('today')

  const { habits, globalStreak, bestStreak, loading, toggleHabit, addHabit, deleteHabit } = useHabits()

  function handleLogin(u)  {
    setUser(u)
    localStorage.setItem('habitly_session', JSON.stringify(u))
    showToast(`👋 Welcome back, ${u.name.split(' ')[0]}!`)
  }
  function handleSignup(u) {
    setUser(u)
    localStorage.setItem('habitly_session', JSON.stringify(u))
    showToast(`🎉 Welcome, ${u.name.split(' ')[0]}!`)
  }
  function handleLogout() {
    localStorage.removeItem('habitly_session')
    localStorage.removeItem('habitly_token')
    setUser(null)
    setAuthPage('login')
  }

  function handleToggle(id) {
    if (!id || id === 'undefined') return
    const h = habits.find(x => String(x._id) === String(id) || String(x.id) === String(id))
    toggleHabit(id)
    if (h) showToast(h.done ? `${h.name} unchecked` : `✓ ${h.name} completed!`)
  }

  if (!user) return (
    <>
      {authPage === 'login'
        ? <LoginPage  onLogin={handleLogin}   onGoSignup={() => setAuthPage('signup')} />
        : <SignupPage onSignup={handleSignup} onGoLogin={()  => setAuthPage('login')}  />}
      <Toast />
    </>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <Header page={page} onPageChange={setPage} user={user} onLogout={handleLogout} />
      <div style={{ display:'flex', marginTop:64, minHeight:'calc(100vh - 64px)' }}>
        <Sidebar page={page} onPageChange={setPage} habits={habits} streak={globalStreak} />
        <main style={{ marginLeft:220, flex:1, padding:'28px 28px', minWidth:0 }}>
          {page === 'today'  && <TodayPage  habits={habits} onToggle={handleToggle} user={user} bestStreak={bestStreak} />}
          {page === 'habits' && <HabitsPage habits={habits} onAdd={addHabit} onDelete={deleteHabit} />}
          {page === 'stats'  && <StatsPage  habits={habits} globalStreak={globalStreak} bestStreak={bestStreak} />}
        </main>
      </div>
      <Toast />
    </div>
  )
}