// ProfilePage.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userId } = useParams();
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/profile/${userId}`);
        setProfileInfo(response.data.user); // Adjust according to your response structure
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!profileInfo) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="headerProfile">
        <div className="left">
          <img src="/Assets/logo.png" alt="Logo" />
        </div>
        <div className="right">
          <Link to="/problemslist">Problems</Link>
          <Link to="/"><img src="/Assets/ProfileLogo.png" className="navProfile" alt="Profile" /></Link>
        </div>
      </div>

      <div className="details">
          {/* PROFILE DETAILS */}
          <div className="profileInfo">
            <h2>Profile Details</h2>
            <p><strong>Name:</strong> {profileInfo.fullName}</p>
            <p><strong>Email:</strong> {profileInfo.email}</p>
            <p><strong>Role:</strong> {profileInfo.Admin ? 'admin' : 'user'}</p>
          </div>

          {/* SOLVED PROBLEMS */}
          <div className="solvedProblems">
            <h2>Solved Problems</h2>
            {profileInfo.solvedProblems && profileInfo.solvedProblems.length > 0 ? (
              <ul>
                {profileInfo.solvedProblems.map((problem, index) => (
                  <li key={index}>
                    <Link to={`/problems/${problem._id}`}>{problem.title}</Link> - {problem.difficulty}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No problems solved yet.</p>
            )}
          </div>
      </div>
    </div>
  );
};

export default ProfilePage;
