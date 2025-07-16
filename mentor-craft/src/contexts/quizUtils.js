// quizUtils.js

// Load all quiz attempts
export const getQuizAttempts = () => {
  const data = localStorage.getItem('quizAttempts');
  return data ? JSON.parse(data) : [];
};

// Save quiz attempts to localStorage
export const saveQuizAttempts = (attempts) => {
  localStorage.setItem('quizAttempts', JSON.stringify(attempts));
};

// Submit a new quiz attempt (by student)
export const submitQuizAttempt = (attempt) => {
  const existing = getQuizAttempts();
  const newAttempt = {
    id: Date.now(),
    ...attempt,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
    grade: null,
    seenByInstructor: false,
    seenByStudent: false,
  };
  saveQuizAttempts([newAttempt, ...existing]);
};

// Grade a quiz (by instructor)
export const updateQuizGrade = (id, grade) => {
  const updated = getQuizAttempts().map(a =>
    a.id === id
      ? {
          ...a,
          grade,
          status: 'graded',
          gradedAt: new Date().toISOString(),
          seenByStudent: false,
        }
      : a
  );
  saveQuizAttempts(updated);
};

// Show instructor notification for new submissions
export const getUnseenInstructorAttempts = (email) => {
  return getQuizAttempts().filter(
    a => a.instructorEmail === email && a.status === 'submitted' && !a.seenByInstructor
  );
};

// Mark new attempts as seen by instructor
export const markAttemptsSeenByInstructor = (email) => {
  const updated = getQuizAttempts().map(a =>
    a.instructorEmail === email
      ? { ...a, seenByInstructor: true }
      : a
  );
  saveQuizAttempts(updated);
};

// Show student all graded results
export const getGradedAttemptsByStudent = (studentEmail) => {
  return getQuizAttempts().filter(
    a => a.studentEmail === studentEmail && a.status === 'graded'
  );
};

// Mark quiz as seen by student
export const markQuizSeenByStudent = (studentEmail) => {
  const updated = getQuizAttempts().map(a =>
    a.studentEmail === studentEmail
      ? { ...a, seenByStudent: true }
      : a
  );
  saveQuizAttempts(updated);
};

// Sample static attempts (optional fallback)
export const sampleAttempts = [
  {
    id: 1001,
    studentName: "Ahmed Ali",
    studentEmail: "ahmed@student.com",
    course: "Complete React Bootcamp",
    quizTitle: "Complete React Bootcamp - Final Quiz",
    score: 85,
    grade: null,
    status: "submitted",
    submittedAt: "2025-07-14T10:00:00Z",
    instructorEmail: "john@mentorcraft.com",
    seenByInstructor: false,
    seenByStudent: false,
  },
  {
    id: 1002,
    studentName: "Areeba Khan",
    studentEmail: "areeba@student.com",
    course: "Python for Data Science",
    quizTitle: "Python for Data Science - Final Quiz",
    score: 92,
    grade: null,
    status: "submitted",
    submittedAt: "2025-07-15T12:00:00Z",
    instructorEmail: "ali@mentorcraft.com",
    seenByInstructor: false,
    seenByStudent: false,
  },
];

// Auto-generate dummy quiz attempts for all listed courses
export const generateSampleQuizAttemptsForAllCourses = (courseList) => {
  const existing = getQuizAttempts();
  if (existing.length > 0) return; // Prevent duplicates

  const students = [
    { name: 'Ahmed Ali', email: 'ahmed@student.com' },
    { name: 'Areeba Khan', email: 'areeba@student.com' },
    { name: 'Bilal Saeed', email: 'bilal@student.com' },
    { name: 'Zainab Iqbal', email: 'zainab@student.com' },
    { name: 'Hamza Tariq', email: 'hamza@student.com' },
  ];

  const attempts = [];

  courseList.forEach(course => {
    for (let i = 0; i < 2; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      attempts.push({
        id: Date.now() + Math.floor(Math.random() * 10000),
        studentName: student.name,
        studentEmail: student.email,
        instructorEmail: course.instructorEmail || "john@mentorcraft.com",
        course: course.title,
        quizTitle: `${course.title} - Final Quiz`,
        score: Math.floor(Math.random() * 21) + 80, // 80 to 100
        grade: null,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        seenByInstructor: false,
        seenByStudent: false,
      });
    }
  });

  saveQuizAttempts(attempts);
};
