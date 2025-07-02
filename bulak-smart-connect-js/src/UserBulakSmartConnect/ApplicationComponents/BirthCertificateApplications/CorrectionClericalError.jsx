import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Checkbox, FormControlLabel, Grid, Typography, Alert, Paper, Snackbar, CircularProgress, Tooltip } from '@mui/material';
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import './CorrectionClericalError.css';
import { documentApplicationService } from '../../../services/documentApplicationService';
import { localStorageManager } from '../../../services/localStorageManager';

const fileCategories = [
  'PSA copy of wrong document',
  'MCA copy of wrong document',
  'Church record document owner & relatives',
  'School record document owner & relatives',
  'Marriage certificate document owner (if married) & relatives',
  'Birth certificate document owner & relatives',
  'Comelec record document owner & relatives',
  'Identification cards',
  'Others',
];

const GovernmentIdTooltip = ({ children }) => {
  const acceptedIds = [
    'Philippine Passport',
    'PhilSys ID or National ID',
    "Driver's License",
    'PRC ID',
    'UMID (Unified Multi-Purpose ID)',
    'SSS ID',
    'GSIS eCard',
    'OWWA ID',
    'Senior Citizen ID',
    'PWD ID',
    "Voter's ID or Voter's Certification",
    'Postal ID',
    'Barangay ID or Barangay Clearance with photo',
    'TIN ID',
    'PhilHealth ID',
    'Pag-IBIG Loyalty Card Plus',
    'Indigenous Peoples (IP) ID or certification'
  ];

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Accepted Government IDs:
          </Typography>
          {acceptedIds.map((id, index) => (
            <Typography key={index} variant="body2" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
              • {id}
            </Typography>
          ))}
        </Box>
      }
      arrow
      placement="top"
      sx={{
        '& .MuiTooltip-tooltip': {
          maxWidth: 300,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        }
      }}
    >
      <span style={{ 
        textDecoration: 'underline', 
        cursor: 'pointer',
        color: '#1976d2',
        fontWeight: 'bold'
      }}>
        {children}
      </span>
    </Tooltip>
  );
};
const documentDescriptions = {
  'PSA copy of wrong document': '- Official PSA certified true copy of the birth certificate containing the clerical error',
  'MCA copy of wrong document': '- Municipal Civil Registry Office certified true copy of the birth certificate containing the clerical error',
  'Church record document owner & relatives': '- Baptismal certificate or other church records of the document owner showing the correct details',
  'School record document owner & relatives': '- Official school records, transcripts, or enrollment documents of the document owner with the correct details',
  'Marriage certificate document owner (if married) & relatives': '- Official marriage certificate of the document owner (if applicable) and relatives displaying the correct details',
  'Birth certificate document owner & relatives': '- Birth certificates of the document owner showing the correct details',
  'Comelec record document owner & relatives': '- Voter registration records or voter ID of the document owner with the correct details',
  'Identification cards':
    (<> <GovernmentIdTooltip>  Government-issued identification cards </GovernmentIdTooltip> showing the correct details </> ) ,
  'Others': '- Additional supporting documents such as insurance records, employment certificates, or other official documents with the correct details'
};



