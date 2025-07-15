import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../contexts/authUtils';
import { getCourses } from '../contexts/courseStorage';
import courseData from '../components/courseData';
import EarningsChart from '../components/EarningsChart';
import Lottie from 'lottie-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import FireworksLottie from '../assets/lottie/Fireworks.json';

const InstructorEarnings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(40);
  const [width, height] = useWindowSize();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.userType === 'instructor') {
      setUser(currentUser);
      const staticCourses = courseData.filter(c => c.instructorEmail === currentUser.email);
      const dynamicCourses = getCourses().filter(c => c.instructorEmail === currentUser.email);
      const allCourses = [...dynamicCourses, ...staticCourses];
      setMyCourses(allCourses);

      if (dynamicCourses.length === 1 && localStorage.getItem("firstCoursePublished") !== "shown") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
        localStorage.setItem("firstCoursePublished", "shown");
      }

      setProfileCompletion(currentUser.profileCompleted ? 100 : 40);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const renderImage = (course) =>
    course.thumbnail?.startsWith('data:image')
      ? course.thumbnail
      : course.image || course.thumbnail;

  const hasCourses = myCourses.length > 0;

  const sectionStyle = {
    background: darkMode ? '#1e1e1e' : '#fff',
    color: darkMode ? '#eee' : '#333',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.06)',
    marginBottom: '30px',
    transition: '0.3s ease'
  };

  const headingStyle = {
    color: 'rgb(32,125,140)',
    marginBottom: 16
  };

  const statCard = {
    flex: 1,
    background: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: '0.3s ease'
  };

  const grid = {
    display: 'grid',
    gap: 20,
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    marginBottom: 30
  };

const css= `
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 18px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.view-more-btn:hover {
  background: rgb(42,98,113);
  transform: scale(1.05);
  transition: 0.3s ease;
}
  `;
  return (
    <div style={{ background: darkMode ? '#121212' : '#f5f7fa', minHeight: '100vh', padding: 30 }}>
      {showConfetti && <Confetti width={width} height={height} />}
{!hasCourses ? (
  <div
    className="empty-dashboard"
    style={{
      animation: 'fadeSlideUp 0.8s ease-in-out',
      textAlign: 'center',
      paddingTop: 50
    }}
  >
    <Lottie
      animationData={FireworksLottie}
      loop={false}
      style={{
        maxWidth: 300,
        margin: '0 auto',
        marginBottom: 20
      }}
    />

    <h2 style={{
      fontSize: '30px',
      color: darkMode ? '#fff' : '#1c6b72',
      fontWeight: '700',
      marginBottom: 10
    }}>
      🎉 Welcome, {user?.name || 'Instructor'}!
    </h2>

    <p style={{
      fontSize: '16px',
      color: darkMode ? '#ccc' : '#555',
      marginBottom: 20
    }}>
      Let’s launch your first course and start inspiring students!
    </p>

    <button
      onClick={() => navigate('/instructor/create-course')}
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#207d8c',
        color: 'white',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        transition: '0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      🚀 Start Creating
    </button>

  

          <div style={grid}>
            {['Earnings', 'Enrollments', 'Students'].map(label => (
              <div key={label} style={statCard}>
                <div style={{ fontSize: 28 }}>📊</div>
                <h3 style={{ margin: '10px 0 5px' }}>0</h3>
                <p>{label}</p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 30 }}>
            <h3>👤 Profile Completion</h3>
            <div style={{
              height: 10,
              background: '#ddd',
              borderRadius: 6,
              overflow: 'hidden',
              marginTop: 8
            }}>
              <div style={{
                height: '100%',
                background: 'rgb(32,125,140)',
                width: `${profileCompletion}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ fontSize: 14, marginTop: 6 }}>{profileCompletion}% completed</p>
          </div>

          <div style={{
            textAlign: 'center',
            background: 'rgb(42,98,113)',
            color: '#fff',
            padding: '20px',
            borderRadius: 10,
            marginBottom: 30
          }}>
            <p style={{ marginBottom: 10 }}>Start creating your first course and share your knowledge!</p>
            <button onClick={() => navigate('/instructor/create-course')}
              style={{
                background: 'white',
                color: 'rgb(32,125,140)',
                border: 'none',
                padding: '10px 20px',
                fontWeight: 'bold',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              ➕ Create Course
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 style={headingStyle}>Welcome back, {user?.name} 👋</h2>

          {/* Stats */}
          <div style={grid}>
            {[
              { label: 'Total Earnings', value: '$3,540', icon: '💰' },
              { label: 'Total Enrollments', value: '1,270', icon: '📚' },
              { label: 'Students', value: '980', icon: '👨‍🎓' },
              { label: 'Reviews', value: '120', icon: '⭐' }
            ].map((s, i) => (
              <div key={i} style={statCard}>
                <div style={{ fontSize: 28 }}>{s.icon}</div>
                <h3 style={{ margin: '10px 0 5px' }}>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Profile */}
          <div style={sectionStyle}>
            <h3>👤 Profile Completion</h3>
            <div style={{
              height: 10,
              background: '#ddd',
              borderRadius: 6,
              overflow: 'hidden',
              marginTop: 8
            }}>
              <div style={{
                height: '100%',
                background: 'rgb(32,125,140)',
                width: `${profileCompletion}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ fontSize: 14, marginTop: 6 }}>{profileCompletion}% completed</p>
          </div>

          {/* Chart */}
          <div style={{ ...sectionStyle, padding: 0 }}>
            <EarningsChart />
          </div>

          {/* Payouts */}
          <div style={sectionStyle}>
            <h3>Recent Payouts</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#eee' }}>
                  <th style={{ padding: 10, textAlign: 'left' }}>Date</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, date: '2025-07-10', amount: '$220', status: 'Completed' },
                  { id: 2, date: '2025-07-05', amount: '$180', status: 'Completed' },
                  { id: 3, date: '2025-06-28', amount: '$240', status: 'Completed' }
                ].map(txn => (
                  <tr key={txn.id}>
                    <td style={{ padding: 10 }}>{txn.date}</td>
                    <td style={{ padding: 10 }}>{txn.amount}</td>
                    <td style={{ padding: 10 }}>{txn.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Courses */}
          <div style={sectionStyle}>
            <h3 style={{ marginBottom: 20 }}>My Courses</h3>
            <div style={grid}>
              {myCourses.slice(0, 3).map(course => (
                <div
                  key={course.id}
                  style={{
                    background: '#fff',
                    borderRadius: 10,
                    padding: 16,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/instructor/courses/${course.id}`)}
                >
                  <img
                    src={renderImage(course)}
                    alt={course.title}
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }}
                  />
                  <h4>{course.title}</h4>
                  <p style={{ fontSize: 14 }}>{course.duration} · {course.lessons} lessons</p>
                  <p style={{ fontWeight: 'bold' }}>{course.price}</p>
                </div>
              ))}
            </div>

            {myCourses.length > 3 && (
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button
                  onClick={() => navigate('/instructor/my-courses')}
                  style={{
                    background: 'rgb(32,125,140)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    fontWeight: 'bold',
                    borderRadius: 6,
                    cursor: 'pointer'
                  }}
                >
                  👀 View All Courses
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default InstructorEarnings;
