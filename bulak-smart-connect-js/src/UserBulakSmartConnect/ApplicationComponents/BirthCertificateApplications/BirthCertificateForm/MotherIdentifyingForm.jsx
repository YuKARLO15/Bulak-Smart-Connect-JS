import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './MotherIdentifyingForm.css';

const MotherInformationBirthForm = forwardRef(({ formData, handleChange }, ref) => {
  const [showExtension, setShowExtension] = useState(false);
  const [errors, setErrors] = useState({});
  const requiredField = <span className="RequiredFieldMother">*</span>;

  const validateNumberOnly = e => {
    if (!/^\d*$/.test(e.target.value)) {
      return;
    }

    handleChange(e);
  };

  // Handle number input change with validation
  const handleNumberInputChange = e => {
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

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation based on the parent form's required fields for step 2
    if (!formData?.motherLastName?.trim()) {
      newErrors.motherLastName = 'This field is required';
    }
    if (!formData?.motherFirstName?.trim()) {
      newErrors.motherFirstName = 'This field is required';
    }
    if (!formData?.motherCitizenship?.trim()) {
      newErrors.motherCitizenship = 'This field is required';
    }
    if (!formData?.motherReligion?.trim()) {
      newErrors.motherReligion = 'This field is required';
    }
    if (!formData?.motherTotalChildren?.trim()) {
      newErrors.motherTotalChildren = 'This field is required';
    }
    if (!formData?.motherLivingChildren?.trim()) {
      newErrors.motherLivingChildren = 'This field is required';
    }

    if (!formData?.motherOccupation?.trim()) {
      newErrors.motherOccupation = 'This field is required';
    }
    if (!formData?.motherAge?.trim()) {
      newErrors.motherAge = 'This field is required';
    }
    if (!formData?.motherStreet?.trim()) {
      newErrors.motherStreet = 'This field is required';
    }
    if (!formData?.motherCity?.trim()) {
      newErrors.motherCity = 'This field is required';
    }
    if (!formData?.motherBarangay?.trim()) {
      newErrors.motherBarangay = 'This field is required';
    }
    if (!formData?.motherProvince?.trim()) {
      newErrors.motherProvince = 'This field is required';
    }
    if (!formData?.motherCountry?.trim()) {
      newErrors.motherCountry = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate individual field
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'motherLastName':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherFirstName':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherCitizenship':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherReligion':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherTotalChildren':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherLivingChildren':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherDeceasedChildren':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherOccupation':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherAge':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherStreet':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherCity':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherBarangay':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherProvince':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'motherCountry':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Handle input change and clear errors
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

  // Handle blur event for validation
  const handleBlur = e => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error,
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
          const firstErrorElement = document.querySelector(
            '.FormInputMother.error, .SelectInputMother.error'
          );
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorElement.focus();
          }
        }, 100);
      }

      return isValid;
    },
  }));
  return (
    <div className="BirthFormContainerMother">
      <div className="FormHeaderMother">II. MOTHER IDENTIFYING INFORMATION</div>

      <div className="FormContentMother">
        {/* Maiden Name Section */}
        <div className="FormSectionMother">
          <div className="SectionTitleMother">7. MAIDEN NAME (Pangalan sa Pagkadalaga)</div>

          <div className="FormRowMother">
            <div className="FormGroupMother">
              <label className="FormLabelMother">First Name (Pangalan) {requiredField}</label>
              <input
                type="text"
                name="motherFirstName"
                value={formData?.motherFirstName || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherFirstName ? 'error' : ''}`}
                required
              />
              {errors.motherFirstName && (
                <span className="ErrorMessageMother">{errors.motherFirstName}</span>
              )}
            </div>

            <div className="FormGroupMother">
              <label className="FormLabelMother">Middle Name (Gitnang Pangalan) Optional</label>
              <input
                type="text"
                name="motherMiddleName"
                value={formData?.motherMiddleName || ''}
                onChange={handleChange}
                className="FormInputMother"
              />
            </div>

            <div className="FormGroupMother">
              <label className="FormLabelMother">Last Name (Apelyido) {requiredField}</label>
              <input
                type="text"
                name="motherLastName"
                value={formData?.motherLastName || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherLastName ? 'error' : ''}`}
                required
              />
              {errors.motherLastName && (
                <span className="ErrorMessageMother">{errors.motherLastName}</span>
              )}
            </div>
          </div>

          <div className="FormRowMother">
            <div className="CheckboxContainerMother">
              <input
                type="checkbox"
                id="extensionCheckboxMother"
                checked={showExtension}
                onChange={() => setShowExtension(!showExtension)}
                className="CheckboxInputMother"
              />
              <label htmlFor="extensionCheckboxMother" className="CheckboxLabelMother">
                Check this box if the MOTHER have extension name
              </label>
            </div>

            {showExtension && (
              <div className="ExtensionContainerMother">
                <span className="ExtensionLabelMother">Extension</span>
                <select
                  name="motherExtension"
                  value={formData?.motherExtension || ''}
                  onChange={handleChange}
                  className="SelectInputMother"
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
        <div className="FormSectionMother">
          <div className="FormRowMother">
            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">8. CITIZENSHIP {requiredField}</div>
              <input
                type="text"
                name="motherCitizenship"
                value={formData?.motherCitizenship || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherCitizenship ? 'error' : ''}`}
                required
              />
              {errors.motherCitizenship && (
                <span className="ErrorMessageMother">{errors.motherCitizenship}</span>
              )}
            </div>

            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                9. RELIGION/ RELIGIOUS SECT {requiredField}
              </div>
              <input
                type="text"
                name="motherReligion"
                value={formData?.motherReligion || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherReligion ? 'error' : ''}`}
                required
              />
              {errors.motherReligion && (
                <span className="ErrorMessageMother">{errors.motherReligion}</span>
              )}
            </div>
          </div>
        </div>

        {/* Children Information Section */}
        <div className="FormSectionMother">
          <div className="FormRowMother">
            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                10a. Total number of mother's children born alive: {requiredField}
              </div>
              <input
                type="text"
                name="motherTotalChildren"
                value={formData?.motherTotalChildren || ''}
                onChange={handleNumberInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherTotalChildren ? 'error' : ''}`}
                placeholder="Enter number only"
                required
              />
              {errors.motherTotalChildren && (
                <span className="ErrorMessageMother">{errors.motherTotalChildren}</span>
              )}
            </div>

            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                10b. No. of children still living including this birth: {requiredField}
              </div>
              <input
                type="text"
                name="motherLivingChildren"
                value={formData?.motherLivingChildren || ''}
                onChange={handleNumberInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherLivingChildren ? 'error' : ''}`}
                placeholder="Enter number only"
                required
              />
              {errors.motherLivingChildren && (
                <span className="ErrorMessageMother">{errors.motherLivingChildren}</span>
              )}
            </div>

            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                10c. No. of children born alive but are now dead:
              </div>
              <input
                type="text"
                name="motherDeceasedChildren"
                value={formData?.motherDeceasedChildren || ''}
                onChange={handleNumberInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherDeceasedChildren ? 'error' : ''}`}
                placeholder="Enter number only"
              />
              {errors.motherDeceasedChildren && (
                <span className="ErrorMessageMother">{errors.motherDeceasedChildren}</span>
              )}
            </div>
          </div>
        </div>

        {/* Occupation and Age Section */}
        <div className="FormSectionMother">
          <div className="FormRowMother">
            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">11. OCCUPATION {requiredField}</div>
              <input
                type="text"
                name="motherOccupation"
                value={formData?.motherOccupation || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherOccupation ? 'error' : ''}`}
                required
              />
              {errors.motherOccupation && (
                <span className="ErrorMessageMother">{errors.motherOccupation}</span>
              )}
            </div>

            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                12. AGE at the time of this birth: {requiredField}
              </div>
              <input
                type="text"
                name="motherAge"
                value={formData?.motherAge || ''}
                onChange={handleNumberInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherAge ? 'error' : ''}`}
                placeholder="Enter number only"
                required
              />
              {errors.motherAge && <span className="ErrorMessageMother">{errors.motherAge}</span>}
            </div>
          </div>
        </div>

        {/* Residence Section */}
        <div className="FormSectionMother">
          <div className="SectionTitleMother">13. RESIDENCE</div>

          <div className="FormRowMother">
            <div className="FormFullWidthGroupMother">
              <label className="FormLabelMother">House NO., Street {requiredField}</label>
              <input
                type="text"
                name="motherStreet"
                value={formData?.motherStreet || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherStreet ? 'error' : ''}`}
                required
              />
              {errors.motherStreet && (
                <span className="ErrorMessageMother">{errors.motherStreet}</span>
              )}
            </div>
          </div>

          <div className="FormRowMother">
            <div className="FormGroupMother">
              <label className="FormLabelMother">Barangay {requiredField}</label>
              <input
                type="text"
                name="motherBarangay"
                value={formData?.motherBarangay || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherBarangay ? 'error' : ''}`}
                required
              />
              {errors.motherBarangay && (
                <span className="ErrorMessageMother">{errors.motherBarangay}</span>
              )}
            </div>

            <div className="FormGroupMother">
              <label className="FormLabelMother">City/Municipality {requiredField}</label>
              <input
                type="text"
                name="motherCity"
                value={formData?.motherCity || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherCity ? 'error' : ''}`}
                required
              />
              {errors.motherCity && <span className="ErrorMessageMother">{errors.motherCity}</span>}
            </div>
          </div>

          <div className="FormRowMother">
            <div className="FormGroupMother">
              <label className="FormLabelMother">Province {requiredField}</label>
              <input
                type="text"
                name="motherProvince"
                value={formData?.motherProvince || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherProvince ? 'error' : ''}`}
                required
              />
              {errors.motherProvince && (
                <span className="ErrorMessageMother">{errors.motherProvince}</span>
              )}
            </div>

            <div className="FormGroupMother">
              <label className="FormLabelMother">Country {requiredField}</label>
              <input
                type="text"
                name="motherCountry"
                value={formData?.motherCountry || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputMother ${errors.motherCountry ? 'error' : ''}`}
                required
              />
              {errors.motherCountry && (
                <span className="ErrorMessageMother">{errors.motherCountry}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MotherInformationBirthForm.displayName = 'MotherInformationBirthForm';

export default MotherInformationBirthForm;
