import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAccessToken } from '../contexts/authUtils';
import toast from 'react-hot-toast';

const InstructorAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = getAccessToken();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const assignmentRes = await axios.get('http://localhost:8000/api/instructor/assignments/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const submissionRes = await axios.get('http://localhost:8000/api/instructor/assignment-submissions/', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAssignments(assignmentRes.data);
      setSubmissions(submissionRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching data.');
    }
    setLoading(false);
  };

  const renderSubmissionTable = (assignmentId) => {
    const related = submissions.filter(sub => sub.assignment === assignmentId);
    if (related.length === 0) return <p style={styles.empty}>No submissions yet.</p>;

    return (
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Student Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>File</th>
          </tr>
        </thead>
        <tbody>
          {related.map(sub => (
            <tr key={sub.id} style={styles.row}>
              <td style={styles.td}>{sub.student_name}</td>
              <td style={styles.td}>{sub.student_email}</td>
              <td style={styles.td}>
                <a href={sub.submitted_file_url} target="_blank" rel="noreferrer" style={styles.fileLink}>
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📘 Instructor Assignments & Submissions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        assignments.map((assignment) => (
          <div key={assignment.id} style={styles.assignmentCard}>
            <h3 style={styles.assignmentTitle}>{assignment.title}</h3>
            <p>{assignment.description}</p>
            <p><strong>Due:</strong> {assignment.due_date}</p>
            <div style={{ marginTop: '20px' }}>
              <h4>🧑‍🎓 Submissions</h4>
              {renderSubmissionTable(assignment.id)}
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
    backgroundColor: '#1E3A8A',
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
  fileLink: {
    color: '#1E3A8A',
    fontSize: '14px',
    textDecoration: 'underline',
  },
  empty: {
    padding: '10px',
    fontStyle: 'italic',
    color: '#666',
  }
};

export default InstructorAssignments;
