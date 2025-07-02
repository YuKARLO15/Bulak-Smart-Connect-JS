import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert, Snackbar, CircularProgress, Paper, Checkbox, FormControlLabel, Tooltip } from '@mui/material';
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import './DelayedOneParentForeigner.css';
import { documentApplicationService } from '../../../services/documentApplicationService';
import { useLocation } from 'react-router-dom';
import { localStorageManager } from '../../../services/localStorageManager';

const baseRequiredDocuments = [
  'Negative Certification from PSA',
  'Affidavit of two (2) disinterested persons (with ID) / Affidavit of Out of Town Registration',
  'Barangay Certification issued by the Punong Barangay as proof of residency and with statement on facts of birth',
  'National ID , ePhil ID or PhilSys transaction slip',
  'Unedited 2x2 front-facing photo, white background',
  'Any two (2) of the following documentary evidence',
  'Any two (2) of the following documents of parents',
  'Birth Certificate of Parent/s',
  'Valid Passport or BI Clearance or ACR I-CARD of the Foreign Parent'
];
const maritalDocuments = [
  ...baseRequiredDocuments,
  'Certificate of Marriage of Parents (Marital Child)'
];

const nonMaritalDocuments = baseRequiredDocuments;

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
    >
      {children}
    </Tooltip>
  );
};

const documentDescriptions = {
  // Required Documents
  'Negative Certification from PSA': '- Certificate showing no birth record exists in PSA database',
  'Affidavit of two (2) disinterested persons (with ID) / Affidavit of Out of Town Registration': '- Sworn statements from two non-relative witnesses with valid IDs OR Out of Town Registration affidavit',
  'Barangay Certification issued by the Punong Barangay as proof of residency and with statement on facts of birth': '- Official barangay certificate confirming residency and birth facts issued by the Punong Barangay',
  'National ID , ePhil ID or PhilSys transaction slip': ' A valid National ID, ePhilID, or PhilSys transaction slip is required for this application. If you do not have any of these, please stay updated on the San Ildefonso National ID booth schedules, check other PhilSys registration centers, and secure your ID or transaction slip before proceeding.',
  'Unedited 2x2 front-facing photo, white background': '- Recent passport-style photo taken within the last 3 months with white background',

  'Any two (2) of the following documents of parents': '- Any of the following: Certificate of Live Birth (COLB), Government Issued ID, Marriage Certificate, or Certificate of Death (if deceased)',
  
  'Any two (2) of the following documentary evidence': '- which may show the name of the child, date and place of birth, and name of the mother (and name of father, if the child has been acknowledged) Any of the following: Baptismal Certificate, Marriage Certificate, School Records, Income Tax Return, or PhilHealth MDR',
  

  'Certificate of Marriage of Parents (Marital Child)': '- Official marriage certificate of applicant\'s parents (required for marital children)',
  'Birth Certificate of Parent/s': '- Birth certificate(s) of the applicant\'s parent(s)',
  'Valid Passport or BI Clearance or ACR I-CARD of the Foreign Parent': '- Valid passport, Bureau of Immigration clearance, or ACR I-CARD of the foreign parent'
};

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

