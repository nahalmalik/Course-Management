import React, { useEffect, useState } from 'react';
import {
  getAnnouncements,
  addAnnouncement,
  deleteAnnouncement,
  generateSampleAnnouncements
} from '../contexts/announcementUtils';

import courseData from '../components/courseData';
import { getCurrentUser } from '../contexts/authUtils';
import toast from 'react-hot-toast';

const InstructorAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState('');
  const [courseId, setCourseId] = useState('');
  const [instructorEmail, setInstructorEmail] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setInstructorEmail(user.email);
      generateSampleAnnouncements(courseData);
      const userCourses = courseData.filter(c => c.instructorEmail === user.email);
      const all = getAnnouncements();
      const my = all.filter(a => userCourses.some(c => c.id === a.courseId));
      setAnnouncements(my);
    }
  }, []);

  const handlePost = () => {
    if (!message || !courseId) {
      toast.error('Please enter message and select course');
      return;
    }

    const course = courseData.find(c => c.id === parseInt(courseId));
    const newAnnouncement = {
      id: Date.now(),
      courseId: course.id,
      courseTitle: course.title,
      instructorEmail,
      message,
      date: new Date().toISOString(),
    };

    addAnnouncement(newAnnouncement);
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    toast.success('📢 Announcement posted!');
    setMessage('');
    setCourseId('');
  };

  const handleDelete = (id) => {
    deleteAnnouncement(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    toast.success('🗑️ Deleted');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📢 Course Announcements</h2>

      <div style={styles.form}>
        <select
          style={styles.select}
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select a Course</option>
          {courseData
            .filter(c => c.instructorEmail === instructorEmail)
            .map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
        </select>

        <textarea
          style={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your announcement..."
        />

        <button style={styles.button} onClick={handlePost}>Post Announcement</button>
      </div>

      <div style={styles.list}>
        {announcements.length === 0 ? (
          <p style={styles.empty}>No announcements yet.</p>
        ) : (
          announcements.map(a => (
            <div key={a.id} style={styles.announcement}>
              <div>
                <h4 style={styles.course}>{a.courseTitle}</h4>
                <p style={styles.msg}>{a.message}</p>
                <small style={styles.date}>{new Date(a.date).toLocaleString()}</small>
              </div>
              <button style={styles.deleteBtn} onClick={() => handleDelete(a.id)}>✖</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '800px',
    margin: 'auto',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 600,
    marginBottom: '25px',
    color: '#20818f'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '40px',
    background: '#fdfdfd',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
  },
  select: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px'
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    minHeight: '100px',
    fontSize: '15px'
  },
  button: {
    background: '#20818f',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    transition: '0.3s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  announcement: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    position: 'relative'
  },
  course: {
    fontSize: '18px',
    margin: '0 0 8px 0',
    color: '#20818f'
  },
  msg: {
    fontSize: '15px',
    color: '#333',
    marginBottom: '5px'
  },
  date: {
    fontSize: '12px',
    color: '#777'
  },
  deleteBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    color: '#888',
    fontSize: '16px',
    cursor: 'pointer'
  },
  empty: {
    fontStyle: 'italic',
    color: '#888'
  }
};

export default InstructorAnnouncements;
