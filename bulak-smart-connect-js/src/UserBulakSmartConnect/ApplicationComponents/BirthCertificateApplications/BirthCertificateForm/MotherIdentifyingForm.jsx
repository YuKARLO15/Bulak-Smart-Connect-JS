import React, { useState } from "react";
import "./MotherIdentifyingForm.css";

const MotherInformationBirthForm = ({ formData, handleChange }) => {
  const [showExtension, setShowExtension] = useState(false);
  const requiredField = <span className="RequiredFieldMother">*</span>;

  const validateNumberOnly = (e) => {

    if (!/^\d*$/.test(e.target.value)) {
      return;
    }
    

    handleChange(e);
  };
  return (
    <div className="BirthFormContainerMother">
      <div className="FormHeaderMother">II. MOTHER IDENTIFYING INFORMATION</div>

      <div className="FormContentMother">
        {/* Maiden Name Section */}
        <div className="FormSectionMother">
          <div className="SectionTitleMother">7. MAIDEN NAME (Pangalan sa Pagkadalaga)</div>

          <div className="FormRowMother">
            <div className="FormGroupMother">
              <label className="FormLabelMother">
                First Name (Pangalan) {requiredField}
              </label>
              <input
                type="text"
                name="motherFirstName"
                value={formData?.motherFirstName || ""}
                onChange={handleChange}
                className="FormInputMother"
                required
              />
            </div>

            <div className="FormGroupMother">
              <label className="FormLabelMother">
                Middle Name (Gitnang Pangalan) Optional
              </label>
              <input
                type="text"
                name="motherMiddleName"
                value={formData?.motherMiddleName || ""}
                onChange={handleChange}
                className="FormInputMother"
                required
              />
            </div>

            <div className="FormGroupMother">
              <label className="FormLabelMother">
                Last Name (Apelyido) {requiredField}
              </label>
              <input
                type="text"
                name="motherLastName"
                value={formData?.motherLastName || ""}
                onChange={handleChange}
                className="FormInputMother"
                required
              />
            </div>
          </div>

          <div className="FormRowMother">
            <div className="CheckboxContainerMother">
              <input
                type="checkbox"
                id="extensionCheckboxMother"
                checked={showExtension}
                onChange={() => setShowExtension(!showExtension)}
                className="CheckboxInputMother"
              />
              <label htmlFor="extensionCheckboxMother" className="CheckboxLabelMother">
                Check this box if the MOTHER have extension name
              </label>
            </div>

            {showExtension && (
              <div className="ExtensionContainerMother">
                <span className="ExtensionLabelMother">Extension</span>
                <select
                  name="motherExtension"
                  value={formData?.motherExtension || ""}
                  onChange={handleChange}
                  className="SelectInputMother"
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
        <div className="FormSectionMother">
          <div className="FormRowMother">
            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                8. CITIZENSHIP
              </div>
              <input
                type="text"
                name="motherCitizenship"
                value={formData?.motherCitizenship || ""}
                onChange={handleChange}
                className="FormInputMother"
              />
            </div>

            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                9. RELIGION/ RELIGIOUS SECT
              </div>
              <input
                type="text"
                name="motherReligion"
                value={formData?.motherReligion || ""}
                onChange={handleChange}
                className="FormInputMother"
              />
            </div>
          </div>
        </div>

        {/* Children Information Section */}
        <div className="FormSectionMother">
          <div className="FormRowMother">
            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                10a. Total number of mother's children born alive:
              </div>
              <input
                type="text"
                name="motherTotalChildren"
                value={formData?.motherTotalChildren || ""}
                onChange={validateNumberOnly}
                className="FormInputMother"
                   placeholder="Enter number only"
              />
            </div>

            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                10b. No. of children still living including this birth:
              </div>
              <input
                type="text"
                name="motherLivingChildren"
                value={formData?.motherLivingChildren || ""}
                onChange={validateNumberOnly }
                className="FormInputMother"
                   placeholder="Enter number only"
              />
            </div>

            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                10c. No. of children born alive but are now dead:
              </div>
              <input
                type="text"
                name="motherDeceasedChildren"
                value={formData?.motherDeceasedChildren || ""}
                onChange={validateNumberOnly}
                className="FormInputMother"
                   placeholder="Enter number only"
              />
            </div>
          </div>
        </div>

        {/* Occupation and Age Section */}
        <div className="FormSectionMother">
          <div className="FormRowMother">
            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                11. OCCUPATION
              </div>
              <input
                type="text"
                name="motherOccupation"
                value={formData?.motherOccupation || ""}
                onChange={handleChange}
                className="FormInputMother"
              />
            </div>

            <div className="FormGroupMother" style={{ flex: 1 }}>
              <div className="SectionTitleHalfMother">
                12. AGE at the time of this birth:
              </div>
              <input
                type="text"
                name="motherAge"
                value={formData?.motherAge || ""}
                onChange={validateNumberOnly}
                className="FormInputMother"
                   placeholder="Enter number only"
              />
            </div>
          </div>
        </div>

        {/* Residence Section */}
        <div className="FormSectionMother">
          <div className="SectionTitleMother">
            13. RESIDENCE
          </div>

          <div className="FormRowMother">
            <div className="FormFullWidthGroupMother">
              <label className="FormLabelMother">
                House NO., Street
              </label>
              <input
                type="text"
                name="motherStreet"
                value={formData?.motherStreet || ""}
                onChange={handleChange}
                className="FormInputMother"
              />
            </div>
          </div>

          <div className="FormRowMother">
            <div className="FormGroupMother">
              <label className="FormLabelMother">Barangay</label>
              <input
                type="text"
                name="motherBarangay"
                value={formData?.motherBarangay || ""}
                onChange={handleChange}
                className="FormInputMother"
              />
            </div>

            <div className="FormGroupMother">
              <label className="FormLabelMother">City/Municipality</label>
              <input
                type="text"
                name="motherCity"
                value={formData?.motherCity || ""}
                onChange={handleChange}
                className="FormInputMother"
              />
            </div>
          </div>

          <div className="FormRowMother">
            <div className="FormGroupMother">
              <label className="FormLabelMother">Province</label>
              <input
                type="text"
                name="motherProvince"
                value={formData?.motherProvince || ""}
                onChange={handleChange}
                className="FormInputMother"
              />
            </div>

            <div className="FormGroupMother">
              <label className="FormLabelMother">Country</label>
              <input
                type="text"
                name="motherCountry"
                value={formData?.motherCountry || ""}
                onChange={handleChange}
                className="FormInputMother"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotherInformationBirthForm;