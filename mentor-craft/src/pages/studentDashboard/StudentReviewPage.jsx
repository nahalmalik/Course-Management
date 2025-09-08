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
    if (!token) return;

    const fetchEnrolledCourses = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/users/enrollments/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log('🟡 Enrollments:', data);

        // Map courses to use actual PK
const mapped = data
  .filter(item => item.course_id) 
  .map(item => ({
    id: item.course_id || item.course.id, // use real course PK
    title: item.course_title || item.course?.title || 'Unknown Course',
  }));


        setCourses(mapped);
      } catch (err) {
        console.error('❌ Failed to fetch courses:', err);
        setErrorMsg('Failed to load courses. Please try again.');
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

    fetchEnrolledCourses();
    fetchMyReviews();
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!selectedCourse) {
      setErrorMsg('❌ Please select a course.');
      return;
    }
    if (!comment.trim()) {
      setErrorMsg('❌ Please enter a comment.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setErrorMsg('❌ Rating must be between 1 and 5.');
      return;
    }

    try {
      const payload = {
         course: selectedCourse,
        rating,
        comment,
      };

      const res = await fetch('http://localhost:8000/api/student/reviews/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newReview = await res.json();
        setSubmittedReviews([newReview, ...submittedReviews]);
        setSuccessMsg('✅ Review submitted successfully!');
        setComment('');
        setSelectedCourse('');
        setRating(5);
      } else {
        const errData = await res.json();
        console.error('❌ Backend error:', errData);
        setErrorMsg(
          errData?.detail ||
            (errData?.course ? `❌ ${errData.course.join(', ')}` : 'Failed to submit review.')
        );
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      setErrorMsg('Network error occurred.');
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
            onChange={e => setSelectedCourse(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">-- Select Course --</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Rating:
          <select
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            style={styles.select}
            required
          >
            {[5, 4, 3, 2, 1].map(r => (
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
            onChange={e => setComment(e.target.value)}
            placeholder="Write your review..."
            style={styles.textarea}
            required
          />
        </label>

        <button type="submit" style={styles.button}>
          Submit Review
        </button>

        {successMsg && <p style={styles.success}>{successMsg}</p>}
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}
      </form>

      {submittedReviews.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 style={{ color: styles.title.color, marginBottom: 16 }}>Your Past Reviews</h3>
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
              {submittedReviews.map(rev => (
                <tr key={rev.id}>
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

const styles = {
  container: { maxWidth: 700, margin: '60px auto', background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', fontFamily: 'sans-serif' },
  title: { textAlign: 'center', marginBottom: 30, color: '#1E3A8A', fontSize: 26, fontWeight: 600 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  label: { fontSize: 15, color: '#1F2937', fontWeight: 500 },
  select: { marginTop: 6, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 14, width: '100%' },
  textarea: { marginTop: 6, padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: 14, resize: 'vertical', width: '100%' },
  button: { padding: '12px 20px', backgroundColor: '#3B82F6', color: '#fff', fontSize: 15, border: 'none', borderRadius: 6, cursor: 'pointer', transition: 'background 0.3s ease' },
  success: { color: '#4A90E2', textAlign: 'center', fontWeight: 'bold' },
  error: { color: '#EF4444', textAlign: 'center', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14, border: '1px solid #e0e0e0', borderRadius: 6, overflow: 'hidden', backgroundColor: '#fff' },
  th: { backgroundColor: '#1E3A8A', color: '#fff', padding: 12, textAlign: 'left', fontWeight: 600 },
  td: { padding: '10px 12px', color: '#1F2937' },
};

export default StudentReviewPage;
