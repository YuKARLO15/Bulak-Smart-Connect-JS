import React, { useEffect, useState } from 'react';
import logger from '../../utils/logger';
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
  Stack,
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
          logger.error('Failed to load local applications:', localErr);
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

  const handleApplicationSelect = type => {
    setDialogOpen(false);
    if (type === 'marriage') {
      navigate('/MarriageDashboard');
    } else if (type === 'birth') {
      navigate('/BirthCertificateDashboard');
    }
  };

  const getStatusChipClass = status => {
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

  const handleViewSummary = async application => {
    try {
      // First, try to get full application data from backend
      let applicationData;

      try {
        applicationData = await documentApplicationService.getApplication(application.id);
        logger.log('Fetched application data:', applicationData);
        logger.log('Application data keys:', Object.keys(applicationData || {}));
        logger.log('Application data structure:', JSON.stringify(applicationData, null, 2));
      } catch (backendError) {
        logger.warn('Could not fetch from backend, trying local data:', backendError);
        // Fallback to local applications array
        applicationData = applications.find(app => app.id === application.id);
      }

      // Determine application type - handle both backend and local data structures
      const applicationType =
        application.type || application.applicationType || applicationData?.applicationType;
      logger.log('Determined application type:', applicationType);

      if (applicationType === 'Birth Certificate') {
        if (applicationData?.formData) {
          // Check if it's already in local format or backend format
          if (typeof applicationData.formData === 'object' && applicationData.formData.firstName) {
            // Backend data structure - convert to expected format
            logger.log('Converting backend data to form data...');
            const convertedFormData = convertBackendToFormData(
              applicationData,
              'Birth Certificate'
            );
            logger.log('Converted form data:', convertedFormData);

            // Store in localStorage with the expected key
            localStorage.setItem('birthCertificateApplication', JSON.stringify(convertedFormData));
            localStorage.setItem('currentApplicationId', application.id);

            // Create a local-style application structure and store it
            const localStyleApp = {
              id: applicationData.id,
              type: 'Birth Certificate',
              formData: convertedFormData,
              status: applicationData.status,
              createdAt: applicationData.createdAt,
            };

            // Also add to applications array temporarily
            const existingApps = JSON.parse(localStorage.getItem('applications') || '[]');
            const appIndex = existingApps.findIndex(app => app.id === application.id);
            if (appIndex >= 0) {
              existingApps[appIndex] = localStyleApp;
            } else {
              existingApps.push(localStyleApp);
            }
            localStorage.setItem('applications', JSON.stringify(existingApps));

            logger.log('Stored application data in localStorage');
            navigate('/BirthApplicationSummary');
          } else {
            // Local data structure - works as before
            localStorage.setItem(
              'birthCertificateApplication',
              JSON.stringify(applicationData.formData)
            );
            localStorage.setItem('currentApplicationId', application.id);
            navigate('/BirthApplicationSummary');
          }
        } else if (applicationData) {
          // Backend data without formData - create a basic structure
          const basicFormData = {
            fullName: applicationData.fullName || '',
            status: applicationData.status,
            id: applicationData.id,
            createdAt: applicationData.createdAt,
          };
          localStorage.setItem('birthCertificateApplication', JSON.stringify(basicFormData));
          localStorage.setItem('currentApplicationId', application.id);
          navigate('/BirthApplicationSummary');
        }
      } else if (applicationType === 'Marriage Certificate') {
        if (applicationData?.formData) {
          localStorage.setItem('marriageFormData', JSON.stringify(applicationData.formData));
          localStorage.setItem('currentMarriageApplicationId', application.id);
          navigate('/MarriageSummaryForm');
        } else if (applicationData) {
          const convertedFormData = convertBackendToFormData(
            applicationData,
            'Marriage Certificate'
          );
          localStorage.setItem('marriageFormData', JSON.stringify(convertedFormData));
          localStorage.setItem('currentMarriageApplicationId', application.id);
          navigate('/MarriageSummaryForm');
        }
      } else if (applicationType === 'Marriage License') {
        if (applicationData?.formData) {
          localStorage.setItem('marriageFormData', JSON.stringify(applicationData.formData));
          navigate('/MarriageLicenseSummary');
        } else if (applicationData) {
          const convertedFormData = convertBackendToFormData(applicationData, 'Marriage License');
          localStorage.setItem('marriageFormData', JSON.stringify(convertedFormData));
          navigate('/MarriageLicenseSummary');
        }
      } else {
        // Generic handler for unknown types or backend applications
        localStorage.setItem('currentApplicationId', application.id);
        localStorage.setItem('backendApplicationData', JSON.stringify(applicationData));
        navigate('/ApplicationDetails/' + application.id);
      }
    } catch (err) {
      logger.error('Error preparing application summary:', err);
      // alert('An error occurred while loading the application. Please try again.');
    }
  };

  // Helper function to convert backend data to expected form data structure
  const convertBackendToFormData = (backendData, applicationType) => {
    logger.log('Converting backend data:', backendData);
    logger.log('Backend formData:', backendData.formData);

    if (applicationType === 'Birth Certificate') {
      // The backend already has formData, just map the field names to what the summary expects
      const formData = backendData.formData || {};

      return {
        // Personal Information - map backend field names to expected names
        fullName:
          `${formData.firstName || ''} ${formData.middleName || ''} ${formData.lastName || ''}`.trim(),
        firstName: formData.firstName || '',
        middleName: formData.middleName || '',
        lastName: formData.lastName || '',

        // Date of Birth - combine separate fields
        dateOfBirth:
          formData.birthYear && formData.birthMonth && formData.birthDay
            ? `${formData.birthYear}-${getMonthNumber(formData.birthMonth)}-${formData.birthDay.padStart(2, '0')}`
            : '',
        birthDay: formData.birthDay || '',
        birthMonth: formData.birthMonth || '',
        birthYear: formData.birthYear || '',

        // Place of Birth
        placeOfBirth: `${formData.city || ''}, ${formData.province || ''}`.replace(
          ', ',
          formData.city && formData.province ? ', ' : ''
        ),
        city: formData.city || '',
        province: formData.province || '',

        // Parent Information
        fatherName:
          `${formData.fatherFirstName || ''} ${formData.fatherMiddleName || ''} ${formData.fatherLastName || ''}`.trim(),
        fatherFirstName: formData.fatherFirstName || '',
        fatherMiddleName: formData.fatherMiddleName || '',
        fatherLastName: formData.fatherLastName || '',

        motherName:
          `${formData.motherFirstName || ''} ${formData.motherMiddleName || ''} ${formData.motherLastName || ''}`.trim(),
        motherFirstName: formData.motherFirstName || '',
        motherMiddleName: formData.motherMiddleName || '',
        motherLastName: formData.motherLastName || '',

        // Application Information
        purpose: formData.purpose || '',
        isCopyRequest: formData.isCopyRequest || false,

        // System fields
        status: backendData.status,
        id: backendData.id,
        createdAt: backendData.createdAt,
        applicationType: backendData.applicationType || 'Birth Certificate',

        // Include all original formData fields as well
        ...formData,
      };
    } else if (applicationType === 'Marriage Certificate') {
      const formData = backendData.formData || {};

      return {
        // Map marriage certificate fields based on your backend structure
        groomName:
          formData.groomName ||
          `${formData.groomFirstName || ''} ${formData.groomMiddleName || ''} ${formData.groomLastName || ''}`.trim(),
        brideName:
          formData.brideName ||
          `${formData.brideFirstName || ''} ${formData.brideMiddleName || ''} ${formData.brideLastName || ''}`.trim(),
        marriageDate: formData.marriageDate || '',
        marriagePlace: formData.marriagePlace || '',

        // System fields
        status: backendData.status,
        id: backendData.id,
        createdAt: backendData.createdAt,
        applicationType: backendData.applicationType || 'Marriage Certificate',

        // Include all original formData fields
        ...formData,
      };
    }

    // Default structure - use formData if available
    const formData = backendData.formData || {};
    return {
      ...formData,
      status: backendData.status,
      id: backendData.id,
      createdAt: backendData.createdAt,
      applicationType: backendData.applicationType || applicationType,
    };
  };

  // Helper function to convert month names to numbers
  const getMonthNumber = monthName => {
    const months = {
      January: '01',
      February: '02',
      March: '03',
      April: '04',
      May: '05',
      June: '06',
      July: '07',
      August: '08',
      September: '09',
      October: '10',
      November: '11',
      December: '12',
    };
    return months[monthName] || '01';
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
                borderRadius: '6px',
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
                  overflow: 'hidden',
                },
              }}
            >
              <DialogTitle
                sx={{
                  backgroundColor: '#184a5b',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                }}
              >
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
                        backgroundColor: 'rgba(138, 172, 181, 0.1)',
                      },
                    }}
                  >
                    <FavoriteIcon sx={{ mr: 2, color: '#8aacb5' }} />
                    <Box textAlign="left">
                      <Typography sx={{ fontWeight: 500, color: '#184a5b' }}>
                        Marriage Certificate
                      </Typography>
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
                        backgroundColor: 'rgba(138, 172, 181, 0.1)',
                      },
                    }}
                  >
                    <AssignmentIcon sx={{ mr: 2, color: '#8aacb5' }} />
                    <Box textAlign="left">
                      <Typography sx={{ fontWeight: 500, color: '#184a5b' }}>
                        Birth Certificate
                      </Typography>
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

  if (loading) {
    return (
      <Box className="LoadingContainerApplications">
        <CircularProgress size={30} />
        <Typography variant="body2">Loading recent applications...</Typography>
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
            <Typography variant="body1">You have no recent applications.</Typography>
            <Button variant="contained" className="StartApplicationBtn" onClick={handleOpenDialog}>
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
                      <Typography className="ApplicationDialogButtonTitle">
                        Marriage Certificate
                      </Typography>
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
                      <Typography className="ApplicationDialogButtonTitle">
                        Birth Certificate
                      </Typography>
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
            <Card className={`ApplicationCard Status${app.status}`} elevation={0}>
              <CardContent className="ApplicationCardContent">
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={12} sm={7}>
                    <Box>
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
                          Applicant: {app.formData?.firstName || ''}{' '}
                          {app.formData?.middleName || ''} {app.formData?.lastName || ''}
                        </Typography>
                        <Typography className="ApplicationId">ID: {app.id || 'N/A'}</Typography>
                        <Typography className="ApplicationDate">{app.date}</Typography>
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
