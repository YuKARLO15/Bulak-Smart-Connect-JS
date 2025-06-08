import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Checkbox, FormControlLabel, Grid, Typography, Alert, Paper, Snackbar, CircularProgress } from '@mui/material';
import FileUpload from '../FileUpload';
import './CorrectionChildSex.css';
import NavBar from '../../../NavigationComponents/NavSide';
import { documentApplicationService } from '../../../services/documentApplicationService';
import { localStorageManager } from '../../../services/localStorageManager';

const mandatoryDocuments = [
  'NBI Clearance',
  'PNP Clearance',
  'Employer Clearance (no pending case) OR business records or affidavid of unempployment with no pending case',
  'Earliest church record/s or certificate of no church record/s available and affidavit of no church record/s available',
  'Eariest school record (form 137A) OR certificate of no school record/s available AND affidavid of no school record available',
  'Medical record/s OR affidavit of no medical record/s available',
];

const supportingDocuments = [
  'Other school records-transcript, dimploma, certificates',
  'Birth and/or Church Certificates of Child/Children',
  'Voters Record',
  'Employment Records',
  'Identification Cards - National ID, Drivers License, Seniors ID, etc.',
  'Others - Passport, Insurance Documents, Members Data Record',
];

const addiotionalDocuments = [
  'Certification from Dr. Reginell Nuñez or Dr. Jeanette Dela Cruz-that the document owner is MALE or FEMALE and has not underwent sex transplant ',
];

