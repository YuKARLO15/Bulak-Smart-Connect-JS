import React from "react";
import { TextField, Typography, Box } from "@mui/material";
import "./MotherIdentifyingForm.css"; 

const MotherInformationBirthForm = ({ formData, handleChange, errors }) => {
  return (
    <Box className="FormContainerMotherForm">
      <Typography variant="h6" className="SectionTitleMotherForm">II. MOTHER IDENTIFYING INFORMATION</Typography>
      <div className="RowMotherForm">
      <Typography className="label">7. MAIDEN NAME (Pangalan sa Pagkadalaga)</Typography>
      </div>
      <div className="RowMotherForm">
        <TextField label="First Name (Pangalan)" name="motherFirstName" onChange={handleChange} value={formData.motherFirstName || ""} className="InputFieldMotherForm" error={!!errors.motherFirstName} helperText={errors.motherFirstName} />
        <TextField label="Middle Name (Gitnang Pangalan)" name="motherMiddleName" onChange={handleChange} value={formData.motherMiddleName || ""} className="InputFieldMotherForm" error={!!errors.motherMiddleName} helperText={errors.motherMiddleName} />
        <TextField label="Last Name (Apelyido)" name="motherLastName" onChange={handleChange} value={formData.motherLastName || ""} className="InputFieldMotherForm" error={!!errors.motherLastName} helperText={errors.motherLastName} />
      </div>
      <div className="RowMotherForm">
        <Typography className="label" style={{ width: "50%" }} >8. CITIZENSHIP</Typography>
        <Typography className="label">9. RELIGION/ RELIGIOUS SECT</Typography>
      </div>
      <div className="RowMotherForm">
        <TextField label="Citizenship" name="motherCitizenship" onChange={handleChange} value={formData.motherCitizenship || ""} className="InputFieldMotherForm" error={!!errors.motherCitizenship} helperText={errors.motherCitizenship} />
       
        <TextField label="Religion/Religious Sect" name="motherReligion" onChange={handleChange} value={formData.motherReligion || ""} className="InputFieldMotherForm" error={!!errors.motherReligion} helperText={errors.motherReligion} />
      </div>
      <div className="RowMotherForm">
        <Typography className="label" style={{ width: "30%" }} >10a. Total number</Typography>
        <Typography className="label" style={{ width: "30%" }}>10b. No. of children still </Typography>
        <Typography className="label">10c. No. of children born alive</Typography>
     
      </div>
      <div className="RowMotherForm"  >
        <Typography className="label" style={{ width: "32%" }} >children born alive:</Typography>
        <Typography className="label"  style={{ width: "32%" }}>living including this birth:</Typography>
        <Typography className="label">live but are now dead:</Typography>
     
      </div>
      
      <div className="RowMotherForm bornAlive">
        <TextField name="motherTotalChildren" onChange={handleChange} value={formData.motherTotalChildren || ""} className="SmallInputFieldMotherForm" error={!!errors.motherTotalChildren} helperText={errors.motherTotalChildren} />
        <TextField name="motherLivingChildren" onChange={handleChange} value={formData.motherLivingChildren || ""} className="SmallInputFieldMotherForm" error={!!errors.motherLivingChildren} helperText={errors.motherLivingChildren} />
        <TextField name="motherDeceasedChildren" onChange={handleChange} value={formData.motherDeceasedChildren || ""} className="SmallInputFieldMotherForm" error={!!errors.motherDeceasedChildren} helperText={errors.motherDeceasedChildren} />
      </div>
      <div className="RowMotherForm"  >
        <Typography className="label"  style={{ width: "50%" }}>11. OCCUPATION</Typography>
        <Typography className="label">12. AGE at the time of this birth:</Typography>
     
      </div>
      <div className="RowMotherForm Occupation">
 
        <TextField name="motherOccupation" onChange={handleChange} value={formData.motherOccupation || ""} className="BigInputFieldMotherForm" error={!!errors.motherOccupation} helperText={errors.motherOccupation} />
      
        <TextField name="motherAge" onChange={handleChange} value={formData.motherAge || ""} className=" BigInputFieldMotherForm" error={!!errors.motherAge} helperText={errors.motherAge} />
      </div>
      
      <div className="RowMotherForm">
        <Typography className="label">13. RESIDENCE</Typography>
      </div>
      <div className="RowMotherForm"  >
        
        <Typography className="label" style={{ width: "60%" }}>House NO., Street</Typography>
      
      </div>

      <div className="RowMotherForm">
       
        <TextField name="motherStreet" onChange={handleChange} value={formData.motherStreet || ""} className="LargeInputFieldMotherForm" />
        
       
      </div>
      <div className="RowMotherForm"  >
      <Typography className="label " style={{ width: "50%" }}>Barangay</Typography>
        <Typography className="label" >City/Municipality</Typography>
        
      
      </div>

      <div className="RowMotherForm Occupation">
      <TextField name="motherBarangay" onChange={handleChange} value={formData.motherBarangay || ""} className="BigInputFieldMotherForm" />
        <TextField name="motherCity" onChange={handleChange} value={formData.motherCity || ""} className="BigInputFieldMotherForm" />
 
      </div>
      <div className="RowMotherForm "  >
      <Typography className="label" style={{ width: "50%" }} >Province</Typography>
        <Typography className="label" >Country</Typography>
        </div>
      <div className="RowMotherForm Occupation">
      <TextField name="motherProvince" onChange={handleChange} value={formData.motherProvince || ""} className="BigInputFieldMotherForm" />
        <TextField name="motherCountry" onChange={handleChange} value={formData.motherCountry || ""} className="BigInputFieldMotherForm" />
      </div>
    </Box>
  );
};

export default MotherInformationBirthForm;