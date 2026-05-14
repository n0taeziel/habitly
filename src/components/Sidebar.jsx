import { LayoutGrid, List, BarChart2 } from 'lucide-react'

export function Sidebar({ page, onPageChange, habits, streak }) {
  const navItems = [
    { id:'today',  label:'Today',     icon: <LayoutGrid size={14}/> },
    { id:'habits', label:'My Habits', icon: <List size={14}/> },
    { id:'stats',  label:'Stats',     icon: <BarChart2 size={14}/> },
  ]

  return (
    <aside style={{
      width:220,flexShrink:0,background:'var(--surface)',
      borderRight:'1px solid var(--border)',padding:'20px 12px',
      position:'fixed',top:64,bottom:0,overflowY:'auto',
      display:'flex',flexDirection:'column',gap:4,
    }}>
      <span style={{fontSize:10,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--text3)',padding:'12px 10px 6px'}}>
        Navigation
      </span>

      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id)}
          style={{
            display:'flex',alignItems:'center',gap:10,
            padding:'8px 10px',borderRadius:8,
            fontSize:13,cursor:'pointer',border:'none',
            fontFamily:"'DM Sans',sans-serif",width:'100%',textAlign:'left',
            background: page === item.id ? 'var(--accent-light)' : 'transparent',
            color:      page === item.id ? 'var(--accent-text)' : 'var(--text2)',
            fontWeight: page === item.id ? 500 : 400,
            transition:'all 0.15s',
          }}
          onMouseEnter={e => { if(page !== item.id) { e.currentTarget.style.background='var(--bg2)'; e.currentTarget.style.color='var(--text)' }}}
          onMouseLeave={e => { if(page !== item.id) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text2)' }}}
        >
          {item.icon}
          {item.label}
        </button>
      ))}

      {habits.length > 0 && (
        <>
          <span style={{fontSize:10,fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--text3)',padding:'12px 10px 6px',marginTop:8}}>
            Habits
          </span>
          {habits.map(h => (
            <button
              key={h._id || h.id}
              onClick={() => onPageChange('today')}
              style={{
                display:'flex',alignItems:'center',gap:10,
                padding:'8px 10px',borderRadius:8,
                fontSize:13,color:'var(--text2)',cursor:'pointer',
                border:'none',background:'transparent',
                fontFamily:"'DM Sans',sans-serif",width:'100%',textAlign:'left',
                transition:'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--bg2)'; e.currentTarget.style.color='var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text2)' }}
            >
              <span style={{width:8,height:8,borderRadius:'50%',background:h.color,flexShrink:0,display:'inline-block'}}/>
              {h.name}
            </button>
          ))}
        </>
      )}

      {/* Streak badge */}
      <div style={{
        marginTop:'auto',background:'var(--bg2)',borderRadius:14,
        padding:14,textAlign:'center',
      }}>
        <div style={{fontSize:20,marginBottom:4}}>🔥</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:36,color:'var(--amber)',lineHeight:1}}>{streak}</div>
        <div style={{fontSize:11,color:'var(--text2)',marginTop:2}}>day streak</div>
      </div>
    </aside>
  )
}