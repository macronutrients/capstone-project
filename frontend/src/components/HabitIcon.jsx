import { useEffect, useState } from 'react'

// Default icon that applies when there is no matching one for the habit description.
const defaultIcon = 'https://api.iconify.design/mdi/notebook-check-outline.svg?color=%237B6CE0'

// Changes icon colors to violet.
function changeColor(color, ctx) {
  // Leaves empty or missing colors unchanged.
  if (!color || color === 'none') {
    return color
  }

  // Clears the previous pixel before checking a new color.
  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = '#010203' // Temporary color.
  ctx.fillStyle = color // Tries to apply the actual color.

  // Skips colors that could not be used.
  if (ctx.fillStyle === '#010203') {
    return color
  }
  ctx.fillRect(0, 0, 1, 1) // Draws one pixel on the canvas to check its color.

  // Gets the red, green, blue, and transparency values of the pixel.
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data

  // Does not change transparent and very light colors.
  if (a === 0 || (r > 230 && g > 230 && b > 230)) {
    return color
  }
  return '#786cd9' // Changes all other colors to violet.
}

// Loads an SVG icon and updates its colors.
async function makeIconViolet(iconUrl, signal) {
  // Gets the SVG from the icon URL.
  const response = await fetch(iconUrl, { signal })

  // Stops if the file could not be loaded.
  if (!response.ok) {
    throw new Error('Failed to load SVG')
  }

  // Reads the SVG file as a string.
  const svg = await response.text()
  // Turns it into a document to work with.
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml')

  // Stops if there is a problem with the SVG.
  if (doc.querySelector('parsererror')) {
    throw new Error('Invalid SVG')
  }

  // A canvas to check the icon colors.
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') // Gets the 2D drawing tools for the canvas.

  // Looks through CSS inside the SVG.
  doc.querySelectorAll('style').forEach((style) => {
    const sheet = new CSSStyleSheet() // Creates a new CSS style sheet.
    sheet.replaceSync(style.textContent) // Adds the SVG's CSS to it.
    // Goes through each CSS rule.
    for (const rule of sheet.cssRules) {
      // Skips rules that do not have a style.
      if (!rule.style) {
        continue
      }
      // Checks both fill (inside color) and stroke (outline color).
      for (const property of ['fill', 'stroke']) {
        // Gets the color from the CSS rule.
        const color = rule.style.getPropertyValue(property)

        // Applies the new color.
        if (color) {
          rule.style.setProperty(property, changeColor(color, ctx))
        }
      }
    }
    // Updates the SVG's CSS with the new colors.
    style.textContent = [...sheet.cssRules].map((rule) => rule.cssText).join('\n')
  })

  // Goes through all SVG elements.
  doc.querySelectorAll('*').forEach((element) => {
    // Checks inside and outline colors.
    for (const property of ['fill', 'stroke']) {
      const color = element.getAttribute(property)

      // Changes colors directly in SVG elements.
      if (color) {
        element.setAttribute(property, changeColor(color, ctx))
      }
      const styleColor = element.style?.getPropertyValue(property)

      // Also handles colors in the SVG element's style attribute.
      if (styleColor) {
        element.style.setProperty(property, changeColor(styleColor, ctx))
      }
    }
  })

  // Converts the updated SVG document back into a string.
  const violetSvg = new XMLSerializer().serializeToString(doc)

  // Makes a URL for the updated SVG.
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(violetSvg)}`
}

// Shows an icon based on the habit description.
function HabitIcon({ description }) {
  // Stores the icon URL for the habit.
  const [iconUrl, setIconUrl] = useState(null)

  // Runs when the habit description changes.
  useEffect(() => {
    // A controller to cancel old icon requests so they do not interfere with new ones.
    const controller = new AbortController()

    // Loads an icon that matches the habit description.
    async function loadIcon() {
      setIconUrl(null) // Clears the previous icon before showing a new one.

      try {
        // Requests a matching icon URL from the backend.
        const response = await fetch(`http://localhost:3000/icons/search?term=${encodeURIComponent(description)}`, { signal: controller.signal },)
        const data = await response.json()

        // Checks if the request failed and logs the error.
        if (!response.ok) {
          console.error(data.message)
          return
        }
        // Stops if the request was canceled or there is no icon.
        if (controller.signal.aborted || !data.iconUrl) {
          return
        }
        // Changes the icon URL from PNG to SVG.
        const svgUrl = data.iconUrl.replace('/png/128/', '/svg/').replace('.png', '.svg')

        try {
          // Recolors the SVG icon.
          const violetIcon = await makeIconViolet(svgUrl, controller.signal)
          // Checks if the request was not canceled before setting the new icon.
          if (!controller.signal.aborted) {
            setIconUrl(violetIcon)
          }
        } catch (error) {
          // Uses the default icon if something goes wrong.
          if (error.name !== 'AbortError' && !controller.signal.aborted) {
            setIconUrl(null)
          }
        }
      } catch (error) {
        // Logs an error if the request was not canceled.
        if (error.name !== 'AbortError') {
          console.error('Error loading habit icon:', error)
        }
      }
    }

    if (description?.trim()) {
      loadIcon() // Starts loading the icon for this habit.
    } 
    return () => controller.abort() // Cancels the request if it is no longer needed.
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
