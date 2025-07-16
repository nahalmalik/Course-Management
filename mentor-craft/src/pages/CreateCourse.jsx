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
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    discountPrice: '',
    duration: '',
    lessons: '',
    thumbnail: '',
    curriculumIntro: '',
    faq: '',
    mediaLink: '',
    level: '',
    language: '',
    seoTitle: '',
    seoKeywords: '',
    seoDescription: '',
    hasExpiration: false
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
    const { name, value, type, checked } = e.target;
    setCourseData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
      instructorEmail,
      rating: 4.8,
      students: 0,
      lessons: courseData.lessons || 0,
      duration: courseData.duration || 'N/A',
      price: courseData.price || 'Free',
      discountPrice: courseData.discountPrice,
      image: courseData.thumbnail || '/images/placeholder-course.jpg',
      category: courseData.category || 'General',
      curriculumIntro: courseData.curriculumIntro,
      faq: courseData.faq,
      mediaLink: courseData.mediaLink,
      level: courseData.level,
      language: courseData.language,
      tags,
      seo: {
        title: courseData.seoTitle,
        keywords: courseData.seoKeywords,
        description: courseData.seoDescription
      },
      hasExpiration: courseData.hasExpiration
    };

    addNewCourse(newCourse);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      navigate('/instructor/my-courses');
    }, 2000);
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(prev => (prev === section ? '' : section));
  };

  return (
    <div className="instructor-dashboard">
      <main className="main-section">
            {/* Course Upload Tips */}
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
      <div style={{ fontSize: '12px', color: '#888' }}>{courseData.description.length}/300 characters</div>
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
      <input type="text" name="discountPrice" value={courseData.discountPrice} onChange={handleChange} />
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

    <div className="floating-input">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <label style={{ top: '-10px', fontSize: '13px', color: '#777' }}>Upload Course Thumbnail</label>
    </div>

    {courseData.thumbnail && (
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <img src={courseData.thumbnail} alt="Thumbnail Preview" style={{ width: '220px', borderRadius: '8px' }} />
      </div>
    )}

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
      <input type="checkbox" name="hasExpiration" checked={courseData.hasExpiration} onChange={handleChange} />
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
        name="curriculumIntro"
        value={courseData.curriculumIntro}
        onChange={handleChange}
        required
        maxLength={400}
      />
      <label>Curriculum Introduction</label>
      <div style={{ fontSize: '12px', color: '#888' }}>{courseData.curriculumIntro.length}/400 characters</div>
    </div>
  </div>
</div>
{/* FAQ Tab */}
<div className={`accordion-item ${activeAccordion === 'faq' ? 'active' : ''}`}>
  <div className="accordion-title" onClick={() => toggleAccordion('faq')}>❓ FAQ</div>
  <div className="accordion-content">
    <div className="floating-input">
      <textarea name="faq" value={courseData.faq} onChange={handleChange} required />
      <label>Frequently Asked Questions</label>
    </div>
  </div>
</div>
{/* Media Link Tab */}
<div className={`accordion-item ${activeAccordion === 'media' ? 'active' : ''}`}>
  <div className="accordion-title" onClick={() => toggleAccordion('media')}>🎥 Media</div>
  <div className="accordion-content">
    <div className="floating-input">
      <input
        type="text"
        name="mediaLink"
        value={courseData.mediaLink}
        onChange={handleChange}
        placeholder="https://www.youtube.com/watch?v=..."
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
{/* SEO Tab */}
<div className={`accordion-item ${activeAccordion === 'seo' ? 'active' : ''}`}>
  <div className="accordion-title" onClick={() => toggleAccordion('seo')}>📈 SEO Settings</div>
  <div className="accordion-content">
    <div className="floating-input">
      <input
        type="text"
        name="seoTitle"
        value={courseData.seoTitle}
        onChange={handleChange}
        placeholder="Optimized course title"
      />
      <label>SEO Title</label>
    </div>

    <div className="floating-input">
      <input
        type="text"
        name="seoKeywords"
        value={courseData.seoKeywords}
        onChange={handleChange}
        placeholder="react, programming, web dev"
      />
      <label>SEO Keywords</label>
    </div>

    <div className="floating-input">
      <textarea
        name="seoDescription"
        value={courseData.seoDescription}
        onChange={handleChange}
        placeholder="Write a short meta description for SEO"
      />
      <label>SEO Meta Description</label>
    </div>
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
            {courseData.thumbnail && <img src={courseData.thumbnail} alt="Thumbnail" />}
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
