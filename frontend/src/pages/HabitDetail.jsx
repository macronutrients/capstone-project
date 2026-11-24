import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EditHabit from '../components/EditHabit'
import MonthlyTracker from '../components/MonthlyTracker'
import './HabitDetail.css'
import book from '../assets/book.png'

function HabitDetail() {
  // Gets the habit ID from the URL.
  const { id } = useParams()
  // Allows navigation back to the Home page.
  const navigate = useNavigate()

  // Stores a habit loaded from the backend.
  const [habit, setHabit] = useState(null)
  // Stores the dates when the habit was completed.
  const [completions, setCompletions] = useState([])
  // Stores an error message if the habit fails to load.
  const [error, setError] = useState('')

  // Checks whether the user is editing the habit.
  const [isEditing, setIsEditing] = useState(false)

  // Gets the authentication token.
  const token = localStorage.getItem('token')

  async function getHabit() {
    setError('') // Clears any previous error message.
    setHabit(null) // Clears the previous habit before loading a new one.
    setIsEditing(false) // Closes the editing form when loading another habit.
    try {
      // Sends a request to get the habit from the backend.
      const response = await fetch(`http://localhost:3000/habits/${id}`, {
        headers: {
          // Sends the authentication token for user verification.
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      // Checks if the request failed.
      if (!response.ok) {
        setError(data.message || 'Failed to load habit.')
        return
      }
      // Stores the retrieved habit in state.
      setHabit(data)
    } catch (error) {
      console.error('Error loading habit:', error) // Logs the error for debugging.
      setError('Failed to load habit.') // Stores an error message to display to the user.
    }
  }

  // Loads the completion history for the selected habit.
  async function getCompletions() {
    try {
      // Sends a request to get the completion dates from the backend.
      const response = await fetch(`http://localhost:3000/habits/${id}/completions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) {
        console.error(data.message || 'Failed to load completion history.')
        return
      }
      // Stores the retrieved records in state.
      setCompletions(data)
    } catch (error) {
      console.error('Error loading completion history:', error)
    }
  }
  
  // Loads the selected habit and its completion history.
  useEffect(() => {
    getHabit()
    setCompletions([])
    getCompletions()
  }, [id, token])

  // Updates the habit on the page and closes the editing form after saving.
  function handleSave(updatedHabit) {
    setHabit(updatedHabit)
    setIsEditing(false)
  }

  if (error) {
    return <p>{error}</p>
  }

  // Shows a loading message if the habit is not available yet.
  if (!habit) {
    return <p>Loading habit...</p>
  }

  let status = 'In Progress'

  if (habit.completed) {
    status = 'Completed'
  }

  return (
    <div className='habit-detail-page'>
      <div className='habit-detail-content'>
        <div className='habit-detail-header'>
          <button className='back-button' onClick={() => navigate('/home')}>
            Back
          </button>
          <h1>Habit Detail</h1>
        </div>

        <div className='habit-detail-container'>
          <img src={book} className='habit-detail-book' />
          <div className='habit-detail-card'>
            {/* Shows the editing form when the user clicks the edit button. */}
            {isEditing && (
              <EditHabit
                habit={habit}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
                showNotes={true}
              />
            )}
            {/* Shows the habit details. */}
            {!isEditing && (
              <div className='habit-detail-pages'>
                {/* Left page of the book */}
                <div className='habit-detail-left'>
                  {/* Allows editing if the habit is not completed yet. */}
                  {!habit.completed && (
                    <button
                      className='edit-habit-button'
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Habit
                    </button>
                  )}
                  <h2>{habit.description}</h2>

                  <p className='habit-status'>{status}</p>
                  <div className='habit-notes'>
                    <h3>Notes</h3>

                    <div className='notes-content'>
                      <p>{habit.notes || 'No notes yet.'}</p>
                    </div>
                  </div>

                  {/* Shows the date when the habit was added. */}
                  <p className='habit-created'>
                    Created: {new Date(habit.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {/* Right page of the book */}
                <div className='habit-detail-right'>
                  <h2 className='completion-history-title'>Completion History</h2>
                  <MonthlyTracker completions={completions} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HabitDetail
