import { Router } from "express";
import multer from "multer";
import { jwtVerified } from "../middleware/auth.middleware.js";

import 
    { 
        getUser,
        loginUser,
        logoutUser,
        registerUser
    } from "../controllers/auth.controllers.js";

    

const upload = multer()


export const authRouter = Router()


authRouter.route("/register").post(upload.none(), registerUser);
authRouter.route("/login").post(upload.none(), loginUser);
authRouter.route("/logout").get(jwtVerified, logoutUser);
authRouter.route("/get-me").get(jwtVerified, getUser)