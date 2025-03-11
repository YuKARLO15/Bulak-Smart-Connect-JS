import React from "react";
import { TextField, Typography, Box, Checkbox, FormControlLabel } from "@mui/material";
import "./FatherIdentifyingForm.css"; 

const FatherInformationBirthForm = ({ formData, handleChange, errors }) => {
  return (
    <Box className="FormContainerFatherForm">
      <Typography variant="h6" className="SectionTitleFatherForm">III. FATHER IDENTIFYING INFORMATION</Typography>
      
      <div className="RowFatherForm">
        <Typography className="label">14. FULL NAME ( Buong Pangalan )</Typography>
      </div>
      
      <div className="RowFatherForm">
        <TextField 
          label="First Name (Pangalan)" 
          name="fatherFirstName" 
          onChange={handleChange} 
          value={formData.fatherFirstName || ""} 
          className="InputFieldFatherForm" 
          error={!!errors.fatherFirstName} 
          helperText={errors.fatherFirstName} 
        />
        <TextField 
          label="Middle Name (Gitnang Pangalan)" 
          name="fatherMiddleName" 
          onChange={handleChange} 
          value={formData.fatherMiddleName || ""} 
          className="InputFieldFatherForm" 
        />
        <TextField 
          label="Last Name (Apelyido)" 
          name="fatherLastName" 
          onChange={handleChange} 
          value={formData.fatherLastName || ""} 
          className="InputFieldFatherForm" 
          error={!!errors.fatherLastName} 
          helperText={errors.fatherLastName} 
        />
      </div>
      
      <div className="RowFatherForm">
        <div className="checkboxContainer">
          <Checkbox
            name="fatherHasExtension"
            checked={formData.fatherHasExtension || false}
            onChange={handleChange}
            color="primary"
            size="small"
          />
          <Typography className="checkboxLabel">Check this box if the FATHER have a extension name</Typography>
          
          <TextField 
            label="Extension" 
            name="fatherExtension" 
            onChange={handleChange} 
            value={formData.fatherExtension || ""} 
            className="extensionField" 
            disabled={!formData.fatherHasExtension}
          />
        </div>
      </div>
      
      <div className="RowFatherForm">
        <Typography className="label" style={{ width: "50%" }}>15. CITIZENSHIP</Typography>
        <Typography className="label">16. RELIGION/ RELIGIOUS SECT</Typography>
      </div>
      
      <div className="RowFatherForm">
        <TextField 
          label="Citizenship" 
          name="fatherCitizenship" 
          onChange={handleChange} 
          value={formData.fatherCitizenship || ""} 
          className="InputFieldFatherForm" 
          error={!!errors.fatherCitizenship} 
          helperText={errors.fatherCitizenship} 
        />
        <TextField 
          label="Religion/Religious Sect" 
          name="fatherReligion" 
          onChange={handleChange} 
          value={formData.fatherReligion || ""} 
          className="InputFieldFatherForm" 
          error={!!errors.fatherReligion} 
          helperText={errors.fatherReligion} 
        />
      </div>
      
      <div className="RowFatherForm">
        <Typography className="label" style={{ width: "50%" }}>17. OCCUPATION</Typography>
        <Typography className="label">18. AGE at the time of this birth:</Typography>
      </div>
      
      <div className="RowFatherForm">
        <TextField 
          label="Occupation" 
          name="fatherOccupation" 
          onChange={handleChange} 
          value={formData.fatherOccupation || ""} 
          className="InputFieldFatherForm" 
          error={!!errors.fatherOccupation} 
          helperText={errors.fatherOccupation} 
        />
        <TextField 
          label="Age" 
          name="fatherAge" 
          onChange={handleChange} 
          value={formData.fatherAge || ""} 
          className="SmallInputFieldFatherForm" 
          error={!!errors.fatherAge} 
          helperText={errors.fatherAge} 
        />
      </div>
      
      <div className="RowFatherForm">
        <Typography className="label">19. RESIDENCE</Typography>
      </div>
      
      <div className="RowFatherForm">
        <Typography className="label" style={{ width: "50%" }}>House NO., Street</Typography>
        <Typography className="label">Barangay</Typography>
      </div>
      
      <div className="RowFatherForm">
        <TextField 
          name="fatherStreet" 
          onChange={handleChange} 
          value={formData.fatherStreet || ""} 
          className="InputFieldFatherForm" 
        />
        <TextField 
          name="fatherBarangay" 
          onChange={handleChange} 
          value={formData.fatherBarangay || ""} 
          className="InputFieldFatherForm" 
        />
      </div>
      
      <div className="RowFatherForm">
        <Typography className="label" style={{ width: "50%" }}>City/Municipality</Typography>
        <Typography className="label">Province</Typography>
      </div>
      
      <div className="RowFatherForm">
        <TextField 
          name="fatherCity" 
          onChange={handleChange} 
          value={formData.fatherCity || ""} 
          className="InputFieldFatherForm" 
        />
        <TextField 
          name="fatherProvince" 
          onChange={handleChange} 
          value={formData.fatherProvince || ""} 
          className="InputFieldFatherForm" 
        />
      </div>
      
      <div className="RowFatherForm">
        <Typography className="label" style={{ width: "50%" }}>Country</Typography>
      </div>
      
      <div className="RowFatherForm">
        <TextField 
          name="fatherCountry" 
          onChange={handleChange} 
          value={formData.fatherCountry || ""} 
          className="InputFieldFatherForm" 
        />
      </div>
    </Box>
  );
};

export default FatherInformationBirthForm;