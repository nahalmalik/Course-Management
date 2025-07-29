import React, { useEffect, useState } from 'react';
import { getCurrentUser, getAccessToken } from '../contexts/authUtils';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:8000/api/instructor';

const InstructorAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [type, setType] = useState('GENERAL');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [publishNow, setPublishNow] = useState(true);

  const user = getCurrentUser();
  const token = getAccessToken();

  useEffect(() => {
    if (!user || !token) return;

    fetch('http://localhost:8000/api/courses/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setCourses(data.filter(c => c.instructor_email === user.email));
      })
      .catch(err => console.error('Courses error:', err));

    fetch(`${API_BASE}/announcements/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setAnnouncements)
      .catch(err => console.error('Error fetching announcements', err));
  }, []);

  const handlePost = async () => {
    if (!courseId || !title || !content) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/announcements/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: courseId,
          title,
          type,
          content,
          is_urgent: isUrgent,
          publish_immediately: publishNow,
        }),
      });

      if (!res.ok) throw new Error('Post failed');

      const newData = await res.json();
      setAnnouncements(prev => [newData, ...prev]);
      toast.success('📢 Announcement Posted!');
      setTitle('');
      setContent('');
      setCourseId('');
      setType('GENERAL');
      setIsUrgent(false);
      setPublishNow(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to post announcement');
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/announcements/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast.success('🗑️ Deleted');
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📢 Instructor Announcements</h2>

      <div style={styles.formCard}>
        <div style={styles.row}>
          <select style={styles.select} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>

          <select style={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="GENERAL">General</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="QUIZ">Quiz</option>
          </select>
        </div>

        <input
          style={styles.input}
          placeholder="Announcement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          style={styles.textarea}
          placeholder="Write announcement content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div style={styles.toggleRow}>
          <label style={styles.checkbox}><input type="checkbox" checked={isUrgent} onChange={() => setIsUrgent(!isUrgent)} /> Mark as Urgent</label>
          <label style={styles.checkbox}><input type="checkbox" checked={publishNow} onChange={() => setPublishNow(!publishNow)} /> Publish Immediately</label>
        </div>

        <button style={styles.button} onClick={handlePost}>🚀 Post Announcement</button>
      </div>

      <div style={styles.announcementList}>
        <h3 style={styles.subheading}>🗂️ All Announcements</h3>
        {announcements.length === 0 ? (
          <p style={styles.empty}>No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div key={a.id} style={styles.announcement}>
              <div style={styles.announcementHeader}>
                <h4>{a.title}</h4>
                <span style={styles.tag}>{a.type}</span>
              </div>
              <p style={styles.content}>{a.content}</p>
              <small style={styles.date}>{new Date(a.created_at).toLocaleString()}</small>
              {a.is_urgent && <span style={styles.urgent}>⚠ Urgent</span>}
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
    padding: '40px 20px',
    maxWidth: '960px',
    margin: '0 auto',
    fontFamily: 'Inter, sans-serif',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '30px',
    color: '#1e40af',
  },
  formCard: {
    background: '#f9fafb',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    marginBottom: '40px',
  },
  row: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  select: {
    flex: 1,
    padding: '12px',
    fontSize: '15px',
    borderRadius: '10px',
    border: '1px solid #ccc',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    marginBottom: '16px',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    fontSize: '15px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    marginBottom: '16px',
    minHeight: '120px',
  },
  toggleRow: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#333',
  },
  button: {
    background: '#1e40af',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%',
  },
  announcementList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  subheading: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1e3a8a',
  },
  announcement: {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    position: 'relative',
  },
  announcementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  tag: {
    background: '#e0f2fe',
    color: '#0369a1',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '500',
  },
  content: {
    fontSize: '15px',
    marginBottom: '6px',
    color: '#333',
  },
  date: {
    fontSize: '12px',
    color: '#888',
  },
  urgent: {
    display: 'inline-block',
    marginTop: '6px',
    fontSize: '13px',
    color: '#dc2626',
    fontWeight: 'bold',
  },
  deleteBtn: {
    position: 'absolute',
    top: '14px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#999',
    fontSize: '18px',
    cursor: 'pointer',
  },
  empty: {
    fontStyle: 'italic',
    color: '#999',
  },
};

export default InstructorAnnouncements;
