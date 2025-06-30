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
  Snackbar,
  Container,
} from '@mui/material';
import NavBar from '../../../NavigationComponents/NavSide';
import FileUpload from '../FileUpload';
import './MarriageLicenseApplication.css';
import { documentApplicationService } from '../../../services/documentApplicationService';

const mandatoryDocumentsHusband = [
  'Birth / Baptismal Certificate (Husband)',
  'Cenomar (PSA) (Husband)',
];

const mandatoryDocumentsWife = [
  'Birth / Baptismal Certificate (Wife)',
  'Cenomar (PSA) (Wife)',
];

const sharedMandatoryDocuments = [
  'Seminar Certificate (CSDW)'

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

  const createBackendApplication = async (existingFormData = {}) => {
    try {
      const existingAppId = localStorage.getItem('currentApplicationId');

      if (existingAppId) {
        console.log('Using existing application ID:', existingAppId);
        setApplicationId(existingAppId);
        setBackendApplicationCreated(true);

        try {
          const combinedFormData = {
            ...existingFormData,
            ...formData,
          };

          await documentApplicationService.updateApplication(existingAppId, {
            formData: combinedFormData,
            lastUpdated: new Date().toISOString(),
          });

          console.log('Updated existing application:', existingAppId);
          return { id: existingAppId };
        } catch (updateError) {
          console.warn('Could not update existing application:', updateError);
          return { id: existingAppId };
        }
      }

      console.log('Creating NEW Marriage License application in backend...');

      const newAppId = 'ML-' + Date.now().toString().slice(-6);

      const combinedFormData = {
        ...existingFormData,
        ...formData,
      };

      const backendApplicationData = {
        applicationType: 'Marriage License',
        applicationSubtype: 'Application for Marriage License',
        applicantName: getApplicantName(combinedFormData),
        status: 'Pending',
        formData: {
          ...combinedFormData,
          applicationId: newAppId,
          certificateType: 'Marriage License',
          sessionId: Date.now().toString(),
        },
      };

      console.log('Creating Marriage License application with data:', backendApplicationData);

      const response = await documentApplicationService.createApplication(backendApplicationData);
      console.log('Backend created Marriage License application:', response);

      if (response && response.id) {
        setApplicationId(response.id);
        setBackendApplicationCreated(true);

        localStorage.setItem('currentApplicationId', response.id);
        localStorage.setItem('marriageApplicationId', response.id);

        console.log('NEW Marriage License Application ID set:', response.id);
      }

      return response;
    } catch (error) {
      console.error('Failed to create Marriage License application:', error);
      showNotification(`Failed to create application: ${error.message}`, 'error');
      return null;
    }
  };

  const getApplicantName = data => {
    const husbandName =
      data.husbandFirstName && data.husbandLastName
        ? `${data.husbandFirstName} ${data.husbandLastName}`
        : 'Groom';

    const wifeName =
      data.wifeFirstName && data.wifeLastName
        ? `${data.wifeFirstName} ${data.wifeLastName}`
        : 'Bride';

    return `${husbandName} and ${wifeName}`;
  };

  useEffect(() => {
    const loadApplicationData = async () => {
      try {
        const stateData = location.state;

        if (stateData && stateData.applicationId && stateData.formData) {
          console.log('Using state data from form:', stateData);
          setApplicationId(stateData.applicationId);
          setFormData(stateData.formData);

          localStorage.setItem('currentApplicationId', stateData.applicationId);
          localStorage.setItem('marriageFormData', JSON.stringify(stateData.formData));

          setBackendApplicationCreated(true);
          return;
        }

        const existingAppId = localStorage.getItem('currentApplicationId');
        console.log('Checking for existing application ID:', existingAppId);

        if (existingAppId) {
          console.log('Using existing application ID:', existingAppId);
          setApplicationId(existingAppId);

          try {
            const backendApp = await documentApplicationService.getApplication(existingAppId);
            if (backendApp) {
              setBackendApplicationCreated(true);
              console.log('Found existing Marriage License application:', backendApp);

              if (backendApp.formData) {
                setFormData(backendApp.formData);
              }
            }
          } catch (error) {
            console.warn('Could not load existing application:', error);
            setBackendApplicationCreated(true);
          }
        } else {
          const isEditing = localStorage.getItem('isEditingMarriageForm') === 'true';
          const editingId = localStorage.getItem('currentEditingApplicationId');

          if (isEditing && editingId) {
            console.log('Loading existing application for editing:', editingId);
            setApplicationId(editingId);
            localStorage.setItem('currentApplicationId', editingId);
            setBackendApplicationCreated(true);

            try {
              const backendApp = await documentApplicationService.getApplication(editingId);
              if (backendApp && backendApp.applicationType === 'Marriage License') {
                console.log('Found existing Marriage License application for editing:', backendApp);

                if (backendApp.formData) {
                  setFormData(backendApp.formData);
                }
              }
            } catch (error) {
              console.warn('Could not load existing application:', error);
            }
          } else {
            const storedFormData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');
            if (Object.keys(storedFormData).length > 0) {
              console.log('Loaded marriage form data:', storedFormData);
              setFormData(storedFormData);

              await createBackendApplication(storedFormData);
            } else {
              console.warn('No form data found. Redirecting to form page.');
              navigate('/MarriageCertificateForm');
            }
          }
        }
      } catch (error) {
        console.error('Error loading application data:', error);
        showNotification('Error loading application data', 'error');
      }
    };

    loadApplicationData();
  }, [location.state, navigate]);

  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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

  const handleFileUpload = async (label, isUploaded, fileDataObj) => {
    const currentAppId = applicationId || localStorage.getItem('currentApplicationId');

    if (!backendApplicationCreated && !currentAppId && isUploaded) {
      setIsLoading(true);
      const createdApp = await createBackendApplication();
      setIsLoading(false);

      if (!createdApp) {
        showNotification('Failed to create application. Cannot upload files.', 'error');
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
        const effectiveAppId = applicationId || localStorage.getItem('currentApplicationId');

        if (!effectiveAppId) {
          showNotification('Application ID is missing. Cannot upload file.', 'error');
          return;
        }

        console.log('Uploading file to application ID:', effectiveAppId);
        console.log('Uploading file:', fileDataObj.name);

        setIsLoading(true);
        const file = dataURLtoFile(fileDataObj.data, fileDataObj.name, fileDataObj.type);

        const response = await documentApplicationService.uploadFile(effectiveAppId, file, label);
        console.log('Upload response:', response);
        setIsLoading(false);

        showNotification(`"${label}" uploaded successfully!`, 'success');
      } catch (error) {
        console.error(`Failed to upload "${label}":`, error);
        setIsLoading(false);

        if (error.response) {
          console.error('Server response:', error.response.status, error.response.data);
          showNotification(
            `Failed to upload "${label}": ${error.response.data?.message || error.message}`,
            'error'
          );
        } else {
          showNotification(`Failed to upload "${label}": ${error.message}`, 'error');
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

const isMandatoryComplete = [
  ...mandatoryDocumentsHusband,
  ...mandatoryDocumentsWife,
  ...sharedMandatoryDocuments,
  ].every(doc => uploadedFiles[doc]);
  
  const isFormComplete =
    isMandatoryComplete &&
    (!foreignNational || foreignNationalType) &&
    (!widowWidower || widowWidowerType) &&
    (!annulled || annulledType);

  const handleSubmit = async () => {
    if (!isFormComplete) {
      showNotification(
        'Please upload all required documents and complete all selections.',
        'warning'
      );
      return;
    }

    try {
      setIsLoading(true);
      setIsSubmitted(true);

      // Get the effective application ID
      const effectiveAppId =
        applicationId ||
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
        lastStep: 'MarriageLicenseApplication',
      };

      // Save the complete data back to localStorage
      localStorage.setItem('marriageFormData', JSON.stringify(completeFormData));

      try {
        await documentApplicationService.updateApplication(effectiveAppId, {
          status: 'Pending',
          statusMessage: 'Marriage license application submitted with all required documents',
          formData: completeFormData,
        });

        console.log('Application updated in backend with complete data');
      } catch (updateError) {
        console.warn('Could not update application in backend:', updateError);
      }

      localStorage.setItem('currentApplicationId', effectiveAppId);
      localStorage.setItem('marriageApplicationId', effectiveAppId);

      showNotification('Application submitted successfully!', 'success');

      setTimeout(() => {
        navigate('/MarriageLicenseSummary', {
          state: {
            applicationId: effectiveAppId,
            formData: completeFormData,
          },
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      showNotification(`Error submitting application: ${error.message}`, 'error');
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
  
  {/* Husband's Documents */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#184a5b' }}>
          Husband's Documents:
  </Typography>
  {mandatoryDocumentsHusband.map((doc, index) => (
    <FileUpload
      key={`husband-${index}`}
      label={doc}
      onUpload={(isUploaded, fileDataObj) => handleFileUpload(doc, isUploaded, fileDataObj)}
      required={true}
      disabled={isLoading}
    />
  ))}

  {/* Wife's Documents */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#184a5b' }}>
          Wife's Documents:
  </Typography>
  {mandatoryDocumentsWife.map((doc, index) => (
    <FileUpload
      key={`wife-${index}`}
      label={doc}
      onUpload={(isUploaded, fileDataObj) => handleFileUpload(doc, isUploaded, fileDataObj)}
      required={true}
      disabled={isLoading}
    />
  ))}

  {/* Shared Documents */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#184a5b' }}>
          Shared Documents:
  </Typography>
  {sharedMandatoryDocuments.map((doc, index) => (
    <FileUpload
      key={`shared-${index}`}
      label={doc}
      onUpload={(isUploaded, fileDataObj) => handleFileUpload(doc, isUploaded, fileDataObj)}
      required={true}
      disabled={isLoading}
    />
  ))}
</Box>

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
              <FormControlLabel
                value="Groom"
                control={<Radio />}
                label="Groom"
                disabled={isLoading}
              />
              <FormControlLabel
                value="Bride"
                control={<Radio />}
                label="Bride"
                disabled={isLoading}
              />
            </RadioGroup>
          </FormControl>

          <FileUpload
            label="Registered Death Certificate of Previous Spouse"
            onUpload={(isUploaded, fileDataObj) =>
              handleFileUpload(
                'Registered Death Certificate of Previous Spouse',
                isUploaded,
                fileDataObj
              )
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
              <FormControlLabel
                value="Groom"
                control={<Radio />}
                label="Groom"
                disabled={isLoading}
              />
              <FormControlLabel
                value="Bride"
                control={<Radio />}
                label="Bride"
                disabled={isLoading}
              />
            </RadioGroup>
          </FormControl>

          <FileUpload
            label="Decree of Annulment from Court with FINALITY"
            onUpload={(isUploaded, fileDataObj) =>
              handleFileUpload(
                'Decree of Annulment from Court with FINALITY',
                isUploaded,
                fileDataObj
              )
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

     <Container className="ButtonContainerMarriageLicense">
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
          foreignNational: foreignNational,
          foreignNationalType: foreignNationalType,
          widowWidower: widowWidower,
          widowWidowerType: widowWidowerType,
          annulled: annulled,
          annulledType: annulledType,
          uploadedFiles: uploadedFiles,
          fileData: fileData,
          lastModified: new Date().toISOString()
        },
        
    
        uploadedFiles: uploadedFiles,
        fileData: fileData,
        

        foreignNational: foreignNational,
        foreignNationalType: foreignNationalType,
        widowWidower: widowWidower,
        widowWidowerType: widowWidowerType,
        annulled: annulled,
        annulledType: annulledType,
        
       
        modifyMode: true,
        preserveData: true,
        backFromMarriageLicense: true,
        applicationType: 'Marriage License Application'
      };

      try {
        const originalFormData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');
        
        const updatedFormData = {
          ...originalFormData, 
          marriageLicense: {
            foreignNational: foreignNational,
            foreignNationalType: foreignNationalType,
            widowWidower: widowWidower,
            widowWidowerType: widowWidowerType,
            annulled: annulled,
            annulledType: annulledType,
            uploadedFiles: uploadedFiles,
            fileData: fileData,
            lastModified: new Date().toISOString()
          }
        };
        
        localStorage.setItem('marriageFormData', JSON.stringify(updatedFormData));
        
        localStorage.setItem('isEditingMarriageForm', 'true');
        localStorage.setItem('currentEditingApplicationId', applicationId);
        localStorage.setItem('currentApplicationId', applicationId);
        localStorage.setItem('marriageApplicationId', applicationId);
        
        localStorage.setItem('modifyingApplication', JSON.stringify({
          id: applicationId,
          type: 'Marriage License',
          subtype: 'Marriage License Application',
          foreignNational: foreignNational,
          widowWidower: widowWidower,
          annulled: annulled,
          uploadedFiles: uploadedFiles,
          timestamp: new Date().toISOString()
        }));

        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const appIndex = applications.findIndex(app => app.id === applicationId);
        
        if (appIndex >= 0) {
          applications[appIndex] = {
            ...applications[appIndex],
            formData: updatedFormData,
            marriageLicense: {
              foreignNational: foreignNational,
              foreignNationalType: foreignNationalType,
              widowWidower: widowWidower,
              widowWidowerType: widowWidowerType,
              annulled: annulled,
              annulledType: annulledType,
              uploadedFiles: uploadedFiles
            },
            status: applications[appIndex].status || 'In Progress',
            lastModified: new Date().toISOString(),
            isBeingModified: true
          };
          
          localStorage.setItem('applications', JSON.stringify(applications));
        }

        console.log('Navigating back with modify state:', modifyApplicationState);
        
        navigate('/MarriageForm', { 
          state: {
            ...modifyApplicationState,
            preserveOriginalData: true 
          },
          replace: false
        });
        
      } catch (error) {
        console.error('Error saving modify state:', error);
        showNotification('Error saving current state. Some data may be lost.', 'warning');
        
        navigate('/MarriageForm', { 
          state: { 
            applicationId: applicationId,
            isEditing: true,
            editingApplicationId: applicationId,
            formData: formData
          } 
        });
      }
    }}
    className="BackButtonMarriageLicense"
    disabled={isLoading}
  >
    Back
  </Button>

      <Button
        variant="contained"
     
        disabled={!isFormComplete || isLoading || isSubmitted}
        sx={{ marginTop: '20px', minWidth: '120px' }}
        onClick={handleSubmit}
        className="SubmitButtonMarriageLicense"
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
      </Button>
</Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MarriageLicenseApplication;
