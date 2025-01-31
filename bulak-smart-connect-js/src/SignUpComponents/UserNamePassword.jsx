import React, { useState, useEffect } from "react";
import "../SignUpComponents/UsernamePassword.css";
import "../SignUpComponents/SignUpForm.css";

const UsernamePasswordSection = ({ formData, handleInputChange, errors }) => (
  <div className="form-group inline" id="section1">
    <div className="form-control" id="username-container">
      <label className="labels">Username  <span className="asterisk"> *</span></label> 
      
      
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
      <label className="labels">Password  <span className="asterisk"> *</span></label>
      <input
        type="password"
        name="password"
        placeholder="••••••"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      <span className="error-message">{errors.password}</span>
    </div>
  </div>
);

export default UsernamePasswordSection;