import React from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from './ThemeContext';
import './HomePage.css';

function HomePage() {
    const navigate = useNavigate();

    const handleSignUp = () => navigate("/signup");

    const handleLogIn = () => {
        navigate("/login");
    };

    return (
        <div className="home-page">
            <div className="contentHome">
                <h2>Welcome to Chill Code</h2>
                <p>A friendly place to learn and grow. Get started with a coding challenge, check out our courses, or just hang out and chat.</p>
                <button className="signin btnhome" onClick={handleSignUp}>Sign Up</button>
                <p className="checking">Already have an account?</p>
                <button className="login btnhome" onClick={handleLogIn}>Log In</button>
            </div>
        </div>
    );
}

export default HomePage;
