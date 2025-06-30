import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UsernamePasswordSection from './UserNamePassword';
import FullNameSection from './FullName';
import ContactInformationSection from './ContactInformation';
import HeroBg from '../../LandingPageComponents/LandingPageAssets/HeroBg.JPEG';
// import UpdatesCheckbox from './UpdateCheckbox';
import NavBar from '../../NavigationComponents/NavBar';
import DataPrivacy from './DataPrivacy';
import '../SignUpComponents/ContactInformation.css';
import '../SignUpComponents/UpdateCheckbox.css';
import '../SignUpComponents/UserNamePassword.css';
import '../SignUpComponents/SignUpForm.css';

import '../SignUpComponents/DataPrivacy.css';
import { authService } from '../../services/api'; //API Service to NestJS

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmpassword: '',
    lastname: '',
    firstname: '',
    middlename: '',
    contact: '',
    email: '',
    updates: false,
    age: '',
    hasExtension: false,
    extension: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Load saved form data from sessionStorage on component mount
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('signupFormData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
        // Clear corrupted data
        sessionStorage.removeItem('signupFormData');
      }
    }
  }, []);

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;

    let updatedFormData;

    // contacts numeric onleeeee
    if (name === 'contact') {
      const formattedValue = value.replace(/\D/g, '');

      //11 digits
      if (formattedValue.length <= 11) {
        updatedFormData = {
          ...formData,
          contact: formattedValue,
        };
      } else {
        return; // Don't update if exceeds 11 digits
      }
    } else {
      updatedFormData = {
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      };
    }

    setFormData(updatedFormData);
    
    // Save to sessionStorage (exclude sensitive data like passwords for security)
    const dataToSave = { ...updatedFormData };
    if (name !== 'password' && name !== 'confirmpassword') {
      sessionStorage.setItem('signupFormData', JSON.stringify(dataToSave));
    }
  };

  const validate = formData => {
    let formErrors = {};

    // Username validations
    if (!formData.username) {
      formErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      formErrors.username = 'Username must be at least 4 characters';
    }

    // Email validations
    if (!formData.email) {
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters long';
    } else {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

      if (!hasUpperCase) {
        formErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!hasLowerCase) {
        formErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!hasNumbers) {
        formErrors.password = 'Password must contain at least one number';
      } else if (!hasSpecialChars) {
        formErrors.password = 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)';
      }
    }

    if (!formData.confirmpassword) formErrors.confirmpassword = 'Password is required';
    if (formData.password !== formData.confirmpassword)
      formErrors.confirmpassword = 'Passwords do not match';
    if (!formData.lastname) formErrors.lastname = 'Last name is required';
    if (!formData.firstname) formErrors.firstname = 'First name is required';
    return formErrors;
  };

  const handleSubmit = async event => {
    event.preventDefault();
    console.log('Form submitted');
    console.log('Form data at submission:', formData); //Debugging Statement
    const formErrors = validate(formData);
    console.log('Validation errors:', formErrors); //Debugging Statement
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      console.log('Form valid, attempting registration with:', formData); //Debugging Statement
      try {
        setIsLoading(true);

        // Register user with MySQL
        await authService.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          firstName: formData.firstname,
          lastName: formData.lastname,
          ...(formData.middlename && { middleName: formData.middlename }),
          ...(formData.hasExtension && formData.extension && { nameExtension: formData.extension }),
          contactNumber: formData.contact,
          name: `${formData.firstname} ${formData.middlename ? formData.middlename + ' ' : ''}${formData.lastname}${formData.hasExtension && formData.extension ? ' ' + formData.extension : ''}`,
          // updates: formData.updates,
          // age: formData.age,
        });

        setIsLoading(false);
        setSuccess(true);

        // Clear sessionStorage on successful registration
        sessionStorage.removeItem('signupFormData');

        // Redirect to login page after short delay
        setTimeout(() => {
          navigate('/LogIn');
        }, 2000);
      } catch (error) {
        setIsLoading(false);

        console.log('Error response:', error.response); // Add this to debug

        if (error.response) {
          // Check for 409 Conflict status code
          if (error.response.status === 409) {
            setErrors({ ...formErrors, email: 'This email is already registered' });
          } else {
            const errorMessage =
              error.response.data?.message || 'Registration failed. Please try again.';
            setErrors({ ...formErrors, submit: errorMessage });
          }
        } else {
          setErrors({ ...formErrors, submit: 'Registration failed. Please try again.' });
        }

        console.error('Registration error:', error);
      }
    }
  };

  return (
   
    <div className="signup-container">

        <div className="Navigation">
          <NavBar />
        </div>


      <h2 className="signup-label">Sign Up Form</h2>

      <form onSubmit={handleSubmit}>
        <FullNameSection
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />
        <UsernamePasswordSection
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
          setErrors={setErrors}
        />
        <ContactInformationSection
          formData={formData}
          handleInputChange={handleInputChange}
          errors={errors}
        />
        <DataPrivacy formData={formData} handleInputChange={handleInputChange} />
        {/* <UpdatesCheckbox formData={formData} handleInputChange={handleInputChange} /> */}

        {/* Visualization if working */}
        {isLoading && <div className="loading-message">Loading...</div>}
        {success && (
          <div className="success-message">Registration successful! Redirecting to login...</div>
        )}

        {/* Display error messages is email already exists */}
        {errors.email && (
          <div
            className="error-message"
            style={{ textAlign: 'center', marginBottom: '10px', color: 'red' }}
          >
            {errors.email}
          </div>
        )}

        {errors.submit && (
          <div
            className="error-message"
            style={{ textAlign: 'center', marginBottom: '10px', color: 'red' }}
          >
            {errors.submit}
          </div>
        )}

        <button type="submit" className="signup-btn">
          Sign Up
        </button>
        <div className="footer">
          Already have an account? <Link to="/LogIn">Sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;