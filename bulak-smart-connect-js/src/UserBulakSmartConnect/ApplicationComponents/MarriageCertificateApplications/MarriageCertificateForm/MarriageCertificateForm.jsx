import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import './MarriageCertificateForm.css';
import HusbandForm from './HusbandForm';
import WifeForm from './WifeForm';
import MarriageDetailsForm from './MarriageDetailsForm';
import MarriageAffidavitForm from './MarriageAffidavitForm';
import { addApplication, getApplicationsByType, updateApplication } from '../../ApplicationData';

const MarriageCertificateForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedOption, setSelectedOption] = useState('');
  const [maxSteps, setMaxSteps] = useState(4);
  const [dataPreFilled, setDataPreFilled] = useState(false);
  const [hasPreviousData, setHasPreviousData] = useState(false);
  const [previousLicenseData, setPreviousLicenseData] = useState(null);
  const [showDataDialog, setShowDataDialog] = useState(false);
  // Add a state for affidavit form validation
  const [isAffidavitFormValid, setIsAffidavitFormValid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isEditingForm = localStorage.getItem('isEditingMarriageForm') === 'true';
    const option = localStorage.getItem('selectedMarriageOption');
    if (option) {
      setSelectedOption(option);
      setMaxSteps(option === 'Marriage License' ? 2 : 4);

      if (option === 'Marriage Certificate' && !isEditingForm) {
        checkForPreviousLicenseData();
      }
    } else {
      navigate('/MarriageDashboard');
    }

    const editingType = localStorage.getItem('editingMarriageType');

    if (isEditingForm && (!editingType || editingType === option)) {
      const savedData = localStorage.getItem('marriageFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);

          if (parsedData.husbandCivilStatus === 'Widowed') {
            setShowHusbandWidowedFields(true);
          }
          if (parsedData.wifeCivilStatus === 'Widowed') {
            setShowWifeWidowedFields(true);
          }

          console.log(`Loaded existing ${option} data for editing`);
        } catch (err) {
          console.error('Error loading marriage form data for editing:', err);
        }
      }
    }
  }, [navigate]);

  const checkForPreviousLicenseData = () => {
    try {
      const licenseApplications = getApplicationsByType('Marriage License');

      if (licenseApplications && licenseApplications.length > 0) {
        licenseApplications.sort((a, b) => new Date(b.date) - new Date(a.date));
        const mostRecentLicense = licenseApplications[0];

        if (mostRecentLicense.formData) {
          setHasPreviousData(true);
          setPreviousLicenseData(mostRecentLicense);
          setShowDataDialog(true);
        }
      }
    } catch (error) {
      console.error('Error checking for previous license data:', error);
    }
  };

  const handleUsePreviousData = () => {
    setFormData(previousLicenseData.formData);
    setDataPreFilled(true);
    setShowDataDialog(false);
    console.log('Using data from previous Marriage License:', previousLicenseData.id);
  };

  const handleUseNewData = () => {
    setShowDataDialog(false);
    console.log('User chose to fill out a new form');
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const requiredFields = {
    1: [
      'husbandFirstName',
      'husbandLastName',
      'husbandBirthMonth',
      'husbandBirthDay',
      'husbandBirthYear',
      'husbandBirthCity',
      'husbandBirthProvince',
      'husbandBirthCountry',
      'husbandSex',
      'husbandFatherFirstName',
      'husbandFatherLastName',
      'husbandMotherFirstName',
      'husbandMotherLastName',
      'husbandStreet',
      'husbandCity',
      'husbandProvince',
      'husbandCivilStatus',
      'husbandCountry',
      'husbandReligion',
      'husbandCitizenship',
      'husbandBarangay',
      'husbandFatherCitizenship',
      'husbandMotherCitizenship',
      'waliFirstName',
      'waliLastName',
      'waliRelationship',
      'waliStreet',
      'waliCity',
      'waliProvince',
      'waliCountry',
      'waliBarangay',
      'husbandAge',
    ],
    2: [
      'wifeFirstName',
      'wifeLastName',
      'wifeBirthMonth',
      'wifeBirthDay',
      'wifeBirthYear',
      'wifeBirthCity',
      'wifeBirthProvince',
      'wifeBirthCountry',
      'wifeSex',
      'wifeFatherFirstName',
      'wifeFatherLastName',
      'wifeMotherFirstName',
      'wifeMotherLastName',
      'wifeStreet',
      'wifeCity',
      'wifeProvince',
      'wifeCivilStatus',
      'wifeCountry',
      'wifeReligion',
      'wifeCitizenship',
      'wifeBarangay',
      'wifeFatherCitizenship',
      'wifeMotherCitizenship',
      'wifewaliFirstName',
      'wifewaliLastName',
      'wifewaliRelationship',
      'wifewaliStreet',
      'wifewaliCity',
      'wifewaliProvince',
      'wifewaliCountry',
      'wifewaliBarangay',
      'wifeAge',
    ],
    3: [
      'marriageOffice',
      'marriageBarangay',
      'marriageCity',
      'marriageProvince',
      'marriageCountry',
      'marriageMonth',
      'marriageDay',
      'marriageYear',
      'marriageTime',
    ],
    4: [
      'witness1FirstName',
      'witness1LastName',
      'witness1Address',
      'witness2FirstName',
      'witness2LastName',
      'witness2Address',
    ],
  };

  const validateStep = () => {
    const newErrors = {};
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
      if (step < maxSteps) {
        setStep(prevStep => prevStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      const firstErrorField = document.querySelector(`[name="${Object.keys(errors)[0]}"]`);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handlePrevious = () => {
    setStep(prevStep => prevStep - 1);
  };

  const handleSubmit = e => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // When on the affidavit form step, validate it first
    if (step === 4 && !isAffidavitFormValid) {
      // Trigger validation in the form
      const affidavitForm = document.querySelector('.affidavit-form1-container');
      if (affidavitForm) {
        const submitEvent = new Event('submit', { cancelable: true });
        affidavitForm.dispatchEvent(submitEvent);

        // If the event was cancelled (validation failed), stop here
        if (submitEvent.defaultPrevented) {
          return;
        }
      }

      // Alternative approach - just return if the form isn't valid
      return;
    }

    try {
      console.log('==== MARRIAGE FORM SUBMISSION ====');

      // Check if we're in edit mode
      const isEditing = localStorage.getItem('isEditingMarriageForm') === 'true';
      const currentEditingId = localStorage.getItem('currentEditingApplicationId');

      console.log('Is editing mode?', isEditing);
      console.log('Editing ID:', currentEditingId);

      // Determine the application ID
      let applicationId;
      if (isEditing && currentEditingId) {
        applicationId = currentEditingId;
        console.log('Using existing ID for edit:', applicationId);
      } else {
        applicationId =
          selectedOption === 'Marriage License'
            ? 'ML-' + Date.now().toString().slice(-6)
            : 'MC-' + Date.now().toString().slice(-6);
        console.log('Generated new ID:', applicationId);
      }

      // Prepare form data
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });

      // If we're editing, we need to get the existing application first
      let finalApplicationData;

      if (isEditing && currentEditingId) {
        // Get all applications to find the one we're editing
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const existingApp = applications.find(app => app.id === currentEditingId);

        if (!existingApp) {
          console.error('Could not find application with ID:', currentEditingId);
          alert('Error: Could not find the application you are trying to edit.');
          return;
        }

        console.log('Found existing application:', existingApp);

        // Create a complete application object with all fields
        finalApplicationData = {
          id: applicationId,
          type: selectedOption || existingApp.type,
          applicationType: 'Modified Application',
          date: existingApp.date || formattedDate,
          status: existingApp.status || 'Pending',
          message: `Application for ${selectedOption || 'marriage'} between ${formData.husbandFirstName || ''} ${formData.husbandLastName || ''} and ${formData.wifeFirstName || ''} ${formData.wifeLastName || ''}`,
          // Replace formData entirely instead of merging
          formData: {
            ...formData,
            applicationId: applicationId,
            certificateType: selectedOption,
            lastUpdated: new Date().toISOString(),
          },
          lastModified: new Date().toISOString(),
        };
      } else {
        // Creating a new application
        finalApplicationData = {
          id: applicationId,
          type: selectedOption || 'Marriage Certificate',
          applicationType: 'New Application',
          date: formattedDate,
          status: 'Pending',
          message: `Application for ${selectedOption || 'marriage'} between ${formData.husbandFirstName || ''} ${formData.husbandLastName || ''} and ${formData.wifeFirstName || ''} ${formData.wifeLastName || ''}`,
          formData: {
            ...formData,
            applicationId: applicationId,
            certificateType: selectedOption,
            lastUpdated: new Date().toISOString(),
          },
        };
      }

      console.log('Final application data to submit:', finalApplicationData);

      let result;
      if (isEditing && currentEditingId) {
        // For debugging purposes, get applications before update
        const beforeApps = JSON.parse(localStorage.getItem('applications') || '[]');
        console.log(
          'Applications before update:',
          beforeApps.map(a => a.id)
        );

        // Important: Pass the COMPLETE object to updateApplication
        result = updateApplication(currentEditingId, finalApplicationData);

        // For debugging, get applications after update
        const afterApps = JSON.parse(localStorage.getItem('applications') || '[]');
        console.log(
          'Applications after update:',
          afterApps.map(a => a.id)
        );

        console.log('Update result:', result);
      } else {
        result = addApplication(finalApplicationData);
        console.log('Add result:', result);
      }

      if (!result) {
        console.error('Failed to save application');
        alert('There was an error saving your application. Please try again.');
        return;
      }

      // Clear editing flags
      localStorage.removeItem('isEditingMarriageForm');
      localStorage.removeItem('editingMarriageType');
      localStorage.removeItem('currentEditingApplicationId');
      localStorage.removeItem('marriageFormData');

      // Notify any listeners about the storage change
      window.dispatchEvent(new Event('storage'));

      // Navigate based on application type
      if (selectedOption === 'Marriage License') {
        navigate('/MarriageLicenseApplication');
      } else {
        navigate('/MarriageCertificateApplication');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    }
  };
  return (
    <Box className="MarriageCertificateFormContainer">
      <Dialog
        open={showDataDialog}
        aria-labelledby="previous-data-dialog-title"
        aria-describedby="previous-data-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '10px',
            maxWidth: '500px',
            width: '100%',
          },
        }}
      >
        <DialogTitle
          id="previous-data-dialog-title"
          sx={{
            backgroundColor: '#184a5b',
            color: 'white',
            fontWeight: 600,
          }}
        >
          {'Use Previous Marriage License Data?'}
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <DialogContentText
            id="previous-data-dialog-description"
            sx={{ color: '#333333', fontSize: '16px', marginBottom: '10', marginTop: '30px' }}
          >
            We found a previous Marriage License application submitted on{' '}
            {previousLicenseData && new Date(previousLicenseData.date).toLocaleDateString()}. Would
            you like to use that information to fill out this form?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', justifyContent: 'space-between' }}>
          <Button
            onClick={handleUseNewData}
            sx={{
              backgroundColor: '#e0e0e0',
              color: '#333333',
              padding: '4px 10px',
              fontWeight: 500,
            }}
          >
            No, I'll fill it out again
          </Button>
          <Button
            onClick={handleUsePreviousData}
            autoFocus
            sx={{
              backgroundColor: '#184a5b',
              color: 'white',
              padding: '4px 10px',
              fontWeight: 500,
            }}
          >
            Yes, use my previous information
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h4" className="MarriageCertificateFormTitle">
        {selectedOption || 'Marriage'} Application Form
      </Typography>

      {dataPreFilled && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Using data from your previous Marriage License application. Please verify all information
          is still correct.
        </Alert>
      )}

      <Paper className="MarriageCertificateForm" elevation={3}>
        {step === 1 && (
          <>
            <HusbandForm formData={formData} handleChange={handleChange} errors={errors} />
            <Button
              variant="contained"
              onClick={handleNext}
              className="MarriageCertificateFormButton"
            >
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <WifeForm formData={formData} handleChange={handleChange} errors={errors} />
            <Button
              variant="contained"
              onClick={handlePrevious}
              className="MarriageCertificateFormButton"
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={maxSteps === 2 ? handleSubmit : handleNext}
              className="MarriageCertificateFormButton"
            >
              {maxSteps === 2 ? 'Submit' : 'Next'}
            </Button>
          </>
        )}

        {step === 3 && maxSteps > 2 && (
          <>
            <MarriageDetailsForm formData={formData} handleChange={handleChange} errors={errors} />
            <Button
              variant="contained"
              onClick={handlePrevious}
              className="MarriageCertificateFormButton"
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              className="MarriageCertificateFormButton"
            >
              Next
            </Button>
          </>
        )}

        {step === 4 && maxSteps > 2 && (
          <>
            <MarriageAffidavitForm
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              onValidationChange={setIsAffidavitFormValid}
            />
            <Button
              variant="contained"
              onClick={handlePrevious}
              className="MarriageCertificateFormButton"
            >
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              className="MarriageCertificateFormButton"
              disabled={!isAffidavitFormValid}
            >
              Submit
            </Button>
          </>
        )}

        {/* Progress indicator */}
        <Box className="FormProgressContainer">
          <Typography variant="body2">
            Step {step} of {maxSteps}
          </Typography>
          <Box className="FormProgressBar">
            <Box className="FormProgressFill" sx={{ width: `${(step / maxSteps) * 100}%` }} />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default MarriageCertificateForm;
