import React from 'react';
import './MarriageCertificateForm.css';
import './MarriageDetailsForm.css';

const MarriageDetailsForm = ({ formData, handleChange, errors }) => {
  // Create arrays for dropdown options
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

  // Days 1-31
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Years (current year down to 100 years ago)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Time options
  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')); // 00-59
  const amPm = ['AM', 'PM'];

  return (
    <section className="section">
      <h3>III. MARRIAGE DETAILS</h3>

      {/* Place of Marriage */}
      <label>
        15. PLACE OF MARRIAGE <span style={{ color: 'red' }}>*</span>
      </label>
      <div className="input-group">
        <div className="input-container">
          <input
            type="text"
            name="marriageOffice"
            placeholder="Office of the/House of"
            value={formData.marriageOffice || ''}
            onChange={handleChange}
          />
          {errors.marriageOffice && <span className="error-message">{errors.marriageOffice}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="marriageBarangay"
            placeholder="Barangay of/Church of/Mosque of"
            value={formData.marriageBarangay || ''}
            onChange={handleChange}
          />
          {errors.marriageBarangay && (
            <span className="error-message">{errors.marriageBarangay}</span>
          )}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="marriageCity"
            placeholder="City/Municipality"
            value={formData.marriageCity || ''}
            onChange={handleChange}
          />
          {errors.marriageCity && <span className="error-message">{errors.marriageCity}</span>}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="marriageProvince"
            placeholder="Province"
            value={formData.marriageProvince || ''}
            onChange={handleChange}
          />
          {errors.marriageProvince && (
            <span className="error-message">{errors.marriageProvince}</span>
          )}
        </div>
        <div className="input-container">
          <input
            type="text"
            name="marriageCountry"
            placeholder="Country"
            value={formData.marriageCountry || ''}
            onChange={handleChange}
          />
          {errors.marriageCountry && (
            <span className="error-message">{errors.marriageCountry}</span>
          )}
        </div>
      </div>

      {/* Date of Marriage - CONVERTED TO DROPDOWNS */}
      <label>
        16. DATE OF MARRIAGE <span style={{ color: 'red' }}>*</span>
      </label>
      <div className="input-group">
        <div className="input-container">
          <select
            name="marriageMonth"
            value={formData.marriageMonth || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Month</option>
            {months.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          {errors.marriageMonth && <span className="error-message">{errors.marriageMonth}</span>}
        </div>
        <div className="input-container">
          <select
            name="marriageDay"
            value={formData.marriageDay || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Day</option>
            {days.map(day => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {errors.marriageDay && <span className="error-message">{errors.marriageDay}</span>}
        </div>
        <div className="input-container">
          <select
            name="marriageYear"
            value={formData.marriageYear || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Year</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.marriageYear && <span className="error-message">{errors.marriageYear}</span>}
        </div>
      </div>

      {/* Time of Marriage */}
      <label>
        17. TIME OF MARRIAGE<span style={{ color: 'red' }}>*</span>
      </label>
      <div className="input-group">
        <div className="input-container">
          <select
            name="marriageHour"
            value={formData.marriageHour || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Hour</option>
            {hours.map(hour => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          {errors.marriageHour && <span className="error-message">{errors.marriageHour}</span>}
        </div>
        <div className="input-container">
          <select
            name="marriageMinute"
            value={formData.marriageMinute || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Minute</option>
            {minutes.map(minute => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
          {errors.marriageMinute && <span className="error-message">{errors.marriageMinute}</span>}
        </div>
        <div className="input-container">
          <select
            name="marriageAmPm"
            value={formData.marriageAmPm || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">AM/PM</option>
            {amPm.map(period => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
          {errors.marriageAmPm && <span className="error-message">{errors.marriageAmPm}</span>}
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
        NOTE: After submitting the documents online, all required documents for this field and other
        fields must also be submitted to the Office of the Civil Registrar.
      </p>
    </section>
  );
};

export default MarriageDetailsForm;
