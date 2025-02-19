import React, { useState } from "react";
import NavBar from "../UserDashboard/NavBar";
import "./AppoinmentForm.css"; 
import AppointmentContainer from "./AppointmentContent";



const AppoionmentForm = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (        
    <div className={`AppoinmentFormContainer ${isSidebarOpen ? "sidebar-open" : ""}`}>
    <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />     
        <AppointmentContainer />
        </div>
    );
}
    export default AppoionmentForm;