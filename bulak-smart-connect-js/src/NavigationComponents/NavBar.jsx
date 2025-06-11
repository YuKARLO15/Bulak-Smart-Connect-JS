import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import './NavBar.css';
import NavBulakLGU from './NavAssets/NavBulakLGU.png';
import { useAuth } from '../context/AuthContext';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import InstallPrompt from '../components/InstallPrompt'; 

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openInstallPrompt, setOpenInstallPrompt] = useState(false); 
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
          <img className="LogoNavBar" src={NavBulakLGU} alt="Bulak LGU Logo" />
        </RouterLink>
        <div className="NavButtons">
          <RouterLink to="/">
            <Button className='HomeButtonNav'>Home</Button>
          </RouterLink>
        
          <Button onClick={() => setOpenInstallPrompt(true)}>Download</Button>

          {isAuthenticated ? (
            <>
              <Button onClick={handleServicesClick}>Services</Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleServicesClose}>
                <RouterLink
                  to="/ApplicationForm"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  onClick={handleServicesClose}
                >
                  <MenuItem className='ServiceItem'>
                    <ListItemIcon className='ServiceIcon'>
                      <DescriptionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText className='ServiceIcon' primary="Document Application" />
                  </MenuItem>
                </RouterLink>
                <RouterLink
                  to="/AppointmentForm"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  onClick={handleServicesClose}
                >
                  <MenuItem className='ServiceItem'>
                    <ListItemIcon className='ServiceIcon'>
                      <CalendarTodayIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText className='ServiceIcon' primary="Appointment Booking" />
                  </MenuItem>
                </RouterLink>
                <RouterLink
                  to="/WalkInQueue"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  onClick={handleServicesClose}
                >
                  <MenuItem className='ServiceItem'>
                    <ListItemIcon className='ServiceIcon'>
                      <DirectionsWalkOutlinedIcon fontSize="small" />
                    </ListItemIcon >
                    <ListItemText className='ServiceIcon' primary="Smart Walk-In Queue" />
                  </MenuItem>
                </RouterLink>
              </Menu>
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
    
      <InstallPrompt
        open={openInstallPrompt}
        onClose={() => setOpenInstallPrompt(false)}
      />
    </>
  );
};

export default NavBar;