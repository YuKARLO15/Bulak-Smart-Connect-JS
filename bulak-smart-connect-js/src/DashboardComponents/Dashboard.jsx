import React from "react";
import { Box, Typography, Grid, Button, Card, CardContent } from "@mui/material";
import SideNavigation from "./SideNavigation.jsx";
import DashboardContent from "./DashboardContent.jsx";
import "./Dashboard.css";
const Dashboard = () => {
    return (
        <div className="DashboardContainer">
            <SideNavigation></SideNavigation>
            <DashboardContent></DashboardContent>
        </div>
    )
}
export default Dashboard;
