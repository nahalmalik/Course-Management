import React, { useEffect, useState } from 'react';
import { getCurrentUser, getAccessToken } from '../../contexts/authUtils';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:8000/api/student';

const StudentDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const user = getCurrentUser();
  const token = getAccessToken();

  useEffect(() => {
    if (!user || !token) return;

    fetch('http://localhost:8000/api/student/courses/enrolled/', {
  headers: { Authorization: `Bearer ${token}` },
})
  .then(res => res.json())
  .then(setCourses)
  .catch(err => console.error('Course fetch failed:', err));

    fetch(`${API_BASE}/discussions/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setDiscussions)
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handlePost = async () => {
    if (!courseId || !title || !content) {
      toast.error('Fill all fields');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/discussions/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: courseId,
          category,
          title,
          content,
          is_urgent: isUrgent,
        }),
      });

      if (!res.ok) throw new Error('Post failed');

      const newData = await res.json();
      setDiscussions(prev => [newData, ...prev]);
      toast.success('✅ Discussion posted');
      setTitle('');
      setContent('');
      setCourseId('');
      setCategory('GENERAL');
      setIsUrgent(false);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to post');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🗣️ Student Discussion Forum</h2>

      <div style={styles.formCard}>
        <div style={styles.row}>
          <select style={styles.select} value={courseId} onChange={e => setCourseId(e.target.value)}>
            <option value="">Select Course</option>
            {courses.map(course => (
  <option key={course.id} value={course.id}>{course.title}</option>
))}
          </select>

          <select style={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
            <option value="GENERAL">General</option>
            <option value="ASSIGNMENT">Assignment</option>
            <option value="QUIZ">Quiz</option>
          </select>
        </div>

        <input
          style={styles.input}
          placeholder="Discussion Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          style={styles.textarea}
          placeholder="Write your message..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <label style={styles.checkbox}>
          <input type="checkbox" checked={isUrgent} onChange={() => setIsUrgent(!isUrgent)} />
          Mark as Urgent
        </label>

        <button style={styles.button} onClick={handlePost}>📬 Post Discussion</button>
      </div>

      <div style={styles.list}>
        <h3 style={styles.subheading}>💬 Your Discussions</h3>
        {discussions.length === 0 ? (
          <p style={styles.empty}>No discussions yet.</p>
        ) : (
          discussions.map(d => (
            <div key={d.id} style={styles.item}>
              <div style={styles.header}>
                <h4>{d.title}</h4>
                <span style={styles.tag}>{d.category}</span>
              </div>
              <p style={styles.content}>{d.content}</p>
              <small style={styles.meta}>Posted on: {new Date(d.created_at).toLocaleString()}</small>
              {d.is_urgent && <span style={styles.urgent}>⚠ Urgent</span>}
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
    fontSize: '28px',
    marginBottom: '30px',
    fontWeight: 700,
    color: '#111827',
  },
  formCard: {
    background: '#f9fafb',
    padding: '20px',
    borderRadius: '16px',
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
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '12px',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '12px',
    minHeight: '120px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '100%',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  subheading: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  item: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  tag: {
    background: '#dbeafe',
    color: '#1d4ed8',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '13px',
  },
  content: {
    fontSize: '15px',
    marginBottom: '6px',
    color: '#333',
  },
  meta: {
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
  empty: {
    fontStyle: 'italic',
    color: '#999',
  },
};

export default StudentDiscussions;
