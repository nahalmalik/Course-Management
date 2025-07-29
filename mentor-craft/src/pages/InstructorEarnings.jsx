import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../contexts/authUtils';
import {
  syncInstructorAnalytics,
  getInstructorAnalyticsFromBackend,
  syncStaticInstructorAnalytics,
  getStaticInstructorAnalytics,
} from '../contexts/instructorAnalyticsUtils';

import { getCourses } from '../contexts/courseStorage';
import courseData from '../components/courseData';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      if (!currentUser) return;

      let dynamicCourses = [];
      let staticCourses = [];

      try {
        const fetched = await getCourses();
        dynamicCourses = fetched.filter(c => c.instructor_email === currentUser.email);

      } catch (err) {
        console.error('❌ Failed to fetch backend courses:', err);
      }

      staticCourses = courseData.filter(
        c => c.instructorEmail === currentUser.email
      );

      const allCourses = [...dynamicCourses, ...staticCourses];
      setCourses(allCourses);

      let analyticsData = [];

      if (staticCourses.length > 0) {
        await syncStaticInstructorAnalytics();
        analyticsData = getStaticInstructorAnalytics(currentUser.email);
      } else if (dynamicCourses.length > 0) {
        await syncInstructorAnalytics();
        analyticsData = await getInstructorAnalyticsFromBackend();
      }

      setAnalytics(analyticsData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const filteredData =
    selectedCourse === 'All'
      ? analytics
      : analytics.filter((d) => d.course === selectedCourse);

  // DEBUG logs
  console.log('👤 User:', user?.email);
  console.log('📘 Courses:', courses);
  console.log('📊 Analytics sample:', analytics?.[0]);

  if (loading || !user) {
    return <div className="analytics-container">Loading instructor data...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="analytics-welcome">
        <h2>👋 Welcome to Instructor Analytics</h2>
        <p>Once you create a course, you’ll be able to track your:</p>
        <ul>
          <li>📊 Earnings</li>
          <li>🧮 Enrollments</li>
          <li>📝 Quiz Performance</li>
          <li>📈 Course Comparisons</li>
        </ul>
        <a href="/instructor/create-course" className="create-btn">
          ➕ Create Your First Course
        </a>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Instructor Analytics</h2>
        <select
          className="course-select"
          value={selectedCourse}
          onChange={handleCourseChange}
        >
          <option value="All">All Courses</option>
          {courses.map((c, i) => (
            <option key={i} value={c.title}>
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
