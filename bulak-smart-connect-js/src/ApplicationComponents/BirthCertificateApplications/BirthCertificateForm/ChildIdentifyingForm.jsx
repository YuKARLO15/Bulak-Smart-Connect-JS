import React, { useState } from "react";
import { TextField, Typography, Box, FormControl, FormControlLabel, Checkbox, RadioGroup, Radio, Select, MenuItem } from "@mui/material";
import "./IdentifyingForm.css";

const ChildIdentifyingForm = ({ formData, handleChange, errors }) => {
  const [showExtension, setShowExtension] = useState(false);

  return (
    <Box className="form-container">
      <Typography variant="h6" className="section-title">I. CHILD IDENTIFYING INFORMATION</Typography>

      {/* Full Name */}
      <div className="row">
        <Typography className="label">1. FULL NAME (Buong Pangalan)</Typography>
        <TextField label="Last Name (Apelyido)" name="lastName" onChange={handleChange} value={formData.lastName || ""} className="input-field" />
        <TextField label="First Name (Pangalan)" name="firstName" onChange={handleChange} value={formData.firstName || ""} className="input-field" />
        <TextField label="Middle Name (Gitnang Pangalan)" name="middleName" onChange={handleChange} value={formData.middleName || ""} className="input-field" />
      </div>
      <div className="row">
        <FormControlLabel 
          control={<Checkbox checked={showExtension} onChange={() => setShowExtension(!showExtension)} />} 
          label="Check this box if the Child has an extension name" 
        />
        {showExtension && (
          <Select name="extension" value={formData.extension || ""} onChange={handleChange} displayEmpty className="input-small">
            <MenuItem value="">Extension</MenuItem>
            <MenuItem value="Jr.">Jr.</MenuItem>
            <MenuItem value="Sr.">Sr.</MenuItem>
          </Select>
        )}
      </div>

      {/* Birth Date & Sex */}
      <div className="row space-between">
        <Typography className="label">2. BIRTH DATE (Kaarawan)</Typography> 
        <Select name="birthMonth" value={formData.birthMonth || ""} onChange={handleChange} className="input-small">
          <MenuItem value="">Month</MenuItem>
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
            <MenuItem key={month} value={month}>{month}</MenuItem>
          ))}
        </Select>
        <TextField label="Day" name="birthDay" type="number" onChange={handleChange} value={formData.birthDay || ""} className="input-small" inputProps={{ min: 1, max: 31 }} />
        <TextField label="Year" name="birthYear" type="number" onChange={handleChange} value={formData.birthYear || ""} className="input-small" />
      
        <FormControl>
          <RadioGroup row name="sex" value={formData.sex || ""} onChange={handleChange}>
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>
      </div>

      {/* Place of Birth */}
      <div className="row">
        <Typography className="label">4. PLACE OF BIRTH (Lugar ng Kapanganakan)</Typography>
        <TextField label="Hospital/Clinic/Institution" name="hospital" onChange={handleChange} value={formData.hospital || ""} className="input-wide" />
        <TextField label="City/Municipality" name="city" onChange={handleChange} value={formData.city || ""} className="input-field" />
        <TextField label="Province" name="province" onChange={handleChange} value={formData.province || ""} className="input-field" />
        <TextField label="Barangay" name="barangay" onChange={handleChange} value={formData.barangay || ""} className="input-field" />
     
      </div>
      <div className="row">
       
        <TextField label="Residence (House No. / Block / Lot / Street)" name="residence" onChange={handleChange} value={formData.residence || ""} className="input-wide" />
      </div>

      {/* Type of Birth */}
      <div className="row">
        <Typography className="label">5. TYPE OF BIRTH</Typography>
        <FormControl>
          <RadioGroup row name="typeOfBirth" value={formData.typeOfBirth || ""} onChange={handleChange}>
            <FormControlLabel value="Single" control={<Radio />} label="Single" />
            <FormControlLabel value="Twins" control={<Radio />} label="Twins" />
            <FormControlLabel value="TripletsOrMore" control={<Radio />} label="Triples, etc." />
          </RadioGroup>
        </FormControl>
      </div>

      {/* Multiple Birth Order */}
      <div className="row">
        <Typography className="label">B. IF MULTIPLE BIRTH, CHILD WAS</Typography>
        <FormControl>
          <RadioGroup row name="multipleBirthOrder" value={formData.multipleBirthOrder || ""} onChange={handleChange}>
            <FormControlLabel value="First" control={<Radio />} label="(1) FIRST" />
            <FormControlLabel value="Second" control={<Radio />} label="(2) SECOND" />
          </RadioGroup>
        </FormControl>
        <TextField label="OTHERS, SPECIFY" name="multipleBirthOrder" onChange={handleChange} value={formData.multipleBirthOrder || ""} className="input-field" />
      </div>

      {/* Birth Order & Weight */}
      <div className="row">
        <Typography className="label">C. BIRTH ORDER</Typography>
        <TextField label="First, Second, Third, etc." name="birthOrder" onChange={handleChange} value={formData.birthOrder || ""} className="input-field" />
        <Typography className="label">6. WEIGHT AT BIRTH</Typography>
        <TextField label="grams" name="birthWeight" onChange={handleChange} value={formData.birthWeight || ""} className="input-small" />
      </div>
    </Box>
  );
};

export default ChildIdentifyingForm;
