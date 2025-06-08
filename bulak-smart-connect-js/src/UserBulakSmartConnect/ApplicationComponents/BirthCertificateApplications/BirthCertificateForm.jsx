import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Typography, Box, Paper, Alert, Snackbar  } from '@mui/material';
import BirthCertificateApplicationData from './BirthCertificateApplicationData';
import './BirthCertificateForm.css';
import ChildIdentifyingForm from './BirthCertificateForm/ChildIdentifyingForm';
import MotherInformationBirthForm from './BirthCertificateForm/MotherIdentifyingForm';
import FatherInformationBirthForm from './BirthCertificateForm/FatherIdentifyingForm';
import MarriageInformationBirthForm from './BirthCertificateForm/MarriageIdentifyingForm';
import AffidavitBirthForm from './BirthCertificateForm/BirthBackIdentifyingForm';
import { documentApplicationService } from '../../../services/documentApplicationService';
import { localStorageManager } from '../../../services/localStorageManager';

const BirthCertificateForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


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

  const isEditing = location.state?.isEditing || 
                    localStorage.getItem('isEditingBirthApplication') === 'true';

                    useEffect(() => {
                      
                      if (isEditing) {
                        try {
                          console.log("Loading data for editing...");
                          const editingId = localStorage.getItem('editingApplicationId');
                          console.log("Editing application ID:", editingId);
                          
                         
                          const applications = JSON.parse(localStorage.getItem('applications') || '[]');
                          const applicationToEdit = applications.find(app => app.id === editingId);
                          
                          if (applicationToEdit && applicationToEdit.formData) {
                            console.log("Found application to edit:", applicationToEdit);
                            setFormData(applicationToEdit.formData);
                          } else {
                            
                            const savedFormData = localStorage.getItem('birthCertificateApplication');
                            if (savedFormData) {
                              setFormData(JSON.parse(savedFormData));
                              console.log("Loaded form data from birthCertificateApplication");
                            } else {
                              console.warn("No application data found for editing");
                            }
                          }
                        } catch (error) {
                          console.error("Error loading data for editing:", error);
                        }
                      } else {
                        
                        console.log("Starting with new application - clearing form data");
                        setFormData({});
                        localStorage.removeItem('birthCertificateApplication');
                      }
                      
                      
                      return () => {
                        if (!isEditing) {
                          
                          localStorage.setItem('birthCertificateApplication', JSON.stringify(formData));
                        }
                      };
                    }, [isEditing]);
                  
                    const handleChange = e => {
                      const { name, value, type, checked } = e.target;
                      setFormData(prevData => ({
                        ...prevData,
                        [name]: type === 'checkbox' ? checked : value,
                      }));
                      
                     
                      if (Object.keys(formData).length > 0) {
                        localStorage.setItem('birthCertificateApplication', JSON.stringify({
                          ...formData,
                          [name]: type === 'checkbox' ? checked : value,
                        }));
                      }
                    };
                  

  const requiredFields = {
    1: [
      'lastName',
      'firstName',
      'birthMonth',
      'birthDay',
      'birthYear',
      'sex',
      'hospital',
      'city',
      'province',
      'barangay',
      'residence',
      'typeOfBirth',
      'birthOrder',
      'birthWeight',
    ],
    2: [
      'motherLastName',
      'motherFirstName',
      'motherCitizenship',
      'motherReligion',
      'motherTotalChildren',
      'motherLivingChildren',
      'motherDeceasedChildren',
      'motherOccupation',
      'motherAge',
      'motherStreet',
      'motherCity',
    ],
    3: [
      'fatherLastName',
      'fatherFirstName',
      'fatherCitizenship',
      'fatherReligion',
      'fatherOccupation',
      'fatherAge',
      'fatherStreet',
      'fatherBarangay',
      'fatherCity',
      'fatherProvince',
      'fatherCountry',
    ],
    4: [],
    5: [],
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 3 && formData.notAcknowledgedByFather) {
      return true;
    }

    requiredFields[step]?.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prevStep => prevStep + 1);
    }
  };


  const handlePrevious = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleSubmit = async (e) => {
  if (e) e.preventDefault();
  
  if (!validateStep()) {
    return;
  }

  try {
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
      
      applicationId = 'BC-' + Date.now().toString().slice(-6);
      console.log("Creating new application:", applicationId);
    }
    
    
    const selectedOption = sessionStorage.getItem('selectedBirthCertificateOption') || 'Regular application';

    const getApplicationSubtype = (option) => {
      const subtypeMap = {
        'Regular application': 'Regular Application (0-1 month)',
        'Above 18': 'Delayed Registration - Above 18',
        'Below 18': 'Delayed Registration - Below 18', 
        'Foreign Parent': 'Delayed Registration - Foreign Parent',
        'Out of town': 'Delayed Registration - Out of Town',
        'Clerical Error': 'Correction - Clerical Errors',
        'Sex DOB': 'Correction - Sex/Date of Birth',
        'First Name': 'Correction - First Name'
      };
      return subtypeMap[option] || 'Regular Application (0-1 month)';
    };
    
    // Prepare application data
    const applicationData = {
      id: applicationId,
      type: 'Birth Certificate',
      applicationType: selectedOption,
      applicationSubtype: getApplicationSubtype(selectedOption),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
      status: isEditing ? localStorage.getItem('currentApplicationStatus') || 'Pending' : 'Pending',
      message: `Birth Certificate application for ${formData.firstName || ''} ${formData.lastName || ''}`,
      formData: formData,
      lastUpdated: new Date().toISOString()
    };
    
    // Get existing applications
    const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Update or add the application
    if (isEditing) {
      // Find the application index
      const appIndex = existingApplications.findIndex(app => app.id === applicationId);
      
      if (appIndex >= 0) {
        // Update existing application
        existingApplications[appIndex] = applicationData;
        console.log('Updated existing application at index:', appIndex);
      } else {
        // Application doesn't exist yet, add it
        existingApplications.push(applicationData);
        console.log('Added new application (was editing but not found):', applicationId);
      }
    } else {
      // Add new application
      existingApplications.push(applicationData);
      console.log('Added new application:', applicationId);
    }
    
    // Save applications back to localStorage using safe methods
    await localStorageManager.safeSetItem('applications', JSON.stringify(existingApplications));
    await localStorageManager.safeSetItem('currentApplicationId', applicationId);
    await localStorageManager.safeSetItem('birthCertificateApplication', JSON.stringify(formData));
    
    // Send data to the backend as well (like in CopyBirthCertificate)
    try {
      const backendApplicationData = {
        applicationType: 'Birth Certificate',
        applicationSubtype: getApplicationSubtype(selectedOption),
        applicantName: `${formData.firstName || ''} ${formData.lastName || ''}`,
        applicantDetails: JSON.stringify(formData),
        formData: formData,
        status: 'PENDING'
      };

      console.log("Creating application in backend:", backendApplicationData);
      const backendResponse = await documentApplicationService.createApplication(backendApplicationData);
      console.log("Backend response:", backendResponse);
      
      // If backend returns an ID, update the local ID to match
      if (backendResponse && backendResponse.id) {
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
      }
      
      // Show notification of success (optional)
      if (showNotification) {
        showNotification("Application created successfully", "success");
      }
    } catch (error) {
      console.error("Backend creation failed:", error);
      if (showNotification) {
        showNotification(`Failed to create application: ${error.message}`, "error");
      }
      // Continue with local storage only flow if backend fails
    }
    
    // Clear editing flags
    localStorage.removeItem('isEditingBirthApplication');
    localStorage.removeItem('editingApplicationId');
    localStorage.removeItem('editingApplication');
    
    // Dispatch storage events to notify other components
    window.dispatchEvent(new Event('storage'));
    
    const customEvent = new CustomEvent('customStorageUpdate', { 
      detail: { 
        id: applicationId,
        type: 'Birth Certificate', 
        action: isEditing ? 'updated' : 'created' 
      }
    });
    window.dispatchEvent(customEvent);
    
    // Determine the next route based on the selected option
    const routeMap = {
      'Regular application': '/BirthApplicationSummary',
      'Request copy': '/RequestACopyBirthCertificate',
      'Above 18': '/Above18Registration',
      'Below 18': '/Below18Registration',
      'Foreign Parent': '/DelayedOneParentForeignerRegistration',
      'Out of town': '/DelayedOutOfTownRegistration',
      'Clerical Error': '/ClericalErrorApplication',
      'Sex DOB': '/SexDobCorrection',
      'First Name': '/FirstNameCorrection',
    };
    
    // When editing, always go to summary if we already uploaded docs
   
      navigate(routeMap[selectedOption] || '/BirthApplicationSummary');
    
  } catch (err) {
    console.error('Error submitting form:', err);
    if (showNotification) {
      showNotification('There was a problem submitting your application. Please try again.', 'error');
    } else {
      alert('There was a problem submitting your application. Please try again.');
    }
  } finally {
    setIsLoading(false); // Make sure to reset loading state
  }
};   

  return (
    <Box className="BirthCertificateFormContainer">
      <Typography variant="h4" className="BirthCertificateFormTitle">
        Birth Certificate Application Form
      </Typography>
      <Paper className="BirthCertificateForm" elevation={3}>
        {step === 1 && (
          <>
            <ChildIdentifyingForm formData={formData} handleChange={handleChange} errors={errors} />
            <Button variant="contained" onClick={handleNext} className="BirthCertificateFormButton">
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <MotherInformationBirthForm
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
            <Button
              variant="contained"
              onClick={handlePrevious}
              className="BirthCertificateFormButton"
            >
              Previous
            </Button>
            <Button variant="contained" onClick={handleNext} className="BirthCertificateFormButton">
              Next
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <FatherInformationBirthForm
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
            <Button
              variant="contained"
              onClick={handlePrevious}
              className="BirthCertificateFormButton"
            >
              Previous
            </Button>
            <Button variant="contained" onClick={handleNext} className="BirthCertificateFormButton">
              Next
            </Button>
          </>
        )}

        {step === 4 && (
          <>
            <MarriageInformationBirthForm
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
            <Button
              variant="contained"
              onClick={handlePrevious}
              className="BirthCertificateFormButton"
            >
              Previous
            </Button>
            <Button variant="contained" onClick={handleNext} className="BirthCertificateFormButton">
              Next
            </Button>
          </>
        )}

        {step === 5 && (
          <>
            <AffidavitBirthForm formData={formData} handleChange={handleChange} />
            <Button
              variant="contained"
              onClick={handlePrevious}
              className="BirthCertificateFormButton"
            >
              Previous
            </Button>
        <Button
  variant="contained"
  onClick={handleSubmit}
  className="BirthCertificateFormButton"
  disabled={isLoading}
>
  {isLoading ? "Submitting..." : "Submit"}
</Button>
          </>
        )}
      </Paper>
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

export default BirthCertificateForm;
