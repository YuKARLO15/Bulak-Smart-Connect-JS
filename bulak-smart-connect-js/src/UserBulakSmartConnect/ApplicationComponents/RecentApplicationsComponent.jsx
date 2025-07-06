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
import { documentApplicationService } from '../../services/documentApplicationService';

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
        const fetchedApplications = await documentApplicationService.getUserApplications();
        setApplications(fetchedApplications);
      } catch (err) {
        setError('Error loading applications: ' + err.message);
        try {
          const localApps = getApplications();
          setApplications(localApps);
        } catch (localErr) {
          console.error('Failed to load local applications:', localErr);
        }
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

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'StatusChipApproved';
      case 'Pending':
        return 'StatusChipPending';
      case 'Declined':
        return 'StatusChipDeclined';
      default:
        return 'StatusChipDefault';
    }
  };

  const handleViewSummary = async (application) => {
    // ... (keep existing handleViewSummary logic)
  };

  const convertBackendToFormData = (backendData, applicationType) => {
    // ... (keep existing conversion logic)
  };

  const getMonthNumber = (monthName) => {
    // ... (keep existing month conversion logic)
  };

  if (loading) {
    return (
      <Box className="LoadingContainerApplications">
        <CircularProgress size={30} />
        <Typography variant="body2">
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
            <Typography variant="body1">
              You have no recent applications.
            </Typography>
            <Button
              variant="contained"
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
              className="ApplicationDialog"
            >
              <DialogTitle className="ApplicationDialogTitle">
                Select Application Type
                <IconButton onClick={handleCloseDialog} className="ApplicationDialogCloseButton">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent className="ApplicationDialogContent">
                <Stack spacing={0} divider={<Divider />}>
                  <Button
                    onClick={() => handleApplicationSelect('marriage')}
                    className="ApplicationDialogButton"
                  >
                    <FavoriteIcon className="ApplicationDialogIcon" />
                    <Box className="ApplicationDialogButtonText">
                      <Typography className="ApplicationDialogButtonTitle">Marriage Certificate</Typography>
                      <Typography variant="body2" className="ApplicationDialogButtonSubtitle">
                        Apply for a marriage certificate or license
                      </Typography>
                    </Box>
                  </Button>
                  
                  <Button
                    onClick={() => handleApplicationSelect('birth')}
                    className="ApplicationDialogButton"
                  >
                    <AssignmentIcon className="ApplicationDialogIcon" />
                    <Box className="ApplicationDialogButtonText">
                      <Typography className="ApplicationDialogButtonTitle">Birth Certificate</Typography>
                      <Typography variant="body2" className="ApplicationDialogButtonSubtitle">
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
      <Divider className="ApplicationListDivider" />
      <List disablePadding className="applicationList">
        {applications.map((app, index) => (
          <ListItem key={app.id || index} disablePadding className="applicationListItem">
  <Card 
    className={`ApplicationCard Status${app.status}`} 
    elevation={0}
  >
    <CardContent className="ApplicationCardContent">
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={12} sm={7}>
          <Box>
            {/* Desktop: Title, Subtype, Status in one row */}
            <Box className="ApplicationTitleRow">
              <Typography 
                className="ApplicationCardTitle"
                onClick={() => handleViewSummary(app)}
              >
                {app.applicationType || app.type || 'Failed Fetching Application'}
              </Typography>
              <Typography className="ApplicationSubtype">
                {app.applicationSubtype || app.subType}
              </Typography>
              <Chip
                label={app.status}
                size="small"
                className={`ApplicationStatusChip ${getStatusChipClass(app.status)}`}
              />
            </Box>
            
            <Box className="ApplicationInfoContainer">
              <Typography className="ApplicationApplicant">
                Applicant: {app.formData?.firstName || ''} {app.formData?.middleName || ''} {app.formData?.lastName || ''}
              </Typography>
              <Typography className="ApplicationId">
                ID: {app.id || 'N/A'}
              </Typography>
              <Typography className="ApplicationDate">
                {app.date}
              </Typography>
            </Box>
            
            {app.message && (
              <Typography className="ApplicationDescriptionText">
                {app.message}
              </Typography>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={5}>
          <Box className="ApplicationButtonContainer">
            <Button
              size="small"
              className="ViewSummaryBtn"
              onClick={() => handleViewSummary(app)}
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