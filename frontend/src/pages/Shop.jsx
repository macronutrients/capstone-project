import {useEffect, useState} from 'react'
import Sidebar from '../components/Sidebar'
import './Shop.css'

function Shop(){
    const [pets, setPets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(()=>{
        const controller = new AbortController()

        async function loadPets(){
            try{
                const response = await fetch ('http://localhost:3000/pets',{
                    signal:controller.signal,
                })

                if(!response.ok){
                    throw new Error("Could not load the pet shop.")

                }
                const catalog = await response.json()

                if(!Array.isArray(catalog)){
                    throw new Error("The server returned an invalid pet catalog.")
                }

                setPets(catalog)

            }catch(error){
                if(!controller.signal.aborted){
                    setError(error.message)
                }
            }finally{
                if(!controller.signal.aborted){
                    setLoading(false)
                }
            }
        }
        loadPets()
        return () => controller.abort()
    }, [])

    return (
        <div className="shop-page">
            <Sidebar/>
            <main className="shop-content">
                <h1>Pet Shop</h1>
                {loading && <p role="status">Loading pets...</p>}

                {error && <p role="alert">{error}</p>}

                {!loading && !error && pets.length === 0 && (
                    <p>No pets are available yet.</p>
                )}
                <ul className="shop-grid">{pets.map((pet)=> (
                    <li className = "shop-card" key={pet.id}>
                        <img src={pet.imageUrl} alt = {pet.apiPetId} loading = "lazy"
                        />
                        <h2>{pet.name || pet.apiPetId}</h2>
                        <p className="shop-price">
                            <span aria-hidden="true">★</span> {pet.requiredStars} stars
                        </p>
                        </li>
                ))}
                    </ul>
            </main>
        </div>
    )
}
export default Shop