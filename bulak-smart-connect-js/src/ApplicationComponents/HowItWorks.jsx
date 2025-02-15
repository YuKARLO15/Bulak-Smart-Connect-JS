import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import "./HowItWorks.css";

const Steps = () => {
  return (
    <Box className="StepsContainer">
      <Typography variant="h5" className="StepsTitle">
        HOW IT WORKS
      </Typography>
      <Typography variant="body1" className="StepsSubtitle">
        Get started with 3 easy steps
      </Typography>

      <Grid container spacing={1} className="StepsGrid">
        {/* Step 1 */}
        <Grid item xs={1} md={3} className="StepItem">
          <Typography variant="h3" className="StepNumber">1</Typography>
          <Typography variant="h6" className="StepTitle">Application Entry</Typography>
          <Typography variant="body2" className="StepDesc">
            Fill out the online application for your choice of certificate
          </Typography>
        </Grid>

        {/* Arrow */}
        <Grid item xs={1} md={1} className="Arrow">→</Grid>

        {/* Step 2 */}
        <Grid item xs={1} md={4} className="StepItem">
          <Typography variant="h3" className="StepNumber">2</Typography>
          <Typography variant="h6" className="StepTitle">Wait for Application Approval</Typography>
          <Typography variant="body2" className="StepDesc">
            You can see your application status at recent applications
          </Typography>
        </Grid>

        {/* Arrow */}
        <Grid item xs={1} md={1} className="Arrow">→</Grid>

        {/* Step 3 */}
        <Grid item xs={1} md={3} className="StepItem">
          <Typography variant="h3" className="StepNumber">3</Typography>
          <Typography variant="h6" className="StepTitle">Pick up the Document</Typography>
          <Typography variant="body2" className="StepDesc">
            Pick up the document on your appointment date
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Steps;
