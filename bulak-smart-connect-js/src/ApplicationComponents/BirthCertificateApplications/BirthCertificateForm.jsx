import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Paper } from "@mui/material";
import BirthCertificateApplicationData from "./BirthCertificateApplicationData";
import "./BirthCertificateForm.css";
import ChildIdentifyingForm from "./BirthCertificateForm/ChildIdentifyingForm";
import MotherInformationBirthForm from "./BirthCertificateForm/MotherIdentifyingForm";
import FatherInformationBirthForm from "./BirthCertificateForm/FatherIdentifyingForm";
import MarriageInformationBirthForm from "./BirthCertificateForm/MarriageIdentifyingForm";

const BirthCertificateForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const requiredFields = {
    1: [
      "lastName", "firstName", "birthMonth", "birthDay", "birthYear", "sex",
      "hospital", "city", "province", "barangay", "residence", "typeOfBirth",
      "birthOrder", "birthWeight"
    ],
    2: [
      "motherLastName", "motherFirstName", "motherCitizenship", "motherReligion",
      "motherTotalChildren", "motherLivingChildren", "motherDeceasedChildren",
      "motherOccupation", "motherAge", "motherStreet", "motherCity" 
    ],
    3: ["fatherLastName", "fatherFirstName", "fatherCitizenship", "fatherReligion", "fatherOccupation"],
    4: ["marriageDate", "marriagePlace"]
  };

  const validateStep = () => {
    const newErrors = {};
    requiredFields[step]?.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) {
      alert("Please fill in all required fields before submitting.");
      return;
    }
    BirthCertificateApplicationData(formData);
    const selectedOption = localStorage.getItem("selectedBirthCertificateOption");
    const routeMap = {
      "Regular application": "/RegularApplication",
      "Request copy": "/RequestCopy",
      "Above 18": "/Above18Registration",
      "Below 18": "/Below18Registration",
      "Foreign Parent": "/DelayedOneParentForeignerRegistration",
      "Out of town": "/DelayedOutOfTownRegistration",
      "Clerical Error": "/ClericalErrorApplication",
      "Sex DOB": "/SexDobCorrection",
      "First Name": "/FirstNameCorrection",
    };
    navigate(routeMap[selectedOption] || "/");
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
            <MotherInformationBirthForm formData={formData} handleChange={handleChange} errors={errors} />
            <Button variant="contained" onClick={handlePrevious} className="BirthCertificateFormButton">
              Previous
            </Button>
            <Button variant="contained" onClick={handleNext} className="BirthCertificateFormButton">
              Next
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <FatherInformationBirthForm formData={formData} handleChange={handleChange} errors={errors} />
            <Button variant="contained" onClick={handlePrevious} className="BirthCertificateFormButton">
              Previous
            </Button>
            <Button variant="contained" onClick={handleNext} className="BirthCertificateFormButton">
              Next
            </Button>
          </>
        )}

        {step === 4 && (
          <>
            <MarriageInformationBirthForm formData={formData} handleChange={handleChange} errors={errors} />
            <Button variant="contained" onClick={handlePrevious} className="BirthCertificateFormButton">
              Previous
            </Button>
            <Button variant="contained" onClick={handleSubmit} className="BirthCertificateFormButton">
              Submit
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default BirthCertificateForm;