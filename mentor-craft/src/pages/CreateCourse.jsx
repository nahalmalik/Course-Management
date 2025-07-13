import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateCourse.css';

const CreateCourse = () => {
  const navigate = useNavigate();
  const steps = ['General', 'Curriculum', 'Media', 'Pricing', 'Submit'];
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    title: '',
    category: '',
    overview: '',
    lessons: [],
    thumbnail: '',
    introVideo: '',
    price: '',
    discount: '',
    instructor: 'John Doe', // Default instructor
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addLesson = () => {
    setForm({ ...form, lessons: [...form.lessons, { title: '', duration: '' }] });
  };

  const updateLesson = (index, field, value) => {
    const updatedLessons = [...form.lessons];
    updatedLessons[index][field] = value;
    setForm({ ...form, lessons: updatedLessons });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const existingCourses = JSON.parse(localStorage.getItem('customCourses')) || [];
    const newCourse = {
      ...form,
      id: Date.now(), // unique ID
      rating: 4.5,
      lessons: form.lessons.length,
      duration: form.lessons.reduce((acc, lesson) => {
        const num = parseInt(lesson.duration);
        return acc + (isNaN(num) ? 0 : num);
      }, 0) + 'm',
      image: form.thumbnail,
    };
    localStorage.setItem('customCourses', JSON.stringify([newCourse, ...existingCourses]));
    alert('Course submitted successfully!');
    navigate('/instructor-dashboard');
  };

  const StepContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="form-group">
              <label>Course Title</label>
              <input name="title" value={form.title} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input name="category" value={form.category} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Overview</label>
              <textarea name="overview" value={form.overview} onChange={handleChange} />
            </div>
          </>
        );
      case 1:
        return (
          <div className="form-group">
            <label>Curriculum</label>
            {form.lessons.map((lesson, i) => (
              <div key={i} className="lesson-row">
                <input
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={(e) => updateLesson(i, 'title', e.target.value)}
                />
                <input
                  placeholder="Duration (min)"
                  value={lesson.duration}
                  onChange={(e) => updateLesson(i, 'duration', e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={addLesson}>+ Add Lesson</button>
          </div>
        );
      case 2:
        return (
          <>
            <div className="form-group">
              <label>Thumbnail Image URL</label>
              <input name="thumbnail" value={form.thumbnail} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Intro Video (YouTube Embed URL)</label>
              <input name="introVideo" value={form.introVideo} onChange={handleChange} />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="form-group">
              <label>Price</label>
              <input name="price" value={form.price} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Discount</label>
              <input name="discount" value={form.discount} onChange={handleChange} />
            </div>
          </>
        );
      case 4:
        return (
          <div className="submit-preview">
            <p>Review your course info:</p>
            <ul>
              <li><b>Title:</b> {form.title}</li>
              <li><b>Category:</b> {form.category}</li>
              <li><b>Lessons:</b> {form.lessons.length}</li>
              <li><b>Price:</b> {form.price} (Discount: {form.discount || 'None'})</li>
            </ul>
            <button className="btn-primary" type="submit">Submit Course</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-course-page">
      <div className="form-section">
        <h2>Create Course</h2>

        {/* Progress Bar */}
        <div className="step-progress">
          {steps.map((label, i) => (
            <div
              key={i}
              className={`step-item ${i === step ? 'active' : i < step ? 'done' : ''}`}
              onClick={() => setStep(i)}
            >
              {label}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <StepContent />
          <div className="form-nav">
            {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary">← Back</button>}
            {step < steps.length - 1 && <button type="button" onClick={() => setStep(step + 1)} className="btn-primary">Next →</button>}
          </div>
        </form>
      </div>

      {/* Live Preview */}
      <div className="preview-box">
        <h3>Live Preview</h3>
        {form.thumbnail && <img src={form.thumbnail} alt="Course Thumbnail" />}
        <h4>{form.title}</h4>
        <p>{form.overview}</p>
        {form.introVideo && (
          <iframe
            src={form.introVideo}
            width="100%"
            height="180"
            title="Intro Video"
            frameBorder="0"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
