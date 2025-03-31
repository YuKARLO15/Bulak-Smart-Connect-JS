import React from "react";
import { Navigate } from "react-router-dom";
import "./LogIn.css";
import LogInContent from "./LogInContent";
import LogInCard from "./LogInCard";
import NavBar from "./NavBar";
import { useAuth } from "../AuthContext"; // Import useAuth

function LogIn() {
  const { isAuthenticated, login } = useAuth(); // Use the login function from AuthContext

  const handleLogin = (data) => {
    // Handle the login data, e.g., save the user session
    console.log("User logged in:", data);
    login(); // Set the authentication state to true
  };

  // Redirect to UserDashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/UserDashboard" />;
  }

  return (
    <div className="LogIn">
      <div className="Navigation">
        <NavBar />
      </div>
      <div className="LogInContainer">
        <LogInContent />
        <LogInCard onLogin={handleLogin} />
      </div>
    </div>
  );
}

export default LogIn;
