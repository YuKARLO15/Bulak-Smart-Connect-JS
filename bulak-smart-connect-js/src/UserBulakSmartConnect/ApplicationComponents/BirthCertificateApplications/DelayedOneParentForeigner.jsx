import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert, Snackbar, CircularProgress, Paper } from '@mui/material';
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import './DelayedOneParentForeigner.css';
import { documentApplicationService } from '../../../services/documentApplicationService';

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

// Utility: data URL to File
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

  const navigate = useNavigate();

  // Snackbar
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  // Create application in backend (copied logic from Below18)
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

  // Ensure backend application exists before file uploads
  useEffect(() => {
    (async () => {
      setIsInitializing(true);
      if (!backendApplicationCreated) {
        await createBackendApplication();
      }
      setIsInitializing(false);
    })();
    // eslint-disable-next-line
  }, []);

  // Update uploaded documents count when uploadedFiles changes
  useEffect(() => {
    const count = Object.values(uploadedFiles).filter(Boolean).length;
    setUploadedDocumentsCount(count);
  }, [uploadedFiles]);

  // Handler for file uploads (same pattern as Below18)
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

  // FileUpload expects: onUpload(label, isUploaded, fileDataObj)
  const fileUploadWrapper = label => (isUploaded, fileDataObj) =>
    handleFileUpload(label, isUploaded, fileDataObj);

  // Validation
  const isMandatoryComplete = () => {
    // Only required docs for now; you can enhance this logic as Below18 if needed
    return requiredDocuments.every(doc => uploadedFiles[doc] === true);
  };

  // Submit handler (like Below18, but simpler: you can expand as needed)
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
      // Update backend application status
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

      <Typography variant="body1" className="SectionTitleDelayedOneParentForeigner">
        Mandatory Requirements:
      </Typography>
      {isInitializing ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} className="DocumentsPaperDelayedOneParentForeigner">
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
              variant="contained"
              color="primary"
              disabled={!isMandatoryComplete() || isLoading || isSubmitted}
              sx={{ marginTop: '20px' }}
              onClick={handleSubmit}
              className="ButtonApplication"
            >
              {isLoading ? "Submitting..." : "Submit"}
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DelayedOneParentForeignerRegistration;