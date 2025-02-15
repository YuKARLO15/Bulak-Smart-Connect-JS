import React, { useState } from "react";
import NavBar from "./NavBar";
import "./UserDashboard.css"; // Import the CSS file
import  DashboardContent from "./DashboardContent";

const UserDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    return (
             <div className={`UserDashboardContainer ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <DashboardContent />
        </div>
    );
}
    export default UserDashboard;