// Save the logged-in user (type = 'student' or 'instructor') and their email
export const loginUser = (userType, email) => {
  localStorage.setItem('user', JSON.stringify({ userType, email }));
};

// Remove user from localStorage
export const logoutUser = () => {
  localStorage.removeItem('user');
};

// Get current logged-in user object
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Utility to check if current user is an instructor
export const isInstructor = () => {
  const user = getCurrentUser();
  return user?.userType === 'instructor';
};

// Utility to check if current user is a student
export const isStudent = () => {
  const user = getCurrentUser();
  return user?.userType === 'student';
};
