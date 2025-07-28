import React from 'react';
import Lottie from 'lottie-react';
import FireworksLottie from '../../assets/lottie/Fireworks.json';
import { useNavigate } from 'react-router-dom';

const WelcomeDashboard = ({ user, profileCompletion }) => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', paddingTop: 50 }}>
      <Lottie animationData={FireworksLottie} loop={false} style={{ maxWidth: 300, margin: '0 auto 20px' }} />
      <h2 style={{ fontSize: 30, fontWeight: '700', marginBottom: 10, color: '#1c6b72' }}>
        🎉 Welcome, {user?.name || 'Instructor'}!
      </h2>
      <p style={{ fontSize: 16, color: '#555', marginBottom: 20 }}>
        Let’s launch your first course and start inspiring students!
      </p>
      <button
        onClick={() => navigate('/instructor/create-course')}
        style={{ padding: '12px 24px', backgroundColor: '#207d8c', color: '#fff', border: 'none', borderRadius: 6 }}
      >
        🚀 Start Creating
      </button>

      <div style={{ margin: '30px auto', maxWidth: 600 }}>
        <h3>👤 Profile Completion</h3>
        <div style={{ height: 10, background: '#ddd', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ width: `${profileCompletion}%`, height: '100%', background: 'rgb(32,125,140)' }} />
        </div>
        <p style={{ fontSize: 14, marginTop: 6 }}>{profileCompletion}% completed</p>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
