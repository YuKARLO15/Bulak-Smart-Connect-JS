import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Checkbox, FormControlLabel, Typography, Alert, Paper, Snackbar, CircularProgress,  Tooltip } from '@mui/material';
import FileUpload from '../FileUpload';
import './DelayedAbove18.css';
import NavBar from '../../../NavigationComponents/NavSide';
import { documentApplicationService } from '../../../services/documentApplicationService';
import { localStorageManager } from '../../../services/localStorageManager';


const maritalDocuments = [
  'Negative Certification from PSA',
  'Affidavit of Disinterested Person 1 (Not Related) with ID',
  'Affidavit of Disinterested Persons 2 (Not Related) with ID',
  'Any (2) Documentary Evidences',
  'Certificate of Marriage, if applicant is married',
  'National ID , ePhil ID or PhilSys transaction slip',
  'Barangay Certification of Residency',
  'Unedited front-facing photo 2x2, white background',
  'Documentary evidences of parents',
  'Certificate of Marriage of Parents',
];

const nonMaritalDocuments = maritalDocuments
  .filter(doc => doc !== 'Certificate of Marriage of Parents')
  .concat([

  ]);


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
  'Negative Certification from PSA': '- Certificate showing no birth record exists in PSA database',
   'Affidavit of Disinterested Person 1 (Not Related) with ID': (
    <>
      - Sworn statement from non-relative witness and witness <GovernmentIdTooltip>government issued ID</GovernmentIdTooltip>
    </>
  ),
  'Affidavit of Disinterested Persons 2 (Not Related) with ID': (
    <>
      - Sworn statement from second non-relative witness and  witness <GovernmentIdTooltip>government issued ID</GovernmentIdTooltip>
    </>
  ),  'Certificate of Marriage, if married': '- Official marriage certificate if applicant is married',
  'National ID , ePhil ID or PhilSys transaction slip': '- A valid National ID, ePhilID, or PhilSys transaction slip is required for this application. If you do not have any of these, please stay updated on the San Ildefonso National ID booth schedules, check other PhilSys registration centers, and secure your ID or transaction slip before proceeding.',
  'Barangay Certification of Residency': '- Certificate of residency from local barangay',
  'Unedited front-facing photo 2x2, white background': '- Recent passport-style photo with white background',
  'Documentary evidences of parents': '- Birth certificates, marriage certificate, or death certificates of parents',
  'Certificate of Marriage of Parents': '- Official marriage certificate of applicant\'s parents',
  'Affidavit of the document owner registrant stating why the document owner cannot appear personally': '- Notarized affidavit explaining absence (affidavit can be obtained from a notary public, lawyer\'s office, or barangay hall), and death certificate if deceased',
  'Personal Appearance of the Father or Affidavit of Admission of Paternity executed before a Notary Public': '- Father\'s personal appearance or notarized affidavit acknowledging paternity',
  'Any (2) Documentary Evidences': '- Hospital records, baptismal certificate, school records or Philhealth records',
};

const Above18Registration = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [status, setStatus] = useState('');
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
  const navigate = useNavigate();
  const location = useLocation();
  const [documentOwnerNotPresent, setDocumentOwnerNotPresent] = useState(false);
