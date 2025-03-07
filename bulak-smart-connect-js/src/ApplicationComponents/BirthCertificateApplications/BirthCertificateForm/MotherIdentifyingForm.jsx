import React from "react";
import { TextField, Typography, Box } from "@mui/material";
import "./MotherIdentifyingForm.css";

const MotherInformationBirthForm = ({ formData, handleChange, errors }) => {
  return (
    <Box className="FormContainerMotherForm">
      <Typography variant="h6" className="SectionTitleMotherForm">II. MOTHER IDENTIFYING INFORMATION</Typography>
      
      <div className="RowMotherForm">
        <Typography className="label">1. FULL MAIDEN NAME (Buong Pangalan)</Typography>
        <TextField label="Maiden Last Name" name="motherLastName" onChange={handleChange} value={formData.motherLastName || ""} className="InputFieldMotherForm" error={!!errors.motherLastName} helperText={errors.motherLastName} />
        <TextField label="First Name" name="motherFirstName" onChange={handleChange} value={formData.motherFirstName || ""} className="InputFieldMotherForm" error={!!errors.motherFirstName} helperText={errors.motherFirstName} />
        <TextField label="Middle Name (Optional)" name="motherMiddleName" onChange={handleChange} value={formData.motherMiddleName || ""} className="InputFieldMotherForm" />
        <TextField label="Extension (Optional)" name="motherExtension" onChange={handleChange} value={formData.motherExtension || ""} className="InputFieldMotherForm" />
      </div>

      <div className="RowMotherForm">
      <Typography className="label">2. CITEZENSHIP </Typography>
        <TextField label="Citizenship" name="motherCitizenship" fullWidth onChange={handleChange} value={formData.motherCitizenship || ""} className="InputFieldMotherForm" error={!!errors.motherCitizenship} helperText={errors.motherCitizenship} />
        <Typography className="label">3. RELIGION/ RELIGIOUS SECT</Typography>
        <TextField label="Religion/Religious Sect" name="motherReligion" fullWidth onChange={handleChange} value={formData.motherReligion || ""} className="InputFieldMotherForm" error={!!errors.motherReligion} helperText={errors.motherReligion} />
      </div>
      
      <div className="RowMotherForm">
        <TextField label="Total Number of Children Born Alive" name="motherTotalChildren" fullWidth onChange={handleChange} value={formData.motherTotalChildren || ""} className="InputFieldMotherForm" error={!!errors.motherTotalChildren} helperText={errors.motherTotalChildren} />
        <TextField label="Number of Children Still Living (including this birth)" name="motherLivingChildren" fullWidth onChange={handleChange} value={formData.motherLivingChildren || ""} className="InputFieldMotherForm" error={!!errors.motherLivingChildren} helperText={errors.motherLivingChildren} />
        <TextField label="Number of Children Born Alive but Now Deceased" name="motherDeceasedChildren" fullWidth onChange={handleChange} value={formData.motherDeceasedChildren || ""} className="InputFieldMotherForm" error={!!errors.motherDeceasedChildren} helperText={errors.motherDeceasedChildren} />
      </div>

      <div className="RowMotherForm">
        <TextField label="Occupation" name="motherOccupation" fullWidth onChange={handleChange} value={formData.motherOccupation || ""} className="InputFieldMotherForm" error={!!errors.motherOccupation} helperText={errors.motherOccupation} />
        <TextField label="Age at the Time of Birth" name="motherAge" fullWidth onChange={handleChange} value={formData.motherAge || ""} className="InputFieldMotherForm" error={!!errors.motherAge} helperText={errors.motherAge} />
      </div>
      
      <TextField label="Residence (House No., Street, Barangay, City/Municipality, Province, Country)" name="motherResidence" fullWidth onChange={handleChange} value={formData.motherResidence || ""} className="InputFieldMotherForm" error={!!errors.motherResidence} helperText={errors.motherResidence} />
    </Box>
  );
};

export default MotherInformationBirthForm;
