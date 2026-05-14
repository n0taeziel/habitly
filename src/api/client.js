const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('habitly_token') || ''
}

function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  }
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

// ── Auth ──
export const api = {
  signup: (name, email, password) => request('POST', '/auth/signup', { name, email, password }),
  login:  (email, password)       => request('POST', '/auth/login',  { email, password }),
  me:     ()                      => request('GET',  '/auth/me'),

  // ── Habits ──
  getHabits:    ()          => request('GET',    '/habits'),
  createHabit:  (data)      => request('POST',   '/habits', data),
  toggleHabit:  (id)        => request('PATCH',  `/habits/${id}/toggle`),
  deleteHabit:  (id)        => request('DELETE', `/habits/${id}`),
}