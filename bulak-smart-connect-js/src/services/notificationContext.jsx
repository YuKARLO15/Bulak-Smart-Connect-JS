import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notif, setNotif] = useState(null);

  const showNotification = useCallback(message => {
    setNotif(message);
    setTimeout(() => setNotif(null), 5000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notif, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
