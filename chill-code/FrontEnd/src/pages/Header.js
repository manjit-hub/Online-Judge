// Header.js
import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { UserContext } from './UserContext';
import './Header.css';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons

function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { user } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    const currentPath = location.pathname;

    // Logout handler
    const handleLogout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/logout`, {}, { withCredentials: true });
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    let navigationButtons;

    if (user && user.user) {
        navigationButtons = (
            <div className="nav-buttons">
                <Link to="/problemslist" className="nav-link">Problems</Link>
                <Link to={`/profile/${user.user._id}`} className="nav-link">Profile</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        );
    } else if (currentPath === '/' || currentPath === '/login' || currentPath === '/signup') {
        navigationButtons = (
            <div className="nav-buttons">
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
                <Link to="/login" className="nav-link button">Log In</Link>
                <Link to="/signup" className="nav-link button">Sign Up</Link>
            </div>
        );
    } else {
        navigate('/login');
        return null;
    }

    return (
        <header className={`site-header ${theme}`}>
            <Link to="/">
                <img src="/Assets/logo.png" alt="Logo" className="logo" />
            </Link>
            {navigationButtons}
        </header>
    );
}

export default Header;
