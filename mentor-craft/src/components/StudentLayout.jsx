import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FiUser, FiBook, FiSettings, FiChevronDown,
  FiAward, FiBarChart2, FiLogOut, FiMenu,
  FiClipboard, FiStar, FiBell, FiFileText
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser, logoutUser } from '../contexts/authUtils';

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const userData = getCurrentUser();
    if (!userData || userData.role !== 'student') {
      navigate('/');
    } else {
      setUser(userData);
    }
    setLoading(false);
  }, [navigate]);

  const toggleSection = (section) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <FiMenu size={24} onClick={() => setSidebarOpen(!sidebarOpen)} style={{ cursor: 'pointer' }} />
        <div style={styles.headerRight}>
          <button style={styles.createCourseBtn} onClick={() => navigate('/courses')}>
            🎓 Browse Courses
          </button>
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowDropdown(!showDropdown)}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Profile"
              style={styles.avatar}
            />
            {showDropdown && (
              <div style={styles.dropdown}>
                <p>{user?.email}</p>
                <hr style={styles.hrLight} />
                <button onClick={() => navigate('/student/settings')} style={styles.dropdownBtn}>Settings</button>
                <hr style={styles.hrLight} />
                <button onClick={handleLogout} style={styles.dropdownBtn}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={styles.body}>
        {sidebarOpen && (
          <aside style={styles.sidebar}>
            <div style={styles.sidebarTitle}>Student Panel</div>
            <ul style={styles.menu}>
              <li style={styles.li}>
                <Link to="/student/overview" style={isActive('/student/overview') ? styles.activeLink : styles.link}>
                  <FiBarChart2 /> Overview
                </Link>
              </li>
              <hr style={styles.hr} />

              <li style={styles.li} onClick={() => toggleSection('account')}>
                <span style={styles.link}><FiUser /> Account <FiChevronDown /></span>
              </li>
              <AnimatePresence>
                {expandedSection === 'account' && (
                  <motion.ul {...motionSettings}>
                    <li style={styles.li}><Link to="/student/profile" style={isActive('/student/profile') ? styles.activeLink : styles.link}>My Profile</Link></li>
                    <hr style={styles.hrLight} />
                    <li style={styles.li}><Link to="/student/courses" style={isActive('/student/courses') ? styles.activeLink : styles.link}>My Courses</Link></li>
                    <hr style={styles.hrLight} />
                    <li style={styles.li}><Link to="/student/achievements" style={isActive('/student/achievements') ? styles.activeLink : styles.link}>Achievements</Link></li>
                    <hr style={styles.hrLight} />
                    <li style={styles.li}><Link to="/student/enrollment-history" style={isActive('/student/enrollment-history') ? styles.activeLink : styles.link}>Enrollment History</Link></li>
                    <hr style={styles.hrLight} />
                    <li style={styles.li}><Link to="/student/reviews" style={isActive('/student/reviews') ? styles.activeLink : styles.link}> My Reviews</Link></li>
                  </motion.ul>
                )}
              </AnimatePresence>
              <hr style={styles.hr} />

              <li style={styles.li} onClick={() => toggleSection('quiz')}>
                <span style={styles.link}><FiFileText /> Quizzes <FiChevronDown /></span>
              </li>
              <AnimatePresence>
                {expandedSection === 'quiz' && (
                  <motion.ul {...motionSettings}>
                    <li style={styles.li}><Link to="/student/quizzes" style={isActive('/student/quizzes') ? styles.activeLink : styles.link}>Attempt Quiz</Link></li>
                  </motion.ul>
                )}
              </AnimatePresence>
              <hr style={styles.hr} />

              <li style={styles.li} onClick={() => toggleSection('assignments')}>
                <span style={styles.link}><FiClipboard /> Assignments <FiChevronDown /></span>
              </li>
              <AnimatePresence>
                {expandedSection === 'assignments' && (
                  <motion.ul {...motionSettings}>
                    <li style={styles.li}><Link to="/student/assignment-submit" style={isActive('/student/assignment-submit') ? styles.activeLink : styles.link}>Submit Assignment</Link></li>
                  </motion.ul>
                )}
              </AnimatePresence>
              <hr style={styles.hr} />
              <li style={styles.li}><Link to="/student/discussion" style={isActive('/student/discussion') ? styles.activeLink : styles.link}><FiBell /> Discussion Forum</Link></li>
              <li style={styles.li}><Link to="/student/settings" style={isActive('/student/settings') ? styles.activeLink : styles.link}><FiSettings /> Settings</Link></li>
            </ul>
          </aside>
        )}

        <main style={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Motion animation for collapsible menu
const motionSettings = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: 0.2 }
};

// Same styles from InstructorLayout
const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh' },
  header: {
    backgroundColor: '#1E3A8A',
    color: '#fff',
    padding: '1.2rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px'
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  createCourseBtn: {
    backgroundColor: '#4EB4F6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.4rem 0.9rem',
    cursor: 'pointer'
  },
  avatar: { width: '36px', height: '36px', borderRadius: '50%' },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '110%',
    backgroundColor: '#fff',
    color: '#000',
    padding: '0.75rem',
    borderRadius: '6px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  dropdownBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.4rem 0',
    display: 'block',
    width: '100%',
    textAlign: 'left'
  },
  body: { display: 'flex', flex: 1 },
  sidebar: {
    width: '260px',
    backgroundColor: '#0A1F44',
    color: '#fff',
    padding: '1rem',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    overflowY: 'auto',
    position: 'sticky',
    top: 0,
    height: '100vh'
  },
  sidebarTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#4EB4F6'
  },
  menu: { listStyle: 'none', padding: 0, margin: 0 },
  li: {
    padding: '0.5rem 0.7rem',
    cursor: 'pointer',
    borderRadius: '5px',
    marginBottom: '2px',
    transition: '0.2s ease'
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.95rem'
  },
  activeLink: {
    backgroundColor: '#4EB4F6',
    color: '#fff',
    borderRadius: '6px',
    padding: '0.5rem 0.7rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontWeight: 'bold',
    boxShadow: 'inset 3px 0 0 #1E3A8A'
  },
  hr: {
    border: 'none',
    borderTop: '1px solid #3B82F6',
    margin: '8px 0'
  },
  hrLight: {
    border: 'none',
    borderTop: '1px solid #6B7280',
    margin: '4px 0'
  },
  main: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '2rem',
    overflowY: 'auto'
  },
  '@media only screen and (max-width: 768px)': {
    sidebar: { display: 'none' },
    menuIcon: { display: 'block' }
  }
};

export default StudentLayout;
