import React from "react";
import { Box, Typography, Button, Stack, Link } from "@mui/material";
import "./NavBar.css";

const NavBar = () => {
    return (
        <div className="NavBarContainer">
            <Typography variant="h6" className="Logo"> Bulak Smart </Typography>
                <div className="NavButtons"> 
                <Button >Home</Button>
                <Button >About</Button>
                <Button >Contact</Button>
            </div>
        </div>
    );

};

export default NavBar;