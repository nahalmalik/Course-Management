// components/studentDashboard/WelcomeDashboard.js
import React from 'react';
import courseData from '../../components/courseData';
import { useNavigate } from 'react-router-dom';

const WelcomeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-dashboard">
      <img src="/images/welcome.png" alt="Welcome" className="welcome-illustration" />
      <h2>Welcome to Mentor Craft! 🎉</h2>
      <p>We're excited to have you here. Start your journey by exploring our top-rated courses below.</p>

      <div className="featured-courses">
        {courseData.slice(0, 3).map((course) => (
          <div className="featured-course-card" key={course.id}>
            <img src={course.image} alt={course.title} className="featured-course-thumb" />
            <div className="featured-course-info">
              <h4>{course.title}</h4>
              <p className="featured-course-instructor">👨‍🏫 {course.instructor}</p>
              <p className="featured-course-price">{course.price}</p>
              <button className="buy-now-btn" onClick={() => navigate(`/courses/${course.id}`)}>
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="browse-courses-btn" onClick={() => navigate("/courses")}>Browse All Courses</button>
    </div>
  );
};

export default WelcomeDashboard;
