import React from 'react';
import { Box, Typography, Button, Stack, Link } from '@mui/material';
import './LogInContent.css'; // Make sure the path is correct
import { Link as RouterLink } from 'react-router-dom';

const LogInContent = () => {
  return (
    <Box className="LogInContainerContent">
      {/* Welcome Message */}
      <Typography variant="h6" className="WelcomeMessage">
        WELCOME BACK!
      </Typography>

      {/* Main Title */}
      <Typography variant="h3" className="MainTitle">
        Bulak LGU Smart Connect
      </Typography>

      {/* Placeholder Text */}
      <Typography variant="body1" className="PlaceholderText">
        <b>Bulak LGU Smart Connect</b> is the official digital queue and information system for the Municipal Civil Registrar of San Ildefonso, Bulacan.
        <br />
      </Typography>

      {/* Sign-Up Section */}
      <Stack direction="column" spacing={2} alignItems="center">
        <Typography variant="body2" color="text.secondary" className="SignUpText">
          DON'T HAVE AN ACCOUNT?
        </Typography>
        <RouterLink to="/SignUpForm" className="SignUpLink">
          <Button className="SignUpButton" variant="outlined">
            Sign Up
          </Button>
        </RouterLink>
      </Stack>
    </Box>
  );
};

export default LogInContent;
