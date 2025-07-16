// src/pages/StudentQuizResults.jsx

import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../contexts/authUtils';
import {
  getGradedAttemptsByStudent,
  markQuizSeenByStudent
} from '../contexts/quizUtils';
import toast from 'react-hot-toast';

const StudentQuizResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const graded = getGradedAttemptsByStudent(user.email);
      setResults(graded);

      const unseen = graded.filter(a => !a.seenByStudent);
      if (unseen.length > 0) {
        toast.success(`📬 ${unseen.length} new graded quiz(es) received`);
        markQuizSeenByStudent(user.email);
      }
    }
  }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '26px', color: '#20818f', marginBottom: '20px' }}>📄 My Graded Quizzes</h2>
      {results.length === 0 ? (
        <p>No graded quizzes yet.</p>
      ) : (
        <table style={{ width: '100%', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr>
              <th>Course</th>
              <th>Quiz</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Graded At</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r.id}>
                <td>{r.course}</td>
                <td>{r.quizTitle}</td>
                <td>{r.score}</td>
                <td>{r.grade}</td>
                <td>{new Date(r.gradedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentQuizResults;
