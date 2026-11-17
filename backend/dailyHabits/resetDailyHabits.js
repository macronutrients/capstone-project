const { db } = require('../src/prisma/db.ts')

// Resets habits that were completed on previous days so they can be completed again.
async function resetDailyHabits(userId) {
  // Gets the beginning of today.
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Finds all completed habits belonging to the current user.
  const completedHabits = await db.orm.public.Habit.where({
    userId: userId,
    completed: true,
  }).all()

  // Goes through each completed habit.
  for (const habit of completedHabits) {
    // Checks if the habit was completed before today.
    if (new Date(habit.completedAt) < today) {
      // Updates the habit in the database.
      await db.orm.public.Habit.where({ id: habit.id, userId: userId }).update({
        completed: false, // Resets the habit to incomplete.
        completedAt: null, // Clears its completion date.
      })
    }
  }
}

module.exports = resetDailyHabits
