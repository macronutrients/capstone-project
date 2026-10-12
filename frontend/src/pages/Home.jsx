import './Home.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  // Stores the habit description typed into the input field.
  const [habitDescription, setHabitDescription] = useState('')
  // Stores the list of habits.
  const [habits, setHabits] = useState([])

  // Navigation between pages.
  const navigate = useNavigate()

  const token = localStorage.getItem('token') //frontend longer term storagelocalstorage, used and get token from it and call it token

  // Retrieves all habits from the backend.
  async function getHabits() {
    try {
      const response = await fetch('http://localhost:3000/habits', { //still fetching the address but now we have isntructions for this address that were fetching
        headers: { Authorization: `Bearer ${token}` }, //what our backend code expects to see in the authorization process
      })
      // Sends a request to get the habit list.
      const data = await response.json()

      if (!response.ok) { //if response failed backend could not proceed with the request
        console.error(data.message) //the error message
        return
      }
      // Stores the retrieved habits in state.
      setHabits(data)
    } catch (error) {
      console.error('Error loading habits:', error)
    }
  }

  // Creates a new habit.
  async function addHabit() {
    // Prevents an empty habit from being added.
    if (!habitDescription.trim()) {
      return
    }

    try {
      // Sends a request with the new habit data to the backend.
      const response = await fetch('http://localhost:3000/habits', {
        method: 'POST',
        // Tells the backend that the data is in JSON format.
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, //add an additional instruction for authentication
        },
        // Sends the habit description as JSON.
        body: JSON.stringify({
          description: habitDescription,
        }),
      })
      const newHabit = await response.json()

      if (!response.ok) {
        console.error(newHabit.message)
        return
      }

      // Adds the newly created habit to the existing list.
      setHabits((prevHabits) => [...prevHabits, newHabit])
      // Empties the input field.
      setHabitDescription('')
    } catch (error) {
      console.error('Error creating habit:', error)
    }
  }

  function logout() {
    localStorage.removeItem('token') //now we actually get rid of the digital pass then go back to the login page
    navigate('/') //what sends us back to login
  }

  // Marks a habit as completed.
  async function completeHabit(id) {
    try {
      // Sends a request to complete the habit.
      const response = await fetch(
        `http://localhost:3000/habits/${id}/complete`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const data = await response.json()

      if (!response.ok) {
        console.error(data.message)
        return
      }

      // Replaces the matching habit with the updated habit.
      setHabits((prevHabits) =>
        prevHabits.map((habit) => {
          if (habit.id === id) {
            return data.habit
          }

          return habit
        }),
      )
    } catch (error) {
      console.error('Error completing habit:', error)
    }
  }

  // Deletes a habit.
  async function deleteHabit(id) {
    try {
      // Sends a request to delete the habit.
      const response = await fetch(`http://localhost:3000/habits/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        console.error(data.message)
        return
      }

      // Removes the deleted habit from the list.
      setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id))
      // Shows a message after deleting.
      alert(data.message)
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  // Loads the habits when the page opens.
  useEffect(() => {
    getHabits()
  }, [])

  let habitMessage = ''

  if (habits.length === 0) {
    habitMessage = 'There are no habits to display.'
  }

  return (
    <div className='home-page'>
      <aside className='sidebar'>
        <div className='sidebar-top'>
          <button className='nav-button active'>Home</button>

          <button
            className='nav-button'
            onClick={() => navigate('/collection')}
          >
            Pets
          </button>
        </div>

        {/* Returns the user to the login page. */}

        <button className='logout-button' onClick={logout}> {/*now on top of going back to the login page we also remove the digital pass */}
          LOGOUT
        </button>
      </aside>

      <main className='home-content'>
        {/* Section for adding a new habit */}
        <div className='add-habit'>
          <input
            type='text'
            placeholder='Add a habit...'
            value={habitDescription}
            onChange={(event) => setHabitDescription(event.target.value)}
          />

          <button onClick={addHabit}>Add</button>
        </div>

        <h2>My Habits</h2>
        <p>{habitMessage}</p>

        <div className='habit-list'>
          {/* Creates a card for each habit. */}
          {habits.map((habit) => {
            let completeMark = ''
            let habitClass = ''

            // Adds a checkmark and crosses out the text for a completed habit.
            if (habit.completed) {
              completeMark = '✔️'
              habitClass = 'completed-habit'
            }
            return (
              <div className='habit-card' key={habit.id}>
                {/* Displays the habit description and delete button. */}
                <div className='habit-info'>
                  <span className={habitClass}>{habit.description}</span>

                  <div className='habit-actions'>
                    <button onClick={() => deleteHabit(habit.id)}>
                      delete
                    </button>
                  </div>
                </div>
                {/* Completes the habit when clicked. */}
                <button
                  className='complete-button'
                  onClick={() => completeHabit(habit.id)}
                >
                  {completeMark}
                </button>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default Home
