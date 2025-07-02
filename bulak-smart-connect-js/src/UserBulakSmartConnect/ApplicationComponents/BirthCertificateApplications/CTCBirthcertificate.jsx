import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert, Tooltip, CircularProgress, Snackbar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import './CTCBirthCertificate.css';
import { documentApplicationService } from '../../../services/documentApplicationService';
import { localStorageManager } from '../../../services/localStorageManager';

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
  'Valid ID': (<> - Any valid <GovernmentIdTooltip> government-issued identification card</GovernmentIdTooltip> </>),
  'Authorization Letter (if applicable)': '- Notarized authorization letter with the signature of the document owner, plus a copy of both the requestor\'s'
};

const CTCBirthCertificate = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formData, setFormData] = useState({});
  const [fileData, setFileData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [applicationId, setApplicationId] = useState(null);
  const [backendApplicationCreated, setBackendApplicationCreated] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const navigate = useNavigate();
  const location = useLocation();

  const isEditing = location.state?.isEditing || 
                    localStorage.getItem('isEditingBirthApplication') === 'true';

  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const isFormComplete = 
    uploadedFiles['Valid ID'] === true && 
    (formData?.purpose !== 'On behalf of someone' || 
     uploadedFiles['Authorization Letter (if applicable)'] === true);

  const createBackendApplication = async () => {
    try {
      console.log("Creating application in backend...");
      
      const currentId = localStorage.getItem('currentApplicationId');
      let appId = currentId;
      
      if (!appId) {
        appId = 'BC-' + Date.now().toString().slice(-6);
        console.log("Generated new application ID:", appId);
        localStorage.setItem('currentApplicationId', appId);
      }
      
      setApplicationId(appId);

      const backendApplicationData = {
        applicationType: 'Birth Certificate',
        applicationSubtype: 'Copy of Birth Certificate',
        applicantName: `${formData.firstName || ''} ${formData.lastName || ''}`,
        applicantDetails: JSON.stringify({ ...formData }),
        formData: formData,
        status: 'PENDING'
      };

      console.log("Creating application with data:", backendApplicationData);
      
      const response = await documentApplicationService.createApplication(backendApplicationData);
      console.log("Backend created application:", response);
      
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsInitializing(true);
        
        if (isEditing) {
          console.log("Loading data for editing...");
          const editingId = localStorage.getItem('editingApplicationId');
          console.log("Editing application ID:", editingId);
          
          if (editingId) {
            setApplicationId(editingId);
            
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
          
          const applications = JSON.parse(localStorage.getItem('applications') || '[]');
          const applicationToEdit = applications.find(app => app.id === editingId);
          
          if (applicationToEdit) {
            console.log("Found application to edit:", applicationToEdit);
            if (applicationToEdit.uploadedFiles) {
              setUploadedFiles(applicationToEdit.uploadedFiles || {});
            }
            if (applicationToEdit.formData) {
              setFormData(applicationToEdit.formData);
            }
          } else {
            const savedFormData = localStorage.getItem('birthCertificateApplication');
            if (savedFormData) {
              const parsedData = JSON.parse(savedFormData);
              setFormData(parsedData);
              if (parsedData.uploadedFiles) {
                setUploadedFiles(parsedData.uploadedFiles || {});
              }
              console.log("Loaded form data from birthCertificateApplication");
            }
          }
        } else {
          const currentId = localStorage.getItem('currentApplicationId');
          if (currentId) {
            setApplicationId(currentId);
            
            try {
              const backendApp = await documentApplicationService.getApplication(currentId);
              if (backendApp) {
                setBackendApplicationCreated(true);
                console.log("Application exists in backend:", backendApp);
              }
            } catch (error) {
              console.warn("Application may not exist in backend:", error);
              
              const currentApplicationData = localStorage.getItem('birthCertificateApplication');
              if (currentApplicationData) {
                const parsedData = JSON.parse(currentApplicationData);
                setFormData(parsedData);
                await createBackendApplication();
              }
            }
          }
          
          const currentApplicationData = localStorage.getItem('birthCertificateApplication');
          if (currentApplicationData) {
            const parsedData = JSON.parse(currentApplicationData);
            setFormData(parsedData);
            if (parsedData.uploadedFiles) {
              setUploadedFiles(parsedData.uploadedFiles || {});
            }
          }
        }
        
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
    if (!backendApplicationCreated && isUploaded) {
      setIsLoading(true);
      const createdApp = await createBackendApplication();
      setIsLoading(false);
      
      if (!createdApp) {
        showNotification("Failed to register application. Cannot upload files.", "error");
        return;
      }
    }

    setUploadedFiles(prevState => ({
      ...prevState,
      [label]: isUploaded,
    }));

    if (isUploaded && fileDataObj) {
      setFileData(prevState => ({
        ...prevState,
        [label]: fileDataObj,
      }));

      try {
        const currentAppId = applicationId || localStorage.getItem('currentApplicationId');
        if (!currentAppId) {
          showNotification("Application ID is missing. Cannot upload file.", "error");
          return;
        }
        
        console.log("Application ID:", currentAppId);
        console.log("Uploading file:", fileDataObj.name);
        
        const file = dataURLtoFile(fileDataObj.data, fileDataObj.name, fileDataObj.type);
        
        const uploadUrl = `/document-applications/${currentAppId}/files`;
        console.log("Uploading to URL:", uploadUrl);
        
        const response = await documentApplicationService.uploadFile(currentAppId, file, label);
        console.log("Upload response:", response);
        
        showNotification(`"${label}" uploaded successfully!`, "success");
        
      } catch (error) {
        console.error(`Failed to upload "${label}":`, error);
        
        if (error.response) {
          console.error("Server response:", error.response.status, error.response.data);
          
          if (error.response.status === 404) {
            showNotification("Application not found. Creating new application...", "info");
            const createdApp = await createBackendApplication();
            if (createdApp) {
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

  const handleSubmit = async () => {
    if (!isFormComplete) {
      showNotification('Please upload the required documents before submitting.', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      setIsSubmitted(true);
      
      const currentAppId = applicationId || localStorage.getItem('currentApplicationId');
      if (!currentAppId) {
        console.error("No application ID found");
        showNotification("Application ID is missing. Cannot proceed.", "error");
        setIsLoading(false);
        setIsSubmitted(false);
        return;
      }

      const usage = localStorageManager.getCurrentUsage();
      if (usage.isCritical) {
        console.warn('Storage critical, performing cleanup before save...');
        await localStorageManager.performCleanup(0.4);
      }

      try {
        await documentApplicationService.updateApplication(currentAppId, {
          status: 'SUBMITTED',
          statusMessage: 'Application submitted with all required documents'
        });
        console.log('Application status updated in backend');
      } catch (error) {
        console.error('Failed to update backend status:', error);
        showNotification("Warning: Failed to update backend status. Continuing with local update.", "warning");
      }

      const updatedFormData = {
        ...formData,
        uploadedFiles: fileData,
        status: 'Submitted',
        submittedAt: new Date().toISOString()
      };

      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const appIndex = applications.findIndex(app => app.id === currentAppId);

      if (appIndex >= 0) {
        applications[appIndex] = {
          ...applications[appIndex],
          formData: {
            ...applications[appIndex].formData,
            ...updatedFormData
          },
          uploadedFiles: fileData,
          status: 'Submitted',
          lastUpdated: new Date().toISOString()
        };
      } else {
        applications.push({
          id: currentAppId,
          type: 'Birth Certificate',
          applicationType: 'Copy Request',  
          applicationSubtype: 'Copy of Birth Certificate',
          date: new Date().toLocaleDateString(),
          status: 'Submitted',
          message: `Birth Certificate copy request for ${formData.firstName || ''} ${formData.lastName || ''}`,
          formData: updatedFormData,
          uploadedFiles: fileData,
          lastUpdated: new Date().toISOString()
        });
      }

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

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('customStorageUpdate', {
        detail: {
          id: currentAppId,
          action: 'updated',
          type: 'Birth Certificate'
        }
      }));

      console.log('Application submitted successfully');
      
      setTimeout(() => {
        navigate('/BirthApplicationSummary');
      }, 2000);

    } catch (error) {
      console.error('Error submitting application:', error);
      showNotification(`Error submitting application: ${error.message}`, "error");
      setIsLoading(false);
      setIsSubmitted(false);
    }
  };

  const handleBack = () => {
    const modifyApplicationState = {
      applicationId: applicationId,
      isEditing: true, 
      editingApplicationId: applicationId,
      formData: {
        ...formData,
        uploadedFiles: uploadedFiles,
        fileData: fileData,
        lastModified: new Date().toISOString()
      },
      uploadedFiles: uploadedFiles,
      fileData: fileData,
      modifyMode: true,
      preserveData: true,
      backFromCTCBirth: true,
      applicationType: 'Birth Certificate'
    };

    try {
      localStorage.setItem('birthCertificateApplication', JSON.stringify(modifyApplicationState.formData));
      localStorage.setItem('isEditingBirthApplication', 'true');
      localStorage.setItem('editingApplicationId', applicationId);
      localStorage.setItem('currentApplicationId', applicationId);
      
      localStorage.setItem('modifyingApplication', JSON.stringify({
        id: applicationId,
        type: 'Birth Certificate',
        subtype: 'Copy of Birth Certificate',
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
  };

  if (isInitializing) {
    return (
      <Box className={`MainContainerCTCBirth ${isSidebarOpen ? 'SidebarOpenCTCBirth' : ''}`}>
        <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box className={`MainContainerCTCBirth ${isSidebarOpen ? 'SidebarOpenCTCBirth' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    
      <Typography variant="h4" className="TitleCTCBirth">
        Upload Required Documents
      </Typography>

      <Typography variant="subtitle1" className="SubtitleCTCBirth">
        Please upload the following documents to complete your birth certificate copy request
      </Typography>

      <Paper elevation={3} className="DocumentsPaperCTCBirth">
        <Typography variant="h6" className="RequirementsHeaderCTCBirth">
          Required Documents
        </Typography>

        {isLoading && !backendApplicationCreated && (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Creating application record... Please wait.
            </Typography>
          </Box>
        )}

        <Box className="DocumentsListCTCBirth">
          <FileUpload
            label="Valid ID"
            description={documentDescriptions['Valid ID']}
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload('Valid ID', isUploaded, fileDataObj)
            }
            required={true}
            disabled={isLoading}
          />
         
          <Typography variant="h6" className="RequirementsHeaderCTCBirth">
            Additional Documents
          </Typography>

          <FileUpload
            label="Authorization Letter (if applicable)"
            description={documentDescriptions['Authorization Letter (if applicable)']}
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload('Authorization Letter (if applicable)', isUploaded, fileDataObj)
            }
            required={false}
            disabled={isLoading}
          />
        </Box>


        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Processing... Please wait.
            </Typography>
          </Box>
        )}

        {isSubmitted && (
          <Alert severity="success" className="SuccessAlertCTCBirth">
            Your application has been submitted successfully! Redirecting to summary...
          </Alert>
        )}

        <Box className="ButtonContainerCTCBirth">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBack}
            className="BackButtonCTCBirth"
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="SubmitButtonCTCBirth"
            disabled={!isFormComplete || isSubmitted || isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CTCBirthCertificate;