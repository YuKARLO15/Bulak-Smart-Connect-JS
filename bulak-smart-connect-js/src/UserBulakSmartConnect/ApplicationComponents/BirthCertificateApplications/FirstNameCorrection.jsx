import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  CircularProgress,
  Tooltip
} from '@mui/material';
import FileUpload from '../FileUpload';
import './FirstNameCorrection.css';
import NavBar from '../../../NavigationComponents/NavSide';
import { documentApplicationService } from '../../../services/documentApplicationService';
import { localStorageManager } from '../../../services/localStorageManager';

const mandatoryDocuments = [
  'NBI Clearance',
  'PNP Clearance',
  'Employers Clearance / Business Records / Affidavit of Unemployment',
];

const supportingDocuments = [
  'School Records',
  'Church Records',
  'Birth and/or Church Certificates of Child/Children',
  'Voters Record',
  'Employment Records',
  'Identification Cards - National ID, Driver License, Senior ID, etc.',
  'Others - Passport, Insurance Documents, Members Data Record',
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
  // Mandatory Documents
  'NBI Clearance': '- National Bureau of Investigation clearance certificate (recent)',
  'PNP Clearance': '- Philippine National Police clearance certificate (recent)',
  'Employers Clearance / Business Records / Affidavit of Unemployment': '- Employment certification, business registration documents, or notarized affidavit of unemployment',
  
  // Supporting Documents
  'School Records': '- Official school transcripts, diplomas, or enrollment records showing the correct name',
  'Church Records': '- Baptismal certificate or other church documents with the correct name',
  'Birth and/or Church Certificates of Child/Children': '- Birth certificates or baptismal certificates of your children showing your correct name',
  'Voters Record': '- Voter registration record or voter ID showing the correct name',
  'Employment Records': '- Employment certificates, payslips, or service records with the correct name',
  'Identification Cards - National ID, Driver License, Senior ID, etc.':
    ( <> - <GovernmentIdTooltip> Government-issued IDs </GovernmentIdTooltip>displaying the correct name </> ) ,
  'Others - Passport, Insurance Documents, Members Data Record': '- Philippine passport, insurance policies, or membership records with the correct name',
  
  // Conditional Document
  'Marriage Certificate': '- Official marriage certificate (required if married)'
};

