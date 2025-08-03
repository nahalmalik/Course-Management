import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAccessToken } from '../../contexts/authUtils';

const StudentAssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [fileInputs, setFileInputs] = useState({});

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get('http://localhost:8000/api/student/assignments/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = response.data.sort((a, b) => {
        const statusRank = { Graded: 0, Submitted: 1, Pending: 2 };
        return statusRank[a.status] - statusRank[b.status];
      });

      setAssignments(sorted);
    } catch (error) {
      console.error('Error fetching assignments:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, assignmentId) => {
    setFileInputs((prev) => ({ ...prev, [assignmentId]: e.target.files[0] }));
  };

  const handleSubmit = async (assignmentId) => {
    const file = fileInputs[assignmentId];
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('assignment', assignmentId);
    formData.append('submitted_file', file);

    try {
      const token = getAccessToken();
      setSubmitting(assignmentId);

      await axios.post('http://localhost:8000/api/student/submit-assignment/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Assignment submitted successfully!');
      fetchAssignments();
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      alert('Submission failed.');
    } finally {
      setSubmitting(null);
    }
  };

  const submittedAssignments = assignments.filter((a) => a.status !== 'Pending');
  const pendingAssignments = assignments.filter((a) => a.status === 'Pending');

  return (
    <div className="assignment-container">
      <h2 className="page-title">📘 My Assignments</h2>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="empty-state">
          <p>No assignments available yet.</p>
        </div>
      ) : (
        <>
          {submittedAssignments.length > 0 && (
            <div className="submitted-section">
              <h3>✅ Submitted / Graded Assignments</h3>
              {submittedAssignments.map((assignment) => (
                <div key={assignment.id} className="assignment-card fade-in">
                  <h4>{assignment.title}</h4>
                  <p>{assignment.description}</p>
                  <p><strong>Due:</strong> {assignment.due_date}</p>
                  {assignment.file_url && (
                    <p><a href={assignment.file_url} target="_blank" rel="noreferrer">📎 View Attachment</a></p>
                  )}
                  <p>Status: <span className={`status ${assignment.status.toLowerCase()}`}>{assignment.status}</span></p>
                </div>
              ))}
            </div>
          )}

          <div className="pending-section">
            <h3>📥 Pending Submissions</h3>
            {pendingAssignments.length === 0 ? (
              <div className="empty-state">
                <p>No assignments pending submission.</p>
              </div>
            ) : (
              pendingAssignments.map((assignment) => (
                <div key={assignment.id} className="assignment-card fade-in">
                  <h4>{assignment.title}</h4>
                  <p>{assignment.description}</p>
                  <p><strong>Due:</strong> {assignment.due_date}</p>
                  {assignment.file_url && (
                    <p><a href={assignment.file_url} target="_blank" rel="noreferrer">📎 View Attachment</a></p>
                  )}

                  <div className="submit-form">
                    <label className="upload-label">
                      Upload File:
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, assignment.id)}
                        className="file-input"
                      />
                    </label>

                    <button
                      onClick={() => handleSubmit(assignment.id)}
                      disabled={submitting === assignment.id}
                      className="submit-btn"
                    >
                      {submitting === assignment.id ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <style>{`
        .assignment-container {
          padding: 2rem;
          background-color: #f4f6f8;
          color: #1F2937;
          font-family: 'Segoe UI', sans-serif;
        }

        .page-title {
          font-size: 2rem;
          color: #1E3A8A;
          margin-bottom: 2rem;
          text-align: center;
        }

        h3 {
          font-size: 1.4rem;
          color: #374151;
          margin-bottom: 1rem;
          border-bottom: 2px solid #D1D5DB;
          padding-bottom: 0.5rem;
        }

        .assignment-card {
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          padding: 1.5rem;
          background-color: #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
          margin-bottom: 1.5rem;
          animation: fadeIn 0.4s ease;
        }

        .assignment-card h4 {
          color: #1E3A8A;
          margin-bottom: 0.5rem;
        }

        .status {
          font-weight: bold;
          text-transform: uppercase;
        }

        .status.pending {
          color: #EF4444;
        }

        .status.submitted {
          color: #3B82F6;
        }

        .status.graded {
          color: #10B981;
        }

        .submit-form {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .upload-label {
          font-weight: 500;
          display: flex;
          flex-direction: column;
        }

        .file-input {
          border: 1px solid #D1D5DB;
          padding: 0.4rem;
          border-radius: 6px;
          margin-top: 0.5rem;
        }

        .submit-btn {
          background-color: #2563EB;
          color: white;
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          width: fit-content;
        }

        .submit-btn:hover {
          background-color: #1D4ED8;
        }

        .empty-state, .loading-spinner {
          padding: 2rem;
          border: 2px dashed #D1D5DB;
          border-radius: 8px;
          text-align: center;
          color: #6B7280;
          background: #f9fafb;
          margin-top: 1rem;
        }

        .spinner {
          border: 4px solid #E5E7EB;
          border-top: 4px solid #3B82F6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .assignment-container {
            padding: 1rem;
          }

          .assignment-card {
            padding: 1rem;
          }

          .submit-form {
            flex-direction: column;
            align-items: stretch;
          }

          .submit-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentAssignmentPage;
