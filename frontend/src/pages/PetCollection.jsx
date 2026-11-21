const duckImageUrl = '/images/pets/duck.png'

import './PetCollection.css'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function PetCollection() {
const navigate = useNavigate()
  

  function selectDuck() {
    localStorage.setItem('guestPetImageUrl', duckImageUrl)
    navigate('/home')


  
  }


  return (
    <div className='pet-collection-page'>
      <Sidebar />

      <main className='pet-collection-content'>
         <h1>Choose a pet</h1>

  <ul className='guest-pet-grid'>
    <li className='guest-pet-card'>
      <img src={duckImageUrl} alt='Duck' />
      <span>Quack</span>
      <button type='button' onClick={selectDuck}>
        Select
      </button>
    </li>
  </ul>
      </main>
    </div>
  )
}

export default PetCollection
