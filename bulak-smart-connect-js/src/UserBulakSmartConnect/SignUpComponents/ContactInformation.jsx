import React from 'react';
import '../SignUpComponents/ContactInformation.css';
import '../SignUpComponents/SignUpForm.css';
import UpdatesCheckbox from './UpdateCheckbox';

const ContactInformationSection = ({ formData, handleInputChange, errors }) => (
  <div className="form-group">
    {/* Contact Number Inputs */}
    <div className="form-group contactinformation">
      <div className="textbox">
        <label className="label-in">
          Contact Number <span className="asterisk"> *</span>
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" value="+63" disabled style={{ width: '60px' }} />
          <input
            type="text"
            name="contact"
            placeholder="10-digit mobile number"
            value={formData.contact}
            onChange={event => {
              const { name, value } = event.target;
              const formattedValue = value.replace(/\D/g, '').slice(0, 10); // Only digits, max 10 digits
              handleInputChange({ target: { name, value: formattedValue } });
            }}
            required
          />
        </div>
        {errors.contact && <span className="error-message">{errors.contact}</span>}
      </div>

      {/* Email Address Input */}
      <div className="textbox">
        <label className="label-in">
          Email Address <span className="asterisk"> *</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your Email Address"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
        <div className="checkbox-wrapper">
          <UpdatesCheckbox formData={formData} handleInputChange={handleInputChange} />
        </div>
      </div>
    </div>
  </div>
);

export default ContactInformationSection;
