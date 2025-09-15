import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../contexts/authUtils';

import '../styles/InstructorEarnings.css';
import '../styles/CreateCourse.css';

const CreateCourse = () => {
  const navigate = useNavigate();

  const handleDragOver = (e) => e.preventDefault();

  const [user, setUser] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState('info');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    language: '',
    price: '',
    discount_price: '', 
    duration: '',
    lessons: '',
    curriculum_intro: '', 
    faqs: '', 
    seo_title: '', 
    seo_keywords: '',
    seo_description: '', 
    has_expiration: false,
    image: null,
    video_file: null, 
    thumbnailPreview: null,
    videoPreview: null,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setTimeout(() => {
        const delayedUser = getCurrentUser();
        if (delayedUser?.role === 'instructor') setUser(delayedUser);
        else navigate('/');
      }, 100);
    } else if (currentUser.role === 'instructor') {
      setUser(currentUser);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setCourseData((prev) => ({
        ...prev,
        image: file,
        thumbnailPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setCourseData((prev) => ({
        ...prev,
        video_file: file,
        videoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setCourseData((prev) => ({
        ...prev,
        image: file,
        thumbnailPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(Number(courseData.price))) return alert('Price must be a valid number.');
    if (isNaN(Number(courseData.lessons))) return alert('Lessons must be a valid number.');

    const instructorName = user?.name || user?.email?.split('@')[0] || 'Unknown';
    const instructorEmail = user?.email;

    const formData = new FormData();
    for (let key in courseData) {
      if (key === 'image' && courseData.image) {
        formData.append('image', courseData.image);
      } else if (key === 'video_file' && courseData.video_file) {
        formData.append('video_file', courseData.video_file); 
      } else if (key !== 'thumbnailPreview' && key !== 'videoPreview') {
        formData.append(key, courseData[key]);
      }
    }

    const sampleFaqs = [
      { question: "What is this course about?", answer: "It's a test FAQ." },
      { question: "Is it beginner friendly?", answer: "Yes." }
    ];
    formData.append('faqs', JSON.stringify(sampleFaqs));

    formData.append('instructor', instructorName);
    formData.append('instructor_email', instructorEmail);
    formData.append('tags', JSON.stringify(tags));

    try {
      const res = await fetch('http://localhost:8000/api/courses/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create course');

      const data = await res.json();

      // ✅ Update courseData with backend URLs
      setCourseData((prev) => ({
        ...prev,
        image: data.image,
        thumbnailPreview: data.image,
        video_file: data.video_file,
        videoPreview: data.video_file,
      }));

      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        navigate('/instructor/dashboard', { state: { courseCreated: true } });
      }, 2000);
    } catch (err) {
      console.error('❌ Course upload failed:', err);
      alert('Failed to upload. Please check backend.');
    }
  };

  const toggleAccordion = (section) => {
    setActiveAccordion((prev) => (prev === section ? '' : section));
  };

  return (
    <div className="instructor-dashboard">
      <main className="main-section">
        <aside className="course-tips-box">
          <h4>💡 Course Upload Tips</h4>
          <ul>
            <li>Use a clear and catchy title</li>
            <li>Make your description easy to read</li>
            <li>Upload a high-quality thumbnail image</li>
            <li>Choose the correct level and category</li>
            <li>Preview your course before publishing</li>
          </ul>
        </aside>

        <h2 className="create-course-heading">🛠️ Create a New Course</h2>
        <p className="create-course-subtitle">Fill out the details below to publish your course.</p>

        <form className="create-form" onSubmit={handleSubmit}>
          <div className="accordion">
            {/* COURSE INFO */}
            <div className={`accordion-item ${activeAccordion === 'info' ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('info')}>📘 Course Info</div>
              <div className="accordion-content">
                <div className="floating-input">
                  <input type="text" name="title" value={courseData.title} onChange={handleChange} required maxLength={100} />
                  <label>Course Title</label>
                </div>

                <div className="floating-input">
                  <textarea name="description" value={courseData.description} onChange={handleChange} required maxLength={300} />
                  <label>Course Description</label>
                  <div style={{ fontSize: '12px', color: '#888' }}>{(courseData.description || '').length}/300 characters</div>
                </div>

                <div className="floating-input">
                  <input type="text" value={user?.name || ''} readOnly />
                  <label>Instructor Name</label>
                </div>

                <div className="floating-input">
                  <input type="email" value={user?.email || ''} readOnly />
                  <label>Instructor Email</label>
                </div>

                <div className="floating-input">
                  <input type="text" name="category" value={courseData.category} onChange={handleChange} required />
                  <label>Category</label>
                </div>

                <div className="floating-input">
                  <select name="level" value={courseData.level} onChange={handleChange} required>
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <label>Level</label>
                </div>

                <div className="floating-input">
                  <select name="language" value={courseData.language} onChange={handleChange} required>
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                  <label>Language</label>
                </div>

                <div className="floating-input">
                  <input type="text" name="price" value={courseData.price} onChange={handleChange} required />
                  <label>Price (e.g. $49 or Free)</label>
                </div>

                <div className="floating-input">
                  <input type="text" name="discount_price" value={courseData.discount_price} onChange={handleChange} />
                  <label>Discounted Price (optional)</label>
                </div>

                <div className="floating-input">
                  <input type="text" name="duration" value={courseData.duration} onChange={handleChange} required />
                  <label>Duration (e.g. 6 weeks)</label>
                </div>

                <div className="floating-input">
                  <input type="number" name="lessons" value={courseData.lessons} onChange={handleChange} required />
                  <label>Number of Lessons</label>
                </div>

                {/* Image Upload */}
                <div
                  className="floating-input dropzone"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}
                >
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                  <label style={{ top: '-10px', fontSize: '13px', color: '#777' }}>Drag or Click to Upload Thumbnail</label>
                  {courseData.thumbnailPreview && (
                    <img
                      src={courseData.thumbnailPreview}
                      alt="Thumbnail"
                      style={{ marginTop: '10px', width: '200px', borderRadius: '8px' }}
                    />
                  )}
                </div>

                {/* Tags */}
                <div className="floating-input tag-input">
                  <input
                    type="text"
                    placeholder="Enter tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTagAdd(e)}
                  />
                  <label>Course Tags</label>
                  <div className="tag-list">
                    {tags.map((tag, index) => (
                      <span key={index} className="tag" onClick={() => removeTag(tag)}>{tag} ✕</span>
                    ))}
                  </div>
                </div>

                {/* Expiration Toggle */}
                <div className="checkbox">
                  <input type="checkbox" name="hasExpiration" checked={courseData.has_expiration} onChange={handleChange} />
                  <label>Limit course access (expire after duration)</label>
                </div>
              </div>
            </div>

            {/* Curriculum Tab */}
            <div className={`accordion-item ${activeAccordion === 'curriculum' ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('curriculum')}>📚 Curriculum</div>
              <div className="accordion-content">
                <div className="floating-input">
                  <textarea
                    name="curriculum_intro"
                    value={courseData.curriculum_intro}
                    onChange={handleChange}
                    required
                    maxLength={400}
                  />
                  <label>Curriculum Introduction</label>
                  <div style={{ fontSize: '12px', color: '#888' }}>{(courseData.curriculum_intro || '').length}/400 characters</div>
                </div>
              </div>
            </div>

            {/* FAQ Tab */}
            <div className={`accordion-item ${activeAccordion === 'faq' ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('faq')}>❓ FAQ</div>
              <div className="accordion-content">
                <div className="floating-input">
                  <textarea
                    name="faqs"
                    value={courseData.faqs}
                    onChange={handleChange}
                    required
                  />
                  <label>Frequently Asked Questions</label>
                </div>
              </div>
            </div>

            {/* Media Tab */}
            <div className={`accordion-item ${activeAccordion === 'media' ? 'active' : ''}`}>
              <div className="accordion-title" onClick={() => toggleAccordion('media')}>🎥 Media Upload</div>
              <div className="accordion-content">
                <label>Upload Course Video</label>
                <input type="file" accept="video/*" onChange={handleVideoUpload} />
                {courseData.videoPreview && (
                  <video controls width="100%" style={{ marginTop: '10px', borderRadius: '8px' }}>
                    <source src={courseData.videoPreview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          </div> {/* End of .accordion */}

          {/* Submit Button */}
          <div className="button-wrapper">
            <button type="submit" className="submit-btn">📤 Publish Course</button>
          </div>
        </form>

        {/* Live Preview */}
        <div className="preview-section">
          <h3 style={{ marginBottom: '10px' }}>🧪 Live Course Preview</h3>
          <div className="course-card preview-card">
            {courseData.thumbnailPreview && <img src={courseData.thumbnailPreview} alt="Thumbnail" />}
            <h4>{courseData.title || 'Course Title'}</h4>
            <p>{courseData.duration || '--'} · {courseData.lessons || '--'} lessons</p>
            <p><strong>{courseData.price ? `$${courseData.price}` : 'Free'}</strong></p>
            <p>{courseData.description || 'Course description will appear here.'}</p>
            {tags.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                {tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Toast Notification */}
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
