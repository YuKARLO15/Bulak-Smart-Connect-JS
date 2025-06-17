import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Divider, Alert, Snackbar, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import './CopyBirthCertificate.css';
import NavBar from '../../../../NavigationComponents/NavSide';
import { documentApplicationService } from '../../../../services/documentApplicationService';
import { localStorageManager } from '../../../../services/localStorageManager';

const backendTypeMap = {
  'Copy': {
    applicationType: 'Birth Certificate',
    applicationSubtype: 'Request a Copy of Birth Certificate'
  },
  'Clerical Error': {
    applicationType: 'Birth Certificate',
    applicationSubtype: 'Correction - Clerical Errors'
  },
  'Sex DOB': {
    applicationType: 'Birth Certificate',
    applicationSubtype: 'Correction - Sex/Date of Birth'
  },
  'First Name': {
    applicationType: 'Birth Certificate',
    applicationSubtype: 'Correction - First Name'
  }
};
const uiTitleMap = {
  'Copy': 'Request a Copy of Birth Certificate',
  'Clerical Error': 'Correction of Clerical Error',
  'Sex DOB': "Correction of Child's Sex / Date of Birth",
  'First Name': 'Correction of First Name'
};

const CopyBirthCertificate = ({ formData = {}, handleChange, correctionType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  

  const [selectedKind, setSelectedKind] = useState(
    correctionType ||
    location?.state?.correctionType ||
    location?.state?.applicationType ||
    'Copy'
  );
const backendType = backendTypeMap[selectedKind] || backendTypeMap['Copy'];
const uiTitle = uiTitleMap[selectedKind] || uiTitleMap['Copy'];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [debugInfo, setDebugInfo] = useState(null);

  const requiredField = <span className="RequiredFieldCopyBirth">*</span>;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  
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

   const editingApplicationId = localStorage.getItem('editingApplicationId');
  const isEditing =
    location.state?.isEditing ||
    localStorage.getItem('isEditingBirthApplication') === 'true';


  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && editingApplicationId) {
        try {
          const backendApp = await documentApplicationService.getApplication(editingApplicationId);
          if (backendApp && backendApp.formData) {
            setLocalFormData(backendApp.formData);

            // --- FIX: Set selectedKind based on backend subtype ---
            let subType = (backendApp.applicationSubtype || '').trim();
            let kind = 'Copy';
            if (subType === 'Correction - Clerical Errors') kind = 'Clerical Error';
            else if (subType === 'Correction - Sex/Date of Birth') kind = 'Sex DOB';
            else if (subType === 'Correction - First Name') kind = 'First Name';
            else if (subType === 'Request a Copy of Birth Certificate') kind = 'Copy';
            setSelectedKind(kind);

          } else {
            const savedFormData = localStorage.getItem('birthCertificateApplication');
            if (savedFormData) setLocalFormData(JSON.parse(savedFormData));
            // fallback to Copy if missing
            setSelectedKind('Copy');
          }
        } catch (err) {
          const savedFormData = localStorage.getItem('birthCertificateApplication');
          if (savedFormData) setLocalFormData(JSON.parse(savedFormData));
          setSelectedKind('Copy');
        }
      } else {
        setLocalFormData({});
        localStorage.removeItem('birthCertificateApplication');
        setSelectedKind(
          correctionType ||
          location?.state?.correctionType ||
          location?.state?.applicationType ||
          'Copy'
        );
      }
    };
    fetchData();

  }, [isEditing, editingApplicationId]);

  const validateForm = () => {
    const newErrors = {};
    if (!localFormData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!localFormData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!localFormData.birthMonth) newErrors.birthMonth = 'Month is required';
    if (!localFormData.birthDay) newErrors.birthDay = 'Day is required';
    if (!localFormData.birthYear) newErrors.birthYear = 'Year is required';
    if (!localFormData.city?.trim()) newErrors.city = 'City is required';
    if (!localFormData.province?.trim()) newErrors.province = 'Province is required';
    if (!localFormData.motherFirstName?.trim())
      newErrors.motherFirstName = "Mother's first name is required";
    if (!localFormData.motherLastName?.trim())
      newErrors.motherLastName = "Mother's last name is required";
     if (!hidePurposeSection) {
    if (!localFormData.purpose) newErrors.purpose = 'Purpose is required';
    if (localFormData.purpose === 'Others' && !localFormData.otherPurpose?.trim()) {
      newErrors.otherPurpose = 'Please specify purpose';
    }
  }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocalChange = e => {
    const { name, value } = e.target;

    setLocalFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (typeof handleChange === 'function') {
      handleChange(e);
    }
  };

  // Submit handler
  const handleNextClick = async () => {
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }
    setIsLoading(true);
    setDebugInfo(null);

    let applicationId = editingApplicationId;
    let dataToSave = {
      ...localFormData,
      purpose: localFormData.purpose || '',
      isCopyRequest: backendType.applicationSubtype.startsWith('Request a Copy')
    };

    try {
      let backendResponse;
      if (isEditing && editingApplicationId) {
       backendResponse = await documentApplicationService.updateApplication(editingApplicationId, {
          formData: dataToSave,
          applicantName: `${dataToSave.firstName || ''} ${dataToSave.lastName || ''}`,
          type: backendType.applicationType,
          applicationType: backendType.applicationType,
          applicationSubtype: backendType.applicationSubtype,
          lastUpdated: new Date().toISOString()
        });
        applicationId = backendResponse.id || editingApplicationId;
        showNotification("Application updated successfully", "success");
      } else {

        applicationId =
          (backendType.applicationSubtype.startsWith('Request a Copy') ? 'BC-' : 'BCC-') +
          Date.now().toString().slice(-6);
        const backendApplicationData = {
          applicationType: backendType.applicationType,
          applicationSubtype: backendType.applicationSubtype,
          applicantName: `${dataToSave.firstName || ''} ${dataToSave.lastName || ''}`,
          applicantDetails: JSON.stringify(dataToSave),
          formData: dataToSave,
          status: 'PENDING'
        };
        backendResponse = await documentApplicationService.createApplication(backendApplicationData);
        if (!backendResponse || !backendResponse.id) throw new Error('Backend did not return a valid application ID');
        applicationId = backendResponse.id;
        showNotification("Application created successfully", "success");
      }

      // Keep localStorage for fallback/offline, but always prefer backend
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const appIndex = existingApplications.findIndex(app => app.id === applicationId);
      const applicationData = {
        id: applicationId,
        type: backendType.applicationType,
        applicationType: backendType.applicationType,
        applicationSubtype: backendType.applicationSubtype,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }),
        status: isEditing ? localStorage.getItem('currentApplicationStatus') || 'Pending' : 'Pending',
        message: `${backendType.applicationSubtype} for ${dataToSave.firstName || ''} ${dataToSave.lastName || ''}`,
        formData: dataToSave,
        lastUpdated: new Date().toISOString()
      };
      if (appIndex >= 0) {
        existingApplications[appIndex] = applicationData;
      } else {
        existingApplications.push(applicationData);
      }
      localStorage.setItem('applications', JSON.stringify(existingApplications));
      localStorage.setItem('currentApplicationId', applicationId);
      localStorage.setItem('birthCertificateApplication', JSON.stringify(dataToSave));

      // Clean up edit flags
      if (isEditing) {
        localStorage.removeItem('isEditingBirthApplication');
        localStorage.removeItem('editingApplicationId');
        localStorage.removeItem('editingApplication');
      }

      // Fire events
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('customStorageUpdate', {
        detail: {
          id: applicationId,
          type: backendType.applicationType,
          action: isEditing ? 'updated' : 'created'
        }
      }));

      setTimeout(() => {
        if (backendType.applicationSubtype.startsWith('Correction')) {
          if (selectedKind === 'Clerical Error') {
            navigate('/ClericalErrorApplication');
          } else if (selectedKind === 'Sex DOB') {
            navigate('/SexDobCorrection');
          } else if (selectedKind === 'First Name') {
            navigate('/FirstNameCorrection');
          } else {
            navigate('/BirthApplicationSummary');
          }
        } else {
          navigate('/BirthApplicationSummary');
        }
      }, 1000);

    } catch (error) {
      setDebugInfo({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      showNotification(`Failed to ${isEditing ? "update" : "create"} application: ${error.message}`, "error");
    }
    setIsLoading(false);
  };
  // Hide purpose section for Correction types
  const hidePurposeSection = backendType.applicationSubtype.startsWith('Correction');

  return (
    <Box className={`CopyBirthCertificateContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Error summary */}
      {Object.keys(errors).length > 0 && (
        <div
          className="ErrorSummary"
          style={{
            backgroundColor: '#ffebee',
            padding: '10px 15px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f44336',
          }}
        >
          <Typography variant="subtitle1" style={{ color: '#d32f2f', fontWeight: 'bold' }}>
            Please correct the following errors:
          </Typography>
          <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
            {Object.values(errors).map((error, index) => (
              <li key={index} style={{ color: '#d32f2f' }}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Debug info display */}
      {debugInfo && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Debug Information:</Typography>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </Alert>
      )}
      
      <Typography variant="h5" className="FormTitleCopyBirth">
        {uiTitle}
      </Typography>
      
      <Box className="CopyBirthCertificateContainerCopyBirth">
        <Typography variant="body1" className="FormSubtitleCopyBirth">
          Please provide the information exactly as it appears on your birth certificate
        </Typography>

        <Paper elevation={3} className="FormPaperCopyBirth">
          {/* Personal Information Section */}
          <Box className="FormSectionCopyBirth">
            <Typography variant="h6" className="SectionTitleCopyBirth">
              Personal Information
            </Typography>
            <Typography className="SubSectionTitleCopyBirth">FULL NAME {requiredField}</Typography>
            <div className="FormRowChild">
              <div className="FormGroupChild">
                <label className="FormLabelChild">First Name {requiredField}</label>
                <input
                  type="text"
                  name="firstName"
                  value={localFormData.firstName || ''}
                  onChange={handleLocalChange}
                  className={`FormInputChild ${errors.firstName ? 'InputError' : ''}`}
                  required
                />
                {errors.firstName && (
                  <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="FormGroupChild">
                <label className="FormLabelChild">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={localFormData.middleName || ''}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>
              <div className="FormGroupChild">
                <label className="FormLabelChild">Last Name {requiredField}</label>
                <input
                  type="text"
                  name="lastName"
                  value={localFormData.lastName || ''}
                  onChange={handleLocalChange}
                  className={`FormInputChild ${errors.lastName ? 'InputError' : ''}`}
                  required
                />
                {errors.lastName && (
                  <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>
          </Box>

          <Divider className="SectionDividerCopyBirth" />

          {/* Birth Information Section */}
          <Box className="FormSectionCopyBirth">
            <Typography variant="h6" className="SectionTitleCopyBirth">
              Birth Information
            </Typography>
            <Typography variant="subtitle1" className="SubSectionTitleCopyBirth">
              Date of Birth {requiredField}
            </Typography>
            <div className="DateInputsRowChild">
              <div className="FormGroupChild">
                <label className="FormLabelChild">Month</label>
                <select
                  name="birthMonth"
                  value={localFormData.birthMonth || ''}
                  onChange={handleLocalChange}
                  className={`SelectInputChild ${errors.birthMonth ? 'InputError' : ''}`}
                  required
                >
                  <option value="">Select</option>
                  {months.map(month => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {errors.birthMonth && (
                  <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                    {errors.birthMonth}
                  </span>
                )}
              </div>
              <div className="FormGroupChild">
                <label className="FormLabelChild">Day</label>
                <select
                  name="birthDay"
                  value={localFormData.birthDay || ''}
                  onChange={handleLocalChange}
                  className={`SelectInputChild ${errors.birthDay ? 'InputError' : ''}`}
                  required
                >
                  <option value="">Select</option>
                  {days.map(day => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                {errors.birthDay && (
                  <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                    {errors.birthDay}
                  </span>
                )}
              </div>
              <div className="FormGroupChild">
                <label className="FormLabelChild">Year</label>
                <select
                  name="birthYear"
                  value={localFormData.birthYear || ''}
                  onChange={handleLocalChange}
                  className={`SelectInputChild ${errors.birthYear ? 'InputError' : ''}`}
                  required
                >
                  <option value="">Select</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.birthYear && (
                  <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                    {errors.birthYear}
                  </span>
                )}
              </div>
            </div>
            <Typography
              variant="subtitle1"
              className="SubSectionTitleCopyBirth"
              style={{ marginTop: '20px' }}
            >
              Place of Birth {requiredField}
            </Typography>
            <div className="FormRowChild">
              <div className="FormGroupChild">
                <label className="FormLabelChild">City/Municipality {requiredField}</label>
                <input
                  type="text"
                  name="city"
                  value={localFormData.city || ''}
                  onChange={handleLocalChange}
                  className={`FormInputChild ${errors.city ? 'InputError' : ''}`}
                  required
                />
                {errors.city && (
                  <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                    {errors.city}
                  </span>
                )}
              </div>
              <div className="FormGroupChild">
                <label className="FormLabelChild">Province {requiredField}</label>
                <input
                  type="text"
                  name="province"
                  value={localFormData.province || ''}
                  onChange={handleLocalChange}
                  className={`FormInputChild ${errors.province ? 'InputError' : ''}`}
                  required
                />
                {errors.province && (
                  <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                    {errors.province}
                  </span>
                )}
              </div>
            </div>
          </Box>

          <Divider className="SectionDividerCopyBirth" />

          {/* Parents Information Section */}
          <Box className="FormSectionCopyBirth">
            <Typography variant="h6" className="SectionTitleCopyBirth">
              Parents Information
            </Typography>
            <Typography variant="subtitle1" className="SubSectionTitleCopyBirth">
              Mother's Maiden Name {requiredField}
            </Typography>
            <div className="FormRowChild">
              <div className="FormGroupChild">
                <label className="FormLabelChild">First Name {requiredField}</label>
                <input
                  type="text"
                  name="motherFirstName"
                  value={localFormData.motherFirstName || ''}
                  onChange={handleLocalChange}
                  className={`FormInputChild ${errors.motherFirstName ? 'InputError' : ''}`}
                  required
                />
                {errors.motherFirstName && (
                  <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                    {errors.motherFirstName}
                  </span>
                )}
              </div>
              <div className="FormGroupChild">
                <label className="FormLabelChild">Middle Name</label>
                <input
                  type="text"
                  name="motherMiddleName"
                  value={localFormData.motherMiddleName || ''}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>
              <div className="FormGroupChild">
                <label className="FormLabelChild">Last Name {requiredField}</label>
                <input
                  type="text"
                  name="motherLastName"
                  value={localFormData.motherLastName || ''}
                  onChange={handleLocalChange}
                  className={`FormInputChild ${errors.motherLastName ? 'InputError' : ''}`}
                  required
                />
                {errors.motherLastName && (
                  <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                    {errors.motherLastName}
                  </span>
                )}
              </div>
            </div>
            <Typography
              variant="subtitle1"
              className="SubSectionTitleCopyBirth"
              style={{ marginTop: '20px' }}
            >
              Father's Name
            </Typography>
            <div className="FormRowChild">
              <div className="FormGroupChild">
                <label className="FormLabelChild">First Name</label>
                <input
                  type="text"
                  name="fatherFirstName"
                  value={localFormData.fatherFirstName || ''}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>
              <div className="FormGroupChild">
                <label className="FormLabelChild">Middle Name</label>
                <input
                  type="text"
                  name="fatherMiddleName"
                  value={localFormData.fatherMiddleName || ''}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>
              <div className="FormGroupChild">
                <label className="FormLabelChild">Last Name</label>
                <input
                  type="text"
                  name="fatherLastName"
                  value={localFormData.fatherLastName || ''}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>
            </div>
          </Box>

          <Divider className="SectionDividerCopyBirth" />

          {/* Purpose of Request Section */}
          {!hidePurposeSection && (
            <Box className="FormSectionCopyBirth">
              <Typography variant="h6" className="SectionTitleCopyBirth">
                Purpose of Request
              </Typography>

              <div className="FormRowChild">
                <div className="FormGroupChild" style={{ width: '100%' }}>
                  <label className="FormLabelChild">Purpose {requiredField}</label>
                  <select
                    name="purpose"
                    value={localFormData.purpose || ''}
                    onChange={handleLocalChange}
                    className={`SelectInputChild ${errors.purpose ? 'InputError' : ''}`}
                    style={{ width: '100%' }}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Passport Application">Passport Application</option>
                    <option value="School Requirements">School Requirements</option>
                    <option value="Employment">Employment</option>
                    <option value="Claim Benefits/Loan">Claim Benefits/Loan</option>
                    <option value="Marriage License">Marriage License</option>
                    <option value="Legal Purposes">Legal Purposes</option>
                    <option value="Travel">Travel</option>
                    <option value="Others">Others</option>
                  </select>
                  {errors.purpose && (
                    <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                      {errors.purpose}
                    </span>
                  )}
                </div>
              </div>
              {localFormData.purpose === 'Others' && (
                <div className="FormRowChild">
                  <div className="FormGroupChild" style={{ width: '100%' }}>
                    <label className="FormLabelChild">Specify Purpose {requiredField}</label>
                    <input
                      type="text"
                      name="otherPurpose"
                      value={localFormData.otherPurpose || ''}
                      onChange={handleLocalChange}
                      className={`FormInputChild ${errors.otherPurpose ? 'InputError' : ''}`}
                      required
                    />
                    {errors.otherPurpose && (
                      <span className="ErrorText" style={{ color: '#d32f2f', fontSize: '0.75rem' }}>
                        {errors.otherPurpose}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Box>
          )}

          <Box className="FormNoteCopyBirth">
            <Typography variant="body2">
              Note: The information you provide should exactly match what appears on your birth
              certificate record. Inaccurate information may result in delay or inability to locate
              your records.
            </Typography>
          </Box>
        </Paper>

        <Box
          className="ButtonContainerCopyBirth"
          style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextClick}
            className="NextButtonCopyBirth"
            size="large"
            disabled={isLoading}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Creating Application...
              </Box>
            ) : (
              "NEXT"
            )}
          </Button>
        </Box>
      </Box>
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
    </Box>
  );
};

export default CopyBirthCertificate;