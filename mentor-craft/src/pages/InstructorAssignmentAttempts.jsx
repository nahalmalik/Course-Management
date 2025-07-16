import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../contexts/authUtils';
import {
  getAssignmentAttempts,
  updateAssignmentGrade,
  getUnseenInstructorAssignments,
  markAssignmentsSeenByInstructor,
  generateSampleAssignmentAttemptsForAllCourses
} from '../contexts/assignmentUtils';
import toast from 'react-hot-toast';
import courseData from '../components/courseData';

const InstructorAssignments = () => {
  const [attempts, setAttempts] = useState([]);
  const [instructorEmail, setInstructorEmail] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    generateSampleAssignmentAttemptsForAllCourses(courseData);

    const user = getCurrentUser();
    if (user) {
      setInstructorEmail(user.email);
      const data = getAssignmentAttempts().filter(
        a => a.instructorEmail === user.email
      );
      setAttempts(data);

      const unseen = getUnseenInstructorAssignments(user.email);
      if (unseen.length > 0) {
        toast.success(`📩 ${unseen.length} new assignment(s) submitted!`);
        markAssignmentsSeenByInstructor(user.email);
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
    updateAssignmentGrade(id, attempt.grade);
    toast.success("Assignment graded and sent to student.");
    setAttempts(getAssignmentAttempts().filter(a => a.instructorEmail === instructorEmail));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📚 Student Assignment Submissions</h2>
      {attempts.length === 0 ? (
        <p style={styles.empty}>No assignment submissions yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Assignment</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Submission</th>
              <th style={styles.th}>Grade</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map(a => (
              <tr key={a.id} style={styles.row}>
                <td style={styles.td}>{a.studentName}</td>
                <td style={styles.td}>{a.course}</td>
                <td style={styles.td}>{a.assignmentTitle}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: a.status === 'graded' ? '#4caf50' : '#ff9800' }}>
                    {a.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button
                    style={styles.linkButton}
                    onClick={() => setSelectedSubmission(a)}
                  >
                    See Submission
                  </button>
                </td>
                <td style={styles.td}>
                  <input
                    type="text"
                    value={a.grade || ''}
                    onChange={(e) => handleGradeChange(a.id, e.target.value)}
                    placeholder="A / B / 90%..."
                    style={styles.input}
                  />
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

      {/* Modal for submission */}
      {selectedSubmission && (
        <div style={styles.modalOverlay} onClick={() => setSelectedSubmission(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: 10 }}>📄 Files Submitted by {selectedSubmission.studentName}</h3>
            <ul>
              {selectedSubmission.files?.map((file, i) => (
                <li key={i}>
                  <a href={file.url} target="_blank" rel="noreferrer" style={styles.fileLink}>
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
            <button style={styles.closeBtn} onClick={() => setSelectedSubmission(null)}>Close</button>
          </div>
        </div>
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
    textTransform: 'capitalize'
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
  linkButton: {
    background: '#eee',
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    fontSize: '13px'
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
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff',
    padding: '25px',
    borderRadius: '12px',
    width: '400px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
  },
  fileLink: {
    color: '#20818f',
    fontSize: '14px',
    textDecoration: 'underline'
  },
  closeBtn: {
    marginTop: '15px',
    padding: '8px 14px',
    background: '#20818f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default InstructorAssignments;
