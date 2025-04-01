import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AppointmentContent.css";
import { saveRecentAppointments } from "./RecentAppointmentData";

const AppointmentContainer = ({ onBack, preselectedDate }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleInitial: "",
    address: "",
    phoneNumber: "",
    reason: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedDate, setSelectedDate] = useState(preselectedDate);
  const [tooltip, setTooltip] = useState(false);


  useEffect(() => {
    if (preselectedDate) {
      setSelectedDate(preselectedDate);
      setFormData({ ...formData, date: preselectedDate.toLocaleDateString() });
    }
  }, [preselectedDate]);

  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8;
    let minute = 0;

    while (hour < 17) {
      let startTime = `${hour}:${minute === 0 ? "00" : "30"} ${hour < 12 ? "AM" : "PM"}`;
      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour += 1;
      }
      let endTime = `${hour}:${minute === 0 ? "00" : "30"} ${hour < 12 ? "AM" : "PM"}`;
      slots.push(`${startTime} - ${endTime}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setFormData({ ...formData, phoneNumber: value });
    }
  };

  const handleDateChange = (date) => {
    if (date.getDay() === 0 || date.getDay() === 6) {
      setTooltip(true);
    } else {
      setTooltip(false);
      setSelectedDate(date);
      setFormData({ ...formData, date: date.toLocaleDateString() });
    }
  };

  const handleSubmit = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = "This field is required.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const appointmentId = `APPT-${Date.now()}`;

    const newAppointment = {
      id: appointmentId,
      type: formData.reason,
      date: formData.date,
      time: formData.time,
      lastName: formData.lastName,
      firstName: formData.firstName,
      middleInitial: formData.middleInitial,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
    };

    saveRecentAppointments(newAppointment);

    alert("Appointment Confirmed!");

    navigate(`/QRCodeAppointment/${appointmentId}`, { state: { appointment: newAppointment } });

    setFormData({
      lastName: "",
      firstName: "",
      middleInitial: "",
      address: "",
      phoneNumber: "",
      reason: "",
      date: "",
      time: "",
    });
  };

  return (
    <div className="AppointmentFormsContainer">
      <div className="AppointmentFContainer">
        <h2 className="AppointmentTitle">APPOINTMENT FORM</h2>
        
        {onBack && (
          <button 
            className="BackButton" 
            onClick={onBack}
            style={{ 
              position: 'absolute', 
              top: '10px', 
              left: '10px',
              padding: '5px 10px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back
          </button>
        )}

        <div className="FormGroup RowGroup">
          <div className="InputWrapper">
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            {errors.lastName && <span className="ErrorText">{errors.lastName}</span>}
          </div>
          <div className="InputWrapper">
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            {errors.firstName && <span className="ErrorText">{errors.firstName}</span>}
          </div>
          <div className="InputWrapper SmallInput">
            <label>Middle Initial</label>
            <input type="text" name="middleInitial" value={formData.middleInitial} onChange={handleChange} />
          </div>
        </div>

        <div className="FormGroup RowGroup">
          <div className="InputWrapper LargeInput">
            <label>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
            {errors.address && <span className="ErrorText">{errors.address}</span>}
          </div>
          <div className="InputWrapper">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handlePhoneNumberChange} maxLength="11" />
            {errors.phoneNumber && <span className="ErrorText">{errors.phoneNumber}</span>}
          </div>
        </div>

        <div className="FormGroup SlotGroup">
          <div className="InputWrapper AppointTime">
            <label>Reason for Visit</label>
            <select name="reason" value={formData.reason} onChange={handleChange}>
              <option value="">Select a Reason</option>
              <option value="Birth Certificate">Birth Certificate</option>
              <option value="Marriage Certificate">Marriage Certificate</option>
              <option value="Death Certificate">Death Certificate</option>
            </select>
            {errors.reason && <span className="ErrorText">{errors.reason}</span>}
          </div>

          <div className="InputWrapper AppointTime">
            <label className="AppointTimeSelected">Select Time</label>
            <select name="time" value={formData.time} onChange={handleChange}>
              <option value="">Select a Time Slot</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))}
            </select>
            {errors.time && <span className="ErrorText">{errors.time}</span>}
          </div>
        </div>

        <div className="FormGroup RowGroup">
          <div className="InputWrapper">
            <label>Select Date of Visit</label>
            <Calendar
              className="Calendar"
              onChange={handleDateChange}
              value={selectedDate}
              tileDisabled={({ date }) => date.getDay() === 0 || date.getDay() === 6 || date < new Date()}
            />
            {errors.date && <span className="ErrorText">{errors.date}</span>}
            {tooltip && <span className="ErrorText">Office is closed on weekends.</span>}
            {selectedDate && (
              <div className="SelectedDateInfo">
                Selected: {selectedDate.toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="ConfirmContainer">
            <button className="ConfirmButton" onClick={handleSubmit}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentContainer;