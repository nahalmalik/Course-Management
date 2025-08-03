import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/users/login/student/', {
        email,
        password,
      });

      const { access, refresh, user } = response.data;

      if (!user || !user.email) {
        throw new Error('Invalid user data received from server.');
      }

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('currentUser', JSON.stringify(user));

      toast.success('Welcome Student!');
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setTimeout(() => navigate('/student/overview'), 2500);

    } catch (err) {
      console.error('Login error:', err.response?.data?.detail || err.message || err);
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={containerStyle}>
      <img src={logo} alt="Mentor Craft" style={logoStyle} />
      <div style={titleStyle}>Student Login</div>
      {error && <p style={errorStyle}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          style={inputStyle}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          style={inputStyle}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={buttonStyle} type="submit">Login</button>
      </form>
      <Link to="/signup/student" style={linkStyle}>
        Don’t have an account? Signup
      </Link>
      <ToastContainer position="top-center" />
    </div>
  );
};

// 🎨 Theme Colors
const colors = {
  primary: '#1E3A8A',
  main: '#4EB4F6',
  secondary: '#3B82F6',
  background: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  accent: '#EF4444',
  darkBlue: '#0A1F44',
  lightBlue: '#4A90E2',
};

// 💅 Updated Styles
const containerStyle = {
  maxWidth: '420px',
  margin: '60px auto',
  padding: '30px 25px',
  backgroundColor: colors.background,
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  textAlign: 'center',
  color: colors.textPrimary,
};

const logoStyle = {
  width: '80px',
  marginBottom: '10px',
};

const titleStyle = {
  fontSize: '22px',
  color: colors.primary,
  marginBottom: '20px',
};

const inputStyle = {
  width: '85%',
  padding: '12px',
  margin: '10px 0',
  border: `1px solid ${colors.textSecondary}`,
  borderRadius: '6px',
  fontSize: '15px',
  color: colors.textPrimary,
};

const buttonStyle = {
  width: '85%',
  padding: '12px',
  marginTop: '10px',
  backgroundColor: colors.primary,
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  fontSize: '15px',
  cursor: 'pointer',
};

const linkStyle = {
  marginTop: '12px',
  fontSize: '14px',
  color: colors.secondary,
  textDecoration: 'none',
  display: 'block',
};

const errorStyle = {
  color: colors.accent,
  fontSize: '14px',
  marginBottom: '10px',
};

export default StudentLogin;
