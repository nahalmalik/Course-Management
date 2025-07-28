import React from 'react';

const StatsSection = () => {
  const stats = [
    { label: 'Total Earnings', value: '$3,540', icon: '💰' },
    { label: 'Enrollments', value: '1,270', icon: '📚' },
    { label: 'Students', value: '980', icon: '👨‍🎓' },
    { label: 'Reviews', value: '120', icon: '⭐' }
  ];

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const cardStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    textAlign: 'center',
    transition: '0.3s',
    cursor: 'default'
  };

  const iconStyle = {
    fontSize: '28px',
    marginBottom: '10px'
  };

  const valueStyle = {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '5px'
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#555'
  };

  return (
    <div style={gridStyle}>
      {stats.map((stat, i) => (
        <div key={i} style={cardStyle}>
          <div style={iconStyle}>{stat.icon}</div>
          <div style={valueStyle}>{stat.value}</div>
          <div style={labelStyle}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
