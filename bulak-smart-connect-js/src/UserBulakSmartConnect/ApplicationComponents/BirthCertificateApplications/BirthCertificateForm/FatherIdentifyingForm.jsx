import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import './FatherIdentifyingForm.css';

const FatherIdentifyingForm = forwardRef(({ formData, handleChange }, ref) => {
  const [showExtension, setShowExtension] = useState(formData?.fatherHasExtension || false);
  const [fatherAcknowledgment, setFatherAcknowledgment] = useState(
    formData?.fatherAcknowledgment || ''
  );
  const [errors, setErrors] = useState({});

  const requiredField = <span className="RequiredFieldFather">*</span>;

  const validateNumberOnly = e => {
    if (!/^\d*$/.test(e.target.value)) {
      return;
    }
    handleChange(e);
  };

  // Handle number input change with validation
  const handleNumberInputChange = (e) => {
    if (!/^\d*$/.test(e.target.value)) {
      return;
    }

    const { name } = e.target;
    
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

  // Handle regular input change with validation
  const handleInputChange = (e) => {
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

  // Handle blur event to validate individual field
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateForm = () => {
    const newErrors = {};

    // First validate that father acknowledgment is selected (required)
    if (!formData?.fatherAcknowledgment) {
      newErrors.fatherAcknowledgment = 'Please select if the father acknowledges the child';
    }

    // Only validate father fields if father acknowledges the child
    if (formData?.fatherAcknowledgment === 'acknowledged') {
      // Required fields validation based on the parent form's required fields for step 3
      if (!formData?.fatherLastName?.trim()) {
        newErrors.fatherLastName = 'This field is required';
      }
      if (!formData?.fatherFirstName?.trim()) {
        newErrors.fatherFirstName = 'This field is required';
      }
      if (!formData?.fatherCitizenship?.trim()) {
        newErrors.fatherCitizenship = 'This field is required';
      }
      if (!formData?.fatherReligion?.trim()) {
        newErrors.fatherReligion = 'This field is required';
      }
      if (!formData?.fatherOccupation?.trim()) {
        newErrors.fatherOccupation = 'This field is required';
      }
      if (!formData?.fatherAge?.trim()) {
        newErrors.fatherAge = 'This field is required';
      }
      if (!formData?.fatherStreet?.trim()) {
        newErrors.fatherStreet = 'This field is required';
      }
      if (!formData?.fatherBarangay?.trim()) {
        newErrors.fatherBarangay = 'This field is required';
      }
      if (!formData?.fatherCity?.trim()) {
        newErrors.fatherCity = 'This field is required';
      }
      if (!formData?.fatherProvince?.trim()) {
        newErrors.fatherProvince = 'This field is required';
      }
      if (!formData?.fatherCountry?.trim()) {
        newErrors.fatherCountry = 'This field is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate individual field
  const validateField = (name, value) => {
    let error = '';

    // Only validate if father acknowledges the child
    if (formData?.fatherAcknowledgment === 'acknowledged') {
      switch (name) {
        case 'fatherLastName':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        case 'fatherFirstName':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        case 'fatherCitizenship':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        case 'fatherReligion':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        case 'fatherOccupation':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        case 'fatherAge':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        case 'fatherStreet':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        case 'fatherBarangay':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        case 'fatherCity':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        case 'fatherProvince':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        case 'fatherCountry':
          if (!value?.trim()) {
            error = 'This field is required';
          }
          break;
        default:
          break;
      }
    }

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
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
          const firstErrorElement = document.querySelector('.FatherAcknowledgmentFormControl.Mui-error, .FormInputFather.error, .SelectInputFather.error');
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Focus on the first radio button if that's the error
            const radioButton = firstErrorElement.querySelector('input[type="radio"]');
            if (radioButton) {
              radioButton.focus();
            } else {
              firstErrorElement.focus();
            }
          }
        }, 100);
      }
      
      return isValid;
    }
  }));

  const handleFatherAcknowledgmentChange = e => {
    const value = e.target.value;
    setFatherAcknowledgment(value);
    
    // Clear the acknowledgment error when user makes a selection
    if (errors.fatherAcknowledgment) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.fatherAcknowledgment;
        return newErrors;
      });
    }
    
    // Clear all father-related errors when switching to "not acknowledged"
    if (value === 'not-acknowledged') {
      setErrors(prev => {
        const newErrors = { ...prev };
        // Remove father-specific errors
        delete newErrors.fatherLastName;
        delete newErrors.fatherFirstName;
        delete newErrors.fatherCitizenship;
        delete newErrors.fatherReligion;
        delete newErrors.fatherOccupation;
        delete newErrors.fatherAge;
        delete newErrors.fatherStreet;
        delete newErrors.fatherBarangay;
        delete newErrors.fatherCity;
        delete newErrors.fatherProvince;
        delete newErrors.fatherCountry;
        return newErrors;
      });
    }
    
    handleChange({
      target: {
        name: 'fatherAcknowledgment',
        value: value,
      },
    });
  };

  return (
    <div className="BirthFormContainerFather">
      <div className="FormHeaderFather">III. FATHER IDENTIFYING INFORMATION</div>

      {/* Father Acknowledgment Selection */}
      <div className="FatherAcknowledgmentContainer">
        <Typography className="FatherAcknowledgmentTitle">
          Father's Acknowledgment Status <span style={{ color: 'red' }}>*</span>
        </Typography>
        <FormControl 
          component="fieldset" 
          className={`FatherAcknowledgmentFormControl ${errors.fatherAcknowledgment ? 'Mui-error' : ''}`}
        >
          <RadioGroup
            row
            name="fatherAcknowledgment"
            value={formData?.fatherAcknowledgment || ""}
            onChange={handleFatherAcknowledgmentChange}
          >
            <FormControlLabel 
              value="acknowledged" 
              control={<Radio />} 
              label="Acknowledged by Father" 
            />
            <FormControlLabel 
              value="not-acknowledged" 
              control={<Radio />} 
              label="Not Acknowledged by Father" 
            />
          </RadioGroup>
          {errors.fatherAcknowledgment && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#d32f2f', 
                fontSize: '0.75rem', 
                marginTop: '3px',
                display: 'block'
              }}
            >
              {errors.fatherAcknowledgment}
            </Typography>
          )}
        </FormControl>
      </div>

      {/* Father Information Form - Only show if acknowledged */}
      {formData?.fatherAcknowledgment === 'acknowledged' && (
        <div className="FormContentFather">
        {/* Full Name Section */}
        <div className="FormSectionFather">
          <div className="SectionTitleFather">
            14. FULL NAME (Buong Pangalan) {requiredField}
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">
                First Name (Pangalan) {requiredField}
              </label>
              <input
                type="text"
                name="fatherFirstName"
                value={formData?.fatherFirstName || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherFirstName ? 'error' : ''}`}
                required
              />
              {errors.fatherFirstName && <span className="ErrorMessageFather">{errors.fatherFirstName}</span>}
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">Middle Name (Gitnang Pangalan) Optional</label>
              <input
                type="text"
                name="fatherMiddleName"
                value={formData?.fatherMiddleName || ''}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Last Name (Apelyido) {requiredField}
              </label>
              <input
                type="text"
                name="fatherLastName"
                value={formData?.fatherLastName || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherLastName ? 'error' : ''}`}
                required
              />
              {errors.fatherLastName && <span className="ErrorMessageFather">{errors.fatherLastName}</span>}
            </div>
          </div>

          <div className="FormRowFather">
            <div className="CheckboxContainerFather">
              <input
                type="checkbox"
                id="fatherExtensionCheckbox"
                checked={showExtension}
                onChange={() => setShowExtension(!showExtension)}
                className="CheckboxInputFather"
              />
              <label htmlFor="fatherExtensionCheckbox" className="CheckboxLabelFather">
                Check this box if the FATHER have a extension name
              </label>
            </div>

            {showExtension && (
              <div className="ExtensionContainerFather">
                <span className="ExtensionLabelFather">Extension</span>
                <select
                  name="fatherExtension"
                  value={formData?.fatherExtension || ''}
                  onChange={handleChange}
                  className="SelectInputFather"
                >
                  <option value="">Select</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Citizenship and Religion Section */}
        <div className="FormSectionFather">
          <div className="FormRowFather">
            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                15. CITIZENSHIP {requiredField}
              </div>
              <input
                type="text"
                name="fatherCitizenship"
                value={formData?.fatherCitizenship || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherCitizenship ? 'error' : ''}`}
                required
              />
              {errors.fatherCitizenship && <span className="ErrorMessageFather">{errors.fatherCitizenship}</span>}
            </div>

            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                16. RELIGION/ RELIGIOUS SECT {requiredField}
              </div>
              <input
                type="text"
                name="fatherReligion"
                value={formData?.fatherReligion || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherReligion ? 'error' : ''}`}
                required
              />
              {errors.fatherReligion && <span className="ErrorMessageFather">{errors.fatherReligion}</span>}
            </div>
          </div>
        </div>

        {/* Occupation and Age Section */}
        <div className="FormSectionFather">
          <div className="FormRowFather">
            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                17. OCCUPATION {requiredField}
              </div>
              <input
                type="text"
                name="fatherOccupation"
                value={formData?.fatherOccupation || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherOccupation ? 'error' : ''}`}
                required
              />
              {errors.fatherOccupation && <span className="ErrorMessageFather">{errors.fatherOccupation}</span>}
            </div>

            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                18. AGE at the time of this birth: {requiredField}
              </div>
              <input
                type="text"
                name="fatherAge"
                value={formData?.fatherAge || ''}
                onChange={handleNumberInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherAge ? 'error' : ''}`}
                placeholder="Enter number only"
                required
              />
              {errors.fatherAge && <span className="ErrorMessageFather">{errors.fatherAge}</span>}
            </div>
          </div>
        </div>

        {/* Residence Section */}
        <div className="FormSectionFather">
          <div className="SectionTitleFather">
            19. RESIDENCE {requiredField}
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">
                House NO., Street {requiredField}
              </label>
              <input
                type="text"
                name="fatherStreet"
                value={formData?.fatherStreet || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherStreet ? 'error' : ''}`}
                required
              />
              {errors.fatherStreet && <span className="ErrorMessageFather">{errors.fatherStreet}</span>}
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Barangay {requiredField}
              </label>
              <input
                type="text"
                name="fatherBarangay"
                value={formData?.fatherBarangay || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherBarangay ? 'error' : ''}`}
                required
              />
              {errors.fatherBarangay && <span className="ErrorMessageFather">{errors.fatherBarangay}</span>}
            </div>
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">
                City/Municipality {requiredField}
              </label>
              <input
                type="text"
                name="fatherCity"
                value={formData?.fatherCity || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherCity ? 'error' : ''}`}
                required
              />
              {errors.fatherCity && <span className="ErrorMessageFather">{errors.fatherCity}</span>}
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Province {requiredField}
              </label>
              <input
                type="text"
                name="fatherProvince"
                value={formData?.fatherProvince || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherProvince ? 'error' : ''}`}
                required
              />
              {errors.fatherProvince && <span className="ErrorMessageFather">{errors.fatherProvince}</span>}
            </div>
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Country {requiredField}
              </label>
              <input
                type="text"
                name="fatherCountry"
                value={formData?.fatherCountry || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherCountry ? 'error' : ''}`}
                required
              />
              {errors.fatherCountry && <span className="ErrorMessageFather">{errors.fatherCountry}</span>}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
});

export default FatherIdentifyingForm;
