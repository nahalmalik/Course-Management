import staticCourseData from '../components/courseData';
import courseData from '../components/courseData';
import { getAccessToken } from './authUtils';
// =======================
// --- Core Course Storage
// =======================

// Helper to get courses from localStorage
const getCoursesFromStorage = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('courses'));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

// Save to localStorage
const saveCoursesToStorage = (courses) => {
  localStorage.setItem('courses', JSON.stringify(courses));
};

// ✅ Get all courses (backend + fallback to localStorage + mock)

export async function getCourses() {
  try {
    const token = getAccessToken(); // ✅ get token

    const res = await fetch("http://localhost:8000/api/courses/", {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ pass token
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error("Failed to fetch courses from backend");

    const backendCourses = await res.json();

    console.log("✅ Fetched backend courses:", backendCourses);

    // Combine backend + static
    const combinedCourses = [...backendCourses, ...staticCourseData];

    // Optionally cache in localStorage
    saveCoursesToStorage(combinedCourses);

    return combinedCourses;
  } catch (err) {
    console.warn("❌ Backend fetch failed, using fallback:", err);

    const fallback = getCoursesFromStorage();

    if (fallback.length > 0) {
      console.log("✅ Loaded courses from localStorage:", fallback);
      return fallback;
    }

    console.log("✅ Loaded static mock courses only");
    return staticCourseData;
  }
}


// ✅ Get a single course by ID
export async function getCourseById(id) {
  try {
    const res = await fetch(`http://localhost:8000/api/courses/${id}/`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Error fetching course by ID", err);
    return null;
  }
}

// ✅ Save/update course in localStorage
export async function saveCourse(course) {
  if (!course || typeof course.id !== 'number') {
    console.warn('❌ Invalid course object passed to saveCourse:', course);
    return;
  }

  const courses = getCoursesFromStorage();
  const index = courses.findIndex(c => c.id === course.id);

  if (index !== -1) {
    courses[index] = course;
  } else {
    courses.push(course);
  }

  saveCoursesToStorage(courses);
}

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

export async function addNewCourse(course) {
  if (!course || typeof course.id !== 'number') return;
  const current = getCoursesFromStorage();
  current.push(course);
  saveCoursesToStorage(current);
  addDummyAnalyticsForCourse(course);
}

export async function deleteCourse(id) {
  const current = getCoursesFromStorage();
  const updated = current.filter(c => c.id !== id);
  saveCoursesToStorage(updated);
}

export function clearAllCourses() {
  localStorage.removeItem('courses');
}

export async function getAllCourseTitles() {
  const all = await getCourses();
  return all.map(c => c.title);
}

export const getCoursesByInstructor = async (email) => {
  const allCourses = await getCourses();
  return allCourses.filter(course => course.instructorEmail === email);
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

export async function getAllCourses() {
  const fromBackendOrStorage = await getCourses();
  const combined = [...staticCourseData, ...fromBackendOrStorage];

  const unique = Array.from(new Map(combined.map(c => [c.id, c])).values());
  return unique;
}

export async function getAllCoursesByInstructor(email) {
  const all = await getAllCourses();
  return all.filter(c => c.instructorEmail?.toLowerCase() === email.toLowerCase());
}
export async function uploadLecture(courseId, lecture) {
  const token = getAccessToken();
  const formData = { ...lecture, course: courseId };

  const res = await fetch("http://localhost:8000/api/courses/lectures/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Failed to upload lecture");
  return await res.json();
}

export async function uploadNote(courseId, note) {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append("course", courseId);
  formData.append("title", note.title);
  formData.append("description", note.description);
  formData.append("file", note.file);

  const res = await fetch("http://localhost:8000/api/courses/notes/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload note");
  return await res.json();
}
