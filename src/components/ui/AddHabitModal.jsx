import { useState } from 'react'
import { X } from 'lucide-react'

const COLORS = ['#2D6A4F','#1D5FA5','#6D28D9','#B45309','#C2410C','#BE185D']

export function AddHabitModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [cat, setCat] = useState('health')
  const [time, setTime] = useState('08:00')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState(COLORS[0])

  function handleSave() {
    if (!name.trim()) return
    onSave({ name: name.trim(), cat, time, icon: icon || '⭐', color })
    setName(''); setCat('health'); setTime('08:00'); setIcon('⭐'); setColor(COLORS[0])
    onClose()
  }

  if (!open) return null

  return (
    <div
      style={{
        position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',
        zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-enter"
        style={{
          background:'var(--surface)',borderRadius:14,
          width:'min(440px, calc(100vw - 32px))',
          boxShadow:'0 20px 60px rgba(0,0,0,0.18)',
        }}
      >
        {/* Header */}
        <div style={{padding:'20px 22px 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:'var(--text)'}}>Add New Habit</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text3)',display:'flex'}}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{padding:'16px 22px',display:'flex',flexDirection:'column',gap:14}}>
          <label style={{display:'flex',flexDirection:'column',gap:5}}>
            <span style={{fontSize:12,fontWeight:500,color:'var(--text2)'}}>Habit name</span>
            <input
              autoFocus
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="e.g. Morning run"
              style={inputStyle}
            />
          </label>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <label style={{display:'flex',flexDirection:'column',gap:5}}>
              <span style={{fontSize:12,fontWeight:500,color:'var(--text2)'}}>Category</span>
              <select value={cat} onChange={e => setCat(e.target.value)} style={inputStyle}>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
                <option value="wellness">Wellness</option>
              </select>
            </label>
            <label style={{display:'flex',flexDirection:'column',gap:5}}>
              <span style={{fontSize:12,fontWeight:500,color:'var(--text2)'}}>Time</span>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
            </label>
          </div>

          <label style={{display:'flex',flexDirection:'column',gap:5}}>
            <span style={{fontSize:12,fontWeight:500,color:'var(--text2)'}}>Emoji icon</span>
            <input value={icon} onChange={e => setIcon(e.target.value)} maxLength={2} placeholder="e.g. 🏃" style={inputStyle} />
          </label>

          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            <span style={{fontSize:12,fontWeight:500,color:'var(--text2)'}}>Color</span>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {COLORS.map(c => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width:28,height:28,borderRadius:'50%',background:c,cursor:'pointer',
                    border: color === c ? '2.5px solid var(--text)' : '2px solid transparent',
                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                    transition:'all 0.15s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{padding:'0 22px 20px',display:'flex',gap:10,justifyContent:'flex-end'}}>
          <button onClick={onClose} style={{...btnBase,border:'1px solid var(--border2)',color:'var(--text2)'}}>Cancel</button>
          <button onClick={handleSave} style={{...btnBase,background:'var(--accent)',color:'#fff',border:'none',fontWeight:500}}>Save Habit</button>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  padding:'9px 12px',border:'1px solid var(--border2)',
  borderRadius:8,fontSize:14,fontFamily:"'DM Sans',sans-serif",
  color:'var(--text)',background:'var(--surface)',outline:'none',width:'100%',
}
const btnBase = {
  padding:'8px 18px',borderRadius:8,
  fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",
  background:'transparent',
}