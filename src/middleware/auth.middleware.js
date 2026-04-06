import { User } from "../models/user.models.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const jwtVerified = async (req, res, next) => {
    try {
        const secretToken = req.cookies.token;
    
        if (!secretToken)
            return res.status(400).json({message : "User not Logged In."})
    
        const decoded = jwt.verify(secretToken, process.env.JWT_SECRET_KEY);
    
        const user = await User.findById(decoded?.id);
        if(!user){
            return res.status(401).json({message : "Token is invalid."})
        }
    
        req.user = user;
    
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}
