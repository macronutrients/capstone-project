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
    res.json(habit);
    }
    catch(error){
        res.status(500).json({message:"Unable to create Habit"}); //error message for backend failed in trying 
    }
});
//this time we are creating a habbit instead of pulling hairs for specifics thanks to our create function
router.post("/", async (req,res)=>{
    try{
        const newHabit = await prisma.habit.create({
            data:{
                description:req.body.description, notes: req.body.notes, userId: Number(req.body.userId)
            }
        });
        res.status(201).json(newHabit);
    }
    catch(error){
        res.status(500).json({message:"Unable to create Habit"});
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
module.exports = router;//allow this file to be available elsewhere
