import React, { useEffect, useState } from 'react';
import { getAccessToken } from '../../contexts/authUtils';

const StudentReviewPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const token = getAccessToken();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/enrollments/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log('🟡 API enrollments data:', data); // Debug raw API response
        const mapped = data
          .filter((item) => item.course_id != null && !isNaN(item.course_id)) // Filter valid course_id
          .map((item) => ({
            id: String(item.course_id), // Convert to string for select
            title: item.course_title || 'Unknown Course', // Fallback title
          }));
        console.log('🟡 Mapped courses:', mapped); // Debug mapped courses
        setCourses(mapped);
      } catch (err) {
        console.error('❌ Failed to fetch enrolled courses:', err);
        setErrorMsg('❌ Failed to load courses. Please try again.');
      }
    };

    const fetchMyReviews = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/student/reviews/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSubmittedReviews(data);
      } catch (err) {
        console.error('❌ Failed to fetch reviews:', err);
      }
    };

    if (token) {
      fetchEnrolledCourses();
      fetchMyReviews();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const courseId = parseInt(selectedCourse, 10);

    console.log('🟡 selectedCourse:', selectedCourse, 'Type:', typeof selectedCourse);
    console.log('🟡 courseId:', courseId, 'IsNaN:', isNaN(courseId));
    console.log('🟡 comment:', comment);
    console.log('🟡 rating:', rating);

    // Validation
    if (!selectedCourse || selectedCourse === '' || isNaN(courseId)) {
      setErrorMsg('❌ Please select a valid course.');
      return;
    }
    if (!comment.trim()) {
      setErrorMsg('❌ Please provide a comment.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setErrorMsg('❌ Please select a rating between 1 and 5.');
      return;
    }

    try {
      console.log('🟡 Sending payload:', { course: courseId, rating, comment });
      const res = await fetch('http://localhost:8000/api/student/reviews/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: courseId, // Send as integer
          rating,
          comment,
        }),
      });

      if (res.ok) {
        const newReview = await res.json();
        setSuccessMsg('✅ Review submitted successfully!');
        setSubmittedReviews([newReview, ...submittedReviews]);
        setComment('');
        setSelectedCourse('');
        setRating(5);
      } else {
        const errData = await res.json();
        console.error('❌ Backend error:', errData);
        setErrorMsg(
          errData?.detail || errData?.course
            ? `❌ ${errData.detail || errData.course.join(', ')}`
            : '❌ Failed to submit review. Check all fields and try again.'
        );
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      setErrorMsg('❌ Network error occurred.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Submit a Course Review</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Course:
          <select
            value={selectedCourse}
            onChange={(e) => {
              console.log('🟡 Selected course value:', e.target.value); // Debug select
              setSelectedCourse(e.target.value);
            }}
            style={styles.select}
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
 rating: 
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={styles.select}
            required
          >
            <option value={0}>-- Select Rating --</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Comment:
          <textarea
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your thoughts about the course..."
            style={styles.textarea}
            required
          ></textarea>
        </label>

        <button type="submit" style={styles.button}>
          Submit Review
        </button>

        {successMsg && <p style={styles.success}>{successMsg}</p>}
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
      </form>

      {submittedReviews.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ color: styles.title.color, marginBottom: '16px' }}>
            Your Past Reviews
          </h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Comment</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {submittedReviews.map((rev) => (
                <tr key={rev.id} style={styles.tr}>
                  <td style={styles.td}>{rev.course_title || 'N/A'}</td>
                  <td style={styles.td}>{'⭐'.repeat(rev.rating)}</td>
                  <td style={styles.td}>{rev.comment}</td>
                  <td style={styles.td}>
                    {new Date(rev.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Styles remain unchanged
const styles = {
  container: {
    maxWidth: '700px',
    margin: '60px auto',
    background: '#FFFFFF',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    fontFamily: 'sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#1E3A8A',
    fontSize: '26px',
    fontWeight: '600',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  label: {
    fontSize: '15px',
    color: '#1F2937',
    fontWeight: '500',
  },
  select: {
    marginTop: '6px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
  },
  textarea: {
    marginTop: '6px',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    resize: 'vertical',
    width: '100%',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#3B82F6',
    color: '#fff',
    fontSize: '15px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  success: {
    color: '#4A90E2',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  th: {
    backgroundColor: '#1E3A8A',
    color: '#fff',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
  },
  tr: {
    borderBottom: '1px solid #e0e0e0',
  },
  td: {
    padding: '10px 12px',
    color: '#1F2937',
  },
};

export default StudentReviewPage;