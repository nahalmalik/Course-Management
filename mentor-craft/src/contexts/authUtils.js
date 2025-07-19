import studentData from '../contexts/studentData'; // Make sure the path is correct

// --- Login User: Save full user info into localStorage
export const loginUser = (userType, email, name = '') => {
  const safeName = name || email?.split('@')[0] || 'Unknown';
  const user = { userType, email: email.toLowerCase(), name: safeName };

  // Save user object
  localStorage.setItem('user', JSON.stringify(user));

  // For backward compatibility
  if (userType === 'student') {
    localStorage.setItem('studentEmail', email.toLowerCase());
  }
};

// --- Logout User: Remove all session data
export const logoutUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('studentEmail'); // Cleanup legacy key if needed
};

// --- Get Current Logged-in User
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
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
  if (user?.userType === 'student') {
    return studentData.find(
      (student) => student.email.toLowerCase() === user.email.toLowerCase()
    );
  }
  return null;
};

// --- Patch existing user (for older accounts missing 'name')
export const ensureUserHasName = () => {
  const user = getCurrentUser();
  if (user && !user.name) {
    user.name = user.email?.split('@')[0] || 'Unknown';
    localStorage.setItem('user', JSON.stringify(user));
  }
};
