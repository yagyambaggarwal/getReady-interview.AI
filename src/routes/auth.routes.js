import { Router } from "express";
import multer from "multer";

import 
    { 
        registerUser
    } from "../controllers/auth.controllers.js";

    

const upload = multer()


export const authRouter = Router()


authRouter.route("/register").post(upload.none(), registerUser)

