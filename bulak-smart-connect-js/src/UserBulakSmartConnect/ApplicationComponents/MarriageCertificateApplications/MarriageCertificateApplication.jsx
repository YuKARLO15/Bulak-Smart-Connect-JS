import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import './MarriageCertificateApplication.css';
import { documentApplicationService } from '../../../services/documentApplicationService';

const requiredDocuments = [
  'Marriage License',
  'Valid ID of Bride', 
  'Valid ID of Groom',
  'Certificate of Marriage from the Officiant'
];

const MarriageCertificateApplication = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [fileData, setFileData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [backendApplicationCreated, setBackendApplicationCreated] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  
  // Create application in backend
  const createBackendApplication = async (existingFormData = {}) => {
    try {
      console.log("Creating NEW Marriage Certificate application in backend...");
      
      // Generate a unique application ID specifically for Marriage Certificate
      const newAppId = 'MC-' + Date.now().toString().slice(-6);
      
      // Combine form data
      const combinedFormData = {
        ...existingFormData,
        ...formData
      };
      
      // Prepare data for backend - Marriage Certificate specific
      const backendApplicationData = {
        applicationType: 'Marriage Certificate',  // Correct type
        applicationSubtype: 'Request for Marriage Certificate',
        applicantName: getApplicantName(combinedFormData),
        status: 'Pending',
        formData: {
          ...combinedFormData,
          applicationId: newAppId,
          certificateType: 'Marriage Certificate',
          sessionId: Date.now().toString()
        }
      };

      console.log("Creating Marriage Certificate application with data:", backendApplicationData);
      
      // Call API to create application
      const response = await documentApplicationService.createApplication(backendApplicationData);
      console.log("Backend created Marriage Certificate application:", response);
      
      // Store the NEW backend ID
      if (response && response.id) {
        setApplicationId(response.id);
        setBackendApplicationCreated(true);
        
        // Store in localStorage
        localStorage.setItem('currentApplicationId', response.id);
        localStorage.setItem('marriageApplicationId', response.id);
        
        console.log("NEW Marriage Certificate Application ID set:", response.id);
      }
      
      return response;
    } catch (error) {
      console.error("Failed to create Marriage Certificate application:", error);
      showNotification(`Failed to create application: ${error.message}`, "error");
      return null;
    }
  };

  // Helper function to get applicant name from form data
  const getApplicantName = (data) => {
    const husbandName = data.husbandFirstName && data.husbandLastName ? 
      `${data.husbandFirstName} ${data.husbandLastName}` : 
      'Groom';
    
    const wifeName = data.wifeFirstName && data.wifeLastName ? 
      `${data.wifeFirstName} ${data.wifeLastName}` : 
      'Bride';
    
    return `${husbandName} and ${wifeName}`;
  };

  useEffect(() => {
    const startNewMarriageCertificateApplication = () => {
      // Clear any existing application data that might interfere
      const keysToRemove = [
        'currentApplicationId',  // This was causing the Birth Cert ID to be reused
        'marriageApplicationId',
        'currentEditingApplicationId'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('Cleared interfering application IDs');
    };

    const loadApplicationData = async () => {
      try {
        // Check if we're editing an existing application
        const isEditing = localStorage.getItem('isEditingMarriageForm') === 'true';
        const editingId = localStorage.getItem('currentEditingApplicationId');
        
        if (isEditing && editingId) {
          console.log('Loading existing application for editing:', editingId);
          setApplicationId(editingId);
          localStorage.setItem('currentApplicationId', editingId);
          
          // Try to load from backend
          try {
            const backendApp = await documentApplicationService.getApplication(editingId);
            if (backendApp && backendApp.applicationType === 'Marriage Certificate') {
              setBackendApplicationCreated(true);
              console.log("Found existing Marriage Certificate application:", backendApp);
              
              if (backendApp.formData) {
                setFormData(backendApp.formData);
                localStorage.setItem('marriageFormData', JSON.stringify(backendApp.formData));
              }
            }
          } catch (error) {
            console.warn("Could not load existing application:", error);
          }
        } else {
          // Starting fresh - clear any old data
          startNewMarriageCertificateApplication();
          
          // Load form data from localStorage
          const storedFormData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');
          if (Object.keys(storedFormData).length > 0) {
            console.log('Loaded marriage form data:', storedFormData);
            setFormData(storedFormData);
            
            // Create a new Marriage Certificate application
            await createBackendApplication(storedFormData);
          }
        }
      } catch (error) {
        console.error('Error loading application data:', error);
        showNotification('Error loading application data', 'error');
      }
    };

    loadApplicationData();
  }, []);

  // Show snackbar notification
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Convert data URL to File object for upload
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

  const handleFileUpload = async (label, isUploaded, fileDataObj) => {
    // Create application if needed before uploading files
    if (!backendApplicationCreated && isUploaded) {
      setIsLoading(true);
      const createdApp = await createBackendApplication();
      setIsLoading(false);
      
      if (!createdApp) {
        showNotification("Failed to create application. Cannot upload files.", "error");
        return;
      }
    }
    
    setUploadedFiles(prevState => ({
      ...prevState,
      [label]: isUploaded,
    }));

    if (isUploaded && fileDataObj) {
      // Save file data to state for reference
      setFileData(prevState => ({
        ...prevState,
        [label]: fileDataObj,
      }));

      // Upload file to backend
      try {
        const currentAppId = applicationId || localStorage.getItem('currentApplicationId');
        if (!currentAppId) {
          showNotification("Application ID is missing. Cannot upload file.", "error");
          return;
        }
        
        console.log("Application ID:", currentAppId);
        console.log("Uploading file:", fileDataObj.name);
        
        setIsLoading(true);
        const file = dataURLtoFile(fileDataObj.data, fileDataObj.name, fileDataObj.type);
        
        // Upload to backend API
        const response = await documentApplicationService.uploadFile(currentAppId, file, label);
        console.log("Upload response:", response);
        setIsLoading(false);
        
        showNotification(`"${label}" uploaded successfully!`, "success");
        
      } catch (error) {
        console.error(`Failed to upload "${label}":`, error);
        setIsLoading(false);
        
        // Show detailed error information
        if (error.response) {
          console.error("Server response:", error.response.status, error.response.data);
          
          // If error is 404 (application not found), try to create it and retry upload
          if (error.response.status === 404) {
            showNotification("Application not found. Creating new application...", "info");
            const createdApp = await createBackendApplication();
            if (createdApp) {
              // Retry upload
              try {
                setIsLoading(true);
                const file = dataURLtoFile(fileDataObj.data, fileDataObj.name, fileDataObj.type);
                const retryResponse = await documentApplicationService.uploadFile(
                  createdApp.id, 
                  file, 
                  label
                );
                console.log("Retry upload response:", retryResponse);
                setIsLoading(false);
                showNotification(`"${label}" uploaded successfully!`, "success");
                return;
              } catch (retryError) {
                console.error("Retry upload failed:", retryError);
                setIsLoading(false);
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
      // Remove file data if upload is canceled
      setFileData(prevState => {
        const newState = { ...prevState };
        delete newState[label];
        return newState;
      });
    }
  };

  const isFormComplete = requiredDocuments.every(doc => uploadedFiles[doc]);

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
    if (!isFormComplete) {
      showNotification('Please upload all required documents before submitting.', 'warning');
      return;
    }
    
    try {
      setIsLoading(true);
      setIsSubmitted(true);
      
      // Get the effective application ID
      const effectiveAppId = applicationId || 
                            localStorage.getItem('marriageApplicationId') || 
                            localStorage.getItem('currentApplicationId');
      
      if (!effectiveAppId) {
        console.error('No application ID found');
        showNotification('Error submitting application: No application ID found.', 'error');
        setIsLoading(false);
        setIsSubmitted(false);
        navigate('/MarriageDashboard');
        return;
      }

      // Make sure we update the backend with ALL form data
      const storedFormData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');
      
      // Combine with uploaded files information
      const completeFormData = {
        ...storedFormData,
        documents: Object.keys(uploadedFiles).filter(key => uploadedFiles[key]),
        submissionDate: new Date().toISOString(),
        lastStep: 'MarriageCertificateApplication'
      };
      
      // Save the complete data back to localStorage
      localStorage.setItem('marriageFormData', JSON.stringify(completeFormData));
      
      try {
        // Update application in backend with complete data
        await documentApplicationService.updateApplication(effectiveAppId, {
          status: 'Pending',
          statusMessage: 'Marriage certificate application submitted with all required documents',
          formData: completeFormData
        });
        
        console.log('Application updated in backend with complete data');
      } catch (updateError) {
        console.warn('Could not update application in backend:', updateError);
        // Continue anyway since files were uploaded
      }
      
      // Store only the minimal required data in localStorage
      localStorage.setItem('currentApplicationId', effectiveAppId);
      localStorage.setItem('marriageApplicationId', effectiveAppId);
      
      showNotification('Application submitted successfully!', 'success');

      // Navigate to summary page after a short delay
      setTimeout(() => {
        navigate('/MarriageSummaryForm', {
          state: {
            applicationId: effectiveAppId,
            formData: completeFormData
          }
        });
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
  
  const handleBack = () => {
    navigate('/MarriageCertificateForm');
  };

  // When navigating between form steps
  const navigateToNextStep = (nextStep, currentFormData) => {
    // Combine with any existing data
    const existingData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');
    const mergedData = {
      ...existingData,
      ...currentFormData,
      lastStep: 'CurrentStepName'  // Add metadata about the form flow
    };
    
    // Save to localStorage
    localStorage.setItem('marriageFormData', JSON.stringify(mergedData));
    
    // Get the application ID
    const appId = localStorage.getItem('marriageApplicationId') || 
                 localStorage.getItem('currentApplicationId');
    
    if (appId) {
      // Update the application in backend if possible
      documentApplicationService.updateApplication(appId, {
        formData: mergedData
      }).catch(error => console.warn('Could not update application:', error));
    }
    
    // Navigate to next step
    navigate(nextStep, {
      state: {
        applicationId: appId,
        formData: mergedData
      }
    });
  };

  return (
    <div className={`MarriageCertificateContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleMarriageCertificate">
        MARRIAGE CERTIFICATE APPLICATION
      </Typography>
      <Typography className="SubtitleMarriageCertificate">
        Request for Marriage Certificate
      </Typography>

      {applicationId && (
        <Typography variant="body2" className="ApplicationIdMarriageCertificate">
          Application ID: {applicationId}
        </Typography>
      )}

      <Box className="DocumentsSectionMarriageCertificate">
        <Typography variant="body1" className="SectionTitleMarriageCertificate">
          Required Documents:
        </Typography>
        
        {requiredDocuments.map((doc, index) => (
          <FileUpload 
            key={index} 
            label={doc} 
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload(doc, isUploaded, fileDataObj)
            }
            required={true}
            disabled={isLoading}
          />
        ))}
      </Box>

      {isSubmitted && (
        <Alert severity="success" sx={{ marginTop: '20px' }}>
          Your application has been submitted successfully! Redirecting...
        </Alert>
      )}

      <div className="ButtonContainerMarriageCertificate">
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: '20px', marginRight: '10px' }}
          onClick={handleBack}
          disabled={isLoading}
          className="BackButtonMarriageCertificate"
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          disabled={!isFormComplete || isLoading || isSubmitted}
          sx={{ marginTop: '20px', minWidth: '120px' }}
          onClick={handleSubmit}
          className="SubmitButtonMarriageCertificate"
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
      </div>

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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MarriageCertificateApplication;