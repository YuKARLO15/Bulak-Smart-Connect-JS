import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper } from '@mui/material';
import './MarriageCertificateForm.css';
import HusbandForm from './HusbandForm';
import WifeForm from './WifeForm';
import MarriageDetailsForm from './MarriageDetailsForm';
import MarriageAffidavitForm from './MarriageAffidavitForm';
import { addApplication } from '../../ApplicationData';
const MarriageCertificateForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
      setStep(prevStep => prevStep + 1);
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
    try {
      localStorage.setItem('marriageFormData', JSON.stringify(formData));

      const applicationId = 'MCA-' + Date.now().toString().slice(-6);

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });

      const applicationData = {
        id: applicationId,
        type: 'Marriage Certificate',
        applicationType: 'New Application',
        date: formattedDate,
        status: 'Pending',
        message: `Application for marriage between ${formData.husbandFirstName || ''} ${formData.husbandLastName || ''} and ${formData.wifeFirstName || ''} ${formData.wifeLastName || ''}`,
        formData: { ...formData },
      };

      console.log('Creating new marriage application:', applicationData);
      const result = addApplication(applicationData);
      if (!result) {
        console.error('Failed to add application to storage');
        alert('There was an error submitting your application. Please try again.');
        return;
      }
      window.dispatchEvent(new Event('storage'));

      navigate('/MarriageLicenseApplication');
    } catch (error) {
      console.error('Error submitting marriage application:', error);
      alert('There was an error submitting your application. Please try again.');
    }
  };

  return (
    <Box className="MarriageCertificateFormContainer">
      <Typography variant="h4" className="MarriageCertificateFormTitle">
        Marriage Certificate Application Form
      </Typography>
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
              onClick={handleNext}
              className="MarriageCertificateFormButton"
            >
              Next
            </Button>
          </>
        )}

        {step === 3 && (
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

        {step === 4 && (
          <>
            <MarriageAffidavitForm
              formData={formData}
              handleChange={handleChange}
              errors={errors}
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
            >
              Submit
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default MarriageCertificateForm;
