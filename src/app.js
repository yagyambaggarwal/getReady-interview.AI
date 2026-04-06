import express from "express";
import cookieParser from "cookie-parser";


export const app = express()

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser())


import { authRouter } from "./routes/auth.routes.js";

app.use("/api/auth", authRouter);
