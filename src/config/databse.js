import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/getReady-interview`);
        console.log("MongoDB connected.",connectionInstance.connection.host);
    } catch (error) {
        console.log("DB connection failed", error.message)
        throw error;
    }
}
