import React from 'react';
import './MarriageCertificateForm.css';

const WifeForm = ({ formData, handleChange, errors }) => {
  return (
    <section className="wife-section section">
      <h3 className="wife-heading">II. WIFE</h3>

      {/* Full Name */}
      <label className="wife-label">1. FULL NAME *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeFirstName"
            className="wife-input"
            placeholder="First Name (Pangalan)"
            value={formData.wifeFirstName || ''}
            onChange={handleChange}
          />
          {errors.wifeFirstName && (
            <span className="wife-error error-message">{errors.wifeFirstName}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeMiddleName"
            className="wife-input"
            placeholder="Middle Name (Gitnang Pangalan)"
            value={formData.wifeMiddleName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeLastName"
            className="wife-input"
            placeholder="Last Name (Apelyido)"
            value={formData.wifeLastName || ''}
            onChange={handleChange}
          />
          {errors.wifeLastName && (
            <span className="wife-error error-message">{errors.wifeLastName}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeExtension"
            className="wife-input"
            placeholder="Extension (e.g., Jr., Sr.)"
            value={formData.wifeExtension || ''}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Birth Date */}
      <label className="wife-label">2a. BIRTH DATE (Kaarawan) *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <select
            name="wifeBirthMonth"
            className="wife-select"
            value={formData.wifeBirthMonth || ''}
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
          {errors.wifeBirthMonth && (
            <span className="wife-error error-message">{errors.wifeBirthMonth}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <select
            name="wifeBirthDay"
            className="wife-select"
            value={formData.wifeBirthDay || ''}
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
          {errors.wifeBirthDay && (
            <span className="wife-error error-message">{errors.wifeBirthDay}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <select
            name="wifeBirthYear"
            className="wife-select"
            value={formData.wifeBirthYear || ''}
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
          {errors.wifeBirthYear && (
            <span className="wife-error error-message">{errors.wifeBirthYear}</span>
          )}
        </div>
      </div>

      {/* Age */}
      <label className="wife-label">2b. AGE *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeAge"
            className="wife-input"
            placeholder="Age"
            value={formData.wifeAge || ''}
            onChange={handleChange}
          />
          {errors.wifeAge && <span className="wife-error error-message">{errors.wifeAge}</span>}
        </div>
      </div>

      {/* Place of Birth */}
      <label className="wife-label">3. PLACE OF BIRTH (Lugar ng Kapanganakan) *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeBirthCity"
            className="wife-input"
            placeholder="City/Municipality"
            value={formData.wifeBirthCity || ''}
            onChange={handleChange}
          />
          {errors.wifeBirthCity && (
            <span className="wife-error error-message">{errors.wifeBirthCity}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeBirthProvince"
            className="wife-input"
            placeholder="Province"
            value={formData.wifeBirthProvince || ''}
            onChange={handleChange}
          />
          {errors.wifeBirthProvince && (
            <span className="wife-error error-message">{errors.wifeBirthProvince}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeBirthCountry"
            className="wife-input"
            placeholder="Country"
            value={formData.wifeBirthCountry || ''}
            onChange={handleChange}
          />
          {errors.wifeBirthCountry && (
            <span className="wife-error error-message">{errors.wifeBirthCountry}</span>
          )}
        </div>
      </div>

      {/* Sex */}
      <label className="wife-label">4a. SEX (Kasarian) *</label>
      <div className="wife-radio-group radio-group">
        <div className="wife-radio-container input-radio-container">
          <input
            type="radio"
            name="wifeSex"
            className="wife-radio"
            value="Male"
            checked={formData.wifeSex === 'Male'}
            onChange={handleChange}
          />{' '}
          Male
          {errors.wifeSex && <span className="wife-error error-message">{errors.wifeSex}</span>}
          <input
            type="radio"
            name="wifeSex"
            className="wife-radio"
            value="Female"
            checked={formData.wifeSex === 'Female'}
            onChange={handleChange}
          />{' '}
          Female
        </div>
      </div>

      {/* Citizenship */}
      <label className="wife-label">4b. CITIZENSHIP *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeCitizenship"
            className="wife-input"
            placeholder="Citizenship"
            value={formData.wifeCitizenship || ''}
            onChange={handleChange}
          />
          {errors.wifeCitizenship && (
            <span className="wife-error error-message">{errors.wifeCitizenship}</span>
          )}
        </div>
      </div>

      {/* Residence */}
      <label className="wife-label">5. RESIDENCE *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeStreet"
            className="wife-input"
            placeholder="House No., Street"
            value={formData.wifeStreet || ''}
            onChange={handleChange}
          />
          {errors.wifeStreet && (
            <span className="wife-error error-message">{errors.wifeStreet}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeBarangay"
            className="wife-input"
            placeholder="Barangay"
            value={formData.wifeBarangay || ''}
            onChange={handleChange}
          />
          {errors.wifeBarangay && (
            <span className="wife-error error-message">{errors.wifeBarangay}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeCity"
            className="wife-input"
            placeholder="City/Municipality"
            value={formData.wifeCity || ''}
            onChange={handleChange}
          />
          {errors.wifeCity && <span className="wife-error error-message">{errors.wifeCity}</span>}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeProvince"
            className="wife-input"
            placeholder="Province"
            value={formData.wifeProvince || ''}
            onChange={handleChange}
          />
          {errors.wifeProvince && (
            <span className="wife-error error-message">{errors.wifeProvince}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeCountry"
            className="wife-input"
            placeholder="Country"
            value={formData.wifeCountry || ''}
            onChange={handleChange}
          />
          {errors.wifeCountry && (
            <span className="wife-error error-message">{errors.wifeCountry}</span>
          )}
        </div>
      </div>

      {/* Religion */}
      <label className="wife-label">6. RELIGION/RELIGIOUS SECT *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeReligion"
            className="wife-input"
            placeholder="Religion"
            value={formData.wifeReligion || ''}
            onChange={handleChange}
          />
          {errors.wifeReligion && (
            <span className="wife-error error-message">{errors.wifeReligion}</span>
          )}
        </div>
      </div>

      {/* Civil Status */}
      <label className="wife-label">7. CIVIL STATUS *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeCivilStatus"
            className="wife-input"
            placeholder="Civil Status"
            value={formData.wifeCivilStatus || ''}
            onChange={handleChange}
          />
          {errors.wifeCivilStatus && (
            <span className="wife-error error-message">{errors.wifeCivilStatus}</span>
          )}
        </div>
      </div>

      {/* Father's Name */}
      <label className="wife-label">8. NAME OF FATHER (Buong Pangalan ng Ama) *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeFatherFirstName"
            className="wife-input"
            placeholder="First Name"
            value={formData.wifeFatherFirstName || ''}
            onChange={handleChange}
          />
          {errors.wifeFatherFirstName && (
            <span className="wife-error error-message">{errors.wifeFatherFirstName}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeFatherMiddleName"
            className="wife-input"
            placeholder="Middle Name"
            value={formData.wifeFatherMiddleName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeFatherLastName"
            className="wife-input"
            placeholder="Last Name"
            value={formData.wifeFatherLastName || ''}
            onChange={handleChange}
          />
          {errors.wifeFatherLastName && (
            <span className="wife-error error-message">{errors.wifeFatherLastName}</span>
          )}
        </div>
      </div>

      {/* Father's Citizenship */}
      <label className="wife-label">9. CITIZENSHIP OF FATHER *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeFatherCitizenship"
            className="wife-input"
            placeholder="Citizenship"
            value={formData.wifeFatherCitizenship || ''}
            onChange={handleChange}
          />
          {errors.wifeFatherCitizenship && (
            <span className="wife-error error-message">{errors.wifeFatherCitizenship}</span>
          )}
        </div>
      </div>

      {/* Mother's Maiden Name */}
      <label className="wife-label">
        10. MOTHER'S MAIDEN NAME (Pangalan ng Ina sa Pagkadalaga) *
      </label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeMotherFirstName"
            className="wife-input"
            placeholder="First Name"
            value={formData.wifeMotherFirstName || ''}
            onChange={handleChange}
          />
          {errors.wifeMotherFirstName && (
            <span className="wife-error error-message">{errors.wifeMotherFirstName}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeMotherMiddleName"
            className="wife-input"
            placeholder="Middle Name"
            value={formData.wifeMotherMiddleName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeMotherLastName"
            className="wife-input"
            placeholder="Last Name"
            value={formData.wifeMotherLastName || ''}
            onChange={handleChange}
          />
          {errors.wifeMotherLastName && (
            <span className="wife-error error-message">{errors.wifeMotherLastName}</span>
          )}
        </div>
      </div>

      {/* Mother's Citizenship */}
      <label className="wife-label">11. CITIZENSHIP OF MOTHER *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifeMotherCitizenship"
            className="wife-input"
            placeholder="Citizenship"
            value={formData.wifeMotherCitizenship || ''}
            onChange={handleChange}
          />
          {errors.wifeMotherCitizenship && (
            <span className="wife-error error-message">{errors.wifeMotherCitizenship}</span>
          )}
        </div>
      </div>

      {/* Name of Person/Wali Who Gave Consent or Advice */}
      <label className="wife-label">12. NAME OF PERSON / WALI WHO GAVE CONSENT OR ADVICE *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifewaliFirstName"
            className="wife-input wife-wali-input"
            placeholder="First Name (Pangalan)"
            value={formData.wifewaliFirstName || ''}
            onChange={handleChange}
          />
          {errors.wifewaliFirstName && (
            <span className="wife-error error-message">{errors.wifewaliFirstName}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifewaliMiddleName"
            className="wife-input wife-wali-input"
            placeholder="Middle Name (Gitnang Pangalan)"
            value={formData.wifewaliMiddleName || ''}
            onChange={handleChange}
          />
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifewaliLastName"
            className="wife-input wife-wali-input"
            placeholder="Last Name (Apelyido)"
            value={formData.wifewaliLastName || ''}
            onChange={handleChange}
          />
          {errors.wifewaliLastName && (
            <span className="wife-error error-message">{errors.wifewaliLastName}</span>
          )}
        </div>
      </div>

      {/* Relationship */}
      <label className="wife-label">13. RELATIONSHIP *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifewaliRelationship"
            className="wife-input wife-wali-input"
            placeholder="Relationship"
            value={formData.wifewaliRelationship || ''}
            onChange={handleChange}
          />
          {errors.wifewaliRelationship && (
            <span className="wife-error error-message">{errors.wifewaliRelationship}</span>
          )}
        </div>
      </div>

      {/* Residence */}
      <label className="wife-label">14. RESIDENCE *</label>
      <div className="wife-input-group input-group">
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifewaliStreet"
            className="wife-input wife-wali-input"
            placeholder="House No., Street"
            value={formData.wifewaliStreet || ''}
            onChange={handleChange}
          />
          {errors.wifewaliStreet && (
            <span className="wife-error error-message">{errors.wifewaliStreet}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifewaliBarangay"
            className="wife-input wife-wali-input"
            placeholder="Barangay"
            value={formData.wifewaliBarangay || ''}
            onChange={handleChange}
          />
          {errors.wifewaliBarangay && (
            <span className="wife-error error-message">{errors.wifewaliBarangay}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifewaliCity"
            className="wife-input wife-wali-input"
            placeholder="City/Municipality"
            value={formData.wifewaliCity || ''}
            onChange={handleChange}
          />
          {errors.wifewaliCity && (
            <span className="wife-error error-message">{errors.wifewaliCity}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifewaliProvince"
            className="wife-input wife-wali-input"
            placeholder="Province"
            value={formData.wifewaliProvince || ''}
            onChange={handleChange}
          />
          {errors.wifewaliProvince && (
            <span className="wife-error error-message">{errors.wifewaliProvince}</span>
          )}
        </div>
        <div className="wife-input-container input-container">
          <input
            type="text"
            name="wifewaliCountry"
            className="wife-input wife-wali-input"
            placeholder="Country"
            value={formData.wifewaliCountry || ''}
            onChange={handleChange}
          />
          {errors.wifewaliCountry && (
            <span className="wife-error error-message">{errors.wifewaliCountry}</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default WifeForm;
