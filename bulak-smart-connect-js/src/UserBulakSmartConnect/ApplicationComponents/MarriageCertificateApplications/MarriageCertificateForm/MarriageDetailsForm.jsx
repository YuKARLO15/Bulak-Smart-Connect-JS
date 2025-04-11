import React from "react";
import "./MarriageCertificateForm.css";

const MarriageDetailsForm = ({ formData, handleChange, errors }) => {
  return (
    <section className="section">
      <h3>III. MARRIAGE DETAILS</h3>

      {/* Place of Marriage */}
      <label>15. PLACE OF MARRIAGE *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="marriageOffice"
            placeholder="Office of the/House of"
            value={formData.marriageOffice || ""}
            onChange={handleChange}
          />
          {errors.marriageOffice && <span className="error-message">{errors.marriageOffice}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="marriageBarangay"
            placeholder="Barangay of/Church of/Mosque of"
            value={formData.marriageBarangay || ""}
            onChange={handleChange}
          />
          {errors.marriageBarangay && <span className="error-message">{errors.marriageBarangay}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="marriageCity"
            placeholder="City/Municipality"
            value={formData.marriageCity || ""}
            onChange={handleChange}
          />
          {errors.marriageCity && <span className="error-message">{errors.marriageCity}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="marriageProvince"
            placeholder="Province"
            value={formData.marriageProvince || ""}
            onChange={handleChange}
          />
          {errors.marriageProvince && <span className="error-message">{errors.marriageProvince}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="marriageCountry"
            placeholder="Country"
            value={formData.marriageCountry || ""}
            onChange={handleChange}
          />
          {errors.marriageCountry && <span className="error-message">{errors.marriageCountry}</span>}
        </div>
      </div>

      {/* Date of Marriage */}
      <label>16. DATE OF MARRIAGE *</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="marriageMonth"
            placeholder="Month"
            value={formData.marriageMonth || ""}
            onChange={handleChange}
          />
          {errors.marriageMonth && <span className="error-message">{errors.marriageMonth}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="marriageDay"
            placeholder="Day"
            value={formData.marriageDay || ""}
            onChange={handleChange}
          />
          {errors.marriageDay && <span className="error-message">{errors.marriageDay}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="marriageYear"
            placeholder="Year"
            value={formData.marriageYear || ""}
            onChange={handleChange}
          />
          {errors.marriageYear && <span className="error-message">{errors.marriageYear}</span>}
        </div>
      </div>

      {/* Time of Marriage */}
      <label>17. TIME OF MARRIAGE</label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="marriageTime"
            placeholder="Time of Marriage"
            value={formData.marriageTime || ""}
            onChange={handleChange}
          />
          {errors.marriageTime && <span className="error-message">{errors.marriageTime}</span>}
        </div>
      </div>

      {/* Additional Information */}
      <p className="info-text">
        This field requires a personal appearance at the Office of the Civil Registrar.
      </p>

      <label>18. CERTIFICATION OF THE CONTRACTING PARTIES</label>
      <p className="info-text">19. CERTIFICATION OF THE SOLEMNIZING OFFICER</p>
      <p className="info-text">20. A WITNESS</p>
      <p className="info-text">AFFIDAVIT OF SOLEMNIZING OFFICER</p>
      <p className="info-text">AFFIDAVIT FOR DELAYED REGISTRATION OF MARRIAGE</p>

      <p className="note-text">
        NOTE: After submitting the documents online, all required documents for this field and other fields must also be submitted to the Office of the Civil Registrar.
      </p>
    </section>
  );
};

export default MarriageDetailsForm;