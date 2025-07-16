// src/components/StudentLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const StudentLayout = () => {
  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h3 style={styles.sidebarTitle}>🎓 Student Panel</h3>
        <nav style={styles.nav}>
          <Link to="/student/dashboard" style={styles.navLink}>Dashboard</Link>
          <Link to="/student/quiz-results" style={styles.navLink}>Quiz Results</Link>
          <Link to="/student/settings" style={styles.navLink}>Settings</Link>
        </nav>
      </aside>

      {/* Main content */}
      <div style={styles.main}>
        <header style={styles.topbar}>
          <span>Welcome back, {localStorage.getItem('studentEmail')}</span>
        </header>
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f9f9f9'
  },
  sidebar: {
    width: '220px',
    background: 'rgb(32, 125, 140)',
    color: 'white',
    padding: '20px'
  },
  sidebarTitle: {
    marginBottom: '20px'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  topbar: {
    background: 'rgb(42, 98, 113)',
    color: 'white',
    padding: '15px 20px',
    fontSize: '15px'
  },
  content: {
    padding: '30px'
  }
};

export default StudentLayout;