const CorrectionClericalError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    firstName: false,
    lastName: false,
    middleName: false,
    others: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [fileData, setFileData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [applicationId, setApplicationId] = useState(null);
  const [backendApplicationCreated, setBackendApplicationCreated] = useState(false);
  const [uploadedDocumentsCount, setUploadedDocumentsCount] = useState(0);
  
  const isEditing = location.state?.isEditing || 
                    localStorage.getItem('isEditingBirthApplication') === 'true';

  // Show snackbar notification
  const showNotification = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Create application in backend
  const createBackendApplication = async () => {
    try {
      console.log("Creating application in backend...");
      
      // Get current application ID from localStorage or create a new one
      const currentId = localStorage.getItem('currentApplicationId');
      let appId = currentId;
      
      if (!appId) {
        appId = 'BC-' + Date.now().toString().slice(-6);
        console.log("Generated new application ID:", appId);
        localStorage.setItem('currentApplicationId', appId);
      }
      
      setApplicationId(appId);

      // Prepare data for backend
      const backendApplicationData = {
        applicationType: 'Birth Certificate',
        applicationSubtype: 'Correction - Clerical Errors',
        applicantName: `${formData.firstName || ''} ${formData.lastName || ''}`,
        applicantDetails: JSON.stringify({...formData, correctionOptions: selectedOptions}),
        formData: {...formData, correctionOptions: selectedOptions},
        status: 'PENDING'
      };

      console.log("Creating application with data:", backendApplicationData);
      
      // Call API to create application
      const response = await documentApplicationService.createApplication(backendApplicationData);
      console.log("Backend created application:", response);
      
      // Store the backend ID
      if (response && response.id) {
        localStorage.setItem('currentApplicationId', response.id);
        setApplicationId(response.id);
        setBackendApplicationCreated(true);
      }
      
      return response;
    } catch (error) {
      console.error("Failed to create application in backend:", error);
      showNotification(`Failed to register application: ${error.message}. Please try again.`, "error");
      return null;
    }
  };

  // Update uploaded documents count when uploadedFiles changes
  useEffect(() => {
    const count = Object.values(uploadedFiles).filter(Boolean).length;
    setUploadedDocumentsCount(count);
    console.log(`Uploaded documents count: ${count}`);
  }, [uploadedFiles]);

  useEffect(() => {
    // Load data when component mounts
    const loadData = async () => {
      try {
        setIsInitializing(true);
        
        // Load application data
        if (isEditing) {
          console.log("Loading data for editing...");
          const editingId = localStorage.getItem('editingApplicationId');
          console.log("Editing application ID:", editingId);
          
          if (editingId) {
            setApplicationId(editingId);
            
            // Check if this application exists in backend
            try {
              const backendApp = await documentApplicationService.getApplication(editingId);
              if (backendApp) {
                setBackendApplicationCreated(true);
                console.log("Application exists in backend:", backendApp);
              }
            } catch (error) {
              console.warn("Application may not exist in backend:", error);
            }
          }
          
          // Get applications from localStorage
          const applications = JSON.parse(localStorage.getItem('applications') || '[]');
          const applicationToEdit = applications.find(app => app.id === editingId);
          
          if (applicationToEdit) {
            console.log("Found application to edit:", applicationToEdit);
            if (applicationToEdit.formData && applicationToEdit.formData.correctionOptions) {
              setSelectedOptions(applicationToEdit.formData.correctionOptions);
            }
            if (applicationToEdit.uploadedFiles) {
              setUploadedFiles(applicationToEdit.uploadedFiles || {});
            }
            if (applicationToEdit.formData) {
              setFormData(applicationToEdit.formData);
            }
          } else {
            // Fallback to direct form data if available
            const savedFormData = localStorage.getItem('birthCertificateApplication');
            if (savedFormData) {
              const parsedData = JSON.parse(savedFormData);
              setFormData(parsedData);
              if (parsedData.correctionOptions) {
                setSelectedOptions(parsedData.correctionOptions);
              }
              if (parsedData.uploadedFiles) {
                setUploadedFiles(parsedData.uploadedFiles || {});
              }
              console.log("Loaded form data from birthCertificateApplication");
            }
          }
        } else {
          // If not editing, check for current application data
          const currentId = localStorage.getItem('currentApplicationId');
          if (currentId) {
            setApplicationId(currentId);
            
            // Check if this application exists in backend
            try {
              const backendApp = await documentApplicationService.getApplication(currentId);
              if (backendApp) {
                setBackendApplicationCreated(true);
                console.log("Application exists in backend:", backendApp);
              }
            } catch (error) {
              console.warn("Application may not exist in backend:", error);
              
              // If we have form data but no backend application, automatically create it
              const currentApplicationData = localStorage.getItem('birthCertificateApplication');
              if (currentApplicationData) {
                const parsedData = JSON.parse(currentApplicationData);
                setFormData(parsedData);
                
                // Auto-create backend application if needed
                await createBackendApplication();
              }
            }
          }
          
          const currentApplicationData = localStorage.getItem('birthCertificateApplication');
          if (currentApplicationData) {
            const parsedData = JSON.parse(currentApplicationData);
            setFormData(parsedData);
            if (parsedData.correctionOptions) {
              setSelectedOptions(parsedData.correctionOptions);
            }
            if (parsedData.uploadedFiles) {
              setUploadedFiles(parsedData.uploadedFiles || {});
            }
          }
        }
        
        // Check storage usage
        const usage = localStorageManager.getCurrentUsage();
        console.log(`📊 Current storage usage: ${usage.percentage.toFixed(1)}%`);
        
        if (usage.isNearFull) {
          console.warn('⚠️ localStorage is getting full, performing cleanup...');
          await localStorageManager.performCleanup(0.2);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
        showNotification("Error loading application data", "error");
      } finally {
        setIsInitializing(false);
      }
    };
    
    loadData();
  }, [isEditing]);

  // Function to convert data URL to File object
  function dataURLtoFile(dataurl, filename, type) {
    try {
      const arr = dataurl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : type;
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error('Error converting data URL to file:', error);
      throw new Error('Invalid file format');
    }
  }

  const handleCheckboxChange = event => {
    const { name, checked } = event.target;
    setSelectedOptions(prev => ({
      ...prev,
      [name]: checked,
    }));
    
    // Update formData with selected options
    setFormData(prev => ({
      ...prev,
      correctionOptions: {
        ...prev.correctionOptions || {},
        [name]: checked
      }
    }));
  };

  const handleFileUpload = async (label, isUploaded, fileDataObj) => {
      // Create application if needed before uploading files
      if (!backendApplicationCreated && isUploaded) {
        setIsLoading(true);
        const createdApp = await createBackendApplication();
        setIsLoading(false);
        
        if (!createdApp) {
          showNotification("Failed to register application. Cannot upload files.", "error");
          return;
        }
      }
      
      // Update the uploadedFiles state
      setUploadedFiles(prevState => {
        const newState = { ...prevState, [label]: isUploaded };
        console.log("Updated uploadedFiles:", newState);
        return newState;
      });
  
      if (isUploaded && fileDataObj) {
        setFileData(prevState => ({
          ...prevState,
          [label]: fileDataObj,
        }));
  
        // === Upload to backend ===
        try {
          const currentAppId = applicationId || localStorage.getItem('currentApplicationId');
          if (!currentAppId) {
            showNotification("Application ID is missing. Cannot upload file.", "error");
            return;
          }
          
          console.log("Application ID:", currentAppId);
          
          // Handle multiple files (array) or single file (object)
          const filesToUpload = Array.isArray(fileDataObj) ? fileDataObj : [fileDataObj];
          
          for (const [index, fileData] of filesToUpload.entries()) {
            console.log(`Uploading file ${index + 1}:`, fileData.name);
            
            const file = dataURLtoFile(fileData.data, fileData.name, fileData.type);
            
            // For multiple files, append index to label
            const uploadLabel = filesToUpload.length > 1 ? `${label} - File ${index + 1}` : label;
            
            const response = await documentApplicationService.uploadFile(currentAppId, file, uploadLabel);
            console.log(`Upload response for ${fileData.name}:`, response);
          }
          
          const fileCount = filesToUpload.length;
          const successMessage = fileCount > 1 
            ? `${fileCount} files uploaded successfully for "${label}"!`
            : `"${label}" uploaded successfully!`;
          
          showNotification(successMessage, "success");
          
        } catch (error) {
          console.error(`Failed to upload "${label}":`, error);
          
          // Show detailed error information
          if (error.response) {
            console.error("Server response:", error.response.status, error.response.data);
            
            // If error is 404 (application not found), try to create it and retry upload
            if (error.response.status === 404) {
              showNotification("Application not found. Creating new application...", "info");
              const createdApp = await createBackendApplication();
              if (createdApp) {
                // Retry upload for all files
                try {
                  const filesToUpload = Array.isArray(fileDataObj) ? fileDataObj : [fileDataObj];
                  
                  for (const [index, fileData] of filesToUpload.entries()) {
                    const file = dataURLtoFile(fileData.data, fileData.name, fileData.type);
                    const uploadLabel = filesToUpload.length > 1 ? `${label} - File ${index + 1}` : label;
                    
                    const retryResponse = await documentApplicationService.uploadFile(
                      createdApp.id, 
                      file, 
                      uploadLabel
                    );
                    console.log(`Retry upload response for ${fileData.name}:`, retryResponse);
                  }
                  
                  const fileCount = filesToUpload.length;
                  const successMessage = fileCount > 1 
                    ? `${fileCount} files uploaded successfully for "${label}"!`
                    : `"${label}" uploaded successfully!`;
                  
                  showNotification(successMessage, "success");
                  return;
                } catch (retryError) {
                  console.error("Retry upload failed:", retryError);
                }
              }
            }
            
            showNotification(`Failed to upload "${label}": ${error.response.data?.message || error.message}`, "error");
          } else {
            showNotification(`Failed to upload "${label}": ${error.message}`, "error");
          }
          
          // Revert the upload state on error
          setUploadedFiles(prevState => ({
            ...prevState,
            [label]: false,
          }));
        }
      } else {
        setFileData(prevState => {
          const newState = { ...prevState };
          delete newState[label];
          return newState;
        });
      }
    };
  

  const isAnyOptionSelected = Object.values(selectedOptions).some(val => val);
  const isFilesComplete = fileCategories.every(cat => uploadedFiles[cat]);
  const isFormComplete = isAnyOptionSelected && isFilesComplete;
  
  // Force enable submit button if at least one document is uploaded
  const forceEnableSubmit = uploadedDocumentsCount > 0 && isAnyOptionSelected;

  const mapStatusForBackend = (frontendStatus) => {
    const statusMap = {
      'Submitted': 'Pending',
      'SUBMITTED': 'Pending',
      'Pending': 'Pending',
      'Approved': 'Approved',
      'Rejected': 'Rejected',
      'Declined': 'Rejected',
      'Ready for Pickup': 'Ready for Pickup'
    };
    
    return statusMap[frontendStatus] || 'Pending';
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setIsSubmitted(true);
      
      // Get the application ID
      const currentAppId = applicationId || localStorage.getItem('currentApplicationId');
      if (!currentAppId) {
        console.error("No application ID found");
        showNotification("Application ID is missing. Cannot proceed.", "error");
        setIsLoading(false);
        setIsSubmitted(false);
        return;
      }

      // Check storage usage before saving
      const usage = localStorageManager.getCurrentUsage();
      if (usage.isCritical) {
        console.warn('Storage critical, performing cleanup before save...');
        await localStorageManager.performCleanup(0.4);
      }

      // Backend data preparation
      const backendData = {
        status: mapStatusForBackend('SUBMITTED'),
        statusMessage: 'Application submitted with all required documents',
        applicantName: `${formData.firstName || ''} ${formData.lastName || ''}`,
        applicationType: 'Birth Certificate',
        applicationSubtype: 'Correction - Clerical Errors',
        correctionOptions: selectedOptions
      };
      
      // Update the backend application
      try {
        const response = await documentApplicationService.updateApplication(currentAppId, backendData);
        console.log('Application status updated in backend:', response);
      } catch (error) {
        console.error('Failed to update backend status:', error);
        showNotification("Warning: Failed to update backend status. Continuing with local update.", "warning");
        // Continue with local update even if backend fails
      }

      // Update localStorage with auto-cleanup support
      const updatedFormData = {
        ...formData,
        uploadedFiles: fileData,
        correctionOptions: selectedOptions,
        status: 'Pending',
        submittedAt: new Date().toISOString()
      };

      // Get current applications
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const appIndex = applications.findIndex(app => app.id === currentAppId);

      if (appIndex >= 0) {
        // Update existing application
        applications[appIndex] = {
          ...applications[appIndex],
          formData: {
            ...applications[appIndex].formData,
            ...updatedFormData
          },
          uploadedFiles: fileData,
          correctionOptions: selectedOptions,
          status: 'Pending',
          lastUpdated: new Date().toISOString()
        };
      } else {
        // If not found, add as new application
        applications.push({
          id: currentAppId,
          type: 'Birth Certificate',
          applicationType: 'Correction',  
          applicationSubtype: 'Correction - Clerical Errors',
          date: new Date().toLocaleDateString(),
          status: 'Pending',
          message: `Birth Certificate application for ${formData.firstName || ''} ${formData.lastName || ''}`,
          formData: updatedFormData,
          uploadedFiles: fileData,
          correctionOptions: selectedOptions,
          lastUpdated: new Date().toISOString()
        });
      }

      // Use safe storage methods
      const applicationsStored = await localStorageManager.safeSetItem(
        'applications', 
        JSON.stringify(applications)
      );
      
      const formDataStored = await localStorageManager.safeSetItem(
        'birthCertificateApplication', 
        JSON.stringify(updatedFormData)
      );

      if (!applicationsStored || !formDataStored) {
        showNotification('Application submitted successfully! Note: Some data may not be saved locally due to storage limitations.', 'warning');
      } else {
        showNotification('Application submitted successfully!', 'success');
      }

      // Dispatch storage events
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('customStorageUpdate', {
        detail: {
          id: currentAppId,
          action: 'updated',
          type: 'Birth Certificate',
          subtype: 'Correction - Clerical Errors'
        }
      }));

      console.log('Application submitted successfully');
      
      // Navigate to summary page after a short delay
      setTimeout(() => {
        navigate('/BirthApplicationSummary');
      }, 2000);

    } catch (error) {
      console.error('Error submitting application:', error);
      showNotification(`Error submitting application: ${error.message}`, "error");
      setIsLoading(false);
      setIsSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`ClericalErrorContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleClerical">
        BIRTH CERTIFICATE APPLICATION
      </Typography>
      <Typography variant="subtitle1" className="SubtitleClerical">
        Application for Correction of Clerical Errors
      </Typography>

      {isInitializing ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} className="DocumentsPaperClerical">
          {isLoading && !backendApplicationCreated && (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Creating application record... Please wait.
              </Typography>
            </Box>
          )}

          <Box sx={{ marginBottom: 3 }}>
            <Typography className="SectionTitleClerical" variant="body1">
              Select the applicable:
            </Typography>
            <Grid container spacing={2}>
              {Object.keys(selectedOptions).map(option => (
                <Grid item xs="auto" key={option} className="ClericalCB">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedOptions[option]}
                        onChange={handleCheckboxChange}
                        name={option}
                        disabled={isLoading}
                      />
                    }
                    label={option.replace(/([A-Z])/g, ' $1').trim()}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ marginBottom: 3 }}>
            {fileCategories.map((category, index) => (
                <FileUpload
        label={category}
        description={documentDescriptions[category]}
        onUpload={(isUploaded, fileDataObj) => 
          handleFileUpload(category, isUploaded, fileDataObj)
        }
        required={true}
        disabled={isLoading}
        multiple={true}
      />
            ))}
          </Box>

          <Box className="ImpotantNotesClerical">
            <Typography variant="h6" className="ImportantNote">
              IMPORTANT NOTES:
            </Typography>
            <Typography variant="body2">PAYMENT:</Typography>
            <Typography variant="body2">1. Filing Fee - PHP 1000.00</Typography>
            <Typography variant="body2">2. MISC, EXPENSES - P600</Typography>
            <Typography variant="body2">
              3. Other Fees - PHP 500.00 (notarized, new PSA corrected copy)
            </Typography>
            <Typography variant="body2">PROCESSING DURATION: 4-6 months</Typography>
            <Typography variant="body2">FOR INQUIRY (text only)</Typography>
            <Typography variant="body2">MCR LANI - 0928-551-0767</Typography>
          </Box>

          {isSubmitted && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              Your application has been submitted successfully! Redirecting...
            </Alert>
          )}

          <Box className="ButtonContainerClerical">
 <Button
    variant="outlined"
    color="primary"
    onClick={() => {
 
      const modifyApplicationState = {
       
        applicationId: applicationId,
        isEditing: true, 
        editingApplicationId: applicationId,
        
    
        formData: {
          ...formData,
          correctionOptions: selectedOptions,
          uploadedFiles: uploadedFiles,
          fileData: fileData,
          lastModified: new Date().toISOString()
        },
        
       
        uploadedFiles: uploadedFiles,
        fileData: fileData,
        

        correctionOptions: selectedOptions,
        
  
        modifyMode: true,
        preserveData: true,
        backFromCorrection: true,
        correctionType: 'Clerical Errors'
      };

 
      try {
       
        localStorage.setItem('birthCertificateApplication', JSON.stringify(modifyApplicationState.formData));
        
   
        localStorage.setItem('isEditingBirthApplication', 'true');
        localStorage.setItem('editingApplicationId', applicationId);
        localStorage.setItem('currentApplicationId', applicationId);
        
   
        localStorage.setItem('modifyingApplication', JSON.stringify({
          id: applicationId,
          type: 'Birth Certificate - Correction',
          correctionType: 'Clerical Errors',
          correctionOptions: selectedOptions,
          uploadedFiles: uploadedFiles,
          timestamp: new Date().toISOString()
        }));

  
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const appIndex = applications.findIndex(app => app.id === applicationId);
        
        if (appIndex >= 0) {
 
          applications[appIndex] = {
            ...applications[appIndex],
            formData: modifyApplicationState.formData,
            uploadedFiles: uploadedFiles,
            correctionOptions: selectedOptions,
            status: applications[appIndex].status || 'In Progress',
            lastModified: new Date().toISOString(),
            isBeingModified: true
          };
          
          localStorage.setItem('applications', JSON.stringify(applications));
        }

        console.log('Navigating back with modify state:', modifyApplicationState);
        
   
        navigate('/RequestACopyBirthCertificate', { 
          state: modifyApplicationState,
          replace: false 
        });
        
      } catch (error) {
        console.error('Error saving modify state:', error);
        showNotification('Error saving current state. Some data may be lost.', 'warning');
        
        
        navigate('/RequestACopyBirthCertificate', { 
          state: { 
            applicationId: applicationId,
            isEditing: true,
            editingApplicationId: applicationId,
            formData: formData
          } 
        });
      }
    }}
    className="BackButtonClerical"
    disabled={isLoading}
  >
    Back
  </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!forceEnableSubmit || isLoading || isSubmitted}
              onClick={handleSubmit}
              className="SubmitButtonClerical"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CorrectionClericalError;