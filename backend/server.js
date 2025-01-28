import express from "express"
import dotenv from "dotenv"
import authRoutes from "../backend/routes/authRoutes.js"
import connectToMongoDB from "./db/mongoDB.js";
const app = express()
 
dotenv.config();
const PORT = process.env.PORT || 5000

app.get("/",(req,res) =>{
    res.send("Hello World");
})

app.use("/api",authRoutes)
app.listen(PORT,()=>{ 
    connectToMongoDB()
    console.log(`Server running on port ${PORT}`)
}) 