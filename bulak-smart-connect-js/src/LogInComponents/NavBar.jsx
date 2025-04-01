import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Button, 
  Menu, 
  MenuItem 
} from "@mui/material";
import "./NavBar.css";
import BulakLGULogo from "../LandingPageComponents/LandingPageAssets/BulakLGULogo.png";

const NavBar = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  const [anchorEl, setAnchorEl] = useState(null);


  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };


  const handleServicesClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleServicesClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="NavBarContainer">
      <RouterLink to='/'>
        <img className="LogoNavBar" src={BulakLGULogo} alt="Bulak LGU Logo" />
      </RouterLink>
      
      <div className="NavButtons">
        <RouterLink to='/'><Button>Home</Button></RouterLink>
        
        {isLoggedIn ? (
          <>
            <Button 
              onClick={handleServicesClick}
            >
              Services
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleServicesClose}
            >
              <MenuItem onClick={handleServicesClose}>
                <RouterLink to="/birth-certificate">Birth Certificate</RouterLink>
              </MenuItem>
              <MenuItem onClick={handleServicesClose}>
                <RouterLink to="/marriage-certificate">Marriage Certificate</RouterLink>
              </MenuItem>
              <MenuItem onClick={handleServicesClose}>
                <RouterLink to="/death-certificate">Death Certificate</RouterLink>
              </MenuItem>
              <MenuItem onClick={handleServicesClose}>
                <RouterLink to="/appointment-booking">Appointment Booking</RouterLink>
              </MenuItem>
            </Menu>
            
            <Button onClick={handleLogout}>Log Out</Button>
          </>
        ) : (
          <>
            <RouterLink to='/SignUpForm'><Button>Sign Up</Button></RouterLink>
            <RouterLink to='/LogIn'><Button>Log In</Button></RouterLink>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;