const SexDobCorrection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    Sex: false,
    BirthDay: false,
    BirthMonth: false,
  });
  const [isMarried, setIsMarried] = useState(false);
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
        applicationSubtype: 'Correction - Sex/Date of Birth',
        applicantName: `${formData.firstName || ''} ${formData.lastName || ''}`,
        applicantDetails: JSON.stringify({
          ...formData, 
          correctionOptions: selectedOptions,
          isMarried: isMarried
        }),
        formData: {
          ...formData, 
          correctionOptions: selectedOptions,
          isMarried: isMarried
        },
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
            if (applicationToEdit.formData) {
              if (applicationToEdit.formData.correctionOptions) {
                setSelectedOptions(applicationToEdit.formData.correctionOptions);
              }
              if (applicationToEdit.formData.isMarried !== undefined) {
                setIsMarried(applicationToEdit.formData.isMarried);
              }
              setFormData(applicationToEdit.formData);
            }
            if (applicationToEdit.uploadedFiles) {
              setUploadedFiles(applicationToEdit.uploadedFiles || {});
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
              if (parsedData.isMarried !== undefined) {
                setIsMarried(parsedData.isMarried);
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
            if (parsedData.isMarried !== undefined) {
              setIsMarried(parsedData.isMarried);
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
        console.log("Uploading file:", fileDataObj.name);
        
        const file = dataURLtoFile(fileDataObj.data, fileDataObj.name, fileDataObj.type);
        
        // Log the URL that will be called
        const uploadUrl = `/document-applications/${currentAppId}/files`;
        console.log("Uploading to URL:", uploadUrl);
        
        const response = await documentApplicationService.uploadFile(currentAppId, file, label);
        console.log("Upload response:", response);
        
        showNotification(`"${label}" uploaded successfully!`, "success");
        
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
              // Retry upload
              try {
                const retryResponse = await documentApplicationService.uploadFile(
                  createdApp.id, 
                  dataURLtoFile(fileDataObj.data, fileDataObj.name, fileDataObj.type), 
                  label
                );
                console.log("Retry upload response:", retryResponse);
                showNotification(`"${label}" uploaded successfully!`, "success");
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

  const isMandatoryComplete = () => {
    // Check all mandatory documents
    const allMandatoryDocsUploaded = mandatoryDocuments.every(doc => {
      const isUploaded = uploadedFiles[doc] === true;
      if (!isUploaded) {
        console.log(`Missing document: ${doc}`);
      }
      return isUploaded;
    });

    // Check if Marriage Certificate is uploaded if isMarried is true
    const isMarriageCertComplete = !isMarried || uploadedFiles['Marriage Certificate'] === true;
    
    if (isMarried && !isMarriageCertComplete) {
      console.log("Missing Marriage Certificate");
    }

    // Check if any options are selected
    const isAnyOptionSelected = Object.values(selectedOptions).some(val => val);
    if (!isAnyOptionSelected) {
      console.log("No correction options selected");
    }

    // For debugging:
    if (allMandatoryDocsUploaded && isMarriageCertComplete && isAnyOptionSelected) {
      console.log("All documents uploaded and at least one option selected. Button should be enabled.");
      return true;
    } else {
      console.log("Missing documents or no options selected. Button should be disabled.");
      return false;
    }
  };
  
  // Force enable submit button if at least one document is uploaded and one option is selected
  const isAnyOptionSelected = Object.values(selectedOptions).some(val => val);
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
        applicationSubtype: 'Correction - Sex/Date of Birth',
        correctionOptions: selectedOptions,
        isMarried: isMarried
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
        isMarried: isMarried,
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
          isMarried: isMarried,
          status: 'Pending',
          lastUpdated: new Date().toISOString()
        };
      } else {
        // If not found, add as new application
        applications.push({
          id: currentAppId,
          type: 'Birth Certificate',
          applicationType: 'Correction',  
          applicationSubtype: 'Correction - Sex/Date of Birth',
          date: new Date().toLocaleDateString(),
          status: 'Pending',
          message: `Birth Certificate application for ${formData.firstName || ''} ${formData.lastName || ''}`,
          formData: updatedFormData,
          uploadedFiles: fileData,
          correctionOptions: selectedOptions,
          isMarried: isMarried,
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
          subtype: 'Correction - Sex/Date of Birth'
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
    <div className={`CorrectionContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleCorrection">
        BIRTH CERTIFICATE APPLICATION
      </Typography>
      <Typography className="SubTitleCorrection">
        Application for Correction of Child's Sex / Date of Birth-Day & Month
      </Typography>

      {isInitializing ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} className="DocumentsPaperCorrection">
          {isLoading && !backendApplicationCreated && (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Creating application record... Please wait.
              </Typography>
            </Box>
          )}

          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="body1">Select the correction:</Typography>
            <Grid container spacing={2}>
              {Object.keys(selectedOptions).map(option => (
                <Grid item xs="auto" key={option} className="CorrectionCB">
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

          <Box>
            <Typography variant="body1" className="SectionTitleDOBCorrection">
              Mandatory Documents:
            </Typography>
            {mandatoryDocuments.map((doc, index) => (
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

          <Box>
            <Typography variant="body1" className="SectionTitleDOBCorrection">
              Supporting Documents:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={isMarried} 
                  onChange={e => {
                    setIsMarried(e.target.checked);
                    setFormData(prev => ({
                      ...prev,
                      isMarried: e.target.checked
                    }));
                  }}
                  disabled={isLoading}
                />
              }
              label="Married"
              className="MarriedCheckbox"
            />
            {isMarried && (
              <FileUpload 
                label="Marriage Certificate" 
                onUpload={(isUploaded, fileDataObj) => 
                  handleFileUpload("Marriage Certificate", isUploaded, fileDataObj)
                }
                required={true}
                disabled={isLoading}
              />
            )}
            {supportingDocuments.map((doc, index) => (
              <FileUpload 
                key={index} 
                label={doc} 
                onUpload={(isUploaded, fileDataObj) => 
                  handleFileUpload(doc, isUploaded, fileDataObj)
                }
                disabled={isLoading}
              />
            ))}
          </Box>

          <Box>
            <Typography variant="body1" className="SectionTitleCorrection">
              Additional Requirements For Document Correction Of Sex:
            </Typography>
            {addiotionalDocuments.map((doc, index) => (
              <FileUpload 
                key={index} 
                label={doc} 
                onUpload={(isUploaded, fileDataObj) => 
                  handleFileUpload(doc, isUploaded, fileDataObj)
                } 
                required={selectedOptions.Sex}
                disabled={isLoading}
              />
            ))}
          </Box>

          <Box className="ImportantNotesCorection">
            <Typography variant="h6" className="ImportantNote">
              IMPORTANT NOTES:
            </Typography>
            <Typography variant="body2">PAYMENT:</Typography>
            <Typography variant="body2">1. Filing Fee - PHP 300.00</Typography>
            <Typography variant="body2">
              2. Newspaper Publication - PHP 3,500.00 (or newspaper of your choice)
            </Typography>
            <Typography variant="body2">
              3. Other Fees - PHP 500.00 (notarized, new PSA corrected copy)
            </Typography>
            <Typography variant="body2">PROCESSING DURATION: 4-6 months</Typography>
            <Typography variant="body2">INQUIRY: 0936-541-0787 / slbncr@yahoo.com</Typography>
          </Box>

          {isSubmitted && (
            <Alert severity="success" sx={{ marginTop: '20px' }}>
              Your application has been submitted successfully! Redirecting...
            </Alert>
          )}

          <Box className="ButtonContainerCorrection">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(-1)}
              className="BackButtonCorrection"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!forceEnableSubmit || isLoading || isSubmitted}
              onClick={handleSubmit}
              className="SubmitButtonCorrection"
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

export default SexDobCorrection;