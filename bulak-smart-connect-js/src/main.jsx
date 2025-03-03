import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM from 'react-dom/client'
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { AuthProvider } from './AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create the root
root.render(
  <BrowserRouter>  {/* Wrap App in BrowserRouter here */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
