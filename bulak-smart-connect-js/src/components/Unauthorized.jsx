import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Unauthorized.css';

const Unauthorized = () => {
  const { user } = useAuth();
  
  return (
    <div className="unauthorized-container">
      <h1>Access Denied</h1>
      <p>You don't have permission to access this page.</p>
      
      {user && (
        <div className="user-info">
          <p>Logged in as: <strong>{user.name}</strong></p>
          <p>Your role: <strong>{user.defaultRole}</strong></p>
        </div>
      )}
      
      <div className="action-buttons">
        <Link to="/UserDashboard" className="primary-button">Go to Dashboard</Link>
        <Link to="/" className="secondary-button">Back to Home</Link>
      </div>
    </div>
  );
};

export default Unauthorized;