import jwt from 'jsonwebtoken';

const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).JSON({error:"Unauthorized - No Token"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).JSON({error:"Unauthorized - Invalid Token"})
        }
        
        next()
    } catch (error) {
        console.log("Error in protect route middleware : ",error.message)
        res.status(500).json({error:"Internal Server Error"})
    }
}

export default protectRoute;