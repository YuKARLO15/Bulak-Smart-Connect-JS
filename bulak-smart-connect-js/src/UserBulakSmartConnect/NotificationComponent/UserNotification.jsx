import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { NotificationProvider } from '../../services/notificationContext.jsx';
import CustomStatusNotification from './CustomStatusNotification';
import documentApplicationService from '../../services/documentApplicationService';
import { useAuth } from '../../context/AuthContext';

const UserNotificationContent = () => {
  const [notifQueue, setNotifQueue] = useState([]);
  const [currentNotif, setCurrentNotif] = useState(null);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const prevStatusesRef = useRef({});
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const apps = await documentApplicationService.getUserApplications();
        if (apps && apps.length > 0 && user?.id) {
          const userApps = apps.filter(app => app.userId === user.id);
          const changedApps = [];
          for (const app of userApps) {
            const prevStatus = prevStatusesRef.current[app.id];

            if (
              app.status &&
              app.status.toLowerCase() !== 'pending' &&
              (prevStatus === undefined || app.status !== prevStatus)
            ) {
              changedApps.push(app);
            }
          }

          if (changedApps.length > 0) {
            setNotifQueue(prev => [...prev, ...changedApps]);
          }

          prevStatusesRef.current = Object.fromEntries(userApps.map(app => [app.id, app.status]));
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    if (!currentNotif && notifQueue.length > 0) {
      const next = notifQueue[0];
      setCurrentNotif(next);
      setShowBookAppointment(next.status?.toLowerCase() === 'ready for pickup');
      setNotifQueue(queue => queue.slice(1));
    }
  }, [notifQueue, currentNotif]);

  return (
    <>
      {currentNotif && (
        <CustomStatusNotification
          status={currentNotif.status}
          id={currentNotif.id}
          statusMessage={currentNotif.statusMessage}
          showBookAppointment={showBookAppointment}
          onBookAppointment={() => (window.location.href = '/AppointmentForm')}
          onClose={() => setCurrentNotif(null)}
        />
      )}
      <Outlet />
    </>
  );
};

const UserLayout = () => (
  <NotificationProvider>
    <UserNotificationContent />
  </NotificationProvider>
);

export default UserLayout;
