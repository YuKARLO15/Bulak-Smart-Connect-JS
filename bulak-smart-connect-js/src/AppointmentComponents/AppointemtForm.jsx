import React, { useState } from "react";
import NavBar from "../UserDashboard/NavBar";
import "./AppoinmentForm.css"; 
import { Box, Typography } from "@mui/material";
import AppointmentDashboard from "./AppointmentDashboard";



const AppoionmentForm = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (        
    <div className={`AppoinmentFormContainer ${isSidebarOpen ? "sidebar-open" : ""}`}>
            <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />           
            <Typography variant="h4" className="TitleNavAppointment"> APPOINTMENT </Typography> 
        <AppointmentDashboard/>
        </div>
    );
}
    export default AppoionmentForm;