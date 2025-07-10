// src/utils/enrollmentUtils.js

// Save a single course enrollment with user details
export const enrollCourse = ({ course, student, email }) => {
  const existing = JSON.parse(localStorage.getItem('enrolledCourses')) || [];

  const newRecord = {
    ...course,
    student,
    email,
    enrolledAt: new Date().toISOString(),
    orderId: `${course.id}-${Date.now()}`
  };

  const updated = [...existing, newRecord];
  localStorage.setItem('enrolledCourses', JSON.stringify(updated));
  localStorage.setItem('studentEmail', email); // Save current user's email
};

// Fetch all enrolled courses (optionally filtered by email)
export const getEnrollments = (email = null) => {
  const all = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
  if (email) {
    return all.filter(course => course.email === email);
  }
  return all;
};

// Fetch a single enrollment by order ID
export const getEnrollmentById = (orderId) => {
  const all = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
  return all.find(course => `${course.orderId}` === `${orderId}`);
};
