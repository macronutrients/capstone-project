const {PrismaClient} = require("../generated/prisma");//this line just loads the prisma code from our local file but prisma itself isn't our creation entirely
const jsonWebToken = require("jsonwebtoken"); //loads jsonwebtoken from an external package that we have downloaded earlier

const prisma = new PrismaClient(); //now that we have loaded the prismaclient we store it somewhere for later use in this case we store it in prisma

const requireAuth = async (req, res, next)=> { //our large function with multiple checks for verification purposes and this is why we have next to continue to the next function
    try{
        const authHeader = req.headers.authorization; //using the requesters header we look for specifically the authorization header that is apart of the https library , along with the header itself  
    

    if(!authHeader){ //if its not the correct header the authorization header then
        return res.status(401).json({ //sent out the error code 401
            message:"Authentication required" // and the error message
        });
    }

    const parts = authHeader.split(" ");//if it is then split the header where ever we see a space creating a big array with multiple strings

    if (parts.length !==2 || parts[0] !== "Bearer"){ // only valid if it is exactly 2 the length, and also if it says bearer because bearer is an http thing 
        return res.status(401).json({ //the error code
            message: "invalid authorization format" //the error message
        });
    }
    const token = parts[1]; //take the second string in the array and label it token, the first string will always be bearer

    if(!process.env.jsonWebToken_SECRET){//this is checking if the jsonwebtokensecret is inside of the object process running as a variable if not then run the error block
        console.error("jsonWebToken_SECRET is missing");//the error message for the console/developer/myteam

        return res.status(500).json({//sends back the error code 
            message: "Server authentication configuration error" //sends back the error message
        });
    }

    const decoded = jsonWebToken.verify(token,process.env.jsonWebToken_SECRET);//using our jsonwebtoken variable use verify to check whether token is a legit token or not using the function/tool jsonwebtoken and store it in decoded
    if (!decoded.userId){ //that second string actually has more information and after it is decoded it has 3 seperate sections presumumbly thats how long the second string is its just all grouped up after decoding its seperated and more accessible, here we just grab the body the second part most likely which is the userid. 
        return res.status(401).json({// this code only runs if the decoded.userId block is falsey and it runs error code 401
            message: "Invalid authentication token" //the error message
        });
    }

    const user = await prisma.user.findUnique({//go into the users stuff using prisma and find these specific values
        where: {
            id: Number(decoded.userId)//comparing id to the number(decoded.userid)we just got looking for a match
        },
        select:{ //select just goes into the fields below and returns their values
            id: true, email: true, stars: true, currentPetId: true
        }
    });

    if(!user){//checks if their was a match or not if their wasn't a match then error 
        return res.status(401).json({ //the actual error code
            message: "User account no longer exists" //the error message for everyone to see
        });
    }

    //attach something here waiting for something
    req.user = user; //stores the matched user and the fields that we gave it in the select

    next();//so we can move on because a req isn't gonna do the trick for us to allow us to move on
}

catch(error){//ultimatly primsa and json ran into some trouble so error, but lets go through the stages
    if(error.name ==="TokenExpiredError"){ // tells us that the error was of this type 
        return res.status(401).json({message: "Authentication token expired"}); //gives the this error messages and code for the error.name = tokenexpired
    }

    if(error.name === "JsonWebTokenError"){//error was of this type jsonwebtoken package detected an invalid package
        return res.status(401).json({ //the error code 
            message:"Invalid authentication token" //the error message for this type of errorjsonwebtokenError
        });
    }

    console.error("Authentication middleware error:", error); //error message to the developer/myteam

    return res.status(500).json({ //error code for prisma and json didn't work out can be more than just those too though
        message: "Unable to authenticate user" // the message for this type of error
    });
}
}

module.exports = {
    requireAuth //exporting the requireAuth function

};
