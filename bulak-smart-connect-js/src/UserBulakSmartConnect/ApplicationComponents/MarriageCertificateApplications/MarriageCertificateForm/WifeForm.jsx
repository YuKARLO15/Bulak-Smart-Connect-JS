import React from "react";
import "./MarriageCertificateForm.css";

const WifeForm = ({ formData, handleChange, errors }) => {
  return (
    <section className="section">
      <h3>II. WIFE</h3>

      {/* Full Name */}
      <label>1. FULL NAME *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeFirstName"
            placeholder="First Name (Pangalan)"
            value={formData.wifeFirstName || ""}
            onChange={handleChange}
          />
          {errors.wifeFirstName && <span className="error-message">{errors.wifeFirstName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeMiddleName"
            placeholder="Middle Name (Gitnang Pangalan)"
            value={formData.wifeMiddleName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeLastName"
            placeholder="Last Name (Apelyido)"
            value={formData.wifeLastName || ""}
            onChange={handleChange}
          />
          {errors.wifeLastName && <span className="error-message">{errors.wifeLastName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeExtension"
            placeholder="Extension (e.g., Jr., Sr.)"
            value={formData.wifeExtension || ""}
            onChange={handleChange}
          />
        </div>
      </div>

     {/* Birth Date */}
<label>2a. BIRTH DATE (Kaarawan) *</label>
<div className="input-group">
  <div className="input-container">
    <select
      name="wifeBirthMonth"
      value={formData.wifeBirthMonth || ""}
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
    {errors.wifeBirthMonth && <span className="error-message">{errors.wifeBirthMonth}</span>}
  </div>
  <div className="input-container">
    <select
      name="wifeBirthDay"
      value={formData.wifeBirthDay || ""}
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
    {errors.wifeBirthDay && <span className="error-message">{errors.wifeBirthDay}</span>}
  </div>
  <div className="input-container">
    <select
      name="wifeBirthYear"
      value={formData.wifeBirthYear || ""}
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
    {errors.wifeBirthYear && <span className="error-message">{errors.wifeBirthYear}</span>}
  </div>
</div>

      {/* Age */}
      <label>2b. AGE *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeAge"
            placeholder="Age"
            value={formData.wifeAge || ""}
            onChange={handleChange}
          />
          {errors.wifeAge && <span className="error-message">{errors.wifeAge}</span>}
        </div>
      </div>

      {/* Place of Birth */}
      <label>3. PLACE OF BIRTH (Lugar ng Kapanganakan) *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeBirthCity"
            placeholder="City/Municipality"
            value={formData.wifeBirthCity || ""}
            onChange={handleChange}
          />
          {errors.wifeBirthCity && <span className="error-message">{errors.wifeBirthCity}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeBirthProvince"
            placeholder="Province"
            value={formData.wifeBirthProvince || ""}
            onChange={handleChange}
          />
          {errors.wifeBirthProvince && <span className="error-message">{errors.wifeBirthProvince}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeBirthCountry"
            placeholder="Country"
            value={formData.wifeBirthCountry || ""}
            onChange={handleChange}
          />
          {errors.wifeBirthCountry && <span className="error-message">{errors.wifeBirthCountry}</span>}
        </div>
      </div>

      {/* Sex */}
      <label>4a. SEX (Kasarian) *</label>
      <div className="input-group radio-group">
        <div className="input-container">
          <input
            type="radio"
            name="wifeSex"
            value="Male"
            checked={formData.wifeSex === "Male"}
            onChange={handleChange}
          /> Male
        {errors.wifeSex && <span className="error-message">{errors.wifeSex}</span>}
          <input
            type="radio"
            name="wifeSex"
            value="Female"
            checked={formData.wifeSex === "Female"}
            onChange={handleChange}
          /> Female
          {errors.wifeSex && <span className="error-message">{errors.wifeSex}</span>}
        </div>
      </div>

      {/* Citizenship */}
      <label>4b. CITIZENSHIP *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeCitizenship"
            placeholder="Citizenship"
            value={formData.wifeCitizenship || ""}
            onChange={handleChange}
          />
          {errors.wifeCitizenship && <span className="error-message">{errors.wifeCitizenship}</span>}
        </div>
      </div>

      {/* Residence */}
      <label>5. RESIDENCE *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeStreet"
            placeholder="House No., Street"
            value={formData.wifeStreet || ""}
            onChange={handleChange}
          />
          {errors.wifeStreet && <span className="error-message">{errors.wifeStreet}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeBarangay"
            placeholder="Barangay"
            value={formData.wifeBarangay || ""}
            onChange={handleChange}
          />
          {errors.wifeBarangay && <span className="error-message">{errors.wifeBarangay}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeCity"
            placeholder="City/Municipality"
            value={formData.wifeCity || ""}
            onChange={handleChange}
          />
          {errors.wifeCity && <span className="error-message">{errors.wifeCity}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeProvince"
            placeholder="Province"
            value={formData.wifeProvince || ""}
            onChange={handleChange}
          />
          {errors.wifeProvince && <span className="error-message">{errors.wifeProvince}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeCountry"
            placeholder="Country"
            value={formData.wifeCountry || ""}
            onChange={handleChange}
          />
          {errors.wifeCountry && <span className="error-message">{errors.wifeCountry}</span>}
        </div>
      </div>

      {/* Religion */}
      <label>6. RELIGION/RELIGIOUS SECT *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeReligion"
            placeholder="Religion"
            value={formData.wifeReligion || ""}
            onChange={handleChange}
          />
          {errors.wifeReligion && <span className="error-message">{errors.wifeReligion}</span>}
        </div>
      </div>

       {/* Civil Status */}
      <label>7. CIVIL STATUS *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeCivilStatus"
            placeholder="Civil Status"
            value={formData.wifeCivilStatus || ""}
            onChange={handleChange}
          />
          {errors.wifeCivilStatus && <span className="error-message">{errors.wifeCivilStatus}</span>}
        </div>
      </div>

      {/* Father's Name */}
      <label>8. NAME OF FATHER (Buong Pangalan ng Ama) *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeFatherFirstName"
            placeholder="First Name"
            value={formData.wifeFatherFirstName || ""}
            onChange={handleChange}
          />
          {errors.wifeFatherFirstName && <span className="error-message">{errors.wifeFatherFirstName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeFatherMiddleName"
            placeholder="Middle Name"
            value={formData.wifeFatherMiddleName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeFatherLastName"
            placeholder="Last Name"
            value={formData.wifeFatherLastName || ""}
            onChange={handleChange}
          />
          {errors.wifeFatherLastName && <span className="error-message">{errors.wifeFatherLastName}</span>}
        </div>
      </div>
      
      {/* Father's Citizenship */}
      <label>9. CITIZENSHIP OF FATHER *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeFatherCitizenship"
            placeholder="Citizenship"
            value={formData.wifeFatherCitizenship || ""}
            onChange={handleChange}
          />
          {errors.wifeFatherCitizenship && <span className="error-message">{errors.wifeFatherCitizenship}</span>}
        </div>
      </div>

      {/* Mother's Maiden Name */}
      <label>10. MOTHER'S MAIDEN NAME (Pangalan ng Ina sa Pagkadalaga) *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeMotherFirstName"
            placeholder="First Name"
            value={formData.wifeMotherFirstName || ""}
            onChange={handleChange}
          />
          {errors.wifeMotherFirstName && <span className="error-message">{errors.wifeMotherFirstName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeMotherMiddleName"
            placeholder="Middle Name"
            value={formData.wifeMotherMiddleName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifeMotherLastName"
            placeholder="Last Name"
            value={formData.wifeMotherLastName || ""}
            onChange={handleChange}
          />
          {errors.wifeMotherLastName && <span className="error-message">{errors.wifeMotherLastName}</span>}
        </div>
      </div>

      {/* Mother's Citizenship */}
      <label>11. CITIZENSHIP OF MOTHER *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifeMotherCitizenship"
            placeholder="Citizenship"
            value={formData.wifeMotherCitizenship || ""}
            onChange={handleChange}
          />
          {errors.wifeMotherCitizenship && <span className="error-message">{errors.wifeMotherCitizenship}</span>}
        </div>
      </div>


      {/* Name of Person/Wali Who Gave Consent or Advice */}
      <label>12. NAME OF PERSON / WALI WHO GAVE CONSENT OR ADVICE *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifewaliFirstName"
            placeholder="First Name (Pangalan)"
            value={formData.wifewaliFirstName || ""}
            onChange={handleChange}
          />
          {errors.wifewaliFirstName && <span className="error-message">{errors.wifewaliFirstName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifewaliMiddleName"
            placeholder="Middle Name (Gitnang Pangalan)"
            value={formData.wifewaliMiddleName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifewaliLastName"
            placeholder="Last Name (Apelyido)"
            value={formData.wifewaliLastName || ""}
            onChange={handleChange}
          />
          {errors.wifewaliLastName && <span className="error-message">{errors.wifewaliLastName}</span>}
        </div>
      </div>

      {/* Relationship */}
      <label>13. RELATIONSHIP *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifewaliRelationship"
            placeholder="Relationship"
            value={formData.wifewaliRelationship || ""}
            onChange={handleChange}
          />
          {errors.wifewaliRelationship && <span className="error-message">{errors.wifewaliRelationship}</span>}
        </div>
      </div>

      {/* Residence */}
      <label>14. RESIDENCE *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="wifewaliStreet"
            placeholder="House No., Street"
            value={formData.wifewaliStreet || ""}
            onChange={handleChange}
          />
          {errors.wifewaliStreet && <span className="error-message">{errors.wifewaliStreet}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifewaliBarangay"
            placeholder="Barangay"
            value={formData.wifewaliBarangay || ""}
            onChange={handleChange}
          />
          {errors.wifewaliBarangay && <span className="error-message">{errors.wifewaliBarangay}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="wifewaliCity"
            placeholder="City/Municipality"
            value={formData.wifewaliCity || ""}
            onChange={handleChange}
          />
          {errors.wifewaliCity && <span className="error-message">{errors.wifewaliCity}</span>}
        </div>
        <div className="input-container">
            <input
              type="text"
              name="wifewaliProvince"
              placeholder="Province"
              value={formData.wifewaliProvince || ""}
              onChange={handleChange}
            />
            {errors.wifewaliProvince && <span className="error-message">{errors.wifewaliProvince}</span>}
          </div>
          <div className="input-container">
            <input
              type="text"
              name="wifewaliCountry"
              placeholder="Country"
              value={formData.wifewaliCountry || ""}
              onChange={handleChange}
            />
            {errors.wifewaliCountry && <span className="error-message">{errors.wifewaliCountry}</span>}
          </div>
        </div>
      </section>
    );
  };

  export default WifeForm;