import React from "react";
import './HomePage.css';

function HomePage() {
    return (
        <body>
            <div className="header">
                <img src="/Assets/logo.png" alt="Logo" />
            </div>
            <div className="contentHome">
                <h2>Welcome to CodeQuest</h2>
                <p>A friendly place to learn and grow.Get started with a coding challenge, check out our courses, or just hang out and chat.</p>
                <button className="signin">Sign In</button>
                <p className="checking">Already have an account?</p>
                <button className="login">Log In</button>
            </div>

        </body>
    );
}

export default HomePage;