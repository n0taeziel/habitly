import mongoose from 'mongoose'

const habitSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:         { type: String, required: true, trim: true },
  cat:          { type: String, enum: ['health','learning','wellness'], default: 'health' },
  icon:         { type: String, default: '⭐' },
  color:        { type: String, default: '#2D6A4F' },
  time:         { type: String, default: '08:00' },
  // "daily" = every day | "custom" = specific weekdays
  scheduleType: { type: String, enum: ['daily','custom'], default: 'daily' },
  // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat — only used when scheduleType="custom"
  scheduleDays: { type: [Number], default: [] },
  createdAt:    { type: Date, default: Date.now },
})

export default mongoose.model('Habit', habitSchema)