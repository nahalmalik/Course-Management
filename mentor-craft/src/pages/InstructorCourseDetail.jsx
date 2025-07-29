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
import { uploadLecture, uploadNote } from '../contexts/courseStorage';

const InstructorCourseDetail = () => {
  const { id } = useParams();
  const courseId = parseInt(id, 10);

  const [course, setCourse] = useState(null);
  const [extra, setExtra] = useState(null);
  const [formCurriculum, setFormCurriculum] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', description: '', file: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await getCourses();
        const found = courses.find(c => String(c.id) === String(courseId));
        setCourse(found || null);

        let existingExtra = getExtraData(courseId);
        if (!existingExtra) {
          existingExtra = {
            curriculum: [],
            notes: []
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



const saveCurriculum = async () => {
  try {
    for (const lecture of formCurriculum) {
      await uploadLecture(course.id, lecture);
    }
    toast.success("✅ Lectures uploaded to backend!");
  } catch (err) {
    console.error(err);
    toast.error("❌ Failed to upload lectures");
  }
};

const handleNoteUpload = async () => {
  if (!newNote.title || !newNote.description || !newNote.file) {
    toast.error("⚠️ Fill all note fields");
    return;
  }

  try {
    await uploadNote(course.id, newNote);
    const updated = [...(extra.notes || []), newNote];
    updateExtra('notes', updated);
    setNewNote({ title: '', description: '', file: null });
    toast.success("📝 Note uploaded to backend!");
  } catch (err) {
    console.error(err);
    toast.error("❌ Failed to upload note");
  }
};

  if (!course || !extra) return <div className="loading">Loading course data...</div>;

  return (
    <div className="instructor-detail-wrapper">
      <ToastContainer />
      <h2 style={{ color: 'rgb(32,125,140)', marginBottom: 20 }}>{course.title}</h2>

      {/* 📚 Curriculum */}
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

      {/* 📝 Upload Notes */}
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
    </div>
  );
};

export default InstructorCourseDetail;
