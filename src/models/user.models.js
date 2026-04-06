import mongoose, {Schema, model} from "mongoose";
import bcrypt from "bcryptjs";



const userSchema = new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : [true, "Username should be unique."]
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true
        }
    }, 
    {timestamps : true}
);


userSchema.pre("save", async function () {
    if(!this.isModified("password"))return;

    this.password = await bcrypt.hash(this.password, 10);
    
})


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


export const User = model("User", userSchema);