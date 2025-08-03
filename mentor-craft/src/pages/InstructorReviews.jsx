import React, { useEffect, useState } from 'react';
import { getAccessToken } from '../contexts/authUtils';
import NoReview from '../assets/no-review.png';
import '../styles/InstructorReviews.css';

const REVIEWS_PER_PAGE = 3;

const InstructorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [viewUnansweredOnly, setViewUnansweredOnly] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentReplyReview, setCurrentReplyReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const token = getAccessToken();

  useEffect(() => {
    if (!token) return;

    const fetchReviews = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/student/instructor/reviews/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error('❌ Failed to fetch instructor reviews:', err);
      }
    };

    fetchReviews();
  }, [token]);

  const handleReplyOpen = (review) => {
    setCurrentReplyReview(review);
    setReplyText(review.reply || '');
    setShowReplyModal(true);
  };

  const handleReplySubmit = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/student/reviews/reply/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          review: currentReplyReview.id,
          reply: replyText
        })
      });

      if (res.ok) {
        const updated = reviews.map(r =>
          r.id === currentReplyReview.id
            ? { ...r, reply: replyText }
            : r
        );
        setReviews(updated);
        setShowReplyModal(false);
      } else {
        console.error('❌ Reply submission failed');
      }
    } catch (err) {
      console.error('❌ Error posting reply:', err);
    }
  };

  const filteredReviews = viewUnansweredOnly
    ? reviews.filter((r) => !r.reply)
    : reviews;

  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  return (
    <div className="instructor-reviews-page">
      <h2 className="page-title">Student Reviews</h2>

      <div className="toggle-section">
        <button
          className={`toggle-btn ${!viewUnansweredOnly ? 'active' : ''}`}
          onClick={() => setViewUnansweredOnly(false)}
        >
          All Reviews
        </button>
        <button
          className={`toggle-btn ${viewUnansweredOnly ? 'active' : ''}`}
          onClick={() => setViewUnansweredOnly(true)}
        >
          Unanswered Only{' '}
          {filteredReviews.filter(r => !r.reply).length > 0 && (
            <span className="badge">
              {filteredReviews.filter(r => !r.reply).length}
            </span>
          )}
        </button>
      </div>

      {currentReviews.length > 0 ? (
        <div className="reviews-list">
          {currentReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <h4>{review.course_title}</h4>
                <span className="review-date">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="review-body">
                <p>
                  <strong>{review.student_name || 'Student'}</strong> rated:{' '}
                  {'⭐'.repeat(review.rating)}
                </p>
                <p className="review-text">"{review.comment}"</p>
                {review.reply && (
                  <div className="instructor-reply">
                    <strong>Your reply:</strong>
                    <p>{review.reply}</p>
                  </div>
                )}
              </div>
              <div className="review-actions">
                <button className="btn-reply" onClick={() => handleReplyOpen(review)}>
                  {review.reply ? 'Edit Reply' : 'Reply'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-reviews">
          <img src={NoReview} alt="No Reviews" />
          <h3>No reviews yet</h3>
          <p>Once students start reviewing your courses, they'll appear here.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showReplyModal && (
        <div className="modal-overlay">
          <div className="reply-modal">
            <h3>Reply to Review</h3>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response here..."
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleReplySubmit} className="btn-reply">Submit</button>
              <button onClick={() => setShowReplyModal(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorReviews;
