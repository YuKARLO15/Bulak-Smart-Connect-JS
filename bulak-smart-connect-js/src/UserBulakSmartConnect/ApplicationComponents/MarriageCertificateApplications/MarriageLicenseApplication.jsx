import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
  Radio,
  RadioGroup,
  FormControl,
  CircularProgress,
  Snackbar
} from '@mui/material';
import NavBar from '../../../NavigationComponents/NavSide';
import FileUpload from '../FileUpload';
import './MarriageLicenseApplication.css';
import { documentApplicationService } from '../../../services/documentApplicationService';

const mandatoryDocuments = [
  'Birth / Baptismal Certificate',
  'Seminar Certificate (CSDW)',
  'Cenomar (PSA)',
  'Official Receipt',
];

const MarriageLicenseApplication = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [foreignNational, setForeignNational] = useState(false);
  const [widowWidower, setWidowWidower] = useState(false);
  const [annulled, setAnnulled] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [fileData, setFileData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [backendApplicationCreated, setBackendApplicationCreated] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [foreignNationalType, setForeignNationalType] = useState('');
  const [widowWidowerType, setWidowWidowerType] = useState('');
  const [annulledType, setAnnulledType] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // Create application in backend
  const createBackendApplication = async (existingFormData = {}) => {
    try {
      console.log("Creating NEW Marriage License application in backend...");
      
      // Generate a unique application ID specifically for Marriage License
      const newAppId = 'ML-' + Date.now().toString().slice(-6);
      
      // Combine form data
      const combinedFormData = {
        ...existingFormData,
        ...formData
      };
      
      // Prepare data for backend - Marriage License specific
      const backendApplicationData = {
        applicationType: 'Marriage License',  // Correct type
        applicationSubtype: 'Application for Marriage License',
        applicantName: getApplicantName(combinedFormData),
        status: 'Pending',
        formData: {
          ...combinedFormData,
          applicationId: newAppId,
          certificateType: 'Marriage License',
          sessionId: Date.now().toString()
        }
      };

      console.log("Creating Marriage License application with data:", backendApplicationData);
      
      // Call API to create application
      const response = await documentApplicationService.createApplication(backendApplicationData);
      console.log("Backend created Marriage License application:", response);
      
      // Store the NEW backend ID
      if (response && response.id) {
        setApplicationId(response.id);
        setBackendApplicationCreated(true);
        
        // Store in localStorage
        localStorage.setItem('currentApplicationId', response.id);
        localStorage.setItem('marriageApplicationId', response.id);
        
        console.log("NEW Marriage License Application ID set:", response.id);
      }
      
      return response;
    } catch (error) {
      console.error("Failed to create Marriage License application:", error);
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
    const startNewMarriageLicenseApplication = () => {
      // Clear any existing application data that might interfere
      const keysToRemove = [
        'currentApplicationId',  // This was causing other IDs to be reused
        'marriageApplicationId',
        'currentEditingApplicationId'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log('Cleared interfering application IDs');
    };

    const loadApplicationData = async () => {
      try {
        // Check if we have state passed from the form
        const stateData = location.state;
        
        if (stateData && stateData.applicationId && stateData.formData) {
          console.log('Using state data from form:', stateData);
          setApplicationId(stateData.applicationId);
          setFormData(stateData.formData);
          
          // Also update localStorage for consistency
          localStorage.setItem('currentApplicationId', stateData.applicationId);
          localStorage.setItem('marriageFormData', JSON.stringify(stateData.formData));
          
          // Create backend application with the form data
          await createBackendApplication(stateData.formData);
          return;
        }
        
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
            if (backendApp && backendApp.applicationType === 'Marriage License') {
              setBackendApplicationCreated(true);
              console.log("Found existing Marriage License application:", backendApp);
              
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
          startNewMarriageLicenseApplication();
          
          // Load form data from localStorage as fallback
          const storedFormData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');
          if (Object.keys(storedFormData).length > 0) {
            console.log('Loaded marriage form data from localStorage:', storedFormData);
            setFormData(storedFormData);
            
            // Create a new Marriage License application
            await createBackendApplication(storedFormData);
          }
        }
      } catch (error) {
        console.error('Error loading application data:', error);
        showNotification('Error loading application data', 'error');
      }
    };

    loadApplicationData();
  }, [location.state]); // Add location.state as dependency

  // Show snackbar notification
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Helper function to convert data URL to File object
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

  // Update the handleFileUpload function
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
      setFileData(prevState => ({
        ...prevState,
        [label]: fileDataObj,
      }));

      // Upload to backend
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
      setFileData(prevState => {
        const newState = { ...prevState };
        delete newState[label];
        return newState;
      });
    }
  };

  const isMandatoryComplete = mandatoryDocuments.every(doc => uploadedFiles[doc]);

  const isFormComplete =
    isMandatoryComplete &&
    (!foreignNational || foreignNationalType) &&
    (!widowWidower || widowWidowerType) &&
    (!annulled || annulledType);

  const handleSubmit = async () => {
    if (!isFormComplete) {
      showNotification('Please upload all required documents and complete all selections.', 'warning');
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
      
      // Combine with uploaded files information and current form state
      const completeFormData = {
        ...storedFormData,
        foreignNational,
        foreignNationalType,
        widowWidower,
        widowWidowerType,
        annulled,
        annulledType,
        uploadedFiles,
        documents: Object.keys(uploadedFiles).filter(key => uploadedFiles[key]),
        submissionDate: new Date().toISOString(),
        lastStep: 'MarriageLicenseApplication'
      };
      
      // Save the complete data back to localStorage
      localStorage.setItem('marriageFormData', JSON.stringify(completeFormData));
      
      try {
        // Update application in backend with complete data
        await documentApplicationService.updateApplication(effectiveAppId, {
          status: 'Pending',
          statusMessage: 'Marriage license application submitted with all required documents',
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
        navigate('/MarriageLicenseSummary', {
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

  return (
    <div className={`MarriageLicenseContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleMarriageLicense">
        MARRIAGE CERTIFICATE APPLICATION
      </Typography>
      <Typography className="SubtitleMarriageLicense">Application for Marriage License</Typography>

      {applicationId && (
        <Typography variant="body2" className="ApplicationIdMarriageLicense">
          Application ID: {applicationId}
        </Typography>
      )}

      <Box className="ApplicantTypeSectionMarriageLicense">
        <FormControlLabel
          control={
            <Checkbox
              checked={foreignNational}
              onChange={() => setForeignNational(!foreignNational)}
              disabled={isLoading}
            />
          }
          label="Foreign National"
        />
        <FormControlLabel
          control={
            <Checkbox 
              checked={widowWidower} 
              onChange={() => setWidowWidower(!widowWidower)}
              disabled={isLoading}
            />
          }
          label="Widow / Widower"
        />
        <FormControlLabel
          control={
            <Checkbox 
              checked={annulled} 
              onChange={() => setAnnulled(!annulled)}
              disabled={isLoading}
            />
          }
          label="Annulled"
        />
      </Box>

      <Box className="MandatoryDocumentsMarriageLicense">
        <Typography variant="body1" className="SectionTitleMarriageLicense">
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
        {mandatoryDocuments.map((doc, index) => (
          <FileUpload 
            key={index} 
            label={doc} 
            onUpload={(isUploaded, fileDataObj) => handleFileUpload(doc, isUploaded, fileDataObj)}
            required={true}
            disabled={isLoading}
          />
        ))}
      </Box>

      {foreignNational && (
        <Box className="AdditionalDocumentsMarriageLicense">
          <Typography variant="body1" className="SectionTitleMarriageLicense">
            For Foreign Nationals:
          </Typography>
          <FormControl className="RadioGroupMarriageLicense">
            <Typography>Who is a foreign national?</Typography>
            <RadioGroup
              row
              value={foreignNationalType}
              onChange={e => setForeignNationalType(e.target.value)}
            >
              <FormControlLabel value="Groom" control={<Radio />} label="Groom" disabled={isLoading} />
              <FormControlLabel value="Bride" control={<Radio />} label="Bride" disabled={isLoading} />
            </RadioGroup>
          </FormControl>

          <FileUpload
            label="Legal Capacity from their embassy (Manila)"
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload("Legal Capacity from their embassy (Manila)", isUploaded, fileDataObj)
            }
            required={true}
            disabled={isLoading}
          />
          <FileUpload 
            label="Decree of Divorce from Court" 
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload("Decree of Divorce from Court", isUploaded, fileDataObj)
            }
            required={true}
            disabled={isLoading}
          />
        </Box>
      )}

      {widowWidower && (
        <Box className="AdditionalDocumentsMarriageLicense">
          <Typography variant="body1" className="SectionTitleMarriageLicense">
            For Widow / Widower:
          </Typography>

          <FormControl className="RadioGroupMarriageLicense">
            <Typography>Who is a widow / widower?</Typography>
            <RadioGroup
              row
              value={widowWidowerType}
              onChange={e => setWidowWidowerType(e.target.value)}
            >
              <FormControlLabel value="Groom" control={<Radio />} label="Groom" disabled={isLoading} />
              <FormControlLabel value="Bride" control={<Radio />} label="Bride" disabled={isLoading} />
            </RadioGroup>
          </FormControl>

          <FileUpload
            label="Registered Death Certificate of Previous Spouse"
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload("Registered Death Certificate of Previous Spouse", isUploaded, fileDataObj)
            }
            required={true}
            disabled={isLoading}
          />
        </Box>
      )}

      {annulled && (
        <Box className="AdditionalDocumentsMarriageLicense">
          <Typography variant="body1" className="SectionTitleMarriageLicense">
            For Annulled Applicants:
          </Typography>

          <FormControl className="RadioGroupMarriageLicense">
            <Typography>Who is annulled?</Typography>
            <RadioGroup row value={annulledType} onChange={e => setAnnulledType(e.target.value)}>
              <FormControlLabel value="Groom" control={<Radio />} label="Groom" disabled={isLoading} />
              <FormControlLabel value="Bride" control={<Radio />} label="Bride" disabled={isLoading} />
            </RadioGroup>
          </FormControl>

          <FileUpload
            label="Decree of Annulment from Court with FINALITY"
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload("Decree of Annulment from Court with FINALITY", isUploaded, fileDataObj)
            }
            required={true}
            disabled={isLoading}
          />
        </Box>
      )}

      {isSubmitted && (
        <Alert severity="success" sx={{ marginTop: '20px' }}>
          Your application has been submitted successfully! Redirecting...
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        disabled={!isFormComplete || isLoading || isSubmitted}
        sx={{ marginTop: '20px', minWidth: '120px' }}
        onClick={handleSubmit}
        className="SubmitButtonMarriageLicense"
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
      </Button>

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

export default MarriageLicenseApplication;
