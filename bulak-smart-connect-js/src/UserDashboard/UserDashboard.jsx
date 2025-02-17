import React, { useState } from "react";
import NavBar from "./NavBar";
import "./UserDashboard.css"; // Import the CSS file
import DashboardContent from "./DashboardContent";
import RecentApplicationsComponent from "../ApplicationComponents/RecentApplicationsComponent";
import DashboardButtons from "./DashboardButtons";

const UserDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    return (
             <div className={`UserDashboardContainer ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <DashboardContent />
            <DashboardButtons />
            <RecentApplicationsComponent />
        </div>
    );
}
    export default UserDashboard;