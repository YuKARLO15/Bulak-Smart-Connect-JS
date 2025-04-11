import React from "react";
import "./MarriageCertificateForm.css";

const HusbandForm = ({ formData, handleChange, errors }) => {
  return (
    <section className="section">
      <h3>I. HUSBAND</h3>

      {/* Full Name */}
      <label>1. FULL NAME *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandFirstName"
            placeholder="First Name (Pangalan)"
            value={formData.husbandFirstName || ""}
            onChange={handleChange}
          />
          {errors.husbandFirstName && <span className="error-message">{errors.husbandFirstName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandMiddleName"
            placeholder="Middle Name (Gitnang Pangalan)"
            value={formData.husbandMiddleName || ""}
            onChange={handleChange}
          />
          {errors.husbandMiddleName && <span className="error-message">{errors.husbandMiddleName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandLastName"
            placeholder="Last Name (Apelyido)"
            value={formData.husbandLastName || ""}
            onChange={handleChange}
          />
          {errors.husbandLastName && <span className="error-message">{errors.husbandLastName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandExtension"
            placeholder="Extension (e.g., Jr., Sr.)"
            value={formData.husbandExtension || ""}
            onChange={handleChange}
          />
          {errors.husbandExtension && <span className="error-message">{errors.husbandExtension}</span>}
        </div>
      </div>

      {/* Birth Date */}
      <label>2a. BIRTH DATE (Kaarawan) *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandBirthMonth"
            placeholder="Month"
            value={formData.husbandBirthMonth || ""}
            onChange={handleChange}
          />
          {errors.husbandBirthMonth && <span className="error-message">{errors.husbandBirthMonth}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandBirthDay"
            placeholder="Day"
            value={formData.husbandBirthDay || ""}
            onChange={handleChange}
          />
          {errors.husbandBirthDay && <span className="error-message">{errors.husbandBirthDay}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandBirthYear"
            placeholder="Year"
            value={formData.husbandBirthYear || ""}
            onChange={handleChange}
          />
          {errors.husbandBirthYear && <span className="error-message">{errors.husbandBirthYear}</span>}
        </div>
      </div>

      {/* Age */}
      <label>2b. AGE *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandAge"
            placeholder="Age"
            value={formData.husbandAge || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Place of Birth */}
      <label>3. PLACE OF BIRTH (Lugar ng Kapanganakan) *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandBirthCity"
            placeholder="City/Municipality"
            value={formData.husbandBirthCity || ""}
            onChange={handleChange}
          />
          {errors.husbandBirthCity && <span className="error-message">{errors.husbandBirthCity}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandBirthProvince"
            placeholder="Province"
            value={formData.husbandBirthProvince || ""}
            onChange={handleChange}
          />
          {errors.husbandBirthProvince && <span className="error-message">{errors.husbandBirthProvince}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandBirthCountry"
            placeholder="Country"
            value={formData.husbandBirthCountry || ""}
            onChange={handleChange}
          />
          {errors.husbandBirthCountry && <span className="error-message">{errors.husbandBirthCountry}</span>}
        </div>
      </div>

      {/* Sex */}
      <label>4a. SEX (Kasarian) *</label>
      <div className="input-group radio-group">
        <div className="input-container">
          <input
            type="radio"
            name="husbandSex"
            value="Male"
            checked={formData.husbandSex === "Male"}
            onChange={handleChange}
          /> Male
          {errors.husbandSex && <span className="error-message">{errors.husbandSex}</span>}
          <input
            type="radio"
            name="husbandSex"
            value="Female"
            checked={formData.husbandSex === "Female"}
            onChange={handleChange}
          /> Female
          {errors.husbandSex && <span className="error-message">{errors.husbandSex}</span>}
        </div>
      </div>

      {/* Citizenship */}
      <label>4b. CITIZENSHIP *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandCitizenship"
            placeholder="Citizenship"
            value={formData.husbandCitizenship || ""}
            onChange={handleChange}
          />
          {errors.husbandCitizenship && <span className="error-message">{errors.husbandCitizenship}</span>}
        </div>
      </div>

      {/* Residence */}
      <label>5. RESIDENCE *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandStreet"
            placeholder="House No., Street"
            value={formData.husbandStreet || ""}
            onChange={handleChange}
          />
          {errors.husbandStreet && <span className="error-message">{errors.husbandStreet}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandBarangay"
            placeholder="Barangay"
            value={formData.husbandBarangay || ""}
            onChange={handleChange}
          />
          {errors.husbandBarangay && <span className="error-message">{errors.husbandBarangay}</span>}
        </div>
        <div className="input-container"> 
          <input
            type="text"
            name="husbandCity"
            placeholder="City/Municipality"
            value={formData.husbandCity || ""}
            onChange={handleChange}
          />
          {errors.husbandCity && <span className="error-message">{errors.husbandCity}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandProvince"
            placeholder="Province"
            value={formData.husbandProvince || ""}
            onChange={handleChange}
          />
          {errors.husbandProvince && <span className="error-message">{errors.husbandProvince}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandCountry"
            placeholder="Country"
            value={formData.husbandCountry || ""}
            onChange={handleChange}
          />
          {errors.husbandCountry && <span className="error-message">{errors.husbandCountry}</span>}
        </div>
        {errors.husbandStreet && <span className="error-message">{errors.husbandStreet}</span>}
      </div>

      {/* Religion */}
      <label>6. RELIGION/RELIGIOUS SECT *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandReligion"
            placeholder="Religion"
            value={formData.husbandReligion || ""}
            onChange={handleChange}
          />
          {errors.husbandReligion && <span className="error-message">{errors.husbandReligion}</span>}
        </div>
      </div>

      {/* civil Status */}
      <label>7. CIVIL STATUS *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandCivilStatus"
            placeholder="Civil Status"
            value={formData.husbandCivilStatus || ""}
            onChange={handleChange}
          />
          {errors.husbandCivilStatus && <span className="error-message">{errors.husbandCivilStatus}</span>}
        </div>
        </div>



      {/* Father's Name */}
      <label>8. NAME OF FATHER (Buong Pangalan ng Ama) *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandFatherFirstName"
            placeholder="First Name"
            value={formData.husbandFatherFirstName || ""}
            onChange={handleChange}
          />
          {errors.husbandFatherFirstName && <span className="error-message">{errors.husbandFatherFirstName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandFatherMiddleName"
            placeholder="Middle Name"
            value={formData.husbandFatherMiddleName || ""}
            onChange={handleChange}
          />
          {errors.marriageTime && <span className="error-message">{errors.marriageTime}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandFatherLastName"
            placeholder="Last Name"
            value={formData.husbandFatherLastName || ""}
            onChange={handleChange}
          />
          {errors.husbandFatherLastName && <span className="error-message">{errors.husbandFatherLastName}</span>}
        </div>
      </div>
        
      {/* Father's Citizenship */}
      <label>9. CITIZENSHIP OF FATHER *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandFatherCitizenship"
            placeholder="Citizenship"
            value={formData.husbandFatherCitizenship || ""}
            onChange={handleChange}
          />
          {errors.husbandFatherCitizenship && <span className="error-message">{errors.husbandFatherCitizenship}</span>}
        </div>
      </div>


      {/* Mother's Maiden Name */}
      <label>10. MOTHER'S MAIDEN NAME (Pangalan ng Ina sa Pagkadalaga) *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandMotherFirstName"
            placeholder="First Name"
            value={formData.husbandMotherFirstName || ""}
            onChange={handleChange}
          />
          {errors.husbandMotherFirstName && <span className="error-message">{errors.husbandMotherFirstName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandMotherMiddleName"
            placeholder="Middle Name"
            value={formData.husbandMotherMiddleName || ""}
            onChange={handleChange}
          />
          {errors.husbandMotherMiddleName && <span className="error-message">{errors.husbandMotherMiddleName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="husbandMotherLastName"
            placeholder="Last Name"
            value={formData.husbandMotherLastName || ""}
            onChange={handleChange}
          />
          {errors.husbandMotherLastName && <span className="error-message">{errors.husbandMotherLastName}</span>}
        </div>
      </div>

      {/* Mother's Citizenship */}
      <label>11. CITIZENSHIP OF MOTHER *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="husbandMotherCitizenship"
            placeholder="Citizenship"
            value={formData.husbandMotherCitizenship || ""}
            onChange={handleChange}
          />
          {errors.husbandMotherCitizenship && <span className="error-message">{errors.husbandMotherCitizenship}</span>}
        </div>
      </div>

      {/* Name of Person/Wali Who Gave Consent or Advice */}
      <label>12. NAME OF PERSON / WALI WHO GAVE CONSENT OR ADVICE *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="waliFirstName"
            placeholder="First Name (Pangalan)"
            value={formData.waliFirstName || ""}
            onChange={handleChange}
          />
          {errors.waliFirstName && <span className="error-message">{errors.waliFirstName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="waliMiddleName"
            placeholder="Middle Name (Gitnang Pangalan)"
            value={formData.waliMiddleName || ""}
            onChange={handleChange}
          />
          {errors.waliMiddleName && <span className="error-message">{errors.waliMiddleName}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="waliLastName"
            placeholder="Last Name (Apelyido)"
            value={formData.waliLastName || ""}
            onChange={handleChange}
          />
          {errors.waliLastName && <span className="error-message">{errors.waliLastName}</span>}
        </div>
      </div>

      {/* Relationship */}
      <label>13. RELATIONSHIP *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="waliRelationship"
            placeholder="Relationship"
            value={formData.waliRelationship || ""}
            onChange={handleChange}
          />
          {errors.waliRelationship && <span className="error-message">{errors.waliRelationship}</span>}
        </div>
      </div>

      {/* Residence */}
      <label>14. RESIDENCE *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="waliStreet"
            placeholder="House No., Street"
            value={formData.waliStreet || ""}
            onChange={handleChange}
          />
          {errors.waliStreet && <span className="error-message">{errors.waliStreet}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="waliBarangay"
            placeholder="Barangay"
            value={formData.waliBarangay || ""}
            onChange={handleChange}
          />
          {errors.waliBarangay && <span className="error-message">{errors.waliBarangay}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="waliCity"
            placeholder="City/Municipality"
            value={formData.waliCity || ""}
            onChange={handleChange}
          />
          {errors.waliCity && <span className="error-message">{errors.waliCity}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="waliProvince"
            placeholder="Province"
            value={formData.waliProvince || ""}
            onChange={handleChange}
          />
          {errors.waliProvince && <span className="error-message">{errors.waliProvince}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="waliCountry"
            placeholder="Country"
            value={formData.waliCountry || ""}
            onChange={handleChange}
          />
          {errors.waliCountry && <span className="error-message">{errors.waliCountry}</span>}
        </div>
      </div>
    </section>
  );
};

export default HusbandForm;