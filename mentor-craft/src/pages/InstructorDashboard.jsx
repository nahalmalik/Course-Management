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

// Dummy notification data
const dummyNotifications = {
  announcements: [
    { id: 1, course: 101, message: "New announcement for your course!" }
  ],
  assignments: [
    { id: 2, course: 102, title: "Grade pending assignment" }
  ],
  quizzes: [
    { id: 3, course: 103, title: "Weekly quiz available" }
  ]
};

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

  // Notification state
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser || currentUser.role !== 'instructor') return navigate('/');

      setUser(currentUser);
      setProfileCompletion(currentUser.profileCompleted ? 100 : 40);

      try {
        const isStatic = currentUser.email.endsWith('@mentorcraft.com');
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

        // Filter dummy notifications for instructor's courses
        const courseIds = courses.map(c => c.id);
        const filter = arr => arr.filter(n => courseIds.includes(n.course));

        setAnnouncements(filter(dummyNotifications.announcements));
        setAssignments(filter(dummyNotifications.assignments));
        setQuizzes(filter(dummyNotifications.quizzes));
      } catch (e) {
        console.error('Error loading courses:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p style={{ padding: 30 }}>Loading dashboard...</p>;

  if (isBackendInstructor && isNewInstructor) {
    return (
      <>
        {showConfetti && <Confetti width={width} height={height} />}
        <WelcomeDashboard user={user} profileCompletion={profileCompletion} />
      </>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Main Dashboard */}
      <div style={styles.main}>
        <h2 style={{ color: 'rgb(32,125,140)', marginBottom: 16 }}>
          Welcome back, {user?.name} 👋
        </h2>

        <StatsSection isStatic={isStaticInstructor} />
        <ProfileCompletion percent={profileCompletion} />
        <EarningsChart isStatic={isStaticInstructor} />
        <Payouts isStatic={isStaticInstructor} />
        <MyCourses courses={myCourses} />
      </div>

      {/* Notification Center */}
      <div style={styles.sidebar}>
        <h3 style={styles.sectionTitle}>Notification Center</h3>
        <div style={styles.notificationBox}>
          {renderSection('Announcements', announcements, navigate)}
          {renderSection('Assignments', assignments, navigate)}
          {renderSection('Quizzes', quizzes, navigate)}
        </div>
      </div>
    </div>
  );
};

// Reusable section renderer
const renderSection = (label, arr, nav) => (
  <>
    <h4 style={{ marginTop: 15 }}>{label}</h4>
    {arr.length ? (
      <ul>
        {arr.map((it, i) => (
          <li key={i} style={styles.notifItem} onClick={() => nav(`/courses/${it.course}`)}>
            {it.title || it.message}
          </li>
        ))}
      </ul>
    ) : <p style={styles.empty}>No {label.toLowerCase()} right now.</p>}
  </>
);

// Styling (same as student dashboard)
const styles = {
  wrapper: {
    display: 'flex',
    gap: 24,
    padding: 30,
    background: '#f5f7fa',
    minHeight: '100vh'
  },
  main: {
    flex: 3
  },
  sidebar: {
    flex: 1
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 12,
    color: '#1E3A8A'
  },
  notificationBox: {
    background: '#fff',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  notifItem: {
    cursor: 'pointer',
    marginBottom: 8,
    color: '#1E3A8A',
    textDecoration: 'none'
  },
  empty: {
    fontStyle: 'italic',
    color: '#6B7280'
  }
};

export default InstructorEarnings;
