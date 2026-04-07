import dotenv from "dotenv";
dotenv.config();

import { app } from "./src/app.js";
import { dbConnect } from "./src/config/databse.js";

const port = 8000;

dbConnect()
.then(()=>{
    app.listen(port, () => {
        console.log("App is running at port: ", port)
    })
})
.catch((error)=>{
    console.log("Error while connecting to DB.", error)
    throw error
})
