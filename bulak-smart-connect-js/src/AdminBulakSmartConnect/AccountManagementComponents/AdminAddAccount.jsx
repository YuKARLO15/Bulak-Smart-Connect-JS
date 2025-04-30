import React, { useState } from 'react';
import '../AccountManagementComponents/AdminAddAccount.css';
import { useNavigate } from 'react-router-dom';
import { addUser } from './NewUserInfo'; // Import the addUser function

const AdminAddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    contact: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors for this field when user starts typing
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let validationErrors = {};

      // Basic validation
      Object.entries(formData).forEach(([key, value]) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          validationErrors[key] = 'This field is required';
        }
      });

      // Password validation
      if (formData.password !== formData.confirmPassword) {
        validationErrors.confirmPassword = 'Passwords do not match';
      }

      // Contact number validation
      if (formData.contact && !/^\d{10}$/.test(formData.contact)) {
        validationErrors.contact = 'Contact number must be exactly 10 digits after +63';
      }

      // Email validation
      if (formData.email && !formData.email.includes('@')) {
        validationErrors.email = 'Please enter a valid email address';
      }

      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        // Use the imported addUser function from newuser.js
        const success = addUser(formData);
        
        if (success) {
          // Reset form
          setFormData({
            username: '',
            contact: '',
            email: '',
            role: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
          });
          
          alert('User added successfully!');
          navigate('/admin-user-management');
        } else {
          alert('Failed to add user. Please try again.');
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('An error occurred while adding the user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Add User</h1>
      <div className="admin-add-user">
        <form 
          className="user-form" 
          onSubmit={handleSubmit} 
          noValidate
        >
          <div className="form-grid">
            {[
              { label: 'Username', name: 'username' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Password', name: 'password', type: 'password' },
              { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
              { label: 'First Name', name: 'firstName' },
              { label: 'Last Name', name: 'lastName' },
            ].map(({ label, name, type = 'text' }) => (
              <div className="form-group" key={name}>
                <label>
                  {label} <span className="required">*</span>
                </label>
                <input
                  type={type}
                  name={name}
                  placeholder={`Enter ${label}`}
                  value={formData[name]}
                  onChange={handleChange}
                  className={errors[name] ? 'error-input' : ''}
                />
                {errors[name] && <p className="error">{errors[name]}</p>}
              </div>
            ))}
            <div className="form-group contact-split">
              <label>
                Contact Number <span className="required">*</span>
              </label>
              <div className="contact-input-wrapper">
                <input type="text" value="+63" disabled className="country-code" />
                <input
                  type="text"
                  name="contact"
                  placeholder="Enter 10-digit number"
                  value={formData.contact}
                  maxLength="10"
                  onChange={e => {
                    const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData(prev => ({ ...prev, contact: numbersOnly }));
                    setErrors(prev => ({ ...prev, contact: '' }));
                  }}
                  className={`phone-number ${errors.contact ? 'error-input' : ''}`}
                />
              </div>
              {errors.contact && <p className="error">{errors.contact}</p>}
            </div>

            <div className="form-group">
              <label>
                User Role <span className="required">*</span>
              </label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className={errors.role ? 'error-input' : ''}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
              {errors.role && <p className="error">{errors.role}</p>}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Adding User...' : 'Add User'}
            </button>
            
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/admin-user-management')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUser;