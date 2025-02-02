import React from "react";
import "../SignUpComponents/ContactInformation.css";
import "../SignUpComponents/SignUpForm.css";

const ContactInformationSection = ({ formData, handleInputChange }) => (
  <div className="form-group">
    <label className="label-category">
      4. Contact Information ( Detalye ng pakikipag-ugnayan )
    </label>
    
      {/* Contact Number Input */}

      <div className="form-group contactinformation">
        <div className="textbox">
          <label className="label-in">
            Contact Number <span className="asterisk"> *</span>
          </label>
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={(event) => {
              const { name, value } = event.target;
              const formattedValue = value.replace(/\D/g, "").slice(0, 11); // Only digits, max 11 chars
              handleInputChange({ target: { name, value: formattedValue } });
            }}
            maxLength="13" // Allows space for hyphens in formatting
            required
          />
        </div>

        <div className="textbox">
          <label className="label-in">
            Email Address <span className="optional"> optional</span> </label>
          <input
        type="email"
        name="email"
        placeholder="juandelacruz@gmail.com ( optional )"
        value={formData.email}
        onChange={handleInputChange}
      />
  </div>
  </div>
 </div>
 
  
);

export default ContactInformationSection;
