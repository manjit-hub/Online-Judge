// ProfilePage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';
import { UserContext } from './UserContext';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const { userId } = useParams();
  const [profileInfo, setProfileInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ fullName: '', email: '', newPassword: '', oldPassword: '' });
  const [solvedProblems, setSolvedProblems] = useState([]);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile/${userId}`);
        setProfileInfo(response.data.user); // Adjust according to your response structure
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Error fetching user profile');
      }
    };
    fetchUser();

    const fetchSolvedProblems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/${userId}/solved-problems`);
        setSolvedProblems(response.data.solvedProblems);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };
    fetchSolvedProblems();
  }, [userId]);

  if (!profileInfo) {
    return <p>Loading profile...</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/update`, editData, { withCredentials: true });
      setProfileInfo(response.data.user);
      setIsEditing(false);
      toast.success('User data updated successfully!', {
        position: "top-center",
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error("Wrong Password !", {
        position: "top-center",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (confirmDelete) {
        const password = prompt('Please enter your password to confirm deletion:');
        if (password) {
          const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/delete`, { withCredentials: true, data: { password } });

          // Clear all tokens and user data stored in localStorage and sessionStorage
          localStorage.clear();
          sessionStorage.clear();
          // window.location.reload();

          // Reset the user context
          setUser(null);

          toast.success('Account deleted successfully', {
            position: "top-center",
          });
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Wrong Password !", {
        position: "top-center",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/logout`, {}, { withCredentials: true });
      
      // Clear all tokens and user data stored in localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // Reset the user context
      setUser(null);

      toast.success('Logged out successfully', {
        position: "top-center",
        autoClose: 5000
      });
      setTimeout(
        () => navigate('/login')
        , 2000);
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out: ' + (error.response?.data?.message || error.message), {
        position: "top-center",
      });
    }
  };

  const onClickProfileBtn = () => {
    console.log("Profile Clicked!!");
    if (user && user.user && user.user._id) { 
      navigate(`/profile/${user.user._id}`); 
    } else {
      console.error('User ID not found Comp');
      toast.error("User ID not found!", {position: "top-center"});
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="details">
        <div className="leftSideDetails">
          {/* PROFILE DETAILS */}
          <div className="profileInfo">
            <h2>User Details</h2>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={editData.fullName}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editData.email}
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={editData.newPassword}
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password (for verification)"
                  value={editData.oldPassword}
                  onChange={handleInputChange}
                />
                <div className="operationBtn">
                  <button className="green" onClick={handleUpdate}>Save</button>
                  <button className="green" onClick={() => {
                    setIsEditing(false);
                    setEditData({ fullName: '', email: '', newPassword: '', oldPassword: '' });
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className='showUser'>
                <p><strong>Name:</strong> {profileInfo.fullName}</p>
                <p><strong>Email:</strong> {profileInfo.email}</p>
                <p><strong>Role:</strong> {profileInfo.Admin ? 'admin' : 'user'}</p>
                {/* ACCOUNT ACTIONS */}
                <div className="accountActions">
                  <button className="green" onClick={() => setIsEditing(true)}>Edit</button>
                  <button className="red" onClick={handleLogout}>Logout</button>
                  <button className="red" onClick={handleDelete}>Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rightSideDetails">
          {/* SOLVED PROBLEMS */}
          <div className="solvedProblems">
          <h2>Solved Problems:</h2>
          {solvedProblems && solvedProblems.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Problem</th>
                  <th>Difficulty</th>
                  <th>Last Solved</th>
                </tr>
              </thead>
              <tbody>
                {solvedProblems
                .sort((a, b) => new Date(b.solvedDate) - new Date(a.solvedDate)) // Sort by solvedDate in descending order
                .map((problem) => (
                  <tr key={problem._id}>
                    <td>
                      <Link to={`/problems/${problem._id}`}>{problem.title}</Link>
                    </td>
                    <td>{problem.difficulty}</td>
                    <td>{problem.solvedDate ? new Date(problem.solvedDate).toLocaleDateString() : 'Unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No problems solved yet.</p>
          )}
        </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ProfilePage;
