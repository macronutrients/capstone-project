const express = require("express");
const router = express.Router();

const {habits} = require("../data/mckData");

//g all habits
router.get("/",(req, res)=> {
    res.json(habits);
});

//g one habit
router.get("/:id", (req,res) => {
    const habit  = habits.find(h=>h.id===Number(req.params.id));
    if(!habit){
        return res.status(404).json({message:"Habit not found"});
    }
    res.json(habit);
});
//cre a habbit
router.post("/",(req,res)=>{
    const newHabit ={ id:habits.length + 1, name:req.body.name, completed:false, stars: req.body.stars || 1
    };
    habits.push(newHabit);
    res.status(201).json(newHabit);

});
router.patch("/:id/complete",(req,res)=>{
    const habit = habits.find(h=>h.id ==Number(req.params.id));
    
    if(!habit){
        return res.status(404).json({message:"Habit not found"});
    }

    habit.completed = true;

    res.json({message: "Habit completed", habit:habit, starsEarned: habit.stars
    });

});
module.exports = router;
