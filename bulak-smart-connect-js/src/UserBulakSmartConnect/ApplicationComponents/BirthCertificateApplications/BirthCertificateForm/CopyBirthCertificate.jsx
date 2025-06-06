import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Divider, Alert, Snackbar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import './CopyBirthCertificate.css';
// Import your document application service
import { documentApplicationService } from '../../../../services/documentApplicationService';
import NavBar from '../../../../NavigationComponents/NavSide';
import { localStorageManager } from '../../../../services/localStorageManager';

const CopyBirthCertificate = ({ formData = {}, handleChange }) => {
  const navigate = useNavigate();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showExtension, setShowExtension] = useState(formData.hasExtension || false);
  const [localFormData, setLocalFormData] = useState(formData || {});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  const requiredField = <span className="RequiredFieldCopyBirth">*</span>;
  const location = useLocation();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

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

  useEffect(() => {
    // Only load data if we're in editing mode
    if (isEditing) {
      try {
        console.log("Loading data for editing...");
        const editingId = localStorage.getItem('editingApplicationId');
        console.log("Editing application ID:", editingId);
        
        // Get applications from localStorage
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const applicationToEdit = applications.find(app => app.id === editingId);
        
        if (applicationToEdit && applicationToEdit.formData) {
          console.log("Found application to edit:", applicationToEdit);
          setLocalFormData(applicationToEdit.formData);
        } else {
          // Fallback to direct form data if available
          const savedFormData = localStorage.getItem('birthCertificateApplication');
          if (savedFormData) {
            setLocalFormData(JSON.parse(savedFormData));
            console.log("Loaded form data from birthCertificateApplication");
          } else {
            console.warn("No application data found for editing");
          }
        }
      } catch (error) {
        console.error("Error loading data for editing:", error);
      }
    } else {
      // If not editing, always start with empty form
      console.log("Starting with new application - clearing form data");
      setLocalFormData({});
      localStorage.removeItem('birthCertificateApplication');
    }
    
    // Cleanup function
    return () => {
      if (!isEditing) {
        // Save draft data when leaving form
        localStorage.setItem('birthCertificateApplication', JSON.stringify(formData));
      }
    };
  }, [isEditing]);
  
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

    if (!localFormData.purpose) newErrors.purpose = 'Purpose is required';
    if (localFormData.purpose === 'Others' && !localFormData.otherPurpose?.trim()) {
      newErrors.otherPurpose = 'Please specify purpose';
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

  const handleExtensionChange = e => {
    setShowExtension(e.target.checked);
    if (typeof handleChange === 'function') {
      handleChange({
        target: {
          name: 'hasExtension',
          value: e.target.checked,
        },
      });
    }
  };

  const handleNextClick = async () => {
    if (!validateForm()) {
      console.log("Form validation failed");
      window.scrollTo(0, 0);
      return;
    }
  
    try {
      console.log("Processing next button click...");
      setIsLoading(true);

      const usage = localStorageManager.getCurrentUsage();
      if (usage.isCritical) {
        console.warn('Storage critical, performing cleanup before save...');
        await localStorageManager.performCleanup(0.4);
      }
        
      let applicationId;
      
      if (isEditing) {
        applicationId = localStorage.getItem('editingApplicationId');
        console.log("Editing existing application:", applicationId);
      } else {
        // Generate application ID with prefix and timestamp
        applicationId = 'BC-' + Date.now().toString().slice(-6);
        console.log("Creating new application:", applicationId);
      }
      
      const dataToSave = { 
        ...localFormData,
        purpose: localFormData.purpose || '',
        isCopyRequest: true 
      };

      const applicationData = {
        id: applicationId,
        type: 'Birth Certificate',
        applicationType: 'Request copy',
        applicationSubtype: 'Copy of Birth Certificate',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }),
        status: isEditing ? localStorage.getItem('currentApplicationStatus') || 'Pending' : 'Pending',
        message: `Copy of Birth Certificate request for ${dataToSave.firstName || ''} ${dataToSave.lastName || ''}`,
        formData: dataToSave,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to localStorage first (for local state management)
      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      
      if (isEditing) {
        const appIndex = existingApplications.findIndex(app => app.id === applicationId);
        if (appIndex >= 0) {
          existingApplications[appIndex] = applicationData;
          console.log('Updated existing application at index:', appIndex);
        } else {
          existingApplications.push(applicationData);
          console.log('Added new application (was editing but not found):', applicationId);
        }
      } else {
        existingApplications.push(applicationData);
        console.log('Added new application:', applicationId);
      }
      
      // Use localStorageManager.safeSetItem instead of localStorage.safeSetItem
      await localStorageManager.safeSetItem('applications', JSON.stringify(existingApplications));
      await localStorageManager.safeSetItem('currentApplicationId', applicationId);
      await localStorageManager.safeSetItem('birthCertificateApplication', JSON.stringify(dataToSave));
      
      // Now create the application in the backend using documentApplicationService
      try {
        const backendApplicationData = {
          // Don't send 'id' - let the backend generate it with your format
          applicationType: 'Birth Certificate',
          applicationSubtype: 'Copy of Birth Certificate',
          applicantName: `${dataToSave.firstName} ${dataToSave.lastName}`,
          applicantDetails:  JSON.stringify(dataToSave), // Backend expects JSON string
          formData: dataToSave, // Backend validation requires this as object
          status: 'PENDING'
        };

        console.log("Creating application in backend:", backendApplicationData);
        const backendResponse = await documentApplicationService.createApplication(backendApplicationData);
        console.log("Backend response:", backendResponse);
        
        // Backend will return an ID like BC-123456, which matches your frontend format
        console.log("Application created in backend with ID:", backendResponse.id);
        
        // Update the current application ID to match backend
        localStorage.setItem('currentApplicationId', backendResponse.id);
        
        // Update the applications array with the backend ID
        const updatedApplications = existingApplications.map(app => {
          if (app.id === applicationId) {
            return { ...app, id: backendResponse.id };
          }
          return app;
        });
        localStorage.setItem('applications', JSON.stringify(updatedApplications));
        
        showNotification("Application created successfully", "success");
        
        // Clean up editing flags
        localStorage.removeItem('isEditingBirthApplication');
        localStorage.removeItem('editingApplicationId');
        localStorage.removeItem('editingApplication');
        
        // Trigger storage events
        window.dispatchEvent(new Event('storage'));
        
        const customEvent = new CustomEvent('customStorageUpdate', { 
          detail: { 
            id: backendResponse.id,
            type: 'Birth Certificate', 
            action: isEditing ? 'updated' : 'created' 
          }
        });
        window.dispatchEvent(customEvent);
        
        // Navigate to upload page after successful creation
        setTimeout(() => {
          navigate('/CTCBirthCertificate');
        }, 1000);
        
      } catch (error) {
        console.error("Backend creation failed:", error);
        showNotification(`Failed to create application: ${error.message}`, "error");
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Error processing form:', err);
      showNotification('There was a problem with your request. Please try again.', 'error');
    }
  };

  return (

       <Box className={`CopyBirthCertificateContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
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
      <Typography variant="h5" className="FormTitleCopyBirth">
        Request a Copy of Birth Certificate
      </Typography>
      <Box className="CopyBirthCertificateContainerCopyBirth">
        <Typography variant="body1" className="FormSubtitleCopyBirth">
          Please provide the information exactly as it appears on your birth certificate
        </Typography>

        <Paper elevation={3} className="FormPaperCopyBirth">
          {/* Form content remains the same - keeping your original form fields */}
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

            <div className="FormRowChild">
              <div className="CheckboxContainerChild">
                <input
                  type="checkbox"
                  id="extensionCheckbox"
                  checked={showExtension}
                  onChange={handleExtensionChange}
                  className="CheckboxInputChild"
                />
                <label htmlFor="extensionCheckbox" className="CheckboxLabelChild">
                  I have an extension name (Jr., Sr., III, etc.)
                </label>
              </div>

              {showExtension && (
                <div className="ExtensionContainerChild">
                  <span className="ExtensionLabelChild">Extension</span>
                  <select
                    name="extension"
                    value={localFormData.extension || ''}
                    onChange={handleLocalChange}
                    className="SelectInputChild"
                  >
                    <option value="">Select</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                  </select>
                </div>
              )}
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
            {isLoading ? "Creating Application..." : "NEXT"}
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