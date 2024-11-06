// Header.js
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from './ThemeContext';
import { UserContext } from './UserContext';
import './Header.css';
import { FaSun, FaMoon } from 'react-icons/fa';

function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const user = useContext(UserContext);
    const {setUser,} = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/logout`, {}, { withCredentials: true });
            
            // Clear all tokens and user data stored in localStorage and sessionStorage
            localStorage.clear();
            sessionStorage.clear();

            // Reset the user context
            setUser(null);

            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const isAuthenticated = user && user.user && user.user._id;
    // console.log(isAuthenticated)

    const handleLogoClick = () => {
        if (isAuthenticated) {
            navigate('/problemslist');
        } else {
            navigate('/');
        }
    };

    return (
        <header className={`site-header ${theme}`}>
            <div onClick={handleLogoClick} className="logo-container">
                <img src="/Assets/logo.png" alt="Logo" className="logo" />
            </div>

            <div className="nav-buttons">
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
                {isAuthenticated ? (
                    <>
                        {location.pathname.includes('/profile') ? (
                            <Link to="/problemslist" className="nav-link">Problems</Link>
                        ) : (
                            <Link to={`/profile/${user.user._id}`} className="nav-link">Profile</Link>
                        )}
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link button">Log In</Link>
                        <Link to="/signup" className="nav-link button">Sign Up</Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
