import React, { useState } from "react";
import { TextField, Typography, Box, FormControl, FormControlLabel, Checkbox, RadioGroup, Radio, Select, MenuItem } from "@mui/material";
import "./IdentifyingForm.css";

const ChildIdentifyingForm = ({ formData, handleChange, errors }) => {
  const [showExtension, setShowExtension] = useState(false);

  const requiredField = <span style={{ color: "red" }}>*</span>;

  return (
    <Box className="form-container">
      <Typography variant="h6" className="section-titleform">I. CHILD IDENTIFYING INFORMATION</Typography>

  
      <div className="row">
        <Typography className="label">1. FULL NAME (Buong Pangalan)</Typography>
      </div>
      <div className="row full-name-container">
        <TextField 
          label={<>Last Name (Apelyido) {requiredField}</>} 
          name="lastName" 
          onChange={handleChange} 
          value={formData.lastName || ""} 
          className="input-field" 
        />
        <TextField 
          label={<>First Name (Pangalan) {requiredField}</>} 
          name="firstName" 
          onChange={handleChange} 
          value={formData.firstName || ""} 
          className="input-field" 
        />
        <TextField 
          label={<>Middle Name (Gitnang Pangalan) {requiredField}</>} 
          name="middleName" 
          onChange={handleChange} 
          value={formData.middleName || ""} 
          className="input-field" 
        />
      </div>
      <div className="row">
        <FormControlLabel 
          control={<Checkbox checked={showExtension} onChange={() => setShowExtension(!showExtension)} />} 
          label="Check this box if the Child have a extension name" 
        />
        {showExtension && (
          <Box>
            <Typography style={{ marginRight: "10px" }}>Extension</Typography>
            <Select name="extension" value={formData.extension || ""} onChange={handleChange} displayEmpty className="input-small">
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Jr.">Jr.</MenuItem>
              <MenuItem value="Sr.">Sr.</MenuItem>
              <MenuItem value="III">III</MenuItem>
              <MenuItem value="IV">IV</MenuItem>
            </Select>
          </Box>
        )}
      </div>

     
      <div className="row">
        <Typography className="label" style={{ width: "60%" }}>2. BIRTH DATE (Kaarawan)</Typography>
        <Typography className="label" style={{ width: "35%" }}>3. SEX (Kasarian) {requiredField}</Typography>
      </div>
      <div className="row">
        <Typography style={{ width: "30%" }} className="label">Month {requiredField}</Typography>
        <Typography style={{ width: "8%" }} className="label">Day {requiredField}</Typography>
        <Typography className="label">Year {requiredField}</Typography>
        </div>
      <div className="row">
       
        <Select name="birthMonth" value={formData.birthMonth || ""} onChange={handleChange} className="input-field">
          <MenuItem value="">Select</MenuItem>
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
            <MenuItem key={month} value={month}>{month}</MenuItem>
          ))}
        </Select>
        
        
        <Select name="birthDay" value={formData.birthDay || ""} onChange={handleChange} className="input-small">
          <MenuItem value="">Select</MenuItem>
          {[...Array(31)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
          ))}
        </Select>
        
      
        <Select name="birthYear" value={formData.birthYear || ""} onChange={handleChange} className="input-small">
          <MenuItem value="">Select</MenuItem>
          {[...Array(100)].map((_, i) => {
            const year = new Date().getFullYear() - i;
            return <MenuItem key={year} value={year}>{year}</MenuItem>;
          })}
        </Select>
        
        <FormControl style={{ marginLeft: "35px" }}>
          <RadioGroup row name="sex" value={formData.sex || ""} onChange={handleChange}>
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>
      </div>

     
      <div className="row">
        <Typography className="label">4. PLACE OF BIRTH (Lugar ng Kapanganakan)</Typography>
      </div>
      <div className="row">
        <TextField label="Name of Hospital/Clinic/Institution" name="hospital" onChange={handleChange} value={formData.hospital || ""} className="input-wide" />
      </div>
      <div className="row">
        <TextField label="City/Municipality" name="city" onChange={handleChange} value={formData.city || ""} className="input-field" />
        <TextField label="Province" name="province" onChange={handleChange} value={formData.province || ""} className="input-field" />
        <TextField label="Barangay" name="barangay" onChange={handleChange} value={formData.barangay || ""} className="input-field" />
      </div>
 
      <div className="row">
        <Typography className="label">Residence (House No. / Block / Lot / Street)</Typography>
        <Typography className="small-text" style={{ marginLeft: "auto" }}>Not Required</Typography>
      </div>
      <div className="row">
        <TextField name="residence" onChange={handleChange} value={formData.residence || ""} className="input-wide" />
      </div>

      <div className="row">
        <Typography style={{ width: "40%" }} className="label">5. A. TYPE OF BIRTH</Typography>
        <Typography className="label">C. BIRTH ORDER</Typography>
  </div>
      <div className="row section-5">
        <FormControl>
          <RadioGroup row name="typeOfBirth" value={formData.typeOfBirth || ""} onChange={handleChange}>
            <FormControlLabel value="Single" control={<Radio />} label="Single" />
            <FormControlLabel value="Twins" control={<Radio />} label="Twins" />
            <FormControlLabel value="TriplesEtc" control={<Radio />} label="Triples, etc." />
          </RadioGroup>
        </FormControl>
        <TextField 
              style={{ marginLeft: "50px" }}
          name="birthOrder" 
          onChange={handleChange} 
          value={formData.birthOrder || ""} 
          className="input-field" 
        />
        <Typography className="birth-order-note" style={{ marginLeft: "40%", width: "100%" }}>LIVE BIRTH AND FETAL DEATHS (INCLUDING THIS DELIVERY)</Typography>
        <Typography className="birth-order-note" style={{ marginLeft: "40%", width: "100%" }}>First, Second, Third, etc.</Typography>
      </div>

    
      <div className="row">
        <Typography className="label">B. IF MULTIPLE BIRTH, CHILD WAS</Typography>
        </div>
      <div className="row">
       
        <FormControlLabel value="First" control={<Radio name="multipleBirthOrder" />} checked={formData.multipleBirthOrder === "First"} onChange={handleChange} label="(1) FIRST" />
        <FormControlLabel value="Second" control={<Radio name="multipleBirthOrder" />} checked={formData.multipleBirthOrder === "Second"} onChange={handleChange} label="(2) SECOND" />
        <FormControlLabel 
          value="OthersSpecify" 
          control={<Radio name="multipleBirthOrder" />} 
          checked={formData.multipleBirthOrder === "OthersSpecify"} 
          onChange={handleChange} 
          label="OTHERS, SPECIFY" 
        />
        {formData.multipleBirthOrder === "OthersSpecify" && (
          <TextField name="multipleBirthOrderSpecify" onChange={handleChange} value={formData.multipleBirthOrderSpecify || ""} className="input-small" />
        )}
      </div>


      <div className="row">
      
     
      </div>
      <div className="row">
        <Typography className="label">6. WEIGHT AT BIRTH</Typography>
        <TextField 
          name="birthWeight" 
          onChange={handleChange} 
          value={formData.birthWeight || ""} 
          className="input-small" 
        />
        <Typography>grams</Typography>
      </div>
    </Box>
  );
};

export default ChildIdentifyingForm;