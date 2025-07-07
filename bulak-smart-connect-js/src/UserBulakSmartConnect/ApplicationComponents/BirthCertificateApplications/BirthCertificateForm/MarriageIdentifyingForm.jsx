import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
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

const MarriageInformationBirthForm = forwardRef(({ formData, handleChange }, ref) => {
  const [errors, setErrors] = useState({});
  const requiredField = <span style={{ color: 'red' }}>*</span>;

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

  // Handle input change with validation
  const handleInputChange = e => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    handleChange(e);
  };

  // Handle select change with validation
  const handleSelectChange = e => {
    const { name, value } = e.target;

    // Clear error for this field when user selects
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    handleChange(e);
  };

  // Handle radio change and clear errors when switching to non-marital
  const handleParentsMarriageChange = e => {
    const { value } = e.target;

    // Clear the ParentsMarriage error when user makes a selection
    if (errors.ParentsMarriage) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.ParentsMarriage;
        return newErrors;
      });
    }

    // Clear all marriage-related errors when switching to non-marital
    if (value === 'non-marital') {
      setErrors(prev => {
        const newErrors = { ...prev };
        // Remove marriage-specific errors but keep ParentsMarriage error handling above
        delete newErrors.marriageMonth;
        delete newErrors.marriageDay;
        delete newErrors.marriageYear;
        delete newErrors.marriageCity;
        delete newErrors.marriageProvince;
        delete newErrors.marriageCountry;
        return newErrors;
      });
    }

    handleChange(e);
  };

  const validateForm = () => {
    const newErrors = {};

    // First validate that ParentsMarriage is selected (required)
    if (!formData?.ParentsMarriage) {
      newErrors.ParentsMarriage = 'Please select if the child is marital or non-marital';
    }

    // Only validate marriage fields if child is marital
    if (formData.ParentsMarriage === 'marital') {
      // Date validation
      if (!formData?.marriageMonth?.trim()) {
        newErrors.marriageMonth = 'This field is required';
      }
      if (!formData?.marriageDay) {
        newErrors.marriageDay = 'This field is required';
      }
      if (!formData?.marriageYear) {
        newErrors.marriageYear = 'This field is required';
      }

      // Place validation
      if (!formData?.marriageCity?.trim()) {
        newErrors.marriageCity = 'This field is required';
      }
      if (!formData?.marriageProvince?.trim()) {
        newErrors.marriageProvince = 'This field is required';
      }
      if (!formData?.marriageCountry?.trim()) {
        newErrors.marriageCountry = 'This field is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Expose validation function to parent component
  useImperativeHandle(ref, () => ({
    validateForm,
    // New function to validate all fields at once (for Next button)
    validateAllFields: () => {
      const isValid = validateForm();

      // If validation fails, scroll to first error
      if (!isValid) {
        // Find first error element and scroll to it
        setTimeout(() => {
          // Check for radio button error first, then other errors
          const firstErrorElement = document.querySelector(
            '.MarriageChildStatusFormControl.Mui-error, .Mui-error'
          );
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Focus on the first radio button if that's the error
            const radioButton = firstErrorElement.querySelector('input[type="radio"]');
            if (radioButton) {
              radioButton.focus();
            }
          }
        }, 100);
      }

      return isValid;
    },
  }));

  useEffect(() => {
    if (formData.ParentsMarriage) {
      localStorage.setItem('maritalStatus', formData.ParentsMarriage);
    }
  }, [formData.ParentsMarriage]);
  return (
    <Box className="MarriageInformationBirthFormContainer">
      <Box className="MarriageChildStatusContainer">
        <Typography className="MarriageFormTitle">
          Child's Status <span style={{ color: 'red' }}>*</span>
        </Typography>
        <FormControl
          component="fieldset"
          className="MarriageChildStatusFormControl"
          error={!!errors.ParentsMarriage}
        >
          <RadioGroup
            row
            name="ParentsMarriage"
            value={formData.ParentsMarriage || ''}
            onChange={handleParentsMarriageChange}
          >
            <FormControlLabel value="marital" control={<Radio />} label="Marital Child" />
            <FormControlLabel value="non-marital" control={<Radio />} label="Non-Marital Child" />
          </RadioGroup>
          {errors.ParentsMarriage && (
            <Typography
              variant="caption"
              sx={{
                color: '#d32f2f',
                fontSize: '0.75rem',
                marginTop: '3px',
                display: 'block',
              }}
            >
              {errors.ParentsMarriage}
            </Typography>
          )}
        </FormControl>
      </Box>

      {formData.ParentsMarriage === 'marital' && (
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
                    onChange={handleSelectChange}
                    required
                    error={!!errors.marriageMonth}
                  >
                    {months.map(month => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.marriageMonth && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#d32f2f',
                        fontSize: '0.75rem',
                        marginTop: '3px',
                        marginLeft: '14px',
                      }}
                    >
                      {errors.marriageMonth}
                    </Typography>
                  )}
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
                    onChange={handleSelectChange}
                    required
                    error={!!errors.marriageDay}
                  >
                    {days.map(day => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.marriageDay && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#d32f2f',
                        fontSize: '0.75rem',
                        marginTop: '3px',
                        marginLeft: '14px',
                      }}
                    >
                      {errors.marriageDay}
                    </Typography>
                  )}
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
                    onChange={handleSelectChange}
                    required
                    error={!!errors.marriageYear}
                  >
                    {years.map(year => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.marriageYear && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#d32f2f',
                        fontSize: '0.75rem',
                        marginTop: '3px',
                        marginLeft: '14px',
                      }}
                    >
                      {errors.marriageYear}
                    </Typography>
                  )}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
});

export default MarriageInformationBirthForm;
