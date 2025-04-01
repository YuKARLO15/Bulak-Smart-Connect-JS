import React, { useState } from "react";
import "../SignUpComponents/FullName.css";

const FullNameSection = () => {
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    middlename: "",
    hasExtension: false,
    extension: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div>

      <div className="form-group">
        
        <div className="form-group fullname">
          <div className="textbox">
            <label className="label-in">Last Name / Apelyido <span className="asterisk"> *</span></label>
            <input
              type="text"
              id="LastName"
              name="lastname"
              placeholder="Enter Last Name"
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="textbox">
            <label className="label-in">First Name / Pangalan <span className="asterisk"> *</span></label>
            <input
              type="text"
              id="FirstName"
              name="firstname"
              placeholder="Enter First Name"
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="textbox">
            <label className="label-in middlename">Middle Name / GitnangPangalan </label>
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
          <label>
            <input
              type="checkbox"
              id="HasExtension"
              name="hasExtension"
              checked={formData.hasExtension || false}
              onChange={(e) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  hasExtension: e.target.checked,
                  extension: e.target.checked ? prevFormData.extension : "",
                }))
              }
            />
            Check this box if the registrant has a name extension
          </label>
          <div className="extension-name">
            {formData.hasExtension && (
              <select
                id="Extension"
                name="extension"
                value={formData.extension || ""}
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
