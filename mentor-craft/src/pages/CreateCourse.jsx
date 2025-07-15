import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../contexts/authUtils';
import { addNewCourse } from '../contexts/courseStorage';
import '../styles/InstructorEarnings.css';
import '../styles/CreateCourse.css';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('info');

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    lessons: '',
    thumbnail: '',
    curriculumIntro: '',
    faq: '',
    mediaLink: ''
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.userType === 'instructor') {
      setUser(currentUser);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setCourseData(prev => ({ ...prev, thumbnail: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const instructorName = user?.name || user?.email?.split('@')[0] || 'Unknown Instructor';
    const instructorEmail = user?.email || '';

    if (!instructorEmail) {
      alert('Instructor email is missing.');
      return;
    }

    const newCourse = {
      id: Date.now(),
      title: courseData.title,
      description: courseData.description,
      instructor: instructorName,
      instructorEmail: instructorEmail,
      rating: 4.8,
      students: 0,
      lessons: courseData.lessons || 0,
      duration: courseData.duration || 'N/A',
      price: courseData.price || 'Free',
      image: courseData.thumbnail || '/images/placeholder-course.jpg',
      category: courseData.category || 'General',
      curriculumIntro: courseData.curriculumIntro || "This course covers foundational to advanced topics in depth.",
      faq: courseData.faq || "Q: Do I need prior experience?\nA: No, beginners are welcome!",
      mediaLink: courseData.mediaLink || ''
    };

    addNewCourse(newCourse);

    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      navigate('/instructor/my-courses');
    }, 2000);

    setCourseData({
      title: '', description: '', category: '', price: '',
      duration: '', lessons: '', thumbnail: '',
      curriculumIntro: '', faq: '', mediaLink: ''
    });
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(prev => (prev === section ? '' : section));
  };

  return (
    <div className="instructor-dashboard">
      <main className="main-section">
        <h2 className="create-course-heading">🛠️ Create a New Course</h2>
        <p className="create-course-subtitle">Fill out the details below to publish your course.</p>

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="accordion">
            <div className={`accordion-item ${activeAccordion === 'info' ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('info')}>📘 Course Info</div>
              <div className="accordion-content">

                <div className="floating-input">
                  <input type="text" name="title" value={courseData.title} onChange={handleChange} required />
                  <label>Course Title</label>
                </div>

                <div className="floating-input">
                  <textarea name="description" value={courseData.description} onChange={handleChange} required />
                  <label>Course Description</label>
                </div>

                <div className="floating-input">
                  <input type="text" value={user?.name || ''} readOnly />
                  <label>Instructor Name</label>
                </div>

                <div className="floating-input">
                  <input type="text" name="category" value={courseData.category} onChange={handleChange} required />
                  <label>Category</label>
                </div>

                <div className="floating-input">
                  <input type="text" name="price" value={courseData.price} onChange={handleChange} required />
                  <label>Price (e.g., $99 or Free)</label>
                </div>

                <div className="floating-input">
                  <input type="text" name="duration" value={courseData.duration} onChange={handleChange} required />
                  <label>Duration (e.g., 6 weeks)</label>
                </div>

                <div className="floating-input">
                  <input type="number" name="lessons" value={courseData.lessons} onChange={handleChange} required />
                  <label>Number of Lessons</label>
                </div>

                <div className="floating-input">
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  <label style={{ top: '-10px', fontSize: '13px', color: '#777' }}>Upload Course Thumbnail</label>
                </div>

                {courseData.thumbnail && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <img
                      src={courseData.thumbnail}
                      alt="Thumbnail Preview"
                      style={{ width: '220px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={`accordion-item ${activeAccordion === 'curriculum' ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('curriculum')}>📚 Curriculum</div>
              <div className="accordion-content">
                <div className="floating-input">
                  <textarea name="curriculumIntro" value={courseData.curriculumIntro} onChange={handleChange} required />
                  <label>Curriculum Introduction</label>
                </div>
              </div>
            </div>

            <div className={`accordion-item ${activeAccordion === 'faq' ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('faq')}>❓ FAQ</div>
              <div className="accordion-content">
                <div className="floating-input">
                  <textarea name="faq" value={courseData.faq} onChange={handleChange} required />
                  <label>Frequently Asked Questions</label>
                </div>
              </div>
            </div>

            <div className={`accordion-item ${activeAccordion === 'media' ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('media')}>🎥 Media</div>
              <div className="accordion-content">
                <div className="floating-input">
                  <input
                    type="text"
                    name="mediaLink"
                    value={courseData.mediaLink}
                    onChange={handleChange}
                    placeholder="https://youtube.com/embed/..."
                  />
                  <label>YouTube Video Link</label>
                </div>

                {courseData.mediaLink && courseData.mediaLink.includes("youtube") && (
                  <div className="video-preview">
                    <iframe
                      width="100%"
                      height="300"
                      src={courseData.mediaLink.replace("watch?v=", "embed/")}
                      title="Course Preview Video"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="button-wrapper">
            <button type="submit" className="submit-btn">Publish Course</button>
          </div>
        </form>

        {/* Live Preview */}
        <div className="preview-section">
          <h3>Live Preview</h3>
          <div className="course-card preview-card">
            {courseData.thumbnail && <img src={courseData.thumbnail} alt="Thumbnail" />}
            <h4>{courseData.title || 'Course Title'}</h4>
            <p>{courseData.duration || '--'} · {courseData.lessons || '--'} lessons</p>
            <p><strong>{courseData.price || '$--'}</strong></p>
            <p>{courseData.description || 'Course description will appear here.'}</p>
          </div>
        </div>

        {toastVisible && (
          <div className="toast-checkmark">
            <div className="check-icon"><span className="checkmark">✓</span></div>
            <p>Course published successfully!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateCourse;
