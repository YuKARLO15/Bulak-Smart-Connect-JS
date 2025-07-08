import React, { useState, useEffect } from 'react';
import logger from '../../utils/logger';
import { Outlet } from 'react-router-dom';
import { NotificationProvider } from '../../services/notificationContext.jsx';
import CustomStatusNotification from './CustomStatusNotification';
import documentApplicationService from '../../services/documentApplicationService';
import { useAuth } from '../../context/AuthContext';

const LOCAL_STORAGE_KEY = 'bulak_last_seen_statuses';
const NOTIF_DURATION = 10000;

const getLastSeenStatuses = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

const setLastSeenStatuses = (statuses) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(statuses));
};

const UserNotificationContent = () => {
  const [notifQueue, setNotifQueue] = useState([]);
  const [currentNotif, setCurrentNotif] = useState(null);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const apps = await documentApplicationService.getUserApplications();
        if (apps && apps.length > 0 && user?.id) {
          const userApps = apps.filter(app => app.userId === user.id);
          const lastSeenStatuses = getLastSeenStatuses();
          const changedApps = [];
          for (const app of userApps) {
            const lastSeen = lastSeenStatuses[app.id];
            if (
              app.status &&
              app.status.toLowerCase() !== 'pending' &&
              app.status !== lastSeen
            ) {
              changedApps.push(app);
            }
          }
          if (changedApps.length > 0) {
            setNotifQueue(prev => [...prev, ...changedApps]);
          }
        }
      } catch (error) {
        logger.error('Failed to fetch status:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    if (!currentNotif && notifQueue.length > 0) {
      const next = notifQueue[0];
      setCurrentNotif(next);
      setShowBookAppointment(next.status?.toLowerCase() === 'ready for pickup');
      setNotifQueue(queue => queue.slice(1));

      
      const lastSeenStatuses = getLastSeenStatuses();
      lastSeenStatuses[next.id] = next.status;
      setLastSeenStatuses(lastSeenStatuses);
    }
  }, [notifQueue, currentNotif]);
    useEffect(() => {
    if (currentNotif) {
      const timer = setTimeout(() => {
        setCurrentNotif(null);
      }, NOTIF_DURATION);
      return () => clearTimeout(timer);
    }
  }, [currentNotif]);

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