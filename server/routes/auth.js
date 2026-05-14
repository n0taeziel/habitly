import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, initials: user.initials },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(409).json({ message: 'An account with this email already exists.' })

    const user = await User.create({ name, email, password })
    const token = signToken(user)

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, initials: user.initials },
    })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' })

    const user = await User.findOne({ email })
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password.' })

    const valid = await user.comparePassword(password)
    if (!valid)
      return res.status(401).json({ message: 'Invalid email or password.' })

    const token = signToken(user)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, initials: user.initials },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error. Please try again.' })
  }
})

// GET /api/auth/me  (verify token)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ message: 'No token.' })
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    if (!user) return res.status(401).json({ message: 'User not found.' })
    res.json({ user: { id: user._id, name: user.name, email: user.email, initials: user.initials } })
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' })
  }
})

export default router