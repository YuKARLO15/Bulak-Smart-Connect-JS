import React, { useState } from "react";
import "./AppointmentContent.css";

const AppointmentContainer = () => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleInitial: "",
    address: "",
    phoneNumber: "",
    reason: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

    // Allow only numbers and limit input to 11 characters
    if (/^\d*$/.test(value) && value.length <= 11) {
      setFormData({ ...formData, phoneNumber: value });
    }
  };

  return (
    <div className="AppointmentContainer">
      <h2 className="AppointmentTitle">APPOINTMENT</h2>
      <div className="ButtonContainer">
        <button className="SelfAppointment">Self-Appointment</button>
        <button className="OtherAppointment">Other Appointment</button>
      </div>
      <div className="FormGroup RowGroup">
        <div className="InputWrapper">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name / Apelyido"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="InputWrapper">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name / Pangalan"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="InputWrapper SmallInput">
          <label>Middle Name</label>
          <input
            type="text"
            name="middleInitial"
            placeholder="M.I."
            className="MiddleInitial"
            value={formData.middleInitial}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="FormGroup RowGroup">
        <div className="InputWrapper">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address / Tirahan"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="InputWrapper">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="09XXXXXXXXX"
            value={formData.phoneNumber}
            onChange={handlePhoneNumberChange}
            maxLength="11"
          />
          {formData.phoneNumber.length === 11 &&
            !/^09\d{9}$/.test(formData.phoneNumber) && (
              <span className="ErrorText">Invalid PH phone number format.</span>
            )}
        </div>
      </div>
      <div className="FormGroup RowGroup">
        <div className="InputWrapper">

            <label>Reason of Visit</label>

            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            >
              <option value="">Select a Reason/ Dahilan ng Pagpunta</option>
              <option value="Consultation">Birth Certificate</option>
              <option value="Follow-up">Marriage Certificate</option>
              <option value="Routine Check-up">Death Certificate </option>
              <option value="Routine Check-up">Cenomar </option>
            </select>
             
              </div>
            <div className="InputWrapper">
            <label>Select Date of Visit</label>
            <input
              type="date"
              name="date"
              placeholder="Date of Visit/ Petsa ng Pagbisita"
              value={formData.date}
              onChange={handleChange}
            />
              </div>
              </div>
          <div className="ConfirmContainer">                                                                       
          <button className="ConfirmButton">Confirm</button>
          </div>
          </div>
  );
};

export default AppointmentContainer;
