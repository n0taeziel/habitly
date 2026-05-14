import express from 'express'
import jwt from 'jsonwebtoken'
import Habit from '../models/Habit.js'
import HabitLog from '../models/HabitLog.js'
import { computeStreaksForUser, todayStr, finalizePreviousDay } from '../utils/streakEngine.js'

const router = express.Router()

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: 'Unauthorized' })
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    next()
  } catch { res.status(401).json({ message: 'Invalid token' }) }
}

router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: 1 })
    const { enrichedHabits, globalStreak, bestStreak } = await computeStreaksForUser(req.user.id, habits)
    res.json({ habits: enrichedHabits, globalStreak, bestStreak })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
})

router.post('/', auth, async (req, res) => {
  try {
    const { name, cat, icon, color, time, scheduleType = 'daily', scheduleDays = [] } = req.body
    if (!name) return res.status(400).json({ message: 'Habit name is required.' })
    const habit = await Habit.create({ userId: req.user.id, name, cat, icon, color, time, scheduleType, scheduleDays })
    res.status(201).json({ ...habit.toObject(), streak: 0, done: false, week: [0,0,0,0,0,0,0] })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
})

router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })
    const today = todayStr()
    let log = await HabitLog.findOne({ habitId: habit._id, date: today })
    if (log) { log.completed = !log.completed; await log.save() }
    else { log = await HabitLog.create({ habitId: habit._id, userId: req.user.id, date: today, completed: true }) }
    const allHabits = await Habit.find({ userId: req.user.id })
    const { enrichedHabits, globalStreak, bestStreak } = await computeStreaksForUser(req.user.id, allHabits)
    const updatedHabit = enrichedHabits.find(h => String(h._id) === String(habit._id))
    res.json({ habit: updatedHabit, globalStreak, bestStreak })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!habit) return res.status(404).json({ message: 'Habit not found' })
    await HabitLog.deleteMany({ habitId: req.params.id })
    res.json({ message: 'Deleted' })
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }) }
})

router.post('/finalize', auth, async (req, res) => {
  try {
    const habits = await Habit.find({})
    await finalizePreviousDay(habits)
    res.json({ message: 'Finalization complete' })
  } catch (err) { res.status(500).json({ message: 'Server error' }) }
})

export default router