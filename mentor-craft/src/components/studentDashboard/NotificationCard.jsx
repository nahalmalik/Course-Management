// src/components/NotificationCard.jsx
import React from 'react';
import '../../styles/studentDashboard/NotificationCard.css';

const NotificationCard = ({ notification }) => {
  const { type, title, message, course, date } = notification;

  const badgeColor = {
    announcement: '#1E3A8A',
    quiz: '#ff9800',
    assignment: '#3f51b5',
  }[type] || '#555';

  return (
    <div className="notification-card">
      <div className="badge" style={{ backgroundColor: badgeColor }}>
        {type.toUpperCase()}
      </div>
      <div className="content">
        <h4>{title}</h4>
        <p>{message}</p>
        <small>
          📘 {course} | 📅 {date}
        </small>
      </div>
    </div>
  );
};

export default NotificationCard;
