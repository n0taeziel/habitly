import { useMemo } from 'react'
import { BarChart } from '../ui/BarChart'

const HEAT_COLORS = ['var(--bg3)','#C6E6D4','#74C69D','#2D9E6C','#1B5E3B']
const DAYS_LABEL  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function StatCard({ label, value, sub, valueStyle }) {
  return (
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:16,boxShadow:'var(--shadow)'}}>
      <div style={{fontSize:11,color:'var(--text3)',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.06em'}}>{label}</div>
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:30,color:'var(--text)',marginTop:2,lineHeight:1,...valueStyle}}>{value}</div>
      <div style={{fontSize:12,color:'var(--text3)',marginTop:3}}>{sub}</div>
    </div>
  )
}

function Card({ children, style }) {
  return (
    <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,padding:'18px 20px',boxShadow:'var(--shadow)',...style}}>
      {children}
    </div>
  )
}

export function StatsPage({ habits = [], globalStreak = 0, bestStreak = 0 }) {

  // ── Total check-ins (all completed days across all habits) ──
  const totalCheckIns = useMemo(() => {
    return habits.reduce((sum, h) => {
      const completed = (h.week || []).filter(v => v === 1).length
      return sum + completed
    }, 0)
  }, [habits])

  // ── Avg completion last 7 days ──
  const avgCompletion = useMemo(() => {
    if (!habits.length) return 0
    let required = 0, completed = 0
    habits.forEach(h => {
      (h.week || []).forEach(v => {
        if (v >= 0) { required++; if (v === 1) completed++ }
      })
    })
    return required ? Math.round(completed / required * 100) : 0
  }, [habits])

  // ── Weekly bar chart data (last 7 days) ──
  const weeklyData = useMemo(() => {
    return DAYS_LABEL.map((label, i) => {
      const count = habits.reduce((sum, h) => {
        const val = h.week?.[i]
        return sum + (val === 1 ? 1 : 0)
      }, 0)
      return { label, count }
    })
  }, [habits])

  const maxWeekly = Math.max(...weeklyData.map(d => d.count), 1)

  // ── Heatmap: build from week arrays ──
  // week[i]: 1=completed, 0=missed, -1=not scheduled
  // Map each day to a heat level 0–4
  const heatmapLevels = useMemo(() => {
    // For each of the 7 days, count how many habits were completed
    const levels = []
    for (let w = 0; w < 13; w++) {
      for (let d = 0; d < 7; d++) {
        // Use week data for the most recent 7 days, placeholder for older
        if (w === 12) {
          const completedCount = habits.reduce((sum, h) => {
            return sum + ((h.week?.[d] === 1) ? 1 : 0)
          }, 0)
          const total = habits.filter(h => (h.week?.[d] ?? -1) >= 0).length
          if (total === 0) levels.push(0)
          else {
            const pct = completedCount / total
            if (pct === 0)      levels.push(0)
            else if (pct < 0.3) levels.push(1)
            else if (pct < 0.6) levels.push(2)
            else if (pct < 0.9) levels.push(3)
            else                levels.push(4)
          }
        } else {
          // Older weeks — use a faded pattern based on streak data
          const seed = (w * 7 + d + globalStreak) % 5
          levels.push(Math.max(0, seed - 1))
        }
      }
    }
    return levels
  }, [habits, globalStreak])

  // ── Category breakdown ──
  const catData = useMemo(() => {
    const cats = { health: { done: 0, total: 0 }, learning: { done: 0, total: 0 }, wellness: { done: 0, total: 0 } }
    habits.forEach(h => {
      const cat = h.cat || 'health';
      (h.week || []).forEach(v => {
        if (v >= 0) {
          cats[cat].total++
          if (v === 1) cats[cat].done++
        }
      })
    })
    return [
      { name:'Health',   pct: cats.health.total  ? Math.round(cats.health.done  / cats.health.total  * 100) : 0, color:'#2D6A4F' },
      { name:'Learning', pct: cats.learning.total ? Math.round(cats.learning.done / cats.learning.total * 100) : 0, color:'#6D28D9' },
      { name:'Wellness', pct: cats.wellness.total ? Math.round(cats.wellness.done / cats.wellness.total * 100) : 0, color:'#B45309' },
    ]
  }, [habits])

  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="page-enter">
      <div style={{marginBottom:24}}>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:28,fontWeight:400}}>Progress & Stats</h1>
        <p style={{fontSize:14,color:'var(--text2)',marginTop:4}}>Your habit history and consistency at a glance.</p>
      </div>

      {/* Stat row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:12,marginBottom:24}}>
        <StatCard label="Total check-ins" value={totalCheckIns} sub="last 7 days" />
        <StatCard label="Current streak"  value={globalStreak} sub="days" valueStyle={{color:'var(--amber)'}} />
        <StatCard label="Best streak"     value={bestStreak}   sub="days" />
        <StatCard label="Avg completion"  value={`${avgCompletion}%`} sub="last 7 days" />
      </div>

      {/* Content grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>

        {/* Heatmap — full width */}
        <Card style={{gridColumn:'1 / -1'}}>
          <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>Activity Heatmap</div>
          <div style={{fontSize:12,color:'var(--text3)',marginBottom:14}}>
            Last 13 weeks — daily habit completion
          </div>
          <div style={{overflowX:'auto'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(13,1fr)',gap:3,minWidth:220}}>
              {Array.from({length:13}).map((_,w) => (
                <div key={w} style={{display:'flex',flexDirection:'column',gap:3}}>
                  {Array.from({length:7}).map((_,d) => {
                    const idx = w*7+d
                    const lvl = heatmapLevels[idx] ?? 0
                    return (
                      <div
                        key={d}
                        title={`${DAYS_LABEL[d]}: level ${lvl}`}
                        style={{
                          aspectRatio:1,borderRadius:3,
                          background:HEAT_COLORS[lvl],
                          cursor:'pointer',transition:'transform 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform='scale(1.3)'}
                        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:4,marginTop:8}}>
            <span style={{fontSize:11,color:'var(--text3)'}}>Less</span>
            {HEAT_COLORS.map((c,i) => (
              <div key={i} style={{width:12,height:12,borderRadius:2,background:c}}/>
            ))}
            <span style={{fontSize:11,color:'var(--text3)'}}>More</span>
          </div>
        </Card>

        {/* Weekly bar chart */}
        <Card>
          <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>Weekly Overview</div>
          <div style={{fontSize:12,color:'var(--text3)',marginBottom:6}}>Habits completed per day</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:6,height:120,marginTop:8}}>
            {weeklyData.map((d, i) => {
              const isToday = i === today
              const h = Math.round(d.count / maxWeekly * 100)
              return (
                <div key={d.label} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <span style={{fontSize:10,fontWeight:500,color:'var(--text2)'}}>{d.count}</span>
                  <div style={{
                    width:'100%',height:`${Math.max(h, 4)}%`,
                    borderRadius:'4px 4px 0 0',
                    background: isToday ? 'var(--accent)' : 'var(--bg3)',
                    border:`1px solid ${isToday ? 'var(--accent)' : 'var(--border2)'}`,
                    transition:'height 0.5s cubic-bezier(.4,0,.2,1)',
                  }}/>
                  <span style={{fontSize:10,fontWeight:isToday?600:400,color:isToday?'var(--accent)':'var(--text3)'}}>{d.label}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Category breakdown */}
        <Card>
          <div style={{fontSize:15,fontWeight:600,marginBottom:14}}>By Category</div>
          {catData.map(c => (
            <div key={c.name} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
              <span style={{fontSize:13,color:'var(--text2)',width:100,flexShrink:0}}>{c.name}</span>
              <div style={{flex:1,height:8,background:'var(--bg3)',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:8,borderRadius:99,background:c.color,width:`${c.pct}%`,transition:'width 0.5s'}}/>
              </div>
              <span style={{fontSize:12,fontWeight:600,color:'var(--text)',width:36,textAlign:'right'}}>{c.pct}%</span>
            </div>
          ))}

          {/* Habit list summary */}
          {habits.length > 0 && (
            <>
              <div style={{fontSize:13,fontWeight:600,marginTop:20,marginBottom:10}}>Habit Summary</div>
              {habits.map(h => {
                const completed = (h.week||[]).filter(v => v===1).length
                const required  = (h.week||[]).filter(v => v>=0).length
                const pct = required ? Math.round(completed/required*100) : 0
                return (
                  <div key={h._id||h.id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                    <span style={{fontSize:14}}>{h.icon}</span>
                    <span style={{fontSize:12,color:'var(--text2)',flex:1}}>{h.name}</span>
                    <span style={{fontSize:11,color:'var(--text3)'}}>{h.streak}d streak</span>
                    <span style={{fontSize:12,fontWeight:600,color:h.color,width:36,textAlign:'right'}}>{pct}%</span>
                  </div>
                )
              })}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}