const express= require("express");
const cors=require("cors");
require("dotenv").config();

const app= express();

app.use(cors({
    origin: /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.post("/auth/login",async(req, res)=> {
    console.log("Login request received");

    res.status(500)
    .json({
        error: "Login endpoint reached, but authentication is not implementated yet"});
});

app.get("/", (req, res)=>{
    res.send("Hunter Habit Tracker API is running!");
});

app.get("/api/health",(req,res)=>{
    res.json({
        status: "success",
        message: "Habit Garden Backend is working"
    });
});

const PORT= process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log('API listening on http://localhost:${PORT});')
});
