import studentData from '../contexts/studentData'; // Make sure the path is correct

// ✅ Save current user on login
export const loginUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};


// ✅ Remove user on logout
export const logoutUser = () => {
  localStorage.removeItem('user');
};


// ✅ Get the current logged-in user
export const getCurrentUser = () => {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
};

// --- Check if user is Instructor
export const isInstructor = () => {
  const user = getCurrentUser();
  return user?.userType === 'instructor';
};

// --- Check if user is Student
export const isStudent = () => {
  const user = getCurrentUser();
  return user?.userType === 'student';
};

// --- Get Full Student Object from studentData.js
export const getCurrentStudent = () => {
  const user = getCurrentUser();
  if (!user || user.userType !== 'student' || !user.email) return null;

  const email = user.email.toLowerCase();
  return studentData.find(student => student.email.toLowerCase() === email) || null;
};

// --- Patch existing user (for older accounts missing 'name')
export const ensureUserHasName = () => {
  const user = getCurrentUser();
  if (user && !user.name) {
    user.name = user.email?.split('@')[0] || 'Unknown';
    localStorage.setItem('user', JSON.stringify(user));
  }
};