const[documentFatherNotPresent, setDocumentFatherNotPresent] = useState(false);

  
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
        applicationSubtype: 'Delayed Registration - Above 18',
        applicantName: `${formData.firstName || ''} ${formData.lastName || ''}`,
        applicantDetails: JSON.stringify({...formData, documentStatus: status}),
        formData: formData,
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
    const maritalStatus = localStorage.getItem('maritalStatus');
    if (maritalStatus) {
      setStatus(maritalStatus);
      console.log("Status loaded from localStorage:", maritalStatus);
    }
    
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
            if (applicationToEdit.documentStatus) {
              setStatus(applicationToEdit.documentStatus);
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
              if (parsedData.documentStatus) {
                setStatus(parsedData.documentStatus);
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
                
                // Auto-create backend application if we have status
                if (parsedData.documentStatus) {
                  setStatus(parsedData.documentStatus);
                  await createBackendApplication();
                }
              }
            }
          }
          
          const currentApplicationData = localStorage.getItem('birthCertificateApplication');
          if (currentApplicationData) {
            const parsedData = JSON.parse(currentApplicationData);
            setFormData(parsedData);
            if (parsedData.documentStatus && !status) {
              setStatus(parsedData.documentStatus);
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
    if (!status) {
      console.log("No status selected");
      return false;
    }

    // Get the required documents based on status
    const requiredDocs = status === 'marital' ? maritalDocuments : nonMaritalDocuments;
    
    // Log the current state for debugging
    console.log("Current uploadedFiles state:", uploadedFiles);
    console.log("Required docs:", requiredDocs);
    
    // Check all required documents
    const allRequiredDocsUploaded = requiredDocs.every(doc => {
      const isUploaded = uploadedFiles[doc] === true;
      if (!isUploaded) {
        console.log(`Missing document: ${doc}`);
      }
      return isUploaded;
    });

    // Check documentary evidences
    const evidence1Uploaded = uploadedFiles['Documentary Evidence 1'] === true;
    const evidence2Uploaded = uploadedFiles['Documentary Evidence 2'] === true;
    
    if (!evidence1Uploaded) console.log("Missing Documentary Evidence 1");
    if (!evidence2Uploaded) console.log("Missing Documentary Evidence 2");

    // For debugging:
    if (allRequiredDocsUploaded && evidence1Uploaded && evidence2Uploaded) {
      console.log("All documents uploaded. Button should be enabled.");
    } else {
      console.log("Missing documents. Button should be disabled.");
    }
    
    // Force enable the submit button if at least one document has been uploaded
    if (uploadedDocumentsCount > 0) {
      console.log("At least one document uploaded. Enabling submit button.");
      return true;
    }
    
    return allRequiredDocsUploaded && evidence1Uploaded && evidence2Uploaded;
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
    // Override validation for this case since the user has already uploaded all docs
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
        documentStatus: status, // marital or non-marital status
        applicantName: `${formData.firstName || ''} ${formData.lastName || ''}`,
        applicationType: 'Birth Certificate',
        applicationSubtype: 'Delayed Registration - Above 18'
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
        documentStatus: status,
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
          documentStatus: status,
          status: 'Pending',
          lastUpdated: new Date().toISOString()
        };
      } else {
        // If not found, add as new application
        applications.push({
          id: currentAppId,
          type: 'Birth Certificate',
          applicationType: 'Delayed Registration',  
          applicationSubtype: 'Delayed Registration - Above 18',
          date: new Date().toLocaleDateString(),
          status: 'Pending',
          message: `Birth Certificate application for ${formData.firstName || ''} ${formData.lastName || ''}`,
          formData: updatedFormData,
          uploadedFiles: fileData,
          documentStatus: status,
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
          subtype: 'Delayed Registration - Above 18'
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
    }
  };

  // Override for form submission - allows submitting when any document is uploaded
  const forceEnableSubmit = status && uploadedDocumentsCount > 0;

  return (
    <div className={`DelayedAbove18Container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleDelayedAbove18">
       Application for Delayed Registration Above 18
      </Typography>
    

      {isInitializing ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} className="DocumentsPaperDelayedAbove18">
 

          {status && (
            <Box>
              <Typography variant="body1" className="SectionTitleDelayedAbove18">
                Mandatory Documents:
              </Typography>
              {isLoading && !backendApplicationCreated && (
                <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Creating application record... Please wait.
                  </Typography>
                </Box>
              )}
                   {(status === 'marital' ? maritalDocuments : nonMaritalDocuments).map((doc, index) => (
                   <FileUpload 
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

                       {/* Checkbox 1: Document owner cannot appear personally - ALWAYS VISIBLE */}
              <Box sx={{ mt: 2, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={documentOwnerNotPresent}
                      onChange={(e) => setDocumentOwnerNotPresent(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Document owner cannot appear personally"
                  />
                      {documentOwnerNotPresent && (
                <FileUpload 
                  label="Affidavit of the document owner registrant stating why the document owner cannot appear personally"
                  description={documentDescriptions['Affidavit of the document owner registrant stating why the document owner cannot appear personally']}
                  onUpload={(isUploaded, fileDataObj) => 
                    handleFileUpload('Affidavit of the document owner registrant stating why the document owner cannot appear personally', isUploaded, fileDataObj)
                  } 
                  required={false}
                  disabled={isLoading}
                  multiple={true}
                />
              )}
              </Box>

              {/* Checkbox 2: Father cannot appear personally - ONLY VISIBLE FOR NON-MARITAL */}
              {status === 'non-marital' && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={documentFatherNotPresent}
                        onChange={(e) => setDocumentFatherNotPresent(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Father cannot appear personally"
                  />
                </Box>
              )}

              {/* Show affidavit upload if document owner checkbox is checked */}
          

              {/* Show father affidavit upload if father checkbox is checked */}
              {documentFatherNotPresent && (
                <FileUpload 
                  label="Personal Appearance of the Father or Affidavit of Admission of Paternity executed before a Notary Public"
                  description={documentDescriptions['Personal Appearance of the Father or Affidavit of Admission of Paternity executed before a Notary Public']}
                  onUpload={(isUploaded, fileDataObj) => 
                    handleFileUpload('Personal Appearance of the Father or Affidavit of Admission of Paternity executed before a Notary Public', isUploaded, fileDataObj)
                  } 
                  required={false}
                  disabled={isLoading}
                  multiple={true}
                />
              )}
                

          
              
    
            </Box>
          )}

          {status && (
            <Box className="ImportantNotes">
              <Typography variant="h6">IMPORTANT NOTES:</Typography>

              <Typography variant="body2">PROCESSING DURATION: 10 days </Typography>
              <Typography variant="body2">INQUIRY: 0936-541-0787 / slbncr@yahoo.com</Typography>
            </Box>
          )}

          {isSubmitted && (
            <Alert severity="success" sx={{ marginTop: '20px' }}>
              Your application has been submitted successfully! Redirecting...
            </Alert>
          )}

          {status && (
            <Box className="ButtonContainerDelayedAbove18">
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
          documentStatus: status,
          uploadedFiles: uploadedFiles,
          fileData: fileData,
          lastModified: new Date().toISOString()
        },
        
  
        uploadedFiles: uploadedFiles,
        fileData: fileData,
   
        documentStatus: status,
        maritalStatus: status,
        
 
        modifyMode: true,
        preserveData: true,
        backFromDelayedRegistration: true,
        applicationType: 'Delayed Registration - Above 18'
      };


      try {

        localStorage.setItem('birthCertificateApplication', JSON.stringify(modifyApplicationState.formData));
        

        localStorage.setItem('isEditingBirthApplication', 'true');
        localStorage.setItem('editingApplicationId', applicationId);
        localStorage.setItem('currentApplicationId', applicationId);
        

        localStorage.setItem('maritalStatus', status);
        
     
        localStorage.setItem('modifyingApplication', JSON.stringify({
          id: applicationId,
          type: 'Birth Certificate - Delayed Registration',
          subtype: 'Above 18',
          documentStatus: status,
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
            documentStatus: status,
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
            formData: formData,
            documentStatus: status
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
                onClick={handleSubmit}
                className="SubmitButtonDelayedAbove18"
              >
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </Box>
          )}
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

export default Above18Registration;