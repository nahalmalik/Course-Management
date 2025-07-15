// --- Login User: Save full user info into localStorage
export const loginUser = (userType, email, name = '') => {
  const safeName = name || email?.split('@')[0] || 'Unknown';
  const user = { userType, email, name: safeName };
  localStorage.setItem('user', JSON.stringify(user));
};

// --- Logout User: Remove from localStorage
export const logoutUser = () => {
  localStorage.removeItem('user');
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

// --- Patch existing user (for older accounts missing 'name')
export const ensureUserHasName = () => {
  const user = getCurrentUser();
  if (user && !user.name) {
    user.name = user.email?.split('@')[0] || 'Unknown';
    localStorage.setItem('user', JSON.stringify(user));
  }
};
