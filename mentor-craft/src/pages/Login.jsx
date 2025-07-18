import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthTabs from '../components/AuthTabs';
import { loginUser } from '../contexts/authUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png'; // your logo image

const Login = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({ email: '', password: '' });
  const [instructor, setInstructor] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = (userType, formData) => {
    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    loginUser(userType, email);
    toast.success(`Welcome ${userType === 'student' ? 'Student' : 'Instructor'}!`);
    setTimeout(() => navigate('/'), 1500);
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
    marginTop: '12px',
    fontSize: '14px',
    color: 'rgb(42, 98, 113)',
    textDecoration: 'none',
    display: 'block'
  };

  const forgotStyle = {
    fontSize: '13px',
    color: '#777',
    textDecoration: 'underline',
    marginTop: '5px',
    display: 'block'
  };

  const errorStyle = {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px'
  };

  const studentForm = (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin('student', student); }}>
      <input type="email" style={inputStyle} placeholder="Student Email" value={student.email} onChange={(e) => setStudent({ ...student, email: e.target.value })} />
      <input type="password" style={inputStyle} placeholder="Password" value={student.password} onChange={(e) => setStudent({ ...student, password: e.target.value })} />
      <Link to="/forgot-password" style={forgotStyle}>Forgot password?</Link>
      <button style={buttonStyle} type="submit">Login as Student</button>
    </form>
  );

  const instructorForm = (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin('instructor', instructor); }}>
      <input type="email" style={inputStyle} placeholder="Instructor Email" value={instructor.email} onChange={(e) => setInstructor({ ...instructor, email: e.target.value })} />
      <input type="password" style={inputStyle} placeholder="Password" value={instructor.password} onChange={(e) => setInstructor({ ...instructor, password: e.target.value })} />
      <Link to="/forgot-password" style={forgotStyle}>Forgot password?</Link>
      <button style={buttonStyle} type="submit">Login as Instructor</button>
    </form>
  );

  return (
    <>
      <div style={containerStyle}>
        <img src={logo} alt="Mentor Craft" style={logoStyle} />
        <div style={titleStyle}>Login to Mentor Craft</div>
        {error && <p style={errorStyle}>{error}</p>}
        <AuthTabs studentForm={studentForm} instructorForm={instructorForm} />
        <Link to="/signup" style={linkStyle}>Don’t have an account? Signup now</Link>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
};

export default Login;
