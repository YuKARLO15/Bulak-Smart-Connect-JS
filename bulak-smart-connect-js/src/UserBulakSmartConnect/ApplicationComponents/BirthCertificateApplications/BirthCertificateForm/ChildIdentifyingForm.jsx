import React, { useState } from 'react';
import './IdentifyingForm.css';

const ChildIdentifyingForm = ({ formData, handleChange }) => {
  const [showExtension, setShowExtension] = useState(false);
  const requiredField = <span className="RequiredFieldChild">*</span>;

  const validateNumberOnly = e => {
    if (!/^\d*$/.test(e.target.value)) {
      return;
    }

    handleChange(e);
  };

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
                onChange={handleChange}
                className="FormInputChild"
                required
              />
            </div>

            <div className="FormGroupChild">
              <label className="FormLabelChild">First Name (Pangalan) {requiredField}</label>
              <input
                type="text"
                name="firstName"
                value={formData?.firstName || ''}
                onChange={handleChange}
                className="FormInputChild"
                required
              />
            </div>

            <div className="FormGroupChild">
              <label className="FormLabelChild">
                Middle Name (Gitnang Pangalan) {requiredField}
              </label>
              <input
                type="text"
                name="middleName"
                value={formData?.middleName || ''}
                onChange={handleChange}
                className="FormInputChild"
                required
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
                    onChange={handleChange}
                    className="SelectInputChild DateSelectChild"
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
                    onChange={handleChange}
                    className="SelectInputChild DateSelectChild"
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
                    onChange={handleChange}
                    className="SelectInputChild DateSelectChild"
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
                        onChange={handleChange}
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
                        onChange={handleChange}
                        className="RadioInputChild"
                        required
                      />
                      Female
                    </label>
                  </div>
                </div>
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
              <label className="FormLabelChild">City/Municipality</label>
              <input
                type="text"
                name="city"
                value={formData?.city || ''}
                onChange={handleChange}
                className="FormInputChild"
              />
            </div>

            <div className="FormGroupChild">
              <label className="FormLabelChild">Province</label>
              <input
                type="text"
                name="province"
                value={formData?.province || ''}
                onChange={handleChange}
                className="FormInputChild"
              />
            </div>

            <div className="FormGroupChild">
              <label className="FormLabelChild">Barangay</label>
              <input
                type="text"
                name="barangay"
                value={formData?.barangay || ''}
                onChange={handleChange}
                className="FormInputChild"
              />
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
              <div className="SectionTitleHalfChild">5. A. TYPE OF BIRTH</div>
              <div className="TypeBirthContainerChild">
                <div className="RadioGroupChild">
                  <label className="RadioLabelChild">
                    <input
                      type="radio"
                      name="typeOfBirth"
                      value="Single"
                      checked={formData?.typeOfBirth === 'Single'}
                      onChange={handleChange}
                      className="RadioInputChild"
                    />
                    Single
                  </label>
                  <label className="RadioLabelChild">
                    <input
                      type="radio"
                      name="typeOfBirth"
                      value="Twins"
                      checked={formData?.typeOfBirth === 'Twins'}
                      onChange={handleChange}
                      className="RadioInputChild"
                    />
                    Twins
                  </label>
                  <label className="RadioLabelChild">
                    <input
                      type="radio"
                      name="typeOfBirth"
                      value="Triples, etc."
                      checked={formData?.typeOfBirth === 'Triples, etc.'}
                      onChange={handleChange}
                      className="RadioInputChild"
                    />
                    Triples, etc.
                  </label>
                </div>
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
          <div className="SectionTitleChild">C. BIRTH ORDER</div>
          <div className="FormRowChild">
            <div className="BirthOrderContainerChild">
              <div className="BirthOrderContainerChild">
                <input
                  type="text"
                  name="birthOrder"
                  value={formData?.birthOrder || ''}
                  onChange={validateNumberOnly}
                  className="FormInputChild"
                  placeholder="Enter number only"
                />
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
              <label className="FormLabelChild">6. WEIGHT AT BIRTH</label>
              <input
                type="text"
                name="birthWeight"
                value={formData?.birthWeight || ''}
                onChange={validateNumberOnly} // Use the number validation function here
                className="SmallInputChild"
                placeholder="Enter Number only"
              />
              <span className="WeightUnitChild">grams</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildIdentifyingForm;
