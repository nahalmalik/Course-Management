import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../contexts/authUtils';
import { getCourses } from '../contexts/courseStorage';
import NoReview from '../assets/no-review.png';
import '../styles/InstructorReviews.css';

const loadStoredReviews = () => {
  const stored = localStorage.getItem('instructor_reviews');
  return stored ? JSON.parse(stored) : null;
};

const REVIEWS_PER_PAGE = 3;

const InstructorReviews = () => {
  const [user, setUser] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [viewUnansweredOnly, setViewUnansweredOnly] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [currentReplyReview, setCurrentReplyReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loggedInUser = getCurrentUser();
    setUser(loggedInUser);

    if (loggedInUser) {
      const allCourses = getCourses();
      const ownedCourses = allCourses.filter(
        c =>
          c.instructor?.toLowerCase() === loggedInUser.name?.toLowerCase() &&
          c.instructorEmail?.toLowerCase() === loggedInUser.email?.toLowerCase()
      );
      setInstructorCourses(ownedCourses);

      const ownedIds = ownedCourses.map(c => c.id);

      const stored = loadStoredReviews();

      let finalReviews = stored;
      if (!stored) {
        const demoReviews = [];
        ownedCourses.forEach((course, index) => {
          demoReviews.push({
            id: index + 1,
            courseId: course.id,
            courseTitle: course.title,
            student: `Student ${index + 1}`,
            rating: 5 - (index % 2),
            text: `This is a great course on ${course.title.toLowerCase()}. Very helpful!`,
            date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
            isAnswered: false,
            reply: ''
          });
        });
        finalReviews = demoReviews;
        localStorage.setItem('instructor_reviews', JSON.stringify(finalReviews));
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
      }

      const matchingReviews = finalReviews.filter(r => ownedIds.includes(r.courseId));
      setFilteredReviews(matchingReviews);
    }
  }, []);

  const handleReplyOpen = (review) => {
    setCurrentReplyReview(review);
    setReplyText(review.reply || '');
    setShowReplyModal(true);
  };

  const handleReplySubmit = () => {
    const updatedReviews = filteredReviews.map(r =>
      r.id === currentReplyReview.id
        ? { ...r, isAnswered: true, reply: replyText }
        : r
    );
    setFilteredReviews(updatedReviews);
    localStorage.setItem('instructor_reviews', JSON.stringify(updatedReviews));
    setShowReplyModal(false);
  };

  const reviewsToShow = filteredReviews.filter(r =>
    viewUnansweredOnly ? !r.isAnswered : true
  );

  const unansweredCount = filteredReviews.filter(r => !r.isAnswered).length;

  const indexOfLast = currentPage * REVIEWS_PER_PAGE;
  const indexOfFirst = indexOfLast - REVIEWS_PER_PAGE;
  const currentReviews = reviewsToShow.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reviewsToShow.length / REVIEWS_PER_PAGE);

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
          Unanswered Only {unansweredCount > 0 && <span className="badge">{unansweredCount}</span>}
        </button>
      </div>

      {toastVisible && (
        <div className="review-toast">🔔 New demo reviews added for your courses!</div>
      )}

      {currentReviews.length > 0 ? (
        <div className="reviews-list">
          {currentReviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <h4>{review.courseTitle}</h4>
                <span className="review-date">{review.date}</span>
              </div>
              <div className="review-body">
                <p><strong>{review.student}</strong> rated: {'⭐'.repeat(review.rating)}</p>
                <p className="review-text">"{review.text}"</p>
                {review.reply && (
                  <div className="instructor-reply">
                    <strong>Your reply:</strong>
                    <p>{review.reply}</p>
                  </div>
                )}
              </div>
              <div className="review-actions">
                <button className="btn-reply" onClick={() => handleReplyOpen(review)}>
                  {review.isAnswered ? 'Edit Reply' : 'Reply'}
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

      {/* Pagination */}
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

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="modal-overlay">
          <div className="reply-modal">
            <h3>Reply to {currentReplyReview.student}</h3>
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
