// src/pages/GenerateCertificate.jsx
import React from 'react';

const GenerateCertificate = () => {
  const handleRedirect = () => {
    window.open("https://app.simplecert.net/dashboard", "_blank");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎓 Generate Certificate</h2>

      <p style={styles.info}>
        Click the button below to generate and manage certificates for your courses on SimpleCert.
      </p>

      <button style={styles.button} onClick={handleRedirect}>
        🎉 Go to SimpleCert
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '60px 40px',
    maxWidth: '500px',
    margin: 'auto',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
    textAlign: 'center',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#1E3A8A',
  },
  info: {
    fontSize: '16px',
    marginBottom: '30px',
    color: '#555',
  },
  button: {
    padding: '14px 20px',
    backgroundColor: '#1E3A8A',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

export default GenerateCertificate;
