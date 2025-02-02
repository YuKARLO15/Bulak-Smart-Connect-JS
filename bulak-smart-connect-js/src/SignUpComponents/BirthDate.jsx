import React from "react";
import "../SignUpComponents/BirthDate.css";


const BirthdateSection = ({ formData, handleInputChange }) => (
  <div className="form-group">
    <label className="label-category">3. Birthdate ( Kaarawan )</label>
    <div className="form-group inline">
      <div className="form-group birthdate">
        <div className="textbox">
        <label className="label-in">Month / Buwan <span className="asterisk"> *</span></label>
          <select
            id="Month"
            name="month"
            value={formData.month}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Month</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="textbox">
        <label className="label-in">Day / Araw <span className="asterisk"> *</span></label>
          <select
            id="Day"
            name="day"
            value={formData.day}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Day</option>
            {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="textbox">
        <label className="label-in">Year / Taon <span className="asterisk"> *</span></label>
          <select
            id="Year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Year</option>
            {Array.from(
              { length: new Date().getFullYear() - 1900 + 1 },
              (_, index) => new Date().getFullYear() - index
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="textbox">
        <label className="label-in">Age <span className="asterisk"> *</span></label>
        <input
        type="text"
        id="Age"
        name="age"
        placeholder="Age"
        value={formData.age || ""}
        readOnly
      />
        </div>
      </div>
    </div>
  </div>
);

export default BirthdateSection;
