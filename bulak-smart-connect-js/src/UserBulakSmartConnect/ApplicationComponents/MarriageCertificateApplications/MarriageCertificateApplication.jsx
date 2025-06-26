import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert, CircularProgress, Snackbar } from '@mui/material';
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import './MarriageCertificateApplication.css';
import { documentApplicationService } from '../../../services/documentApplicationService';

const requiredDocuments = [
  'Marriage License',
  'Valid ID of Bride',
  'Valid ID of Groom',
  'Certificate of Marriage from the Officiant',
];

const dataURLtoFile = (dataurl, filename, mimeType) => {
  if (dataurl instanceof File) return dataurl;

  if (typeof dataurl === 'string' && !dataurl.startsWith('data:')) {
    console.warn('Received URL instead of dataURL, cannot convert to File');
    return null;
  }

  const arr = dataurl.split(',');
  if (arr.length < 2) {
    console.error('Invalid data URL format');
    return null;
  }

  const mime = mimeType || arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

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

      console.log('Creating NEW Marriage Certificate application in backend...');

      const newAppId = 'MC-' + Date.now().toString().slice(-6);

      const combinedFormData = {
        ...existingFormData,
        ...formData,
      };

      const backendApplicationData = {
        applicationType: 'Marriage Certificate',
        applicationSubtype: 'Request for Marriage Certificate',
        applicantName: getApplicantName(combinedFormData),
        status: 'Pending',
        formData: {
          ...combinedFormData,
          applicationId: newAppId,
          certificateType: 'Marriage Certificate',
          sessionId: Date.now().toString(),
        },
      };

      console.log('Creating Marriage Certificate application with data:', backendApplicationData);

      const response = await documentApplicationService.createApplication(backendApplicationData);
      console.log('Backend created Marriage Certificate application:', response);

      if (response && response.id) {
        setApplicationId(response.id);
        setBackendApplicationCreated(true);

        localStorage.setItem('currentApplicationId', response.id);
        localStorage.setItem('marriageApplicationId', response.id);

        console.log('NEW Marriage Certificate Application ID set:', response.id);
      }

      return response;
    } catch (error) {
      console.error('Failed to create Marriage Certificate application:', error);
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
        const existingAppId = localStorage.getItem('currentApplicationId');
        console.log('Checking for existing application ID:', existingAppId);

        if (existingAppId) {
          console.log('Using existing application ID:', existingAppId);
          setApplicationId(existingAppId);

          try {
            const backendApp = await documentApplicationService.getApplication(existingAppId);
            if (backendApp) {
              setBackendApplicationCreated(true);
              console.log('Found existing Marriage Certificate application:', backendApp);

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
              if (backendApp && backendApp.applicationType === 'Marriage Certificate') {
                console.log(
                  'Found existing Marriage Certificate application for editing:',
                  backendApp
                );

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
  }, [navigate]);

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
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showNotification = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const isFormComplete = requiredDocuments.every(doc => uploadedFiles[doc]);

  const mapStatusForBackend = frontendStatus => {
    const statusMap = {
      Submitted: 'Pending',
      SUBMITTED: 'Pending',
      Pending: 'Pending',
      Approved: 'Approved',
      Rejected: 'Rejected',
      Declined: 'Rejected',
      'Ready for Pickup': 'Ready for Pickup',
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

      const storedFormData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');

      const completeFormData = {
        ...storedFormData,
        documents: Object.keys(uploadedFiles).filter(key => uploadedFiles[key]),
        submissionDate: new Date().toISOString(),
        lastStep: 'MarriageCertificateApplication',
      };

      localStorage.setItem('marriageFormData', JSON.stringify(completeFormData));

      try {
        await documentApplicationService.updateApplication(effectiveAppId, {
          status: 'Pending',
          statusMessage: 'Marriage certificate application submitted with all required documents',
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
        navigate('/MarriageSummaryForm', {
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

  const handleBack = () => {
    navigate('/MarriageCertificateForm');
  };

  const navigateToNextStep = (nextStep, currentFormData) => {
    const existingData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');
    const mergedData = {
      ...existingData,
      ...currentFormData,
      lastStep: 'CurrentStepName',
    };

    localStorage.setItem('marriageFormData', JSON.stringify(mergedData));

    const appId =
      localStorage.getItem('marriageApplicationId') || localStorage.getItem('currentApplicationId');

    if (appId) {
      documentApplicationService
        .updateApplication(appId, {
          formData: mergedData,
        })
        .catch(error => console.warn('Could not update application:', error));
    }

    navigate(nextStep, {
      state: {
        applicationId: appId,
        formData: mergedData,
      },
    });
  };

  return (
    <div className={`MarriageCertificateContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleMarriageCertificate">
        MARRIAGE CERTIFICATE APPLICATION
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
            onUpload={(isUploaded, fileDataObj) => handleFileUpload(doc, isUploaded, fileDataObj)}
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

export default MarriageCertificateApplication;
