import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../contexts/authUtils';
import '../styles/InstructorEarnings.css';

const InstructorLayout = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      navigate('/');
    } else if (currentUser.role !== 'instructor') {
      navigate('/');
    } else {
      setChecked(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!checked) return <div>Loading...</div>;

  return (
    <div className="instructor-dashboard">
      {/* TOP NAVBAR */}
      <header className="dashboard-header">
        <h1>Instructor Dashboard</h1>
        <div className="header-right">
          <button onClick={() => navigate('/instructor/create-course')} className="create-course-btn">
            + Create Course
          </button>
          <div className="profile" onClick={() => setShowDropdown(!showDropdown)}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Profile"
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

      {/* SIDEBAR + MAIN */}
      <div className="dashboard-content">
        <aside className="sidebar">
          <ul>
            <li><a href="/instructor/dashboard">Overview</a></li>
            <li><a href="/instructor/profile">My Profile</a></li>
            <li><a href="/instructor/my-courses">My Courses</a></li>
            <li><a href="/instructor/earning">Earnings & Analytics</a></li>
            <li><a href="/instructor/announcements">Announcements</a></li>
            <li><a href="/instructor/assignment-attempts">Assignment Attempts</a></li>
            <li><a href="/instructor/quiz-attempts">Quiz Attempts</a></li>
            <li><a href="/instructor/purchase-history">Purchase History</a></li>
            <li><a href="/instructor/reviews">Reviews</a></li>
            <li><a href="/instructor/generate-certificate">Generate Certificate</a></li>
            <li><a href="/instructor/settings">Settings</a></li>
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
