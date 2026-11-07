const express = require('express')
const router = express.Router()
const findHabitIcon = require('../icons/findHabitIcon') // Loads the function that searches for habit icons.

// Receives requests to search for habit icons.
router.get('/search', async (req, res) => {
  // Gets the habit description from the request.
  const description = req.query.term || ''
  try {
    // Searches for an icon matching the description.
    const iconUrl = await findHabitIcon(description)
    res.json({ iconUrl }) // Sends the icon URL back to the frontend.
  } catch (error) {
    console.error('Error searching habit icon:', error)
    res.status(502).json({
      message: 'Failed to find habit icon',
    })
  }
})

module.exports = router
