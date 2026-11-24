import { useState } from 'react'

// Shows monthly habit completion history.
function MonthlyTracker({ completions = [] }) {
  // Keeps track of which month the calendar shows.
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // Gets the number of days in the month.
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Gets the weekday of the first day of the month.
  const firstDay = new Date(year, month, 1).getDay()

  // Converts the calendar's month and year into text.
  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  // Goes through each completion and gets its date.
  const completedDays = completions.map((completion) => {
    const date = new Date(completion.date)
    // Takes the year, month, and day to compare with the calendar.
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  })

  const emptyDays = [] // Stores values for empty cells so the first date appears under the correct weekday.
  // Adds values to the array for the empty cells.
  for (let i = 0; i < firstDay; i++) {
    emptyDays.push(i)
  }
  
  const days = [] // Stores all days of the month.
  // Adds all the days to the array.
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  // Changes the calendar to the previous or next month.
  function changeMonth(amount) {
    setCurrentMonth(new Date(year, month + amount, 1))
  }

  return (
    <div className='monthly-tracker'>
      <div className='monthly-tracker-header'>
        {/* Moves to the previous month */}
        <button onClick={() => changeMonth(-1)}>
          {'<'}
        </button>

        <h3>{monthName}</h3>

       {/* Moves to the next month */}
        <button onClick={() => changeMonth(1)}>
          {'>'}
        </button>
      </div>

      <div className='monthly-tracker-grid'>
        {/* Shows the weekdays at the top of the calendar */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <span key={index} className='monthly-tracker-weekday'>
            {day}
          </span>
        ))}

        {/* Shows empty cells before the first date */}
        {emptyDays.map((day) => (
          <span key={`empty-${day}`} />
        ))}

        {/* Goes through each day of the month */}
        {days.map((day) => {
          const calendarDate = `${year}-${month}-${day}`
          // Checks if the habit was completed on this date.
          const isCompleted = completedDays.includes(calendarDate)
          
          // Adds a CSS class to highlight the date if the habit was completed.
          let dayClass = 'monthly-tracker-day'
          if (isCompleted) {
            dayClass = 'monthly-tracker-day completed'
          }

          return (
            <div key={day} className={dayClass}>
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MonthlyTracker
