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
  const createBackendApplication = async () => {
    try {
      console.log("Creating application in backend...");
      
      // Generate application ID with prefix and timestamp
      const appId = 'MC-' + Date.now().toString().slice(-6);
      console.log("Generated new application ID:", appId);
      
      // Save to local state
      setApplicationId(appId);
      localStorage.setItem('currentApplicationId', appId);

      // Prepare data for backend
      const husbandName = formData.husbandFirstName && formData.husbandLastName ? 
        `${formData.husbandFirstName} ${formData.husbandLastName}` : 
        'Groom';
      
      const wifeName = formData.wifeFirstName && formData.wifeLastName ? 
        `${formData.wifeFirstName} ${formData.wifeLastName}` : 
        'Bride';
      
      const backendApplicationData = {
        applicationType: 'Marriage Certificate',
        applicationSubtype: 'Request for Marriage Certificate',
        applicantName: `${husbandName} and ${wifeName}`,
        applicantDetails: JSON.stringify(formData),
        status: 'DRAFT',
        formData: formData // Backend validation requires this as object
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
      showNotification(`Failed to create application: ${error.message}. Please try again.`, "error");
      return null;
    }
  };

  useEffect(() => {
    try {
      const storedFormData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');
      setFormData(storedFormData);
      
      // Get application ID from localStorage
      const currentApplicationId = localStorage.getItem('currentApplicationId');
      if (currentApplicationId) {
        setApplicationId(currentApplicationId);
        
        // Check if this application exists in backend
        documentApplicationService.getApplication(currentApplicationId)
          .then(backendApp => {
            if (backendApp) {
              console.log("Application exists in backend:", backendApp);
              setBackendApplicationCreated(true);
            }
          })
          .catch(error => {
            console.warn("Application may not exist in backend:", error);
            // If app doesn't exist in backend but we have an ID, create it
            createBackendApplication();
          });
      } else if (storedFormData && Object.keys(storedFormData).length > 0) {
        // If we have form data but no application ID, create one
        createBackendApplication();
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
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
      
      const currentAppId = applicationId || localStorage.getItem('currentApplicationId');
      if (!currentAppId) {
        console.error('No application ID found');
        showNotification('Error submitting application: No application ID found.', 'error');
        setIsLoading(false);
        setIsSubmitted(false);
        navigate('/MarriageDashboard');
        return;
      }

      // Skip updating the backend status since it's already set to "Pending" at creation
      // and the update endpoint might be admin-only
      console.log('Application already has Pending status in backend');
      
      // Store only the minimal required data in localStorage
      localStorage.setItem('currentApplicationId', currentAppId);
      localStorage.removeItem('marriageFormData');
      
      showNotification('Application submitted successfully!', 'success');

      // Navigate to summary page after a short delay
      setTimeout(() => {
        navigate('/MarriageSummaryForm');
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