import React from "react";
import {useNavigate, Link} from "react-router"

const Register = ()=>{

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return(
        <main>
            <div className="form-container">
                <h1>Register New User</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Yagyam B Aggarwal"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="yagyam@1234gmail.com"/>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder=".........."/>
                    </div>

                    <button className="button primary-button">Register</button>

                </form>

                <p>Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
        </main> 
    )
}

export default Register