const savedIcons = new Map() // Stores previously found icon URLs.

// Finds an icon for a habit card and saves its URL for later use.
async function findHabitIcon(description) {
  // Removes extra spaces and converts the habit description to lowercase. This way, the same icon can be reused even if the capitalization or spacing is different.
  const text = description.trim().toLowerCase()

  // Checks if this description was searched before.
  if (savedIcons.has(text)) {
    return savedIcons.get(text)
  }

  // Sets up the search based on the habit description and icon style.
  const params = new URLSearchParams({
    q: text,
    style: 'color-fill',
  })

  // Sends a request to Infyicon to find an icon.
  const response = await fetch(`https://infyicon.com/api/search?${params}`)

  // Stops if the request was not successful.
  if (!response.ok) {
    return null
  }

  // Gets the search results and picks the first icon.
  const data = await response.json()
  const icon = data.v2?.[0]

  if (icon) {
    const iconUrl = `https://infyicon.com/i2/${icon.style}/png/128/${icon.slug}_${icon.id}.png`
    savedIcons.set(text, iconUrl) // Saves the icon URL to reuse it later.
    return iconUrl
  }
  savedIcons.set(text, null) // Saves null if no icon was found.
  return null
}

module.exports = findHabitIcon
