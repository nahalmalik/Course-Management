import React, { useState, useEffect } from 'react';
import api from '../api';

const QuizCreatePage = () => {
  const [courses, setCourses] = useState([]);
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    time_limit: 30,
    attempts_allowed: 1,
    passing_percentage: 60,
    is_draft: false,
    course: '', // ⬅️ store selected course ID here
    questions: [],
  });

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    explanation: '',
    question_type: 'mcq',
    points: 1,
    options: [{ text: '', is_correct: false }],
  });

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses/'); // Adjust if your endpoint is different
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleOptionChange = (index, field, value) => {
    const updated = [...newQuestion.options];
    updated[index][field] = field === 'is_correct' ? value.target.checked : value;
    setNewQuestion({ ...newQuestion, options: updated });
  };

  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { text: '', is_correct: false }],
    });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, newQuestion],
    });
    setNewQuestion({
      question_text: '',
      explanation: '',
      question_type: 'mcq',
      points: 1,
      options: [{ text: '', is_correct: false }],
    });
    setShowQuestionForm(false);
  };

  const deleteQuestion = (index) => {
    const updated = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updated });
  };

  const handleSubmit = async (asDraft = false) => {
    try {
      const token = localStorage.getItem('accessToken');
      const payload = {
        ...quiz,
        is_draft: asDraft,
      };
      await api.post('/courses/quizzes/', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert(asDraft ? 'Draft saved!' : 'Quiz created!');
    } catch (err) {
      console.error(err);
      alert('Error: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Quiz</h2>

      {/* Course Dropdown */}
      <select
        style={styles.input}
        value={quiz.course}
        onChange={(e) => setQuiz({ ...quiz, course: e.target.value })}
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title || course.name}
          </option>
        ))}
      </select>

      <input
        style={styles.input}
        placeholder="Title"
        value={quiz.title}
        onChange={e => setQuiz({ ...quiz, title: e.target.value })}
      />
      <textarea
        style={styles.textarea}
        placeholder="Description"
        value={quiz.description}
        onChange={e => setQuiz({ ...quiz, description: e.target.value })}
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Time Limit (minutes)"
        value={quiz.time_limit}
        onChange={e => setQuiz({ ...quiz, time_limit: e.target.value })}
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Attempts Allowed"
        value={quiz.attempts_allowed}
        onChange={e => setQuiz({ ...quiz, attempts_allowed: e.target.value })}
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Passing Percentage"
        value={quiz.passing_percentage}
        onChange={e => setQuiz({ ...quiz, passing_percentage: e.target.value })}
      />

      <button style={styles.button} onClick={() => setShowQuestionForm(true)}>➕ Add Question</button>

      {/* Question Form */}
      {showQuestionForm && (
        <div style={styles.questionBox}>
          <h3 style={styles.subheading}>New Question</h3>
          <input
            style={styles.input}
            placeholder="Question Text"
            value={newQuestion.question_text}
            onChange={e => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
          />
          <textarea
            style={styles.textarea}
            placeholder="Explanation"
            value={newQuestion.explanation}
            onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
          />
          <input
            style={styles.input}
            type="number"
            placeholder="Points"
            value={newQuestion.points}
            onChange={e => setNewQuestion({ ...newQuestion, points: e.target.value })}
          />

          {newQuestion.options.map((opt, idx) => (
            <div key={idx} style={styles.optionRow}>
              <input
                style={styles.optionInput}
                placeholder={`Option ${idx + 1}`}
                value={opt.text}
                onChange={e => handleOptionChange(idx, 'text', e.target.value)}
              />
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={opt.is_correct}
                  onChange={e => handleOptionChange(idx, 'is_correct', e)}
                />
                Correct
              </label>
            </div>
          ))}

          <button style={styles.button} onClick={addOption}>➕ Add Option</button>
          <div style={{ marginTop: '10px' }}>
            <button style={styles.button} onClick={addQuestion}>✅ Save Question</button>
            <button style={{ ...styles.button, backgroundColor: '#dc3545' }} onClick={() => setShowQuestionForm(false)}>❌ Cancel</button>
          </div>
        </div>
      )}

      {/* Show Questions */}
      {quiz.questions.length > 0 && (
        <div style={styles.questionList}>
          <h3 style={styles.subheading}>Questions Added:</h3>
          {quiz.questions.map((q, idx) => (
            <div key={idx} style={styles.questionCard}>
              <strong>Q{idx + 1}:</strong> {q.question_text} ({q.points} pts)
              <ul style={{ paddingLeft: '20px' }}>
                {q.options.map((opt, i) => (
                  <li key={i}>
                    {opt.text} {opt.is_correct && <strong>(✔ correct)</strong>}
                  </li>
                ))}
              </ul>
              <button style={styles.deleteBtn} onClick={() => deleteQuestion(idx)}>🗑️ Delete</button>
            </div>
          ))}
        </div>
      )}

      <br />
      <button style={{ ...styles.button, backgroundColor: '#888' }} onClick={() => handleSubmit(true)}>💾 Save as Draft</button>
      <button style={{ ...styles.button, backgroundColor: '#28a745' }} onClick={() => handleSubmit(false)}>🚀 Create Quiz</button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: 'auto',
    padding: '2rem',
    background: '#fdfdfd',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#222'
  },
  subheading: {
    marginTop: '1.5rem',
    marginBottom: '0.5rem',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.4rem 0',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.4rem 0',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
    height: '80px'
  },
  optionRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  optionInput: {
    flex: 1,
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '6px'
  },
  checkboxLabel: {
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '0.6rem 1rem',
    margin: '0.5rem 0.25rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 0.6rem',
    marginTop: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  questionBox: {
    background: '#f1f1f1',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem'
  },
  questionList: {
    marginTop: '1.5rem'
  },
  questionCard: {
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    marginBottom: '1rem',
    background: '#fafafa'
  }
};

export default QuizCreatePage;
