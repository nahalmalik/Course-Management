// courseStorage.js

import staticCourseData from '../components/courseData'; 
import courseData from '../components/courseData';
// =======================
// --- Core Course Storage
// =======================

export const getCourses = () => {
  try {
    const data = localStorage.getItem('courses');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to parse courses from localStorage:', err);
    return [];
  }
};

export const getCourseById = (id) => {
  return getCourses().find(c => c.id === parseInt(id)) || null;
};

export const saveCourse = (course) => {
  if (!course || typeof course.id !== 'number') {
    console.warn('❌ Invalid course object passed to saveCourse:', course);
    return;
  }

  const courses = getCourses();
  const existingIndex = courses.findIndex(c => c.id === course.id);

  if (existingIndex !== -1) {
    courses[existingIndex] = course;
  } else {
    courses.push(course);
  }

  localStorage.setItem('courses', JSON.stringify(courses));
};

// Explicit alias
export const updateCourse = saveCourse;

// ================================
// --- Add Dummy Analytics Support
// ================================

const addDummyAnalyticsForCourse = (course) => {
  if (!course || !course.instructorEmail || !course.title) return;

  const analytics = JSON.parse(localStorage.getItem('instructorAnalyticsData') || '[]');
  const alreadyExists = analytics.some(a =>
    a.instructorEmail === course.instructorEmail && a.course === course.title
  );
  if (alreadyExists) return;

  const months = ['May', 'June', 'July'];
  const newData = months.map(month => ({
    instructorEmail: course.instructorEmail,
    course: course.title,
    month,
    year: '2025',
    earnings: Math.floor(Math.random() * 300) + 100,
    enrollments: Math.floor(Math.random() * 20) + 5,
    quizAverage: Math.floor(Math.random() * 21) + 75 // 75–95
  }));

  const updated = [...analytics, ...newData];
  localStorage.setItem('instructorAnalyticsData', JSON.stringify(updated));
};

export const addNewCourse = (course) => {
  if (!course || typeof course.id !== 'number') return;
  const courses = getCourses();
  courses.push(course);
  localStorage.setItem('courses', JSON.stringify(courses));

  addDummyAnalyticsForCourse(course); // 👈 Auto-generate analytics
};

export const deleteCourse = (id) => {
  const updated = getCourses().filter(c => c.id !== id);
  localStorage.setItem('courses', JSON.stringify(updated));
};

export const clearAllCourses = () => {
  localStorage.removeItem('courses');
};

export const getAllCourseTitles = () => {
  return getCourses().map(c => c.title);
};

export const getCoursesByInstructor = (email) => {
  const localCourses = getCourses();
  const combined = [...localCourses];

  // Include courses from courseData if not already in localStorage
  courseData.forEach(cd => {
    const alreadyIncluded = combined.some(c => c.id === cd.id);
    if (!alreadyIncluded) {
      combined.push(cd);
    }
  });

  return combined.filter(c => c.instructorEmail === email);
};

// ==============================
// --- Extra Curriculum Data
// ==============================

export const getExtraData = (id) => {
  try {
    const extra = JSON.parse(localStorage.getItem('extraData') || '{}');
    return extra[id] || null;
  } catch (err) {
    console.error('❌ Failed to parse extraData from localStorage:', err);
    return null;
  }
};

export const saveExtraData = (id, data) => {
  try {
    const extra = JSON.parse(localStorage.getItem('extraData') || '{}');
    extra[id] = data;
    localStorage.setItem('extraData', JSON.stringify(extra));
  } catch (err) {
    console.error('❌ Failed to save extraData:', err);
  }
};

export const deleteExtraData = (id) => {
  try {
    const extra = JSON.parse(localStorage.getItem('extraData') || '{}');
    delete extra[id];
    localStorage.setItem('extraData', JSON.stringify(extra));
  } catch (err) {
    console.error('❌ Failed to delete extraData:', err);
  }
};

export const clearAllExtraData = () => {
  localStorage.removeItem('extraData');
};

// =======================
// --- Utility Helpers
// =======================

export const cleanYouTubeURL = (url) => {
  try {
    const parsed = new URL(url);
    const videoId = parsed.searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (parsed.pathname.includes("embed")) {
      return url;
    }
    return url;
  } catch {
    return url;
  }
};

export const normalizeCurriculumVideos = (curriculum = []) => {
  return curriculum.map(item => ({
    ...item,
    video: cleanYouTubeURL(item.video || "")
  }));
};

// ==============================
// --- Combined Course Access
// ==============================

export const getAllCourses = () => {
  const local = getCourses();
  const combined = [...staticCourseData, ...local];

  // Deduplicate by course.id
  const unique = Array.from(new Map(combined.map(c => [c.id, c])).values());
  return unique;
};

export const getAllCoursesByInstructor = (email) => {
  return getAllCourses().filter(c => c.instructorEmail?.toLowerCase() === email.toLowerCase());
};
