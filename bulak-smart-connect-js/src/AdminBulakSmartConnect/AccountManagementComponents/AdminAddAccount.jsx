import React, { useState } from 'react';
import '../AccountManagementComponents/AdminAddAccount.css';

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    contact: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));

    if (files) {
      const file = files[0];
      setPhotoPreview(URL.createObjectURL(file));
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const clearPhoto = () => {
    setFormData(prevData => ({
      ...prevData,
      photo: null,
    }));
    setPhotoPreview(null);
  };

  const handleSubmit = e => {
    e.preventDefault();
    let validationErrors = {};

    // Check if all required fields are filled
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        validationErrors[key] = 'This field is required';
      }
    });

    // Password match check
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    // Contact number format check
    if (formData.contact && !/^\d{10}$/.test(formData.contact)) {
      validationErrors.contact = 'Contact number must be exactly 10 digits';
    }

    // Email format check: must contain "@"
    if (formData.email && !formData.email.includes('@')) {
      validationErrors.email = 'Email must contain "@"';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert('User added successfully!');
      // Submit logic here
    }
  };

  return (
    <div>
      <h1>Add User</h1>
      <div className="admin-add-user">
        <form className="user-form" onSubmit={handleSubmit} noValidate>
          <div className="photo-upload">
            <label htmlFor="photo">
              <div className="upload-box">
                <i className="fas fa-upload"></i>
                <p>Upload Photo</p>
                {photoPreview && (
                  <div className="photo-preview-container">
                    <img src={photoPreview} alt="Photo Preview" className="photo-preview" />
                    <button type="button" className="clear-photo-btn" onClick={clearPhoto}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
            </label>
            <input type="file" id="photo" name="photo" accept="image/*" onChange={handleChange} />
            {errors.photo && <p className="error">{errors.photo}</p>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>
                Username <span>*</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>

            <div className="form-group">
              <label>
                Email <span>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label>
                Password <span>*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label>
                Confirm Password <span>*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>

            <div className="form-group">
              <label>
                First Name <span>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>

            <div className="form-group">
              <label>
                Last Name <span>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>

            <div className="form-group contact-split">
              <label>
                Contact Number <span>*</span>
              </label>
              <div className="contact-input-wrapper">
                <input type="text" value="+63" disabled className="country-code" />
                <input
                  type="text"
                  name="contact"
                  placeholder="Enter 12-digit number"
                  value={formData.contact}
                  maxLength="10"
                  onChange={e => {
                    const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData(prev => ({ ...prev, contact: numbersOnly }));
                  }}
                  className="phone-number"
                />
              </div>
              {errors.contact && <p className="error">{errors.contact}</p>}
            </div>

            <div className="form-group">
              <label>
                User Role <span>*</span>
              </label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
              {errors.role && <p className="error">{errors.role}</p>}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Add User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUser;
