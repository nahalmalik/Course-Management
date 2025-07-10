// src/components/enrollmentUtils.js

export const enrollCourse = ({ course, student, email, enrolledAt }) => {
  const existing = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
  const newRecord = {
    ...course,
    student,
    email,
    enrolledAt,
    id: `${course.id}-${Date.now()}` // unique enrollment ID
  };
  localStorage.setItem("enrolledCourses", JSON.stringify([...existing, newRecord]));
};
