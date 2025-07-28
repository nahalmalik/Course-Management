import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCompletion = ({ percent = 40, onCompleteProfile }) => {
  const navigate = useNavigate();
  const safePercent = Math.min(100, Math.max(0, percent));

  const containerStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '30px'
  };

  const barContainer = {
    height: '10px',
    background: '#eee',
    borderRadius: '6px',
    overflow: 'hidden',
    marginTop: '10px'
  };

  const barFill = {
    height: '100%',
    background: 'rgb(32,125,140)',
    width: `${safePercent}%`,
    transition: 'width 0.3s ease'
  };

  const labelStyle = {
    marginTop: 8,
    fontSize: 14,
    color: '#555'
  };

  const buttonStyle = {
    marginTop: 15,
    padding: '10px 20px',
    backgroundColor: 'rgb(32,125,140)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
  };

  const handleClick = () => {
    if (onCompleteProfile) {
      onCompleteProfile(); // external action
    } else {
      navigate('/instructor/settings');
    }
  };

  return (
    <div style={containerStyle}>
      <h3>👤 Profile Completion</h3>
      <div style={barContainer}>
        <div style={barFill}></div>
      </div>
      <p style={labelStyle}>{safePercent}% completed</p>
      <button style={buttonStyle} onClick={handleClick}>
        ✏️ Complete Profile
      </button>
    </div>
  );
};

export default ProfileCompletion;
