import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningProgressChart from './LearningProgressChart';
import { FaUserGraduate, FaBookOpen, FaCheckCircle } from 'react-icons/fa';

// Dummy notifications only
const dummyNotifications = {
  announcements: [
    { id: 1, course: 101, message: "Welcome to the React course!" }
  ],
  assignments: [
    { id: 2, course: 101, title: "Build a Todo App" }
  ],
  quizzes: [
    { id: 3, course: 102, title: "Python Basics Quiz" }
  ]
};

const FullStudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [notes, setNotes] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [profileRes, enrolledRes] = await Promise.all([
          fetch('http://localhost:8000/api/users/me/', { headers }),
          fetch('http://localhost:8000/api/users/enrollments/', { headers })
        ]);

        const userData = await profileRes.json();
        const enrolledData = await enrolledRes.json();

        setUser(userData);
        const courses = enrolledData.map(item => item.course);
        setEnrolledCourses(courses);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchContent = () => {
      const enrolledIds = enrolledCourses.map(c => c.id);
      const filter = arr => arr.filter(item => enrolledIds.includes(item.course));

      setAnnouncements(filter(dummyNotifications.announcements));
      setAssignments(filter(dummyNotifications.assignments));
      setQuizzes(filter(dummyNotifications.quizzes));
      setLectures([]);
      setNotes([]);
      setReviews([]);
    };

    if (enrolledCourses.length > 0) fetchContent();
  }, [enrolledCourses]);

  const total = enrolledCourses.length;
  const active = user?.active_courses_count || 0;
  const completed = user?.completed_courses_count || 0;
  const profileCompletion = user?.profile_completion || 0;
  const recentCourses = enrolledCourses.slice(0, 3);

  return (
    <div style={styles.wrapper}>
      <div style={styles.mainContent}>
        <div style={styles.profileBox}>
          <div>
            <h2 style={styles.title}>Welcome, {user?.name || "Student"}</h2>
            <p>{user?.email}</p>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${profileCompletion}%` }} />
            </div>
            <small>{profileCompletion}% Profile Completed</small>
          </div>
          <button onClick={() => navigate('/settings')} style={styles.editBtn}>Edit Profile</button>
        </div>

        <div style={styles.statsRow}>
          {[{ icon: <FaUserGraduate />, label: 'Total', value: total },
            { icon: <FaBookOpen />, label: 'Active', value: active },
            { icon: <FaCheckCircle />, label: 'Completed', value: completed }
          ].map((s, i) => (
            <div
              key={i}
              style={styles.statCard}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,58,138,0.2)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
            >
              <div style={styles.icon}>{s.icon}</div>
              <h4>{s.label} Courses</h4>
              <p>{s.value}</p>
            </div>
          ))}
        </div>

        <LearningProgressChart />

        <h3 style={styles.sectionTitle}>Recently Enrolled</h3>
        <div style={styles.courseGrid}>
          {recentCourses.map(course => (
            <div key={course.id} style={styles.courseCard}>
              <img src={course.image || "https://via.placeholder.com/300x180.png?text=Course+Image"} alt="" style={styles.courseImg} />
              <h4>{course.title}</h4>
              <div style={styles.progressTrack}>
                <div style={{ ...styles.progressFill, width: `0%` }} />
              </div>
              <small>0% completed</small>
              <button style={styles.continueBtn} onClick={() => navigate(`/courses/${course.id}`)}>Continue Learning</button>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.sidebar}>
        <h3 style={styles.sectionTitle}>Notification Center</h3>
        <div style={styles.notificationBox}>
          {renderSection('Announcements', announcements, navigate)}
          {renderSection('Assignments', assignments, navigate)}
          {renderSection('Quizzes', quizzes, navigate)}
          {renderSection('Lectures', lectures, navigate)}
          {renderSection('Notes', notes, navigate)}
          {renderSection('Reviews', reviews, navigate)}
        </div>
      </div>
    </div>
  );
};

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
    ) : <p style={styles.empty}>No {label.toLowerCase()} at this time.</p>}
  </>
);

const styles = {
  wrapper: { display: 'flex', gap: 24, padding: 30, background: '#f9fafb', minHeight: '100vh' },
  mainContent: { flex: 3 },
  profileBox: {
    background: '#fff', padding: 24, borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)', marginBottom: 30,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  editBtn: {
    background: '#3B82F6', color: '#fff', border: 'none',
    borderRadius: 8, padding: '10px 18px', cursor: 'pointer'
  },
  title: { fontSize: 22, fontWeight: 600, color: '#1E3A8A' },
  progressTrack: { height: 8, background: '#e5e7eb', borderRadius: 5, marginBottom: 5 },
  progressFill: { height: 8, background: '#3B82F6', borderRadius: 5 },
  statsRow: { display: 'flex', gap: 20, marginBottom: 30 },
  statCard: {
    flex: 1, background: '#fff', padding: 20, borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center',
    transition: 'box-shadow 0.3s'
  },
  icon: { fontSize: 28, color: '#1E3A8A', marginBottom: 6 },
  sectionTitle: { fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#1F2937' },
  courseGrid: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  courseCard: {
    width: 260, background: '#fff', padding: 16, borderRadius: 12,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
  },
  courseImg: { width: '100%', borderRadius: 10, marginBottom: 10 },
  continueBtn: {
    marginTop: 10, width: '100%', padding: 10, border: 'none',
    background: '#1E3A8A', color: '#fff', borderRadius: 6, cursor: 'pointer'
  },
  sidebar: { flex: 1 },
  notificationBox: {
    background: '#fff', padding: 20, borderRadius: 12,
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
  },
  notifItem: {
    cursor: 'pointer', marginBottom: 8, color: '#1E3A8A',
    textDecoration: 'none'
  },
  empty: { fontStyle: 'italic', color: '#6B7280' }
};

export default FullStudentDashboard;
