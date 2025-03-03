const BirthCertificateApplicationData = (formData) => {
    localStorage.setItem("birthCertificateApplication", JSON.stringify(formData));
    console.log("Data saved to local storage:", formData);
};

export default BirthCertificateApplicationData;
