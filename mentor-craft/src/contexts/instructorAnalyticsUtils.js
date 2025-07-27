import courseData from '../components/courseData';
import { getCourses } from './courseStorage';

// Generate dummy entries for May, June, July
const generateMonthlyStats = (instructorEmail, course) => {
  const months = ['May', 'June', 'July'];
  return months.map(month => ({
    instructorEmail,
    course: course.title,
    month,
    year: '2025',
    earnings: Math.floor(Math.random() * 300) + 100,
    enrollments: Math.floor(Math.random() * 20) + 5,
    quizAverage: Math.floor(Math.random() * 21) + 75 // 75–95%
  }));
};

// 🔧 Fix: async/await getCourses()
export const syncInstructorAnalytics = async () => {
  const existingData = JSON.parse(localStorage.getItem('instructorAnalyticsData') || '[]');
  const dynamicCourses = await getCourses();
  const allCourses = [...courseData, ...dynamicCourses];

  let updatedData = [...existingData];

  allCourses.forEach(course => {
    if (!course.instructorEmail || !course.title) return;

    const alreadyExists = existingData.some(
      entry =>
        entry.instructorEmail === course.instructorEmail &&
        entry.course === course.title
    );

    if (!alreadyExists) {
      const newEntries = generateMonthlyStats(course.instructorEmail, course);
      updatedData = [...updatedData, ...newEntries];
    }
  });

  localStorage.setItem('instructorAnalyticsData', JSON.stringify(updatedData));
};

// 🔧 Fix: read analytics data from localStorage directly
export const getInstructorAnalytics = (email) => {
  const data = JSON.parse(localStorage.getItem('instructorAnalyticsData') || '[]');
  return data.filter(a => a.instructorEmail === email);
};
