import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import assetRoutes from "./routes/assetRoutes.js"
import employeeRoutes from "./routes/employeeRoutes.js"
import companyRoutes from "./routes/companyRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import connectToMongoDB from "./db/mongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()
app.use(cors());
app.use(express.json({ limit: "10mb" }));  
app.use(express.urlencoded({ limit: "10mb", extended: true })); 

app.use(express.json());
app.use(cookieParser())

dotenv.config();
const PORT = process.env.PORT || 5000
 
app.get("/",(req,res) =>{
    res.send("Hello World"); 
})

app.use("/api",authRoutes)
app.use("/api/asset",assetRoutes)
app.use("/api/emp",employeeRoutes)
app.use("/api/company",companyRoutes)
app.use("/api/notification",notificationRoutes)

app.listen(PORT,()=>{  
    connectToMongoDB()
    console.log(`Server running on port ${PORT}`)
}) 