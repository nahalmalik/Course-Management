import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {
  getCourses,
  getExtraData,
  saveExtraData
} from '../contexts/courseStorage';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/InstructorCourseDetail.css';

const InstructorCourseDetail = () => {
  const { id } = useParams();
  const courseId = parseInt(id, 10);

  const [course, setCourse] = useState(null);
  const [extra, setExtra] = useState(null);
  const [formCurriculum, setFormCurriculum] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', description: '', file: null });
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', file: null, dueDate: '' });
  const [newQuiz, setNewQuiz] = useState({ title: '', description: '', file: null, dueDate: '' });

useEffect(() => {
  const fetchData = async () => {
    try {
      const courses = await getCourses();

      console.log("✅ Fetched courses:", courses);
      const found = courses.find(c => String(c.id) === String(courseId));


      if (!found) {
        console.warn("⚠️ Course not found for ID:", courseId);
      }

      setCourse(found || null);

      let existingExtra = getExtraData(courseId);
      if (!existingExtra) {
        existingExtra = {
          curriculum: [],
          notes: [],
          assignments: [],
          quizzes: []
        };
        saveExtraData(courseId, existingExtra);
      }

      setExtra(existingExtra);
      setFormCurriculum(existingExtra.curriculum || []);
    } catch (error) {
      console.error('❌ Failed to load course or extra data:', error);
    }
  };

  fetchData();
}, [courseId]);

  const updateExtra = (key, value) => {
    const updated = { ...extra, [key]: value };
    setExtra(updated);
    saveExtraData(courseId, updated);
  };

  const handleCurriculumChange = (index, field, value) => {
    const updated = [...formCurriculum];
    updated[index][field] = value;
    setFormCurriculum(updated);
  };

  const addLecture = () => {
    setFormCurriculum([...formCurriculum, { title: '', description: '', duration: '', icon: '', video: '' }]);
  };

  const saveCurriculum = () => {
    updateExtra('curriculum', formCurriculum);
    toast.success('✅ Curriculum saved successfully!');
  };

  const handleNoteUpload = () => {
    if (!newNote.title || !newNote.description || !newNote.file) {
      toast.error('⚠️ Fill all note fields');
      return;
    }

    const updated = [...(extra.notes || []), newNote];
    updateExtra('notes', updated);
    setNewNote({ title: '', description: '', file: null });
    toast.success('📝 Note uploaded!');
  };

  const handleAssignmentUpload = () => {
    if (!newAssignment.title || !newAssignment.description || !newAssignment.file || !newAssignment.dueDate) {
      toast.error('⚠️ Fill all assignment fields');
      return;
    }

    const updated = [...(extra.assignments || []), newAssignment];
    updateExtra('assignments', updated);
    setNewAssignment({ title: '', description: '', file: null, dueDate: '' });
    toast.success('📘 Assignment uploaded!');
  };

  const handleQuizUpload = () => {
    if (!newQuiz.title || !newQuiz.description || !newQuiz.file || !newQuiz.dueDate) {
      toast.error('⚠️ Fill all quiz fields');
      return;
    }

    const updated = [...(extra.quizzes || []), newQuiz];
    updateExtra('quizzes', updated);
    setNewQuiz({ title: '', description: '', file: null, dueDate: '' });
    toast.success('🧠 Quiz uploaded!');
  };

  if (!course || !extra) return <div className="loading">Loading course data...</div>;

  return (
    <div className="instructor-detail-wrapper">
      <ToastContainer />
      <h2 style={{ color: 'rgb(32,125,140)', marginBottom: 20 }}>{course.title}</h2>

      {/* Curriculum */}
      <details open className="accordion-card fade-slide-up">
        <summary>📚 Curriculum</summary>
        {formCurriculum.map((item, idx) => (
          <div key={idx} className="animated-accordion">
            <input className="input-float" placeholder="Title" value={item.title} onChange={e => handleCurriculumChange(idx, 'title', e.target.value)} />
            <textarea className="input-float" placeholder="Description" value={item.description} onChange={e => handleCurriculumChange(idx, 'description', e.target.value)} />
            <input className="input-float" placeholder="Duration" value={item.duration} onChange={e => handleCurriculumChange(idx, 'duration', e.target.value)} />
            <input className="input-float" placeholder="Icon" value={item.icon} onChange={e => handleCurriculumChange(idx, 'icon', e.target.value)} />
            <input className="input-float" placeholder="YouTube Embed Link" value={item.video} onChange={e => handleCurriculumChange(idx, 'video', e.target.value)} />
          </div>
        ))}
        <button onClick={addLecture} className="glass-button">➕ Add Lecture</button>
        <button onClick={saveCurriculum} className="glass-button" style={{ marginLeft: 10 }}>💾 Save Curriculum</button>
      </details>

      {/* Notes */}
      <details className="accordion-card fade-slide-up">
        <summary>📝 Upload Notes</summary>
        <input className="input-float" placeholder="Note Title" value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })} />
        <textarea className="input-float" placeholder="Description" value={newNote.description} onChange={e => setNewNote({ ...newNote, description: e.target.value })} />
        <input type="file" onChange={e => setNewNote({ ...newNote, file: e.target.files[0] })} />
        <button onClick={handleNoteUpload} className="glass-button">📎 Upload Note</button>

        {extra.notes?.length > 0 && (
          <div className="preview-section">
            <h4>📂 Uploaded Notes</h4>
            {extra.notes.map((n, i) => (
              <div key={i} className="preview-item">
                <strong>{n.title}</strong>
                <p>{n.description}</p>
                {n.file?.name && <p>📎 {n.file.name}</p>}
              </div>
            ))}
          </div>
        )}
      </details>

      {/* Assignments */}
      <details className="accordion-card fade-slide-up">
        <summary>📘 Upload Assignment</summary>
        <input className="input-float" placeholder="Assignment Title" value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} />
        <textarea className="input-float" placeholder="Description" value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} />
        <input type="date" value={newAssignment.dueDate} onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
        <input type="file" onChange={e => setNewAssignment({ ...newAssignment, file: e.target.files[0] })} />
        <button onClick={handleAssignmentUpload} className="glass-button">📎 Upload Assignment</button>

        {extra.assignments?.length > 0 && (
          <div className="preview-section">
            <h4>📘 Uploaded Assignments</h4>
            {extra.assignments.map((a, i) => (
              <div key={i} className="preview-item">
                <strong>{a.title}</strong>
                <p>{a.description}</p>
                <p>📅 Due: {a.dueDate}</p>
                {a.file?.name && <p>📎 {a.file.name}</p>}
              </div>
            ))}
          </div>
        )}
      </details>

      {/* Quizzes */}
      <details className="accordion-card fade-slide-up">
        <summary>🧠 Upload Quiz</summary>
        <input className="input-float" placeholder="Quiz Title" value={newQuiz.title} onChange={e => setNewQuiz({ ...newQuiz, title: e.target.value })} />
        <textarea className="input-float" placeholder="Description" value={newQuiz.description} onChange={e => setNewQuiz({ ...newQuiz, description: e.target.value })} />
        <input type="date" value={newQuiz.dueDate} onChange={e => setNewQuiz({ ...newQuiz, dueDate: e.target.value })} />
        <input type="file" onChange={e => setNewQuiz({ ...newQuiz, file: e.target.files[0] })} />
        <button onClick={handleQuizUpload} className="glass-button">📎 Upload Quiz</button>

        {extra.quizzes?.length > 0 && (
          <div className="preview-section">
            <h4>🧠 Uploaded Quizzes</h4>
            {extra.quizzes.map((q, i) => (
              <div key={i} className="preview-item">
                <strong>{q.title}</strong>
                <p>{q.description}</p>
                <p>📅 Due: {q.dueDate}</p>
                {q.file?.name && <p>📎 {q.file.name}</p>}
              </div>
            ))}
          </div>
        )}
      </details>
    </div>
  );
};

export default InstructorCourseDetail;
