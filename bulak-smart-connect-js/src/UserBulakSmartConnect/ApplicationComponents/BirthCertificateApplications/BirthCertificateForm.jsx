import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Typography, Box, Paper } from '@mui/material';
import BirthCertificateApplicationData from './BirthCertificateApplicationData';
import './BirthCertificateForm.css';
import ChildIdentifyingForm from './BirthCertificateForm/ChildIdentifyingForm';
import MotherInformationBirthForm from './BirthCertificateForm/MotherIdentifyingForm';
import FatherInformationBirthForm from './BirthCertificateForm/FatherIdentifyingForm';
import MarriageInformationBirthForm from './BirthCertificateForm/MarriageIdentifyingForm';
import AffidavitBirthForm from './BirthCertificateForm/BirthBackIdentifyingForm';

const BirthCertificateForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const isEditing = location.state?.isEditing || 
                    localStorage.getItem('isEditingBirthApplication') === 'true';

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
                            setFormData(applicationToEdit.formData);
                          } else {
                            // Fallback to direct form data if available
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
                        // If not editing, always start with empty form
                        console.log("Starting with new application - clearing form data");
                        setFormData({});
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
                  
                    const handleChange = e => {
                      const { name, value, type, checked } = e.target;
                      setFormData(prevData => ({
                        ...prevData,
                        [name]: type === 'checkbox' ? checked : value,
                      }));
                      
                      // Save after each change to preserve data during navigation
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

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    try {
  
      let applicationId;
      
      if (isEditing) {
        applicationId = localStorage.getItem('editingApplicationId');
        console.log("Editing existing application:", applicationId);
      } else {
        // Generate a new application ID if not editing
        applicationId = 'BC-' + Date.now().toString().slice(-6);
        console.log("Creating new application:", applicationId);
      }
      
      // Get the selected application type
      const selectedOption = localStorage.getItem('selectedBirthCertificateOption') || 'Regular application';
      
      // Prepare application data
      const applicationData = {
        id: applicationId,
        type: 'Birth Certificate',
        applicationType: selectedOption,
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
      
      // Save applications back to localStorage
      localStorage.setItem('applications', JSON.stringify(existingApplications));
      
      // Set current application ID 
      localStorage.setItem('currentApplicationId', applicationId);
      localStorage.setItem('birthCertificateApplication', JSON.stringify(formData));
      
      // Clear editing flags
      localStorage.removeItem('isEditingBirthApplication');
      localStorage.removeItem('editingApplicationId');
      localStorage.removeItem('editingApplication');
      
      // Dispatch storage events to notify other components
      // First, standard storage event (for cross-tab communication)
      window.dispatchEvent(new Event('storage'));
      
      // Then, custom event with more details (for same-tab communication)
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
      if (isEditing) {
        navigate('/BirthApplicationSummary');
      } else {
        // For new applications, follow the route map
        navigate(routeMap[selectedOption] || '/BirthApplicationSummary');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('There was a problem submitting your application. Please try again.');
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
            >
              Submit
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default BirthCertificateForm;
