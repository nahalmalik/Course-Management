import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAccessToken } from '../../contexts/authUtils'; // Adjust path as needed

const StatsSection = () => {
  const [stats, setStats] = useState({
    earnings: 0,
    enrollments: 0,
    students: 0,
    reviews: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getAccessToken();
        const headers = { Authorization: `Bearer ${token}` };

        const res = await axios.get('http://localhost:8000/api/instructor/dashboard-stats/', { headers });
        const data = res.data;

        setStats({
          earnings: data.earnings || 0,
          enrollments: data.enrollments || 0,
          students: data.students || 0,
          reviews: data.reviews || 0,
        });
      } catch (err) {
        console.error('❌ Error fetching dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  const formattedStats = [
    { label: 'Total Earnings', value: `$${stats.earnings.toLocaleString()}`, icon: '💰' },
    { label: 'Enrollments', value: stats.enrollments, icon: '📚' },
    { label: 'Students', value: stats.students, icon: '👨‍🎓' },
    { label: 'Reviews', value: stats.reviews, icon: '⭐' },
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
      {formattedStats.map((stat, i) => (
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
