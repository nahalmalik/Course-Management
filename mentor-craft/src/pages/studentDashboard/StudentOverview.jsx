import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeStudentDashboard from '../../components/studentDashboard/WelcomeStudentDashboard.js';
import DynamicStudentDashboard from '../../components/studentDashboard/DynamicStudentDashboard';
import FullStudentDashboard from '../../components/studentDashboard/FullStudentDashboard';
import { getCurrentUser, getAccessToken } from '../../contexts/authUtils';
import API from '../../api';

const StudentOverview = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [dashboardType, setDashboardType] = useState('loading');

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser.role !== 'student') {
      return navigate('/');
    }

    setUser(currentUser);

    // 🔁 Fetch real enrolled courses from backend
    const fetchEnrolledCourses = async () => {
      try {
        const res = await API.get('users/enrollments/', {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        });

        const courses = res.data || [];

        setEnrolledCourses(courses);

        if (courses.length > 0) {
          setDashboardType('dynamic');
        } else {
          setDashboardType('welcome');
        }
      } catch (err) {
        console.error('❌ Failed to fetch enrollments:', err);
        setDashboardType('welcome');
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (!user || dashboardType === 'loading') {
    return <div style={{ padding: 30 }}>Loading student dashboard...</div>;
  }

  return (
    <div style={{ background: '#f8f9fc', padding: 20, minHeight: '100vh' }}>
      {dashboardType === 'welcome' && <WelcomeStudentDashboard user={user} />}
      {dashboardType === 'dynamic' && (
        <DynamicStudentDashboard user={user} enrolledCourses={enrolledCourses} />
      )}
      {dashboardType === 'static' && <FullStudentDashboard user={user} />}
    </div>
  );
};

export default StudentOverview;
