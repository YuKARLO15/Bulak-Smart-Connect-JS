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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminApplicationDetails.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUploadPreview from './AdminFilePreview';
import AdminBirthAffidavitPreviewPage from './AdminAffidavitDetails';
import AdminMarriageApplicationView from './AdminMarriageApplicationView';
import AdminMarriageLicensePreview from './AdminMarriageLicensePreview';
import NavBar from '../../NavigationComponents/NavSide';
import { documentApplicationService } from '../../services/documentApplicationService';
import AdminCopyBirthPreview from './AdminCopyBirthPreview';


const AdminApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All'); 
  const [showDocumentsTab, setShowDocumentsTab] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [affidavit, setAffidavitTab] = useState(0);
  const currentUser = 'dennissegailfrancisco'; // Set the current user
  
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function fetchApplications() {
      try {
        // Use the documentApplicationService to fetch all applications
        const storedApplications = await documentApplicationService.getAllApplications();
        if (!isMounted) return;

        // Process applications to ensure they have all required fields
        const processedApplications = storedApplications.map(app => {
          // Get the base type (Marriage Certificate, Birth Certificate, etc.)
          let baseType = '';
          let subtype = '';
          
          // Try to determine the base type
          if (app.type) {
            baseType = app.type;
          } else if (app.applicationType) {
            baseType = app.applicationType;
          } else if (app.formData && app.formData.applicationType) {
            baseType = app.formData.applicationType;
          } else {
            baseType = 'Document Application';
          }
          
          // Try to determine the subtype
          if (app.applicationSubtype) {
            subtype = app.applicationSubtype;
          } else if (app.formData && app.formData.applicationSubtype) {
            subtype = app.formData.applicationSubtype;
          } else if (app.subtype) {
            subtype = app.subtype;
          }
          
          // Special handling for Copy of Birth Certificate
          if (subtype === 'Copy of Birth Certificate' || 
              (app.type === 'Birth Certificate' && app.applicationType === 'Request copy')) {
            subtype = 'Copy of Birth Certificate';
          }
          
          return {
            ...app,
            type: baseType,
            applicationSubtype: subtype || ''
          };
        });

        setApplications(processedApplications);

        let targetApp;

        if (id) {
          targetApp = processedApplications.find(app => app.id === id);
        } else {
          const currentAppId = localStorage.getItem('currentApplicationId');
          if (currentAppId) {
            targetApp = processedApplications.find(app => app.id === currentAppId);
          }
        }

        if (targetApp) {
          setSelectedApplication(targetApp);
        } else if (processedApplications.length > 0) {
          setSelectedApplication(processedApplications[0]);
        }
      } catch (err) {
        if (isMounted) {
          setError('Error loading applications: ' + err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchApplications();

    // Subscribe to updates
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('customStorageUpdate', handleCustomStorageUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('customStorageUpdate', handleCustomStorageUpdate);
    };
  }, [id]);

  const handleStorageUpdate = async () => {
    try {
      const storedApplications = await documentApplicationService.getAllApplications();
      
      // Process applications to ensure they have all required fields
      const processedApplications = storedApplications.map(app => {
        // Get the base type (Marriage Certificate, Birth Certificate, etc.)
        let baseType = '';
        let subtype = '';
        
        // Try to determine the base type
        if (app.type) {
          baseType = app.type;
        } else if (app.applicationType) {
          baseType = app.applicationType;
        } else if (app.formData && app.formData.applicationType) {
          baseType = app.formData.applicationType;
        } else {
          baseType = 'Document Application';
        }
        
        // Try to determine the subtype
        if (app.applicationSubtype) {
          subtype = app.applicationSubtype;
        } else if (app.formData && app.formData.applicationSubtype) {
          subtype = app.formData.applicationSubtype;
        } else if (app.subtype) {
          subtype = app.subtype;
        }
        
        // Special handling for Copy of Birth Certificate
        if (subtype === 'Copy of Birth Certificate' || 
            (app.type === 'Birth Certificate' && app.applicationType === 'Request copy')) {
          subtype = 'Copy of Birth Certificate';
        }
        
        return {
          ...app,
          type: baseType,
          applicationSubtype: subtype || ''
        };
      });
      
      setApplications(processedApplications);

      if (selectedApplication) {
        const updatedSelectedApp = processedApplications.find(app => app.id === selectedApplication.id);
        if (updatedSelectedApp) {
          setSelectedApplication(updatedSelectedApp);
        }
      }
    } catch (err) {
      console.error('Error updating applications from service:', err);
    }
  };

  const handleCustomStorageUpdate = (event) => {
    if (event.detail && event.detail.id) {
      handleStorageUpdate();
    }
  };
const handleApplicationClick = application => {
  setSelectedApplication(application);
  setShowDocumentsTab(false);
  setAffidavitTab(0); 
  navigate(`/ApplicationDetails/${application.id}`, { replace: true });
};

  const handleOpenStatusDialog = () => {
    setNewStatus(selectedApplication.status);
    setStatusMessage(selectedApplication.statusMessage || '');
    setStatusUpdateDialog(true);
  };

  const handleStatusChange = event => {
    setNewStatus(event.target.value);
  };

  const handleCategoryChange = event => {
    setFilterCategory(event.target.value);
  };

  const handleMessageChange = event => {
    setStatusMessage(event.target.value);
  };

  const toggleDocumentsTab = () => {
    setShowDocumentsTab(!showDocumentsTab);
  };

  const handleFilterChange = event => {
    setFilterStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      // Update status using the documentApplicationService
      await documentApplicationService.updateApplication(selectedApplication.id, {
        status: newStatus, 
        statusMessage: statusMessage,
        lastUpdated: new Date().toISOString()
      });

      // Refetch applications after update
      const updatedApplications = await documentApplicationService.getAllApplications();
      setApplications(updatedApplications);
      const updated = updatedApplications.find(app => app.id === selectedApplication.id);
      setSelectedApplication(updated);

      setStatusUpdateDialog(false);
      
      // Notify other components of the change
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error updating application status:', err);
      setError('Error updating application status: ' + err.message);
    }
  };

  const formatDate = (month, day, year) => {
    if (!month || !day || !year) return 'N/A';
    return `${month} ${day}, ${year}`;
  };
  
  // Helper function to get application type safely
  const getApplicationType = (app) => {
    if (app.type) return app.type;
    if (app.applicationType) return app.applicationType;
    if (app.formData && app.formData.applicationType) return app.formData.applicationType;
    return 'Document Application';
  };
  
  // Helper function to get application subtype
  const getApplicationSubtype = (app) => {
    if (app.applicationSubtype) return app.applicationSubtype;
    if (app.formData && app.formData.applicationSubtype) return app.formData.applicationSubtype;
    if (app.subtype) return app.subtype;
    return '';
  };
  
  // Helper function to determine if it's a copy of birth certificate
  const isCopyOfBirthCertificate = (app) => {
    const subtype = getApplicationSubtype(app);
    return subtype === 'Copy of Birth Certificate' || 
      (getApplicationType(app) === 'Birth Certificate' && app.applicationType === 'Request copy');
  };

  const filteredApplications = applications.filter(app => {
    if (filterStatus !== 'All' && app.status !== filterStatus) {
      return false;
    }

    if (filterCategory !== 'All') {
      const appType = getApplicationType(app);
      
      if (filterCategory === 'Birth Certificate') {
        if (
          appType !== 'Birth Certificate' &&
          appType !== 'Copy of Birth Certificate'
        ) {
          return false;
        }
      } else if (appType !== filterCategory) {
        return false;
      }
    }

    return true;
  });

  if (loading) {
    return (
      <Box className="LoadingContainerAdminAppForm">
        <CircularProgress />
        <Typography>Loading applications...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="ErrorContainerAdminAppForm">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className={`AdminMainContainerAdminAppForm ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" className="AdminTitleAdminAppForm">
            Document Application Details
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="ApplicationsListPaperAdminAppForm">
            <Box className="FilterContainerAdminAppForm">
              <h3 className="FilterTitleApplication"> Filter Applications </h3>
              
              {/* Category Filter */}
              <FormControl fullWidth margin="normal">
                <InputLabel className='InputLabelApplication'>Category</InputLabel>
                <Select value={filterCategory} onChange={handleCategoryChange} label="Category">
                  <MenuItem value="All">All Categories</MenuItem>
                  <MenuItem value="Birth Certificate">Birth Certificate</MenuItem>
                  <MenuItem value="Marriage Certificate">Marriage Certificate</MenuItem>
                  <MenuItem value="Marriage License">Marriage License</MenuItem>
                </Select>
              </FormControl>
              
              {/* Status Filter */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select value={filterStatus} onChange={handleFilterChange} label="Status">
                  <MenuItem value="All">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Decline">Declined</MenuItem>
                  <MenuItem value="Requires Additional Info">Requires Additional Info</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Typography variant="h6" className="ApplicationsListTitleAdminAppForm">
              Applications ({filteredApplications.length})
            </Typography>

            {filteredApplications.length === 0 ? (
              <Box className="NoApplicationsMessageAdminAppForm">
                <Typography>No applications found</Typography>
              </Box>
            ) : (
              <Box className="ApplicationsListAdminAppForm">
                {filteredApplications.map(app => (
                  <Paper
                    key={app.id}
                    elevation={2}
                    className={`ApplicationListItemAdminAppForm ${selectedApplication && selectedApplication.id === app.id ? 'selectedAdminAppForm' : ''}`}
                    onClick={() => handleApplicationClick(app)}
                  >
                    <Typography variant="subtitle1" className="ApplicationNameAdminAppForm">
                      {app.formData?.firstName || 'Unknown'} {app.formData?.lastName || ''}
                    </Typography>
                    <Box className="ApplicationMetAdminAppForm">
                      <Typography variant="body2" className="ApplicationIdAdminAppForm">
                        ID: {app.id}
                      </Typography>
                      
                      <Typography variant="body2" className="ApplicationDateAdminAppForm">
                        {/* Display subtype if available, otherwise show the base type */}
                        Type: {getApplicationSubtype(app) || getApplicationType(app)}
                      </Typography> 
                    </Box>
                    <Box className="ApplicationDetailsAdminAppForm">
                      <Typography variant="body2" style={{ marginTop: '4px' }}>
                        Submitted: {app.date || new Date().toLocaleDateString()}
                      </Typography>
                     
                      <Typography
                        variant="body2"
                        className={`ApplicationStatusAdminAppForm status-${(app.status || 'pending').toLowerCase().replace(/\s+/g, '-')}AdminAppForm`}
                      >
                        Status: {app.status || 'Pending'}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {selectedApplication ? (
            <Box className="DetailsSectionAdminAppForm">
              <Paper elevation={3} className="ApplicationDetailsPaperAdminAppForm">
                <Box className="ToggleBarAdminAppForm">
                  <Button
                    variant="contained"
                  color={!showDocumentsTab && affidavit === 0 ? 'primary' : 'inherit'}
                    onClick={() => {
                      setShowDocumentsTab(false);
                      setAffidavitTab(0);
                    }}

                    className={!showDocumentsTab && affidavit === 0 ? 'ActiveToggleButtonAdminAppForm' : ''}

                  >
                    Application Form
                  </Button>
   <Button
    variant="contained"
    color={affidavit === 1 ? 'primary' : 'inherit'}
    onClick={() => {
      setAffidavitTab(1);
      setShowDocumentsTab(false);
    }}
    startIcon={<AttachFileIcon />}
     className={affidavit === 1 ? 'ActiveToggleButtonAdminAppForm' : ''}
  >
    Affidavit
  </Button>

                  <Button
                    variant="contained"
                         color={showDocumentsTab ? 'primary' : 'inherit'}
                    onClick={() => setShowDocumentsTab(true)}
                    startIcon={<AttachFileIcon />}
                     className={showDocumentsTab && affidavit === 0 ? 'ActiveToggleButtonAdminAppForm' : ''}

                  >
                    Uploaded Documents
                  </Button>

                </Box>

                

        {!showDocumentsTab ? (
  <>
    {affidavit === 1 ? (

      <AdminBirthAffidavitPreviewPage 
        applicationId={selectedApplication.id}
        currentUser={{
          login: 'dennissegailfrancisco',
          role: 'super admin'
        }}
      />
    ) : (
    
      <>
        {getApplicationType(selectedApplication) === 'Marriage Certificate' ? (
          <AdminMarriageApplicationView applicationData={selectedApplication} />
        ) : getApplicationType(selectedApplication) === 'Marriage License' ? (
          <AdminMarriageLicensePreview applicationData={selectedApplication} />
        ) : isCopyOfBirthCertificate(selectedApplication) ? (
          <AdminCopyBirthPreview applicationData={selectedApplication} />
        ) : getApplicationType(selectedApplication) === 'Birth Certificate' ? (
                      <>
                        <Box className="certificateHeaderContainer">
                   
                          <Typography variant="body2" className="DetailsLabelAdminAppForm">
                            Municipal Form No. 102
                          </Typography>
                          <Typography variant="body2" className="DetailsLabelAdminAppForm">
                            (Revised January 2007)
                          </Typography>
                          <Typography variant="body1" className="DetailsLabelAdminAppForm">
                            Republic of the Philippines
                          </Typography>
                          <Typography variant="body1" className="DetailsLabelAdminAppForm">
                            OFFICE OF THE CIVIL REGISTRAR GENERAL
                          </Typography>
                          <Typography variant="h5" className="SectionTitleAdminAppForm">
                            CERTIFICATE OF LIVE BIRTH
                          </Typography>
                        </Box>

                        <Grid container className="DetailsGridAdminAppForm">
                          <Grid item xs={8}>
                            <Box className="DetailsSectionAdminAppForm" style={{ padding: '5px' }}>
                              <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                Province
                              </Typography>
                              <Typography variant="body1" className="DetailsValueAdminAppForm">
                                {selectedApplication.formData?.province || 'N/A'}
                              </Typography>
                            </Box>
                            <Box className="DetailsSectionAdminAppForm" style={{ padding: '5px' }}>
                              <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                City/Municipality
                              </Typography>
                              <Typography variant="body1" className="DetailsValueAdminAppForm">
                                {selectedApplication.formData?.city || 'N/A'}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box className="DetailsSectionAdminAppForm" style={{ padding: '5px' }}>
                              <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                Registry No.
                              </Typography>
                              <Typography variant="body1" className="DetailsValueAdminAppForm">
                                _____________
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          className="DetailsGridAdminAppForm"
                          style={{ border: '1px solid #ccc' }}
                        >
                          <Grid
                            item
                            xs={1}
                            style={{
                              backgroundColor: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRight: '1px solid #ccc',
                            }}
                          >
                            <Typography
                              variant="h6"
                              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                            >
                              CHILD
                            </Typography>
                          </Grid>
                          <Grid item xs={11}>
                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderBottom: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  1. NAME
                                </Typography>
                                <Grid container>
                                  <Grid
                                    item
                                    xs={4}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (First)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.firstName || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Middle)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.middleName || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4} style={{ padding: '5px' }}>
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Last)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.lastName || 'N/A'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid
                                item
                                xs={3}
                                className="DetailsSectionAdminAppForm"
                                style={{
                                  borderRight: '1px solid #ccc',
                                  borderBottom: '1px solid #ccc',
                                  padding: '5px',
                                }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  2. SEX
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.sex || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={9}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderBottom: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  3. DATE OF BIRTH
                                </Typography>
                                <Grid container>
                                  <Grid
                                    item
                                    xs={4}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Day)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.birthDay || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Month)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.birthMonth || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4} style={{ padding: '5px' }}>
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Year)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.birthYear || 'N/A'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderBottom: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  4. PLACE OF BIRTH
                                </Typography>
                                <Grid container>
                                  <Grid
                                    item
                                    xs={4}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Name of Hospital/Clinic/Institution, House No., St.,
                                      Barangay)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.hospital || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (City/Municipality)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.city || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4} style={{ padding: '5px' }}>
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Province)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.province || 'N/A'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid
                                item
                                xs={4}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  5a. TYPE OF BIRTH
                                </Typography>
                                <Typography variant="caption" className="DetailsLabelAdminAppForm">
                                  (Single, Twin, Triplet, etc.)
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.typeOfBirth || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  5b. IF MULTIPLE BIRTH, CHILD WAS
                                </Typography>
                                <Typography variant="caption" className="DetailsLabelAdminAppForm">
                                  (First, Second, Third, etc.)
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.multipleBirthOrder || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={2}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  5c. BIRTH ORDER
                                </Typography>
                                <Typography
                                  variant="caption"
                                  className="DetailsLabelAdminAppForm"
                                  style={{ fontSize: '0.65rem' }}
                                >
                                  (Order of this birth in relation to all children born alive)
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.birthOrder || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={2}
                                className="DetailsSectionAdminAppForm"
                                style={{ padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  6. WEIGHT AT BIRTH
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.birthWeight
                                    ? `${selectedApplication.formData.birthWeight} grams`
                                    : 'N/A'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          className="DetailsGridAdminAppForm"
                          style={{ border: '1px solid #ccc', borderTop: 'none' }}
                        >
                          <Grid
                            item
                            xs={1}
                            style={{
                              backgroundColor: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRight: '1px solid #ccc',
                            }}
                          >
                            <Typography
                              variant="h6"
                              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                            >
                              MOTHER
                            </Typography>
                          </Grid>
                          <Grid item xs={11}>
                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderBottom: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  7. MAIDEN NAME
                                </Typography>
                                <Grid container>
                                  <Grid
                                    item
                                    xs={4}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (First)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.motherFirstName || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Middle)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.motherMiddleName || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4} style={{ padding: '5px' }}>
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Last)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.motherLastName || 'N/A'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid
                                item
                                xs={6}
                                className="DetailsSectionAdminAppForm"
                                style={{
                                  borderRight: '1px solid #ccc',
                                  borderBottom: '1px solid #ccc',
                                  padding: '5px',
                                }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  8. CITIZENSHIP
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.motherCitizenship || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={6}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderBottom: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  9. RELIGION/RELIGIOUS SECT
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.motherReligion || 'N/A'}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid
                                item
                                xs={3}
                                className="DetailsSectionAdminAppForm"
                                style={{
                                  borderRight: '1px solid #ccc',
                                  borderBottom: '1px solid #ccc',
                                  padding: '5px',
                                }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  10a. Total number of children born alive
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.motherTotalChildren || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                className="DetailsSectionAdminAppForm"
                                style={{
                                  borderRight: '1px solid #ccc',
                                  borderBottom: '1px solid #ccc',
                                  padding: '5px',
                                }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  10b. No. of children still living including this birth
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.motherLivingChildren || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                className="DetailsSectionAdminAppForm"
                                style={{
                                  borderRight: '1px solid #ccc',
                                  borderBottom: '1px solid #ccc',
                                  padding: '5px',
                                }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  10c. No. of children born alive but are now dead
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.motherDeceasedChildren || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={3}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderBottom: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  11. OCCUPATION
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.motherOccupation || 'N/A'}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                className="DetailsSectionAdminAppForm"
                                style={{ padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  13. RESIDENCE
                                </Typography>
                                <Grid container>
                                  <Grid
                                    item
                                    xs={3}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (House No., St., Barangay)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.motherStreet || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={3}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (City/Municipality)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.motherCity || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={3}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Province)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.motherProvince || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={3} style={{ padding: '5px' }}>
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Country)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.motherCountry || 'N/A'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          className="DetailsGridAdminAppForm"
                          style={{ border: '1px solid #ccc', borderTop: 'none' }}
                        >
                          <Grid
                            item
                            xs={1}
                            style={{
                              backgroundColor: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRight: '1px solid #ccc',
                            }}
                          >
                            <Typography
                              variant="h6"
                              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                            >
                              FATHER
                            </Typography>
                          </Grid>
                          <Grid item xs={11}>
                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderBottom: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  14. NAME
                                </Typography>
                                <Grid container>
                                  <Grid
                                    item
                                    xs={4}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (First)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.fatherFirstName || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Middle)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.fatherMiddleName || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4} style={{ padding: '5px' }}>
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Last)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.fatherLastName || 'N/A'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid
                                item
                                xs={4}
                                className="DetailsSectionAdminAppForm"
                                style={{
                                  borderRight: '1px solid #ccc',
                                  borderBottom: '1px solid #ccc',
                                  padding: '5px',
                                }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  15. CITIZENSHIP
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.fatherCitizenship || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                className="DetailsSectionAdminAppForm"
                                style={{
                                  borderRight: '1px solid #ccc',
                                  borderBottom: '1px solid #ccc',
                                  padding: '5px',
                                }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  16. RELIGION/RELIGIOUS SECT
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.fatherReligion || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                className="DetailsSectionAdminAppForm"
                                style={{ borderBottom: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  17. OCCUPATION
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.fatherOccupation || 'N/A'}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid
                                item
                                xs={12}
                                className="DetailsSectionAdminAppForm"
                                style={{ padding: '5px' }}
                              >
                                <Typography variant="body2" className="DetailsLabelAdminAppForm">
                                  19. RESIDENCE
                                </Typography>
                                <Grid container>
                                  <Grid
                                    item
                                    xs={3}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (House No., St., Barangay)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.fatherStreet || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={3}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (City/Municipality)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.fatherCity || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={3}
                                    style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                                  >
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Province)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.fatherProvince || 'N/A'}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={3} style={{ padding: '5px' }}>
                                    <Typography
                                      variant="caption"
                                      className="DetailsLabelAdminAppForm"
                                    >
                                      (Country)
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      className="DetailsValueAdminAppForm"
                                    >
                                      {selectedApplication.formData?.fatherCountry || 'N/A'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          className="DetailsGridAdminAppForm"
                          style={{ border: '1px solid #ccc', borderTop: 'none' }}
                        >
                          <Grid
                            item
                            xs={12}
                            style={{
                              backgroundColor: '#f5f5f5',
                              padding: '5px',
                              borderBottom: '1px solid #ccc',
                            }}
                          >
                            <Typography variant="body2" className="DetailsLabelAdminAppForm">
                              MARRIAGE OF PARENTS (If not married, accomplish Affidavit of
                              Acknowledgement/Admission of Paternity at the back)
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                          >
                            <Typography variant="body2" className="DetailsLabelAdminAppForm">
                              20a. DATE
                            </Typography>
                            <Grid container>
                              <Grid
                                item
                                xs={4}
                                style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="caption" className="DetailsLabelAdminAppForm">
                                  (Month)
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.marriageMonth || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="caption" className="DetailsLabelAdminAppForm">
                                  (Day)
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.marriageDay || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={4} style={{ padding: '5px' }}>
                                <Typography variant="caption" className="DetailsLabelAdminAppForm">
                                  (Year)
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.marriageYear || 'N/A'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={6} style={{ padding: '5px' }}>
                            <Typography variant="body2" className="DetailsLabelAdminAppForm">
                              20b. PLACE
                            </Typography>
                            <Grid container>
                              <Grid
                                item
                                xs={4}
                                style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="caption" className="DetailsLabelAdminAppForm">
                                  (City/Municipality)
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.marriageCity || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                style={{ borderRight: '1px solid #ccc', padding: '5px' }}
                              >
                                <Typography variant="caption" className="DetailsLabelAdminAppForm">
                                  (Province)
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.marriageProvince || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={4} style={{ padding: '5px' }}>
                                <Typography variant="caption" className="DetailsLabelAdminAppForm">
                                  (Country)
                                </Typography>
                                <Typography variant="body1" className="DetailsValueAdminAppForm">
                                  {selectedApplication.formData?.marriageCountry || 'N/A'}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        
                        <Grid container>
                          <Grid item xs={12} style={{ padding: '15px 5px 5px' }}>
                            <Typography variant="body2" color="textSecondary">
                              Application processed by: {currentUser}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Date: {new Date().toISOString().split('T')[0]}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <Box className="NoFormViewAvailableAdminAppForm">
                        <Typography variant="h6">
                          No form view available for this application type: {getApplicationType(selectedApplication)}
                        </Typography>
                        <Typography variant="body1">
                          Subtype: {getApplicationSubtype(selectedApplication) || 'None specified'}
                        </Typography>
                      </Box>
                    )}
      </>
    )}
  </>
) : (
                  <Box className="DocumentPreviewContainerAdminAppForm">
                    <Box className="DocumentPreviewHeaderAdminAppForm">
                      <Typography variant="h5" className="SectionTitleAdminAppForm">
                        Uploaded Documents
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {getApplicationSubtype(selectedApplication) || getApplicationType(selectedApplication)}
                      </Typography>
                      <Typography variant="body1" className="SubtitleAdminAppForm">
                        Applicant: {selectedApplication.formData?.firstName || 'Unknown'}{' '}
                        {selectedApplication.formData?.lastName || ''}
                      </Typography>
                      <Typography variant="body2" className="SubtitleAdminAppForm">
                        Application ID: {selectedApplication.id}
                      </Typography>
                    </Box>

                    <Divider style={{ margin: '10px 0 20px' }} />

                    <FileUploadPreview
                      formData={selectedApplication.formData || {}}
                      applicationType={getApplicationType(selectedApplication)}
                      applicationSubtype={getApplicationSubtype(selectedApplication)}
                    />
                  </Box>
                )}

                <Box className="StatusSectionAdminAppForm">
                  <Typography
                    variant="subtitle1"
                    className={`StatusDisplayAdminAppForm status-${(selectedApplication.status || 'pending').toLowerCase().replace(/\s+/g, '-')}AdminAppForm`}
                  >
                    Status: {selectedApplication.status || 'Pending'}
                  </Typography>

                  {selectedApplication.statusMessage && (
                    <Typography variant="body2" className="StatusMessageAdminAppForm">
                      {selectedApplication.statusMessage}
                    </Typography>
                  )}

                  {selectedApplication.lastUpdated && (
                    <Typography variant="body2" className="LastUpdatedAdminAppForm">
                      Last Updated: {new Date(selectedApplication.lastUpdated).toLocaleString()}
                    </Typography>
                  )}

                  <Box className="ActionButtonsContainerAdminAppForm">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenStatusDialog}
                      className="UpdateStatusButtonAdminAppForm"
                    >
                      Update Status
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ) : (
            <Paper elevation={3} className="NoApplicationSelectedPaperAdminAppForm">
              <Typography variant="h6">No application selected</Typography>
              <Typography variant="body1">
                Please select an application from the list to view details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={statusUpdateDialog} onClose={() => setStatusUpdateDialog(false)}>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the status for application ID: {selectedApplication?.id}
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select value={newStatus} onChange={handleStatusChange} label="Status">
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Decline">Decline</MenuItem>
              <MenuItem value="Requires Additional Info">Requires Additional Info</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            label="Status Message/Notes"
            fullWidth
            multiline
            rows={4}
            value={statusMessage}
            onChange={handleMessageChange}
            placeholder="Enter any notes or messages for the applicant..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus} color="primary" variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminApplicationDetails;