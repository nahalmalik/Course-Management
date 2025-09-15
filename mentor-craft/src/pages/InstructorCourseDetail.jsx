// src/pages/InstructorCourseDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  getCourses,
  getExtraData,
  saveExtraData,
  uploadLecture,
  uploadNote,
  getLectures,
} from "../contexts/courseStorage";
import "react-toastify/dist/ReactToastify.css";
import "../styles/InstructorCourseDetail.css";

const InstructorCourseDetail = () => {
  const { id } = useParams();
  const courseId = parseInt(id, 10);

  const [course, setCourse] = useState(null);
  const [extra, setExtra] = useState(null);
  const [formCurriculum, setFormCurriculum] = useState([]);
  const [lectures, setLectures] = useState([]); 
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await getCourses();
        const found = courses.find((c) => String(c.id) === String(courseId));
        setCourse(found || null);

        let existingExtra = getExtraData(courseId);
        if (!existingExtra) {
          existingExtra = { curriculum: [], notes: [] };
          saveExtraData(courseId, existingExtra);
        }
        setExtra(existingExtra);

        // Get lectures from backend
        const backendLectures = await getLectures(courseId);
        setLectures(backendLectures || []);
      } catch (error) {
        console.error("❌ Failed to load data:", error);
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
    setFormCurriculum([
      ...formCurriculum,
      { title: "", description: "", duration: "", icon: "", video: "" },
    ]);
  };

  const saveCurriculum = async () => {
    try {
      for (const lecture of formCurriculum) {
        await uploadLecture(course.id, lecture);
      }
      toast.success("✅ Lectures uploaded!");

      // Clear form & refresh list
      setFormCurriculum([]);
      const backendLectures = await getLectures(courseId);
      setLectures(backendLectures || []);
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
      updateExtra("notes", updated);
      setNewNote({ title: "", description: "", file: null });
      toast.success("📝 Note uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to upload note");
    }
  };

  // Google Meet preview
  const renderVideo = (url) => {
    if (!url) return null;
    if (url.includes("meet.google.com")) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-button"
        >
          🚀 Join Google Meet
        </a>
      );
    }
    return <p>⚠️ Please enter a valid Google Meet link</p>;
  };

  if (!course || !extra)
    return <div className="loading">Loading course data...</div>;

  return (
    <div className="instructor-detail-wrapper">
      <ToastContainer />
      <h2 style={{ color: "#1E3A8A", marginBottom: 20 }}>{course.title}</h2>

      {/* Add New Lectures */}
      <details open className="accordion-card fade-slide-up">
        <summary>📚 Add New Lectures</summary>
        {formCurriculum.map((item, idx) => (
          <div key={idx} className="animated-accordion">
            <input
              className="input-float"
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                handleCurriculumChange(idx, "title", e.target.value)
              }
            />
            <textarea
              className="input-float"
              placeholder="Description"
              value={item.description}
              onChange={(e) =>
                handleCurriculumChange(idx, "description", e.target.value)
              }
            />
            <input
              className="input-float"
              placeholder="Duration"
              value={item.duration}
              onChange={(e) =>
                handleCurriculumChange(idx, "duration", e.target.value)
              }
            />
            <input
              className="input-float"
              placeholder="Icon"
              value={item.icon}
              onChange={(e) =>
                handleCurriculumChange(idx, "icon", e.target.value)
              }
            />
            <input
              className="input-float"
              placeholder="Google Meet Link"
              value={item.video}
              onChange={(e) =>
                handleCurriculumChange(idx, "video", e.target.value)
              }
            />
            <div className="video-preview">{renderVideo(item.video)}</div>
          </div>
        ))}
        <button onClick={addLecture} className="glass-button">
          ➕ Add Lecture
        </button>
        <button
          onClick={saveCurriculum}
          className="glass-button"
          style={{ marginLeft: 10 }}
        >
          💾 Save Lectures
        </button>
      </details>

      {/* Existing Lectures */}
      <details open className="accordion-card fade-slide-up">
        <summary>📖 Existing Lectures</summary>
        {lectures.length === 0 ? (
          <p>No lectures uploaded yet.</p>
        ) : (
          <ul className="lecture-list">
            {lectures.map((lec) => (
              <li key={lec.id} className="lecture-item">
                <strong>{lec.title}</strong> — {lec.duration}
                <p>{lec.description}</p>
                <div>{renderVideo(lec.video)}</div>
              </li>
            ))}
          </ul>
        )}
      </details>

      {/* Upload Notes */}
      <details className="accordion-card fade-slide-up">
        <summary>📝 Upload Notes</summary>
        <input
          className="input-float"
          placeholder="Note Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          className="input-float"
          placeholder="Description"
          value={newNote.description}
          onChange={(e) =>
            setNewNote({ ...newNote, description: e.target.value })
          }
        />
        <input
          type="file"
          onChange={(e) =>
            setNewNote({ ...newNote, file: e.target.files[0] })
          }
        />
        <button onClick={handleNoteUpload} className="glass-button">
          📎 Upload Note
        </button>

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
