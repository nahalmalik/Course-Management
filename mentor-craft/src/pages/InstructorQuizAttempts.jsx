import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../contexts/authUtils';
import {
  getQuizAttempts,
  updateQuizGrade,
  getUnseenInstructorAttempts,
  markAttemptsSeenByInstructor
} from '../contexts/quizUtils';

import toast from 'react-hot-toast';

const InstructorQuizAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [instructorEmail, setInstructorEmail] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setInstructorEmail(user.email);
      const data = getQuizAttempts().filter(a => a.instructorEmail === user.email);
      setAttempts(data);

      const unseen = getUnseenInstructorAttempts(user.email);
      if (unseen.length > 0) {
        toast.success(`🔔 ${unseen.length} new quiz attempt(s) received!`);
        markAttemptsSeenByInstructor(user.email);
      }
    }
  }, []);

  const handleGradeChange = (id, grade) => {
    const updated = attempts.map(attempt =>
      attempt.id === id ? { ...attempt, grade } : attempt
    );
    setAttempts(updated);
  };

  const handleSubmitGrade = (id) => {
    const attempt = attempts.find(a => a.id === id);
    if (!attempt || !attempt.grade) {
      toast.error("Please assign a grade before submitting.");
      return;
    }
    updateQuizGrade(id, attempt.grade);
    toast.success("Quiz graded and sent to student.");
    setAttempts(getQuizAttempts().filter(a => a.instructorEmail === instructorEmail));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Student Quiz Attempts</h2>
      {attempts.length === 0 ? (
        <p style={styles.empty}>No quiz attempts yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Quiz</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Grade</th>
              <th style={styles.th}>Submission</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map(a => (
              <tr key={a.id} style={styles.row}>
                <td style={styles.td}>{a.studentName}</td>
                <td style={styles.td}>{a.course}</td>
                <td style={styles.td}>{a.quizTitle}</td>
                <td style={styles.td}>{a.score}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: a.status === 'graded' ? '#4caf50' : '#ff9800'
                  }}>
                    {a.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <input
                    type="text"
                    value={a.grade || ''}
                    onChange={(e) => handleGradeChange(a.id, e.target.value)}
                    placeholder="A / B / 85%..."
                    style={styles.input}
                  />
                </td>
                <td style={styles.td}>
                  <a
                    href="/sample-submissions/submission-123.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    style={styles.downloadLink}
                  >
                    📄 View
                  </a>
                </td>
                <td style={styles.td}>
                  <button onClick={() => handleSubmitGrade(a.id)} style={styles.button}>
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '95%',
    margin: 'auto',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    fontSize: '30px',
    fontWeight: '600',
    marginBottom: '25px',
    color: '#20818f',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fefefe',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  row: {
    borderBottom: '1px solid #f0f0f0'
  },
  badge: {
    padding: '6px 14px',
    borderRadius: '25px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    display: 'inline-block',
    textTransform: 'capitalize',
    background: '#aaa'
  },
  input: {
    padding: '7px 12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    width: '100px',
    outline: 'none',
    fontSize: '14px',
  },
  button: {
    background: '#20818f',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
  },
  empty: {
    padding: '30px',
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic'
  },
  th: {
    backgroundColor: '#20818f',
    color: '#fff',
    padding: '12px',
    fontSize: '14px',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#333',
  },
  downloadLink: {
    backgroundColor: '#eee',
    color: '#20818f',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

export default InstructorQuizAttempts;
