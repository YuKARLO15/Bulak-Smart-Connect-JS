import React from 'react';
import '../SignUpComponents/UpdateCheckbox.css';
import '../SignUpComponents/SignUpForm.css';

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
          className='checkbox-inputSignUp'
        />
        <span>I want to receive updates via email.</span>
      </label>
    </div>
  );
};

export default UpdatesCheckbox;