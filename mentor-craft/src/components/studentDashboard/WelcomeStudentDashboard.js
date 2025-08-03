import React from 'react';
import Lottie from 'lottie-react';
import welcomeAnim from '../../assets/lottie/Fireworks.json';
import courseData from '../../components/courseData';
import { useNavigate } from 'react-router-dom';

const WelcomeStudentDashboard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20 }}>
      <div style={cardWithLottie}>
        <div style={{ width: 120 }}>
          <Lottie animationData={welcomeAnim} loop />
        </div>
        <div>
          <h2>Welcome to MentorCraft, {user.name}! 🎉</h2>
          <p style={{ color: '#6B7280' }}>We’re excited to have you. Start exploring your learning journey now.</p>
        </div>
      </div>

      <h3 style={{ margin: '30px 0 10px' }}>🔥 Recommended Courses</h3>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {courseData.slice(0, 3).map((course) => (
          <div key={course.id} style={{ ...cardStyle, width: 250 }}>
            <img src={course.image} alt={course.title} style={{ width: '100%', borderRadius: 10 }} />
            <h4>{course.title}</h4>
            <p style={{ color: '#6B7280' }}>👨‍🏫 {course.instructor}</p>
            <button
              style={continueBtn}
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              Explore
            </button>
          </div>
        ))}
      </div>

      <button
        style={{
          marginTop: 40,
          padding: '12px 25px',
          background: '#3B82F6',
          border: 'none',
          borderRadius: 6,
          color: '#fff',
          fontSize: 16,
          cursor: 'pointer'
        }}
        onClick={() => navigate('/courses')}
      >
        Browse All Courses
      </button>
    </div>
  );
};

// Reusable Styles
const cardWithLottie = {
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  background: '#fff',
  padding: 20,
  borderRadius: 10,
  boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
  marginBottom: 30
};

const cardStyle = {
  background: '#fff',
  padding: 15,
  borderRadius: 10,
  boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
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

export default WelcomeStudentDashboard;
