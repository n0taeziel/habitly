export function HabitRow({ habit, onToggle }) {
  const id = habit._id || habit.id

  return (
    <div
      onClick={() => onToggle(id)}
      style={{
        display:'flex',alignItems:'center',gap:12,
        padding:'11px 6px',borderBottom:'1px solid var(--border)',
        cursor:'pointer',borderRadius:6,transition:'background 0.12s',
      }}
      onMouseEnter={e => e.currentTarget.style.background='var(--bg2)'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}
    >
      <div style={{
        width:24,height:24,borderRadius:'50%',flexShrink:0,
        display:'flex',alignItems:'center',justifyContent:'center',
        border: habit.done ? 'none' : '1.5px solid var(--border2)',
        background: habit.done ? 'var(--accent)' : 'transparent',
        transition:'all 0.2s',
      }}>
        {habit.done && (
          <svg width="12" height="12" viewBox="0 0 12 12">
            <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <div style={{flex:1,minWidth:0}}>
        <div style={{
          fontSize:14,fontWeight:500,
          color: habit.done ? 'var(--text3)' : 'var(--text)',
          textDecoration: habit.done ? 'line-through' : 'none',
          transition:'all 0.2s',
        }}>
          {habit.icon} {habit.name}
        </div>
        <div style={{fontSize:12,color:'var(--text3)',marginTop:1}}>
          {habit.streak} day streak
        </div>
      </div>

      <span style={{fontSize:12,color:'var(--text3)',flexShrink:0}}>{habit.time}</span>
    </div>
  )
}