import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';

const InstructorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirm } = formData;
    if (!name || !email || !password || !confirm) return setError('Please fill all fields');
    if (password !== confirm) return setError('Passwords do not match');

    const [first_name, ...rest] = name.trim().split(' ');
    const last_name = rest.join(' ') || '';

    try {
      const res = await axios.post('http://localhost:8000/api/users/signup/instructor/', {
        name,
        email,
        password,
        confirm,
      });

      const { tokens, user } = res.data;
      localStorage.setItem('access', tokens.access);
      localStorage.setItem('refresh', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Instructor account created!');
      setTimeout(() => navigate('/login/instructor'), 1500);
    } catch (err) {
      const message = err.response?.data?.detail || 'Signup failed';
      setError(typeof message === 'string' ? message : 'Please check your input');
    }
  };

  return (
    <div style={containerStyle}>
      <img src={logo} alt="Mentor Craft" style={logoStyle} />
      <div style={titleStyle}>Instructor Signup</div>
      {error && <p style={errorStyle}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          style={inputStyle}
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          style={inputStyle}
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          style={inputStyle}
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <input
          type="password"
          style={inputStyle}
          placeholder="Confirm Password"
          value={formData.confirm}
          onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
        />
        <button style={buttonStyle} type="submit">Signup</button>
      </form>
      <Link to="/login/instructor" style={linkStyle}>Already have an account? Login</Link>
      <ToastContainer position="top-center" />
    </div>
  );
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
const logoStyle = { width: '80px', marginBottom: '10px' };
const titleStyle = { fontSize: '22px', color: '#333', marginBottom: '20px' };
const inputStyle = {
  width: '85%',
  padding: '12px',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '15px'
};
const buttonStyle = {
  width: '85%',
  padding: '12px',
  marginTop: '10px',
  backgroundColor: '#1E3A8A',
  color: 'white',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '6px',
  fontSize: '15px',
  cursor: 'pointer'
};
const linkStyle = {
  marginTop: '12px',
  fontSize: '14px',
  color: '#1E3A8A',
  textDecoration: 'none',
  display: 'block'
};
const errorStyle = { color: 'red', fontSize: '14px', marginBottom: '10px' };

export default InstructorSignup;
