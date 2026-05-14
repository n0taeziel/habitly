import { LogOut } from 'lucide-react'
const TABS = ['today','habits','stats']
const TAB_LABELS = { today: 'Today', habits: 'My Habits', stats: 'Stats' }

export function Header({ page, onPageChange, user, onLogout }) {
  return (
    <header style={{position:'fixed',top:0,left:0,right:0,zIndex:100,height:64,background:'var(--surface)',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',padding:'0 24px',gap:16}}>
      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:'var(--accent)',letterSpacing:'-0.3px',flexShrink:0}}>
        Habitly <span style={{fontStyle:'italic',color:'var(--text2)',fontSize:14,marginLeft:4}}>— daily tracker</span>
      </div>
      <nav style={{display:'flex',gap:2,marginLeft:'auto',background:'var(--bg2)',borderRadius:8,padding:3}}>
        {TABS.map(t => (
          <button key={t} onClick={() => onPageChange(t)} style={{padding:'6px 16px',borderRadius:6,fontSize:13,fontWeight:500,cursor:'pointer',border:'none',fontFamily:"'DM Sans',sans-serif",color:page===t?'var(--text)':'var(--text2)',background:page===t?'var(--surface)':'transparent',boxShadow:page===t?'0 1px 3px rgba(0,0,0,0.1)':'none',transition:'all 0.18s'}}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </nav>
      <div style={{display:'flex',alignItems:'center',gap:10,marginLeft:16}}>
        <div style={{width:34,height:34,borderRadius:'50%',background:'var(--accent-light)',color:'var(--accent-text)',fontSize:13,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center'}} title={user?.name}>
          {user?.initials || 'AJ'}
        </div>
        {onLogout && (
          <button onClick={onLogout} title="Sign out" style={{background:'none',border:'1px solid var(--border2)',borderRadius:8,padding:'6px 8px',cursor:'pointer',color:'var(--text3)',display:'flex',alignItems:'center',transition:'all 0.15s'}}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--bg2)';e.currentTarget.style.color='var(--text)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text3)'}}>
            <LogOut size={15}/>
          </button>
        )}
      </div>
    </header>
  )
}