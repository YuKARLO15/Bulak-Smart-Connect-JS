import React from "react";
import { TextField, Typography, Box } from "@mui/material";

const FatherInformationBirthForm = ({ formData, handleChange, errors }) => {
  return (
    <Box className="FatherInformationBirthForm">
      <Typography variant="h6">III. Father Identifying Information</Typography>
      <TextField
        label="Last Name"
        name="fatherLastName"
        fullWidth
        onChange={handleChange}
        value={formData.fatherLastName || ""}
        error={!!errors.fatherLastName}
        helperText={errors.fatherLastName}
      />
      <TextField
        label="First Name"
        name="fatherFirstName"
        fullWidth
        onChange={handleChange}
        value={formData.fatherFirstName || ""}
        error={!!errors.fatherFirstName}
        helperText={errors.fatherFirstName}
      />
      <TextField
        label="Middle Name (Optional)"
        name="fatherMiddleName"
        fullWidth
        onChange={handleChange}
        value={formData.fatherMiddleName || ""}
      />
      <TextField
        label="Extension (Optional)"
        name="fatherExtension"
        fullWidth
        onChange={handleChange}
        value={formData.fatherExtension || ""}
      />
      <TextField
        label="Citizenship"
        name="fatherCitizenship"
        fullWidth
        onChange={handleChange}
        value={formData.fatherCitizenship || ""}
        error={!!errors.fatherCitizenship}
        helperText={errors.fatherCitizenship}
      />
      <TextField
        label="Religion"
        name="fatherReligion"
        fullWidth
        onChange={handleChange}
        value={formData.fatherReligion || ""}
        error={!!errors.fatherReligion}
        helperText={errors.fatherReligion}
      />
      <TextField
        label="Occupation"
        name="fatherOccupation"
        fullWidth
        onChange={handleChange}
        value={formData.fatherOccupation || ""}
        error={!!errors.fatherOccupation}
        helperText={errors.fatherOccupation}
      />
    </Box>
  );
};

export default FatherInformationBirthForm;
