import { useState } from 'react'

function EditHabit({ habit, onSave, onCancel, showNotes = false }) {
  // Stores the habit description for editing.
  const [description, setDescription] = useState(habit.description)
  // Stores the habit notes or an empty string if there are no notes.
  const [notes, setNotes] = useState(habit.notes || '')

  // Gets the authentication token from localStorage.
  const token = localStorage.getItem('token')

  // Saves the edited habit.
  async function editHabit() {
    // Prevents saving a habit with an empty description.
    if (!description.trim()) {
      return
    }

    // Prepares the updated habit description.
    const updatedData = {
      description,
    }
    // Adds notes if editing from the Habit Detail page.
    if (showNotes) {
      updatedData.notes = notes
    }

    try {
      // Sends a request to the backend to update the habit.
      const response = await fetch(`http://localhost:3000/habits/${habit.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Sends the authentication token for user verification.
          Authorization: `Bearer ${token}`,
        },
        // Sends the updated habit data in JSON format.
        body: JSON.stringify(updatedData),
      })
      const data = await response.json()

      // Checks if the request failed and logs the error message.
      if (!response.ok) {
        console.error(data.message)
        return
      }

      // Sends the updated habit back to the page.
      onSave(data.habit)

    } catch (error) {
      console.error('Error editing habit:', error)
    }
  }

  return (
    <div className='edit-habit'>
      {/* Input field for editing the habit description. */}
      <input
        type='text'
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      {/* Shows the notes field only when showNotes is true. */}
      {showNotes && (
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder='Add notes...'
        />
      )}
      {/* Save and cancel buttons. */}
      <div className='edit-habit-actions'>
        <button onClick={editHabit}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

export default EditHabit
