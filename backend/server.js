const express = require("express"); //this loads the express items that were downloaded
const habitRoutes = require("./routes/habitRoutes"); //here we are loading the local files that I have created in javascript this case habitRoutes

const authRoutes = require("./routes/AuthRoutes");//Now we move on to the next java file and load it AuthRoutes
const petRoutes = require("./routes/petRoutes");//Moving on to loading the petRoutes file
const rewardRoutes = require("./routes/rewardRoutes"); // followed by the rewardRoutes file
const cors = require("cors"); //now were back to the external packages, and this is what helps us get a different backend and frontend server link
 
const app = express(); //here we store the express application object in the variable or the const variable called app
const PORT = 3000; //const holder 3000 name PORT

app.use(cors()); //easier flow of communication helps with the unblocking of communication from frontend and backend when referring to the different links
app.use(express.json()); //this line basically parses json bodies(basically json info) if the request comes with json info

app.get("/", (req, res)=>{ //app is our application then we use get / is the address path used when communicating and req is the items the frontend is bringing while
    res.send("Backend is running"); //res is what the backend is giving back which in this case its a message saying that the backend is running
});
//now these are different because the cors() file dealt with every request these tone it down to the specific route that the server is in.
app.use("/habits", habitRoutes);  // for this route if in habits then give the request to the habits file so the habit related request can be handled
app.use("/pets", petRoutes); // this is the same thing but now were dealing with the petRoutes file
app.use("/auth", authRoutes); //Now this is still similar to the others looking for the auth type of request if were looking at the more consistent repeated checks we would have to go to authMiddleware.js for that
app.use("/rewards", rewardRoutes); //also along the same path when a request is made to this file then it handles its section of work this case pet routes

app.listen(PORT,()=>{ //this is what brings the server alive here the app actually starts paying attention for incoming request it opens the server for action the res doesn't send back until this function opens up shop

    console.log(`Server running on port ${PORT}`); //terminal message for us

});
