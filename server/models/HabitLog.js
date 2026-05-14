import mongoose from 'mongoose'

const habitLogSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit', required: true, index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true, index: true,
  },
  date: {
    type: String, required: true, // "YYYY-MM-DD"
    index: true,
  },
  completed: {
    type: Boolean, default: false,
  },
})

// One log per habit per day
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true })

export default mongoose.model('HabitLog', habitLogSchema)