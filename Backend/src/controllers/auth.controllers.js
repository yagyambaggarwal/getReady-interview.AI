import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";


// Register User
export const registerUser = async (req, res) => {
    // Getting user details from frontend
    const {username, password, email} = req.body;
    console.log("Username", username);
    console.log("Password", password);
    console.log("Email", email);

    // Validating user details
    if(!username || !password || !email){
        return res.status(400).json({
            message : "Please provide username, email and password."
        })
    }

    // checks if the user already exists
    const existingUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if(existingUser){
        return res.status(400).json({
            message : "Account already exists with this email or username."
        })
    }

    // Creating the user
    const user = await User.create(
        {
            username : username,
            password : password,
            email : email
        }
    );


    const createdUser = await User.findOne({username}).select("-password");

    if(!createdUser){
        return res.status(500).json({message : "Error while creating a user"});
    }

    const secretToken = jwt.sign(
        {
            id : user._id,
            username : user.username,
            email : user.email
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn : process.env.JWT_SECRET_KEY_EXPIRY
        }
    )

    // Setting the secret token as cookie
    res.cookie("token", secretToken)

    return res.status(201).json({
        message : "User Created successfully.",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })

}

// Login User
export const loginUser = async (req, res) => {
    // Getting password and username or email
    const {email, password} = req.body;
    
    
    console.log("Email: ", email , " Password: ", password)

    if(!email || !password){
        return res.status(400).json({message : "Please enter password and email."})
    }

    const user = await User.findOne({
        email
    })

    if(!user){
        return res.status(400).json({message : "User dont exists."})
    }

    const isValidPassword = await user.isPasswordCorrect(password)
    if(!isValidPassword){
        return res.status(400).json({
            message : "Enter the correct password"
        })
    }

    const secretToken = jwt.sign(
        {
            id : user._id,
            username : user.username,
            email : user.email
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn : process.env.JWT_SECRET_KEY_EXPIRY
        }
    )

    return res.status(200).cookie("token", secretToken).json({
        message : "User logged in successfully."
    })
}

// Logout User
export const logoutUser = async (req, res) => {
    console.log("User logged out successfully")

    return res.status(200).clearCookie("token").json({message : "User Logged Out!"})
}

// Get User
export const getUser = async(req, res) => {
    let user = req.user;

    user = await User.findById(user._id).select("-password -createdAt -updatedAt -__v");

    return res.status(200).json({
        message : "Here's the user's profile.",
        data : user
    })
}