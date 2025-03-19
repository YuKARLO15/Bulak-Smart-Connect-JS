import React from "react";
import { Router, Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Stack, Link } from "@mui/material";
import "./NavBar.css";
import BulakLGULogo from "../LandingPageComponents/LandingPageAssets/BulakLGULogo.png";
const NavBar = () => {
    return (
        <div className="NavBarContainer">
            <RouterLink to = '/'><img className="LogoNavBar" src={BulakLGULogo} />  </RouterLink>
            <div className="NavButtons"> 
                <RouterLink to = '/'>
                <Button >Home</Button> </RouterLink>
                <RouterLink to = '/SignUpForm'> <Button >Sign Up</Button></RouterLink>
                <RouterLink to = '/LogIn'><Button >Log In </Button></RouterLink> 
            </div>
        </div>
    );

};

export default NavBar;