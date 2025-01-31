import React, { useState, useEffect } from "react";
import UsernamePasswordSection from "./UserNamePassword";
import FullNameSection from "./FullName";
import AddressSection from "./Address";
import BirthdateSection from "./BirthDate";
import ContactInformationSection from "./ContactInformation";
import UpdatesCheckbox from "./UpdateCheckbox";
import NavBar from "./NavBar";
import "../SignUpComponents/BirthDate.css";
import "../SignUpComponents/Address.css";
import "../SignUpComponents/ContactInformation.css";
import "../SignUpComponents/UpdateCheckbox.css";
import "../SignUpComponents/UserNamePassword.css";
import "../SignUpComponents//NavBar.css";
//import "../SignUpForm.css";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    lastname: "",
    firstname: "",
    middlename: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    residence: "",
    month: "",
    day: "",
    year: "",
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

  useEffect(() => {
    if (formData.day && formData.month && formData.year) {
      const birthDate = new Date(`${formData.month} ${formData.day}, ${formData.year}`);
      if (!isNaN(birthDate)) {
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const monthDifference = new Date().getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && new Date().getDate() < birthDate.getDate())) {
          setFormData((prevFormData) => ({ ...prevFormData, age: age - 1 }));
        } else {
          setFormData((prevFormData) => ({ ...prevFormData, age }));
        }
      }
    }
  }, [formData.day, formData.month, formData.year]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};
    if (!formData.username) formErrors.username = "Username is required";
    if (!formData.password) formErrors.password = "Password is required";
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
      <div className="Navigation"><NavBar /></div>
      <h2>Signup Form</h2>
      <form onSubmit={handleSubmit}>
        <UsernamePasswordSection formData={formData} handleInputChange={handleInputChange} errors={errors} />
        <FullNameSection formData={formData} handleInputChange={handleInputChange} />
        <AddressSection formData={formData} handleInputChange={handleInputChange} />
        <BirthdateSection formData={formData} handleInputChange={handleInputChange} />
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
