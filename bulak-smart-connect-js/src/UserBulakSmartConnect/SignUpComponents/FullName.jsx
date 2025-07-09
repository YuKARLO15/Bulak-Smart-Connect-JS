import React from 'react';
import '../SignUpComponents/FullName.css';

const FullNameSection = ({ formData, handleInputChange, errors }) => {
  return (
    <div>
      <div className="form-group">
        <label className="label-personalinfo"> Personal Information</label>
        <div className="form-group fullname">
          <div className="textbox">
            <label className="label-in">
              Last Name / Apelyido <span className="asterisk"> *</span>
            </label>
            <input
              type="text"
              id="LastName"
              name="lastname"
              placeholder="Enter Last Name"
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
            {errors.lastname && <span className="error-message">{errors.lastname}</span>}
          </div>

          <div className="textbox">
            <label className="label-in">
              First Name / Pangalan <span className="asterisk"> *</span>
            </label>
            <input
              type="text"
              id="FirstName"
              name="firstname"
              placeholder="Enter First Name"
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
            {errors.firstname && <span className="error-message">{errors.firstname}</span>}
          </div>

          <div className="textbox">
            <label className="label-in middlename">Middle Name / Gitnang Pangalan </label>
            <input
              type="text"
              id="MiddleName"
              name="middlename"
              placeholder="Optional"
              value={formData.middlename}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Extension Name Section */}
        <div className="checkbox-extension">
          <label className="ReceiveUpdateText">
            <input
              type="checkbox"
              id="HasExtension"
              name="hasExtension"
              checked={formData.hasExtension || false}
              onChange={handleInputChange}
              className="checkbox-inputSignUp"
            />
            <span> Check this box if the registrant has a name extension</span>
          </label>
          <div className="extension-name">
            {formData.hasExtension && (
              <select
                id="Extension"
                name="extension"
                value={formData.extension || ''}
                onChange={handleInputChange}
              >
                <option value="">Select Extension</option>
                <option value="Sr.">Sr.</option>
                <option value="Jr.">Jr.</option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
                <option value="VI">VI</option>
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullNameSection;
