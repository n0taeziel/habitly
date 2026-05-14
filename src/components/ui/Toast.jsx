import { useEffect, useState } from 'react'

let toastListener = null

export function showToast(msg) {
  if (toastListener) toastListener(msg)
}

export function Toast() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    toastListener = (msg) => {
      setMessage(msg)
      setVisible(true)
      setTimeout(() => setVisible(false), 2500)
    }
    return () => { toastListener = null }
  }, [])

  return (
    <div
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 300,
        background: 'var(--text)', color: 'var(--bg)',
        padding: '10px 18px', borderRadius: 8,
        fontSize: 13, fontWeight: 500,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.25s', pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}