import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../contexts/authUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';

const InstructorLogin = () => {
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
      await loginUser('instructor', email, password);
      toast.success('Welcome Instructor!');
      setTimeout(() => navigate('/instructor/dashboard'), 1500);
    } catch (err) {
      toast.error('Invalid login credentials');
    }
  };

  return (
    <div style={containerStyle}>
      <img src={logo} alt="Mentor Craft" style={logoStyle} />
      <div style={titleStyle}>Instructor Login</div>
      {error && <p style={errorStyle}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input type="email" style={inputStyle} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" style={inputStyle} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button style={buttonStyle} type="submit">Login</button>
      </form>
      <Link to="/signup/instructor" style={linkStyle}>Don’t have an account? Signup</Link>
      <ToastContainer position="top-center" />
    </div>
  );
};

const containerStyle = { maxWidth: '420px', margin: '60px auto', padding: '30px 25px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', textAlign: 'center' };
const logoStyle = { width: '80px', marginBottom: '10px' };
const titleStyle = { fontSize: '22px', color: '#333', marginBottom: '20px' };
const inputStyle = { width: '85%', padding: '12px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '6px', fontSize: '15px' };
const buttonStyle = { width: '85%', padding: '12px', marginTop: '10px', backgroundColor: '#1E3A8A', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer' };
const linkStyle = { marginTop: '12px', fontSize: '14px', color: '#1E3A8A', textDecoration: 'none', display: 'block' };
const errorStyle = { color: 'red', fontSize: '14px', marginBottom: '10px' };

export default InstructorLogin;
