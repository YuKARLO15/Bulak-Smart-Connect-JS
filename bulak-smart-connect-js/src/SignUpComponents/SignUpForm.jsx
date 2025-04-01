import React, { useState, useEffect } from "react";
import UsernamePasswordSection from "./UserNamePassword";
import FullNameSection from "./FullName";
import ContactInformationSection from "./ContactInformation";
import UpdatesCheckbox from "./UpdateCheckbox";
import NavBar from "../LogInComponents/NavBar";
import "../SignUpComponents/ContactInformation.css";
import "../SignUpComponents/UpdateCheckbox.css";
import "../SignUpComponents/UserNamePassword.css";
import "../SignUpComponents/SignUpForm.css";
import "../LogInComponents/NavBar.css";
//import "../SignUpComponents/SignUpForm.css";

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
  });

  const [errors, setErrors] = useState({});

  
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



  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};
    if (!formData.username) formErrors.username = "Username is required";
    if (!formData.password) formErrors.password = "Password is required";
    if (!formData.confirmpassword) formErrors.password = "Password is required";
    if (!formData.lastname) formErrors.lastname = "Last name is required";
    if (!formData.firstname) formErrors.firstname = "First name is required";
    if (!formData.email) formErrors.email = "Email is required";
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="signup-container">
          <div className="Navigation">
            <NavBar />
            </div>
      <h2>Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <FullNameSection formData={formData} handleInputChange={handleInputChange} />
        <UsernamePasswordSection formData={formData} handleInputChange={handleInputChange} errors={errors} setErrors={setErrors} />
        <ContactInformationSection formData={formData} handleInputChange={handleInputChange} />
        <UpdatesCheckbox formData={formData} handleInputChange={handleInputChange} />
        <button type="submit" className="btn">Signup</button>
        <div className="footer">
          Already have an account? <a href="/">Sign in</a>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
