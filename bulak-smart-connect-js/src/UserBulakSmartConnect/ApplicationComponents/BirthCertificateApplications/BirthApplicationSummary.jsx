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

const BirthApplicationSummary = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [applicationId, setApplicationId] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAffidavit, setShowAffidavit] = useState(false);
  const [isCopyRequest, setIsCopyRequest] = useState(false);

  useEffect(() => {
    try {
      const currentId = localStorage.getItem('currentApplicationId');

      if (currentId) {
        setApplicationId(currentId);

        const applications = JSON.parse(localStorage.getItem('applications')) || [];
        const application = applications.find(app => app.id === currentId);

        if (application && application.formData) {
          setFormData(application.formData);
          setIsCopyRequest(!!application.formData.purpose);
          console.log('Found application in applications list:', currentId);
        } else {
          const storedData = localStorage.getItem('birthCertificateApplication');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setFormData(parsedData);
            setIsCopyRequest(!!parsedData.purpose);
            console.log('Using fallback data for ID:', currentId);
          } else {
            setError('No application data found. Please complete the application form.');
          }
        }
      } else {
        const storedData = localStorage.getItem('birthCertificateApplication');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setFormData(parsedData);
          setIsCopyRequest(!!parsedData.purpose);

          const timestamp = Date.now();
          const randomString = Math.random().toString(5).slice(2);
          const generatedId = `BA-${timestamp}-${randomString}`;

          setApplicationId(generatedId);
          localStorage.setItem('currentApplicationId', generatedId);

          const existingApplications = JSON.parse(localStorage.getItem('applications')) || [];
          
          const applicationType = parsedData.purpose ? 'Birth Certificate Copy' : 'Birth Certificate';
          const applicationMessage = parsedData.purpose 
            ? `Request for copy of birth certificate for ${parsedData.firstName || ''} ${parsedData.lastName || ''}`
            : `Birth certificate application for ${parsedData.firstName || ''} ${parsedData.lastName || ''}`;
          
          const applicationData = {
            id: generatedId,
            type: applicationType,
            date: new Date().toLocaleDateString(),
            status: 'Pending',
            message: applicationMessage,
            formData: parsedData,
          };
          
          existingApplications.unshift(applicationData);
          localStorage.setItem('applications', JSON.stringify(existingApplications));
          console.log('Created new application entry with ID:', generatedId);
        } else {
          setError('No application data found. Please complete the application form.');
        }
      }
    } catch (err) {
      console.error('Error loading application data:', err);
      setError('Error loading application data: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBackToApplications = () => {
    navigate('/ApplicationForm');
  };

  const handleDeleteApplication = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDeleteApplication = () => {
    try {
      const existingApplications = JSON.parse(localStorage.getItem('applications')) || [];
      const updatedApplications = existingApplications.filter(app => app.id !== applicationId);

      localStorage.setItem('applications', JSON.stringify(updatedApplications));

      if (updatedApplications.length > 0) {
        localStorage.setItem('currentApplicationId', updatedApplications[0].id);
        localStorage.setItem(
          'birthCertificateApplication',
          JSON.stringify(updatedApplications[0].formData)
        );
      } else {
        localStorage.removeItem('currentApplicationId');
        localStorage.removeItem('birthCertificateApplication');
      }

      console.log('Application deleted:', applicationId);
      setDeleteDialogOpen(false);
      navigate('/ApplicationForm');
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Error deleting application: ' + err.message);
      setDeleteDialogOpen(false);
    }
  };

  const cancelDeleteApplication = () => {
    setDeleteDialogOpen(false);
  };

  const formatDate = (month, day, year) => {
    if (!month || !day || !year) return 'N/A';
    return `${month} ${day}, ${year}`;
  };

  const toggleAffidavitPage = () => {
    setShowAffidavit(!showAffidavit);
  };
  
  const handleEditApplication = () => {
    localStorage.setItem('editingApplication', JSON.stringify({
      id: applicationId,
      formData: formData
    }));
    
    if (isCopyRequest) {
      navigate('/RequestACopyBirthCertificate');
    } else {
      navigate('/BirthCertificateForm');
    }
  };

  const renderCopyBirthSummary = () => {
    return (
      <Box className="MainContainerSummaryBirth">
        <Paper elevation={3} className="SummaryPaperSummaryBirth">
          <Box className="HeaderSummaryBirth">
            <Typography variant="h4" className="TitleSummaryBirth">
              Copy of Birth Certificate Request
            </Typography>
            <Typography variant="body1" className="SubtitleSummaryBirth">
              Application ID: {applicationId} | Status: Pending
            </Typography>
          </Box>

          <Divider className="DividerSummaryBirth" />

          <Box className="ContentSectionSummaryBirth">
            <Typography variant="h6" className="SectionTitleSummaryBirth">
              Personal Information
            </Typography>
            
            <Grid container spacing={2} className="InfoGridSummaryBirth">
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">Full Name:</Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.firstName || 'N/A'} {formData?.middleName || ''} {formData?.lastName || ''} 
                  {formData?.extension ? ` ${formData.extension}` : ''}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">Date of Birth:</Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.birthMonth ? 
                    `${formData.birthMonth} ${formData.birthDay}, ${formData.birthYear}` : 
                    'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">Place of Birth:</Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.city && formData?.province ? 
                    `${formData.city}, ${formData.province}` : 
                    'N/A'}
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
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">Mother's Maiden Name:</Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.motherFirstName ? 
                    `${formData.motherFirstName} ${formData.motherMiddleName || ''} ${formData.motherLastName}` : 
                    'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">Father's Name:</Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.fatherFirstName ? 
                    `${formData.fatherFirstName} ${formData.fatherMiddleName || ''} ${formData.fatherLastName || ''}` : 
                    'N/A'}
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
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">Purpose of Request:</Typography>
                <Typography variant="body1" className="FieldValueSummaryBirth">
                  {formData?.purpose || 'N/A'}
                  {formData?.purpose === 'Others' && formData?.otherPurpose && 
                    `: ${formData.otherPurpose}`}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="FieldLabelSummaryBirth">Documents Uploaded:</Typography>
                <ul className="DocumentListSummaryBirth">
                  {formData?.uploadedFiles?.["Valid ID"] && (
                    <li>Valid ID</li>
                  )}
                  {formData?.uploadedFiles?.["Authorization Letter (if applicable)"] && (
                    <li>Authorization Letter</li>
                  )}
                  {!formData?.uploadedFiles?.["Valid ID"] && 
                   !formData?.uploadedFiles?.["Authorization Letter (if applicable)"] && (
                    <Typography variant="body2">No documents uploaded</Typography>
                  )}
                </ul>
              </Grid>
            </Grid>
          </Box>

          <Box className="NoteSectionSummaryBirth">
            <Alert severity="info">
              Your request for a copy of birth certificate is being processed. Please wait for approval. 
              You will be notified once your request has been processed.
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

          <AffidavitBirthForm formData={formData} handleChange={() => {}} />

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
  }

  return isCopyRequest 
    ? renderCopyBirthSummary() 
    : (
      <Box className="MainContainerSummaryBirth">
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
              Application ID: {applicationId} | Status: Pending
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
                  <Typography variant="body2" className="fieldLabel">1. NAME</Typography>
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
                  <Typography variant="body2" className="fieldLabel">2. SEX</Typography>
                  <Typography variant="body1">{formData?.sex || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={9} className="fieldGroupNoBorder">
                  <Typography variant="body2" className="fieldLabel">3. DATE OF BIRTH</Typography>
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
                  <Typography variant="body2" className="fieldLabel">4. PLACE OF BIRTH</Typography>
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
                  <Typography variant="body2" className="fieldLabel">5a. TYPE OF BIRTH</Typography>
                  <Typography variant="body1">{formData?.typeOfBirth || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={4} className="fieldGroup">
                  <Typography variant="body2" className="fieldLabel">5b. IF MULTIPLE BIRTH, CHILD WAS</Typography>
                  <Typography variant="body1">{formData?.multipleBirthOrder || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={2} className="fieldGroup">
                  <Typography variant="body2" className="fieldLabel">5c. BIRTH ORDER</Typography>
                  <Typography variant="body1">{formData?.birthOrder || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={2} className="fieldGroupNoBorder">
                  <Typography variant="body2" className="fieldLabel">6. WEIGHT AT BIRTH</Typography>
                  <Typography variant="body1">{formData?.birthWeight ? `${formData.birthWeight} grams` : 'N/A'}</Typography>
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
                  <Typography variant="body2" className="fieldLabel">7. MAIDEN NAME</Typography>
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
                  <Typography variant="body2" className="fieldLabel">8. CITIZENSHIP</Typography>
                  <Typography variant="body1">{formData?.motherCitizenship || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6} className="fieldGroupNoBorder">
                  <Typography variant="body2" className="fieldLabel">9. RELIGION/RELIGIOUS SECT</Typography>
                  <Typography variant="body1">{formData?.motherReligion || 'N/A'}</Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={3} className="fieldGroup">
                  <Typography variant="body2" className="fieldLabel">10a. Total number of children born alive</Typography>
                  <Typography variant="body1">{formData?.motherTotalChildren || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={3} className="fieldGroup">
                  <Typography variant="body2" className="fieldLabel">10b. No. of children still living including this birth</Typography>
                  <Typography variant="body1">{formData?.motherLivingChildren || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={3} className="fieldGroup">
                  <Typography variant="body2" className="fieldLabel">10c. No. of children born alive but are now dead</Typography>
                  <Typography variant="body1">{formData?.motherDeceasedChildren || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={3} className="fieldGroupNoBorder">
                  <Typography variant="body2" className="fieldLabel">11. OCCUPATION</Typography>
                  <Typography variant="body1">{formData?.motherOccupation || 'N/A'}</Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} className="fieldContainer">
                  <Typography variant="body2" className="fieldLabel">13. RESIDENCE</Typography>
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
                  <Typography variant="body2" className="fieldLabel">14. NAME</Typography>
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
                  <Typography variant="body2" className="fieldLabel">15. CITIZENSHIP</Typography>
                  <Typography variant="body1">{formData?.fatherCitizenship || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={4} className="fieldGroup">
                  <Typography variant="body2" className="fieldLabel">16. RELIGION/RELIGIOUS SECT</Typography>
                  <Typography variant="body1">{formData?.fatherReligion || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={4} className="fieldGroupNoBorder">
                  <Typography variant="body2" className="fieldLabel">17. OCCUPATION</Typography>
                  <Typography variant="body1">{formData?.fatherOccupation || 'N/A'}</Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} className="fieldContainer">
                  <Typography variant="body2" className="fieldLabel">19. RESIDENCE</Typography>
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
                MARRIAGE OF PARENTS (If not married, accomplish Affidavit of Acknowledgement/Admission of Paternity at the back)
              </Typography>
            </Grid>
            <Grid item xs={6} className="marriageDate">
              <Typography variant="body2" className="fieldLabel">20a. DATE</Typography>
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
              <Typography variant="body2" className="fieldLabel">20b. PLACE</Typography>
              <Typography variant="body1">
                {`${formData?.marriageCity || 'N/A'}, ${formData?.marriageProvince || 'N/A'}`}
              </Typography>
            </Grid>
          </Grid>

        
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