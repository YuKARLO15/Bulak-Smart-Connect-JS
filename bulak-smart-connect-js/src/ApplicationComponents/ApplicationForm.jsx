import React, { useState } from "react";
import NavBar from "../UserDashboard/NavBar";
import "./ApplicationForm.css"; 
import ApplicationContent from "./ApplicationContent";
import Steps from "./HowItWorks";
import RecentApplicationsComponent from "./RecentApplicationsComponent";

const ApplicationForm = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`ApplicationFormContainer ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <ApplicationContent />
            <Steps />
            <RecentApplicationsComponent />
        </div>
    );
};

export default ApplicationForm;
