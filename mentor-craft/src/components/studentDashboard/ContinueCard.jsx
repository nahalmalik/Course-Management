import React from 'react';


const ContinueCard = ({ course }) => {
  const progress = course.progress || 50; // placeholder

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        padding: '16px',
        transition: 'transform 0.3s',
        cursor: 'pointer',
        maxWidth: '280px',
        margin: 'auto',
        position: 'relative',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {/* Badge */}
      <span
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: '#3B82F6',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: '600',
        }}
      >
        Continue Learning
      </span>

      {/* Course Image */}
      <img
        src={course.image}
        alt={course.title}
        style={{
          width: '100%',
          height: '160px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '12px',
        }}
      />

      {/* Title */}
      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '8px',
          textAlign: 'center',
        }}
      >
        {course.title}
      </h3>

      {/* Meta Info */}
      <p
        style={{
          fontSize: '0.9rem',
          color: '#6B7280',
          marginBottom: '6px',
          textAlign: 'center',
        }}
      >
        {course.duration} · {course.lessons} lessons
      </p>

      {/* Price */}
      <p
        style={{
          fontWeight: 'bold',
          fontSize: '1rem',
          color: '#1E3A8A',
          textAlign: 'center',
        }}
      >
        {course.price}
      </p>

      {/* Progress Bar */}
      <div
        style={{
          height: '8px',
          backgroundColor: '#E5E7EB',
          borderRadius: '4px',
          overflow: 'hidden',
          marginTop: '12px',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: '#4EB4F6',
            height: '100%',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
};

export default ContinueCard;
