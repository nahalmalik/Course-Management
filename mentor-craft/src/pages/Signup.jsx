import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthTabs from '../components/AuthTabs';
import { loginUser } from '../contexts/authUtils';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../assets/logo.png';

const Signup = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({ name: '', email: '', password: '', confirm: '' });
  const [instructor, setInstructor] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleSignup = (userType, formData) => {
    const { name, email, password, confirm } = formData;
    if (!name || !email || !password || !confirm) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    loginUser(userType, email);
    toast.success(`Welcome ${userType === 'student' ? 'Student' : 'Instructor'}! Account created`);
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

  const errorStyle = {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px'
  };

  const studentForm = (
    <form onSubmit={(e) => { e.preventDefault(); handleSignup('student', student); }}>
      <input type="text" style={inputStyle} placeholder="Name" value={student.name} onChange={(e) => setStudent({ ...student, name: e.target.value })} />
      <input type="email" style={inputStyle} placeholder="Email" value={student.email} onChange={(e) => setStudent({ ...student, email: e.target.value })} />
      <input type="password" style={inputStyle} placeholder="Password" value={student.password} onChange={(e) => setStudent({ ...student, password: e.target.value })} />
      <input type="password" style={inputStyle} placeholder="Confirm Password" value={student.confirm} onChange={(e) => setStudent({ ...student, confirm: e.target.value })} />
      <button style={buttonStyle} type="submit">Signup as Student</button>
    </form>
  );

  const instructorForm = (
    <form onSubmit={(e) => { e.preventDefault(); handleSignup('instructor', instructor); }}>
      <input type="text" style={inputStyle} placeholder="Name" value={instructor.name} onChange={(e) => setInstructor({ ...instructor, name: e.target.value })} />
      <input type="email" style={inputStyle} placeholder="Email" value={instructor.email} onChange={(e) => setInstructor({ ...instructor, email: e.target.value })} />
      <input type="password" style={inputStyle} placeholder="Password" value={instructor.password} onChange={(e) => setInstructor({ ...instructor, password: e.target.value })} />
      <input type="password" style={inputStyle} placeholder="Confirm Password" value={instructor.confirm} onChange={(e) => setInstructor({ ...instructor, confirm: e.target.value })} />
      <button style={buttonStyle} type="submit">Signup as Instructor</button>
    </form>
  );

  return (
    <>
      <div style={containerStyle}>
        <img src={logo} alt="Mentor Craft" style={logoStyle} />
        <div style={titleStyle}>Create your Mentor Craft account</div>
        {error && <p style={errorStyle}>{error}</p>}
        <AuthTabs studentForm={studentForm} instructorForm={instructorForm} />
        <Link to="/login" style={linkStyle}>Already have an account? Login</Link>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
};

export default Signup;
