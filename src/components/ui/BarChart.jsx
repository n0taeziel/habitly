const WEEK = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const VALS = [4,5,3,4,2,1,3]
const MAX = 5
const TODAY_IDX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

export function BarChart() {
  return (
    <div style={{display:'flex',alignItems:'flex-end',gap:6,height:120,marginTop:8}}>
      {WEEK.map((d,i) => {
        const isToday = i === TODAY_IDX
        const h = Math.round(VALS[i] / MAX * 100)
        return (
          <div key={d} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <span style={{fontSize:10,fontWeight:500,color:'var(--text2)'}}>{VALS[i]}</span>
            <div style={{
              width:'100%',height:`${h}%`,
              borderRadius:'4px 4px 0 0',minHeight:4,
              background: isToday ? 'var(--accent)' : 'var(--bg3)',
              border: `1px solid ${isToday ? 'var(--accent)' : 'var(--border2)'}`,
              transition:'height 0.5s cubic-bezier(.4,0,.2,1)',
            }}/>
            <span style={{fontSize:10,fontWeight: isToday ? 600 : 400, color: isToday ? 'var(--accent)' : 'var(--text3)'}}>{d}</span>
          </div>
        )
      })}
    </div>
  )
}