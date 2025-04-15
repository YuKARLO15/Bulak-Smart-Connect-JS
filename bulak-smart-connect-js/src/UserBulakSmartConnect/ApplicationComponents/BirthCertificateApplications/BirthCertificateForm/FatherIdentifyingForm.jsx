import React, { useState } from "react";
import "./FatherIdentifyingForm.css";

const FatherIdentifyingForm = ({ formData, handleChange }) => {
  const [showExtension, setShowExtension] = useState(formData?.fatherHasExtension || false);
  const [notAcknowledgedByFather, setNotAcknowledgedByFather] = useState(formData?.notAcknowledgedByFather || false);
  
  const requiredField = <span className="RequiredFieldFather">*</span>;

  const validateNumberOnly = (e) => {
    if (!/^\d*$/.test(e.target.value)) {
      return;
    }
    handleChange(e);
  };

  const handleNotAcknowledgedChange = (e) => {
    setNotAcknowledgedByFather(e.target.checked);
    handleChange({
      target: {
        name: "notAcknowledgedByFather",
        value: e.target.checked
      }
    });
  };

  return (
    <div className="BirthFormContainerFather">
      <div className="FormHeaderFather">III. FATHER IDENTIFYING INFORMATION</div>
      
      <div className="NotAcknowledgedCheckboxContainer CheckboxContainerFather">
        <input
          type="checkbox"
          id="notAcknowledgedByFather"
          checked={notAcknowledgedByFather}
          onChange={handleNotAcknowledgedChange}
          className="CheckboxInputFather"
        />
        <label htmlFor="notAcknowledgedByFather" className="CheckboxLabelFather">
          Not acknowledged by father
        </label>
      </div>

      <div className="FormContentFather">
        {/* Full Name Section */}
        <div className="FormSectionFather">
          <div className="SectionTitleFather">14. FULL NAME (Buong Pangalan) {!notAcknowledgedByFather && requiredField}</div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">
                First Name (Pangalan) {!notAcknowledgedByFather && requiredField}
              </label>
              <input
                type="text"
                name="fatherFirstName"
                value={formData?.fatherFirstName || ""}
                onChange={handleChange}
                className="FormInputFather"
                required={!notAcknowledgedByFather}
              />
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Middle Name (Gitnang Pangalan) Optional
              </label>
              <input
                type="text"
                name="fatherMiddleName"
                value={formData?.fatherMiddleName || ""}
                onChange={handleChange}
                className="FormInputFather"
              />
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">
                Last Name (Apelyido) {!notAcknowledgedByFather && requiredField}
              </label>
              <input
                type="text"
                name="fatherLastName"
                value={formData?.fatherLastName || ""}
                onChange={handleChange}
                className="FormInputFather"
                required={!notAcknowledgedByFather}
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
                15. CITIZENSHIP {!notAcknowledgedByFather && requiredField}
              </div>
              <input
                type="text"
                name="fatherCitizenship"
                value={formData?.fatherCitizenship || ""}
                onChange={handleChange}
                className="FormInputFather"
                required={!notAcknowledgedByFather}
              />
            </div>

            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                16. RELIGION/ RELIGIOUS SECT {!notAcknowledgedByFather && requiredField}
              </div>
              <input
                type="text"
                name="fatherReligion"
                value={formData?.fatherReligion || ""}
                onChange={handleChange}
                className="FormInputFather"
                required={!notAcknowledgedByFather}
              />
            </div>
          </div>
        </div>

        {/* Occupation and Age Section */}
        <div className="FormSectionFather">
          <div className="FormRowFather">
            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                17. OCCUPATION {!notAcknowledgedByFather && requiredField}
              </div>
              <input
                type="text"
                name="fatherOccupation"
                value={formData?.fatherOccupation || ""}
                onChange={handleChange}
                className="FormInputFather"
                required={!notAcknowledgedByFather}
              />
            </div>

            <div className="FormGroupFather" style={{ flex: 1 }}>
              <div className="SectionTitleHalfFather">
                18. AGE at the time of this birth: {!notAcknowledgedByFather && requiredField}
              </div>
              <input
                type="text"
                name="fatherAge"
                value={formData?.fatherAge || ""}
                onChange={validateNumberOnly}
                className="FormInputFather"
                placeholder="Enter number only"
                required={!notAcknowledgedByFather}
              />
            </div>
          </div>
        </div>

        {/* Residence Section */}
        <div className="FormSectionFather">
          <div className="SectionTitleFather">19. RESIDENCE {!notAcknowledgedByFather && requiredField}</div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">House NO., Street {!notAcknowledgedByFather && requiredField}</label>
              <input
                type="text"
                name="fatherStreet"
                value={formData?.fatherStreet || ""}
                onChange={handleChange}
                className="FormInputFather"
                required={!notAcknowledgedByFather}
              />
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">Barangay {!notAcknowledgedByFather && requiredField}</label>
              <input
                type="text"
                name="fatherBarangay"
                value={formData?.fatherBarangay || ""}
                onChange={handleChange}
                className="FormInputFather"
                required={!notAcknowledgedByFather}
              />
            </div>
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">City/Municipality {!notAcknowledgedByFather && requiredField}</label>
              <input
                type="text"
                name="fatherCity"
                value={formData?.fatherCity || ""}
                onChange={handleChange}
                className="FormInputFather"
                required={!notAcknowledgedByFather}
              />
            </div>

            <div className="FormGroupFather">
              <label className="FormLabelFather">Province {!notAcknowledgedByFather && requiredField}</label>
              <input
                type="text"
                name="fatherProvince"
                value={formData?.fatherProvince || ""}
                onChange={handleChange}
                className="FormInputFather"
                required={!notAcknowledgedByFather}
              />
            </div>
          </div>

          <div className="FormRowFather">
            <div className="FormGroupFather">
              <label className="FormLabelFather">Country {!notAcknowledgedByFather && requiredField}</label>
              <input
                type="text"
                name="fatherCountry"
                value={formData?.fatherCountry || ""}
                onChange={handleChange}
                className="FormInputFather"
                required={!notAcknowledgedByFather}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FatherIdentifyingForm;