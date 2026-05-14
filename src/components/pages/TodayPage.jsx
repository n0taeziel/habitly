import { useMemo } from 'react'
import { RingProgress } from '../ui/RingProgress'
import { HabitRow } from '../ui/HabitRow'

function StatCard({ label, value, sub, valueStyle }) {
  return (
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:16,boxShadow:'var(--shadow)'}}>
      <div style={{fontSize:11,color:'var(--text3)',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.06em'}}>{label}</div>
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:30,color:'var(--text)',marginTop:2,lineHeight:1,...valueStyle}}>{value}</div>
      <div style={{fontSize:12,color:'var(--text3)',marginTop:3}}>{sub}</div>
    </div>
  )
}

export function TodayPage({ habits, onToggle, user, bestStreak = 0 }) {
  const done  = habits.filter(h => h.done).length
  const total = habits.length
  const pct   = total ? Math.round(done / total * 100) : 0

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  }, [])

  const dateStr = useMemo(() =>
    new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' }), [])

  const firstName = user?.name?.split(' ')[0] || 'there'

  // Week avg — % of habits completed across last 7 days
  const weekAvg = useMemo(() => {
    if (!habits.length) return 0
    let total = 0, completed = 0
    habits.forEach(h => {
      h.week?.forEach(v => { if (v >= 0) { total++; if (v === 1) completed++ } })
    })
    return total ? Math.round(completed / total * 100) : 0
  }, [habits])

  return (
    <div className="page-enter">
      <div style={{marginBottom:24}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:28,fontWeight:400,lineHeight:1.2}}>
          {greeting}, {firstName}.
        </h1>
        <p style={{fontSize:14,color:'var(--text2)',marginTop:4}}>{dateStr}</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:12,marginBottom:24}}>
        <StatCard label="Done today"  value={done}        sub={`of ${total} habits`} />
        <StatCard label="Completion"  value={`${pct}%`}   sub="today's rate" />
        <StatCard label="Best streak" value={bestStreak}  sub="days in a row" valueStyle={{color:'var(--amber)'}} />
        <StatCard label="Week avg"    value={`${weekAvg}%`} sub="this week" />
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:20,alignItems:'start'}}>
        <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:'18px 20px',boxShadow:'var(--shadow)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
            <span style={{fontSize:15,fontWeight:600}}>Today's Habits</span>
            <span style={{fontSize:12,color:'var(--text3)'}}>{done} / {total}</span>
          </div>
          <div style={{height:5,background:'var(--bg3)',borderRadius:99,marginBottom:16,overflow:'hidden'}}>
            <div style={{height:5,background:'var(--accent)',borderRadius:99,width:`${pct}%`,transition:'width 0.4s cubic-bezier(.4,0,.2,1)'}}/>
          </div>
          {habits.length === 0
            ? <p style={{fontSize:13,color:'var(--text3)',textAlign:'center',padding:'24px 0'}}>No habits yet. Go add some! 🎯</p>
            : habits.map(h => <HabitRow key={h._id || h.id} habit={h} onToggle={onToggle} />)
          }
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:'18px 20px',boxShadow:'var(--shadow)'}}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:10}}>
              <RingProgress pct={pct} />
            </div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Per habit progress</div>
            {habits.map(h => {
              const scheduled = h.week?.filter(v => v >= 0).length || 7
              const completed = h.week?.filter(v => v === 1).length || 0
              const wp = scheduled ? Math.round(completed / scheduled * 100) : 0
              return (
                <div key={h._id || h.id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                  <span style={{width:8,height:8,borderRadius:'50%',background:h.color,flexShrink:0,display:'inline-block'}}/>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <span style={{fontSize:12,color:'var(--text2)'}}>{h.name}</span>
                      <span style={{fontSize:12,fontWeight:500,color:h.color}}>{wp}%</span>
                    </div>
                    <div style={{height:3,background:'var(--bg3)',borderRadius:99,marginTop:2,overflow:'hidden'}}>
                      <div style={{height:3,borderRadius:99,background:h.color,width:`${wp}%`}}/>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{background:'var(--accent-light)',border:'1px solid rgba(45,106,79,0.15)',borderRadius:14,padding:16}}>
            <div style={{fontFamily:"'DM Serif Display',serif",fontStyle:'italic',fontSize:15,color:'var(--accent-text)',lineHeight:1.5}}>
              "We are what we repeatedly do. Excellence is not an act, but a habit."
            </div>
            <div style={{fontSize:11,color:'var(--accent)',marginTop:8}}>— Aristotle</div>
          </div>
        </div>
      </div>
    </div>
  )
}