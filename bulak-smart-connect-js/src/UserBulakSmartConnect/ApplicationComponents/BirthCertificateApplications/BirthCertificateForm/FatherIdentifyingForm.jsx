import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './FatherIdentifyingForm.css';

const FatherIdentifyingForm = forwardRef(({ formData, handleChange }, ref) => {
  const [showExtension, setShowExtension] = useState(formData?.fatherHasExtension || false);
  const [notAcknowledgedByFather, setNotAcknowledgedByFather] = useState(
    formData?.notAcknowledgedByFather || false
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

    // Only validate if father is acknowledged
    if (!notAcknowledgedByFather) {
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

    // Only validate if father is acknowledged
    if (!notAcknowledgedByFather) {
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
          const firstErrorElement = document.querySelector('.FormInputFather.error, .SelectInputFather.error');
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorElement.focus();
          }
        }, 100);
      }
      
      return isValid;
    }
  }));

  const handleNotAcknowledgedChange = e => {
    const isChecked = e.target.checked;
    setNotAcknowledgedByFather(isChecked);
    
    // Clear all errors when "not acknowledged" is checked
    if (isChecked) {
      setErrors({});
    }
    
    handleChange({
      target: {
        name: 'notAcknowledgedByFather',
        value: isChecked,
      },
    });
  };

  return (
    <div className="BirthFormContainerFather">
      <div className="FormHeaderFather">III. FATHER IDENTIFYING INFORMATION</div>

      <div className="NotAcknowledgedCheckboxContainer CheckboxContainerFather">
        <input
          type="checkbox"
          id="notAcknowledgedByFather"
          checked={notAcknowledgedByFather}
          onChange={handleNotAcknowledgedChange}
          className="CheckboxInputFather"
        />
        <label htmlFor="notAcknowledgedByFather" className="CheckboxLabelFather">
          Not acknowledged by father
        </label>
      </div>

      <div className="FormContentFather">
        {/* Full Name Section */}
        <div className="FormSectionFather">
          <div className="SectionTitleFather">
            14. FULL NAME (Buong Pangalan) {!notAcknowledgedByFather && requiredField}
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">
                First Name (Pangalan) {!notAcknowledgedByFather && requiredField}
              </label>
              <input
                type="text"
                name="fatherFirstName"
                value={formData?.fatherFirstName || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherFirstName ? 'error' : ''}`}
                required={!notAcknowledgedByFather}
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
                Last Name (Apelyido) {!notAcknowledgedByFather && requiredField}
              </label>
              <input
                type="text"
                name="fatherLastName"
                value={formData?.fatherLastName || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherLastName ? 'error' : ''}`}
                required={!notAcknowledgedByFather}
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
                15. CITIZENSHIP {!notAcknowledgedByFather && requiredField}
              </div>
              <input
                type="text"
                name="fatherCitizenship"
                value={formData?.fatherCitizenship || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherCitizenship ? 'error' : ''}`}
                required={!notAcknowledgedByFather}
              />
              {errors.fatherCitizenship && <span className="ErrorMessageFather">{errors.fatherCitizenship}</span>}
            </div>

            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                16. RELIGION/ RELIGIOUS SECT {!notAcknowledgedByFather && requiredField}
              </div>
              <input
                type="text"
                name="fatherReligion"
                value={formData?.fatherReligion || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherReligion ? 'error' : ''}`}
                required={!notAcknowledgedByFather}
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
                17. OCCUPATION {!notAcknowledgedByFather && requiredField}
              </div>
              <input
                type="text"
                name="fatherOccupation"
                value={formData?.fatherOccupation || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherOccupation ? 'error' : ''}`}
                required={!notAcknowledgedByFather}
              />
              {errors.fatherOccupation && <span className="ErrorMessageFather">{errors.fatherOccupation}</span>}
            </div>

            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                18. AGE at the time of this birth: {!notAcknowledgedByFather && requiredField}
              </div>
              <input
                type="text"
                name="fatherAge"
                value={formData?.fatherAge || ''}
                onChange={handleNumberInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherAge ? 'error' : ''}`}
                placeholder="Enter number only"
                required={!notAcknowledgedByFather}
              />
              {errors.fatherAge && <span className="ErrorMessageFather">{errors.fatherAge}</span>}
            </div>
          </div>
        </div>

        {/* Residence Section */}
        <div className="FormSectionFather">
          <div className="SectionTitleFather">
            19. RESIDENCE {!notAcknowledgedByFather && requiredField}
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">
                House NO., Street {!notAcknowledgedByFather && requiredField}
              </label>
              <input
                type="text"
                name="fatherStreet"
                value={formData?.fatherStreet || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherStreet ? 'error' : ''}`}
                required={!notAcknowledgedByFather}
              />
              {errors.fatherStreet && <span className="ErrorMessageFather">{errors.fatherStreet}</span>}
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Barangay {!notAcknowledgedByFather && requiredField}
              </label>
              <input
                type="text"
                name="fatherBarangay"
                value={formData?.fatherBarangay || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherBarangay ? 'error' : ''}`}
                required={!notAcknowledgedByFather}
              />
              {errors.fatherBarangay && <span className="ErrorMessageFather">{errors.fatherBarangay}</span>}
            </div>
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">
                City/Municipality {!notAcknowledgedByFather && requiredField}
              </label>
              <input
                type="text"
                name="fatherCity"
                value={formData?.fatherCity || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherCity ? 'error' : ''}`}
                required={!notAcknowledgedByFather}
              />
              {errors.fatherCity && <span className="ErrorMessageFather">{errors.fatherCity}</span>}
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Province {!notAcknowledgedByFather && requiredField}
              </label>
              <input
                type="text"
                name="fatherProvince"
                value={formData?.fatherProvince || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherProvince ? 'error' : ''}`}
                required={!notAcknowledgedByFather}
              />
              {errors.fatherProvince && <span className="ErrorMessageFather">{errors.fatherProvince}</span>}
            </div>
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Country {!notAcknowledgedByFather && requiredField}
              </label>
              <input
                type="text"
                name="fatherCountry"
                value={formData?.fatherCountry || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputFather ${errors.fatherCountry ? 'error' : ''}`}
                required={!notAcknowledgedByFather}
              />
              {errors.fatherCountry && <span className="ErrorMessageFather">{errors.fatherCountry}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FatherIdentifyingForm;
