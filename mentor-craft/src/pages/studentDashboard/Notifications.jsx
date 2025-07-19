// src/pages/studentDashboard/Notifications.jsx
import React from 'react';
import notificationsData from '../../contexts/notificationsData';
import NotificationCard from '../../studentDashbaord/components/NotificationCard';
import './Notifications.css';

const Notifications = () => {
  return (
    <div className="notifications-container">
      <h2>📣 Notifications Center</h2>
      {notificationsData.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        notificationsData.map((item) => (
          <NotificationCard key={item.id} notification={item} />
        ))
      )}
    </div>
  );
};

export default Notifications;
