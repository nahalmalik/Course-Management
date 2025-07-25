import axios from 'axios';
import studentData from './studentData';
import instructorData from '../components/instructorData';
import { studentRawData } from './studentData';

export const loginUser = async (role, email, password) => {
  try {
    const url = `http://localhost:8000/api/users/login/${role}/`;
    const response = await axios.post(url, { email, password });

    // Backend login success
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data.user;
  } catch (err) {
    const status = err?.response?.status;

    if (status === 400 || status === 401) {
      const dataset =
  role === 'student'
    ? studentRawData
    : Object.values(instructorData);

      console.warn("Backend login failed. Trying fallback...");
      console.log("Role:", role, "Email:", email, "Password:", password);
      console.log("Dataset preview:", dataset?.[0]);

      if (!Array.isArray(dataset)) {
        console.error("Fallback dataset is invalid:", dataset);
        throw { detail: "Fallback failed: Dataset invalid." };
      }

      const matched = dataset.find(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase() &&
          user.password === password
      );

      if (matched) {
        const localUser = {
          name: matched.name,
          email: matched.email,
          role,
          source: 'local',
        };

        localStorage.setItem('user', JSON.stringify(localUser));
        if (role === 'student') {
          localStorage.setItem('studentEmail', matched.email);
        }

        return localUser;
      }
    }

    throw err?.response?.data || { detail: 'Login failed' };
  }
};


// ✅ Logout user
export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('studentEmail');
};

// ✅ Get current logged-in user info
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  try {
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};


// ✅ Check if user is Instructor
export const isInstructor = () => {
  const user = getCurrentUser();
  return user?.role === 'instructor';
};

// ✅ Check if user is Student
export const isStudent = () => {
  const user = getCurrentUser();
  return user?.role === 'student';
};

// ✅ Get access token for authenticated API requests
export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// ✅ OPTIONAL: Refresh token logic (if needed later)
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axios.post('http://localhost:8000/api/users/token/refresh/', {
      refresh: refreshToken,
    });

    localStorage.setItem('accessToken', response.data.access);
    return response.data.access;
  } catch (err) {
    logoutUser();
    throw err;
  }
};
