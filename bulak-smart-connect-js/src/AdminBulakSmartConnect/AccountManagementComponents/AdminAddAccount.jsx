import React, { useState, useEffect } from 'react';
import '../AccountManagementComponents/AdminAddAccount.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { addUser, updateUser } from './NewUserInfo';
import NavBar from '../../NavigationComponents/NavSide';

const AdminAddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isModifying = location.state?.isModifying || false;
  const userToEdit = location.state?.userData || null;
  const userIndex = location.state?.userIndex;

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

  // Populate form data if editing an existing user
  useEffect(() => {
    if (isModifying && userToEdit) {
      // Extract first and last name from full name
      const nameParts = userToEdit.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Extract contact number without country code
      const contact = userToEdit.contact?.replace('+63', '') || '';
      
      setFormData({
        username: userToEdit.username || '',
        contact,
        email: userToEdit.email || '',
        role: userToEdit.roles?.[0] || '',
        // Don't prefill password fields for security
        password: '',
        confirmPassword: '',
        firstName,
        lastName,
      });
    }
  }, [isModifying, userToEdit]);

  // Rest of the component remains similar, but handle form submission differently
  
  const handleChange = e => {
    const { name, value } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

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
        // Skip password validation if modifying a user
        if (isModifying && (key === 'password' || key === 'confirmPassword')) {
          return;
        }
        
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          validationErrors[key] = 'This field is required';
        }
      });

      // Password validation only if adding or if passwords were provided
      if (!isModifying || (formData.password || formData.confirmPassword)) {
        if (formData.password !== formData.confirmPassword) {
          validationErrors.confirmPassword = 'Passwords do not match';
        }
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
        let success;
        
        if (isModifying) {
          // Update existing user
          success = updateUser(userIndex, {
            name: `${formData.firstName} ${formData.lastName}`,
            status: userToEdit.status,
            roles: [formData.role],
            image: userToEdit.image || '',
            username: formData.username,
            email: formData.email,
            contact: `+63${formData.contact}`,
            // Only update password if provided
            ...(formData.password ? { password: formData.password } : {})
          });
          
          if (success) {
            alert('User updated successfully!');
          } else {
            alert('Failed to update user. Please try again.');
          }
        } else {
          // Add new user
          success = addUser(formData);
          
          if (success) {
            alert('User added successfully!');
          } else {
            alert('Failed to add user. Please try again.');
          }
        }
        
        if (success) {
          navigate('/admin-user-management');
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
       <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
       
      <h1>{isModifying ? 'Modify User' : 'Add User'}</h1>
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
              // Only show password fields if adding a new user or conditionally later
              ...(isModifying ? [] : [
                { label: 'Password', name: 'password', type: 'password' },
                { label: 'Confirm Password', name: 'confirmPassword', type: 'password' }
              ]),
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

            {/* Password section for modifying users - optional */}
            {isModifying && (
              <>
                <div className="form-group">
                  <label>Password (leave blank to keep current)</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error-input' : ''}
                  />
                  {errors.password && <p className="error">{errors.password}</p>}
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error-input' : ''}
                  />
                  {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </div>
              </>
            )}

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
              {submitting 
                ? (isModifying ? 'Updating User...' : 'Adding User...') 
                : (isModifying ? 'Update User' : 'Add User')}
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