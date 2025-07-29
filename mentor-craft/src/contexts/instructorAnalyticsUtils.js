import courseData from '../components/courseData';
import { getCourses } from './courseStorage';

const API_BASE = 'http://localhost:8000/api/instructor';

/**
 * 🔁 Sync backend analytics for real instructors
 */
export const syncInstructorAnalytics = async () => {
  const token = localStorage.getItem("accessToken");
  await fetch(`${API_BASE}/analytics/sync/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

/**
 * 📊 Fetch backend analytics (optional: filter by course ID)
 */
export const getInstructorAnalyticsFromBackend = async () => {
  const token = localStorage.getItem("accessToken");


  if (!token) {
    console.error("❌ Token not found in localStorage");
    return [];
  }

  try {
    const res = await fetch("http://localhost:8000/api/instructor/analytics/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error("❌ API error status:", res.status);
      const error = await res.json();
      console.error("❌ API error details:", error);
      return [];
    }

    const data = await res.json();
    console.log("✅ Data from backend analytics:", data);
    return data;
  } catch (err) {
    console.error("❌ Fetch error:", err);
    return [];
  }
};


/**
 * 🔢 Generate dummy monthly stats for static instructors
 */
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

/**
 * 💾 Sync fake analytics for static instructors (stored in localStorage)
 */
export const syncStaticInstructorAnalytics = async () => {
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

/**
 * 📦 Get static (fake) analytics from localStorage by instructor email
 */
export const getStaticInstructorAnalytics = (email) => {
  const data = JSON.parse(localStorage.getItem('instructorAnalyticsData') || '[]');
  return data.filter(a => a.instructorEmail === email);
};
