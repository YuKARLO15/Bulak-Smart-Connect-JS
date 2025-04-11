import React, { useState, useEffect } from "react";
import "../SignUpComponents/UpdateCheckbox.css";
import "../SignUpComponents/SignUpForm.css";


const UpdatesCheckbox = ({ formData, handleInputChange }) => {
    return (
      <div className="form-control" id="updates-container">
        <label className="ReceiveUpdateText">
          <input
            type="checkbox"
            id="CheckBox"
            name="updates"
            checked={formData.updates}
            onChange={handleInputChange}
          />
          I want to receive updates via email.
        </label>
      </div>
    );
  };
  
  export default UpdatesCheckbox;