import React from "react";
import { Box, Typography, Grid, Button, Card, CardContent } from "@mui/material";
import "./DashboardContent.css";

const DashboardContent = () => (
  <Box className="main-content">
    <Typography variant="h4" className="dashboard-title">Dashboard</Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Appointments</Typography>
            <div className="calendar">
              {/* Simplified calendar placeholder */}
              <Typography variant="body2">NEED TO ASK KUNG TUWING KAILAN OPEN OFFICE</Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Announcement</Typography>
            <div className="announcement-placeholder"></div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
        <Box mt={4}>
            <Box className="Applications">
      <Typography variant="h5">Applications</Typography>
     
          <Card className="application-card approved">
            <CardContent>
              <Typography variant="body1">Birth Certificate</Typography>
              <Typography variant="body2">01/20/25</Typography>
              <Typography variant="body2">Approved</Typography>
              <Button>See More</Button>
            </CardContent>
          </Card>
       
     
          <Card className="application-card pending">
            <CardContent>
              <Typography variant="body1">Marriage Certificate</Typography>
              <Typography variant="body2">01/13/25</Typography>
              <Typography variant="body2">Pending</Typography>
              <Button>See More</Button>
            </CardContent>
          </Card>
       
        
          <Card className="application-card declined">
            <CardContent>
              <Typography variant="body1">Marriage Certificate</Typography>
              <Typography variant="body2">01/13/25</Typography>
              <Typography variant="body2">Declined</Typography>
              <Button>See More</Button>
            </CardContent>
                        </Card>
            </Box>
    </Box>
  </Box>
);

export default DashboardContent;