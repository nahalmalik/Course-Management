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

export const addNewCourse = (course) => {
  if (!course || typeof course.id !== 'number') return;
  const courses = getCourses();
  courses.push(course);
  localStorage.setItem('courses', JSON.stringify(courses));
};

export const deleteCourse = (id) => {
  const updated = getCourses().filter(c => c.id !== id);
  localStorage.setItem('courses', JSON.stringify(updated));
};

export const clearAllCourses = () => {
  localStorage.removeItem('courses');
};

// Get all course titles
export const getAllCourseTitles = () => {
  return getCourses().map(c => c.title);
};

// Get courses for specific instructor
export const getCoursesByInstructor = (email) => {
  return getCourses().filter(c => c.instructorEmail === email);
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
