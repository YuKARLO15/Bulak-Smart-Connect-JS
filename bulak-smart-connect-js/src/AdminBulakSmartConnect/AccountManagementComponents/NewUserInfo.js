

const getNewAccountInfo = () => {
    const storedaccounts = localStorage.getItem('addUser');
    return storedAppointments ? JSON.parse(storedAppointments) : [];
  };
  
  const saveNewAccountInfo = newAppointment => {
    const currentAppointments = getNewAccountInfo();
  
    const updatedAppointments = [newAppointment, ...currentAppointments].slice(0, 5);
  
    localStorage.setItem('recentAppointments', JSON.stringify(updatedAppointments)); 
  };
  
  export { getNewAccountInfo, saveNewAccountInfo };
  