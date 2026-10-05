const express = require("express");// this line just loads the express packaage here and gives it to the variable express
const router = express.Router(); //create a new router using the express package and store it in the variable router

const {PrismaClient} = require("../generated/prisma"); // were loading whatever is at generated prisma taking Prisma client out then pointing back to it
const prisma = new PrismaClient(); //now after getting our blueprint above we actually create the object for communication

const jsonWebToken = require("jsonwebtoken")//for the digital pass

//checking usernames
router.post("/register", async(req,res)=>{
    try{
        const existinguser = await prisma.user.findUnique({
            where:{ email: req.body.email}//here we basically just compare emails from the requester and the prisma temp database to see if they match
        });

if(existinguser){ //if true then the email is already registered
    return res.status(400).json({ //the error message because the email is already registed you can not register another of the same
        message:"Email is already registered" //the actual error message
    });
}

    const newUser = await prisma.user.create({ //if emails were not the same create a new user
        data:{ email: req.body.email, password: req.body.password} // we do this using data, and update email to the new record
    });
    res.status(201).json({//this is where we send back our collection
        message: "User registered", user: newUser //the registration has been succesful and we save this in the record object user for which we have sent back in the json format
    });
}
catch(error){ //the erro message if things went south on the prisma json level
    res.status(500).json({ message:"unable to register user" //the error code and the error message
    });
}
});
//login basically match username and make sure password is correct
router.post("/login",async(req,res)=>{ //async wait req res
    try {
        const user = await prisma.user.findUnique({ //checking for the email match 
            where: {email: req.body.email} // email match and calling it user
        });
        if(!user){ //if no match then say user not found
            return res.status(404).json({ message:"User not found"}); // error code and the message
        }
        if(user.password !== req.body.password){ //here we are checking the password
        return res.status(401).json({message:"Incorrect Password" //the error code along with the error message password is incorrect
        });
    }

    const token = jsonWebToken.sign({userId: user.id}, process.env.jsonWebToken_SECRET,
        {expiresIn: "1h"}
    );

    res.json({//sending back info to the requester but in json format
        message: "Login successful", user:user, token:token //we are creating object user with json and putting our variable users information into it
    });

}
catch (error){ //json and prisma are having trouble in the try block
    res.status(500).json({message:"Unable to login"}); //the error code followed by the error message
}

});

module.exports = router; //extract the router information that we tagged on to the router throughout the file