const express = require("express"); //we are loading the express file that we downloaded key functions
const router = express.Router();//one of our legendary functions provided by express

const { PrismaClient } = require("../generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

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

    catch (error) {
    console.error("Pet purchase failed:", error);

    if (error.code === "P2002") {
        return res.status(400).json({
            message: "Pet is already unlocked"
        });
    }

    if (error.status === 403) {
        return res.status(403).json({
            message: error.message
        });
    }

    res.status(500).json({
        message: "Unable to purchase pet"
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
        const user = await prisma.user.findUnique({
    where: { id: req.user.id }
});

if (!user) {
    return res.status(404).json({
        message: "User not found"
    });
}

if (user.stars < pet.requiredStars) {
    return res.status(403).json({
        message: "Not enough stars to unlock this pet"
    });
}

// Deduct stars and unlock the pet together.
const result = await prisma.$transaction(async (tx) => {

    const deducted = await tx.user.updateMany({
        where: {
            id: req.user.id,
            stars: { gte: pet.requiredStars }
        },
        data: {
            stars: { decrement: pet.requiredStars }
        }
    });

    if (deducted.count !== 1) {
        const error = new Error("Not enough stars to unlock this pet");
        error.status = 403;
        throw error;
    }

    const unlockedPet = await tx.petCollection.create({
        data: {
            userId: req.user.id,
            petId: petId
        },
        include: {
            pet: true
        }
    });

    const updatedUser = await tx.user.findUnique({
        where: { id: req.user.id },
        select: { stars: true }
    });

    return {
        unlockedPet,
        remainingStars: updatedUser.stars
    };
});

res.status(201).json({
    message: "Pet purchased",
    pet: result.unlockedPet,
    stars: result.remainingStars
});
    }

    catch(error){ //unsuccesfully pet addition
        res.status(500).json({ //the error code 
            message: "unable to unlock pet" // the error message
        });
    }
});

module.exports = router; //export the updated router