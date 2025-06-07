import React, { useState, useEffect } from 'react';
import '../AccountManagementComponents/AdminAddAccount.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { addUser, updateUser } from './NewUserInfo'; // Keep for localStorage fallback
import NavBar from '../../NavigationComponents/NavSide';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const AdminAddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUpdateUser } = useAuth();
  
  const isModifying = location.state?.isModifying || false;
  const userToEdit = location.state?.userData || null;
  const userIndex = location.state?.userIndex;
  const userId = location.state?.userId;

  const [formData, setFormData] = useState({
    username: '',
    contact: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    middleName: '',
    nameExtension: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Available roles
  const availableRoles = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'staff' },
    { id: 3, name: 'super_admin' },
    { id: 4, name: 'citizen' }
  ];

  // Populate form data if editing an existing user
  useEffect(() => {
    if (isModifying && userToEdit) {
      // Clean contact number for editing
      let cleanContact = '';
      if (userToEdit.contact && userToEdit.contact !== 'N/A') {
        cleanContact = userToEdit.contact.replace('+63', '');
      }

      setFormData({
        username: userToEdit.username && userToEdit.username !== 'N/A' ? userToEdit.username : '',
        contact: cleanContact,
        email: userToEdit.email || '',
        firstName: userToEdit.firstName || '',
        middleName: userToEdit.middleName || '',
        lastName: userToEdit.lastName || '',
        nameExtension: userToEdit.nameExtension || '',
        role: userToEdit.roles?.[0] || 'citizen', // Take first role
        password: '',
        confirmPassword: '',
      });
    }
  }, [isModifying, userToEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors when user starts typing
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let validationErrors = {};

      // Basic validation
      const requiredFields = ['email', 'firstName', 'lastName', 'role'];
      if (!isModifying) {
        requiredFields.push('password', 'confirmPassword');
      }

      requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
          validationErrors[field] = 'This field is required';
        }
      });

      // Password validation only if adding or if passwords were provided
      if (!isModifying || (formData.password || formData.confirmPassword)) {
        if (formData.password !== formData.confirmPassword) {
          validationErrors.confirmPassword = 'Passwords do not match';
        }
        if (formData.password && formData.password.length < 6) {
          validationErrors.password = 'Password must be at least 6 characters';
        }
      }

      // Contact number validation (optional)
      if (formData.contact && !/^\d{10}$/.test(formData.contact)) {
        validationErrors.contact = 'Contact number must be exactly 10 digits';
      }

      // Email validation
      if (formData.email && !formData.email.includes('@')) {
        validationErrors.email = 'Please enter a valid email address';
      }

      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        let success = false;
        
        // Prepare user data
        const userData = {
          email: formData.email,
          username: formData.username || undefined,
          firstName: formData.firstName,
          middleName: formData.middleName || undefined,
          lastName: formData.lastName,
          nameExtension: formData.nameExtension || undefined,
          contactNumber: formData.contact ? `+63${formData.contact}` : undefined,
          name: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}${formData.nameExtension ? ' ' + formData.nameExtension : ''}`,
          role: formData.role,
          roles: [formData.role], // Array format
          status: 'Not Logged In',
          isActive: true,
        };

        // Only include password if provided
        if (formData.password) {
          userData.password = formData.password;
        }

        if (isModifying) {
          // Update existing user
          try {
            if (userId) {
              // Try backend first
              const roleId = availableRoles.find(r => r.name === formData.role)?.id || 4;
              const backendData = {
                ...userData,
                roleIds: [roleId],
                defaultRoleId: roleId,
              };
              
              const result = await adminUpdateUser(userId, backendData);
              if (result.success) {
                console.log('User updated via backend');
                success = true;
              } else {
                throw new Error(result.error || 'Backend update failed');
              }
            } else {
              throw new Error('No user ID for backend update');
            }
          } catch (backendError) {
            console.warn('Backend update failed, trying localStorage:', backendError);
            
            // Fallback to localStorage
            if (userIndex !== undefined) {
              const result = updateUser(userIndex, userData);
              if (result.success) {
                console.log('User updated via localStorage');
                success = true;
              } else {
                alert(result.message || 'Failed to update user');
              }
            }
          }
        } else {
          // Add new user
          try {
            const roleId = availableRoles.find(r => r.name === formData.role)?.id || 4;
            const backendData = {
              ...userData,
              roleIds: [roleId],
              defaultRoleId: roleId,
            };
            
            await userService.createUser(backendData);
            console.log('User created via backend');
            success = true;
          } catch (backendError) {
            console.warn('Backend creation failed, trying localStorage:', backendError);
            
            // Fallback to localStorage
            const result = addUser(userData);
            if (result.success) {
              console.log('User created via localStorage');
              success = true;
            } else {
              alert(result.message || 'Failed to create user');
            }
          }
        }

        if (success) {
          alert(isModifying ? 'User updated successfully!' : 'User created successfully!');
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

  return (
    <div>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <h2 className='modifying-user'>{isModifying ? 'Modify User' : 'Add User'}</h2>
      <div className="admin-add-user">
        <form 
          className="user-form" 
          onSubmit={handleSubmit} 
          noValidate
        >
          <div className="form-grid">
            {/* Basic Information Fields */}
            {[
              { label: 'First Name', name: 'firstName' },
              { label: 'Last Name', name: 'lastName' },
              { label: 'Middle Name', name: 'middleName', required: false },
              { label: 'Name Extension', name: 'nameExtension', required: false },
              { label: 'Username', name: 'username', required: false },
              { label: 'Email', name: 'email', type: 'email' },
            ].map(({ label, name, type = 'text', required = true }) => (
              <div className="form-group" key={name}>
                <label>
                  {label} {required && <span className="required">*</span>}
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

            {/* Role Selection */}
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
                {availableRoles.map(role => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role && <p className="error">{errors.role}</p>}
            </div>

            {/* Contact Number */}
            <div className="form-group contact-split">
              <label>Contact Number</label>
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

            {/* Password fields */}
            <div className="form-group">
              <label>
                Password {!isModifying && <span className="required">*</span>}
                {isModifying && <span style={{fontSize: '12px', color: '#666'}}> (leave blank to keep current)</span>}
              </label>
              <input
                type="password"
                name="password"
                placeholder={isModifying ? "Enter new password" : "Enter password"}
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error-input' : ''}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label>
                Confirm Password {!isModifying && <span className="required">*</span>}
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error-input' : ''}
              />
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
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