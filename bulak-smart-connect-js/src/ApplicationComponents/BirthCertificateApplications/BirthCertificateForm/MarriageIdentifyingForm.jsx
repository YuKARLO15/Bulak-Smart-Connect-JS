import React from "react";
import { TextField, Typography, Box } from "@mui/material";

const MarriageInformationBirthForm = ({ formData, handleChange, errors }) => {
  return (
    <Box className="MarriageInformationBirthForm">
      <Typography variant="h6">IV. Marriage of Parents</Typography>
      <TextField 
        label="Date of Marriage" 
        type="date" 
        name="marriageDate" 
        fullWidth 
        onChange={handleChange} 
        value={formData.marriageDate || ""} 
        InputLabelProps={{ shrink: true }} 
        error={!!errors.marriageDate} 
        helperText={errors.marriageDate} 
      />
      <TextField 
        label="Place of Marriage" 
        name="marriagePlace" 
        fullWidth 
        onChange={handleChange} 
        value={formData.marriagePlace || ""} 
        error={!!errors.marriagePlace} 
        helperText={errors.marriagePlace} 
      />
    </Box>
  );
};

export default MarriageInformationBirthForm;
