import React, { useState } from "react";
import "../auth.form.scss"
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";


const Login = () => {

    const {loading, handleLogin} = useAuth()
    const navigate = useNavigate()


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     handleLogin({email, password})
    // }

    const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Login attempt with:", {email, password});  // Add this debug line
    if (!email || !password) {
        console.error("Email or password is empty!");
        return;
    }
    await handleLogin({email, password})
    navigate("/")
}

    if(loading){
        return (
            <main>
                <h1>
                    Loading...
                </h1>
            </main>
        )
    }

    return(
        <main>
            <div className="form-container">
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={(e) => {setEmail(e.target.value)}}
                            type="email" id="email" name="email" placeholder="Enter email adrs"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => {setPassword(e.target.value)}}
                            type="password" id="password" name="password" placeholder=".........."/>
                    </div>

                    <button className="button primary-button">Login</button>

                </form>

                <p>Don't have an account? <Link to={"/register"}>Regsiter</Link></p>
            </div>
        </main>
    )
}

export default Login