import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './BirthApplicationSummary.css';
import AffidavitBirthForm from './BirthCertificateForm/BirthBackIdentifyingForm';
import EditIcon from '@mui/icons-material/Edit';
import { getApplications } from '../ApplicationData';
import { documentApplicationService } from '../../../services/documentApplicationService';

const BirthApplicationSummary = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [applicationId, setApplicationId] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAffidavit, setShowAffidavit] = useState(false);
  const [isCopyRequest, setIsCopyRequest] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('Pending');
  const [statusMessage, setStatusMessage] = useState('');
  const [updateTrigger, setUpdateTrigger] = useState(0);

const uiTitleMap = {
  'Request a Copy of Birth Certificate': 'Copy of Birth Certificate Request',
  'Correction - Clerical Errors': 'Correction of Clerical Error',
  'Correction - Sex/Date of Birth': "Correction of Child's Sex / Date of Birth",
  'Correction - First Name': 'Correction of First Name'
};
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'green';
      case 'ready for pickup':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'processing':
        return '#2196f3'
      case 'submitted':
        return '#2196f3'; 
      case 'declined':
      case 'decline':
      case 'rejected':
        return 'red';
      case 'requires additional info':
        return '#ff8c00';
      case 'cancelled':
        return '#d32f2f';
      default:
        return '#184a5b';
    }
  };

  

 const loadApplicationData = async () => {
  try {
    setLoading(true);
    const currentId = localStorage.getItem('currentApplicationId');
    if (!currentId) {
      setError('No application ID found. Please select or create an application.');
      setLoading(false);
      return;
    }
    setApplicationId(currentId);
    let application = null;

    // FIRST: Try backend via documentApplicationService
    try {
      application = await documentApplicationService.getApplication(currentId);
    } catch (backendErr) {
      // If backend fails, fallback to local storage
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      application = applications.find(app => app.id === currentId);
    }

    if (application && application.formData) {
      const formDataCopy = JSON.parse(JSON.stringify(application.formData));
      setApplicationStatus(application.status || 'Pending');
      setStatusMessage(application.statusMessage || '');
      const applicationSubtype = application.applicationSubtype;
      setApplicationTitle(uiTitleMap[applicationSubtype] || 'Birth Certificate Application');
      // Robust check for copy/correction
      const appSubtype = (applicationSubtype || '').trim().toLowerCase();
      setIsCopyRequest(
        appSubtype === 'request a copy of birth certificate' ||
        appSubtype.startsWith('correction')
      );
      setFormData(formDataCopy);
      setUpdateTrigger(prev => prev + 1);
    } else {
      setError("Application not found.");
    }
  } catch (err) {
    setError('Error loading application data: ' + err.message);
  } finally {
    setLoading(false);
  }
};

  // Enhanced event listener
  useEffect(() => {
    // Initial data load
    console.log("Running loadApplicationData initial effect");
    loadApplicationData();
    
    // Set up event listener for storage changes
    const handleStorageChange = (event) => {
      console.log("Storage changed detected:", event?.key || "custom event");
      
      // Get most current application ID
      const currentId = localStorage.getItem('currentApplicationId');
      
      // If ID changed, update it first
      if (currentId && currentId !== applicationId) {
        console.log("Application ID changed to:", currentId);
        setApplicationId(currentId);
      }
      
      // Then reload data (but only if we have an ID)
      if (currentId) {
        loadApplicationData();
      }
    };
    
    // Listen for browser storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom storage event (for same-window updates)
    const customStorageHandler = () => {
      console.log("Custom storage event triggered");
      handleStorageChange();
    };
    window.addEventListener('customStorageUpdate', customStorageHandler);
    
    // Clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customStorageUpdate', customStorageHandler);
    };
  }, []); // Remove applicationId and updateTrigger from dependencies to prevent infinite loop

  
  // Navigation handler
  const handleBackToApplications = () => {
    navigate('/ApplicationForm');
  };

  // Delete application dialog
  const handleDeleteApplication = () => {
    setDeleteDialogOpen(true);
  };

  // Cancel delete dialog
  const cancelDeleteApplication = () => {
    setDeleteDialogOpen(false);
  };

  // Format date helper
  const formatDate = (month, day, year) => {
    if (!month || !day || !year) return 'N/A';
    return `${month} ${day}, ${year}`;
  };

  // Toggle affidavit view
  const toggleAffidavitPage = () => {
    setShowAffidavit(!showAffidavit);
  };

  // Confirm delete application
  const confirmDeleteApplication = () => {
    try {
      console.log("Deleting application ID:", applicationId);
      
      // Verify we have an ID
      if (!applicationId) {
        console.error("No application ID to delete");
        setDeleteDialogOpen(false);
        return;
      }
      
      // Get existing applications
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      console.log("Current applications count:", existingApplications.length);
      
      // Filter out this application
      const updatedApplications = existingApplications.filter(app => app.id !== applicationId);
      console.log("Updated applications count:", updatedApplications.length);
      
      // Save updated list
      localStorage.setItem('applications', JSON.stringify(updatedApplications));

      // Update current application if needed
      if (updatedApplications.length > 0) {
        const nextApp = updatedApplications[0];
        localStorage.setItem('currentApplicationId', nextApp.id);
        
        // Only update birthCertificateApplication if the next app is a birth certificate
        if (nextApp.type === 'Birth Certificate' || nextApp.type === 'Copy of Birth Certificate') {
          localStorage.setItem('birthCertificateApplication', JSON.stringify(nextApp.formData));
        } else {
          localStorage.removeItem('birthCertificateApplication');
        }
      } else {
        // No applications left
        localStorage.removeItem('currentApplicationId');
        localStorage.removeItem('birthCertificateApplication');
      }

      console.log('Application deleted:', applicationId);
      setDeleteDialogOpen(false);
      
      // Dispatch a storage event to notify other components
      const customEvent = new Event('customStorageUpdate');
      window.dispatchEvent(customEvent);
      
      // Navigate back to applications
      navigate('/ApplicationForm');
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Error deleting application: ' + err.message);
      setDeleteDialogOpen(false);
    }
  };

  // Handle Edit Application
  const handleEditApplication = () => {
    console.log("Edit button clicked for application ID:", applicationId);
    
    try {
      // Basic validation
      if (!applicationId) {
        console.error("Missing application ID");
        alert('Application ID is missing. Cannot edit this application.');
        return;
      }
      
      // Get fresh data from localStorage to ensure we have the latest version
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const application = applications.find(app => app.id === applicationId);
      
      if (!application || !application.formData) {
        console.error("Application not found in storage");
        alert('Application data is missing. Cannot edit this application.');
        return;
      }
      
      // Set all required localStorage flags for editing mode
      localStorage.setItem('isEditingBirthApplication', 'true');
      localStorage.setItem('editingApplicationId', applicationId);
      localStorage.setItem('currentApplicationStatus', applicationStatus || 'Pending');
      
      // Create a deep copy of the formData to avoid reference issues
      const formDataToEdit = JSON.parse(JSON.stringify(application.formData));
      localStorage.setItem('birthCertificateApplication', JSON.stringify(formDataToEdit));
      
      // Log to verify data was properly saved
      console.log("Edit mode activated for:", applicationId);
      console.log("Form data saved for editing:", formDataToEdit);
      
   
      if (isCopyRequest) {
        window.location.href = '/RequestACopyBirthCertificate';
      } else {
        window.location.href = '/BirthCertificateForm';
      }
    } catch (error) {
      console.error('Error in handleEditApplication:', error);
      alert('There was a problem setting up edit mode. Please try again.');
    }
  };
  const renderUploadedFile = (fileData) => {
    if (!fileData) return null;
    
    if (fileData.type.startsWith('image/')) {
      return (
        <Box sx={{ mt: 1, mb: 2 }}>
          <Typography variant="body2">
            {fileData.name} ({Math.round(fileData.size/1024)} KB)
          </Typography>
          <img 
            src={fileData.data} 
            alt="Uploaded file" 
            style={{ 
              maxWidth: '300px', 
              maxHeight: '200px', 
              marginTop: '8px',
              border: '1px solid #ccc'
            }} 
          />
        </Box>
      );
    } else {
      return (
        <Typography variant="body2">
          {fileData.name} ({Math.round(fileData.size/1024)} KB)
        </Typography>
      );
    }
  };
  const [applicationTitle, setApplicationTitle] = useState('Birth Certificate Application');
  const renderReadOnlyAffidavit = () => {
    return (
      <Box className="MainContainerSummaryBirth">
        <Paper elevation={3} className="SummaryPaperSummaryBirth">
          <Box className="HeaderSummaryBirth">
            <Typography variant="h4" className="TitleSummaryBirth">
              Birth Certificate Affidavit Forms
            </Typography>
            <Typography variant="body1" className="SubtitleSummaryBirth">
              Application ID: {applicationId}
            </Typography>
          </Box>


          <Divider className="DividerSummaryBirth" />

          <AffidavitBirthForm formData={formData} handleChange={() => {}} isReadOnly={true} />

          <Box className="ButtonsSectionSummaryBirth" style={{ marginTop: '20px' }}>
            <Button
              variant="contained"
              onClick={toggleAffidavitPage}
              className="BackButtonSummaryBirth"
            >
              Back to Summary
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderCopyBirthSummary = () => {
    return (
      <Box className="MainContainerSummaryBirth">
             <div className="ApplicationDetails">
  {(applicationStatus !== 'Pending' || statusMessage) && (
    <Box className="StatusSection" sx={{ marginTop: '15px', marginBottom: '15px' }}>
      <Typography 
        className="ApplicationStatus"
        sx={{ 
          fontWeight: 'bold',
          color: getStatusColor(applicationStatus)
        }}
      >
        Status: {applicationStatus}
      </Typography>
      
      {statusMessage && (
        <Typography 
          className="ApplicationStatusMessage"
          sx={{ 
            fontSize: '0.9rem',
            marginTop: '8px', 
            padding: '8px',
            backgroundColor: '#f5f5f5',
            borderLeft: '3px solid #1c4d5a'
          }}
        >
          Message from Administrator: {statusMessage}
                </Typography>
                
      )}
    </Box>
  )}
</div>
        <Paper elevation={3} className="SummaryPaperSummaryBirth">
          <Box className="HeaderSummaryBirth">
            <Typography variant="h4" className="TitleSummaryBirth">
              {applicationTitle}
            </Typography>
            <Typography variant="body1" className="SubtitleSummaryBirth">
              Application ID: {applicationId} | Status: {applicationStatus}
            </Typography>
          </Box>
     

          <Divider className="DividerSummaryBirth" />

          <Box className="ContentSectionSummaryBirth">
            <Typography variant="h6" className="SectionTitleSummaryBirth">
              Personal Information
            </Typography>

            <Grid container spacing={2} className="InfoGridSummaryBirth">
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">
                  Full Name:
                </Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.firstName || 'N/A'} {formData?.middleName || ''}{' '}
                  {formData?.lastName || ''}
                  {formData?.extension ? ` ${formData.extension}` : ''}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">
                  Date of Birth:
                </Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.birthMonth
                    ? `${formData.birthMonth} ${formData.birthDay}, ${formData.birthYear}`
                    : 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">
                  Place of Birth:
                </Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.city && formData?.province
                    ? `${formData.city}, ${formData.province}`
                    : 'N/A'}
                </Typography>
                {formData?.hospital && (
                  <Typography variant="body2" className="AdditionalInfoSummaryBirth">
                    Hospital/Institution: {formData.hospital}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          <Divider className="DividerSummaryBirth" />

          <Box className="ContentSectionSummaryBirth">
            <Typography variant="h6" className="SectionTitleSummaryBirth">
              Parents Information
            </Typography>

            <Grid container spacing={2} className="InfoGridSummaryBirth">
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">
                  Mother's Maiden Name:
                </Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.motherFirstName
                    ? `${formData.motherFirstName} ${formData.motherMiddleName || ''} ${formData.motherLastName}`
                    : 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">
                  Father's Name:
                </Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.fatherFirstName
                    ? `${formData.fatherFirstName} ${formData.fatherMiddleName || ''} ${formData.fatherLastName || ''}`
                    : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider className="DividerSummaryBirth" />

          <Box className="ContentSectionSummaryBirth">
            <Typography variant="h6" className="SectionTitleSummaryBirth">
              Request Information
            </Typography>

            <Grid container spacing={2} className="InfoGridSummaryBirth">
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">
                  Purpose of Request:
                </Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.purpose || 'N/A'}
                  {formData?.purpose === 'Others' &&
                    formData?.otherPurpose &&
                    `: ${formData.otherPurpose}`}
                </Typography>
              </Grid>

           
            </Grid>
          </Box>

          <Box className="NoteSectionSummaryBirth">
            <Alert severity="info">
              Your request for a copy of birth certificate is being processed. Please wait for
              approval. You will be notified once your request has been processed.
            </Alert>
          </Box>

          <Box className="buttonsContainer">
            <Button
              variant="contained"
              onClick={handleBackToApplications}
              className="BackButtonSummaryBirth"
            >
              Back to Applications
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={handleEditApplication}
              className="EditButtonSummaryBirth"
            >
              Edit Request
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteApplication}
              className="DeleteButtonSummaryBirth"
            >
              Cancel Request
            </Button>
          </Box>
        </Paper>

        {/* Delete dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={cancelDeleteApplication}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Cancel Birth Certificate Request?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to cancel this request? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDeleteApplication} color="primary">
              No, Keep Request
            </Button>
            <Button onClick={confirmDeleteApplication} color="error" autoFocus>
              Yes, Cancel Request
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box className="LoadingContainerSummaryBirth">
        <CircularProgress />
        <Typography>Loading application data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="ErrorContainerSummaryBirth">
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToApplications}
          className="BackButtonSummaryBirth"
        >
          Back to Applications
        </Button>
      </Box>
    );
  }

  if (showAffidavit) {
    return renderReadOnlyAffidavit();
  }

  return isCopyRequest ? (
    renderCopyBirthSummary()
  ) : (
      <Box className="MainContainerSummaryBirth">
<div className="ApplicationDetails">
  {/* Application Status Section - Only show when status is updated or has a message */}
  {(applicationStatus !== 'Pending' || statusMessage) && (
    <Box className="StatusSection" sx={{ marginTop: '15px', marginBottom: '15px' }}>
      <Typography 
        className="ApplicationStatus"
        sx={{ 
          fontWeight: 'bold',
          color: getStatusColor(applicationStatus)
        }}
      >
        Status: {applicationStatus}
      </Typography>
      
      {statusMessage && (
        <Typography 
          className="ApplicationStatusMessage"
          sx={{ 
            fontSize: '0.9rem',
            marginTop: '8px', 
            padding: '8px',
            backgroundColor: '#f5f5f5',
            borderLeft: '3px solid #1c4d5a'
          }}
        >
          Message from Administrator: {statusMessage}
        </Typography>
      )}
    </Box>
  )}
</div>
      <Paper elevation={3} className="SummaryPaperSummaryBirth">
        <Box className="certificateHeaderContainer">
          <Typography variant="body2" className="headerInfoText">
            (Revised January 2007)
          </Typography>
          <Typography variant="body1" className="headerInfoText">
            Republic of the Philippines
          </Typography>
          <Typography variant="body1" className="headerInfoText">
            OFFICE OF THE CIVIL REGISTRAR GENERAL
          </Typography>
          <Typography variant="h5" className="TitleSummaryBirth">
            CERTIFICATE OF LIVE BIRTH
          </Typography>
          <Typography variant="body2" className="headerInfoText">
            Application ID: {applicationId} | Status: {applicationStatus}
          </Typography>
        </Box>

        <Grid container className="registryContainer">
          <Grid item xs={8} className="provinceSection">
            <Typography variant="body2">Province: {formData?.province || 'N/A'}</Typography>
            <Typography variant="body2">City/Municipality: {formData?.city || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={4} className="registrySection">
            <Typography variant="body2">Registry No.: _____________</Typography>
          </Grid>
        </Grid>

        {/* CHILD Section */}
        <Grid container>
          <Grid item xs={1} className="sectionLabelContainer">
            <Typography variant="h6" className="verticalText">
              CHILD
            </Typography>
          </Grid>
          <Grid item xs={11}>
            <Grid container>
              <Grid item xs={12} className="fieldContainer">
                <Typography variant="body2" className="fieldLabel">
                  1. NAME
                </Typography>
                <Grid container>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(First)</Typography>
                    <Typography variant="body1">{formData?.firstName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Middle)</Typography>
                    <Typography variant="body1">{formData?.middleName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Last)</Typography>
                    <Typography variant="body1">{formData?.lastName || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={3} className="fieldGroup">
                <Typography variant="body2" className="fieldLabel">
                  2. SEX
                </Typography>
                <Typography variant="body1">{formData?.sex || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={9} className="fieldGroupNoBorder">
                <Typography variant="body2" className="fieldLabel">
                  3. DATE OF BIRTH
                </Typography>
                <Grid container>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Day)</Typography>
                    <Typography variant="body1">{formData?.birthDay || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Month)</Typography>
                    <Typography variant="body1">{formData?.birthMonth || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Year)</Typography>
                    <Typography variant="body1">{formData?.birthYear || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} className="fieldContainer">
                <Typography variant="body2" className="fieldLabel">
                  4. PLACE OF BIRTH
                </Typography>
                <Grid container>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Name of Hospital/Clinic/Institution)</Typography>
                    <Typography variant="body1">{formData?.hospital || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(City/Municipality)</Typography>
                    <Typography variant="body1">{formData?.city || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Province)</Typography>
                    <Typography variant="body1">{formData?.province || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={4} className="fieldGroup">
                <Typography variant="body2" className="fieldLabel">
                  5a. TYPE OF BIRTH
                </Typography>
                <Typography variant="body1">{formData?.typeOfBirth || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={4} className="fieldGroup">
                <Typography variant="body2" className="fieldLabel">
                  5b. IF MULTIPLE BIRTH, CHILD WAS
                </Typography>
                <Typography variant="body1">{formData?.multipleBirthOrder || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={2} className="fieldGroup">
                <Typography variant="body2" className="fieldLabel">
                  5c. BIRTH ORDER
                </Typography>
                <Typography variant="body1">{formData?.birthOrder || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={2} className="fieldGroupNoBorder">
                <Typography variant="body2" className="fieldLabel">
                  6. WEIGHT AT BIRTH
                </Typography>
                <Typography variant="body1">
                  {formData?.birthWeight ? `${formData.birthWeight} grams` : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* MOTHER Section */}
        <Grid container>
          <Grid item xs={1} className="sectionLabelContainer">
            <Typography variant="h6" className="verticalText">
              MOTHER
            </Typography>
          </Grid>
          <Grid item xs={11}>
            <Grid container>
              <Grid item xs={12} className="fieldContainer">
                <Typography variant="body2" className="fieldLabel">
                  7. MAIDEN NAME
                </Typography>
                <Grid container>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(First)</Typography>
                    <Typography variant="body1">{formData?.motherFirstName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Middle)</Typography>
                    <Typography variant="body1">{formData?.motherMiddleName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Last)</Typography>
                    <Typography variant="body1">{formData?.motherLastName || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={6} className="fieldGroup">
                <Typography variant="body2" className="fieldLabel">
                  8. CITIZENSHIP
                </Typography>
                <Typography variant="body1">{formData?.motherCitizenship || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6} className="fieldGroupNoBorder">
                <Typography variant="body2" className="fieldLabel">
                  9. RELIGION/RELIGIOUS SECT
                </Typography>
                <Typography variant="body1">{formData?.motherReligion || 'N/A'}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={3} className="fieldGroup">
                <Typography variant="body2" className="fieldLabel">
                  10a. Total number of children born alive
                </Typography>
                <Typography variant="body1">{formData?.motherTotalChildren || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3} className="fieldGroup">
                <Typography variant="body2" className="fieldLabel">
                  10b. No. of children still living including this birth
                </Typography>
                <Typography variant="body1">{formData?.motherLivingChildren || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3} className="fieldGroup">
                <Typography variant="body2" className="fieldLabel">
                  10c. No. of children born alive but are now dead
                </Typography>
                <Typography variant="body1">{formData?.motherDeceasedChildren || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={3} className="fieldGroupNoBorder">
                <Typography variant="body2" className="fieldLabel">
                  11. OCCUPATION
                </Typography>
                <Typography variant="body1">{formData?.motherOccupation || 'N/A'}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} className="fieldContainer">
                <Typography variant="body2" className="fieldLabel">
                  13. RESIDENCE
                </Typography>
                <Typography variant="body1">
                  {`${formData?.motherStreet || 'N/A'}, ${formData?.motherBarangay || ''}, ${formData?.motherCity || ''}, ${formData?.motherProvince || ''}, ${formData?.motherCountry || ''}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* FATHER Section */}
        <Grid container>
          <Grid item xs={1} className="sectionLabelContainer">
            <Typography variant="h6" className="verticalText">
              FATHER
            </Typography>
          </Grid>
          <Grid item xs={11}>
            <Grid container>
              <Grid item xs={12} className="fieldContainer">
                <Typography variant="body2" className="fieldLabel">
                  14. NAME
                </Typography>
                <Grid container>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(First)</Typography>
                    <Typography variant="body1">{formData?.fatherFirstName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Middle)</Typography>
                    <Typography variant="body1">{formData?.fatherMiddleName || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={4} className="nameFieldContainer">
                    <Typography variant="body2">(Last)</Typography>
                    <Typography variant="body1">{formData?.fatherLastName || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={4} className="fieldGroup">
                <Typography variant="body2" className="fieldLabel">
                  15. CITIZENSHIP
                </Typography>
                <Typography variant="body1">{formData?.fatherCitizenship || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={4} className="fieldGroup">
                <Typography variant="body2" className="fieldLabel">
                  16. RELIGION/RELIGIOUS SECT
                </Typography>
                <Typography variant="body1">{formData?.fatherReligion || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={4} className="fieldGroupNoBorder">
                <Typography variant="body2" className="fieldLabel">
                  17. OCCUPATION
                </Typography>
                <Typography variant="body1">{formData?.fatherOccupation || 'N/A'}</Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} className="fieldContainer">
                <Typography variant="body2" className="fieldLabel">
                  19. RESIDENCE
                </Typography>
                <Typography variant="body1">
                  {`${formData?.fatherStreet || 'N/A'}, ${formData?.fatherBarangay || ''}, ${formData?.fatherCity || ''}, ${formData?.fatherProvince || ''}, ${formData?.fatherCountry || ''}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* MARRIAGE OF PARENTS Section */}
        <Grid container className="marriageSection">
          <Grid item xs={12} className="marriageSectionTitle">
            <Typography variant="body2" className="fieldLabel">
              MARRIAGE OF PARENTS (If not married, accomplish Affidavit of Acknowledgement/Admission
              of Paternity at the back)
            </Typography>
          </Grid>
          <Grid item xs={6} className="marriageDate">
            <Typography variant="body2" className="fieldLabel">
              20a. DATE
            </Typography>
            <Grid container>
              <Grid item xs={4} className="nameFieldContainer">
                <Typography variant="body2">(Month)</Typography>
                <Typography variant="body1">{formData?.marriageMonth || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={4} className="nameFieldContainer">
                <Typography variant="body2">(Day)</Typography>
                <Typography variant="body1">{formData?.marriageDay || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={4} className="nameFieldContainer">
                <Typography variant="body2">(Year)</Typography>
                <Typography variant="body1">{formData?.marriageYear || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className="marriagePlace">
            <Typography variant="body2" className="fieldLabel">
              20b. PLACE
            </Typography>
            <Typography variant="body1">
              {`${formData?.marriageCity || 'N/A'}, ${formData?.marriageProvince || 'N/A'}`}
            </Typography>
          </Grid>
          </Grid>
          
        <Box className="buttonsContainer">


          <Button
            variant="contained"
            color="primary"
            onClick={toggleAffidavitPage}
            className="ViewAffidavitButton"
          >
            View Affidavit Forms
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<EditIcon />}
            onClick={handleEditApplication}
            className="EditButtonSummaryBirth"
          >
            Edit Application
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteApplication}
            className="DeleteButtonSummaryBirth"
          >
            Cancel Application
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteApplication}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Cancel Birth Certificate Application?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel this application? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteApplication} color="primary">
            No, Keep Application
          </Button>
          <Button onClick={confirmDeleteApplication} color="error" autoFocus>
            Yes, Cancel Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BirthApplicationSummary;
