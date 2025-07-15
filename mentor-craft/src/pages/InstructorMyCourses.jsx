import React, { useEffect, useState } from 'react';
import { getCurrentUser, logoutUser } from '../contexts/authUtils';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../contexts/courseStorage';
import courseData from '../components/courseData';
import '../styles/InstructorCourses.css';
import NoCourse from "../assets/no-courses.jpg";

const InstructorMyCourses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [viewType, setViewType] = useState('grid');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.userType !== 'instructor') {
      navigate('/');
      return;
    }
    setUser(currentUser);

    // Get all courses and filter by instructorEmail
    const dynamicCourses = getCourses(); 
    const allCourses = [...dynamicCourses, ...courseData];
    const instructorEmail = currentUser.email;
    const instructorName = currentUser.name || instructorEmail.split('@')[0] || 'You';
    const filtered = allCourses.filter(course =>
  course.instructorEmail === instructorEmail ||
  course.instructor === instructorName
);
    setMyCourses(filtered);
  }, [navigate]);

  const renderImage = (course) =>
    course.thumbnail?.startsWith('data:image')
      ? course.thumbnail
      : course.image || course.thumbnail;

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