const DelayedOneParentForeignerRegistration = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [fileData, setFileData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [applicationId, setApplicationId] = useState(null);
  const [backendApplicationCreated, setBackendApplicationCreated] = useState(false);
  const [uploadedDocumentsCount, setUploadedDocumentsCount] = useState(0);
  const [formData, setFormData] = useState({});
  const location = useLocation();
    const [status, setStatus] = useState('');

  const navigate = useNavigate();

  const isEditing = location.state?.isEditing || 
                    localStorage.getItem('isEditingBirthApplication') === 'true';

  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

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
        applicationSubtype: 'Delayed Registration - Foreign Parent',
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

 

    const count = Object.values(uploadedFiles).filter(Boolean).length;
    setUploadedDocumentsCount(count);
    console.log(`Uploaded documents count: ${count}`);
  }, [uploadedFiles]);

  useEffect(() => {
    
    const maritalStatus = localStorage.getItem('maritalStatus');
    if (maritalStatus) {
      setStatus(maritalStatus);
      console.log("Status loaded from localStorage:", maritalStatus);
    }
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
  const fileUploadWrapper = label => (isUploaded, fileDataObj) =>
    handleFileUpload(label, isUploaded, fileDataObj);

  const isMandatoryComplete = () => {
const currentDocuments = status === 'marital' ? maritalDocuments : nonMaritalDocuments;
  
  const allRequiredDocsUploaded = currentDocuments.every(doc => {
    const isUploaded = uploadedFiles[doc] === true;
    if (!isUploaded) {
      console.log(`Missing document: ${doc}`);
    }
    return isUploaded;
  });
  
  if (allRequiredDocsUploaded) {
    console.log("All required documents uploaded.");
  } else {
    console.log("Missing some required documents.");
  }
  
  if (uploadedDocumentsCount > 0) {
    console.log("At least one document uploaded. Enabling submit button.");
    return true;
  }
  
  return allRequiredDocsUploaded;
  };

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

      const backendData = {
        status: mapStatusForBackend('SUBMITTED'),
        statusMessage: 'Application submitted with all required documents',
        applicantName: `${formData.firstName || ''} ${formData.lastName || ''}`,
        applicationType: 'Birth Certificate',
        applicationSubtype: 'Delayed Registration - Foreign Parent',
      };
      
      try {
        const response = await documentApplicationService.updateApplication(currentAppId, backendData);
        console.log('Application status updated in backend:', response);
      } catch (error) {
        console.error('Failed to update backend status:', error);
        showNotification("Warning: Failed to update backend status. Continuing with local update.", "warning");
      }

      const updatedFormData = {
        ...formData,
        uploadedFiles: fileData,
        status: 'Pending',
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
          status: 'Pending',
          lastUpdated: new Date().toISOString()
        };
      } else {
        applications.push({
          id: currentAppId,
          type: 'Birth Certificate',
          applicationType: 'Delayed Registration',  
          applicationSubtype: 'Delayed Registration - Foreign Parent',
          date: new Date().toLocaleDateString(),
          status: 'Pending',
          message: `Birth Certificate application for ${formData.firstName || ''} ${formData.lastName || ''}`,
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
          type: 'Birth Certificate',
          subtype: 'Delayed Registration - Foreign Parent'
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

  return (
    <div className={`DelayedOneParentForeignerContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <Typography variant="h5" className="TitleDelayedOneParentForeigner">
        Delayed Registration of Birth (One Parent is a Foreigner)
      </Typography>

      {isInitializing ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
          <Paper elevation={3} className="DocumentsPaperDelayedOneParentForeigner">
              <Typography variant="body1" className="SectionTitleForeigner">
        Mandatory Requirements:
      </Typography>
              {isLoading && !backendApplicationCreated && (
                  <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Creating application record... Please wait.
                    </Typography>
                  </Box>
                )}
          <Box>
     {(status === 'marital' ? maritalDocuments : nonMaritalDocuments).map((doc, index) => (
      <div key={index} style={{ marginBottom: '16px' }}>
        <FileUpload 
          label={doc} 
          description={documentDescriptions[doc]}
          onUpload={fileUploadWrapper(doc)} 
          disabled={isLoading} 
          multiple={true}
        />
      </div>
    ))}

            </Box>
      <Box>
          
      
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
            <Alert severity="success" sx={{ marginTop: '20px' }}>
              Your application has been submitted successfully! Redirecting...
            </Alert>
          )}

            <Box className="ButtonContainerDelayedOneParentForeigner">
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
        uploadedFiles: uploadedFiles,
        fileData: fileData,
        lastModified: new Date().toISOString()
      },
      uploadedFiles: uploadedFiles,
      fileData: fileData,
      modifyMode: true,
      preserveData: true,
      backFromDelayedRegistration: true,
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
        subtype: 'Delayed Registration - Foreign Parent',
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
       
      navigate('/BirthCertificateForm', { 
        state: modifyApplicationState,
        replace: false 
      });
      
    } catch (error) {
      console.error('Error saving modify state:', error);
      showNotification('Error saving current state. Some data may be lost.', 'warning');

      navigate('/BirthCertificateForm', { 
        state: { 
          applicationId: applicationId,
          isEditing: true,
          editingApplicationId: applicationId,
          formData: formData
        } 
      });
    }
  }}
  className="BackButtonDelayedAbove18"
  disabled={isLoading}
>
  Back
</Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!isMandatoryComplete() || isLoading || isSubmitted}
              sx={{ marginTop: '20px' }}
              onClick={handleSubmit}
              className="SubmitButtonOneParentForeigner"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Paper>
      )}

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
    </div>
  );
};

export default DelayedOneParentForeignerRegistration;