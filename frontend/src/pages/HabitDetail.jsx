import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EditHabit from '../components/EditHabit'
import './HabitDetail.css'

function HabitDetail() {
  // Gets the habit ID from the URL.
  const { id } = useParams()
  // Allows navigation back to the Home page.
  const navigate = useNavigate()

  // Stores a habit loaded from the backend.
  const [habit, setHabit] = useState(null)
  // Stores an error message if the habit fails to load.
  const [error, setError] = useState('')

  // Checks whether the user is editing the habit.
  const [isEditing, setIsEditing] = useState(false)

  // Gets the authentication token.
  const token = localStorage.getItem('token')
  
  // Loads the selected habit.
  useEffect(() => {
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

    getHabit()
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
          {!isEditing && (
            <>
              <div className='habit-detail-description'>
                <h2>{habit.description}</h2>

                {!habit.completed && (
                  <button
                    className='edit-habit-button'
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Habit
                  </button>
                )}
              </div>
              <p className='habit-status'>{status}</p>
              <div className='habit-notes'>
                <h3>Notes</h3>

                <div className='notes-content'>
                  <p>{habit.notes || 'No notes yet.'}</p>
                </div>
              </div>

              <p className='habit-created'>
                Created: {new Date(habit.createdAt).toLocaleDateString()}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default HabitDetail
