// assignmentUtils.js

// Get all assignment attempts from localStorage
export const getAssignmentAttempts = () => {
  const data = localStorage.getItem('assignmentAttempts');
  return data ? JSON.parse(data) : [];
};

// Save all assignment attempts to localStorage
export const saveAssignmentAttempts = (attempts) => {
  localStorage.setItem('assignmentAttempts', JSON.stringify(attempts));
};

// Update grade/status for a specific assignment attempt
export const updateAssignmentGrade = (id, grade) => {
  const attempts = getAssignmentAttempts();
  const updated = attempts.map(a =>
    a.id === id ? { ...a, grade, status: 'graded' } : a
  );
  saveAssignmentAttempts(updated);
};

// Returns new (unseen) submissions for this instructor
export const getUnseenInstructorAssignments = (instructorEmail) => {
  const attempts = getAssignmentAttempts();
  return attempts.filter(a => a.instructorEmail === instructorEmail && !a.seenByInstructor);
};

// Marks submissions as seen by instructor
export const markAssignmentsSeenByInstructor = (instructorEmail) => {
  const updated = getAssignmentAttempts().map(a =>
    a.instructorEmail === instructorEmail ? { ...a, seenByInstructor: true } : a
  );
  saveAssignmentAttempts(updated);
};

// Generate dummy assignment submissions for every course
export const generateSampleAssignmentAttemptsForAllCourses = (courseList) => {
  const existing = getAssignmentAttempts();
  if (existing.length > 0) return; // Prevent re-population

  const students = [
    { name: "Ahmed Ali", email: "ahmed@student.com" },
    { name: "Areeba Khan", email: "areeba@student.com" },
    { name: "Zainab Iqbal", email: "zainab@student.com" },
    { name: "Hamza Tariq", email: "hamza@student.com" },
    { name: "Bilal Saeed", email: "bilal@student.com" },
  ];

  const dummyFiles = [
    "/sample-submissions/assignment-react.pdf",
    "/sample-submissions/assignment-python.docx",
    "/sample-submissions/assignment-ui.zip",
    "/sample-submissions/assignment-data.csv"
  ];

  const dummyAttempts = [];

  courseList.forEach(course => {
    const instructorEmail = course.instructorEmail || "john@mentorcraft.com";

    // Add 2 dummy students per course
    for (let i = 0; i < 2; i++) {
      const student = students[Math.floor(Math.random() * students.length)];
      const file = dummyFiles[Math.floor(Math.random() * dummyFiles.length)];

      dummyAttempts.push({
        id: Date.now() + Math.floor(Math.random() * 10000),
        studentName: student.name,
        studentEmail: student.email,
        instructorEmail,
        course: course.title,
        assignmentTitle: `${course.title} - Final Assignment`,
        score: null,
        grade: null,
        status: "submitted",
        submissionFile: file,
        submittedAt: new Date().toISOString(),
        seenByInstructor: false
      });
    }
  });

  saveAssignmentAttempts(dummyAttempts);
};
