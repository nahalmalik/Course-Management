import React, { useState } from 'react';

const AuthTabs = ({ studentForm, instructorForm }) => {
  const [tab, setTab] = useState('student');

  const buttonStyle = (isActive) => ({
    flex: 1,
    padding: '10px',
    background: isActive ? '#1E3A8A' : '#E5E7EB', 
    color: isActive ? 'white' : 'black',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button onClick={() => setTab('student')} style={buttonStyle(tab === 'student')}>Student</button>
        <button onClick={() => setTab('instructor')} style={buttonStyle(tab === 'instructor')}>Instructor</button>
      </div>
      <div>{tab === 'student' ? studentForm : instructorForm}</div>
    </div>
  );
};

export default AuthTabs;
