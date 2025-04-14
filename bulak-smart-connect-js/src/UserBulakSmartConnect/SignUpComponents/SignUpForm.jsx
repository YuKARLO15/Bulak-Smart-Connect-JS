import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UsernamePasswordSection from "./UserNamePassword";
import FullNameSection from "./FullName";
import ContactInformationSection from "./ContactInformation";
import UpdatesCheckbox from "./UpdateCheckbox";
import NavBar from "../../NavigationComponents/NavBar";
import DataPrivacy from "./DataPrivacy";
import "../SignUpComponents/ContactInformation.css";
import "../SignUpComponents/UpdateCheckbox.css";
import "../SignUpComponents/UserNamePassword.css";
import "../SignUpComponents/SignUpForm.css";

import "../SignUpComponents/DataPrivacy.css"
import { authService } from "../../services/api"; //API Service to NestJS

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmpassword: "",
    lastname: "",
    firstname: "",
    middlename: "",
    contact: "",
    email: "",
    updates: false,
    age: "",
    hasExtension: false, 
    extension: "",       
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // contacts numeric onleeeee
    if (name === "contact") {
      const formattedValue = value.replace(/\D/g, ""); 

          //11 digits
      if (formattedValue.length <= 11) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          contact: formattedValue,
        }));
      }
    } else {
      
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validate = (formData) => {
    let formErrors = {};
    if (!formData.username) formErrors.username = "Username is required";
    if (!formData.password) formErrors.password = "Password is required";
    if (!formData.confirmpassword) formErrors.confirmpassword = "Password is required";
    if (formData.password !== formData.confirmpassword) formErrors.confirmpassword = "Passwords do not match";
    if (!formData.lastname) formErrors.lastname = "Last name is required";
    if (!formData.firstname) formErrors.firstname = "First name is required";
    if (!formData.email) formErrors.email = "Email is required";
    return formErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted"); //Debugging Statement
    console.log("Form data at submission:", formData); //Debugging Statement
    const formErrors = validate(formData);
    console.log("Validation errors:", formErrors); //Debugging Statement
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      console.log("Form valid, attempting registration with:", formData); //Debugging Statement
      try {
        setIsLoading(true);
        
        // Register user with MySQL
        await authService.register({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstname} ${formData.lastname}`
        });
        
        setIsLoading(false);
        setSuccess(true);
        
        // Redirect to login page after short delay
        setTimeout(() => {
          navigate("/LogIn");
        }, 2000);
      } catch (error) {
        setIsLoading(false);
        
        console.log('Error response:', error.response); // Add this to debug
        
        if (error.response) {
          // Check for 409 Conflict status code
          if (error.response.status === 409) {
            setErrors({ ...formErrors, email: 'This email is already registered' });
          } else {
            // Handle other error messages from the server
            const errorMessage = error.response.data?.message || 'Registration failed. Please try again.';
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
      <h2>Signup Form</h2>
      
      <form onSubmit={handleSubmit}>
        <FullNameSection formData={formData} handleInputChange={handleInputChange} errors={errors} />
        <UsernamePasswordSection formData={formData} handleInputChange={handleInputChange} errors={errors} setErrors={setErrors} />
        <ContactInformationSection formData={formData} handleInputChange={handleInputChange} errors={errors} />
        <DataPrivacy formData={formData} handleInputChange={handleInputChange} />
        <UpdatesCheckbox formData={formData} handleInputChange={handleInputChange} />
        
        {/* Visualization if working */}
        {isLoading && <div className="loading-message">Loading...</div>}
        {success && <div className="success-message">Registration successful! Redirecting to login...</div>}
        
        {/* Display error messages is email already exists */}
        {errors.email && (
          <div className="error-message" style={{ textAlign: 'center', marginBottom: '10px', color: 'red' }}>
            {errors.email}
          </div>
        )}
        
        {errors.submit && (
          <div className="error-message" style={{ textAlign: 'center', marginBottom: '10px', color: 'red' }}>
            {errors.submit}
          </div>
        )}

        <button type="submit" className="btn">Signup</button>
        <div className="footer">
          Already have an account? <Link to="/LogIn">Sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
