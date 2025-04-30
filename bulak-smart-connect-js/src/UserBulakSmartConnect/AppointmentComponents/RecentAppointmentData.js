const getRecentAppointments = () => {
  const storedAppointments = localStorage.getItem('recentAppointments');
  return storedAppointments ? JSON.parse(storedAppointments) : [];
};

const saveRecentAppointments = newAppointment => {
  const currentAppointments = getRecentAppointments();

  const updatedAppointments = [newAppointment, ...currentAppointments].slice(0, 5);

  localStorage.setItem('recentAppointments', JSON.stringify(updatedAppointments));
};

export { getRecentAppointments, saveRecentAppointments };
