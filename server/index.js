import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import dns from 'dns'
import authRoutes from './routes/auth.js'
import habitRoutes from './routes/habits.js'
import Habit from './models/Habit.js'
import { finalizePreviousDay } from './utils/streakEngine.js'

dotenv.config()
dns.setDefaultResultOrder('ipv4first')

const app = express()
app.use(cors({ origin: ['http://localhost:5173','http://localhost:5174'], credentials: true }))
app.use(express.json())
app.use('/api/auth',   authRoutes)
app.use('/api/habits', habitRoutes)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// ── Midnight cron job ──
// Runs every day at 00:01 to finalize previous day's logs.
// This ensures missed habits are locked in as completed=false
// so streak calculations are always accurate.
function scheduleMidnightJob() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setDate(midnight.getDate() + 1)
  midnight.setHours(0, 1, 0, 0) // 00:01 AM next day
  const msUntilMidnight = midnight - now

  setTimeout(async () => {
    try {
      const habits = await Habit.find({})
      await finalizePreviousDay(habits)
    } catch (err) {
      console.error('Midnight job error:', err.message)
    }
    // Schedule again for the next day
    scheduleMidnightJob()
  }, msUntilMidnight)

  const h = Math.floor(msUntilMidnight / 1000 / 60 / 60)
  const m = Math.floor((msUntilMidnight / 1000 / 60) % 60)
  console.log(`⏰ Midnight job scheduled in ${h}h ${m}m`)
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB')
    scheduleMidnightJob()
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })