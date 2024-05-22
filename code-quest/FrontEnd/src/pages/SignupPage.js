import React from "react";
import './LoginPage.css';
import googleLogo from "./GoogleLogo.png";
function SignupPage() {
    return(
        <div className="LoginPage">
            <div className="header">
                <img src="/Assets/logo.png" alt="Logo" />
            </div>
            <div className="content">
                <h2>Register</h2>
                <div className="boxes">
                    <h5>Full Name</h5>
                    <input type="text" />
                    <h5>Email</h5>
                    <input type="text" />
                    <h5>Username</h5>
                    <input type="text" />
                    <h5>Password</h5>
                    <input type="text" />
                    <button className="loginPg">Sign Up</button>
                    <p className="checking">or</p>
                    <button className="google">
                        <img src={googleLogo} alt="Google Logo" className="google-logo"/>Continue with Google 
                    </button>
                </div>
                
                <p className="last">Already have an account?</p>
                <a href="" className="last">Log In</a>
            </div>
        </div>
    );
}

export default SignupPage;