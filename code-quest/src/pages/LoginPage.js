import React from "react";
import './LoginPage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import googleLogo from "./GoogleLogo.png";
function LoginPage() {
    return(
        <div className="LoginPage">
            <div className="header">
                <img src="/Assets/logo.png" alt="Logo" />
            </div>
            <div className="content">
                <h2>Log in to CodeQuest</h2>
                <div className="boxes">
                    <h5>Username</h5>
                    <input type="text" />
                    <h5>Password</h5>
                    <input type="text" />
                    <button className="loginPg">Log In</button>
                    <p className="checking">or</p>
                    <button className="google">
                        <img src={googleLogo} alt="Google Logo" className="google-logo"/>Continue with Google 
                    </button>
                </div>
                
                <p className="last">Don't have an account?</p>
                <a href="" className="last">Sign up</a>
            </div>
        </div>
    );
}

export default LoginPage;