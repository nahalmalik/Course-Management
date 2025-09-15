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
// enrollmentUtils.js
export const fetchOrderReceipt = async (orderId) => {
  const token = localStorage.getItem("access_token"); // JWT
  const response = await fetch(`http://127.0.0.1:8000/api/receipt/${orderId}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error(await response.text());
    throw new Error("Failed to fetch receipt");
  }
  const data = await response.json();
  return data;
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