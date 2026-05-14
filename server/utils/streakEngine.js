/**
 * STREAK ENGINE
 * Industry-standard streak logic based on habit_logs.
 * All functions are pure and testable.
 */

import HabitLog from '../models/HabitLog.js'
import User from '../models/User.js'

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * todayStr()
 * Returns today's date as "YYYY-MM-DD" in local time.
 * Used as the anchor point for all streak calculations.
 */
export function todayStr() {
  return localDateStr(new Date())
}

/**
 * localDateStr(date)
 * Converts a JS Date to "YYYY-MM-DD" string using LOCAL time (not UTC).
 * Critical: using UTC would shift the date for users in UTC+ timezones.
 */
export function localDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * subtractDays(dateStr, n)
 * Returns a new "YYYY-MM-DD" string that is n days before dateStr.
 * Used to walk backwards through dates in streak calculations.
 */
export function subtractDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() - n)
  return localDateStr(d)
}

/**
 * weekdayOf(dateStr)
 * Returns the JS weekday number (0=Sun, 1=Mon … 6=Sat) for a date string.
 * Used to check if a habit is scheduled on a given weekday.
 */
export function weekdayOf(dateStr) {
  return new Date(dateStr + 'T00:00:00').getDay()
}

// ─────────────────────────────────────────────
// RULE 1 — isHabitRequiredOnDate
// ─────────────────────────────────────────────

/**
 * isHabitRequiredOnDate(habit, dateStr)
 *
 * Determines whether a habit was scheduled (required) on a specific date.
 *
 * Rules:
 *  - A habit is NEVER required before its createdAt date.
 *  - scheduleType "daily"  → required every day from createdAt onward.
 *  - scheduleType "custom" → required only on weekdays listed in scheduleDays
 *    (e.g. [1,3,5] = Mon, Wed, Fri).
 *
 * This is the foundation of the entire streak system. A habit that was not
 * required on a day MUST NOT affect the streak in any direction.
 *
 * @param {Object} habit    - Mongoose Habit document (plain object ok too)
 * @param {string} dateStr  - "YYYY-MM-DD"
 * @returns {boolean}
 */
export function isHabitRequiredOnDate(habit, dateStr) {
  const created = localDateStr(new Date(habit.createdAt))
  if (dateStr < created) return false
  if (habit.scheduleType === 'daily') return true
  return habit.scheduleDays.includes(weekdayOf(dateStr))
}

// ─────────────────────────────────────────────
// RULE 2 — Per-habit streak
// ─────────────────────────────────────────────

/**
 * calcHabitStreak(habit, logsByDate)
 *
 * Calculates the current streak for a single habit.
 *
 * Algorithm:
 *  1. Check today: if required AND completed → +1. If required but not yet
 *     completed, don't penalize (the day isn't over until 23:59).
 *  2. Walk backwards from yesterday:
 *     - Day not required → skip (no effect on streak).
 *     - Day required + completed log → +1, continue.
 *     - Day required + missing/incomplete log → streak broken, stop.
 *  3. Stop walking when we reach the habit's createdAt date.
 *
 * @param {Object} habit      - Habit document
 * @param {Map}    logsByDate - Map<"YYYY-MM-DD", HabitLog>
 * @returns {number}
 */
export function calcHabitStreak(habit, logsByDate) {
  const today = todayStr()
  let streak = 0

  // Today: add if completed, but don't break if not
  if (isHabitRequiredOnDate(habit, today)) {
    const todayLog = logsByDate.get(today)
    if (todayLog?.completed) streak += 1
  }

  // Walk backwards from yesterday
  const createdDate = localDateStr(new Date(habit.createdAt))
  let cursor = subtractDays(today, 1)

  while (cursor >= createdDate) {
    if (isHabitRequiredOnDate(habit, cursor)) {
      const log = logsByDate.get(cursor)
      if (log?.completed) {
        streak += 1
      } else {
        break // required but not completed — streak broken
      }
    }
    // not required that day — skip without penalty
    cursor = subtractDays(cursor, 1)
  }

  return streak
}

// ─────────────────────────────────────────────
// RULE 3 — Global streak
// ─────────────────────────────────────────────

/**
 * calcGlobalStreak(habits, logs)
 *
 * Calculates the user-level streak: consecutive days where ALL
 * required habits were completed.
 *
 * Algorithm:
 *  1. Build a Map<date, Set<habitId>> of completed habits per day.
 *  2. Check today: if all required habits done → +1.
 *     If not all done yet → don't break (day not over).
 *  3. Walk backwards from yesterday:
 *     - If no habits required → skip day (don't break or extend).
 *     - If all required habits completed → +1, continue.
 *     - If any required habit missed → stop.
 *
 * @param {Array} habits - All Habit documents for this user
 * @param {Array} logs   - All HabitLog documents for this user
 * @returns {number}
 */
