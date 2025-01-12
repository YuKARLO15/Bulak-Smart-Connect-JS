import React from "react";
import NavBar from "./NavBar";
import "./UserDashboard.css"; // Import the CSS file
import  DashboardContent from "./DashboardContent";

const UserDashboard = () => {
    return (
        <div className="UserDashboardContainer">
        <NavBar />
        <DashboardContent />
        </div>
    );
}
    export default UserDashboard;