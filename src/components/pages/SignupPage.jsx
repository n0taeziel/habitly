import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { api } from '../../api/client'

export function SignupPage({ onSignup, onGoLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

 async function handleSubmit(e) {
  e.preventDefault(); setError('')
  if (!name || !email || !password) { setError('Please fill in all fields.'); return }
  if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
  setLoading(true)
  try {
    const { token, user } = await api.signup(name, email, password)
    localStorage.setItem('habitly_token', token)
    onSignup(user)
  } catch (err) {
    setError(err.message)
    setLoading(false)
  }
}

  return (
    <div style={pageStyle}>
      {/* Left panel */}
      <div style={leftPanel}>
        <div style={leftInner}>
          <div style={brandMark}>H</div>
          <div style={tagline}>Start your journey<br/>to better habits.</div>
          <div style={featureList}>
            {['Track daily habits', 'Build streaks', 'See your progress', 'Stay consistent'].map((f, i) => (
              <div key={i} style={featureItem}>
                <div style={featureDot} />
                <span style={featureText}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={circle1} />
        <div style={circle2} />
        <div style={circle3} />
      </div>

      {/* Right form */}
      <div style={rightPanel}>
        <div style={formWrap}>
          <div style={logoWrap}>
            <span style={logo}>Habitly</span>
            <span style={logoSub}>— daily tracker</span>
          </div>

          <h1 style={heading}>Create account</h1>
          <p style={sub}>Join thousands building better habits daily.</p>

          <form onSubmit={handleSubmit} style={form}>
            <div style={fieldGroup}>
              <label style={label}>Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Johnson"
                style={input}
                onFocus={e => e.target.style.borderColor='var(--accent)'}
                onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.14)'}
              />
            </div>

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
                  placeholder="Min. 6 characters"
                  style={{...input, paddingRight: 44}}
                  onFocus={e => e.target.style.borderColor='var(--accent)'}
                  onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.14)'}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={eyeBtn}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {error && <div style={errorBox}>{error}</div>}

            <button type="submit" style={{...submitBtn, opacity: loading ? 0.7 : 1}} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={switchText}>
            Already have an account?{' '}
            <button onClick={onGoLogin} style={linkBtn}>Sign in</button>
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
  width: '42%', background: '#1B4332',
  position: 'relative', overflow: 'hidden',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
}
const leftInner = {
  position: 'relative', zIndex: 2,
  display: 'flex', flexDirection: 'column', gap: 28, padding: 48,
}
const brandMark = {
  width: 64, height: 64, borderRadius: 18,
  background: 'rgba(255,255,255,0.12)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: "'DM Serif Display', serif", fontSize: 32, color: '#fff',
  border: '1px solid rgba(255,255,255,0.15)',
}
const tagline = {
  fontFamily: "'DM Serif Display', serif",
  fontSize: 30, color: '#fff', lineHeight: 1.35, fontWeight: 400,
}
const featureList = {
  display: 'flex', flexDirection: 'column', gap: 12,
}
const featureItem = {
  display: 'flex', alignItems: 'center', gap: 12,
}
const featureDot = {
  width: 8, height: 8, borderRadius: '50%',
  background: 'rgba(255,255,255,0.5)', flexShrink: 0,
}
const featureText = {
  fontSize: 14, color: 'rgba(255,255,255,0.8)',
}
const circle1 = {
  position: 'absolute', width: 300, height: 300,
  borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)',
  top: -60, right: -80, zIndex: 1,
}
const circle2 = {
  position: 'absolute', width: 200, height: 200,
  borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)',
  bottom: 60, right: -50, zIndex: 1,
}
const circle3 = {
  position: 'absolute', width: 120, height: 120,
  borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
  bottom: -30, left: 60, zIndex: 1,
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
  fontFamily: "'DM Serif Display', serif", fontSize: 24, color: 'var(--accent)',
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