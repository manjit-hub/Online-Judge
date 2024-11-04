// Footer.js
import React, { useContext } from 'react';
import './Footer.css';
import { ThemeContext } from './ThemeContext'; // Import ThemeContext

function Footer() {
    const { theme } = useContext(ThemeContext); // Get the current theme

    return (
        <footer className={`site-footer ${theme}`}>
            <p>&copy; {new Date().getFullYear()} Chill Code. All rights reserved.</p>
        </footer>
    );
}

export default Footer;
