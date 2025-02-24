import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button, List, ListItem } from '@mui/material';
import { fetchApplications } from './RecentApplications'; 
import './ApplicationContent.css';
import './RecentApplicationsComponent.css';

const RecentApplicationsComponent = () => {
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

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
    };

    const handleNavigation = (type) => {
        switch (type) {
            case "Birth Certificate":
                navigate('/BirthCertificateDashboard');
                break;
            case "Marriage Certificate":
                navigate('/MarriageDashboard');
                break;
            case "Death Certificate":
                navigate('/DeathDashboard');
                break;
            default:
                navigate('/'); 
        }
    };

    return (
        <div className="RecentApplicationsDivider">
            <Typography variant="h5" className="RecentApplicationsTitle">
                RECENT APPLICATIONS
            </Typography>
            <List>
                {applications.map((app, index) => (
                    <ListItem key={index}>
                        <Card className="ApplicationCard">
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <div className="ApplicationDetails">
                                        <Typography className="ApplicationCardTitle">{app.type}</Typography>
                                        <Typography className="ApplicationDescription">{app.message}</Typography>
                                    </div>
                                    <Typography className="ApplicationDate">{app.date}</Typography>
                                    <Typography className="ApplicationStatus" sx={{ color: StatusColor(app.status) }}>
                                        {app.status}
                                    </Typography>
                                    <Button size="small" className='ApplicationBtn' onClick={() => handleNavigation(app.type)}>
                                        See More
                                    </Button>
                                </Grid>
                            </CardContent>
                        </Card>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default RecentApplicationsComponent;
