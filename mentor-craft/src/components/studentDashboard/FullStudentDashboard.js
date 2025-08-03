import React from 'react';
import { getCurrentStudent } from '../../contexts/studentData';
import courseData from '../../components/courseData';
import Lottie from 'lottie-react';
import welcomeAnim from '../../assets/lottie/Fireworks.json';
import EarningsChart from '../EarningsChart';

const FullStudentDashboard = ({ user }) => {
  const student = getCurrentStudent();

  const recentCourses = (student?.enrolledCourses || [])
    .slice(0, 3)
    .map((id) => courseData.find((c) => c.id === id));

  const completedCourses = student?.completedCourses?.length || 0;
  const activeCourses = student?.activeCourses?.length || 0;
  const totalCourses = student?.totalEnrolledCourses || 0;

  return (
    <div style={{ display: 'flex', padding: 20, gap: 20 }}>
      <div style={{ flex: 3 }}>
        {/* Welcome */}
        <div style={cardWithLottie}>
          <div style={{ width: 120 }}>
            <Lottie animationData={welcomeAnim} loop />
          </div>
          <h2>Welcome {user?.name}! 🎓</h2>
        </div>

        {/* Stats */}
        <div style={statsRow}>
          <div style={cardStyle}>📚 Total Courses: <b>{totalCourses}</b></div>
          <div style={cardStyle}>🚀 Active: <b>{activeCourses}</b></div>
          <div style={cardStyle}>✅ Completed: <b>{completedCourses}</b></div>
        </div>

        {/* Chart */}
        <div style={chartCard}>
          <div style={chartHeader}>
            <h3>📈 Learning Progress</h3>
            <button style={downloadButton}>Download Data</button>
          </div>
          <EarningsChart isStudent />
        </div>

        {/* Recent Courses */}
        <h3>🎓 Recently Enrolled</h3>
        <div style={{ display: 'flex', gap: 20 }}>
          {recentCourses.map((course) => {
            if (!course) return null;
            const progress = student.courseProgress?.[course.id] || 0;
            return (
              <div key={course.id} style={{ ...cardStyle, width: 260 }}>
                <img src={course.image} alt={course.title} style={{ width: '100%', borderRadius: 8 }} />
                <h4>{course.title}</h4>
                <div style={{ margin: '10px 0' }}>
                  <div style={{ height: 8, background: '#eee', borderRadius: 5 }}>
                    <div style={{ width: `${progress}%`, height: 8, background: '#1E3A8A', borderRadius: 5 }}></div>
                  </div>
                  <small>{progress}% completed</small>
                </div>
                <button style={continueBtn}>Continue Learning</button>
              </div>
            );
          })}
        </div>

        {/* Profile */}
        <div style={{ marginTop: 40 }}>
          <h3>⚙️ Profile Settings</h3>
          <div style={cardStyle}>
            <p><strong>Name:</strong> {student?.name}</p>
            <p><strong>Email:</strong> {student?.email}</p>
            <p><strong>Notifications:</strong> {student?.settings?.notifications ? 'On' : 'Off'}</p>
            <p><strong>Dark Mode:</strong> {student?.settings?.darkMode ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ flex: 1 }}>
        <h3>🔔 Notifications</h3>
        <div style={cardStyle}>
          <ul>
            <li>You earned "Fast Learner" badge!</li>
            <li>Assignment graded in React Basics</li>
            <li>🎉 Quiz passed with 85%</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// === Internal Styles ===
const cardWithLottie = {
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  background: '#fff',
  padding: 20,
  borderRadius: 10,
  boxShadow: '0 1px 6px rgba(0,0,0,0.1)'
};

const statsRow = {
  display: 'flex',
  gap: 20,
  margin: '20px 0'
};

const cardStyle = {
  background: '#fff',
  padding: 20,
  borderRadius: 10,
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  flex: 1
};

const chartCard = {
  background: '#fff',
  padding: 20,
  borderRadius: 10,
  boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
  marginBottom: 30
};

const chartHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const continueBtn = {
  marginTop: 10,
  width: '100%',
  padding: 10,
  border: 'none',
  background: '#1E3A8A',
  color: '#fff',
  borderRadius: 6,
  cursor: 'pointer'
};

const downloadButton = {
  padding: '6px 12px',
  border: '1px solid #1E3A8A',
  background: '#fff',
  color: '#1E3A8A',
  borderRadius: 6,
  cursor: 'pointer'
};

export default FullStudentDashboard;
