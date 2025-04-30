// src/services/ApplicationDataService.js

/**
 * Service for retrieving and managing application data
 */
export const getApplications = () => {
  try {
    const storedApplications = JSON.parse(localStorage.getItem('applications')) || [];
    return storedApplications;
  } catch (err) {
    console.error('Error loading applications:', err.message);
    return [];
  }
};

export const updateApplication = (applicationId, updatedData) => {
  try {
    const applications = getApplications();
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, ...updatedData } : app
    );
    localStorage.setItem('applications', JSON.stringify(updatedApplications));
    return true;
  } catch (err) {
    console.error('Error updating application:', err.message);
    return false;
  }
};

export const addApplication = applicationData => {
  try {
    const applications = getApplications();
    applications.push(applicationData);
    localStorage.setItem('applications', JSON.stringify(applications));
    return true;
  } catch (err) {
    console.error('Error adding application:', err.message);
    return false;
  }
};
