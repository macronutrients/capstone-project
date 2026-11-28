const { db } = require('../src/prisma/db.ts')

// Saves a habit's completion date for the monthly tracker calendar.
async function saveHabitCompletion(habitId) {
  // Gets the beginning of today.
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Checks if the habit already has a completion record for today.
  const existingCompletion = await db.orm.public.HabitCompletion.where({
    habitId: habitId,
    date: today,
  }).first()

  // Saves today's completion only if it has not been recorded yet.
  if (!existingCompletion) {
    await db.orm.public.HabitCompletion.create({
      habitId: habitId,
      date: today,
    })
  }
}

module.exports = saveHabitCompletion
