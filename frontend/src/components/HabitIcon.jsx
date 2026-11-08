import { useEffect, useState } from 'react'

// Default icon that applies when there is no matching one for the habit description.
const defaultIcon = 'https://api.iconify.design/mdi/notebook-check-outline.svg?color=%237B6CE0'

function HabitIcon({ description }) {
  // Stores the icon URL for the habit.
  const [iconUrl, setIconUrl] = useState(null)

  useEffect(() => {
    // A controller to cancel old icon requests so they do not interfere with new ones.
    const controller = new AbortController()

    async function loadIcon() {
      setIconUrl(null) // Clears the previous icon before loading a new one.

      try {
        // Requests a matching icon URL from the backend.
        const response = await fetch(
          `http://localhost:3000/icons/search?term=${encodeURIComponent(description)}`,
          { signal: controller.signal },
        )
        const data = await response.json()

        // Checks if the request failed and logs the error.
        if (!response.ok) {
          console.error(data.message)
          return
        }
        
        if (!controller.signal.aborted && data.iconUrl) {
          setIconUrl(data.iconUrl) // Sets the matching icon URL.
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error loading habit icon:', error)
        }
      }
    }

    if (description?.trim()) {
      loadIcon() // Searches for an icon that matches the habit description.
    }

    return () => controller.abort()
  }, [description])

  return (
    <div className='habit-icon-background'>
      <img
        src={iconUrl || defaultIcon}
        alt=''
        className='habit-icon'
        onError={(event) => {
          // Uses the default icon if the image fails to load.
          if (event.currentTarget.src !== defaultIcon) {
            event.currentTarget.src = defaultIcon
          }
        }}
      />
    </div>
  )
}

export default HabitIcon
