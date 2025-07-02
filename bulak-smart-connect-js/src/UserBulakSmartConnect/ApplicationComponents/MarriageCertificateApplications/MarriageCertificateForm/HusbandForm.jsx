import React from 'react';
// import './MarriageCertificateForm.css';
import './MarriageCertificateForm.css';

const HusbandForm = ({ formData, handleChange, errors, isMarriageLicense = false }) => {
  const selectedOption = localStorage.getItem('selectedMarriageOption');
  const isLicenseApplication = isMarriageLicense || selectedOption === 'Marriage License';
  
  return (
    <section className="husband-section section">
      <h3 className="husband-heading">I. HUSBAND</h3>

      {/* HUSBAND DETAILS HEADER */}
      <h4 className="husband-subheading">Personal Information</h4>

      {/* Full Name */}
      <label className="husband-label">1. FULL NAME *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandFirstName"
            className="husband-input"
            placeholder="First Name (Pangalan)"
            value={formData.husbandFirstName || ''}
            onChange={handleChange}
          />
          {errors.husbandFirstName && (
            <span className="husband-error error-message">{errors.husbandFirstName}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandMiddleName"
            className="husband-input"
            placeholder="Middle Name (Gitnang Pangalan)"
            value={formData.husbandMiddleName || ''}
            onChange={handleChange}
          />
          {errors.husbandMiddleName && (
            <span className="husband-error error-message">{errors.husbandMiddleName}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandLastName"
            className="husband-input"
            placeholder="Last Name (Apelyido)"
            value={formData.husbandLastName || ''}
            onChange={handleChange}
          />
          {errors.husbandLastName && (
            <span className="husband-error error-message">{errors.husbandLastName}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandExtension"
            className="husband-input"
            placeholder="Extension (e.g., Jr., Sr.)"
            value={formData.husbandExtension || ''}
            onChange={handleChange}
          />
          {errors.husbandExtension && (
            <span className="husband-error error-message">{errors.husbandExtension}</span>
          )}
        </div>
      </div>

      {/* Birth Date */}
      <label className="husband-label">2a. BIRTH DATE (Kaarawan) *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <select
            name="husbandBirthMonth"
            className="husband-select"
            value={formData.husbandBirthMonth || ''}
            onChange={handleChange}
          >
            <option value="" disabled>
              Month
            </option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
          {errors.husbandBirthMonth && (
            <span className="husband-error error-message">{errors.husbandBirthMonth}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <select
            name="husbandBirthDay"
            className="husband-select"
            value={formData.husbandBirthDay || ''}
            onChange={handleChange}
          >
            <option value="" disabled>
              Day
            </option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          {errors.husbandBirthDay && (
            <span className="husband-error error-message">{errors.husbandBirthDay}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <select
            name="husbandBirthYear"
            className="husband-select"
            value={formData.husbandBirthYear || ''}
            onChange={handleChange}
          >
            <option value="" disabled>
              Year
            </option>
            {Array.from({ length: 100 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          {errors.husbandBirthYear && (
            <span className="husband-error error-message">{errors.husbandBirthYear}</span>
          )}
        </div>
      </div>

      {/* Age */}
      <label className="husband-label">2b. AGE *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandAge"
            className="husband-input"
            placeholder="Age"
            value={formData.husbandAge || ''}
            onChange={handleChange}
          />
          {errors.husbandAge && (
            <span className="husband-error error-message">{errors.husbandAge}</span>
          )}
        </div>
      </div>

      {/* Place of Birth */}
      <label className="husband-label">3. PLACE OF BIRTH (Lugar ng Kapanganakan) *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandBirthCity"
            className="husband-input"
            placeholder="City/Municipality"
            value={formData.husbandBirthCity || ''}
            onChange={handleChange}
          />
          {errors.husbandBirthCity && (
            <span className="husband-error error-message">{errors.husbandBirthCity}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandBirthProvince"
            className="husband-input"
            placeholder="Province"
            value={formData.husbandBirthProvince || ''}
            onChange={handleChange}
          />
          {errors.husbandBirthProvince && (
            <span className="husband-error error-message">{errors.husbandBirthProvince}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandBirthCountry"
            className="husband-input"
            placeholder="Country"
            value={formData.husbandBirthCountry || ''}
            onChange={handleChange}
          />
          {errors.husbandBirthCountry && (
            <span className="husband-error error-message">{errors.husbandBirthCountry}</span>
          )}
        </div>
      </div>

      {/* Sex */}
      <label className="husband-label">4a. SEX (Kasarian) *</label>
      <div className="husband-radio-group radio-group">
        <div className="husband-radio-container input-radio-container">
          <input
            type="radio"
            name="husbandSex"
            className="husband-radio"
            value="Male"
            checked={formData.husbandSex === 'Male'}
            onChange={handleChange}
          />{' '}
          Male
          {errors.husbandSex && (
            <span className="husband-error error-message">{errors.husbandSex}</span>
          )}
          <input
            type="radio"
            name="husbandSex"
            className="husband-radio"
            value="Female"
            checked={formData.husbandSex === 'Female'}
            onChange={handleChange}
          />{' '}
          Female
        </div>
      </div>

      {/* Citizenship */}
      <label className="husband-label">4b. CITIZENSHIP *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandCitizenship"
            className="husband-input"
            placeholder="Citizenship"
            value={formData.husbandCitizenship || ''}
            onChange={handleChange}
          />
          {errors.husbandCitizenship && (
            <span className="husband-error error-message">{errors.husbandCitizenship}</span>
          )}
        </div>
      </div>

      {/* Residence */}
      <label className="husband-label">5. RESIDENCE *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandStreet"
            className="husband-input"
            placeholder="House No., Street"
            value={formData.husbandStreet || ''}
            onChange={handleChange}
          />
          {errors.husbandStreet && (
            <span className="husband-error error-message">{errors.husbandStreet}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandBarangay"
            className="husband-input"
            placeholder="Barangay"
            value={formData.husbandBarangay || ''}
            onChange={handleChange}
          />
          {errors.husbandBarangay && (
            <span className="husband-error error-message">{errors.husbandBarangay}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandCity"
            className="husband-input"
            placeholder="City/Municipality"
            value={formData.husbandCity || ''}
            onChange={handleChange}
          />
          {errors.husbandCity && (
            <span className="husband-error error-message">{errors.husbandCity}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandProvince"
            className="husband-input"
            placeholder="Province"
            value={formData.husbandProvince || ''}
            onChange={handleChange}
          />
          {errors.husbandProvince && (
            <span className="husband-error error-message">{errors.husbandProvince}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandCountry"
            className="husband-input"
            placeholder="Country"
            value={formData.husbandCountry || ''}
            onChange={handleChange}
          />
          {errors.husbandCountry && (
            <span className="husband-error error-message">{errors.husbandCountry}</span>
          )}
        </div>
      </div>

      {/* Religion */}
      <label className="husband-label">6. RELIGION/RELIGIOUS SECT *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandReligion"
            className="husband-input"
            placeholder="Religion"
            value={formData.husbandReligion || ''}
            onChange={handleChange}
          />
          {errors.husbandReligion && (
            <span className="husband-error error-message">{errors.husbandReligion}</span>
          )}
        </div>
      </div>

      {/* civil Status */}
      <label className="husband-label">7. CIVIL STATUS *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandCivilStatus"
            className="husband-input"
            placeholder="Civil Status"
            value={formData.husbandCivilStatus || ''}
            onChange={handleChange}
          />
          {errors.husbandCivilStatus && (
            <span className="husband-error error-message">{errors.husbandCivilStatus}</span>
          )}
        </div>
      </div>

      {/* PREVIOUS MARRIAGE SECTION - Only for Marriage License */}
      {isLicenseApplication && (
        <>
          <h4 className="husband-subheading">Previous Marriage Information</h4>
          
          {/* Checkbox for previous marriage */}
          <div className="husband-checkbox-group">
            <label className="husband-checkbox-label">
              <input
                type="checkbox"
                name="hasPreviousMarriage"
                checked={formData.hasPreviousMarriage || false}
                onChange={handleChange}
              />
              I was previously married
            </label>
          </div>

          {/* Show dissolution fields only if checkbox is checked */}
          {formData.hasPreviousMarriage && (
            <>
              <label className="husband-label">15. HOW WAS PREVIOUS MARRIAGE DISSOLVED? *</label>
              <div className="husband-input-group input-group">
                <div className="husband-input-container input-container">
                  <select
                    name="husbandPreviousMarriageStatus"
                    className="husband-select"
                    value={formData.husbandPreviousMarriageStatus || ''}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select</option>
                    <option value="Death">Death</option>
                    <option value="Annulment">Annulment</option>
                    <option value="Divorce">Divorce</option>
                    <option value="Legal Separation">Legal Separation</option>
                  </select>
                  {errors.husbandPreviousMarriageStatus && (
                    <span className="husband-error error-message">
                      {errors.husbandPreviousMarriageStatus}
                    </span>
                  )}
                </div>
              </div>

              <label className="husband-label">16. PLACE WHERE DISSOLVED *</label>
              <div className="husband-input-group input-group">
                <div className="husband-input-container input-container">
                  <input
                    type="text"
                    name="husbandDissolutionCity"
                    className="husband-input"
                    placeholder="City/Municipality"
                    value={formData.husbandDissolutionCity || ''}
                    onChange={handleChange}
                  />
                  {errors.husbandDissolutionCity && (
                    <span className="husband-error error-message">
                      {errors.husbandDissolutionCity}
                    </span>
                  )}
                </div>
                <div className="husband-input-container input-container">
                  <input
                    type="text"
                    name="husbandDissolutionProvince"
                    className="husband-input"
                    placeholder="Province"
                    value={formData.husbandDissolutionProvince || ''}
                    onChange={handleChange}
                  />
                  {errors.husbandDissolutionProvince && (
                    <span className="husband-error error-message">
                      {errors.husbandDissolutionProvince}
                    </span>
                  )}
                </div>
                <div className="husband-input-container input-container">
                  <input
                    type="text"
                    name="husbandDissolutionCountry"
                    className="husband-input"
                    placeholder="Country"
                    value={formData.husbandDissolutionCountry || ''}
                    onChange={handleChange}
                  />
                  {errors.husbandDissolutionCountry && (
                    <span className="husband-error error-message">
                      {errors.husbandDissolutionCountry}
                    </span>
                  )}
                </div>
              </div>

              <label className="husband-label">17. DATE WHEN DISSOLVED *</label>
              <div className="husband-input-group input-group">
                <div className="husband-input-container input-container">
                  <select
                    name="husbandDissolutionDay"
                    className="husband-select"
                    value={formData.husbandDissolutionDay || ''}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Day
                    </option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  {errors.husbandDissolutionDay && (
                    <span className="husband-error error-message">
                      {errors.husbandDissolutionDay}
                    </span>
                  )}
                </div>
                <div className="husband-input-container input-container">
                  <select
                    name="husbandDissolutionMonth"
                    className="husband-select"
                    value={formData.husbandDissolutionMonth || ''}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Month
                    </option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                  {errors.husbandDissolutionMonth && (
                    <span className="husband-error error-message">
                      {errors.husbandDissolutionMonth}
                    </span>
                  )}
                </div>
                <div className="husband-input-container input-container">
                  <select
                    name="husbandDissolutionYear"
                    className="husband-select"
                    value={formData.husbandDissolutionYear || ''}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Year
                    </option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                  {errors.husbandDissolutionYear && (
                    <span className="husband-error error-message">
                      {errors.husbandDissolutionYear}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* FATHER'S INFORMATION HEADER */}
      <h4 className="husband-subheading">Father's Information</h4>

      {/* Father's Name */}
      <label className="husband-label">8. NAME OF FATHER (Buong Pangalan ng Ama) *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandFatherFirstName"
            className="husband-input"
            placeholder="First Name"
            value={formData.husbandFatherFirstName || ''}
            onChange={handleChange}
          />
          {errors.husbandFatherFirstName && (
            <span className="husband-error error-message">{errors.husbandFatherFirstName}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandFatherMiddleName"
            className="husband-input"
            placeholder="Middle Name"
            value={formData.husbandFatherMiddleName || ''}
            onChange={handleChange}
          />
          {errors.husbandFatherMiddleName && (
            <span className="husband-error error-message">{errors.husbandFatherMiddleName}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandFatherLastName"
            className="husband-input"
            placeholder="Last Name"
            value={formData.husbandFatherLastName || ''}
            onChange={handleChange}
          />
          {errors.husbandFatherLastName && (
            <span className="husband-error error-message">{errors.husbandFatherLastName}</span>
          )}
        </div>
      </div>

      {/* Father's Citizenship */}
      <label className="husband-label">9. CITIZENSHIP OF FATHER *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandFatherCitizenship"
            className="husband-input"
            placeholder="Citizenship"
            value={formData.husbandFatherCitizenship || ''}
            onChange={handleChange}
          />
          {errors.husbandFatherCitizenship && (
            <span className="husband-error error-message">{errors.husbandFatherCitizenship}</span>
          )}
        </div>
      </div>
      {isLicenseApplication && (
        <>
          <label className="husband-label">9b. FATHER'S RESIDENCE *</label>
          <div className="husband-input-group input-group">
            <div className="husband-input-container input-container">
              <textarea
                name="husbandFatherAddress"
                className="husband-input"
                placeholder="Complete Address"
                value={formData.husbandFatherAddress || ''}
                onChange={handleChange}
                rows={2}
              ></textarea>
              {errors.husbandFatherAddress && (
                <span className="husband-error error-message">{errors.husbandFatherAddress}</span>
              )}
            </div>
          </div>
        </>
      )}

      {/* MOTHER'S INFORMATION HEADER */}
      <h4 className="husband-subheading">Mother's Information</h4>

      {/* Mother's Maiden Name */}
      <label className="husband-label">
        10. MOTHER'S MAIDEN NAME (Pangalan ng Ina sa Pagkadalaga) *
      </label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandMotherFirstName"
            className="husband-input"
            placeholder="First Name"
            value={formData.husbandMotherFirstName || ''}
            onChange={handleChange}
          />
          {errors.husbandMotherFirstName && (
            <span className="husband-error error-message">{errors.husbandMotherFirstName}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandMotherMiddleName"
            className="husband-input"
            placeholder="Middle Name"
            value={formData.husbandMotherMiddleName || ''}
            onChange={handleChange}
          />
          {errors.husbandMotherMiddleName && (
            <span className="husband-error error-message">{errors.husbandMotherMiddleName}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandMotherLastName"
            className="husband-input"
            placeholder="Last Name"
            value={formData.husbandMotherLastName || ''}
            onChange={handleChange}
          />
          {errors.husbandMotherLastName && (
            <span className="husband-error error-message">{errors.husbandMotherLastName}</span>
          )}
        </div>
      </div>

      {/* Mother's Citizenship */}
      <label className="husband-label">11. CITIZENSHIP OF MOTHER *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="husbandMotherCitizenship"
            className="husband-input"
            placeholder="Citizenship"
            value={formData.husbandMotherCitizenship || ''}
            onChange={handleChange}
          />
          {errors.husbandMotherCitizenship && (
            <span className="husband-error error-message">{errors.husbandMotherCitizenship}</span>
          )}
        </div>
      </div>
      {isLicenseApplication && (
        <>
          <label className="husband-label">11b. MOTHER'S RESIDENCE *</label>
          <div className="husband-input-group input-group">
            <div className="husband-input-container input-container">
              <textarea
                name="husbandMotherAddress"
                className="husband-input"
                placeholder="Complete Address"
                value={formData.husbandMotherAddress || ''}
                onChange={handleChange}
                rows={2}
              ></textarea>
              {errors.husbandMotherAddress && (
                <span className="husband-error error-message">{errors.husbandMotherAddress}</span>
              )}
            </div>
          </div>
        </>
      )}

      {/* PERSON WHO GAVE CONSENT/ADVICE HEADER */}
      <h4 className="husband-subheading">Person Who Gave Consent or Advice</h4>

      {/* Name of Person/Wali Who Gave Consent or Advice */}
      <label className="husband-label">
        12. NAME OF PERSON WHO GAVE CONSENT OR ADVICE *
      </label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="waliFirstName"
            className="husband-input wali-input"
            placeholder="First Name (Pangalan)"
            value={formData.waliFirstName || ''}
            onChange={handleChange}
          />
          {errors.waliFirstName && (
            <span className="husband-error error-message">{errors.waliFirstName}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="waliMiddleName"
            className="husband-input wali-input"
            placeholder="Middle Name (Gitnang Pangalan)"
            value={formData.waliMiddleName || ''}
            onChange={handleChange}
          />
          {errors.waliMiddleName && (
            <span className="husband-error error-message">{errors.waliMiddleName}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="waliLastName"
            className="husband-input wali-input"
            placeholder="Last Name (Apelyido)"
            value={formData.waliLastName || ''}
            onChange={handleChange}
          />
          {errors.waliLastName && (
            <span className="husband-error error-message">{errors.waliLastName}</span>
          )}
        </div>
      </div>

      {/* Relationship */}
      <label className="husband-label">13. RELATIONSHIP *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="waliRelationship"
            className="husband-input wali-input"
            placeholder="Relationship"
            value={formData.waliRelationship || ''}
            onChange={handleChange}
          />
          {errors.waliRelationship && (
            <span className="husband-error error-message">{errors.waliRelationship}</span>
          )}
        </div>
      </div>
      {isLicenseApplication && (
        <>
          <label className="husband-label">13a. CITIZENSHIP</label>
          <div className="husband-input-group input-group">
            <div className="husband-input-container input-container">
              <input
                type="text"
                name="waliCitizenship"
                className="husband-input wali-input"
                placeholder="Citizenship"
                value={formData.waliCitizenship || ''}
                onChange={handleChange}
              />
              {errors.waliCitizenship && (
                <span className="husband-error error-message">{errors.waliCitizenship}</span>
              )}
            </div>
          </div>
        </>
      )}

      {/* Residence */}
      <label className="husband-label">14. RESIDENCE *</label>
      <div className="husband-input-group input-group">
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="waliStreet"
            className="husband-input wali-input"
            placeholder="House No., Street"
            value={formData.waliStreet || ''}
            onChange={handleChange}
          />
          {errors.waliStreet && (
            <span className="husband-error error-message">{errors.waliStreet}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="waliBarangay"
            className="husband-input wali-input"
            placeholder="Barangay"
            value={formData.waliBarangay || ''}
            onChange={handleChange}
          />
          {errors.waliBarangay && (
            <span className="husband-error error-message">{errors.waliBarangay}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="waliCity"
            className="husband-input wali-input"
            placeholder="City/Municipality"
            value={formData.waliCity || ''}
            onChange={handleChange}
          />
          {errors.waliCity && (
            <span className="husband-error error-message">{errors.waliCity}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="waliProvince"
            className="husband-input wali-input"
            placeholder="Province"
            value={formData.waliProvince || ''}
            onChange={handleChange}
          />
          {errors.waliProvince && (
            <span className="husband-error error-message">{errors.waliProvince}</span>
          )}
        </div>
        <div className="husband-input-container input-container">
          <input
            type="text"
            name="waliCountry"
            className="husband-input wali-input"
            placeholder="Country"
            value={formData.waliCountry || ''}
            onChange={handleChange}
          />
          {errors.waliCountry && (
            <span className="husband-error error-message">{errors.waliCountry}</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default HusbandForm;