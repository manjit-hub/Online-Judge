// index.js or App.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App'; // Your main application component

const root = ReactDOM.createRoot(document.getElementById('root')); // EXTRA AADED
root.render(  // Instead of using 'ReactDOM' using 'root'
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);