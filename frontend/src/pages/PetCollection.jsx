import './PetCollection.css'
import Sidebar from '../components/Sidebar'

function PetCollection() {
  return (
    <div className='pet-collection-page'>
      <Sidebar />

      <main className='pet-collection-content'></main>
    </div>
  )
}

export default PetCollection
