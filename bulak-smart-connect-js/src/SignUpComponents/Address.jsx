import React, { useState } from "react";
import "../SignUpComponents/Address.css";

const barangays = [
  "Akle",
  "Alagao",
  "Anyatam",
  "Bagong Barrio",
  "Basuit",
  "Bubulong Malaki",
  "Bubulong Munti",
  "Buhol na Mangga",
  "Bulusukan",
  "Calasag",
  "Calawitan",
  "Casalat",
  "Gabihan",
  "Garlang",
  "Lapnit",
  "Maasim",
  "Makapilapil",
  "Malipampang",
  "Mataas na Parang",
  "Matimbubong",
  "Nabaong Garlang",
  "Palapala",
  "Pasong Bangkal",
  "Pinaod",
  "Poblacion",
  "Pulong Tamo",
  "San Juan",
  "Santa Catalina Bata",
  "Santa Catalina Matanda",
  "Sapang Dayap",
  "Sapang Putik",
  "Sapang Putol",
  "Sumandig",
  "Telapatio",
  "Umpucan",
  "Upig",
];

const AddressSection = ({ formData, handleInputChange }) => {
  const [isOutOfTown, setIsOutOfTown] = useState(false);

  const handleCheckboxChange = () => {
    setIsOutOfTown(!isOutOfTown);
  };

  return (
    <div className="form-group">
      <label className="label-category">
        2. Permanent Address (Permanenteng Tirahan)
      </label>

      {/* First Set of Address Fields */}
      <div className="form-group fullname">
        <div className="textbox">
          <label className="label-in">
            Region/Rehiyon <span className="asterisk">*</span>
          </label>
          <input
            type="text"
            id="Region"
            name="region"
            placeholder="Region III/ Central Luzon"
            value={formData.region}
            onChange={handleInputChange}
            required
            disabled={isOutOfTown}
          />
        </div>

        <div className="textbox">
          <label className="label-in">
            Province/Probinsya <span className="asterisk">*</span>
          </label>
          <input
            type="text"
            id="Province"
            name="province"
            placeholder="Bulacan"
            value={formData.province}
            onChange={handleInputChange}
            required
            disabled={isOutOfTown}
          />
        </div>

        <div className="textbox">
          <label className="label-in">
            City/Siyudad <span className="asterisk">*</span>
          </label>
          <input
            type="text"
            id="City"
            name="city"
            placeholder="San Ildefonso"
            value={formData.city}
            onChange={handleInputChange}
            required
            disabled={isOutOfTown}
          />
        </div>
      </div>

      <div className="form-group address">
        <div className="textbox">
          <label className="label-in">
            Barangay <span className="asterisk">*</span>
          </label>
          <select
            id="Barangay"
            name="barangay"
            value={formData.barangay}
            onChange={handleInputChange}
            required
            disabled={isOutOfTown}
          >
            <option value="">Select Barangay</option>
            {barangays.map((barangay, index) => (
              <option key={index} value={barangay}>
                {barangay}
              </option>
            ))}
          </select>
        </div>

        <div className="textbox">
          <label className="label-in">
            Residence/Street <span className="optional">optional</span>
          </label>
          <input
            type="text"
            id="Street"
            name="residence"
            placeholder="Juan Reyes Street"
            value={formData.residence}
            onChange={handleInputChange}
            disabled={isOutOfTown}
          />
        </div>
      </div>

 
      <div className="form-group checkbox">
      
        <input
          type="checkbox"
          id="outOfTown"
          name="outOfTown"
          checked={isOutOfTown}
          onChange={handleCheckboxChange}
        />
      <label classsName="outOfTown">Are you an out-of-town registrant?</label>
      </div>

      {/* Second Set of Address Fields (Only shown if checkbox is checked) */}
      {isOutOfTown && (
        <div className="form-group out-of-town-address">
          <label className="label-category">
            New Address (for Out-of-Town Registrants)
          </label>
          <div className="textbox">
            <label className="label-in">
              Region/Rehiyon <span className="asterisk">*</span>
            </label>
            <input
              type="text"
              id="newRegion"
              name="newRegion"
              placeholder="Enter new region"
              value={formData.newRegion}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="textbox">
            <label className="label-in">
              Province/Probinsya <span className="asterisk">*</span>
            </label>
            <input
              type="text"
              id="newProvince"
              name="newProvince"
              placeholder="Enter new province"
              value={formData.newProvince}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="textbox">
            <label className="label-in">
              City/Siyudad <span className="asterisk">*</span>
            </label>
            <input
              type="text"
              id="newCity"
              name="newCity"
              placeholder="Enter new city"
              value={formData.newCity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="textbox">
            <label className="label-in">
              Barangay <span className="asterisk">*</span>
            </label>
            <input
              type="text"
              id="newBarangay"
              name="newBarangay"
              placeholder="Enter new barangay"
              value={formData.newBarangay}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="textbox">
            <label className="label-in">
              Residence/Street <span className="optional">optional</span>
            </label>
            <input
              type="text"
              id="newStreet"
              name="newResidence"
              placeholder="Enter new street"
              value={formData.newResidence}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSection;
