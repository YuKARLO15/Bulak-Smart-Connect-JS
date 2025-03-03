import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography, Box, Paper } from "@mui/material";
import BirthCertificateApplicationData from "./BirthCertificateApplicationData";
import "./BirthCertificateForm.css";

const BirthCertificateForm = () => {
  const [formData, setFormData] = useState({
    childName: "",
    birthDate: "",
    birthPlace: "",
    parentName: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    if (!formData.childName || !formData.birthDate || !formData.birthPlace || !formData.parentName) {
      alert("Please fill in all fields before submitting.");
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

    if (routeMap[selectedOption]) {
      navigate(routeMap[selectedOption]);
    } else {
      alert("No route found.");
    }
  };

  return (
    <Box className="BirthCertificateFormContainer">
      <Typography variant="h4" className="BirthCertificateFormTitle">
        Birth Certificate Application Form
      </Typography>
      <Paper className="BirthCertificateForm" elevation={3}>
        <TextField
          label="Child's Name"
          name="childName"
          value={formData.childName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Date of Birth"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Place of Birth"a
          name="birthPlace"
          value={formData.birthPlace}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Parent's Name"
          name="parentName"
          value={formData.parentName}
          onChange={handleChange}
          fullWidth
        />

        <Button variant="contained" onClick={handleSubmit} className="BirthCertificateFormButton">
          Submit
        </Button>
      </Paper>
    </Box>
  );
};

export default BirthCertificateForm;
