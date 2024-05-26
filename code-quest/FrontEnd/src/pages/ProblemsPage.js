// import React from "react";
import './ProblemsCSS.css';

function ProblemsPage() {
    return (
        <body1>
            {/* <div className="header">
                <img src="/Assets/logo.png" alt="Logo" />
            </div> */}
            <div className="split">
                <div className="dashboard">
                    <button className='btnPrb'><img src="/Assets/DashboardLogo.png" alt="Logo" />Dashboard</button>
                    <button className='btnPrb'><img src="/Assets/3LineLogo.png" alt="" />Leaderboard</button>
                    <button className='btnPrb'><img src="/Assets/DiscussionLogo.png" alt="Logo" />Discussion</button>
                    <button className='btnPrb'><img src="/Assets/ProgressLogo.png" alt="" />Progress</button>
                    <button className='btnPrb'><img src="/Assets/ProfileLogo.png" alt="" />Profile</button>
                </div>

                <div className="rightSide">
                <div className="search">
                    <h1>Problems</h1>
                    <input type="text" className="inpPrb" placeholder="Search Problems" />
                </div>

                <div className="tags">
                    <button className='PrbTagsBtn'>All</button>
                    <button className='PrbTagsBtn'>Easy</button>
                    <button className='PrbTagsBtn'>Medium</button>
                    <button className='PrbTagsBtn'>Hard</button>
                    <button className='PrbTagsBtn'>Binary Search</button>
                    <button className='PrbTagsBtn'>Recursion</button>
                    <button className='PrbTagsBtn'>DP</button>
                    <button className='PrbTagsBtn'>Back Tracking</button>
                    <button className='PrbTagsBtn'>Graph</button>
                </div>
                </div>
            </div>

        </body1>
    );
}

export default ProblemsPage;