import './Home.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Eye, Pencil, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti' //for confetti effect
import EditHabit from '../components/EditHabit'
import Sidebar from '../components/Sidebar'
import HabitIcon from '../components/HabitIcon'
import petBed from '../assets/pet-bed.png'
import streakFire from '../assets/streak-fire.png' //the image that Im using for the streak symbol

function Home() {
  //this is where we show if the flash message is visible or not
  const [showWelcomeEffect, setShowWelcomeEffect] = useState(true)
  // Stores the habit description typed into the input field.
  const [habitDescription, setHabitDescription] = useState('')
  // Stores the list of habits.
  const [habits, setHabits] = useState([])
  // Stores the ID of the habit being edited.
  const [editingHabitId, setEditingHabitId] = useState(null)

  const [streak, setStreak] = useState(0)

  // Stores the ID of the habit with the open menu.
  const [openMenuId, setOpenMenuId] = useState(null)

  // Used to navigate to the Habit Detail page.
  const navigate = useNavigate()

  const token = localStorage.getItem('token') //frontend longer term storagelocalstorage, used and get token from it and call it token
  const [currentPet, setCurrentPet] = useState(null)
  // fixes the issue of starting with streak 0 when not touching the habits yet, 
  async function getUser(){
    try { //literal copy and paste of get habit with minor changes
      // Sends a request to get the habit list.
      const response = await fetch('http://localhost:3000/auth/me', { //fetching a different address auth/me now
        headers: { Authorization: `Bearer ${token}` }, //what our backend code expects to see in the authorization process
      })
      const data = await response.json()

      if (!response.ok) { //if response failed backend could not proceed with the request
        console.error(data.message) //the error message
        return
      }
      // Stores the retrieved streak in the data.streak react state.
      setStreak(data.streak) //takes the streak from the backend and updates react state


      const collectionResponse = await fetch(`http://localhost:3000/pets/collection/${data.id}`, {
        headers:{Authorization: `Bearer ${token}`},
      }, )
      if(!collectionResponse.ok){
        setCurrentPet(null)
        console.error("unable to load the pet collection")
        return
      }
      const collection = await collectionResponse.json()
      const selectedEntry = collection.find((entry)=> entry.petId ===data.currentPetId,)

      
      setCurrentPet(selectedEntry?.pet ?? null)

    } catch (error) {
      console.error('Error loading habits:', error)
    }
  }
  async function getHabits() {
    try {
      // Sends a request to get the habit list.
      const response = await fetch('http://localhost:3000/habits', { //still fetching the address but now we have isntructions for this address that were fetching
        headers: { Authorization: `Bearer ${token}` }, //what our backend code expects to see in the authorization process
      })
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
        headers: {
          // Tells the backend that the data is in JSON format.
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
      setHabits((prevHabits) => [newHabit, ...prevHabits])
      // Empties the input field.
      setHabitDescription('')
    } catch (error) {
      console.error('Error creating habit:', error)
    }
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
      setStreak(data.user.streak)
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

  // Updates the habit list after saving an edit.
  function handleSave(updatedHabit) {
    // Replaces the matching habit with the updated habit.
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id === updatedHabit.id) {
          return updatedHabit
        }

        return habit
      }),
    )

    // Closes the editing form.
    setEditingHabitId(null)
  }

  // Opens or closes the menu for a habit.
  function toggleMenu(id) {
    if (openMenuId === id) {
      setOpenMenuId(null) // Closes the menu if it is already open.
    } else {
      setOpenMenuId(id) // Opens the menu for the selected habit.
    }
  }

  // Loads the habits when the page opens.
  useEffect(() => {
    if(token){
    getHabits()
    getUser() //the new function that we created to deal with the streaks updating when loading the page
    }


  //skipping if option selected
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    setShowWelcomeEffect(false)
    return
  }

  //launching the confetti as the white overlay starts revealing the page.
  const confettiTimer = setTimeout(()=>{
    confetti({
      particleCount: 150, spread: 100, origin: {y:0.6}, zIndex: 10000, disableForReducedMotion: true,

    })
  }, 250)

  //get rid of the overlay when done
  const flashTimer =setTimeout(()=> {
    setShowWelcomeEffect(false)
  }, 800)

  return () =>{
    clearTimeout(confettiTimer)
    clearTimeout(flashTimer)

  }
  }, [])
  
  // Hides habit cards when they start to look cut off while scrolling.
  useEffect(() => {
    // Gets the Home content container.
    const container = document.querySelector('.home-content')
    
    // An observer to check if habit cards are visible.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Hides the card when less than 99% of it is visible.
          if (entry.intersectionRatio < 0.99) {
            entry.target.classList.add('hidden-card')
          } else {
            // Shows the card when it becomes visible again.
            entry.target.classList.remove('hidden-card')
          }
        })
      },
      {
        root: container, // Checks if cards are visible inside the Home content.
        threshold: [0.99], // Runs the callback when the card goes above or below 99% visibility.
      },
    )
    // Finds all habit cards.
    const cards = container.querySelectorAll('.habit-card')
    // Watches each card for visibility changes.
    cards.forEach((card) => {
      observer.observe(card)
    })
    // Stops watching the cards if habits change or the user leaves the Home page.
    return () => observer.disconnect()
  }, [habits]) // Runs again when the habit list changes.

  let habitMessage = ''

  if (habits.length === 0) {
    habitMessage = 'There are no habits to display.'
  }

  // Moves completed habits to the bottom of the list.
  const sortedHabits = [...habits].sort((a, b) => {
    return Number(a.completed) - Number(b.completed)
  })

  return (
    <div className='home-page'>{/*show the effect before anything else*/}
      {showWelcomeEffect && (
        <div className='welcome-flash' aria-hidden='true'/>
      )}
      <Sidebar />
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
          {sortedHabits.map((habit) => {
            let completeMark = ''
            let habitClass = ''
            let backgroundColor = '#f3ebfd'

            // Adds a checkmark and crosses out the text for a completed habit.
            if (habit.completed) {
              completeMark = '✔️'
              habitClass = 'completed-habit'
              backgroundColor = '#d4fadb'
            }
            return (
            <motion.div
              layout='position'
              className='habit-card'
              key={habit.id}
              animate={{
                backgroundColor
              }}
              transition={{
                layout: {
                  duration: 0.7,
                  ease: 'easeInOut'
                },
                backgroundColor: {
                  duration: 0.4
                }
              }}
              >
                {/* Shows the three-dot menu button when the habit is not being edited. */}
                {editingHabitId !== habit.id && (
                  <button
                    className='habit-menu-button'
                    onClick={() => toggleMenu(habit.id)}
                  >
                    ⋮
                  </button>
                )}
                
                <HabitIcon description={habit.description} />

                <div className='habit-info'>
                  {editingHabitId !== habit.id && (
                    <>
                      <span className={habitClass}>{habit.description}</span>

                      <div className='habit-actions'>
                        {/* Shows the dropdown menu with action buttons for the selected habit. */}
                        {openMenuId === habit.id && (
                          <div className='habit-dropdown'>
                            <button
                              onClick={() => navigate(`/habits/${habit.id}`)}
                            >
                              <Eye size={16} /> details
                            </button>

                            {/* Shows the Edit button only for habits that are not completed. */}
                            {!habit.completed && (
                              <button
                                onClick={() => {
                                  setEditingHabitId(habit.id)
                                  setOpenMenuId(null)
                                }}
                              >
                                <Pencil size={16} /> edit
                              </button>
                            )}

                            <button onClick={() => deleteHabit(habit.id)}>
                              <Trash2 size={16} /> delete
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Shows the editing form for the selected habit. */}
                  {editingHabitId === habit.id && (
                    <EditHabit
                      // Passes the selected habit to the EditHabit component.
                      habit={habit}
                      // Updates the habit list after saving the edited habit.
                      onSave={handleSave}
                      // Closes the editing form when Cancel is clicked.
                      onCancel={() => setEditingHabitId(null)}
                    />
                  )}
                </div>
                {/* Completes the habit when clicked (only when the habit is not being edited). */}
                {editingHabitId !== habit.id && (
                  <button
                    className='complete-button'
                    onClick={() => completeHabit(habit.id)}
                    disabled={habit.completed}
                  >
                    {completeMark}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </main>
      {/* Displays the pet bed on the page. */}
      <div className='pet-area'>
        <img src={petBed} alt='Pet bed' className='pet-bed' />
        <div className="pet-with-streak">
         <img 
        src={currentPet?.imageUrl || "/images/pets/Nitro.png"}
      alt = {currentPet?.name ? currentPet.name || "Selected pet" : "Starter pet rock"}
    className="pet-on-bed"/>
    <div className = "streak-display">
      <img src={streakFire} alt='' />
      <span>{streak} {streak ===1 ? 'day' : 'days'}</span>
    </div>
    </div>
    <img src={petBed} alt ="" className="pet-bed-rim"/>
      </div>
    </div>
  )
}

export default Home
