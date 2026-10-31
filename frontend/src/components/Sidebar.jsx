import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  // Keeps track of whether the sidebar is open or closed.
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // Navigation between pages.
  const navigate = useNavigate()
  // Gets the current page location (to disable its navigation button).
  const location = useLocation()

  function logout() {
    localStorage.removeItem('token') //now we actually get rid of the digital pass then go back to the login page
    navigate('/') //what sends us back to login
  }

  return (
    <>
      {/* Shows the menu button when the sidebar is closed. */}
      {!sidebarOpen && (
        <button
          className='sidebar-toggle open-sidebar'
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}
      {/* Shows the sidebar. */}
      {sidebarOpen && (
        <aside className='sidebar'>
          <div className='sidebar-top'>
            {/* Closes the sidebar when clicked. */}
            <button
              className='sidebar-toggle'
              onClick={() => setSidebarOpen(false)}
            >
             ☰ 
            </button>

            <button className='nav-button'
            onClick={() => navigate('/home')}
            disabled={location.pathname === '/home'}
            >
              Home
            </button>

            <button
              className='nav-button'
              onClick={() => navigate('/collection')}
              disabled={location.pathname === '/collection'}
            >
              Pets
            </button>
          </div>

          {/* Returns the user to the login page. */}
          <button className='logout-button' onClick={logout}> {/*now on top of going back to the login page we also remove the digital pass */}
            LOGOUT
          </button>
        </aside>
      )}
    </>
  )
}

export default Sidebar
