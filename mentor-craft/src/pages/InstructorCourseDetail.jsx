import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseData from '../components/courseData';
import courseExtraData from '../components/courseExtraData';
import { getCurrentUser } from '../contexts/authUtils';

const InstructorCourseDetail = () => {
  const { id } = useParams();
  const courseId = parseInt(id);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [extra, setExtra] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formCurriculum, setFormCurriculum] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.userType !== 'instructor') {
      navigate('/');
      return;
    }
    setUser(currentUser);

    const courseObj = courseData.find(c => c.id === courseId);
    const extraData = courseExtraData[courseId];

    if (!courseObj || !extraData) {
      navigate('/');
      return;
    }

    setCourse(courseObj);
    setExtra(extraData);
    setFormCurriculum(extraData.curriculum || []);
  }, [courseId, navigate]);

  const handleChange = (index, key, value) => {
    const updated = [...formCurriculum];
    updated[index][key] = value;
    setFormCurriculum(updated);
  };

  const addLecture = () => {
    setFormCurriculum([
      ...formCurriculum,
      { title: '', description: '', duration: '', icon: '', video: '' }
    ]);
  };

  const removeLecture = (index) => {
    const updated = [...formCurriculum];
    updated.splice(index, 1);
    setFormCurriculum(updated);
  };

  const handleSave = () => {
    setExtra({ ...extra, curriculum: formCurriculum });
    setIsEditing(false);
    alert('Curriculum updated (simulated)');
  };

  if (!course || !extra) return null;

  return (
    <div style={{ maxWidth: 1000, margin: '30px auto', padding: 20 }}>
      <h2 style={{ color: 'rgb(32,125,140)', marginBottom: 20 }}>
        {course.title}
      </h2>

      <p style={{ marginBottom: 20 }}>{extra.overview}</p>

      <h3 style={{ color: 'rgb(42,98,113)', marginBottom: 10 }}>
        Curriculum
      </h3>

      {isEditing ? (
        <>
          {formCurriculum.map((item, idx) => (
            <div key={idx} style={{ background: '#f9f9f9', padding: 15, borderRadius: 6, marginBottom: 10 }}>
              <input
                placeholder="Title"
                value={item.title}
                onChange={(e) => handleChange(idx, 'title', e.target.value)}
                style={inputStyle}
              />
              <textarea
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleChange(idx, 'description', e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Duration"
                value={item.duration}
                onChange={(e) => handleChange(idx, 'duration', e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Icon"
                value={item.icon}
                onChange={(e) => handleChange(idx, 'icon', e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="YouTube Embed URL"
                value={item.video}
                onChange={(e) => handleChange(idx, 'video', e.target.value)}
                style={inputStyle}
              />
              <button onClick={() => removeLecture(idx)} style={removeBtn}>🗑 Remove</button>
            </div>
          ))}
          <button onClick={addLecture} style={addBtn}>➕ Add Lecture</button>
          <button onClick={handleSave} style={saveBtn}>💾 Save Curriculum</button>
        </>
      ) : (
        <div>
          {extra.curriculum.map((item, idx) => (
            <div key={idx} style={curriculumCard}>
              <h4>{item.icon} {item.title}</h4>
              <p>{item.description}</p>
              <p><strong>Duration:</strong> {item.duration}</p>
              <iframe
                width="100%"
                height="240"
                src={item.video}
                title={item.title}
                allowFullScreen
                style={{ marginTop: 10, borderRadius: 4 }}
              />
            </div>
          ))}
          <button onClick={() => setIsEditing(true)} style={editBtn}>✏️ Edit Curriculum</button>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: 10,
  marginBottom: 8,
  borderRadius: 4,
  border: '1px solid #ccc',
  fontSize: 14
};

const removeBtn = {
  backgroundColor: '#e74c3c',
  color: '#fff',
  padding: '8px 12px',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer'
};

const addBtn = {
  marginTop: 10,
  padding: '8px 16px',
  backgroundColor: '#2a6271',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer'
};

const saveBtn = {
  marginTop: 20,
  padding: '10px 16px',
  backgroundColor: 'rgb(32,125,140)',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer'
};

const editBtn = {
  marginTop: 20,
  padding: '10px 16px',
  backgroundColor: '#3498db',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer'
};

const curriculumCard = {
  background: '#f2f9fa',
  padding: 15,
  borderRadius: 6,
  marginBottom: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};

export default InstructorCourseDetail;