const FirstNameCorrection = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isEditing = location.state?.isEditing || 
                    localStorage.getItem('isEditingBirthApplication') === 'true';


  const showNotification = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };


  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

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
        applicationSubtype: 'Correction - First Name',
        applicantName: `${formData.firstName || ''} ${formData.lastName || ''}`,
        applicantDetails: JSON.stringify({...formData, isMarried: isMarried}),
        formData: {...formData, isMarried: isMarried},
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
            if (applicationToEdit.formData && applicationToEdit.formData.isMarried) {
              setIsMarried(applicationToEdit.formData.isMarried);
            }
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
              if (parsedData.isMarried) {
                setIsMarried(parsedData.isMarried);
              }
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
            if (parsedData.isMarried) {
              setIsMarried(parsedData.isMarried);
            }
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

  const isMandatoryComplete = () => {
  
    const allMandatoryDocsUploaded = mandatoryDocuments.every(doc => {
      const isUploaded = uploadedFiles[doc] === true;
      if (!isUploaded) {
        console.log(`Missing document: ${doc}`);
      }
      return isUploaded;
    });

  
    const isMarriageCertComplete = !isMarried || uploadedFiles['Marriage Certificate'] === true;
    
    if (isMarried && !isMarriageCertComplete) {
      console.log("Missing Marriage Certificate");
    }


    if (allMandatoryDocsUploaded && isMarriageCertComplete) {
      console.log("All documents uploaded. Button should be enabled.");
      return true;
    } else {
      console.log("Missing documents. Button should be disabled.");
      return false;
    }
  };


  const forceEnableSubmit = uploadedDocumentsCount > 0;

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

  const handleSubmit = () => {
    setOpenDialog(true);
  };

  const confirmSubmit = async () => {
    setOpenDialog(false);
    
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
        applicationSubtype: 'Correction - First Name',
        isMarried: isMarried
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
        isMarried: isMarried,
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
          isMarried: isMarried,
          status: 'Pending',
          lastUpdated: new Date().toISOString()
        };
      } else {
       
        applications.push({
          id: currentAppId,
          type: 'Birth Certificate',
          applicationType: 'Correction',  
          applicationSubtype: 'Correction - First Name',
          date: new Date().toLocaleDateString(),
          status: 'Pending',
          message: `Birth Certificate application for ${formData.firstName || ''} ${formData.lastName || ''}`,
          formData: updatedFormData,
          uploadedFiles: fileData,
          isMarried: isMarried,
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
          subtype: 'Correction - First Name'
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`FirstNameContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleFirstName">
        BIRTH CERTIFICATE APPLICATION
      </Typography>
      <Typography className="SubtitleFirstName">
        Application for Correction of Child's First Name
      </Typography>

      {isInitializing ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} className="DocumentsPaperFirstName">
          {isLoading && !backendApplicationCreated && (
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Creating application record... Please wait.
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="body1" className="SectionTitleFirstName">
              Mandatory Documents:
            </Typography>
            {mandatoryDocuments.map((doc, index) => (
              <FileUpload 
                key={index} 
                label={doc} 
                description={documentDescriptions[doc]}
                onUpload={(isUploaded, fileDataObj) => 
                  handleFileUpload(doc, isUploaded, fileDataObj)
                }
                required={true}
                disabled={isLoading}
                 multiple={true}
              />
            ))}
          </Box>

          <Box>
            <Typography variant="body1" className="SectionTitleFirstName">
              Supporting Documents:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={isMarried} 
                  onChange={e => setIsMarried(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Check if document owner is Married"
              className="MarriedCheckboxFirstName"
            />
            {isMarried && (
              <FileUpload 
                  label="Marriage Certificate" 
                  
                
                onUpload={(isUploaded, fileDataObj) => 
                  handleFileUpload("Marriage Certificate", isUploaded, fileDataObj)
                }
                required={true}
                disabled={isLoading}
                multiple={true}
              />
            )}
            {supportingDocuments.map((doc, index) => (
                   <FileUpload 
                key={index} 
                label={doc} 
                description={documentDescriptions[doc]}
                onUpload={(isUploaded, fileDataObj) => 
                  handleFileUpload(doc, isUploaded, fileDataObj)
                }
                required={true}
                disabled={isLoading}
                 multiple={true}
              />
            ))}
          </Box>

          <Box className="ImportantNotes">
            <Typography variant="h6">IMPORTANT NOTES:</Typography>
            <Typography variant="body2">PAYMENT:</Typography>
            <Typography variant="body2">1. Filing Fee - PHP 300.00</Typography>
            <Typography variant="body2">
              2. Newspaper Publication - PHP 3,500.00 (newspaper of your choice)
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

          <Box className="ButtonContainerFirstName">
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
          isMarried: isMarried,
          uploadedFiles: uploadedFiles,
          fileData: fileData,
          lastModified: new Date().toISOString()
        },
        
       
        uploadedFiles: uploadedFiles,
        fileData: fileData,
        
  
        isMarried: isMarried,
        
        
        modifyMode: true,
        preserveData: true,
        backFromCorrection: true,
        correctionType: 'First Name'
      };

     
      try {

        localStorage.setItem('birthCertificateApplication', JSON.stringify(modifyApplicationState.formData));
        
       
        localStorage.setItem('isEditingBirthApplication', 'true');
        localStorage.setItem('editingApplicationId', applicationId);
        localStorage.setItem('currentApplicationId', applicationId);
        
      
        localStorage.setItem('modifyingApplication', JSON.stringify({
          id: applicationId,
          type: 'Birth Certificate - Correction',
          correctionType: 'First Name',
          isMarried: isMarried,
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
            isMarried: isMarried,
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
     e
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
    className="BackButtonFirstName"
    disabled={isLoading}
  >
    Back
  </Button>
            <Button
              variant="contained"
              // color="error"
              disabled={!forceEnableSubmit || isLoading || isSubmitted}
              onClick={handleSubmit}
              className="SubmitButtonFirstName"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </Box>
        </Paper>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        className="ApplicationDialogContainer"
      >
        <DialogTitle className="ApplicationDialogTitle">Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText className="ApplicationDialogContent">
            Are you sure all details are correct and you want to submit this application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            color="secondary"
            className="ApplicationDialogBtnC"
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={confirmSubmit}
            className="ApplicationDialogBtnS"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default FirstNameCorrection;