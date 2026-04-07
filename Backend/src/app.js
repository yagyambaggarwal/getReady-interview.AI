import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

export const app = express()

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser())
app.use(cors(
    {
        origin : process.env.CORS_ORIGIN,
        credentials : true
    }
))



import { authRouter } from "./routes/auth.routes.js";

app.use("/api/auth", authRouter);
