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
  Alert,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './ApplicationContent.css';
import './RecentApplicationsComponent.css';
import { getApplications } from './ApplicationData';

const RecentApplicationsComponent = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const fetchedApplications = getApplications();
        setApplications(fetchedApplications);
      } catch (err) {
        setError('Error loading applications: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
    

    const handleStorageChange = e => {
      if (e.key === 'applications') {
        fetchApplications();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);


   const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    };
    
  const handleApplicationSelect = (type) => {
    setDialogOpen(false);
    if (type === 'marriage') {
      navigate('/MarriageDashboard');
    } else if (type === 'birth') {
      navigate('/BirthCertificateDashboard');
    }
  };


  const StatusColor = status => {
    switch (status) {
      case 'Approved':
        return '#4caf50'; // Green
      case 'Pending':
        return '#ff9800'; // Orange
      case 'Declined':
        return '#f44336'; // Red
      default:
        return '#184a5b'; // Default blue
    }
  };

  const StatusBgColor = status => {
    switch (status) {
      case 'Approved':
        return 'rgba(76, 175, 80, 0.1)'; // Light green
      case 'Pending':
        return 'rgba(255, 152, 0, 0.1)'; // Light orange
      case 'Declined':
        return 'rgba(244, 67, 54, 0.1)'; // Light red
      default:
        return 'rgba(24, 74, 91, 0.1)'; // Light blue
    }
  };

  const handleViewSummary = application => {
    if (application.type === 'Birth Certificate') {
      try {
        const applicationData = applications.find(app => app.id === application.id);

        if (applicationData && applicationData.formData) {
          localStorage.setItem(
            'birthCertificateApplication',
            JSON.stringify(applicationData.formData)
          );
          localStorage.setItem('currentApplicationId', application.id);

          navigate('/BirthApplicationSummary');
        } else {
          console.error('Application data not found for ID:', application.id);
          alert('Could not load application data. Please try again.');
        }
      } catch (err) {
        console.error('Error preparing application summary:', err);
        alert('An error occurred while loading the application summary.');
      }
    } else if (application.type === 'Marriage Certificate') {
      try {
        const applicationData = applications.find(app => app.id === application.id);

        if (applicationData && applicationData.formData) {
          localStorage.setItem('marriageFormData', JSON.stringify(applicationData.formData));
          localStorage.setItem('currentMarriageApplicationId', application.id);

          navigate('/MarriageSummaryForm');
        } else {
          console.error('Marriage application data not found for ID:', application.id);
          alert('Could not load marriage application data. Please try again.');
        }
      } catch (err) {
        console.error('Error preparing marriage application summary:', err);
        alert('An error occurred while loading the marriage application summary.');
      }
    } else if (application.type === 'Marriage License') {
      try {
        const applicationData = applications.find(app => app.id === application.id);
        if (applicationData && applicationData.formData) {
          localStorage.setItem('marriageFormData', JSON.stringify(applicationData.formData));
          navigate('/MarriageLicenseSummary');
        } else {
          console.error('Marriage license data not found');
          alert('Could not load marriage license data. Please try again.');
        }
      } catch (err) {
        console.error('Error preparing marriage license summary:', err);
        alert('An error occurred while loading the marriage license summary.');
      }
    }
  };

  if (loading) {
    return (
      <Box className="LoadingContainerApplications">
        <CircularProgress size={30} sx={{ color: '#184a5b' }} />
        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
          Loading recent applications...
        </Typography>
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
        <Typography variant="h5" className="RecentApplicationsTitle">
          RECENT APPLICATIONS
        </Typography>
        <Card className="NoApplicationsCard" elevation={0}>
          <CardContent>
            <Typography variant="body1" sx={{ color: '#555', mb: 2 }}>
              You have no recent applications.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#184a5b',
                '&:hover': { backgroundColor: '#0d3542' },
                textTransform: 'none',
                borderRadius: '6px'
              }}
              className="StartApplicationBtn"
              onClick={handleOpenDialog}
            >
              Start a New Application
            </Button>
            
        
            <Dialog
              open={dialogOpen}
              onClose={handleCloseDialog}
              maxWidth="xs"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: '8px',
                  overflow: 'hidden'
                }
              }}
            >
              <DialogTitle sx={{
                backgroundColor: '#184a5b',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5
              }}>
                Select Application Type
                <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                <Stack spacing={0} divider={<Divider />}>
                  <Button
                    onClick={() => handleApplicationSelect('marriage')}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      textTransform: 'none',
                      p: 2,
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: 'rgba(138, 172, 181, 0.1)'
                      }
                    }}
                  >
                    <FavoriteIcon sx={{ mr: 2, color: '#8aacb5' }} />
                    <Box textAlign="left">
                      <Typography sx={{ fontWeight: 500, color: '#184a5b' }}>Marriage Certificate</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Apply for a marriage certificate or license
                      </Typography>
                    </Box>
                  </Button>
                  
                  <Button
                    onClick={() => handleApplicationSelect('birth')}
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      textTransform: 'none',
                      p: 2,
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: 'rgba(138, 172, 181, 0.1)'
                      }
                    }}
                  >
                    <AssignmentIcon sx={{ mr: 2, color: '#8aacb5' }} />
                    <Box textAlign="left">
                      <Typography sx={{ fontWeight: 500, color: '#184a5b' }}>Birth Certificate</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Apply for a birth certificate
                      </Typography>
                    </Box>
                  </Button>
                </Stack>
              </DialogContent>
            </Dialog>
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
      <Divider sx={{ mb: 2 }} />
      <List disablePadding className="applicationList">
        {applications.map((app, index) => (
          <ListItem key={app.id || index} disablePadding sx={{ mb: 1.5 }} className="applicationListItem">
            <Card 
              className="ApplicationCard" 
              elevation={0}
              sx={{ 
                borderLeft: `3px solid ${StatusColor(app.status)}`,
                width: '100%',
                height: 'auto',
                backgroundColor: '#fff',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <CardContent sx={{ py: 1.5, px: 2 }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={12} sm={7}>
                    <Box>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Typography 
                          className="ApplicationCardTitle"
                          onClick={() => handleViewSummary(app)}
                          sx={{ 
                            fontSize: '0.95rem', 
                            fontWeight: 500, 
                            color: '#184a5b',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {app.type}
                        </Typography>
                        <Chip
                          label={app.status}
                          size="small"
                          sx={{
                            ml: 1,
                            height: '20px',
                            fontSize: '0.7rem',
                            fontWeight: 500,
                            backgroundColor: StatusBgColor(app.status),
                            color: StatusColor(app.status),
                            borderRadius: '4px',
                            '& .MuiChip-label': { px: 1 }
                          }}
                        />
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Typography className="ApplicationId" sx={{ fontSize: '0.75rem', color: '#666', mr: 1.5 }}>
                          ID: {app.id || 'N/A'}
                        </Typography>
                        <Typography className="ApplicationDate" sx={{ fontSize: '0.75rem', color: '#666' }}>
                          {app.date}
                        </Typography>
                      </Box>
                      
                      {app.message && (
                        <Typography 
                          className="ApplicationDescription" 
                          sx={{ 
                            fontSize: '0.8rem', 
                            color: '#555',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {app.message}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={5}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button
                        size="small"
                        className="ViewSummaryBtn"
                        onClick={() => handleViewSummary(app)}
                        sx={{ 
                          color: '#184a5b', 
                          border: '1px solid #8aacb5',
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          py: 0.5,
                          minWidth: '100px',
                          '&:hover': {
                            backgroundColor: 'rgba(24, 74, 91, 0.04)'
                          }
                        }}
                      >
                        View Application
                      </Button>
                    </Box>
                  </Grid>
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