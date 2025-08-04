import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyCourses = ({ courses }) => {
  const navigate = useNavigate();

  const renderImage = (course) =>
    course.thumbnail?.startsWith('data:image')
      ? course.thumbnail
      : course.image || course.thumbnail;

  return (
    <div style={{ background: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 6px 15px rgba(0,0,0,0.06)' }}>
      <h3 style={{ marginBottom: 20 }}>My Courses</h3>

      <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 20,
    justifyContent: 'center',         // 👈 prevents full-stretch
    alignItems: 'start'
  }}
>

        {courses.map(course => (
          <div
            key={course.id}
            style={{
              borderRadius: 10,
              padding: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/instructor/courses/${course.id}`)}
          >
            <img
              src={renderImage(course)}
              alt={course.title}
              style={{
                width: '100%',
                height: 120,
                objectFit: 'cover',
                borderRadius: 6,
                marginBottom: 10
              }}
            />
            <h4>{course.title}</h4>
            <p style={{ fontSize: 14 }}>{course.duration} · {course.lessons} lessons</p>
            <p style={{ fontWeight: 'bold' }}>{course.price}</p>
          </div>
        ))}
      </div>

      {courses.length > 6 && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={() => navigate('/instructor/mycourses')}
            style={{
              background: '#1E3A8A',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              fontWeight: 'bold',
              borderRadius: 6
            }}
          >
            👀 View All Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
