import React, { useState, useEffect } from "react";
import "../SignUpComponents/UserNamePassword.css";
import "../SignUpComponents/SignUpForm";

const UsernamePasswordSection = ({ formData, handleInputChange, errors, setErrors }) => {

  const handlePasswordValidation = (e) => {
    const { name, value } = e.target;
    handleInputChange(e); 


    if (name === "confirmpassword") {
      if (formData.password !== value) {
        setErrors({
          ...errors,
          confirmpassword: "Passwords do not match", 
        });
      } else {
        setErrors({
          ...errors,
          confirmpassword: "", 
        });
      }
    }
  };

  
  useEffect(() => {
    if (formData.password === formData.confirmpassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmpassword: "", 
      }));
    }
  }, [formData.password, formData.confirmpassword, setErrors]);

  return (
    <div className="form-group inline" id="section1">
      <div className="form-control" id="username-container">
        <label className="labels">
          Username <span className="asterisk"> *</span>
        </label>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <span className="error-message">{errors.username}</span>
      </div>

      <div className="form-control" id="password-container">
        <label className="labels">
          Password <span className="asterisk"> *</span>
        </label>
        <input
          type="password"
          name="password"
          placeholder="•••••••••"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <span className="error-message">{errors.password}</span>
      </div>

      <div className="form-control" id="password-container">
        
        <label className="labels">
          Confirm Password <span className="asterisk"> *</span>   <span className="error-message-password">{errors.confirmpassword}</span>
        </label>
        <input
          type="password"
          name="confirmpassword"
          placeholder="•••••••••"
          value={formData.confirmpassword}
          onChange={handlePasswordValidation}
          required
        />
      </div>
    </div>
  );
};

export default UsernamePasswordSection;
