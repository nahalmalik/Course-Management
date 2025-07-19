// ...all imports remain same
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentData from '../../contexts/studentData';
import courseData from '../../components/courseData';
import notificationsData from '../../contexts/notificationsData';
import NotificationCard from '../../components/studentDashboard/NotificationCard';

import '../../styles/studentDashboard/StudentOverview.css';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { FaBook, FaCheck, FaHeart, FaPlay } from 'react-icons/fa';

const StudentOverview = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isNewUser, setIsNewUser] = useState(true);
  const [activeCourses, setActiveCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [earnedCertificates, setEarnedCertificates] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.userType !== 'student') return;

    setCurrentUser(storedUser);

    const localProfile = JSON.parse(localStorage.getItem('studentProfile'));
    const foundStudent = studentData.find(s => s.email === storedUser.email);

    const source = localProfile || foundStudent;

    if (source) {
      setCurrentUser(prev => ({
        ...prev,
        profileImage: source.profileImage || '/default-profile.png',
        profileCompletion: source.profileCompletion || 40,
      }));

      const enrolled = [
        ...(JSON.parse(localStorage.getItem('enrolledCourses')) || []),
        ...(source.enrolledCourses || [])
      ];

      const uniqueEnrolled = [...new Set(enrolled)];

      setEnrolledCourses(uniqueEnrolled);
      setIsNewUser(uniqueEnrolled.length === 0);

      setActiveCourses(source.activeCourses || []);
      setCompletedCourses(source.completedCourses || []);
      setWishlistCount((source.wishlist || []).length);

      const badges = (source.badges || []);
      const certs = (source.certificates || []);
      setEarnedBadges(badges);
      setEarnedCertificates(certs);
    }
  }, []);

  const progressData = [
    { week: 'Week 1', progress: 10 },
    { week: 'Week 2', progress: 30 },
    { week: 'Week 3', progress: 50 },
    { week: 'Week 4', progress: 80 },
  ];

  const activityData = [
    { course: 'React', views: 120 },
    { course: 'JS', views: 90 },
    { course: 'Flutter', views: 75 },
    { course: 'Python', views: 140 },
  ];

  if (!currentUser) {
    return <div className="student-dashboard"><h2>Loading user...</h2></div>;
  }

  return (
    <div className="student-dashboard">
      {isNewUser ? (
        <div className="welcome-dashboard">
          <img src="/images/welcome.png" alt="Welcome" className="welcome-illustration" />
          <h2>Welcome to Mentor Craft! 🎉</h2>
          <p>We're excited to have you here. Start your journey by exploring our top-rated courses below.</p>
          <div className="featured-courses">
            {courseData.slice(0, 3).map((course) => (
              <div className="featured-course-card" key={course.id}>
                <img src={course.image} alt={course.title} className="featured-course-thumb" />
                <div className="featured-course-info">
                  <h4>{course.title}</h4>
                  <p className="featured-course-instructor">👨‍🏫 {course.instructor}</p>
                  <p className="featured-course-price">{course.price}</p>
                  <button className="buy-now-btn" onClick={() => navigate(`/courses/${course.id}`)}>
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="browse-courses-btn" onClick={() => navigate("/courses")}>
            Browse All Courses
          </button>
        </div>
      ) : (
        <div className="main-dashboard">
          <h2>Welcome back, {currentUser.name}!</h2>

          {/* Profile Summary */}
          <div className="profile-summary">
            <div className="profile-left">
              <img src={currentUser.profileImage || '/default-profile.png'} alt="Profile" className="profile-img" />
              <h3>{currentUser.name}</h3>
              <p>{currentUser.email}</p>
              <div className="progress-wrapper">
                <label>Profile Completion</label>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${currentUser.profileCompletion || 40}%` }}></div>
                </div>
                <span>{currentUser.profileCompletion || 40}%</span>
              </div>
            </div>
            <div className="profile-right">
              <button className="complete-profile-btn" onClick={() => navigate('/settings')}>
                Complete Profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="dashboard-stats">
            <div className="stat-card"><div className="stat-icon"><FaBook /></div><div className="stat-title">Total Enrolled</div><div className="stat-value">{enrolledCourses.length}</div></div>
            <div className="stat-card"><div className="stat-icon"><FaPlay /></div><div className="stat-title">Active Courses</div><div className="stat-value">{activeCourses.length}</div></div>
            <div className="stat-card"><div className="stat-icon"><FaCheck /></div><div className="stat-title">Completed</div><div className="stat-value">{completedCourses.length}</div></div>
            <div className="stat-card"><div className="stat-icon"><FaHeart /></div><div className="stat-title">Wishlist</div><div className="stat-value">{wishlistCount}</div></div>
          </div>

          {/* Notifications */}
          <div className="dashboard-section">
            <h3 className="section-title">🔔 Latest Notifications</h3>
            <div className="notification-list">
              {notificationsData.slice(0, 3).map((item) => (
                <NotificationCard key={item.id} notification={item} />
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="student-achievements-section">
            <h3 className="achievements-title">🏆 My Achievements</h3>
            {earnedBadges.length === 0 && earnedCertificates.length === 0 ? (
              <p style={{ padding: "10px", fontStyle: "italic" }}>No achievements yet.</p>
            ) : (
              <div className="achievements-grid">
                <div className="achievement-card">
                  <div className="achievement-icon">🎖</div>
                  <div className="achievement-info">
                    <h4>Badges Earned</h4>
                    <p className="achievement-count">{earnedBadges.length}</p>
                  </div>
                </div>
                <div className="achievement-card">
                  <div className="achievement-icon">📜</div>
                  <div className="achievement-info">
                    <h4>Certificates Earned</h4>
                    <p className="achievement-count">{earnedCertificates.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Charts */}
          <div className="charts-section">
            <div className="chart-box">
              <h4>Progress Over Time</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={progressData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#ccc" />
                  <Line type="monotone" dataKey="progress" stroke="#208d8c" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h4>Courses Activity</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={activityData}>
                  <XAxis dataKey="course" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid stroke="#ccc" />
                  <Bar dataKey="views" fill="#2a6271" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="enrolled-courses-section">
            <div className="active-courses-header">
              <h3 className="enrolled-courses-title">🎓 Active Courses</h3>
              <button className="view-all-courses-btn" onClick={() => navigate('/my-courses')}>
                View All
              </button>
            </div>

            <div className="enrolled-courses-grid">
              {enrolledCourses.length === 0 ? (
                <p style={{ padding: "20px", fontStyle: "italic" }}>No active courses yet.</p>
              ) : (
                enrolledCourses.map((courseId) => {
                  const course = courseData.find((c) => c.id === courseId);
                  if (!course) return null;

                  const progress = Math.floor(Math.random() * 100);
                  const isCompleted = progress === 100;

                  return (
                    <div className="course-card" key={course.id}>
                      <div className="course-status-badge">
                        {isCompleted ? "✅ Completed" : "🔥 Active"}
                      </div>
                      <img src={course.image} alt={course.title} className="course-thumb" />
                      <div className="course-info">
                        <h4>{course.title}</h4>
                        <p className="course-instructor">👨‍🏫 {course.instructor}</p>
                        <div className="course-meta">
                          <span>{course.lessons} Lessons</span>
                          <span>{course.duration}</span>
                        </div>

                        <div className="course-progress-rating">
                          <span>{progress}% Completed</span>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>

                        <button
                          className="go-to-course-btn"
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          Go to Course
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOverview;
