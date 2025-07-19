import React from 'react';

const BadgeCard = ({ badge }) => {
  const cardStyle = {
    textAlign: 'center',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s ease',
  };

  const iconStyle = {
    width: '60px',
    height: '60px',
    marginBottom: '0.5rem',
  };

  const titleStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: '0.5rem 0',
  };

  const descriptionStyle = {
    fontSize: '0.9rem',
    color: '#555',
  };

  return (
    <div style={cardStyle}>
      <img src={badge.icon} alt={badge.title} style={iconStyle} />
      <h5 style={titleStyle}>{badge.title}</h5>
      <p style={descriptionStyle}>{badge.description}</p>
    </div>
  );
};

export default BadgeCard;
