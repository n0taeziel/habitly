import { useState } from 'react'
import { HabitCard } from '../ui/HabitCard'
import { AddHabitModal } from '../ui/AddHabitModal'
import { showToast } from '../ui/Toast'

const FILTERS = ['all','health','learning','wellness']

export function HabitsPage({ habits, onAdd, onDelete }) {
  const [filter, setFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = filter === 'all' ? habits : habits.filter(h => h.cat === filter)

  function handleAdd(habit) {
    onAdd(habit)
    showToast(`✓ "${habit.name}" added!`)
  }

  return (
    <div className="page-enter">
      <div style={{marginBottom:24}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:28,fontWeight:400}}>My Habits</h1>
        <p style={{fontSize:14,color:'var(--text2)',marginTop:4}}>Track, manage and review all your habits.</p>
      </div>

      {/* Toolbar */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding:'6px 14px',borderRadius:99,fontSize:12,fontWeight:500,
              border:'1px solid var(--border2)',cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif",
              background: filter === f ? 'var(--text)' : 'transparent',
              color:      filter === f ? 'var(--bg)'  : 'var(--text2)',
              transition:'all 0.15s',textTransform:'capitalize',
            }}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button
          onClick={() => setModalOpen(true)}
          style={{
            marginLeft:'auto',padding:'7px 16px',borderRadius:8,
            fontSize:13,fontWeight:500,background:'var(--accent)',
            color:'#fff',border:'none',cursor:'pointer',
            fontFamily:"'DM Sans',sans-serif",transition:'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >
          + Add Habit
        </button>
      </div>

      {/* Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
        {filtered.map(h => (
          <HabitCard key={h.id} habit={h} onDelete={(id) => { onDelete(id); showToast('Habit removed') }} />
        ))}
        {/* Add placeholder */}
        <div
          onClick={() => setModalOpen(true)}
          style={{
            border:'1.5px dashed var(--border2)',background:'transparent',
            borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',
            minHeight:140,cursor:'pointer',
            transition:'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background='var(--bg2)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}
        >
          <div style={{textAlign:'center',color:'var(--text3)'}}>
            <div style={{fontSize:28,marginBottom:6}}>+</div>
            <div style={{fontSize:13,fontWeight:500}}>Add habit</div>
          </div>
        </div>
      </div>

      <AddHabitModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAdd} />
    </div>
  )
}