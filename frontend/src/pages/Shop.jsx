import {useEffect, useState} from 'react'
import Sidebar from '../components/Sidebar'
import './Shop.css'

function Shop(){
    const [pets, setPets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

const [ownedPetIds, setOwnedPetIds] = useState([])
const [stars, setStars] = useState(0)
const [buyingPetId, setBuyingPetId] = useState(null)
const [purchaseMessage, setPurchaseMessage] = useState('')

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
                const token = localStorage.getItem('token')

if (token) {
    const statusResponse = await fetch(
        'http://localhost:3000/rewards/status',
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            signal: controller.signal
        }
    )

    if (!statusResponse.ok) {
        throw new Error("Could not load your pet collection.")
    }

    const status = await statusResponse.json()

    setStars(status.stars ?? 0)

    setOwnedPetIds(
        (status.petCollection || []).map(item => item.petId)
    )
}

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
                <p>Your Stars: ★ {stars}</p>

{purchaseMessage && (
    <p role="status">{purchaseMessage}</p>
)}
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
                    

<button
    className="shop-buy-button"
    type="button"
    onClick={() => buyPet(pet)}
    disabled={
        ownedPetIds.includes(pet.id) ||
        buyingPetId !== null ||
        stars < pet.requiredStars
    }
>
    {ownedPetIds.includes(pet.id)
        ? 'Owned'
        : buyingPetId === pet.id
            ? 'Unlocking...'
            : 'Unlock Pet'}
</button>
                        </li>
                ))}
                    </ul>
            </main>
        </div>
    )
}
export default Shop