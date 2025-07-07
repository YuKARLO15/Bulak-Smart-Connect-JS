import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './IdentifyingForm.css';

const ChildIdentifyingForm = forwardRef(({ formData, handleChange }, ref) => {
  const [showExtension, setShowExtension] = useState(false);
  const [errors, setErrors] = useState({});
  const requiredField = <span className="RequiredFieldChild">*</span>;

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

    // Required fields validation (excluding hospital and multipleBirthOrder)
    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'This field is required';
    }
    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'This field is required';
    }
    if (!formData?.birthMonth) {
      newErrors.birthMonth = 'This field is required';
    }
    if (!formData?.birthDay) {
      newErrors.birthDay = 'This field is required';
    }
    if (!formData?.birthYear) {
      newErrors.birthYear = 'This field is required';
    }
    if (!formData?.sex) {
      newErrors.sex = 'This field is required';
    }
    // Hospital is not required (excluded)
    if (!formData?.city?.trim()) {
      newErrors.city = 'This field is required';
    }
    if (!formData?.province?.trim()) {
      newErrors.province = 'This field is required';
    }
    if (!formData?.barangay?.trim()) {
      newErrors.barangay = 'This field is required';
    }
    if (!formData?.typeOfBirth) {
      newErrors.typeOfBirth = 'This field is required';
    }
    // Multiple birth order is not required (excluded)
    if (!formData?.birthOrder?.trim()) {
      newErrors.birthOrder = 'This field is required';
    }
    if (!formData?.birthWeight?.trim()) {
      newErrors.birthWeight = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate individual field
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'lastName':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'firstName':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'birthMonth':
        if (!value) {
          error = 'This field is required';
        }
        break;
      case 'birthDay':
        if (!value) {
          error = 'This field is required';
        }
        break;
      case 'birthYear':
        if (!value) {
          error = 'This field is required';
        }
        break;
      case 'sex':
        if (!value) {
          error = 'This field is required';
        }
        break;
      case 'city':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'province':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'barangay':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'typeOfBirth':
        if (!value) {
          error = 'This field is required';
        }
        break;
      case 'birthOrder':
        if (!value?.trim()) {
          error = 'This field is required';
        }
        break;
      case 'birthWeight':
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

  // Handle radio button change (immediate validation)
  const handleRadioChange = e => {
    const { name } = e.target;

    // Clear error for radio buttons immediately when selected
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    handleChange(e);
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
            '.FormInputChild.error, .SelectInputChild.error, .SmallInputChild.error'
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
    <div className="BirthFormContainerChild">
      <div className="FormHeaderChild">I. CHILD IDENTIFYING INFORMATION</div>

      <div className="FormContentChild">
        {/* Full Name Section */}
        <div className="FormSectionChild">
          <div className="SectionTitleChild">1. FULL NAME (Buong Pangalan)</div>

          <div className="FormRowChild">
            <div className="FormGroupChild">
              <label className="FormLabelChild">Last Name (Apelyido) {requiredField}</label>
              <input
                type="text"
                name="lastName"
                value={formData?.lastName || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputChild ${errors.lastName ? 'error' : ''}`}
                required
              />
              {errors.lastName && <span className="ErrorMessageChild">{errors.lastName}</span>}
            </div>

            <div className="FormGroupChild">
              <label className="FormLabelChild">First Name (Pangalan) {requiredField}</label>
              <input
                type="text"
                name="firstName"
                value={formData?.firstName || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputChild ${errors.firstName ? 'error' : ''}`}
                required
              />
              {errors.firstName && <span className="ErrorMessageChild">{errors.firstName}</span>}
            </div>

            <div className="FormGroupChild">
              <label className="FormLabelChild">Middle Name (Gitnang Pangalan)</label>
              <input
                type="text"
                name="middleName"
                value={formData?.middleName || ''}
                onChange={handleChange}
                className="FormInputChild"
              />
            </div>
          </div>

          <div className="FormRowChild">
            <div className="CheckboxContainerChild">
              <input
                type="checkbox"
                id="extensionCheckbox"
                checked={showExtension}
                onChange={() => setShowExtension(!showExtension)}
                className="CheckboxInputChild"
              />
              <label htmlFor="extensionCheckbox" className="CheckboxLabelChild">
                Check this box if the Child has an extension name
              </label>
            </div>

            {showExtension && (
              <div className="ExtensionContainerChild">
                <span className="ExtensionLabelChild">Extension</span>
                <select
                  name="extension"
                  value={formData?.extension || ''}
                  onChange={handleChange}
                  className="SelectInputChild"
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

        {/* Birth Date and Sex Section */}

        <div className="FormSectionChild">
          <div className="FormRowChild">
            <div className="FormGroupChild" style={{ flex: 1 }}>
              <div className="SectionTitleHalfChild">2. BIRTH DATE (Kaarawan)</div>

              <div className="DateSectionContainerChild">
                <div className="DateRowChild">
                  <div className="DateLabelChild">Month {requiredField}</div>
                  <div className="DateLabelChild">Day {requiredField}</div>
                  <div className="DateLabelChild">Year {requiredField}</div>
                </div>
                <div className="DateInputsRowChild">
                  <select
                    name="birthMonth"
                    value={formData?.birthMonth || ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`SelectInputChild DateSelectChild ${errors.birthMonth ? 'error' : ''}`}
                    required
                  >
                    <option value="">Select</option>
                    {[
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
                    ].map(month => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <select
                    name="birthDay"
                    value={formData?.birthDay || ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`SelectInputChild DateSelectChild ${errors.birthDay ? 'error' : ''}`}
                    required
                  >
                    <option value="">Select</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <select
                    name="birthYear"
                    value={formData?.birthYear || ''}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`SelectInputChild DateSelectChild ${errors.birthYear ? 'error' : ''}`}
                    required
                  >
                    <option value="">Select</option>
                    {[...Array(100)].map((_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {(errors.birthMonth || errors.birthDay || errors.birthYear) && (
                  <div className="ErrorMessageChild">
                    {errors.birthMonth || errors.birthDay || errors.birthYear}
                  </div>
                )}
              </div>
            </div>

            <div
              className="FormGroupChild"
              style={{ flex: 1, alignSelf: 'flex-start', marginLeft: '140px' }}
            >
              <div className="SectionTitleHalfChild">3. SEX (Kasarian) {requiredField}</div>

              <div className="SexContainerChild">
                <div className="RadioGroupChild" style={{ marginTop: '24px' }}>
                  <div className="RadioGroupChild">
                    <label className="RadioLabelChild">
                      <input
                        type="radio"
                        name="sex"
                        value="Male"
                        checked={formData?.sex === 'Male'}
                        onChange={handleRadioChange}
                        className="RadioInputChild"
                        required
                      />
                      Male
                    </label>
                    <label className="RadioLabelChild">
                      <input
                        type="radio"
                        name="sex"
                        value="Female"
                        checked={formData?.sex === 'Female'}
                        onChange={handleRadioChange}
                        className="RadioInputChild"
                        required
                      />
                      Female
                    </label>
                  </div>
                </div>
                {errors.sex && <div className="ErrorMessageChild">{errors.sex}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="FormSectionChild">
          <div className="SectionTitleChild">4. PLACE OF BIRTH (Lugar ng Kapanganakan)</div>

          <div className="FormRowChild">
            <div className="FormFullWidthGroupChild">
              <label className="FormLabelChild">Name of Hospital/Clinic/Institution</label>
              <input
                type="text"
                name="hospital"
                value={formData?.hospital || ''}
                onChange={handleChange}
                className="FormInputChild"
              />
            </div>
          </div>

          <div className="FormRowChild">
            <div className="FormGroupChild">
              <label className="FormLabelChild">City/Municipality {requiredField}</label>
              <input
                type="text"
                name="city"
                value={formData?.city || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputChild ${errors.city ? 'error' : ''}`}
                required
              />
              {errors.city && <span className="ErrorMessageChild">{errors.city}</span>}
            </div>

            <div className="FormGroupChild">
              <label className="FormLabelChild">Province {requiredField}</label>
              <input
                type="text"
                name="province"
                value={formData?.province || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputChild ${errors.province ? 'error' : ''}`}
                required
              />
              {errors.province && <span className="ErrorMessageChild">{errors.province}</span>}
            </div>

            <div className="FormGroupChild">
              <label className="FormLabelChild">Barangay {requiredField}</label>
              <input
                type="text"
                name="barangay"
                value={formData?.barangay || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`FormInputChild ${errors.barangay ? 'error' : ''}`}
                required
              />
              {errors.barangay && <span className="ErrorMessageChild">{errors.barangay}</span>}
            </div>
          </div>

          <div className="FormRowChild FormRowSpaceBetweenChild">
            <label className="FormLabelChild">Residence (House No. / Block / Lot / Street)</label>
            <span className="NotRequiredLabelChild">Not Required</span>
          </div>

          <div className="FormRowChild">
            <div className="FormFullWidthGroupChild">
              <input
                type="text"
                name="residence"
                value={formData?.residence || ''}
                onChange={handleChange}
                className="FormInputChild"
              />
            </div>
          </div>
        </div>

        {/* Type of Birth Section */}
        <div className="FormSectionChild">
          <div className="FormRowChild">
            <div className="FormGroupChild" style={{ flex: 1 }}>
              <div className="SectionTitleHalfChild">5. A. TYPE OF BIRTH {requiredField}</div>
              <div className="TypeBirthContainerChild">
                <div className="RadioGroupChild">
                  <label className="RadioLabelChild">
                    <input
                      type="radio"
                      name="typeOfBirth"
                      value="Single"
                      checked={formData?.typeOfBirth === 'Single'}
                      onChange={handleRadioChange}
                      className="RadioInputChild"
                      required
                    />
                    Single
                  </label>
                  <label className="RadioLabelChild">
                    <input
                      type="radio"
                      name="typeOfBirth"
                      value="Twins"
                      checked={formData?.typeOfBirth === 'Twins'}
                      onChange={handleRadioChange}
                      className="RadioInputChild"
                      required
                    />
                    Twins
                  </label>
                  <label className="RadioLabelChild">
                    <input
                      type="radio"
                      name="typeOfBirth"
                      value="Triples, etc."
                      checked={formData?.typeOfBirth === 'Triples, etc.'}
                      onChange={handleRadioChange}
                      className="RadioInputChild"
                      required
                    />
                    Triples, etc.
                  </label>
                </div>
                {errors.typeOfBirth && (
                  <div className="ErrorMessageChild">{errors.typeOfBirth}</div>
                )}
              </div>
            </div>
            <div className="FormGroupChild" style={{ flex: 1 }}>
              <div className="SectionTitleHalfChild">B. IF MULTIPLE BIRTH, CHILD WAS</div>
              <div className="RadioGroupInlineChild">
                <label className="RadioLabelChild">
                  <input
                    type="radio"
                    name="multipleBirthOrder"
                    value="(1) FIRST"
                    checked={formData?.multipleBirthOrder === '(1) FIRST'}
                    onChange={handleChange}
                    className="RadioInputChild"
                  />
                  (1) FIRST
                </label>
                <label className="RadioLabelChild">
                  <input
                    type="radio"
                    name="multipleBirthOrder"
                    value="(2) SECOND"
                    checked={formData?.multipleBirthOrder === '(2) SECOND'}
                    onChange={handleChange}
                    className="RadioInputChild"
                  />
                  (2) SECOND
                </label>
                <label className="RadioLabelChild">
                  <input
                    type="radio"
                    name="multipleBirthOrder"
                    value="OTHERS, SPECIFY"
                    checked={formData?.multipleBirthOrder === 'OTHERS, SPECIFY'}
                    onChange={handleChange}
                    className="RadioInputChild"
                  />
                  OTHERS, SPECIFY
                </label>
                {formData?.multipleBirthOrder === 'OTHERS, SPECIFY' && (
                  <input
                    type="text"
                    name="multipleBirthOrderSpecify"
                    value={formData?.multipleBirthOrderSpecify || ''}
                    onChange={handleChange}
                    className="SmallInputChild"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="FormSectionChild">
          <div className="SectionTitleChild">C. BIRTH ORDER {requiredField}</div>
          <div className="FormRowChild">
            <div className="BirthOrderContainerChild">
              <div className="BirthOrderContainerChild">
                <input
                  type="text"
                  name="birthOrder"
                  value={formData?.birthOrder || ''}
                  onChange={handleNumberInputChange}
                  onBlur={handleBlur}
                  className={`FormInputChild ${errors.birthOrder ? 'error' : ''}`}
                  placeholder="Enter number only"
                  required
                />
                {errors.birthOrder && (
                  <span className="ErrorMessageChild">{errors.birthOrder}</span>
                )}
              </div>
              <div className="BirthOrderNoteChild">
                LIVE BIRTH AND FETAL DEATHS (INCLUDING THIS DELIVERY)
              </div>
              <div className="BirthOrderNoteChild">First, Second, Third, etc.</div>
            </div>
          </div>
        </div>

        <div className="FormSectionChild">
          <div className="FormRowChild">
            <div className="WeightContainerChild">
              <label className="FormLabelChild">6. WEIGHT AT BIRTH {requiredField}</label>
              <input
                type="text"
                name="birthWeight"
                value={formData?.birthWeight || ''}
                onChange={handleNumberInputChange}
                onBlur={handleBlur}
                className={`SmallInputChild ${errors.birthWeight ? 'error' : ''}`}
                placeholder="Enter Number only"
                required
              />
              <span className="WeightUnitChild">grams</span>
              {errors.birthWeight && <div className="ErrorMessageChild">{errors.birthWeight}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChildIdentifyingForm.displayName = 'ChildIdentifyingForm';

export default ChildIdentifyingForm;
