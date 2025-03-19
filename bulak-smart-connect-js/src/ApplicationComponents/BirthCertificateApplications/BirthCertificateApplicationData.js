const BirthCertificateApplicationData = (formData) => {
    
    const timestamp = Date.now();
    const randomString = Math.random().toString(8);
    const applicationId = `BA-${timestamp}-${randomString}`;
    localStorage.setItem("currentApplicationId", applicationId);
    localStorage.setItem("birthCertificateApplication", JSON.stringify(formData));
    
    const existingApplications = JSON.parse(localStorage.getItem("applications")) || [];
    
 
    const applicationData = {
      id: applicationId,
      type: "Birth Certificate",
      date: new Date().toLocaleDateString(),
      status: "Pending",
      message: `Birth certificate application for ${formData.firstName || ''} ${formData.lastName || ''}`,
      formData: formData
    };
    

    existingApplications.unshift(applicationData);
    

    localStorage.setItem("applications", JSON.stringify(existingApplications));
    
    console.log("Data saved to local storage with ID:", applicationId);
    

    window.dispatchEvent(new Event('storage'));
    
    return applicationId; 
  };
  
  export default BirthCertificateApplicationData;