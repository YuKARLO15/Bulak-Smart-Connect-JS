import React, { useState } from 'react';
import NavBar from '../../NavigationComponents/NavSide';
import './ApplicationForm.css';
import ApplicationContent from './ApplicationContent';
import Steps from './HowItWorks';
import RecentApplicationsComponent from './RecentApplicationsComponent';
import FloatingAnnouncementFab from '../../LandingPageComponents/FloatingAnnouncement';
import { Box, Button, Container, Grid, Typography, Card, CardContent } from '@mui/material';

const ApplicationForm = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`ApplicationFormContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <ApplicationContent />
      <Steps />
      <RecentApplicationsComponent />
      <Box className="AnnouncementButtonContainer">
          <FloatingAnnouncementFab/>
          </Box>
    </div>
  );
};

export default ApplicationForm;
