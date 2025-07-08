// src/utils/enrollmentUtils.js
export const getEnrolledCourses = () => {
  const stored = localStorage.getItem("enrolledCourses");
  return stored ? JSON.parse(stored) : [];
};

export const enrollCourse = (course) => {
  const current = getEnrolledCourses();
  const updated = [...current, course];
  localStorage.setItem("enrolledCourses", JSON.stringify(updated));
};
