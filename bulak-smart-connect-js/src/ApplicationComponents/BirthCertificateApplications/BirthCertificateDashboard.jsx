import React from "react";
import { Checkbox, FormControlLabel, FormGroup, Typography, Box, Paper } from "@mui/material";
import "./BirthCertificateDashboard.css";

const BirthCertificateDashboard= () => {
  return (
      <Box className="BirthDashboardContainer">
            <Typography variant="h4" className="FormTitle">Birth Certificate Application</Typography>
      <Paper className="FormPaper" elevation={3}>
      

        <Box className="Section">
          <Typography variant="h6" className="SectionTitle">Applying for:</Typography>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Regular application for birth certificate (0 - 1 month after birth)" />
            <FormControlLabel control={<Checkbox />} label="Request a copy of birth certificate" />
                      
            <Typography variant="subtitle1" className="SubTitleBirthCertificate">Delayed registration (More than 1 month after birth)</Typography>
            <FormControlLabel className="CheckboxText" control={<Checkbox />} label="Above 18 years old (marital / non-marital)" />
            <FormControlLabel className="CheckboxText" control={<Checkbox />} label="Below 18 years old (marital / non-marital)" />
            <FormControlLabel className="CheckboxText" control={<Checkbox />} label="One of the parents is a foreigner" />
            <FormControlLabel className="CheckboxText" control={<Checkbox />} label="Out of town registration" />
          </FormGroup>
        </Box>

       
        <Box className="Section">
          <Typography variant="h6" className="SectionTitle">Data Privacy Notice</Typography>
          <FormControlLabel className="CheckboxText" control={<Checkbox />} label="I agree to the Data Privacy Notice" />
        </Box>

        <Box className="Section">
          <Typography variant="h6" className="SectionTitle">Terms and Conditions</Typography>
          <FormControlLabel className="CheckboxText" control={<Checkbox />} label="I agree to the terms and conditions" />
        </Box>
      </Paper>
    </Box>
  );
};

export default BirthCertificateDashboard;
