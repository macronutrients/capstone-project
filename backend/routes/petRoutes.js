const express = require("express"); //load express file legendary functions
const router = express.Router(); //use the router legendary function

const {PrismaClient} = require("../generated/prisma"); // load the prisma file this is technically a local file but it was ultimately gotten from somewhere else at some parts of it.
const prisma = new PrismaClient(); //create an object file for this code have it by dynamic

router.get("/", async(req, res)=>{//whole function just send the prisma pets to in json format to the requester
    try{
        const pets = await prisma.pet.findMany(); //here we are actually getting it from prisma even waiting for prisma to actually get the file before we continues
        res.json(pets);//here we are sending it back but in json format to the requester.
    }
    catch(error){ //this is just a standard catch error from javascript for whenever we try risky code in try
        res.status(500).json({ //error code
            message: "Unable to obtain pets" //the actual error message
        });


    }
});

router.get("/collection/:userId", async(req, res)=>{//this is meant to get all of the pets from the requesters user
    try{
        const collection = await prisma.petCollection.findMany({ //here we are getting all of the pets from the prisma pet collection 
            where:{ userId: Number(req.params.userId)}, include:{pet: true} // here we are narrowing it down to the user id that matches the requesters user id, then we follow up with a pet true to get more information about the pet 
        });
        res.json(collection);//here we sent back our findings to the requester in json format
    }
    catch(error){// the error function in case their was a match
        res.status(500).json({message:"Unable to obtain pet collection"}); //the error message and the error code that

    }
});
//here we are adding a pet to the users pet collection if they don't already have a pet
router.post("/collection", async(req, res) =>{ //name of link followed by our wait code, and req res
    try{
        const existingPet = await prisma.petCollection.findUnique({//find unique finds a specific datapoint using the information below and stores it in existing pet
            where:{ userId_petId:{ userId: Number(req.body.userId), petId: Number(req.body.petId)}} //comparing prismas pet and user ids to the requested one by the user
        });

        if(existingPet){ //if its a match well then the pet already exists in your collection
            return res.status(400).json({ //return 400 error code because we didn't want that match
                message:"pet is already in collection" //pet already in collection message
            });
        }
        const collectedPet = await prisma.petCollection.create({// now if they didn't match we move on to adding it to the collection, by creating a new record in the pet collection table that
            data: {userId: Number(req.body.userId), petId: Number(req.body.petId)}, include: {
                pet: true // includes this information the users id the users pet id and the information regarding the pet
            } //pet: true is what allows for the run down of the pet information
        });

        res.status(201).json(collectedPet); //return this new information to the requester in json format
    }
    catch(error){//in case of failed attempt on java and prismas end when trying to complete the task 
        res.status(500).json({ //the error code 
            message: "unable to add pet to collection" //the error message
        });
    }
});
//updating the characters pet that he gets to see on his screen
router.patch("/:petId/select", async (req, res) => {
    try{
        const collectionPet = await prisma.petCollection.findUnique({  //here we are just finding the right pet in pet collection
            where: { // we try to matc the pet with the userId and petId that we have stored compared to the requesters one
                userId_petId: {userId: Number(req.body.userId), petId: Number(req.params.petId)}
            }
        });

        if(!collectionPet){ //if no match then you can't put a pet as your pet that you don't own
            return res.status(403).json({ //error code
                message: "User does not own this pet" // error message
            });
        }

        const updatedUser = await prisma.user.update({//here we are actually updating information because a match was sucessfull
            where:{ id:Number(req.body.userId)}, data: {currentPetId: Number(req.params.petId)} // here we are comparing ids and pet ids to the one that the requester sent
        });//where search, data update it to give the proper pet
        res.json({message: "Pet selected", user: updatedUser}); //proper pet given user updatedUser, adds the actual updated user to the response

    }
    catch(error) { //in case prisma, json, and the libraries helping assist fail.
        res.status(500).json({ //the error code
            message: "Unable to select pet" // the womp womp message
        }); 
    }
});

module.exports = router;