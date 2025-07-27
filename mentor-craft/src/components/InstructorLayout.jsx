import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../contexts/authUtils';
import '../styles/InstructorEarnings.css';

const InstructorLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userData = getCurrentUser();
    console.log('👤 InstructorLayout: Current User ->', userData);

    if (!userData || userData.role !== 'instructor') {
      navigate('/');
    } else {
      setUser(userData);
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (loading) return <div>Loading Instructor Dashboard...</div>;

  return (
    <div className="instructor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Instructor Dashboard</h1>
        <div className="header-right">
          <button
            className="create-course-btn"
            onClick={() => navigate('/instructor/create-course')}
          >
            + Create Course
          </button>
          <div className="profile" onClick={() => setShowDropdown(!showDropdown)}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Instructor Profile"
            />
            {showDropdown && (
              <div className="dropdown">
                <p>{user?.email}</p>
                <button onClick={() => navigate('/instructor-settings')}>Settings</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar + Main */}
      <div className="dashboard-content">
        <aside className="sidebar">
          <ul>
            <li><Link to="/instructor/dashboard">Overview</Link></li>
            <li><Link to="/instructor/profile">My Profile</Link></li>
            <li><Link to="/instructor/mycourses">My Courses</Link></li>
            <li><Link to="/instructor/earning">Earnings & Analytics</Link></li>
            <li><Link to="/instructor/announcements">Announcements</Link></li>
            <li><Link to="/instructor/assignment-attempts">Assignment Attempts</Link></li>
            <li><Link to="/instructor/quiz-attempts">Quiz Attempts</Link></li>
            <li><Link to="/instructor/purchase-history">Purchase History</Link></li>
            <li><Link to="/instructor/reviews">Reviews</Link></li>
            <li><Link to="/instructor/generate-certificate">Generate Certificate</Link></li>
            <li><Link to="/instructor/settings">Settings</Link></li>
          </ul>
        </aside>

        <main className="main-section">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;
