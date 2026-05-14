import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { api } from '../../api/client'

export function LoginPage({ onLogin, onGoSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
  e.preventDefault(); setError('')
  if (!email || !password) { setError('Please fill in all fields.'); return }
  setLoading(true)
  try {
    const { token, user } = await api.login(email, password)
    localStorage.setItem('habitly_token', token)
    onLogin(user)
  } catch (err) {
    setError(err.message)
    setLoading(false)
  }
}

  return (
    <div style={pageStyle}>
      {/* Left decorative panel */}
      <div style={leftPanel}>
        <div style={leftInner}>
          <div style={brandMark}>H</div>
          <div style={tagline}>Build better habits,<br/>one day at a time.</div>
          <div style={dotsRow}>
            {[...Array(5)].map((_,i) => (
              <div key={i} style={{...dot, opacity: 0.2 + i * 0.18, animationDelay: `${i * 0.15}s`}} />
            ))}
          </div>
        </div>
        {/* Decorative circles */}
        <div style={circle1} />
        <div style={circle2} />
        <div style={circle3} />
      </div>

      {/* Right form panel */}
      <div style={rightPanel}>
        <div style={formWrap}>
          {/* Logo */}
          <div style={logoWrap}>
            <span style={logo}>Habitly</span>
            <span style={logoSub}>— daily tracker</span>
          </div>

          <h1 style={heading}>Welcome back</h1>
          <p style={sub}>Sign in to continue your streak 🔥</p>

          <form onSubmit={handleSubmit} style={form}>
            <div style={fieldGroup}>
              <label style={label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={input}
                onFocus={e => e.target.style.borderColor='var(--accent)'}
                onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.14)'}
              />
            </div>

            <div style={fieldGroup}>
              <label style={label}>Password</label>
              <div style={{position:'relative'}}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{...input, paddingRight: 44}}
                  onFocus={e => e.target.style.borderColor='var(--accent)'}
                  onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.14)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={eyeBtn}
                >
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {error && <div style={errorBox}>{error}</div>}

            <button type="submit" style={{...submitBtn, opacity: loading ? 0.7 : 1}} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={switchText}>
            Don't have an account?{' '}
            <button onClick={onGoSignup} style={linkBtn}>Create one</button>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Styles ──
const pageStyle = {
  display: 'flex', minHeight: '100vh',
  fontFamily: "'DM Sans', sans-serif",
  background: 'var(--bg)',
}
const leftPanel = {
  width: '42%', background: 'var(--accent)',
  position: 'relative', overflow: 'hidden',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
}
const leftInner = {
  position: 'relative', zIndex: 2,
  display: 'flex', flexDirection: 'column', gap: 24, padding: 48,
}
const brandMark = {
  width: 64, height: 64, borderRadius: 18,
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(8px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: "'DM Serif Display', serif", fontSize: 32, color: '#fff',
  border: '1px solid rgba(255,255,255,0.2)',
}
const tagline = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 32, color: '#fff', lineHeight: 1.3,
  fontWeight: 400,
}
const dotsRow = {
  display: 'flex', gap: 10, marginTop: 8,
}
const dot = {
  width: 10, height: 10, borderRadius: '50%',
  background: '#fff',
}
const circle1 = {
  position: 'absolute', width: 320, height: 320,
  borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
  top: -80, right: -80, zIndex: 1,
}
const circle2 = {
  position: 'absolute', width: 220, height: 220,
  borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)',
  bottom: 40, right: -60, zIndex: 1,
}
const circle3 = {
  position: 'absolute', width: 140, height: 140,
  borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
  bottom: -40, left: 40, zIndex: 1,
}
const rightPanel = {
  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '40px 24px',
}
const formWrap = {
  width: '100%', maxWidth: 400,
  animation: 'fadeUp 0.3s ease forwards',
}
const logoWrap = {
  display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 36,
}
const logo = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 24, color: 'var(--accent)',
}
const logoSub = {
  fontStyle: 'italic', color: 'var(--text3)', fontSize: 13,
}
const heading = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 30, color: 'var(--text)', fontWeight: 400, marginBottom: 6,
}
const sub = {
  fontSize: 14, color: 'var(--text2)', marginBottom: 32,
}
const form = {
  display: 'flex', flexDirection: 'column', gap: 18,
}
const fieldGroup = {
  display: 'flex', flexDirection: 'column', gap: 6,
}
const label = {
  fontSize: 12, fontWeight: 500, color: 'var(--text2)',
}
const input = {
  padding: '11px 14px',
  border: '1px solid rgba(0,0,0,0.14)',
  borderRadius: 10, fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  color: 'var(--text)', background: 'var(--surface)',
  outline: 'none', width: '100%',
  transition: 'border-color 0.15s',
}
const eyeBtn = {
  position: 'absolute', right: 12, top: '50%',
  transform: 'translateY(-50%)',
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text3)', display: 'flex', padding: 0,
}
const errorBox = {
  background: '#FEE2E2', border: '1px solid #FCA5A5',
  borderRadius: 8, padding: '10px 14px',
  fontSize: 13, color: '#B91C1C',
}
const submitBtn = {
  padding: '12px 24px', borderRadius: 10,
  background: 'var(--accent)', color: '#fff',
  border: 'none', fontSize: 14, fontWeight: 600,
  fontFamily: "'DM Sans', sans-serif",
  cursor: 'pointer', transition: 'opacity 0.15s',
  marginTop: 4,
}
const switchText = {
  fontSize: 13, color: 'var(--text2)',
  textAlign: 'center', marginTop: 24,
}
const linkBtn = {
  background: 'none', border: 'none',
  color: 'var(--accent)', fontWeight: 600,
  cursor: 'pointer', fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
}