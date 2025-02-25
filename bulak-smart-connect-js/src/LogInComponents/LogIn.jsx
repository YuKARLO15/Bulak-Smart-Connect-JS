import React from "react";
import "./LogIn.css";
import LogInContent from "./LogInContent";
import LogInCard from "./LogInCard";
import NavBar from "./NavBar";

function LogIn() {
  const handleLogin = (data) => {
    // Handle the login data, e.g., save the user session
    console.log("User logged in:", data);
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
