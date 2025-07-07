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
  Tooltip,
} from '@mui/material';
import NavBar from '../../../NavigationComponents/NavSide';
import FileUpload from '../FileUpload';
import './MarriageLicenseApplication.css';
import { documentApplicationService } from '../../../services/documentApplicationService';
import { documentApplicationNotificationService } from '../../../services/documentApplicationNotificationService';
import { useAuth } from '../../../context/AuthContext';

const mandatoryDocumentsHusband = [
  'Birth / Baptismal Certificate (Groom)',
  'Cenomar (PSA) (Groom)',
];

const mandatoryDocumentsWife = ['Birth / Baptismal Certificate (Bride)', 'Cenomar (PSA) (Bride)'];

const sharedMandatoryDocuments = ['Seminar Certificate (CSDW)'];

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
    'Indigenous Peoples (IP) ID or certification',
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
        },
      }}
    >
      <span
        style={{
          textDecoration: 'underline',
          cursor: 'pointer',
          color: '#1976d2',
          fontWeight: 'bold',
        }}
      >
        {children}
      </span>
    </Tooltip>
  );
};

const documentDescriptions = {
  'Birth / Baptismal Certificate (Husband)':
    '- Official birth certificate or baptismal certificate of the groom',
  'Cenomar (PSA) (Husband)': '- Certificate of No Marriage (CENOMAR) from PSA for the groom',
  'Birth / Baptismal Certificate (Wife)':
    '- Official birth certificate or baptismal certificate of the bride',
  'Cenomar (PSA) (Wife)': '- Certificate of No Marriage (CENOMAR) from PSA for the bride',
  'Seminar Certificate (CSDW)':
    '- Certificate of attendance from the Canonical and Secular Dimensions of the Wedding seminar',
  'Legal Capacity from their embassy (Manila)':
    "- Legal capacity to contract marriage certificate issued by the foreign national's embassy in Manila",
  'Decree of Divorce from court (if applicable)':
    "- Court decree of divorce from the foreign national's country (if previously married) ( Upload multiple files if applicable)",
  'Registered Death Certificate of Previous Spouse':
    '- Official death certificate of the deceased spouse registered with the civil registry ( Upload multiple files if applicable)',
  'CEMAR / CENOMAR from NSO (PSA)':
    '- Certificate of Marriage (CEMAR) or Certificate of No Marriage (CENOMAR) from PSA ',
  'Decree of Annulment from Court with FINALITY':
    '- Final court decree of annulment with certificate of finality ( Upload multiple files if applicable)',
};

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
  const { user } = useAuth();

  // New checkbox states for individual applicants
  const [foreignNationalGroom, setForeignNationalGroom] = useState(false);
  const [foreignNationalBride, setForeignNationalBride] = useState(false);
  const [widowWidowerGroom, setWidowWidowerGroom] = useState(false);
  const [widowWidowerBride, setWidowWidowerBride] = useState(false);
  const [annulledGroom, setAnnulledGroom] = useState(false);
  const [annulledBride, setAnnulledBride] = useState(false);

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

          // Restore checkbox states if they exist
          if (stateData.formData.foreignNationalGroom !== undefined) {
            setForeignNationalGroom(stateData.formData.foreignNationalGroom);
          }
          if (stateData.formData.foreignNationalBride !== undefined) {
            setForeignNationalBride(stateData.formData.foreignNationalBride);
          }
          if (stateData.formData.widowWidowerGroom !== undefined) {
            setWidowWidowerGroom(stateData.formData.widowWidowerGroom);
          }
          if (stateData.formData.widowWidowerBride !== undefined) {
            setWidowWidowerBride(stateData.formData.widowWidowerBride);
          }
          if (stateData.formData.annulledGroom !== undefined) {
            setAnnulledGroom(stateData.formData.annulledGroom);
          }
          if (stateData.formData.annulledBride !== undefined) {
            setAnnulledBride(stateData.formData.annulledBride);
          }

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

                // Restore checkbox states from backend data
                if (backendApp.formData.foreignNationalGroom !== undefined) {
                  setForeignNationalGroom(backendApp.formData.foreignNationalGroom);
                }
                if (backendApp.formData.foreignNationalBride !== undefined) {
                  setForeignNationalBride(backendApp.formData.foreignNationalBride);
                }
                if (backendApp.formData.widowWidowerGroom !== undefined) {
                  setWidowWidowerGroom(backendApp.formData.widowWidowerGroom);
                }
                if (backendApp.formData.widowWidowerBride !== undefined) {
                  setWidowWidowerBride(backendApp.formData.widowWidowerBride);
                }
                if (backendApp.formData.annulledGroom !== undefined) {
                  setAnnulledGroom(backendApp.formData.annulledGroom);
                }
                if (backendApp.formData.annulledBride !== undefined) {
                  setAnnulledBride(backendApp.formData.annulledBride);
                }
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
    console.log(`File upload for "${label}":`, { isUploaded, fileDataObj });

    // Create application if needed before uploading files
    if (!backendApplicationCreated && isUploaded) {
      setIsLoading(true);
      const createdApp = await createBackendApplication();
      setIsLoading(false);

      if (!createdApp) {
        showNotification('Failed to register application. Cannot upload files.', 'error');
        return;
      }
    }

    // Update the uploadedFiles state
    setUploadedFiles(prevState => {
      const newState = { ...prevState, [label]: isUploaded };
      console.log('Updated uploadedFiles:', newState);
      return newState;
    });

    if (isUploaded && fileDataObj) {
      setFileData(prevState => ({
        ...prevState,
        [label]: fileDataObj,
      }));

      // Upload to backend
      try {
        const currentAppId = applicationId || localStorage.getItem('currentApplicationId');
        if (!currentAppId) {
          showNotification('Application ID is missing. Cannot upload file.', 'error');
          setUploadedFiles(prevState => ({ ...prevState, [label]: false }));
          return;
        }

        console.log('Application ID:', currentAppId);

        // Ensure we handle both single files and multiple files correctly
        let filesToUpload = [];

        if (Array.isArray(fileDataObj)) {
          // Multiple files - already an array
          filesToUpload = fileDataObj;
        } else if (fileDataObj && typeof fileDataObj === 'object') {
          // Single file - convert to array
          filesToUpload = [fileDataObj];
        } else {
          console.error('Invalid file data format:', fileDataObj);
          showNotification('Invalid file data format', 'error');
          setUploadedFiles(prevState => ({ ...prevState, [label]: false }));
          return;
        }

        console.log(`Processing ${filesToUpload.length} file(s) for "${label}":`, filesToUpload);

        for (const [index, fileData] of filesToUpload.entries()) {
          if (!fileData || !fileData.data || !fileData.name) {
            console.error(`Invalid file data at index ${index}:`, fileData);
            continue;
          }

          console.log(`Uploading file ${index + 1}/${filesToUpload.length}:`, {
            name: fileData.name,
            type: fileData.type,
            size: fileData.data?.length || 0,
          });

          try {
            const file = dataURLtoFile(fileData.data, fileData.name, fileData.type);
            const uploadLabel = filesToUpload.length > 1 ? `${label} - File ${index + 1}` : label;

            const response = await documentApplicationService.uploadFile(
              currentAppId,
              file,
              uploadLabel
            );
            console.log(`Upload response for ${fileData.name}:`, response);
          } catch (fileError) {
            console.error(`Failed to upload file ${fileData.name}:`, fileError);
            throw fileError;
          }
        }

        const fileCount = filesToUpload.length;
        const successMessage =
          fileCount > 1
            ? `${fileCount} files uploaded successfully for "${label}"!`
            : `"${label}" uploaded successfully!`;

        showNotification(successMessage, 'success');
      } catch (error) {
        console.error(`Failed to upload "${label}":`, error);

        if (error.response) {
          console.error('Server response:', error.response.status, error.response.data);

          if (error.response.status === 404) {
            showNotification('Application not found. Creating new application...', 'info');
            const createdApp = await createBackendApplication();
            if (createdApp) {
              try {
                const filesToUpload = Array.isArray(fileDataObj) ? fileDataObj : [fileDataObj];

                for (const [index, fileData] of filesToUpload.entries()) {
                  if (!fileData || !fileData.data || !fileData.name) continue;

                  const file = dataURLtoFile(fileData.data, fileData.name, fileData.type);
                  const uploadLabel =
                    filesToUpload.length > 1 ? `${label} - File ${index + 1}` : label;

                  await documentApplicationService.uploadFile(createdApp.id, file, uploadLabel);
                }

                const fileCount = filesToUpload.length;
                const successMessage =
                  fileCount > 1
                    ? `${fileCount} files uploaded successfully for "${label}"!`
                    : `"${label}" uploaded successfully!`;

                showNotification(successMessage, 'success');
                return;
              } catch (retryError) {
                console.error('Retry upload failed:', retryError);
              }
            }
          }

          showNotification(
            `Failed to upload "${label}": ${error.response.data?.message || error.message}`,
            'error'
          );
        } else {
          showNotification(`Failed to upload "${label}": ${error.message}`, 'error');
        }

        // Reset upload state on error
        setUploadedFiles(prevState => ({
          ...prevState,
          [label]: false,
        }));
      }
    } else {
      // Remove file data when upload is cancelled
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

  // Updated form completion logic for checkboxes
  const isFormComplete =
    isMandatoryComplete &&
    (!foreignNational || foreignNationalGroom || foreignNationalBride) &&
    (!widowWidower || widowWidowerGroom || widowWidowerBride) &&
    (!annulled || annulledGroom || annulledBride);

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
        foreignNational,
        foreignNationalGroom,
        foreignNationalBride,
        widowWidower,
        widowWidowerGroom,
        widowWidowerBride,
        annulled,
        annulledGroom,
        annulledBride,
        uploadedFiles,
        documents: Object.keys(uploadedFiles).filter(key => uploadedFiles[key]),
        submissionDate: new Date().toISOString(),
        lastStep: 'MarriageLicenseApplication',
      };

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

      // 📧 SEND CONFIRMATION NOTIFICATION (ENHANCED)
      const userEmail = user?.email;
      if (userEmail) {
        try {
          console.log('📧 Sending application confirmation notification to:', userEmail);
          const groomName =
            completeFormData.groomFirstName && completeFormData.groomLastName
              ? `${completeFormData.groomFirstName} ${completeFormData.groomLastName}`
              : 'Groom';
          const brideName =
            completeFormData.brideFirstName && completeFormData.brideLastName
              ? `${completeFormData.brideFirstName} ${completeFormData.brideLastName}`
              : 'Bride';
          const applicantName = `${groomName} & ${brideName}`;

          const notificationResult =
            await documentApplicationNotificationService.sendApplicationConfirmation(
              userEmail,
              effectiveAppId,
              {
                type: 'Marriage License',
                subtype: 'Marriage License Application',
                applicantName: applicantName,
                submissionDate: new Date().toLocaleDateString(),
                status: 'Pending',
              }
            );

          if (notificationResult.success) {
            console.log('✅ Confirmation notification sent successfully');
            showNotification(
              'Application submitted successfully! A confirmation email has been sent to you.',
              'success'
            );
          } else {
            console.log('⚠️ Confirmation notification failed:', notificationResult.error);
            showNotification(
              'Application submitted successfully! However, we could not send the confirmation email.',
              'warning'
            );
          }
        } catch (notificationError) {
          console.error('❌ Error sending confirmation notification:', notificationError);
          showNotification(
            'Application submitted successfully! However, we could not send the confirmation email.',
            'warning'
          );
        }
      } else {
        console.log('⚠️ No email available for notifications');
      }

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
      <Typography variant="h5" className="TitleMarriageLicense">
        MARRIAGE CERTIFICATE APPLICATION
      </Typography>

      <Box className="MandatoryDocumentsMarriageLicense">
        {applicationId && (
          <Typography variant="body2" className="ApplicationIdMarriageLicense">
            Application ID: {applicationId}
          </Typography>
        )}
        <Typography variant="body1" className="SectionTitleMarriageLicense">
          {' '}
          Select if applicable{' '}
        </Typography>

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

        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#184a5b' }}>
          Groom's Documents:
        </Typography>
        {mandatoryDocumentsHusband.map((doc, index) => (
          <FileUpload
            key={`husband-${index}`}
            label={doc}
            description={documentDescriptions[doc]}
            onUpload={(isUploaded, fileDataObj) => handleFileUpload(doc, isUploaded, fileDataObj)}
            required={true}
            disabled={isLoading}
            multiple={true}
          />
        ))}

        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#184a5b' }}>
          Bride's Documents:
        </Typography>
        {mandatoryDocumentsWife.map((doc, index) => (
          <FileUpload
            key={`wife-${index}`}
            label={doc}
            description={documentDescriptions[doc]}
            onUpload={(isUploaded, fileDataObj) => handleFileUpload(doc, isUploaded, fileDataObj)}
            required={true}
            disabled={isLoading}
            multiple={true}
          />
        ))}

        <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#184a5b' }}>
          Shared Documents:
        </Typography>
        {sharedMandatoryDocuments.map((doc, index) => (
          <FileUpload
            key={`shared-${index}`}
            label={doc}
            description={documentDescriptions[doc]}
            onUpload={(isUploaded, fileDataObj) => handleFileUpload(doc, isUploaded, fileDataObj)}
            required={true}
            disabled={isLoading}
            multiple={true}
          />
        ))}
      </Box>

      {foreignNational && (
        <Box className="AdditionalDocumentsMarriageLicense">
          <Typography variant="body1" className="SectionTitleMarriageLicense">
            For Foreign National:
          </Typography>

          <Box className="CheckboxGroupMarriageLicense">
            <Typography>Who is a foreign national?</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={foreignNationalGroom}
                  onChange={e => setForeignNationalGroom(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Groom"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={foreignNationalBride}
                  onChange={e => setForeignNationalBride(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Bride"
            />
          </Box>

          <FileUpload
            label="Legal Capacity from their embassy (Manila)"
            description={documentDescriptions['Legal Capacity from their embassy (Manila)']}
            onUpload={(isUploaded, fileDataObj) =>
              handleFileUpload(
                'Legal Capacity from their embassy (Manila)',
                isUploaded,
                fileDataObj
              )
            }
            required={true}
            disabled={isLoading}
            multiple={true}
          />

          <FileUpload
            label="Decree of Divorce from court (if applicable)"
            description={documentDescriptions['Decree of Divorce from court (if applicable)']}
            onUpload={(isUploaded, fileDataObj) =>
              handleFileUpload(
                'Decree of Divorce from court (if applicable)',
                isUploaded,
                fileDataObj
              )
            }
            required={false}
            disabled={isLoading}
            multiple={true}
          />
        </Box>
      )}

      {widowWidower && (
        <Box className="AdditionalDocumentsMarriageLicense">
          <Typography variant="body1" className="SectionTitleMarriageLicense">
            For Widow / Widower:
          </Typography>

          <Box className="CheckboxGroupMarriageLicense">
            <Typography>Who is a widow / widower?</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={widowWidowerGroom}
                  onChange={e => setWidowWidowerGroom(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Groom"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={widowWidowerBride}
                  onChange={e => setWidowWidowerBride(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Bride"
            />
          </Box>

          <FileUpload
            label="Registered Death Certificate of Previous Spouse"
            description={documentDescriptions['Registered Death Certificate of Previous Spouse']}
            onUpload={(isUploaded, fileDataObj) =>
              handleFileUpload(
                'Registered Death Certificate of Previous Spouse',
                isUploaded,
                fileDataObj
              )
            }
            required={true}
            disabled={isLoading}
            multiple={true}
          />

          <FileUpload
            label="CEMAR / CENOMAR from NSO (PSA)"
            description={documentDescriptions['CEMAR / CENOMAR from NSO (PSA)']}
            onUpload={(isUploaded, fileDataObj) =>
              handleFileUpload('CEMAR / CENOMAR from NSO (PSA)', isUploaded, fileDataObj)
            }
            required={true}
            disabled={isLoading}
            multiple={true}
          />
        </Box>
      )}

      {annulled && (
        <Box className="AdditionalDocumentsMarriageLicense">
          <Typography variant="body1" className="SectionTitleMarriageLicense">
            For Annulled Applicants:
          </Typography>

          <Box className="CheckboxGroupMarriageLicense">
            <Typography>Who is annulled?</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={annulledGroom}
                  onChange={e => setAnnulledGroom(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Groom"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={annulledBride}
                  onChange={e => setAnnulledBride(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Bride"
            />
          </Box>

          <FileUpload
            label="Decree of Annulment from Court with FINALITY"
            description={documentDescriptions['Decree of Annulment from Court with FINALITY']}
            onUpload={(isUploaded, fileDataObj) =>
              handleFileUpload(
                'Decree of Annulment from Court with FINALITY',
                isUploaded,
                fileDataObj
              )
            }
            required={true}
            disabled={isLoading}
            multiple={true}
          />

          <FileUpload
            label="CEMAR / CENOMAR from NSO (PSA)"
            description={documentDescriptions['CEMAR / CENOMAR from NSO (PSA)']}
            onUpload={(isUploaded, fileDataObj) =>
              handleFileUpload('CEMAR / CENOMAR from NSO (PSA)', isUploaded, fileDataObj)
            }
            required={true}
            disabled={isLoading}
            multiple={true}
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
                foreignNationalGroom: foreignNationalGroom,
                foreignNationalBride: foreignNationalBride,
                widowWidower: widowWidower,
                widowWidowerGroom: widowWidowerGroom,
                widowWidowerBride: widowWidowerBride,
                annulled: annulled,
                annulledGroom: annulledGroom,
                annulledBride: annulledBride,
                uploadedFiles: uploadedFiles,
                fileData: fileData,
                lastModified: new Date().toISOString(),
              },
              uploadedFiles: uploadedFiles,
              fileData: fileData,
              foreignNational: foreignNational,
              foreignNationalGroom: foreignNationalGroom,
              foreignNationalBride: foreignNationalBride,
              widowWidower: widowWidower,
              widowWidowerGroom: widowWidowerGroom,
              widowWidowerBride: widowWidowerBride,
              annulled: annulled,
              annulledGroom: annulledGroom,
              annulledBride: annulledBride,
              modifyMode: true,
              preserveData: true,
              backFromMarriageLicense: true,
              applicationType: 'Marriage License Application',
            };

            try {
              const originalFormData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');

              const updatedFormData = {
                ...originalFormData,
                marriageLicense: {
                  foreignNational: foreignNational,
                  foreignNationalGroom: foreignNationalGroom,
                  foreignNationalBride: foreignNationalBride,
                  widowWidower: widowWidower,
                  widowWidowerGroom: widowWidowerGroom,
                  widowWidowerBride: widowWidowerBride,
                  annulled: annulled,
                  annulledGroom: annulledGroom,
                  annulledBride: annulledBride,
                  uploadedFiles: uploadedFiles,
                  fileData: fileData,
                  lastModified: new Date().toISOString(),
                },
              };

              localStorage.setItem('marriageFormData', JSON.stringify(updatedFormData));
              localStorage.setItem('isEditingMarriageForm', 'true');
              localStorage.setItem('currentEditingApplicationId', applicationId);
              localStorage.setItem('currentApplicationId', applicationId);
              localStorage.setItem('marriageApplicationId', applicationId);

              localStorage.setItem(
                'modifyingApplication',
                JSON.stringify({
                  id: applicationId,
                  type: 'Marriage License',
                  subtype: 'Marriage License Application',
                  foreignNational: foreignNational,
                  widowWidower: widowWidower,
                  annulled: annulled,
                  uploadedFiles: uploadedFiles,
                  timestamp: new Date().toISOString(),
                })
              );

              const applications = JSON.parse(localStorage.getItem('applications') || '[]');
              const appIndex = applications.findIndex(app => app.id === applicationId);

              if (appIndex >= 0) {
                applications[appIndex] = {
                  ...applications[appIndex],
                  formData: updatedFormData,
                  marriageLicense: {
                    foreignNational: foreignNational,
                    foreignNationalGroom: foreignNationalGroom,
                    foreignNationalBride: foreignNationalBride,
                    widowWidower: widowWidower,
                    widowWidowerGroom: widowWidowerGroom,
                    widowWidowerBride: widowWidowerBride,
                    annulled: annulled,
                    annulledGroom: annulledGroom,
                    annulledBride: annulledBride,
                    uploadedFiles: uploadedFiles,
                  },
                  status: applications[appIndex].status || 'In Progress',
                  lastModified: new Date().toISOString(),
                  isBeingModified: true,
                };

                localStorage.setItem('applications', JSON.stringify(applications));
              }

              console.log('Navigating back with modify state:', modifyApplicationState);

              navigate('/MarriageForm', {
                state: {
                  ...modifyApplicationState,
                  preserveOriginalData: true,
                },
                replace: false,
              });
            } catch (error) {
              console.error('Error saving modify state:', error);
              showNotification('Error saving current state. Some data may be lost.', 'warning');

              navigate('/MarriageForm', {
                state: {
                  applicationId: applicationId,
                  isEditing: true,
                  editingApplicationId: applicationId,
                  formData: formData,
                },
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
          sx={{ minWidth: '120px' }}
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
