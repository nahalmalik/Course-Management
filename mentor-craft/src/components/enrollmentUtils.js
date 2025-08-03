// src/components/enrollmentUtils.js
import API from '../api';
import { getAccessToken } from '../contexts/authUtils';

// 🔁 Local-only enrollment (used for static/demo users)
export const enrollCourseLocal = ({ course, student, email }) => {
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

// ✅ Backend enrollment using real API (with token + screenshot)
export const enrollCourse = async ({ course, student, email, screenshot, orderId }) => {
  const formData = new FormData();
  formData.append("course", course.course_id || course.id);
  formData.append("student_name", student);
  formData.append("student_email", email);
  formData.append("order", orderId);
  if (screenshot) formData.append("payment_screenshot", screenshot);

  const response = await API.post(
    "users/enrollments/create/",
    formData,
    {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
export const fetchOrderReceipt = async (orderId) => {
  const token = getAccessToken();
  const response = await API.get(`users/receipt/${orderId}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const fetchInstructorSales = async () => {
  const token = getAccessToken();
  const response = await API.get("users/enrollments/instructor-sales/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


// Fetch all enrolled courses (for local fallback)
export const getEnrollments = (email = null) => {
  const all = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
  return email ? all.filter(course => course.email === email) : all;
};

export const getEnrollmentById = (orderId) => {
  const all = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
  return all.find(course => `${course.orderId}` === `${orderId}`);
};

export const fetchEnrollmentsFromBackend = async () => {
  const token = getAccessToken();
  const response = await API.get('users/enrollments/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};