import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert, Snackbar, CircularProgress, Paper } from '@mui/material';
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import './DelayedOneParentForeigner.css';
import { documentApplicationService } from '../../../services/documentApplicationService';
import { useLocation } from 'react-router-dom';

const requiredDocuments = [
  'Negative Certification from PSA',
  'Affidavit of two (2) disinterested persons (with ID) / Affidavit of Out of Town Registration',
  'Barangay Certification issued by the Punong Barangay as proof of residency and with statement on facts of birth',
  'National ID (if not registered, register first)',
  'Unedited 2x2 front-facing photo taken within 3 months, white background:',
];

const parentDocuments = [
  'Certificate of Live Birth (COLB)',
  'Government Issued ID',
  'Marriage Certificate',
  'Certificate of Death (if deceased)',
];

const documentaryEvidence = [
  'Baptismal Certificate',
  'Marriage Certificate',
  'School Records',
  'Income Tax Return',
  'PhilHealth MDR',
];

const additionalDocuments = [
  'Certificate of Marriage of Parents (Marital Child)',
  'Birth Certificate of Parent/s',
  'Valid Passport or BI Clearance or ACR I-CARD of the Foreign Parent',
];

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

  const navigate = useNavigate();

  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  useEffect(() => {
    const initializeFormData = () => {
      let initialFormData = {};
      
      if (location.state?.formData) {
        initialFormData = location.state.formData;
        console.log('Loaded form data from location state:', initialFormData);
      } else {
        const savedApplication = localStorage.getItem('birthCertificateApplication');
        if (savedApplication) {
          try {
            initialFormData = JSON.parse(savedApplication);
            console.log('Loaded form data from localStorage:', initialFormData);
          } catch (error) {
            console.error('Error parsing saved application:', error);
          }
        }
      }
      
      setFormData(initialFormData);
      
      if (location.state?.applicationId) {
        setApplicationId(location.state.applicationId);
      }
    };
    
    initializeFormData();
  }, [location]);

  const createBackendApplication = async () => {
    try {
      let appId = applicationId;
      if (!appId) {
        appId = 'BC-' + Date.now().toString().slice(-6);
        setApplicationId(appId);
      }
      const backendApplicationData = {
        applicationType: 'Birth Certificate',
        applicationSubtype: 'Delayed Registration - One Parent Foreigner',
        applicantName: `${formData.firstName || ''} ${formData.lastName || ''}`,
        applicantDetails: JSON.stringify({ ...formData }),
        formData: formData,
        status: 'PENDING'
      };
      const response = await documentApplicationService.createApplication(backendApplicationData);
      if (response && response.id) {
        setApplicationId(response.id);
        setBackendApplicationCreated(true);
      }
      return response;
    } catch (error) {
      console.error("Failed to create application in backend:", error);
      showNotification(`Failed to register application: ${error?.response?.data?.message || error.message}. Please try again.`, "error");
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      setIsInitializing(true);
      
      const savedState = localStorage.getItem('delayedOneParentForeignerState');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          setUploadedFiles(parsedState.uploadedFiles || {});
          setFileData(parsedState.fileData || {});
          if (parsedState.applicationId) {
            setApplicationId(parsedState.applicationId);
            setBackendApplicationCreated(true);
          }
          console.log('Restored previous state:', parsedState);
        } catch (error) {
          console.error('Error restoring previous state:', error);
        }
      }
      
      if (!backendApplicationCreated && Object.keys(formData).length > 0) {
        await createBackendApplication();
      }
      setIsInitializing(false);
    })();
  }, [formData]);

  useEffect(() => {
    const count = Object.values(uploadedFiles).filter(Boolean).length;
    setUploadedDocumentsCount(count);
  }, [uploadedFiles]);

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
    setUploadedFiles(prevState => ({ ...prevState, [label]: isUploaded }));
    if (isUploaded && fileDataObj) {
      setFileData(prevState => ({ ...prevState, [label]: fileDataObj }));
      try {
        const currentAppId = applicationId;
        if (!currentAppId) {
          showNotification("Application ID is missing. Cannot upload file.", "error");
          return;
        }
        const file = dataURLtoFile(fileDataObj.data, fileDataObj.name, fileDataObj.type);
        await documentApplicationService.uploadFile(currentAppId, file, label);
        showNotification(`"${label}" uploaded successfully!`, "success");
      } catch (error) {
        console.error(`Failed to upload "${label}":`, error);
        showNotification(`Failed to upload "${label}": ${error?.response?.data?.message || error.message}`, "error");
        setUploadedFiles(prevState => ({ ...prevState, [label]: false }));
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
    const allRequiredDocsUploaded = requiredDocuments.every(doc => {
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setIsSubmitted(true);
      const currentAppId = applicationId;
      if (!currentAppId) {
        showNotification("Application ID is missing. Cannot proceed.", "error");
        setIsLoading(false);
        setIsSubmitted(false);
        return;
      }
      try {
        await documentApplicationService.updateApplication(currentAppId, {
          status: 'Pending',
          statusMessage: 'Application submitted with all required documents',
          applicationType: 'Birth Certificate',
          applicationSubtype: 'Delayed Registration - One Parent Foreigner',
        });
      } catch (error) {
        showNotification("Warning: Failed to update backend status. Continuing...", "warning");
      }
      showNotification('Application submitted successfully!', 'success');
      setTimeout(() => {
        navigate('/BirthApplicationSummary');
      }, 2000);
    } catch (error) {
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
          <Box>
            {requiredDocuments.map((doc, index) => (
              <FileUpload key={index} label={doc} onUpload={fileUploadWrapper(doc)} disabled={isLoading} />
            ))}
          </Box>

          <Typography variant="body1" className="SectionTitleForeigner">
            Any two (2) of the following documents of parents:
          </Typography>
          <Box>
            {[...Array(2)].map((_, index) => (
              <FileUpload
                key={index}
                label={`Parent Document ${index + 1}`}
                onUpload={fileUploadWrapper(`Parent Document ${index + 1}`)}
                disabled={isLoading}
              />
            ))}
          </Box>

          <Typography variant="body1" className="SectionTitleForeigner">
            Any two (2) of the following documentary evidence which may show the name of the child,
            date and place of birth, and name of the mother (and name of father, if the child has been acknowledged)
          </Typography>
          <Box>
            {[...Array(2)].map((_, index) => (
              <FileUpload
                key={index}
                label={`Documentary Evidence ${index + 1}`}
                onUpload={fileUploadWrapper(`Documentary Evidence ${index + 1}`)}
                disabled={isLoading}
              />
            ))}
          </Box>

          <Box>
            {additionalDocuments.map((doc, index) => (
              <FileUpload key={index} label={doc} onUpload={fileUploadWrapper(doc)} disabled={isLoading} />
            ))}
          </Box>

          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption">Form Status:</Typography>
            <Typography variant="caption" component="div">
              Documents uploaded: {uploadedDocumentsCount}
            </Typography>
            <Typography variant="caption" component="div">
              Submit button enabled: {isMandatoryComplete() ? 'YES' : 'NO'}
            </Typography>
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
    try {
      const currentState = {
        formData: formData,
        uploadedFiles: uploadedFiles,
        applicationId: applicationId,
        fileData: fileData
      };
      
      localStorage.setItem('birthCertificateApplication', JSON.stringify(formData));
      localStorage.setItem('delayedOneParentForeignerState', JSON.stringify(currentState));
      localStorage.setItem('isEditingBirthApplication', 'true');
      localStorage.setItem('editingApplicationId', applicationId);
      
      sessionStorage.setItem('selectedBirthCertificateOption', 'Foreign Parent');
      
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      const appIndex = applications.findIndex(app => app.id === applicationId);
      
      if (appIndex >= 0) {
        applications[appIndex] = {
          ...applications[appIndex],
          formData: formData,
          uploadedFiles: uploadedFiles,
          status: applications[appIndex].status || 'In Progress',
          lastModified: new Date().toISOString(),
        };
        localStorage.setItem('applications', JSON.stringify(applications));
      }

      console.log('Navigating back to BirthCertificateForm with data:', formData);
      
      navigate('/BirthCertificateForm', { 
        state: { 
          formData: formData,
          applicationId: applicationId,
          isEditing: true,
          returnFrom: 'DelayedOneParentForeigner'
        }
      });
      
    } catch (error) {
      console.error('Error saving state:', error);
      showNotification('Error saving current state. Some data may be lost.', 'warning');
      
      navigate('/BirthCertificateForm');
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