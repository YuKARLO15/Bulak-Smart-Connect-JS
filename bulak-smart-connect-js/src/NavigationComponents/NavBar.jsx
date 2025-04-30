import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import './NavBar.css';
import BulakLGULogo from '../LandingPageComponents/LandingPageAssets/BulakLGULogo.png';
import { useAuth } from '../context/AuthContext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import DescriptionIcon from '@mui/icons-material/Description';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleServicesClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleServicesClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/LogIn');
  };

  return (
    <>
      <div className="NavBarContainer">
        <RouterLink to="/">
          <img className="LogoNavBar" src={BulakLGULogo} alt="Bulak LGU Logo" />
        </RouterLink>

        <div className="NavButtons">
          <RouterLink to="/">
            <Button>Home</Button>
          </RouterLink>

          {isAuthenticated ? (
            <>
              <Button onClick={handleServicesClick}>Services</Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleServicesClose}>
                <MenuItem className="submenu-container">
                  <ListItemIcon>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  <RouterLink
                    to="/ApplicationForm"
                    style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                  >
                    <ListItemText primary="Document Application" />
                  </RouterLink>
                </MenuItem>

                <MenuItem onClick={handleServicesClose}>
                  <ListItemIcon>
                    <CalendarTodayIcon fontSize="small" />
                  </ListItemIcon>
                  <RouterLink
                    to="/AppointmentForm"
                    style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                  >
                    <ListItemText primary="Appointment Booking" />
                  </RouterLink>
                </MenuItem>
                <MenuItem onClick={handleServicesClose}>
                  <ListItemIcon>
                    <DirectionsWalkOutlinedIcon fontSize="small" />
                  </ListItemIcon>
                  <RouterLink
                    to="/WalkInQueue"
                    style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                  >
                    <ListItemText primary="Smart Walk-In Queue" />
                  </RouterLink>
                </MenuItem>
              </Menu>

              <RouterLink to="/UserDashboard">
                <Button>Dashboard</Button>
              </RouterLink>
              <Button onClick={handleLogout}>Log Out</Button>
            </>
          ) : (
            <>
              <RouterLink to="/SignUpForm">
                <Button>Sign Up</Button>
              </RouterLink>
              <RouterLink to="/LogIn">
                <Button>Log In</Button>
              </RouterLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
