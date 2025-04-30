import React, { useState } from 'react';
import {
  TextField,
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  Alert,
} from '@mui/material';
import './MarriageIdentifyingForm.css';

const MarriageInformationBirthForm = ({ formData, handleChange, errors }) => {
  const [childStatus, setChildStatus] = useState('');
  const requiredField = <span style={{ color: 'red' }}>*</span>;

  const handleChildStatusChange = event => {
    setChildStatus(event.target.value);
  };

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Box className="MarriageInformationBirthFormContainer">
      <Box className="MarriageChildStatusContainer">
        <Typography className="MarriageFormTitle">Child's Status</Typography>
        <FormControl component="fieldset" className="MarriageChildStatusFormControl">
          <RadioGroup row name="childStatus" value={childStatus} onChange={handleChildStatusChange}>
            <FormControlLabel value="marital" control={<Radio />} label="Marital Child" />
            <FormControlLabel value="nonMarital" control={<Radio />} label="Non-Marital Child" />
          </RadioGroup>
        </FormControl>
      </Box>

      {childStatus === 'marital' && (
        <>
          <Box className="MarriageFormHeader">
            <Typography className="MarriageFormTitle">IV. MARRIAGE OF PARENTS</Typography>
          </Box>

          <Box className="MarriageFormContent">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography className="MarriageFormSubtitle">20.a DATE {requiredField}</Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className="MarriageFormDateField">
                  <InputLabel id="marriage-month-label">Month</InputLabel>
                  <Select
                    labelId="marriage-month-label"
                    id="marriage-month"
                    name="marriageMonth"
                    value={formData.marriageMonth || ''}
                    onChange={handleChange}
                    required
                    error={!!errors.marriageMonth}
                  >
                    {months.map(month => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className="MarriageFormDateField">
                  <InputLabel id="marriage-day-label">Day</InputLabel>
                  <Select
                    labelId="marriage-day-label"
                    id="marriage-day"
                    name="marriageDay"
                    value={formData.marriageDay || ''}
                    onChange={handleChange}
                    required
                    error={!!errors.marriageDay}
                  >
                    {days.map(day => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth className="MarriageFormDateField">
                  <InputLabel id="marriage-year-label">Year</InputLabel>
                  <Select
                    labelId="marriage-year-label"
                    id="marriage-year"
                    name="marriageYear"
                    value={formData.marriageYear || ''}
                    onChange={handleChange}
                    required
                    error={!!errors.marriageYear}
                  >
                    {years.map(year => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" className="MarriageFormSubtitle">
                  20.b PLACE {requiredField}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="marriageCity"
                  name="marriageCity"
                  label="City / Municipality"
                  value={formData.marriageCity || ''}
                  onChange={handleChange}
                  required
                  error={!!errors.marriageCity}
                  helperText={errors.marriageCity}
                  className="MarriageFormPlaceField"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="marriageProvince"
                  name="marriageProvince"
                  label="Province"
                  value={formData.marriageProvince || ''}
                  onChange={handleChange}
                  required
                  error={!!errors.marriageProvince}
                  helperText={errors.marriageProvince}
                  className="MarriageFormPlaceField"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  id="marriageCountry"
                  name="marriageCountry"
                  label="Country"
                  value={formData.marriageCountry || ''}
                  onChange={handleChange}
                  required
                  error={!!errors.marriageCountry}
                  helperText={errors.marriageCountry}
                  className="MarriageFormPlaceField"
                />
              </Grid>
            </Grid>
          </Box>

          <Box className="MarriageFormNote" mt={2}>
            <Alert severity="info">
              NOTE: After submitting the documents online, all required documents for this field
              must also be submitted to the Office of the Civil Registrar.
            </Alert>
          </Box>
        </>
      )}
    </Box>
  );
};

export default MarriageInformationBirthForm;
