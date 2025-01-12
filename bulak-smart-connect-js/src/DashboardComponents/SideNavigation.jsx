import React from "react";
import { Box, Typography, Grid, Button, Card, CardContent } from "@mui/material";
import "./SideNavigation.css";

const SideNavigation = () => {
  return (
 
      <Box className="SideNav">
        <Box className="Profile">
          <div className="UserIcon" />
          <Typography className="Username" variant="h6">[USERNAME]</Typography>
          <Typography className="UserEmail" variant="body2">user@email.com</Typography>
        </Box>
        <Box className="NavButtons">
          <Button>Dashboard</Button>
          <Button>Appointments</Button>
          <Button>Walk - In Number</Button>
          <Button>Document Application</Button>
          <Button>QR Code</Button>
          <Button>Account</Button>
          <Button>Settings</Button>
          <Button>Log Out</Button>
        </Box>
          </Box>
         
          );
      };
    export default SideNavigation;