import React, { useEffect, useState } from 'react';
import { getCurrentUser, logoutUser } from '../contexts/authUtils';
import { useNavigate } from 'react-router-dom';
import courseData from '../components/courseData';
import EarningsChart from '../components/EarningsChart';
import '../styles/InstructorEarnings.css';

const InstructorEarnings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [viewType, setViewType] = useState('grid');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.userType === 'instructor') {
      setUser(currentUser);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const myCourses = courseData.filter(course => course.instructor === 'John Doe').slice(0, 4);

  const stats = [
    { label: 'Total Earnings', value: '$3,540', icon: '💰' },
    { label: 'Total Enrollments', value: '1,270', icon: '📚' },
    { label: 'Students', value: '980', icon: '👨‍🎓' },
    { label: 'Reviews', value: '120', icon: '⭐' },
  ];

  const transactions = [
    { id: 1, date: '2025-07-10', amount: '$220', status: 'Completed' },
    { id: 2, date: '2025-07-05', amount: '$180', status: 'Completed' },
    { id: 3, date: '2025-06-28', amount: '$240', status: 'Completed' },
  ];

  return (
    <div className="instructor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Instructor Dashboard</h1>
        <div className="header-right">
          <button onClick={() => navigate('/create-course')} className="create-course-btn">+ Create Course</button>
          <div className="profile" onClick={() => setShowDropdown(!showDropdown)}>
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Profile" />
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
            <li className="active">Earnings</li>
            <li>My Courses</li>
            <li>Reviews</li>
            <li>Messages</li>
            <li>Settings</li>
          </ul>
        </aside>

        <main className="main-section">
          {/* Stats */}
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div className="stat-card" key={i}>
                <span className="stat-icon">{s.icon}</span>
                <div>
                  <h3>{s.value}</h3>
                  <p>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
<EarningsChart />
          {/* Payouts Table */}
          <div className="transactions">
            <h3>Recent Payouts</h3>
            <table className="payout-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn.id}>
                    <td>{txn.date}</td>
                    <td>{txn.amount}</td>
                    <td>{txn.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
{/* My Courses */}
<div className="my-courses">
  <div className="my-courses-header">
    <h3>My Courses</h3>
    <div className="view-toggle">
      <button className={viewType === 'grid' ? 'active' : ''} onClick={() => setViewType('grid')}>🔳 Grid</button>
      <button className={viewType === 'list' ? 'active' : ''} onClick={() => setViewType('list')}>📄 List</button>
    </div>
  </div>

  {viewType === 'grid' ? (
    <div className="courses-grid">
      {myCourses.map((course) => (
        <div
          key={course.id}
          className="course-card"
          onClick={() => navigate(`/instructor/courses/${course.id}`)}
        >
          <img src={course.image} alt={course.title} />
          <h4>{course.title}</h4>
          <p>{course.duration} · {course.lessons} lessons</p>
          <p><strong>{course.price}</strong></p>
        </div>
      ))}
    </div>
  ) : (
    <div className="courses-list">
      {myCourses.map((course) => (
        <div
          key={course.id}
          className="course-list-item"
          onClick={() => navigate(`/instructor/courses/${course.id}`)}
        >
          <img src={course.image} alt={course.title} />
          <div className="course-info">
            <h4>{course.title}</h4>
            <p>{course.duration} · {course.lessons} lessons</p>
            <p><strong>{course.price}</strong></p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

        </main>
      </div>
    </div>
  );
};

export default InstructorEarnings;
