import React from "react";
import "./LogIn.css";
import LogInContent from "./LogInContent";
import LogInCard from "./LogInCard";
import NavBar from "./NavBar";
import { useAuth } from "../AuthContext"; // Import useAuth

function LogIn() {
  const { login } = useAuth(); // Use the login function from AuthContext

  const handleLogin = (data) => {
    // Handle the login data, e.g., save the user session
    console.log("User logged in:", data);
    login(); // Set the authentication state to true
  };

  return (
    <div className="LogIn">
      <div className="Navigation">
        <NavBar />
      </div>
      <div className="LogInContainer">
        <LogInContent></LogInContent>
        <LogInCard onLogin={handleLogin}></LogInCard>
      </div>
    </div>
  );
}
export default LogIn;
