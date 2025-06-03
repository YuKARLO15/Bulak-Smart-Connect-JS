import React, { useState } from 'react';
import NavBar from '../../NavigationComponents/NavSide';
import './AppoinmentForm.css';
import { Box, Typography } from '@mui/material';
import AppointmentDashboard from './AppointmentDashboard';
import FloatingAnnouncementButton from '../../LandingPageComponents/FloatingAnnouncement';

const AppoionmentForm = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className={`AppoinmentFormContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h4" className="TitleNavAppointment">
        {' '}
        APPOINTMENT{' '}
      </Typography>
      <AppointmentDashboard />


       <Box className="AnnouncementButtonContainer">
          <FloatingAnnouncementButton />
          </Box>
    </div>
  );
};
export default AppoionmentForm;
