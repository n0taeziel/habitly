import { Trash2 } from 'lucide-react'

const DAYS = ['M','T','W','T','F','S','S']

function lightBg(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},0.12)`
}

export function HabitCard({ habit, onDelete }) {
  const id   = habit._id || habit.id
  const wpct = Math.round(habit.week.filter(v => v === 1).length / 7 * 100)

  return (
    <div
      style={{
        background:'var(--surface)',border:'1px solid var(--border)',
        borderRadius:14,padding:18,boxShadow:'var(--shadow)',
        position:'relative',transition:'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.transform='translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='var(--shadow)'; e.currentTarget.style.transform='translateY(0)' }}
    >
      {/* Delete button */}
      <button
        onClick={() => onDelete(id)}
        style={{
          position:'absolute',top:12,right:12,background:'none',border:'none',
          cursor:'pointer',color:'var(--text3)',padding:4,borderRadius:6,
          display:'flex',opacity:0.6,transition:'opacity 0.15s',
        }}
        title="Delete habit"
        onMouseEnter={e => e.currentTarget.style.opacity='1'}
        onMouseLeave={e => e.currentTarget.style.opacity='0.6'}
      >
        <Trash2 size={14} />
      </button>

      {/* Top */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
        <div style={{
          width:38,height:38,borderRadius:10,
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:18,background:lightBg(habit.color),
        }}>
          {habit.icon}
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:15,fontWeight:600,color:'var(--text)',paddingRight:20}}>{habit.name}</div>
          <div style={{fontSize:12,color:'var(--text3)',textTransform:'capitalize'}}>{habit.cat} · {habit.time}</div>
        </div>
      </div>

      {/* Week dots */}
      <div style={{display:'flex',gap:5,marginBottom:14}}>
        {DAYS.map((d,i) => (
          <div
            key={i}
            style={{
              width:28,height:28,borderRadius:6,
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:10,fontWeight: habit.week[i] === 1 ? 700 : 400,
              background: habit.week[i] === 1 ? lightBg(habit.color) : 'var(--bg2)',
              color: habit.week[i] === 1 ? habit.color : 'var(--text3)',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:12,color:'var(--text2)'}}>
          🔥 <strong style={{color:'var(--amber)'}}>{habit.streak}</strong> day streak
        </span>
        <span style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:habit.color}}>{wpct}%</span>
      </div>
    </div>
  )
}