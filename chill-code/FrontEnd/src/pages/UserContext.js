// UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the UserContext
const UserContext = createContext();

// UserProvider component that will wrap around parts of your app that need access to the user data
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Making a GET request to fetch the authenticated user
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/me`, {
          withCredentials: true, // Ensure credentials (cookies) are included
        });
        console.log('User data fetched [at User Context]:', response.data); // Log the response data for debugging
        setUser(response.data.user); // Update the user state with fetched user data
      } catch (error) {
        console.error('Error fetching user:', error.response ? error.response.data : error.message);
        setUser(null);
      }
    };

    // Fetch the user data when the component mounts
    fetchUser();
  }, []); // Empty dependency array means this effect runs once on mount

  // Provide the user data and a way to update it (setUser) to any components that need it
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
