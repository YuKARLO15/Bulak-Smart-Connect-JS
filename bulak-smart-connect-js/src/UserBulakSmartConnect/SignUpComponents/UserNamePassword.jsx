import React, { useState, useEffect } from 'react';
import '../SignUpComponents/UserNamePassword.css';
import '../SignUpComponents/SignUpForm';

const UsernamePasswordSection = ({ formData, handleInputChange, errors, setErrors }) => {
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(e);

    if (name === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
    }
  };

  const handlePasswordValidation = e => {
    const { name, value } = e.target;
    
    if (name === 'password') {
      handlePasswordChange(e);
    } else {
      handleInputChange(e);
    }

    if (name === 'confirmpassword') {
      if (formData.password !== value) {
        setErrors({
          ...errors,
          confirmpassword: 'Passwords do not match',
        });
      } else {
        setErrors({
          ...errors,
          confirmpassword: '',
        });
      }
    }
  };

  useEffect(() => {
    if (formData.password === formData.confirmpassword) {
      setErrors(prevErrors => ({
        ...prevErrors,
        confirmpassword: '',
      }));
    }
  }, [formData.password, formData.confirmpassword, setErrors]);

  const ValidationItem = ({ isValid, text }) => (
    <div className={`validation-item ${isValid ? 'valid' : 'invalid'}`}>
      <div className={`validation-icon ${isValid ? 'valid' : 'invalid'}`}>
        {isValid ? '✓' : '✗'}
      </div>
      <span className="validation-text">{text}</span>
    </div>
  );

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
          placeholder="Create Password"
          value={formData.password}
          onChange={handlePasswordChange}
          required
        />
        <span className="error-message">{errors.password}</span>
      </div>

      <div className="form-control" id="confirmpassword-container">
        <label className="labels">
          Confirm Password <span className="asterisk"> *</span>{' '}
          <span className="error-message-password">{errors.confirmpassword}</span>
        </label>
        <input
          type="password"
          name="confirmpassword"
          placeholder="Confirm Password"
          value={formData.confirmpassword}
          onChange={handlePasswordValidation}
          required
        />
      </div>

      {/* Password Validation Display - Positioned in second column */}
      {formData.password && (
        <div className="password-validation">
          <h4>Your password must contain:</h4>
          <ValidationItem 
            isValid={passwordValidation.length} 
            text="At least 8 characters" 
          />
          <ValidationItem 
            isValid={passwordValidation.lowercase} 
            text="Lowercase letters (a-z)" 
          />
          <ValidationItem 
            isValid={passwordValidation.uppercase} 
            text="Uppercase letters (A-Z)" 
          />
          <ValidationItem 
            isValid={passwordValidation.number} 
            text="Numbers (0-9)" 
          />
          <ValidationItem 
            isValid={passwordValidation.special} 
            text="Special characters (e.g. !@#$%^&*)" 
          />
        </div>
      )}
    </div>
  );
};

export default UsernamePasswordSection;
