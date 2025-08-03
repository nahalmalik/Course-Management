import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAccessToken } from '../contexts/authUtils';
import toast from 'react-hot-toast';

const InstructorQuizAttempts = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = getAccessToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const quizRes = await axios.get('http://localhost:8000/api/instructor/quizzes/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const attemptRes = await axios.get('http://localhost:8000/api/instructor/quiz-attempts/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setQuizzes(quizRes.data);
      setAttempts(attemptRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching quiz data.');
    }
    setLoading(false);
  };

  const renderAttemptsTable = (quizId) => {
    const related = attempts.filter(attempt => attempt.quiz === quizId);
    if (related.length === 0) return <p style={styles.empty}>No attempts yet.</p>;

    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Student Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Score</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {related.map(attempt => (
            <tr key={attempt.id} style={styles.row}>
              <td style={styles.td}>{attempt.student_name}</td>
              <td style={styles.td}>{attempt.student_email}</td>
              <td style={styles.td}>{attempt.score}%</td>
              <td style={styles.td}>
                {attempt.completed_at ? '✅ Submitted' : '⌛ In Progress'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 Instructor Quiz Attempts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz.id} style={styles.assignmentCard}>
            <h3 style={styles.assignmentTitle}>{quiz.title}</h3>
            <p><strong>Attempts Allowed:</strong> {quiz.attempts_allowed}</p>
            <p><strong>Time Limit:</strong> {quiz.time_limit} minutes</p>
            <div style={{ marginTop: '20px' }}>
              <h4>🧑‍🎓 Student Attempts</h4>
              {renderAttemptsTable(quiz.id)}
            </div>
          </div>
        ))
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
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '30px',
    color: '#20818f',
  },
  assignmentCard: {
    padding: '20px',
    marginBottom: '40px',
    background: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  assignmentTitle: {
    color: '#1e3a8a',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    marginTop: '10px'
  },
  row: {
    borderBottom: '1px solid #f0f0f0'
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
  empty: {
    padding: '10px',
    fontStyle: 'italic',
    color: '#666',
  }
};

export default InstructorQuizAttempts;
