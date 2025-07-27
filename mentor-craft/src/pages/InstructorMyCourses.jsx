import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../contexts/authUtils';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../contexts/courseStorage'; // ✅ Import async getter
import courseData from '../components/courseData';
import '../styles/InstructorCourses.css';
import NoCourse from "../assets/no-courses.jpg";

const InstructorMyCourses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [viewType, setViewType] = useState('grid');
  const [loading, setLoading] = useState(true);

  const renderImage = (course) =>
    course.thumbnail?.startsWith('data:image')
      ? course.thumbnail
      : course.image || course.thumbnail;

  useEffect(() => {
    const loadCourses = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);

      if (currentUser?.role === 'instructor') {
        const staticCourses = courseData.filter(
          c => c.instructorEmail === currentUser.email
        );

        let dynamicCourses = [];
        try {
          const fetched = await getCourses();
          dynamicCourses = fetched.filter(
            c => c.instructor_email === currentUser.email
          );
        } catch (err) {
          console.error("❌ Error fetching courses:", err);
        }

        setMyCourses([...dynamicCourses, ...staticCourses]);
      }

      setLoading(false);
    };

    loadCourses();
  }, []);

  if (loading) return null;

  return (
    <div className="instructor-dashboard">
      <main className="main-section">
        <div className="my-courses-header">
          <h2>📚 My Courses</h2>
          {myCourses.length > 0 && (
            <div className="view-toggle">
              <button className={viewType === 'grid' ? 'active' : ''} onClick={() => setViewType('grid')}>🔳 Grid</button>
              <button className={viewType === 'list' ? 'active' : ''} onClick={() => setViewType('list')}>📄 List</button>
            </div>
          )}
        </div>

        {myCourses.length === 0 ? (
          <div className="empty-state">
            <img src={NoCourse} alt="No Courses" />
            <h3>No courses yet!</h3>
            <p>You haven’t published any courses yet. Start by creating your first one.</p>
            <button className="create-course-btn" onClick={() => navigate('/instructor/create-course')}>
              ➕ Create Course
            </button>
          </div>
        ) : viewType === 'grid' ? (
          <div className="courses-grid">
            {myCourses.map(course => (
              <div key={course.id} className="course-card" onClick={() => navigate(`/instructor/courses/${course.id}`)}>
                <img src={renderImage(course)} alt={course.title} />
                <h4>{course.title}</h4>
                <p>{course.duration} · {course.lessons} lessons</p>
                <p><strong>{course.price}</strong></p>
              </div>
            ))}
          </div>
        ) : (
          <div className="courses-list">
            {myCourses.map(course => (
              <div key={course.id} className="course-list-item" onClick={() => navigate(`/instructor/courses/${course.id}`)}>
                <img src={renderImage(course)} alt={course.title} />
                <div className="course-info">
                  <h4>{course.title}</h4>
                  <p>{course.duration} · {course.lessons} lessons</p>
                  <p><strong>{course.price}</strong></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorMyCourses;
