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
  Container,
} from '@mui/material';
import './MarriageCertificateForm.css';
import HusbandForm from './HusbandForm';
import WifeForm from './WifeForm';
import MarriageDetailsForm from './MarriageDetailsForm';
import MarriageAffidavitForm from './MarriageAffidavitForm';
import { addApplication, getApplicationsByType, updateApplication } from '../../ApplicationData';
import { documentApplicationService } from '../../../../services/documentApplicationService';
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
  const [isAffidavitFormValid, setIsAffidavitFormValid] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const isDirectNavigation = !document.referrer.includes('MarriageDashboard');
    const isNewApplication = !localStorage.getItem('isEditingMarriageForm');

    if (isNewApplication) {
      console.log('Starting new Marriage application - clearing previous application IDs');
      localStorage.removeItem('currentApplicationId');
      localStorage.removeItem('marriageApplicationId');
    }
  }, []);
  useEffect(() => {
    const isEditingForm = localStorage.getItem('isEditingMarriageForm') === 'true';
    const currentEditingId = localStorage.getItem('currentEditingApplicationId');
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

    const fetchData = async () => {
      if (isEditingForm && currentEditingId) {
        try {
          const backendApp = await documentApplicationService.getApplication(currentEditingId);

          if (backendApp && backendApp.formData) {
            setFormData(backendApp.formData);
            console.log('Loaded form data from backend for editing:', currentEditingId);

            if (backendApp.formData.husbandCivilStatus === 'Widowed') {
              setShowHusbandWidowedFields?.(true);
            }
            if (backendApp.formData.wifeCivilStatus === 'Widowed') {
              setShowWifeWidowedFields?.(true);
            }
          } else {
            const savedData = localStorage.getItem('marriageFormData');
            if (savedData) {
              try {
                const parsedData = JSON.parse(savedData);
                setFormData(parsedData);

                if (parsedData.husbandCivilStatus === 'Widowed') {
                  setShowHusbandWidowedFields?.(true);
                }
                if (parsedData.wifeCivilStatus === 'Widowed') {
                  setShowWifeWidowedFields?.(true);
                }

                console.log(`Loaded existing ${option} data from localStorage for editing`);
              } catch (err) {
                console.error(
                  'Error loading marriage form data from localStorage for editing:',
                  err
                );
              }
            }
          }
        } catch (error) {
          console.error('Error fetching application from backend:', error);

          const savedData = localStorage.getItem('marriageFormData');
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              setFormData(parsedData);

              if (parsedData.husbandCivilStatus === 'Widowed') {
                setShowHusbandWidowedFields?.(true);
              }
              if (parsedData.wifeCivilStatus === 'Widowed') {
                setShowWifeWidowedFields?.(true);
              }

              console.log(
                `Loaded existing ${option} data from localStorage for editing (fallback)`
              );
            } catch (err) {
              console.error('Error loading marriage form data from localStorage for editing:', err);
            }
          }
        }
      }
    };

    fetchData();
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

  const handleSubmit = async e => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (step === 4 && !isAffidavitFormValid) {
      const affidavitForm = document.querySelector('.affidavit-form1-container');
      if (affidavitForm) {
        const submitEvent = new Event('submit', { cancelable: true });
        affidavitForm.dispatchEvent(submitEvent);

        if (submitEvent.defaultPrevented) {
          return;
        }
      }
      return;
    }

    try {
      console.log('==== MARRIAGE FORM SUBMISSION ====');

      const isEditing = localStorage.getItem('isEditingMarriageForm') === 'true';
      const currentEditingId = localStorage.getItem('currentEditingApplicationId');

      console.log('Is editing mode?', isEditing);
      console.log('Editing ID:', currentEditingId);

      const applicationType = selectedOption || 'Marriage Certificate';
      const applicationSubtype = selectedOption || 'Marriage Certificate';

      const applicantName = `${formData.husbandFirstName || ''} ${formData.husbandLastName || ''} and ${formData.wifeFirstName || ''} ${formData.wifeLastName || ''}`;

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });

      const completeFormData = {
        ...formData,
        certificateType: selectedOption,
        lastUpdated: new Date().toISOString(),
      };

      let applicationId;
      let backendResponse;

      if (isEditing && currentEditingId) {
        try {
          backendResponse = await documentApplicationService.updateApplication(currentEditingId, {
            formData: completeFormData,
            applicantName: applicantName,
            applicationType: applicationType,
            applicationSubtype: applicationSubtype,
            lastUpdated: new Date().toISOString(),
          });

          applicationId = backendResponse.id || currentEditingId;
          console.log('Successfully updated application in backend:', applicationId);
        } catch (backendError) {
          console.error('Backend update failed:', backendError);

          const applications = JSON.parse(localStorage.getItem('applications') || '[]');
          const index = applications.findIndex(app => app.id === currentEditingId);

          if (index >= 0) {
            applications[index] = {
              ...applications[index],
              type: applicationType,
              applicationType: applicationType,
              applicationSubtype: applicationSubtype,
              message: `Application for ${selectedOption} between ${formData.husbandFirstName || ''} ${formData.husbandLastName || ''} and ${formData.wifeFirstName || ''} ${formData.wifeLastName || ''}`,
              formData: completeFormData,
              lastModified: new Date().toISOString(),
            };

            localStorage.setItem('applications', JSON.stringify(applications));
            applicationId = currentEditingId;
            console.log('Fallback to localStorage update for editing:', applicationId);
          } else {
            throw new Error('Application not found for editing.');
          }
        }
      } else {
        localStorage.removeItem('currentApplicationId');
        localStorage.removeItem('marriageApplicationId');

        applicationId =
          selectedOption === 'Marriage License'
            ? 'ML-' + Date.now().toString().slice(-6)
            : 'MC-' + Date.now().toString().slice(-6);

        const newApplicationData = {
          applicationType: applicationType,
          applicationSubtype: applicationSubtype,
          applicantName: applicantName,
          formData: completeFormData,
          status: 'PENDING',
        };

        try {
          backendResponse = await documentApplicationService.createApplication(newApplicationData);
          if (backendResponse && backendResponse.id) {
            applicationId = backendResponse.id;
          }
          console.log('Successfully created application in backend:', applicationId);
        } catch (backendError) {
          console.error('Backend creation failed:', backendError);

          console.log('Falling back to localStorage creation only');
        }

        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        applications.push({
          id: applicationId,
          type: applicationType,
          applicationType: applicationType,
          applicationSubtype: applicationSubtype,
          date: formattedDate,
          status: 'Pending',
          message: `Application for ${selectedOption} between ${formData.husbandFirstName || ''} ${formData.husbandLastName || ''} and ${formData.wifeFirstName || ''} ${formData.wifeLastName || ''}`,
          formData: completeFormData,
        });

        localStorage.setItem('applications', JSON.stringify(applications));
      }

      localStorage.removeItem('isEditingMarriageForm');
      localStorage.removeItem('editingMarriageType');
      localStorage.removeItem('currentEditingApplicationId');

      localStorage.setItem('currentApplicationId', applicationId);
      localStorage.setItem('marriageFormData', JSON.stringify(completeFormData));

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(
        new CustomEvent('customStorageUpdate', {
          detail: {
            id: applicationId,
            type: applicationType,
            action: isEditing ? 'updated' : 'created',
          },
        })
      );

      if (selectedOption === 'Marriage License') {
        navigate('/MarriageLicenseApplication', {
          state: {
            applicationId: applicationId,
            formData: completeFormData,
            applicationType: 'Marriage License',
          },
        });
      } else {
        navigate('/MarriageCertificateApplication', {
          state: {
            applicationId: applicationId,
            formData: completeFormData,
            applicationType: 'Marriage Certificate',
          },
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your application. Please try again.');
    }
  };
  return (
    <Box className="MarriageCertificateFormContainer" sx={{ 
      width: '100vw', 
      minHeight: '100vh', 
      margin: 0, 
      padding: 0, 
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
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
      <Typography 
        variant="h4" 
        className="MarriageCertificateFormTitle"
        sx={{
          fontWeight: '600 !important',
          backgroundColor: '#184a5b !important',
          textAlign: 'center !important',
          color: 'white !important',
          padding: '20px !important',
          width: '100vw',
          margin: 0,
          marginBottom: '20px !important',
          fontSize: { xs: '1.8rem', md: '2.5rem' }
        }}
      >
        {selectedOption || 'Marriage'} Application Form
      </Typography>

      {dataPreFilled && (
        <Alert severity="info" sx={{ mb: 2, mx: 2, width: '100%', maxWidth: '1200px' }}>
          Using data from your previous Marriage License application. Please verify all information
          is still correct.
        </Alert>
      )}

      <Paper className="MarriageCertificateForm" elevation={3} sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2.5rem',
        '@media (max-width: 768px)': {
          padding: '1.5rem',
          margin: '0 10px'
        },
        '@media (max-width: 480px)': {
          padding: '1rem',
          margin: '0 5px'
        }
      }}>
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
            <Container className="MarriageCertificateFormButtonContainer">
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
            </Container>
          </>
        )}

        {step === 3 && maxSteps > 2 && (
          <>
            <MarriageDetailsForm formData={formData} handleChange={handleChange} errors={errors} />
            <Container className="MarriageCertificateFormButtonContainer">
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
            </Container>
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

            <Container className="MarriageCertificateFormButtonContainer">
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
            </Container>
          </>
        )}

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
