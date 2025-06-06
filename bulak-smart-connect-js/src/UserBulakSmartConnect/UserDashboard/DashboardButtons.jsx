import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import './DashboardButtons.css';
import { Router, Link as RouterLink } from 'react-router-dom';
import ApplicationBtn from './UserDashboardAssets/ApplicationBtn.png';
import WalkInBtn from './UserDashboardAssets/WalkInBtn.png';
import Requirments from './UserDashboardAssets/RequirmentBtn.png';
import AppointmentBtn from './UserDashboardAssets/AppointmentBtn.png';
const DashboardButtons = () => {
  return (
    <div className="IconSectionContainer">
      <Typography variant="h5" className="IconHeader">
        Bulak Smart Connect Features
      </Typography>
      <Box className="IconsSection">
        <RouterLink to="/ApplicationForm">
          {' '}
          <Button className="IconButton">
            <img src={ApplicationBtn} alt="Application" /> Document Application
          </Button>
        </RouterLink>
        <RouterLink to="/QR">
          {' '}
          <Button className="IconButton">
            <img src={WalkInBtn} alt="Walk-In Number" /> Walk-In Number
          </Button>{' '}
        </RouterLink>
        <RouterLink>
          {' '}
          <Button className="IconButton">
            <img src={Requirments} alt="QR-Code Scanner" /> Requirment List
          </Button>{' '}
        </RouterLink>
        <RouterLink to="/AppointmentForm">
          {' '}
          <Button className="IconButton">
            <img src={AppointmentBtn} alt="Appointment" /> Schedule Appointment
          </Button>{' '}
        </RouterLink>
      </Box>
    </div>
  );
};
export default DashboardButtons;
