import React, { useState } from "react";
import "./FatherIdentifyingForm.css";

const FatherIdentifyingForm = ({ formData, handleChange }) => {
  const [showExtension, setShowExtension] = useState(formData?.fatherHasExtension || false);
  const requiredField = <span className="RequiredFieldFather">*</span>;

  return (
    <div className="BirthFormContainerFather">
      <div className="FormHeaderFather">III. FATHER IDENTIFYING INFORMATION</div>

      <div className="FormContentFather">
        {/* Full Name Section */}
        <div className="FormSectionFather">
          <div className="SectionTitleFather">14. FULL NAME (Buong Pangalan)</div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">
                First Name (Pangalan) {requiredField}
              </label>
              <input
                type="text"
                name="fatherFirstName"
                value={formData?.fatherFirstName || ""}
                onChange={handleChange}
                className="FormInputFather"
                required
              />
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Middle Name (Gitnang Pangalan) {requiredField}
              </label>
              <input
                type="text"
                name="fatherMiddleName"
                value={formData?.fatherMiddleName || ""}
                onChange={handleChange}
                className="FormInputFather"
                required
              />
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Last Name (Apelyido) {requiredField}
              </label>
              <input
                type="text"
                name="fatherLastName"
                value={formData?.fatherLastName || ""}
                onChange={handleChange}
                className="FormInputFather"
                required
              />
            </div>
          </div>

          <div className="FormRowFather">
            <div className="CheckboxContainerFather">
              <input
                type="checkbox"
                id="fatherExtensionCheckbox"
                checked={showExtension}
                onChange={() => setShowExtension(!showExtension)}
                className="CheckboxInputFather"
              />
              <label htmlFor="fatherExtensionCheckbox" className="CheckboxLabelFather">
                Check this box if the FATHER have a extension name
              </label>
            </div>

            {showExtension && (
              <div className="ExtensionContainerFather">
                <span className="ExtensionLabelFather">Extension</span>
                <select
                  name="fatherExtension"
                  value={formData?.fatherExtension || ""}
                  onChange={handleChange}
                  className="SelectInputFather"
                >
                  <option value="">Select</option>
                  <option value="Jr.">Jr.</option>
                  <option value="Sr.">Sr.</option>
                  <option value="III">III</option>
                  <option value="IV">IV</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Citizenship and Religion Section */}
        <div className="FormSectionFather">
          <div className="FormRowFather">
            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                15. CITIZENSHIP
              </div>
              <input
                type="text"
                name="fatherCitizenship"
                value={formData?.fatherCitizenship || ""}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>

            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                16. RELIGION/ RELIGIOUS SECT
              </div>
              <input
                type="text"
                name="fatherReligion"
                value={formData?.fatherReligion || ""}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>
          </div>
        </div>

        {/* Occupation and Age Section */}
        <div className="FormSectionFather">
          <div className="FormRowFather">
            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                17. OCCUPATION
              </div>
              <input
                type="text"
                name="fatherOccupation"
                value={formData?.fatherOccupation || ""}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>

            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                18. AGE at the time of this birth:
              </div>
              <input
                type="text"
                name="fatherAge"
                value={formData?.fatherAge || ""}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>
          </div>
        </div>

        {/* Residence Section */}
        <div className="FormSectionFather">
          <div className="SectionTitleFather">19. RESIDENCE</div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">House NO., Street</label>
              <input
                type="text"
                name="fatherStreet"
                value={formData?.fatherStreet || ""}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">Barangay</label>
              <input
                type="text"
                name="fatherBarangay"
                value={formData?.fatherBarangay || ""}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">City/Municipality</label>
              <input
                type="text"
                name="fatherCity"
                value={formData?.fatherCity || ""}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">Province</label>
              <input
                type="text"
                name="fatherProvince"
                value={formData?.fatherProvince || ""}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">Country</label>
              <input
                type="text"
                name="fatherCountry"
                value={formData?.fatherCountry || ""}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FatherIdentifyingForm;