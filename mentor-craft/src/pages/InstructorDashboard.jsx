import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../contexts/authUtils';
import { getCourses } from '../contexts/courseStorage';
import courseData from '../components/courseData';
import { useWindowSize } from '@react-hook/window-size';
import Confetti from 'react-confetti';

// Dashboard sections
import WelcomeDashboard from '../components/instructorDashboard/WelcomeDashboard';
import StatsSection from '../components/instructorDashboard/StatsSection';
import ProfileCompletion from '../components/instructorDashboard/ProfileCompletion';
import EarningsChart from '../components/EarningsChart';
import Payouts from '../components/instructorDashboard/Payouts';
import MyCourses from '../components/instructorDashboard/MyCourses';

const InstructorEarnings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(40);
  const [isStaticInstructor, setIsStaticInstructor] = useState(false);
  const [isBackendInstructor, setIsBackendInstructor] = useState(false);
  const [isNewInstructor, setIsNewInstructor] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  useEffect(() => {
    const loadData = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.role !== 'instructor') return navigate('/');

      setUser(currentUser);
      setProfileCompletion(currentUser.profileCompleted ? 100 : 40);

      try {
        const isStatic = currentUser.email.endsWith('@mentorcraft.com'); // ✅ use correct static domain
        setIsStaticInstructor(isStatic);

        let courses = [];

        if (isStatic) {
          courses = courseData.filter(course => course.instructorEmail === currentUser.email);
          setMyCourses(courses);
        } else {
          const fetched = await getCourses();
          courses = fetched.filter(course => course.instructor_email === currentUser.email);
          setMyCourses(courses);
          setIsBackendInstructor(true);
          setIsNewInstructor(courses.length === 0);

          if (courses.length === 0) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
          }
        }
      } catch (e) {
        console.error('Error loading courses:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p style={{ padding: 30 }}>Loading dashboard...</p>;

  // 🧨 Show welcome only for backend instructors with 0 courses
  const shouldShowWelcome = isBackendInstructor && isNewInstructor;

  if (shouldShowWelcome) {
    return (
      <>
        {showConfetti && <Confetti width={width} height={height} />}
        <WelcomeDashboard user={user} profileCompletion={profileCompletion} />
      </>
    );
  }

  return (
    <div style={{ background: '#f5f7fa', minHeight: '100vh', padding: 30 }}>
      <h2 style={{ color: 'rgb(32,125,140)', marginBottom: 16 }}>
        Welcome back, {user?.name} 👋
      </h2>

      {/* Pass isStaticInstructor to conditionally show fake or real data */}
      <StatsSection isStatic={isStaticInstructor} />
      <ProfileCompletion percent={profileCompletion} />
      <EarningsChart isStatic={isStaticInstructor} />
      <Payouts isStatic={isStaticInstructor} />
      <MyCourses courses={myCourses} />
    </div>
  );
};

export default InstructorEarnings;
