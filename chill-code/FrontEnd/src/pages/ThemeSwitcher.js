import React, { useEffect, useState } from 'react';

function ThemeSwitcher() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button onClick={toggleTheme} style={{
      position: 'fixed',
      top: 10,
      right: 10,
      padding: '10px 20px',
      cursor: 'pointer',
      borderRadius: '5px',
      backgroundColor: theme === 'dark' ? '#fff' : '#333',
      color: theme === 'dark' ? '#333' : '#fff',
      border: 'none'
    }}>
      Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  );
}

export default ThemeSwitcher;
