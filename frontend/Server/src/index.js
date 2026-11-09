const express= require("express");
const cors=require("cors");
require("dotenv").config();

const app= express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.0.1:5173"
    ]
}));

app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Hunter Habit Tracker API is running!");
});

app.get("/api/health",(req,res)=>{
    res.json({
        status: "success",
        message: "Habit Garden Backend is working"
    });
});

const PORT= process.env.PORT || 4000;

app.listen(PORT, () =>{
    console.log('API listening on http://localhost:${PORT});')
});