export function calcGlobalStreak(habits, logs) {
  if (!habits.length) return 0

  // Build completed-by-date lookup
  const completedByDate = new Map()
  for (const log of logs) {
    if (!log.completed) continue
    if (!completedByDate.has(log.date)) completedByDate.set(log.date, new Set())
    completedByDate.get(log.date).add(String(log.habitId))
  }

  const today = todayStr()
  let streak = 0

  // Check today
  const requiredToday = habits.filter(h => isHabitRequiredOnDate(h, today))
  if (requiredToday.length > 0) {
    const doneToday = completedByDate.get(today) || new Set()
    if (requiredToday.every(h => doneToday.has(String(h._id)))) {
      streak += 1
    }
  }

  // Walk backwards from yesterday
  const oldestCreated = habits.reduce((min, h) => {
    const d = localDateStr(new Date(h.createdAt))
    return d < min ? d : min
  }, today)

  let cursor = subtractDays(today, 1)

  while (cursor >= oldestCreated) {
    const required = habits.filter(h => isHabitRequiredOnDate(h, cursor))

    if (required.length > 0) {
      const done = completedByDate.get(cursor) || new Set()
      if (required.every(h => done.has(String(h._id)))) {
        streak += 1
      } else {
        break // at least one required habit was missed — global streak broken
      }
    }
    // no habits required that day — skip

    cursor = subtractDays(cursor, 1)
  }

  return streak
}

// ─────────────────────────────────────────────
// RULE 4 — Best streak
// ─────────────────────────────────────────────

/**
 * updateBestStreak(userId, currentStreak)
 *
 * Atomically updates the user's bestStreak record in MongoDB
 * only if the new value exceeds the stored one.
 * Uses $lt guard to avoid unnecessary writes.
 *
 * @param {string} userId
 * @param {number} currentStreak
 */
export async function updateBestStreak(userId, currentStreak) {
  await User.findOneAndUpdate(
    { _id: userId, bestStreak: { $lt: currentStreak } },
    { $set: { bestStreak: currentStreak } }
  )
}

// ─────────────────────────────────────────────
// RULE 5 — Midnight finalization job
// ─────────────────────────────────────────────

/**
 * finalizePreviousDay(habits)
 *
 * Runs once at midnight (00:01) via a cron-style scheduler.
 *
 * For every habit required yesterday:
 *  - If a completed log already exists → nothing to do.
 *  - If no log exists → insert one with completed=false.
 *    This "locks in" a miss so the streak engine correctly
 *    detects the broken streak when walking back past this date.
 *
 * Without this job, a habit with no log on a past required day would be
 * ambiguous — was it not completed, or just never recorded?
 * This job removes that ambiguity.
 *
 * @param {Array} habits - All Habit documents across all users
 */
export async function finalizePreviousDay(habits) {
  const yesterday = subtractDays(todayStr(), 1)
  let count = 0

  for (const habit of habits) {
    if (!isHabitRequiredOnDate(habit, yesterday)) continue

    await HabitLog.findOneAndUpdate(
      { habitId: habit._id, date: yesterday },
      {
        $setOnInsert: {
          habitId: habit._id,
          userId: habit.userId,
          date: yesterday,
          completed: false,
        },
      },
      { upsert: true, new: false }
    )
    count++
  }

  console.log(`✅ Midnight job: finalized ${count} habit logs for ${yesterday}`)
}

// ─────────────────────────────────────────────
// CONVENIENCE — full streak computation for a user
// ─────────────────────────────────────────────

/**
 * computeStreaksForUser(userId, habits)
 *
 * Loads all relevant logs, computes per-habit and global streaks,
 * updates bestStreak, and returns enriched habit objects ready for the API.
 *
 * @param {string} userId
 * @param {Array}  habits - Mongoose Habit documents
 * @returns {{ enrichedHabits, globalStreak, bestStreak }}
 */
export async function computeStreaksForUser(userId, habits) {
  // Only look back 365 days — enough for any reasonable streak
  const since = subtractDays(todayStr(), 365)
  const logs = await HabitLog.find({ userId, date: { $gte: since } }).lean()

  // Build per-habit log maps
  const logsByHabit = new Map()
  for (const log of logs) {
    const key = String(log.habitId)
    if (!logsByHabit.has(key)) logsByHabit.set(key, new Map())
    logsByHabit.get(key).set(log.date, log)
  }

  const today = todayStr()

  const enrichedHabits = habits.map(h => {
    const habitLogs = logsByHabit.get(String(h._id)) || new Map()
    const streak = calcHabitStreak(h, habitLogs)
    const todayLog = habitLogs.get(today)
    const done = todayLog?.completed ?? false

    // Build 7-day week array for the UI (index 0 = 6 days ago, index 6 = today)
    const week = Array.from({ length: 7 }, (_, i) => {
      const d = subtractDays(today, 6 - i)
      if (!isHabitRequiredOnDate(h, d)) return -1 // -1 = not scheduled (grey)
      const log = habitLogs.get(d)
      return log?.completed ? 1 : 0
    })

    return { ...h.toObject(), streak, done, week }
  })

  const globalStreak = calcGlobalStreak(habits, logs)
  await updateBestStreak(userId, globalStreak)

  const user = await User.findById(userId).select('bestStreak').lean()
  const bestStreak = user?.bestStreak ?? globalStreak

  return { enrichedHabits, globalStreak, bestStreak }
}