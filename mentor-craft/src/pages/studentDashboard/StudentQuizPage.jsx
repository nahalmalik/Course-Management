import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getAccessToken } from '../../contexts/authUtils';

const StudentQuizPage = () => {
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showModal, setShowModal] = useState(false);

  const token = getAccessToken();

  useEffect(() => {
    fetchAvailableQuizzes();
  }, []);

  const fetchAvailableQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/student/available-quizzes/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableQuizzes(res.data);
    } catch {
      toast.error('Failed to fetch available quizzes');
    }
  };

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuestions(quiz.questions || []);
    setSelectedOptions({});
    setShowModal(true);
  };

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedOptions).length === 0) {
      toast.error("Please answer at least one question.");
      return;
    }

    const answers = Object.entries(selectedOptions).map(([q, opt]) => ({
      question: parseInt(q),
      selected_option: opt
    }));

    try {
      const res = await axios.post(
        'http://localhost:8000/api/student/submit-quiz/',
        { quiz: selectedQuiz.id, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`✅ Quiz submitted successfully! You scored ${res.data.score}%`, {
        duration: 4000,
        style: { background: '#d4edda', color: '#155724', fontWeight: 'bold' },
        icon: '🎉',
      });

      setShowModal(false);
      setSelectedQuiz(null);
      fetchAvailableQuizzes();
    } catch {
      toast.error('Failed to submit quiz');
    }
  };

  const renderQuestion = (q) => (
    <div key={q.id} style={styles.questionBox}>
      <h4 style={{ marginBottom: '10px' }}>{q.question_text}</h4>
      {q.options?.length > 0 ? (
        q.options.map((opt, idx) => (
          <label key={idx} style={styles.optionLabel}>
            <input
              type="radio"
              name={`q-${q.id}`}
              value={opt.id}
              checked={selectedOptions[q.id] === opt.id}
              onChange={() => handleOptionSelect(q.id, opt.id)}
            />
            {opt.text}
          </label>
        ))
      ) : (
        <p style={{ fontStyle: 'italic', color: 'gray' }}>No options available.</p>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📚 Available Quizzes</h2>
      {availableQuizzes.length === 0 ? (
        <p>No quizzes available at the moment.</p>
      ) : (
        availableQuizzes.map(quiz => (
          <div key={quiz.id} style={styles.quizCard}>
            <h3>{quiz.title}</h3>
            <p><strong>Course:</strong> {quiz.course_title}</p>
            <p><strong>Attempts:</strong> {quiz.your_attempts_count} / {quiz.attempts_allowed}</p>
            <button onClick={() => startQuiz(quiz)} style={styles.button}>Start Quiz</button>
          </div>
        ))
      )}

      {showModal && selectedQuiz && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>{selectedQuiz.title}</h2>
            {questions.length === 0 ? (
              <p>No questions in this quiz.</p>
            ) : (
              questions.map(renderQuestion)
            )}
            <button onClick={handleSubmit} style={styles.button}>Submit Quiz</button>
            <button onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', background: '#f9fafb' },
  heading: { fontSize: '1.8rem', color: '#1E3A8A', marginBottom: '1.5rem' },
  quizCard: {
    background: '#ffffff',
    border: '1px solid #E5E7EB',
    padding: '1.5rem',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
  },
  button: {
    marginTop: '1rem',
    backgroundColor: '#2563EB',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 500,
    cursor: 'pointer'
  },
  cancelBtn: {
    marginTop: 10,
    backgroundColor: '#9ca3af',
    color: '#fff',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },
  modalContent: {
    background: '#fff',
    borderRadius: '10px',
    padding: '30px',
    width: '600px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  questionBox: {
    background: '#f3f4f6',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  optionLabel: {
    display: 'block',
    margin: '8px 0',
    fontSize: '1rem'
  }
};

export default StudentQuizPage;
