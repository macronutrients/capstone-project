const express = require("express");//loading express package
const router = express.Router();//use express and create router object the route handling system

const {PrismaClient} = require("../generated/prisma"); //getting the database stuff from database section and loading it
const prisma = new PrismaClient(); //the shorthand for it now we have it inside the variable prisma

//g all habits
router.get("/", async (req, res)=> { //req incoming request that already happened
    try {
        const habits = await prisma.habit.findMany(); //gathering our intel of what we want to send back(all of the habits records) because of our findmany function
    res.json(habits);} //sends it back
    catch(error){ //error message creator 
        res.status(500).json({message: "Unable to create Habits"}); //send back this error message to the requester
    }
});

//g one habit
router.get("/:id", async(req,res) => { //now after this request has already been sent now we want something more specific
    try{
        const habit = await prisma.habit.findUnique({ //use findUnique to declare we want specific
            where:{
                id:Number(req.params.id) //going into file specifics
            }
        });

    if(!habit){
        return res.status(404).json({message:"Habit not found"});//error message not found but code ran
    }
    res.json(habit); //this just sends back to the requester the information that it wanted in relation to habits in the json format
    }
    catch(error){
        res.status(500).json({message:"Unable to create Habit"}); //error message for backend failed in trying 
    }
});
//this time we are creating a habbit instead of pulling hairs for specifics thanks to our create function
router.post("/", async (req,res)=>{ //so go into habits looks at the request and send back
    try{
        const newHabit = await prisma.habit.create({ //a new habbit we create a new habbit using prisma the database communicator
            data:{
                description:req.body.description, notes: req.body.notes, userId: Number(req.body.userId) //database info
            }
        });
        res.status(201).json(newHabit); //201 created succesfully now we move on to sending it back but in json form
    }
    catch(error){ //now we use the built into javascript function catch for when things don't go so great 
        res.status(500).json({message:"Unable to create Habit"}); //send womp womp message 
    }

});
//complete the habbit creation process
router.patch("/:id/complete", async(req,res)=>{
    try{
    const habit = await prisma.habit.findUnique({
        where:{id:Number(req.params.id)} //requesting specifcs
    });
    
    if(!habit){
        return res.status(404).json({message:"Habit not found"}); //unable to get what we wanted error
    }

    if(habit.completed){ //success not an error messsage actually celebration message
        return res.status(400).json({
            message:"Habit is already Complete"
        });
    }

    const completedHabit = await prisma.habit.update({ 
        where:{ //get that habit we were working on that specifc one
            id:Number(req.params.id)
        }, data:{completed:true, completedAt: new Date()}
    });
    await prisma.user.update({ //update that habit that we were working ond save it
        where:{id:habit.userId}, data:{stars:{increment: 1}}
    });
    res.json({message: "Habit completed", habit: completedHabit, starsEarned: 1 //our success is noted
    });

}catch(error){
    res.status(500).json({
        message:"Unable to create habits" //error message could not finish the creation
    });
}
});
//our second patch this is mostly for editing the habit, instead of marking it as complete like the other one and giving away stars
router.patch("/:id", async(req, res) =>{ //same principle though go into the file the specific id ofcourse that were looking for get the request
    try{ //try something risky out
        const habit = await prisma.habit.findUnique({ // we go into the habbit and look for that specific habit id instead of all of the habits
            where:{id:Number(req.params.id)} //get the information that we want to edit
        });
        if(!habit){ //if we can't even at least find the correct habit throw the womp womp message
            return res.status(404).json({
                message:"habit not found" // the message
            });
        }
        constupdatedHabit = await prisma.habit.update({ //if we found it continue, and this time we wait to ofcourse get the correct information then we use update to perform the task with
            where:{id:Number(req.params.id)}, // all of these lovely parameters to get the correct information
            data:{description:req.body.description, notes:req.body.notes}
        });
        res.json({ // now that that job is done now we are sending back the information in ofcourse json format
            message:"Habit updated", habit:updatedHabit //successful message along with the updated habit stuff inside the habit object
        });
    }
    catch(error){// the catch error function from the javascript, that is put in place after the try because try is risky
        res.status(500).json({ //this is what we sent back to the requester if this is not working, error message.
            message: "Unable to update habit" //the message
        });

    }
});

router.delete("/:id",async(req,res) => {//we go into the specific habit using id then we get the requested information with ofcourse async because were prolly gooing to have to wait for someone
    try{
        const habit = await prisma.habit.findUnique({ //store the unique habit in habbit after we have finished receiving the infomation because this is where were waiting
            where:{id:Number(req.params.id)} //the required specifics
        });
        if(!habit){ //if we can not find the habit we are looking for then
            return res.status(404).json({ //we get an error message
                message:"Habit not found" //the error message 
            });
        }

const deleteHabit = await prisma.habit.delete({ //where the actual deleting is taking place
    where:{ id:Number(req.params.id)} //make sure where deleting the right habit which ofcourse is stored in the deletehabit variable

});
res.json({//were sending back our updated info in json format
    message:"Habit deleted", habit:deletedHabit //creating that habit object with the opdated info along with the message of course
});
    }
    catch(error){ //the error message if things go south provided by our sponsor javascript(trolling not sponsored)
        res.status(500).json({
            message:"Unable to delete habit"//error message to appear
        });
}

});
module.exports = router;//allow this file to be available elsewhere
