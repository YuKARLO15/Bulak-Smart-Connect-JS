import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, List, ListItem } from '@mui/material';
import { fetchApplications } from './RecentApplications'; // Import the mock fetch function
import './ApplicationContent.css';
import './RecentApplicationsComponent.css';

const RecentApplicationsComponent = () => {
   const [applications, setApplications] = useState([]);
    useEffect(() => {
        const getApplications = async () => {
            const appList = await fetchApplications();
            setApplications(appList);
        };

        getApplications();
    }, []);
    const StatusColor = (status) => {
        switch (status) {
            case "Approved":
                return "green";
            case "Pending":
                return "darkorange";
            case "Declined":
                return "red";
            default:
                return "#184a5b";
        }
    }
    return (
        <div className="RecentApplicationsDivider">
            <Typography variant="h5" className="RecentApplicationsTitle">
            RECENT APPLICATIONS
        </Typography><List>
                {applications.map((app, index) => (
                    <ListItem key={index}>
                        <Card className="ApplicationCard">
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <div classname="ApplicationDetails">
                                    <Typography className="ApplicationCardTitle">{app.type}</Typography>
                                   
                                    <Typography className="ApplicationDescription">{app.message}</Typography>
                                    </div>
                                    <Typography className="ApplicationDate">{app.date}</Typography>
                                    <Typography
                                        className="ApplicationStatus"
                                        sx={{ color: StatusColor(app.status) }}>
                                        {app.status}
                                        <Button size="small" className='ApplicationBtn'>See More</Button>
                                    </Typography>
                                
                                </Grid>
                                
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>
            </div>
     
    );
}

export default RecentApplicationsComponent;