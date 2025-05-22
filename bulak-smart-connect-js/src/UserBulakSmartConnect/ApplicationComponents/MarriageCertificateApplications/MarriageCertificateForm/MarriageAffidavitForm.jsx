import React, { useState, useEffect } from 'react';
import './MarriageCertificateForm.css';

const MarriageAffidavitForm = ({
  formData,
  handleChange,
  errors: propErrors,
  onValidationChange,
}) => {
  const [errors, setErrors] = useState({});
  const [emptyFields, setEmptyFields] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Add useEffect to report validation status to parent component
  useEffect(() => {
    // When errors change, update validation status
    const isValid = Object.keys(errors).length === 0;
    setIsFormValid(isValid);

    // Report validation status to parent component if provided
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [errors, onValidationChange]);

  // Validate form on mount and when important data changes
  useEffect(() => {
    // Initial validation to ensure parent component knows status
    validateSilently();
  }, [formData]);

  // Silent validation that doesn't show UI errors but updates state
  const validateSilently = () => {
    const requiredFields = document.querySelectorAll('input[required]');
    let isValid = true;
    const newErrors = {};

    requiredFields.forEach(field => {
      const fieldName = field.name;
      if (!field.value.trim()) {
        newErrors[fieldName] = `This field is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Helper functions to get combined data from previous forms
  const getHusbandFullName = () => {
    const firstName = formData?.husbandFirstName || '';
    const middleName = formData?.husbandMiddleName || '';
    const lastName = formData?.husbandLastName || '';

    return [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
  };

  const getWifeFullName = () => {
    const firstName = formData?.wifeFirstName || '';
    const middleName = formData?.wifeMiddleName || '';
    const lastName = formData?.wifeLastName || '';

    return [firstName, middleName, lastName].filter(Boolean).join(' ').trim();
  };

  const getHusbandAddress = () => {
    const street = formData?.husbandStreet || '';
    const barangay = formData?.husbandBarangay || '';
    const city = formData?.husbandCity || '';
    const province = formData?.husbandProvince || '';

    return [street, barangay, city, province].filter(Boolean).join(', ').trim();
  };

  const getWifeAddress = () => {
    const street = formData?.wifeStreet || '';
    const barangay = formData?.wifeBarangay || '';
    const city = formData?.wifeCity || '';
    const province = formData?.wifeProvince || '';

    return [street, barangay, city, province].filter(Boolean).join(', ').trim();
  };

  const getMarriageDate = () => {
    const day = formData?.marriageDay || '';
    const month = formData?.marriageMonth || '';
    const year = formData?.marriageYear || '';

    if (month && day && year) {
      return `${month} ${day}, ${year}`;
    }
    return '';
  };

  const getMarriageLocation = () => {
    const barangay = formData?.marriageBarangay || '';
    const city = formData?.marriageCity || '';
    const province = formData?.marriageProvince || '';

    return [barangay, city, province]
      .filter(Boolean)
      .join(', ')
      .replace(/^,\s*|,\s*$/g, '')
      .replace(/,\s*,/g, ',');
  };

  // Updated handleInputChange to clear errors on input
  const handleInputChange = e => {
    const { name } = e.target;
    handleChange(e);

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Enhanced validation function
  const validate = () => {
    const newErrors = {};
    const requiredFields = document.querySelectorAll('input[required]');
    let isValid = true;

    // Check each required field
    requiredFields.forEach(field => {
      const fieldName = field.name;
      if (!field.value.trim()) {
        newErrors[fieldName] = `This field is required`;
        isValid = false;

        // Add visual indication
        field.classList.add('error-field');
      } else {
        field.classList.remove('error-field');
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);

    // Validate all fields
    const isValid = validate();

    if (isValid) {
      console.log('Form submitted successfully:', formData);
      // Parent component will handle actual submission
    } else {
      // Scroll to first error
      const firstErrorField = document.querySelector('.error-field');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }

      // Explicitly notify parent that submission should be blocked
      if (onValidationChange) {
        onValidationChange(false);
      }

      // Prevent form submission
      e.stopPropagation();
    }
  };

  // Current date information for auto-filling
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
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
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  // Required field indicator
  const requiredField = <span className="required-indicator">*</span>;

  return (
    <section className="affidavit-form-container">
      {/* Add required fields note */}
      <div className="required-fields-note">
        Fields marked with <span className="required-indicator">*</span> are required
      </div>

      <form onSubmit={handleSubmit} className="affidavit-form1-container">
        {/* Witnesses section */}
        <div className="affidavit-witnesses-section">
          <div className="affidavit-section-title">
            20b. WITNESSES (Print Name and Sign): {requiredField}
          </div>
          <div className="affidavit-witnesses-row">
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness1Name"
                className="affidavit-witness-input"
                onChange={handleInputChange}
                value={formData.witness1Name || ''}
                required
              />
              {errors.witness1Name && <div className="error-message">{errors.witness1Name}</div>}
            </div>
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness1Address"
                className="affidavit-witness-input"
                onChange={handleInputChange}
                value={formData.witness1Address || ''}
                required
              />
              {errors.witness1Address && (
                <div className="error-message">{errors.witness1Address}</div>
              )}
            </div>
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness1Signature"
                className="affidavit-witness-input"
                onChange={handleInputChange}
                value={formData.witness1Signature || ''}
                required
              />
              {errors.witness1Signature && (
                <div className="error-message">{errors.witness1Signature}</div>
              )}
            </div>
          </div>
          <div className="affidavit-witnesses-row">
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness2Name"
                className="affidavit-witness-input"
                onChange={handleInputChange}
                value={formData.witness2Name || ''}
                required
              />
              {errors.witness2Name && <div className="error-message">{errors.witness2Name}</div>}
            </div>
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness2Address"
                className="affidavit-witness-input"
                onChange={handleInputChange}
                value={formData.witness2Address || ''}
                required
              />
              {errors.witness2Address && (
                <div className="error-message">{errors.witness2Address}</div>
              )}
            </div>
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness2Signature"
                className="affidavit-witness-input"
                onChange={handleInputChange}
                value={formData.witness2Signature || ''}
                required
              />
              {errors.witness2Signature && (
                <div className="error-message">{errors.witness2Signature}</div>
              )}
            </div>
          </div>
        </div>

        {/* Affidavit of Solemnizing Officer */}
        <div className="affidavit-officer-section">
          <h3 className="affidavit-heading">AFFIDAVIT OF SOLEMNIZING OFFICER</h3>

          <div className="affidavit-content">
            <p className="affidavit-paragraph">
              I,{' '}
              <input
                type="text"
                name="solemnizingOfficerName"
                className="affidavit-form-input affidavit-inline-input"
                onChange={handleInputChange}
                value={formData.solemnizingOfficerName || ''}
                required
              />
              {requiredField}, of legal age, Solemnizing Officer of{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input"
                name="solemnizingOfficerInstitution"
                onChange={handleInputChange}
                value={formData.solemnizingOfficerInstitution || formData.marriageBarangay || ''}
                required
              />
              {requiredField} with address at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input"
                name="solemnizingOfficerAddress"
                onChange={handleInputChange}
                value={formData.solemnizingOfficerAddress || getMarriageLocation()}
                required
              />
              {requiredField}, after having sworn to in accordance with law, do hereby depose and
              say:
            </p>

            <div className="affidavit-numbered-items">
              <p className="affidavit-numbered-item">
                1. That I have solemnized the marriage between{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input"
                  name="husbandFullNameAffidavit"
                  onChange={handleInputChange}
                  value={formData.husbandFullNameAffidavit || getHusbandFullName()}
                  required
                />{' '}
                and{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input"
                  name="wifeFullNameAffidavit"
                  onChange={handleInputChange}
                  value={formData.wifeFullNameAffidavit || getWifeFullName()}
                  required
                />
                ;
              </p>

              <div className="affidavit-numbered-item">
                2.{' '}
                <div className="affidavit-checkbox-item">
                  <div className="affidavit-checkbox-container">
                    <input type="checkbox" id="item2a" />
                  </div>
                  <label htmlFor="item2a">
                    a. That I have ascertained the qualifications of the contracting parties and
                    have found no legal impediment for them to marry as required by Article 34 of
                    the Family Code;
                  </label>
                </div>
              </div>

              <div className="affidavit-checkbox-item">
                <div className="affidavit-checkbox-container">
                  <input type="checkbox" id="item2b" />
                </div>
                <label htmlFor="item2b">
                  b. That this marriage was performed in articulo mortis or at the point of death;
                </label>
              </div>

              <div className="affidavit-checkbox-item">
                <div className="affidavit-checkbox-container">
                  <input type="checkbox" id="item2c" />
                </div>
                <label htmlFor="item2c">
                  c. That the contracting party/ies{' '}
                  <input type="text" className="affidavit-form-input affidavit-inline-input" />,
                  being at the point of death and physically unable to sign the foregoing
                  certificate of marriage by signature or mark, one of the witnesses to the marriage
                  sign for him or her by writing the dying party's name and beneath it, the witness'
                  own signature preceded by the proposition "By";
                </label>
              </div>

              <div className="affidavit-checkbox-item">
                <div className="affidavit-checkbox-container">
                  <input type="checkbox" id="item2d" />
                </div>
                <label htmlFor="item2d">
                  d. That the residence of either party is so located that there is no means of
                  transportation to enable concerned party/parties to appear personally before the
                  civil registrar;
                </label>
              </div>

              <div className="affidavit-checkbox-item">
                <div className="affidavit-checkbox-container">
                  <input type="checkbox" id="item2e" />
                </div>
                <label htmlFor="item2e">
                  e. That the marriage was among Muslims or among members of the Ethnic Cultural
                  Communities and that the marriage was solemnized in accordance with their customs
                  and practices;
                </label>
              </div>

              <p className="affidavit-numbered-item">
                3. That I took the necessary steps to ascertain the ages and relationship of the
                contracting parties and that neither of them are under any legal impediment to marry
                each other;
              </p>

              <p className="affidavit-numbered-item">
                4. That I am executing this affidavit to attest to the truthfulness of the foregoing
                statements for all legal intents and purposes.
              </p>
            </div>

            <p className="affidavit-paragraph affidavit-truth-statement">
              In truth whereof, I have affixed my signature below this{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input"
                name="officerSignatureDay"
                onChange={handleInputChange}
                value={formData.officerSignatureDay || currentDay}
                required
              />{' '}
              day of{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
                name="officerSignatureMonth"
                onChange={handleInputChange}
                value={formData.officerSignatureMonth || currentMonth}
                required
              />
              ,{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input"
                name="officerSignatureYear"
                onChange={handleInputChange}
                value={formData.officerSignatureYear || currentYear}
                required
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
                name="officerSignaturePlace"
                onChange={handleInputChange}
                value={formData.officerSignaturePlace || getMarriageLocation()}
                required
              />
              , Philippines.
            </p>

            <div className="affidavit-signature-section">
              <div className="affidavit-signature-line">
                <input type="text" className="affidavit-signature-input" />
                <div className="affidavit-signature-label">
                  Signature Over Printed Name of the Solemnizing Officer
                </div>
              </div>
            </div>

            <p className="affidavit-paragraph affidavit-sworn-statement">
              SUBSCRIBED AND SWORN to before me this{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input"
              />{' '}
              day of{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
              />
              ,{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input"
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
              />
              , Philippines, affiant who exhibited to me his CTC/valid ID{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
              />
              .
            </p>

            <div className="affidavit-dual-signature-section">
              <div className="affidavit-signature-line">
                <input type="text" className="affidavit-signature-input" />
                <div className="affidavit-signature-label">
                  Signature of the Administering Officer
                </div>
              </div>
              <div className="affidavit-signature-line">
                <input type="text" className="affidavit-signature-input" />
                <div className="affidavit-signature-label">Position/Title/Designation</div>
              </div>
            </div>

            <div className="affidavit-dual-signature-section">
              <div className="affidavit-signature-line">
                <input type="text" className="affidavit-signature-input" />
                <div className="affidavit-signature-label">Name in Print</div>
              </div>
              <div className="affidavit-signature-line">
                <input type="text" className="affidavit-signature-input" />
                <div className="affidavit-signature-label">Address</div>
              </div>
            </div>
          </div>
        </div>

        {/* Affidavit for Delayed Registration section */}
        <div className="affidavit-delayed-section">
          <h3 className="affidavit-heading">AFFIDAVIT FOR DELAYED REGISTRATION OF MARRIAGE</h3>

          <div className="affidavit-content">
            <p className="affidavit-paragraph">
              I,{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input"
                name="delayedRegistrationApplicant"
                onChange={handleInputChange}
                value={formData.delayedRegistrationApplicant || getHusbandFullName()}
                required
              />
              , of legal age, {formData.husbandCivilStatus || 'single'}, with residence and postal
              address at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-large-input"
                name="delayedRegistrationAddress"
                onChange={handleInputChange}
                value={formData.delayedRegistrationAddress || getHusbandAddress()}
                required
              />
              , after having duly sworn in accordance with law do hereby depose and say:
            </p>

            <div className="affidavit-numbered-items">
              <div className="affidavit-numbered-item">
                1. That I am the applicant for the delayed registration of
                <div className="affidavit-checkbox-item affidavit-indent">
                  <div className="affidavit-checkbox-container">
                    <input type="checkbox" id="item1a" />
                  </div>
                  <label htmlFor="item1a">
                    my marriage with{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input"
                      name="spouseName"
                      onChange={handleInputChange}
                      value={formData.spouseName || getWifeFullName()}
                      required
                    />{' '}
                    in{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
                      name="marriagePlace"
                      onChange={handleInputChange}
                      value={formData.marriagePlace || getMarriageLocation()}
                      required
                    />{' '}
                    on{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
                      name="marriageDate"
                      onChange={handleInputChange}
                      value={formData.marriageDate || getMarriageDate()}
                      required
                    />
                    ,
                  </label>
                </div>
                <div className="affidavit-checkbox-item affidavit-indent">
                  <div className="affidavit-checkbox-container">
                    <input type="checkbox" id="item1b" />
                  </div>
                  <label htmlFor="item1b">
                    the marriage between{' '}
                    <input type="text" className="affidavit-form-input affidavit-inline-input" />{' '}
                    and{' '}
                    <input type="text" className="affidavit-form-input affidavit-inline-input" /> in{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
                    />{' '}
                    on{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
                    />
                    ,
                  </label>
                </div>
              </div>

              <div className="affidavit-numbered-item">
                2. That said marriage was solemnized by{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input affidavit-large-input"
                />{' '}
                (Solemnizing Officer's name) under
                <div className="affidavit-ceremony-types">
                  <div className="affidavit-ceremony-type">
                    <span>a.</span>
                    <input type="checkbox" id="ceremony-a" />
                    <label htmlFor="ceremony-a">religious ceremony</label>
                  </div>
                  <div className="affidavit-ceremony-type">
                    <span>b.</span>
                    <input type="checkbox" id="ceremony-b" />
                    <label htmlFor="ceremony-b">civil ceremony</label>
                  </div>
                  <div className="affidavit-ceremony-type">
                    <span>c.</span>
                    <input type="checkbox" id="ceremony-c" />
                    <label htmlFor="ceremony-c">Muslim rites</label>
                  </div>
                  <div className="affidavit-ceremony-type">
                    <span>d.</span>
                    <input type="checkbox" id="ceremony-d" />
                    <label htmlFor="ceremony-d">tribal rites</label>
                  </div>
                </div>
              </div>

              <div className="affidavit-numbered-item">
                3. That the marriage was solemnized:
                <div className="affidavit-sub-items">
                  <p>
                    a. with marriage license no.{' '}
                    <input type="text" className="affidavit-form-input affidavit-inline-input" />{' '}
                    issued on{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
                    />{' '}
                    at{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
                    />
                    ;
                  </p>
                  <p>
                    b. under Article{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-small-input"
                    />{' '}
                    (marriages of exceptional character);
                  </p>
                </div>
              </div>

              <p className="affidavit-numbered-item">
                4. (If the applicant is either the wife or husband) That I am a citizen of{' '}
                <input type="text" className="affidavit-form-input affidavit-inline-input" /> and my
                spouse is a citizen of{' '}
                <input type="text" className="affidavit-form-input affidavit-inline-input" />
              </p>

              <p className="affidavit-paragraph">
                (If the applicant is other than the wife or husband) That the wife is a citizen of{' '}
                <input type="text" className="affidavit-form-input affidavit-inline-input" /> and
                the husband is a citizen of{' '}
                <input type="text" className="affidavit-form-input affidavit-inline-input" />;
              </p>

              <p className="affidavit-numbered-item">
                5. That the reason for the delay in registering our/their marriage is{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input affidavit-large-input"
                  required
                />
                ;
              </p>

              <p className="affidavit-numbered-item">
                6. That I am executing this affidavit to attest to the truthfulness of the foregoing
                statements for all legal intents and purposes.
              </p>
            </div>

            <p className="affidavit-paragraph affidavit-truth-statement">
              In truth whereof, I have affixed my signature below this{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input"
              />{' '}
              day of{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
              />
              ,{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input"
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
              />
              , Philippines.
            </p>

            <div className="affidavit-signature-section">
              <div className="affidavit-signature-line">
                <input type="text" className="affidavit-signature-input" />
                <div className="affidavit-signature-label">
                  Signature Over Printed Name of Affiant
                </div>
              </div>
            </div>

            <p className="affidavit-paragraph affidavit-sworn-statement">
              SUBSCRIBED AND SWORN to before me this{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input"
              />{' '}
              day of{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
              />
              ,{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input"
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
              />
              , Philippines, affiant who exhibited to me his CTC/valid ID{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input"
              />
              .
            </p>

            <div className="affidavit-dual-signature-section">
              <div className="affidavit-signature-line">
                <input type="text" className="affidavit-signature-input" />
                <div className="affidavit-signature-label">
                  Signature of the Administering Officer
                </div>
              </div>
              <div className="affidavit-signature-line">
                <input type="text" className="affidavit-signature-input" />
                <div className="affidavit-signature-label">Position/Title/Designation</div>
              </div>
            </div>

            <div className="affidavit-dual-signature-section">
              <div className="affidavit-signature-line">
                <input type="text" className="affidavit-signature-input" />
                <div className="affidavit-signature-label">Name in Print</div>
              </div>
              <div className="affidavit-signature-line">
                <input type="text" className="affidavit-signature-input" />
                <div className="affidavit-signature-label">Address</div>
              </div>
            </div>
          </div>
        </div>

        {/* Error display */}
        {submitted && Object.keys(errors).length > 0 && (
          <div className="error-summary">
            <h4>Please correct the following errors:</h4>
            <ul>
              {Object.keys(errors).map(key => (
                <li key={key}>
                  {key}: {errors[key]}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form actions */}
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Submit Form
          </button>
        </div>
      </form>

      {/* Add CSS for error styling */}
      <style jsx>{`
        .required-indicator {
          color: red;
          margin-left: 3px;
        }

        .required-fields-note {
          margin-bottom: 15px;
          color: #555;
          font-size: 14px;
        }

        .error-field {
          border: 2px solid red !important;
          background-color: #fff6f6 !important;
        }

        .error-message {
          color: red;
          font-size: 12px;
          margin-top: 2px;
        }

        .error-summary {
          background-color: #fff6f6;
          border: 1px solid red;
          border-radius: 4px;
          padding: 10px;
          margin: 20px 0;
        }

        .error-summary h4 {
          color: red;
          margin-top: 0;
        }
      `}</style>
    </section>
  );
};

export default MarriageAffidavitForm;
