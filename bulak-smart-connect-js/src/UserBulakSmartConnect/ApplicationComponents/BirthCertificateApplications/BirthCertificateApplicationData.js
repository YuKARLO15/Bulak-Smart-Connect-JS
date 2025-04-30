const BirthCertificateApplicationData = formData => {
  const timestamp = Date.now().toString().slice(-6);
  const applicationId = `BA-${timestamp}`;
  localStorage.setItem('currentApplicationId', applicationId);
  localStorage.setItem('birthCertificateApplication', JSON.stringify(formData));
  const selectedOption = localStorage.getItem('selectedBirthCertificateOption');

  const existingApplications = JSON.parse(localStorage.getItem('applications')) || [];

  const applicationData = {
    id: applicationId,
    type: 'Birth Certificate',
    date: new Date().toLocaleDateString(),
    applicationType: selectedOption,
    status: 'Pending',
    message: `Birth certificate application for ${formData.firstName || ''} ${formData.lastName || ''}`,
    formData: formData,
  };

  existingApplications.unshift(applicationData);

  localStorage.setItem('applications', JSON.stringify(existingApplications));

  console.log('Data saved to local storage with ID:', applicationId);

  window.dispatchEvent(new Event('storage'));

  return applicationId;
};

export default BirthCertificateApplicationData;
