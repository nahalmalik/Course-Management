import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../contexts/authUtils';
import { getCoursesByInstructor } from '../contexts/courseStorage';
import { syncInstructorAnalytics, getInstructorAnalytics } from '../contexts/instructorAnalyticsUtils';
import EarningsChart from '../components/charts/EarningsChart';
import QuizPerformanceChart from '../components/charts/QuizPerformanceChart';
import EnrollmentChart from '../components/charts/EnrollmentChart';
import CourseComparison from '../components/charts/CourseComparison';
import { Download } from 'lucide-react';
import '../styles/InstructorAnalytics.css';

const InstructorEarnings = () => {
  const [analytics, setAnalytics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const current = getCurrentUser();
    setUser(current);

    if (current) {
      syncInstructorAnalytics(); // 👈 Auto-generate missing analytics
      const instructorCourses = getCoursesByInstructor(current.email);
      setCourses(instructorCourses);

      const data = getInstructorAnalytics(current.email);
      setAnalytics(data);
    }
  }, []);

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const filteredData =
    selectedCourse === 'All'
      ? analytics
      : analytics.filter((d) => d.course === selectedCourse);

  if (!user) {
    return <div className="analytics-container">Loading user data...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="analytics-welcome">
        <h2>Welcome to Instructor Analytics</h2>
        <p>Once you create a course, you’ll be able to track your:</p>
        <ul>
          <li>📊 Earnings (Line + Bar graphs)</li>
          <li>🧮 Student Enrollments</li>
          <li>📝 Quiz Performance</li>
          <li>📈 Course Comparisons</li>
        </ul>
        <a href="/instructor/create-course" className="create-btn">
          Create Your First Course
        </a>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Instructor Analytics</h2>
        <select className="course-select" value={selectedCourse} onChange={handleCourseChange}>
          <option value="All">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.title}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="chart-grid">
        {[
          { title: 'Earnings Overview', component: <EarningsChart data={filteredData} /> },
          { title: 'Quiz Performance', component: <QuizPerformanceChart data={filteredData} /> },
          { title: 'Enrollments', component: <EnrollmentChart data={filteredData} /> },
          {
            title: 'Course Comparison',
            component: <CourseComparison data={filteredData} />,
            full: true,
          },
        ].map(({ title, component, full }, i) => (
          <div className={`chart-card ${full ? 'full-width' : ''}`} key={i}>
            <div className="chart-header">
              <h3>{title}</h3>
              <button onClick={() => window.print()} title="Export PDF">
                <Download size={18} />
              </button>
            </div>
            {component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorEarnings;
