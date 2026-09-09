const express = require("express"); //this loads the express items that were downloaded

const app = express(); //here we store the express application object in the variable or the const variable called app
const PORT = 3000; //const holder 3000 name PORT

app.use(express.json()); //this line basically parses json bodies(basically json info) if the request comes with json info

app.get("/", (req, res)=>{ //app is our application then we use get / is the address path used when communicating and req is the items the frontend is bringing while
    res.send("Backend is running"); //res is what the backend is giving back which in this case its a message saying that the backend is running
});

app.listen(PORT,()=>{ //this is what brings the server alive here the app actually starts paying attention for incoming request it opens the server for action the res doesn't send back until this function opens up shop
    console.log(`Server running on port ${PORT}`); //terminal message for me
});