import React, { useState, useEffect } from "react";
import "../styles/SignUpForm.css";

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

  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", 
    "September", "October", "November", "December",
  ];

  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, index) => currentYear - index
  );


  const barangays = [
    "Akle", "Alagao", "Anyatam", "Bagong Barrio", "Basuit", "Bubulong Malaki", "Bubulong Munti", 
    "Buhol na Mangga", "Bulusukan", "Calasag", "Calawitan", "Casalat", "Gabihan", "Garlang", 
    "Lapnit", "Maasim", "Makapilapil", "Malipampang", "Mataas na Parang", "Matimbubong", 
    "Nabaong Garlang", "Palapala", "Pasong Bangkal", "Pinaod", "Poblacion", "Pulong Tamo", 
    "San Juan", "Santa Catalina Bata", "Santa Catalina Matanda", "Sapang Dayap", "Sapang Putik", 
    "Sapang Putol", "Sumandig", "Telapatio", "Umpucan", "Upig"
  ];


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Calculate Age based on selected birthdate
  useEffect(() => {
    console.log("month" + formData.month);
    console.log("day" + formData.day);
    console.log("year" + formData.year);
    
    if (formData.day && formData.month && formData.year) {
      const birthDate = new Date(
        `${formData.month} ${formData.day}, ${formData.year}`
      );

      if (!isNaN(birthDate)) {
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const monthDifference = new Date().getMonth() - birthDate.getMonth();

        if (
          monthDifference < 0 ||
          (monthDifference === 0 && new Date().getDate() < birthDate.getDate())
        ) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            age: age - 1,
          }));
        } else {
          setFormData((prevFormData) => ({
            ...prevFormData,
            age: age,
          }));
        }
      }
    }
  }, [formData.day, formData.month, formData.year]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation before submission
    let formErrors = {};
    if (!formData.username) formErrors.username = "Username is required";
    if (!formData.password) formErrors.password = "Password is required";
    if (!formData.lastname) formErrors.lastname = "Last name is required";
    if (!formData.firstname) formErrors.firstname = "First name is required";
    if (!formData.email) formErrors.email = "Email is required";

    setErrors(formErrors);

    // If there are no errors, log the form data
    if (Object.keys(formErrors).length === 0) {
      console.log("Form submitted:", formData);
    }
  };


  return (
    <div className="signup-container">
      <h2>Signup Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Username and Password Section */}
        <div className="form-group inline" id="section1">
          <div className="form-control" id="username-container">
            <label className="labels">Username</label>
            <input
              type="text"
              id="Username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <span className="error-message">{errors.username}</span>
          </div>

          <div className="form-control" id="password-container">
            <label className="labels">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <span className="error-message">{errors.password}</span>
          </div>
        </div>

        {/* Identifying Information Section */}
        <div className="CategoryDivider">
          <h2>Identifying Information</h2>
        </div>

        <div className="form-group">
          <label className="label-category">
            1. Full Name ( Buong Pangalan )
          </label>
          <label className="labels"> </label>
          <div className="form-group inline">
            <input
              type="text"
              id="LastName"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              id="FirstName"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              id="MiddleName"
              name="middlename"
              placeholder="Middle Name (Optional)"
              value={formData.middlename}
              onChange={handleInputChange}
            />
          </div>

          {/* Extension Name Section */}
          <div className="checkbox-extension">
            <label className="labels">
              <input
                type="checkbox"
                id="HasExtension"
                name="hasExtension"
                checked={formData.hasExtension || false}
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    hasExtension: e.target.checked,
                    extension: e.target.checked ? prevFormData.extension : "",
                  }))
                }
              />
              Check this box if the registrant have a name extention
            </label>
            <div className="extension-name">
              {formData.hasExtension && (
              <select
                id="Extension"
                name="extension"
                value={formData.extension || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Extension</option>
                <option value="Sr.">Sr.</option>
                <option value="Jr.">Jr.</option>
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
                <option value="VI">VI</option>
              </select>
            )}
            </div>
          </div>
        </div>

        {/* Permanent Address Section */}
        <div className="form-group">
          <label className="label-category">
            2. Permanet Address ( Permanenteng Tirahan )
          </label>
          <div className="form-group inline">
            <input
              type="text"
              id="Region"
              name="region"
              placeholder="Region"
              value={formData.region}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              id="Province"
              name="province"
              placeholder="Province"
              value={formData.province}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              id="City"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group inline">
          <select
              id="Barangay"
              name="barangay"
              value={formData.barangay}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Barangay</option>
              {barangays.map((barangay, index) => (
                <option key={index} value={barangay}>
                  {barangay}
                </option>
              ))}
            </select>
            <input
              type="text"
              id="Street"
              name="residence"
              placeholder="Residence/Street"
              value={formData.residence}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Birthdate Section */}
        <div className="form-group">
          <label className="label-category">3. Birthdate ( Kaarawan )</label>
          <div className="form-group inline">
            <select
              id="Month"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Month</option>
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select
              id="Day"
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <select
              id="Year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
              
            </select>

           
            <input
              type="text"
              id="Age"
              name="age"
              placeholder="Age"
              value={formData.age || ""} // Ensures age is shown or an empty string if undefined
              readOnly
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="form-group">
          <label className="label-category">
            4. Contact Information ( Detalye ng pakikipag-ugnayan )
          </label>
          <div className="form-group inline">
            <input
              type="text"
              id="ContactNumber"
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Updates Checkbox */}
        <div className="form-control" id="updates-container">
          <label className="ReceiveUpdateText">
            <input
              type="checkbox"
              id="CheckBox"
              name="updates"
              checked={formData.updates}
              onChange={handleInputChange}
            />
            I want to receive updates via email.
          </label>
        </div>

        {/* Signup Button */}
        <button type="submit" className="btn">
          Signup
        </button>

        {/* Footer Section */}
        <div className="footer">
          Already have an account? <a href="#">Sign in</a>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
