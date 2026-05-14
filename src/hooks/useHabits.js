import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'

export function useHabits() {
  const [habits, setHabits] = useState([])
  const [globalStreak, setGlobalStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getHabits()
      .then(data => {
        // Handle both { habits, globalStreak, bestStreak } and plain array
        if (Array.isArray(data)) {
          setHabits(data)
        } else {
          setHabits(data.habits || [])
          setGlobalStreak(data.globalStreak || 0)
          setBestStreak(data.bestStreak || 0)
        }
      })
      .catch(err => console.error('Failed to load habits:', err))
      .finally(() => setLoading(false))
  }, [])

  const toggleHabit = useCallback(async (id) => {
    if (!id || id === 'undefined') {
      console.error('toggleHabit called with invalid id:', id)
      return
    }
    try {
      const data = await api.toggleHabit(id)
      // Handle both { habit, globalStreak, bestStreak } and plain habit object
      if (data.habit) {
        setHabits(prev => prev.map(h =>
          String(h._id) === String(id) || String(h.id) === String(id) ? data.habit : h
        ))
        setGlobalStreak(data.globalStreak || 0)
        setBestStreak(data.bestStreak || 0)
      } else {
        setHabits(prev => prev.map(h =>
          String(h._id) === String(id) || String(h.id) === String(id) ? data : h
        ))
      }
    } catch (err) {
      console.error('Toggle failed:', err)
    }
  }, [])

  const addHabit = useCallback(async (habitData) => {
    try {
      const newHabit = await api.createHabit(habitData)
      setHabits(prev => [...prev, newHabit])
    } catch (err) {
      console.error('Add habit failed:', err)
      throw err
    }
  }, [])

  const deleteHabit = useCallback(async (id) => {
    try {
      await api.deleteHabit(id)
      setHabits(prev => prev.filter(h =>
        String(h._id) !== String(id) && String(h.id) !== String(id)
      ))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }, [])

  return { habits, globalStreak, bestStreak, loading, toggleHabit, addHabit, deleteHabit }
}