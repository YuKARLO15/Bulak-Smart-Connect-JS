import React from "react";
import { Box, Button } from "@mui/material";
import "./DashboardButtons.css";
import ApplicationBtn from './UserDashboardAssets/ApplicationBtn.png';
import WalkInBtn from "./UserDashboardAssets/WalkInBtn.png";
import Requirments from "./UserDashboardAssets/RequirmentBtn.png";
import AppointmentBtn from "./UserDashboardAssets/AppointmentBtn.png";
const DashboardButtons = () => {
    return (
        <Box className="IconsSection">
            <Button className="IconButton">
                <img src={ApplicationBtn} alt="Application" /> Document Application
            </Button>
            <Button className="IconButton">
                <img src= {WalkInBtn} alt="Walk-In Number" /> Walk-In Number
            </Button>
            <Button className="IconButton">
                <img src={Requirments} alt="QR-Code Scanner" /> Requirment List
            </Button>
            <Button className="IconButton">
                <img src= {AppointmentBtn} alt="Appointment" /> Schedule Appointment
            </Button>
        </Box>
    );
}
export default DashboardButtons;
