import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleReset = (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Simulate API call for password reset
    toast.success('Password reset link sent to your email');
    setEmail('');
    setError('');
  };

  const containerStyle = {
    maxWidth: '420px',
    margin: '60px auto',
    padding: '30px 25px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  const logoStyle = {
    width: '80px',
    marginBottom: '10px'
  };

  const titleStyle = {
    fontSize: '22px',
    color: '#333',
    marginBottom: '20px'
  };

  const inputStyle = {
    width: '85%',
    padding: '12px',
    margin: '10px 0 5px 0',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '15px'
  };

  const buttonStyle = {
    width: '85%',
    padding: '12px',
    marginTop: '10px',
    backgroundColor: 'rgb(32, 125, 140)',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer'
  };

  const linkStyle = {
    marginTop: '15px',
    fontSize: '14px',
    color: 'rgb(42, 98, 113)',
    textDecoration: 'none',
    display: 'block'
  };

  const errorStyle = {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px'
  };

  return (
    <>
      <div style={containerStyle}>
        <img src={logo} alt="Mentor Craft" style={logoStyle} />
        <div style={titleStyle}>Reset your password</div>
        {error && <p style={errorStyle}>{error}</p>}
        <form onSubmit={handleReset}>
          <input
            type="email"
            style={inputStyle}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" style={buttonStyle}>Send Reset Link</button>
        </form>
        <Link to="/login" style={linkStyle}>Back to Login</Link>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
};

export default ForgotPassword;
