import React from 'react';
import { Navigate } from 'react-router-dom';
import './LogIn.css';
import LogInContent from './LogInContent';
import LogInCard from './LogInCard';
import NavBar from '../NavigationComponents/NavBar';
import { useAuth } from '../context/AuthContext'; // Import useAuth

function LogIn() {
  const { isAuthenticated } = useAuth(); // Use the login function from AuthContext

  // Redirect to Home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/Home" />;
  }

  return (
    <div className="LogIn">
      <div className="Navigation">
        <NavBar />
      </div>
      <div className="LogInContainer">
        <LogInContent />
        <LogInCard />
      </div>
    </div>
  );
}

export default LogIn;
