import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  List, 
  ListItem,
  CircularProgress,
  Alert
} from '@mui/material';
import './ApplicationContent.css';
import './RecentApplicationsComponent.css';
import { getApplications } from './ApplicationData'; 

const RecentApplicationsComponent = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const fetchedApplications = getApplications();
                setApplications(fetchedApplications);
            } catch (err) {
                setError("Error loading applications: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
        
        const handleStorageChange = (e) => {
            if (e.key === "applications") {
                fetchApplications();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [location.pathname]); 

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

    const handleNavigation = (type, id) => {
        switch (type) {
            case "Birth Certificate":
                navigate(id ? `/BirthApplicationSummary` : '/BirthCertificateDashboard');
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

    const handleViewSummary = (application) => {
        if (application.type === "Birth Certificate") {
            try {
                const applicationData = applications.find(app => app.id === application.id);
                
                if (applicationData && applicationData.formData) {
                    localStorage.setItem("birthCertificateApplication", JSON.stringify(applicationData.formData));
                    localStorage.setItem("currentApplicationId", application.id);
                    
                    navigate('/BirthApplicationSummary');
                } else {
                    console.error("Application data not found for ID:", application.id);
                    alert("Could not load application data. Please try again.");
                }
            } catch (err) {
                console.error("Error preparing application summary:", err);
                alert("An error occurred while loading the application summary.");
            }
        } else {
            handleNavigation(application.type);
        }
    };

    if (loading) {
        return (
            <Box className="LoadingContainerApplications">
                <CircularProgress />
                <Typography>Loading recent applications...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="ErrorContainerApplications">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="RecentApplicationsDivider">
                <Typography variant="h5" className="RecentApplicationsTitle" >
                    RECENT APPLICATIONS
                </Typography>
                <Card className="NoApplicationsCard">
                    <CardContent>
                        <Typography>You have no recent applications.</Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            className="StartApplicationBtn"
                            onClick={() => navigate('/applications')}
                        >
                            Start a New Application
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="RecentApplicationsDivider">
            <Typography variant="h5" className="RecentApplicationsTitle">
                RECENT APPLICATIONS
            </Typography>
            <List>
                {applications.map((app, index) => (
                    <ListItem key={app.id || index}>
                        <Card className="ApplicationCard">
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <div className="ApplicationDetails">
                                        <Typography className="ApplicationCardTitle" onClick={() => handleViewSummary(app)}>{app.type}</Typography>
                                        <Typography className="ApplicationId">ID: {app.id || "N/A"}</Typography>
                                        <Typography className="ApplicationDate">{app.date}</Typography>
                                        <Typography className="ApplicationStatus" sx={{ color: StatusColor(app.status) }}>
                                            {app.status}
                                        </Typography>
                                        <Typography className="ApplicationDescription">{app.message}</Typography>
                                    </div>
                                    <Box className="ApplicationCardActions">
                                        <Button 
                                            size="small" 
                                            className="ViewSummaryBtn"
                                            onClick={() => handleViewSummary(app)}
                                        >
                                            View Summary
                                        </Button>
                                    </Box>
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