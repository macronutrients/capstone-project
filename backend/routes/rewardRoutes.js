const express = require("express"); //we are loading the express file that we downloaded key functions
const router = express.Router();//one of our legendary functions provided by express

const {PrismaClient} = require("../generated/prisma"); //now we are loading a local file prisma, because we downloaded it locally but we didn't built from scratch 
const prisma = new PrismaClient();//we are using prisma here dynamically by storing it in a new object called PrismaClient 

const {requireAuth} = require("../middleware/authentiMiddware"); //we are loading this from our folder called middleware we actually created that file authenti
//when someone sends a get request to status this time instead of immediatly running it we are first comfirming that it passes the requestauth funciton then if it does she shall proceed
router.get("/status", requireAuth, async(req, res)=>{ //first we go into the pets file then we go into status, 
    try {
        const user = await prisma.user.findUnique({//we are looking for a specific user id this function is not only for habits and the function comes from prisma
            where:{ id: req.user.id}, select:{ id: true, stars: true, currentPetId: true, //we are asking for this information when we get the data back
                pets: {include: {pet:true}}

            }
        });

        if (!user){ //if we can not find the user then send the error message
            return res.status(404).json({ //error code
                message: "User not found" //the message
            });
        }
        res.json({ // return the data that we collected or requsted return it back in json form
            stars: user.stars, 
            currentPetId: user.currentPetId, petCollection: user.pets
        });
    }

    catch(error){ //the javascript legendary catch error function that returns if the above fails
        res.status(500).json({ // the code
            message: "Unable to get reward status" // the message
        });
    }
});

router.get("/pets", requireAuth, async(req, res)=> {//another get function but this time we are getting the pets  same idea requester then bop then send back as res
    try{
        const pets = await prisma.pet.findMany();// this line is getting all of the pets not specific just give me them all

        const collection = await prisma.petCollection.findMany({ //here we are getting all of the pets that are in the collection of the user 
            where: { userId: req.user.id} //when we call the user.id, this is also calling the pet id because this is the same row were basically calling their pets with one command getting his user id

        });
        const ownedPetIds = collection.map(item => item.petId); //this line goes through the pet Id's that are in each user line takes them out and creates a new variable for it. 
        const rewardPets = pets.map(pet=>{ //takes the big object array and divides it down into nicer smaller arrays
            return{
                ...pet, owned:ownedPetIds.includes(pet.id)//so first we put everything in pets at least all of the info, then we create that new property owner and check whether the pets information aligns with this one and if it does then it is success
            };
        });
        res.json(rewardPets);//now we return our result back to the requester

    }
    catch(error){ //the error message just in case things don't work out
        res.status(500).json({ // error code
            message: "Unable to get reward pets" //error message
        });
    }
});

router.post("/unlock/:petId", requireAuth, async(req,res)=>{ //we are calling this route name unlock/:petId followed by the authent, then the allow the wait function later the get request and all of that
    try {
        const petId = Number(req.params.petId); //get the petId using the Url sent by the requester
        const pet = await prisma.pet.findUnique({//now we use this petId go into our prisma, and we try to find the matching petId
            where:{ id:petId //the info that we are using to look for it we just created it
            }
        });
        if(!pet){ //if we don't find it return an error
            return res.status(404).json({
                message: "Pet not found" // the error message
            });
        }

        const existingPet = await prisma.petCollection.findUnique({ //here we are using the pet collection that is being communicated by prisma, and we are looking for the pet that is in the users libraay and we are storing it in this existing pet variable.
            where:{userId_petId: {userId: req.user.id, petId: petId}} //the processes information
        });

        if(existingPet) { //If it then return the message you already have it.
            return res.status(400).json ({ // return the code for you can't' get it
                message: "Pet is already unlocked" //return the message that you already have it
            });
        }
        //adding the stars check
        const user = await prisma.user.findUnique({//using the prisma for postgresql gets user information
            where:{id:req.user.id} //the specific user information compared to the requested user information looking for a match
        });

        if(user.stars<pet.requiredStars){ //checks the user stars to be more than the required amount of stars we have stored
            return res.status(403).json({ //returns an error mesage if this is not true I said it backwards but same idea
                message: "Not enough stars to unlock this pet" // the actual error message
            });
        }


        const unlockedPet = await prisma.petCollection.create({ //unlocks a pet by first making changes to pet collection by creating a record
            data:{userId: req.user.id, petId: petId}, include: { //which includes updating data, with a new userId which is the requested one and a new petId which is the url sent by the requester 
                pet:true //give up the pet details
            }
        });

        res.status(201).json({ // success code if the file worked out
            message: "Pet unlocked", pet: unlockedPet //success message you unlocked your new pet !! and we put it in our response back thats in json format unlock with all of its unlocked pet variable information
        });
    }

    catch(error){ //unsuccesfully pet addition
        res.status(500).json({ //the error code 
            message: "unable to unlock pet" // the error message
        });
    }
});

module.exports = router; //export the updated router