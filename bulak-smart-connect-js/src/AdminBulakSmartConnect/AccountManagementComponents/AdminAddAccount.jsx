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
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
    document.getElementById('photo').value = null;
  };

  const handleSubmit = e => {
    e.preventDefault();
    let validationErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        validationErrors[key] = 'This field is required';
      }
    });

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.contact && !/^\d{10}$/.test(formData.contact)) {
      validationErrors.contact = 'Contact number must be exactly 10 digits after +63';
    }

    if (formData.email && !formData.email.includes('@')) {
      validationErrors.email = 'Email must contain "@"';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert('User added successfully!');
      // TODO: Submit data to backend or Firebase
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
                    <img src={photoPreview} alt="Preview" className="photo-preview" />
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
                  {label} <span>*</span>
                </label>
                <input
                  type={type}
                  name={name}
                  placeholder={`Enter ${label}`}
                  value={formData[name]}
                  onChange={handleChange}
                />
                {errors[name] && <p className="error">{errors[name]}</p>}
              </div>
            ))}

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
                    setErrors(prev => ({ ...prev, contact: '' }));
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
