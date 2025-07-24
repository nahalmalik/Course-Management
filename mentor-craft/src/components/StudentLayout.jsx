import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/studentData.js'; // <-- important line
import {
  FaUser, FaBook, FaHeart, FaStar, FaChartBar, FaTasks,
  FaCertificate, FaCog, FaQuestionCircle, FaBell
} from 'react-icons/fa';
import '../styles/studentDashboard/StudentLayout.css';

const StudentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef();
  const student = useStudent();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="student-dashboard">
      <div className="student-topbar">
        <div className="student-title">Student Panel</div>
        <div className="student-profile-section" ref={profileRef}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="profile"
            className="student-avatar"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="student-dropdown">
              <div className="student-email">{student?.email || 'Not Logged In'}</div>
              <div onClick={() => navigate('/student/settings')}>Settings</div>
              <div onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>

      <div className="student-layout-container">
        <div className="sidebar">
          <ul>
            <li><Link to="/student/overview" className={isActive('/student') ? 'active' : ''}><FaChartBar /> Overview</Link></li>
            <li><Link to="/student/profile" className={isActive('/student/profile') ? 'active' : ''}><FaUser /> My Profile</Link></li>
            <li><Link to="/student/courses" className={isActive('/student/courses') ? 'active' : ''}><FaBook /> My Courses</Link></li>
            <li><Link to="/student/wishlist" className={isActive('/student/wishlist') ? 'active' : ''}><FaHeart /> Wishlist</Link></li>
            <li><Link to="/student/reviews" className={isActive('/student/reviews') ? 'active' : ''}><FaStar /> My Reviews</Link></li>
            <li><Link to="/student/enrollment-history" className={isActive('/student/enrollments') ? 'active' : ''}><FaBell /> Enrollment History</Link></li>
            <li><Link to="/student/quizzes" className={isActive('/student/quizzes') ? 'active' : ''}><FaTasks /> Quizzes</Link></li>
            <li><Link to="/student/assignments" className={isActive('/student/assignments') ? 'active' : ''}><FaTasks /> Assignments</Link></li>
            <li><Link to="/student/achievements" className={isActive('/student/achievements') ? 'active' : ''}><FaCertificate /> Achievements</Link></li>
            <li><Link to="/student/analytics" className={isActive('/student/analytics') ? 'active' : ''}><FaChartBar /> Analytics</Link></li>
            <li><Link to="/student/forum" className={isActive('/student/forum') ? 'active' : ''}><FaQuestionCircle /> Discussion Forum</Link></li>
            <li><Link to="/student/faqs" className={isActive('/student/faqs') ? 'active' : ''}><FaQuestionCircle /> FAQs</Link></li>
            <li><Link to="/student/settings" className={isActive('/student/settings') ? 'active' : ''}><FaCog /> Settings</Link></li>
          </ul>
        </div>

        <div className="student-main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
