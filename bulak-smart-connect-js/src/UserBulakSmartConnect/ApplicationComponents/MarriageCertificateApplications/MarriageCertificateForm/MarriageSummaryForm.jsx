import React, { useState, useEffect } from "react";

const MarriageSummaryForm = ({ formData, handleChange }) => {
    // Format full name function
    const formatFullName = (firstName, middleName, lastName, extension) => {
        let fullName = `${firstName || ""} ${middleName || ""} ${lastName || ""}`;
        if (extension) fullName += ` ${extension}`;
        return fullName.trim();
    };

    // Format address function
    const formatAddress = (street, barangay, city, province, country) => {
        return [street, barangay, city, province, country]
            .filter(item => item)
            .join(", ");
    };

    // Format birth date
    const formatBirthDate = (month, day, year) => {
        if (!month || !day || !year) return "Not provided";
        return `${month} ${day}, ${year}`;
    };

    return (
        <div className="marriage-summary-container">
            <h2 className="marriage-summary-title">Marriage Certificate Application Summary</h2>
            <p className="summary-note">Please review all information below before submission</p>
            
            <div className="summary-section">
                <h3 className="summary-section-title">I. HUSBAND INFORMATION</h3>
                <div className="summary-content">
                    <div className="summary-row">
                        <div className="summary-label">Full Name:</div>
                        <div className="summary-value">
                            {formatFullName(
                                formData.husbandFirstName,
                                formData.husbandMiddleName,
                                formData.husbandLastName,
                                formData.husbandExtension
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Birth Date:</div>
                        <div className="summary-value">
                            {formatBirthDate(
                                formData.husbandBirthMonth,
                                formData.husbandBirthDay,
                                formData.husbandBirthYear
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Age:</div>
                        <div className="summary-value">{formData.husbandAge || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Place of Birth:</div>
                        <div className="summary-value">
                            {formatAddress(
                                "",
                                "",
                                formData.husbandBirthCity,
                                formData.husbandBirthProvince,
                                formData.husbandBirthCountry
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Sex:</div>
                        <div className="summary-value">{formData.husbandSex || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Citizenship:</div>
                        <div className="summary-value">{formData.husbandCitizenship || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Residence:</div>
                        <div className="summary-value">
                            {formatAddress(
                                formData.husbandStreet,
                                formData.husbandBarangay,
                                formData.husbandCity,
                                formData.husbandProvince,
                                formData.husbandCountry
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Religion/Religious Sect:</div>
                        <div className="summary-value">{formData.husbandReligion || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Civil Status:</div>
                        <div className="summary-value">{formData.husbandCivilStatus || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Name of Father:</div>
                        <div className="summary-value">
                            {formatFullName(
                                formData.husbandFatherFirstName,
                                formData.husbandFatherMiddleName,
                                formData.husbandFatherLastName,
                                ""
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Citizenship of Father:</div>
                        <div className="summary-value">{formData.husbandFatherCitizenship || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Mother's Maiden Name:</div>
                        <div className="summary-value">
                            {formatFullName(
                                formData.husbandMotherFirstName,
                                formData.husbandMotherMiddleName,
                                formData.husbandMotherLastName,
                                ""
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Citizenship of Mother:</div>
                        <div className="summary-value">{formData.husbandMotherCitizenship || "Not provided"}</div>
                    </div>
                </div>
                
                {/* Wali information for husband */}
                <h4 className="summary-subsection-title">Person Who Gave Consent/Advice</h4>
                <div className="summary-content">
                    <div className="summary-row">
                        <div className="summary-label">Name:</div>
                        <div className="summary-value">
                            {formatFullName(
                                formData.waliFirstName,
                                formData.waliMiddleName,
                                formData.waliLastName,
                                ""
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Relationship:</div>
                        <div className="summary-value">{formData.waliRelationship || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Residence:</div>
                        <div className="summary-value">
                            {formatAddress(
                                formData.waliStreet,
                                formData.waliBarangay,
                                formData.waliCity,
                                formData.waliProvince,
                                formData.waliCountry
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="summary-section">
                <h3 className="summary-section-title">II. WIFE INFORMATION</h3>
                <div className="summary-content">
                    <div className="summary-row">
                        <div className="summary-label">Full Name:</div>
                        <div className="summary-value">
                            {formatFullName(
                                formData.wifeFirstName,
                                formData.wifeMiddleName,
                                formData.wifeLastName,
                                formData.wifeExtension
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Birth Date:</div>
                        <div className="summary-value">
                            {formatBirthDate(
                                formData.wifeBirthMonth,
                                formData.wifeBirthDay,
                                formData.wifeBirthYear
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Age:</div>
                        <div className="summary-value">{formData.wifeAge || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Place of Birth:</div>
                        <div className="summary-value">
                            {formatAddress(
                                "",
                                "",
                                formData.wifeBirthCity,
                                formData.wifeBirthProvince,
                                formData.wifeBirthCountry
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Sex:</div>
                        <div className="summary-value">{formData.wifeSex || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Citizenship:</div>
                        <div className="summary-value">{formData.wifeCitizenship || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Residence:</div>
                        <div className="summary-value">
                            {formatAddress(
                                formData.wifeStreet,
                                formData.wifeBarangay,
                                formData.wifeCity,
                                formData.wifeProvince,
                                formData.wifeCountry
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Religion/Religious Sect:</div>
                        <div className="summary-value">{formData.wifeReligion || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Civil Status:</div>
                        <div className="summary-value">{formData.wifeCivilStatus || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Name of Father:</div>
                        <div className="summary-value">
                            {formatFullName(
                                formData.wifeFatherFirstName,
                                formData.wifeFatherMiddleName,
                                formData.wifeFatherLastName,
                                ""
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Citizenship of Father:</div>
                        <div className="summary-value">{formData.wifeFatherCitizenship || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Mother's Maiden Name:</div>
                        <div className="summary-value">
                            {formatFullName(
                                formData.wifeMotherFirstName,
                                formData.wifeMotherMiddleName,
                                formData.wifeMotherLastName,
                                ""
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Citizenship of Mother:</div>
                        <div className="summary-value">{formData.wifeMotherCitizenship || "Not provided"}</div>
                    </div>
                </div>
                
                {/* Wali information for wife */}
                <h4 className="summary-subsection-title">Person Who Gave Consent/Advice</h4>
                <div className="summary-content">
                    <div className="summary-row">
                        <div className="summary-label">Name:</div>
                        <div className="summary-value">
                            {formatFullName(
                                formData.wifewaliFirstName,
                                formData.wifewaliMiddleName,
                                formData.wifewaliLastName,
                                ""
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Relationship:</div>
                        <div className="summary-value">{formData.wifewaliRelationship || "Not provided"}</div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Residence:</div>
                        <div className="summary-value">
                            {formatAddress(
                                formData.wifewaliStreet,
                                formData.wifewaliBarangay,
                                formData.wifewaliCity,
                                formData.wifewaliProvince,
                                formData.wifewaliCountry
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Marriage ceremony details */}
            <div className="summary-section">
                <h3 className="summary-section-title">III. MARRIAGE DETAILS</h3>
                <div className="summary-content">
                    <div className="summary-row">
                        <div className="summary-label">Marriage Date:</div>
                        <div className="summary-value">
                            {formatBirthDate(
                                formData.marriageMonth,
                                formData.marriageDay,
                                formData.marriageYear
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Marriage Place:</div>
                        <div className="summary-value">
                            {formatAddress(
                                formData.marriageStreet,
                                formData.marriageBarangay,
                                formData.marriageCity,
                                formData.marriageProvince,
                                formData.marriageCountry
                            )}
                        </div>
                    </div>

                    <div className="summary-row">
                        <div className="summary-label">Type of Ceremony:</div>
                        <div className="summary-value">{formData.ceremonyType || "Not provided"}</div>
                    </div>
                </div>
            </div>
            
            {/* Witnesses section */}
            <div className="summary-section">
                <h3 className="summary-section-title">IV. WITNESSES</h3>
                <div className="summary-content">
                    {[1, 2].map((witnessNum) => (
                        <div key={witnessNum} className="witness-block">
                            <h4 className="witness-title">Witness {witnessNum}</h4>
                            <div className="summary-row">
                                <div className="summary-label">Name:</div>
                                <div className="summary-value">
                                    {formData[`witness${witnessNum}Name`] || "Not provided"}
                                </div>
                            </div>
                            <div className="summary-row">
                                <div className="summary-label">Address:</div>
                                <div className="summary-value">
                                    {formData[`witness${witnessNum}Address`] || "Not provided"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Solemnizing officer */}
            <div className="summary-section">
                <h3 className="summary-section-title">V. SOLEMNIZING OFFICER</h3>
                <div className="summary-content">
                    <div className="summary-row">
                        <div className="summary-label">Name:</div>
                        <div className="summary-value">
                            {formData.solemnizingOfficerName || "Not provided"}
                        </div>
                    </div>
                    <div className="summary-row">
                        <div className="summary-label">Position/Designation:</div>
                        <div className="summary-value">
                            {formData.solemnizingOfficerPosition || "Not provided"}
                        </div>
                    </div>
                    <div className="summary-row">
                        <div className="summary-label">Address:</div>
                        <div className="summary-value">
                            {formData.solemnizingOfficerAddress || "Not provided"}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="summary-declaration">
                <p>I/We hereby declare that all information provided above is true and correct to the best of my/our knowledge.</p>
            </div>

            <div className="summary-signatures">
                <div className="signature-block">
                    <div className="signature-line"></div>
                    <p>Signature of Husband</p>
                </div>
                <div className="signature-block">
                    <div className="signature-line"></div>
                    <p>Signature of Wife</p>
                </div>
            </div>
            
            <div className="summary-date">
                <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default MarriageSummaryForm;