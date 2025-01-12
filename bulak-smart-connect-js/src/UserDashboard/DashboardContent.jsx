import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
} from "@mui/material";
import Calendar from "react-calendar"; 
import "react-calendar/dist/Calendar.css"; 
import "./DashboardContent.css"; // Import the CSS file

const DashboardContent = () => {
  return (
    <Box className="DashboardContainer">
      {/* Header */}
      <Typography variant="h4" className="DashboardHeader">
        Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Top Section */}
       
          <Card className="DashboardCard">
            <CardContent>
              <Typography variant="h6">Appointments</Typography>
              <Box className="AppointmentsBox">
                <Calendar /> {/* Add the Calendar component here */}
              </Box>
            </CardContent>
          </Card>

          <Card className="DashboardCard">
            <CardContent>
              <Typography variant="h6">Announcement</Typography>
              <Box className="AnnouncementBox"></Box>
            </CardContent>
              </Card>
              <div className="BottomCard">
     
                  <List>
                      <Typography variant="h6" className="AppiontmentHeader">
                     Appointments
                 </Typography>   
            <ListItem>
              <Card className="ScheduledAppionmentnCard">
                    <CardContent>
             
                     <Grid container justifyContent="space-between" alignItems="center">
                                  
                  <Typography className="ApplicationCardTitle">Birth Certificate</Typography>
                    <Typography className="ApplicationStatusA">M003</Typography>            
                     <Typography className="ApplicationDate">01/13/25</Typography>
                     <Typography className="ApplicatonDescription">Please prepare all requirements</Typography>
                                  
                    </Grid>
               
                      <Button size="small">QR Code</Button>
                 
                
                </CardContent>
              </Card>
            </ListItem>

            <ListItem>
              <Card className="ScheduledAppionmentnCard">
                <CardContent>
                  <Grid container justifyContent="space-between" alignItems="center">
                
                    <Typography className="ApplicationCardTitle">Marriage Certificate</Typography>
                      <Typography className="ApplicationStatusP">T003</Typography> {/** Letters stands for day of the week  */}             
                      <Typography className="ApplicationDate">01/14/25</Typography>
                      <Typography className="ApplicatonDescription">Please prepare all requirements</Typography>
                    </Grid>
                  
                      <Button size="small">QR Code</Button>
                 
                </CardContent>
              </Card>
            </ListItem>

            <ListItem>
              <Card className="ScheduledAppionmentnCard">
                <CardContent>
                              <Grid container justifyContent="space-between" alignItems="center">
                                  
                  <Typography className="ApplicationCardTitle">Death Certificate</Typography>
                      <Typography className="ApplicationStatusD">TH009</Typography>            
                      <Typography className="ApplicationDate">01/16/25</Typography>
                      <Typography className="ApplicatonDescription">Please prepare all requirements</Typography>
                    </Grid>
                    
                      <Button size="small">QR Code</Button>
                   
                </CardContent>
              </Card>
            </ListItem>
          </List>
 

        {/* Right Section */}
     
          
          <List>
            <Typography variant="h6" className="ApplicationHeader">
            Applications
          </Typography>
            <ListItem>
              <Card className="ApplicationCard">
                    <CardContent>
                            
                     <Grid container justifyContent="space-between" alignItems="center">
                                  
                  <Typography className="ApplicationCardTitle">Birth Certificate</Typography>
                    <Typography className="ApplicationStatusA">Approved</Typography>            
                     <Typography className="ApplicationDate">01/10/25</Typography>
                     <Typography className="ApplicatonDescription">Document is ready for pick up</Typography>
                                  
                    </Grid>
               
                      <Button size="small">See More</Button>
                 
                
                </CardContent>
              </Card>
            </ListItem>

            <ListItem>
              <Card className="ApplicationCard">
                <CardContent>
                  <Grid container justifyContent="space-between" alignItems="center">
                
                    <Typography className="ApplicationCardTitle">Marriage Certificate</Typography>
                      <Typography className="ApplicationStatusP">Pending</Typography>            
                      <Typography className="ApplicationDate">01/13/25</Typography>
                      <Typography className="ApplicatonDescription">Waiting for admin approval</Typography>
                    </Grid>
                  
                      <Button size="small">See More</Button>
                 
                </CardContent>
              </Card>
            </ListItem>

            <ListItem>
              <Card className="ApplicationCard">
                <CardContent>
                              <Grid container justifyContent="space-between" alignItems="center">
                                  
                  <Typography className="ApplicationCardTitle">Death Certificate</Typography>
                      <Typography className="ApplicationStatusD">Declined</Typography>            
                      <Typography className="ApplicationDate">01/16/25</Typography>
                      <Typography className="ApplicatonDescription">Reason:Incomplete requirements</Typography>
                    </Grid>
                    
                      <Button size="small">See More</Button>
                   
                </CardContent>
              </Card>
            </ListItem>
                  </List>
              </div>
        </Grid>
    
      </Box>
      
  );
};

export default DashboardContent;
