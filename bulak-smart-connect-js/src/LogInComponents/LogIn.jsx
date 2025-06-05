import React from 'react';
import { Navigate } from 'react-router-dom';
import './LogIn.css';
import LogInContent from './LogInContent';
import LogInCard from './LogInCard';
import NavBar from '../NavigationComponents/NavBar';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import HeroBg from '../LandingPageComponents/LandingPageAssets/HeroBg.JPEG'; 

function LogIn() {
  const { isAuthenticated, user } = useAuth(); // Use the login function from AuthContext

  // Redirect based on role if already authenticated
  if (isAuthenticated) {
    if (user && (user.roles?.includes('staff') || 
        user.roles?.includes('admin') || 
        user.roles?.includes('super_admin'))) {
      return <Navigate to="/AdminHome" />;
    } else {
      return <Navigate to="/Home" />;
    }
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
