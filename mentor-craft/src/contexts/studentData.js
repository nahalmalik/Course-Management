//src/contexts/studentData.js
import { useState, useEffect } from 'react';

// 🔧 Helper to enrich raw data

function enrichStudentData(data) {
  return data.map((student) => {
    const enrolled = student.enrolledCourses || [];
    const progress = student.courseProgress || {};

    const completedCourses = Object.keys(progress)
      .filter((id) => progress[id] === 100)
      .map(Number);

    const activeCourses = Object.keys(progress)
      .filter((id) => progress[id] > 0 && progress[id] < 100)
      .map(Number);

    return {
      ...student,
      totalEnrolledCourses: enrolled.length,
      completedCourses,
      activeCourses,
      profileCompletion: student.profileCompletion || 50,
      certificates: student.certificates || [],
      settings: student.settings || { notifications: true, darkMode: false },
      badges: student.achievements || []
    };
  });
}

// 📦 Raw Student Records
const rawData = [
  {
    id: 201,
    name: "Sara Khan",
    email: "sarakhan@gmail.com",
    password: '123456',
    role:"student",
    profileImage: "/images/sara.png",
    enrolledCourses: [1, 3],
    wishlist: [4, 6],
    courseProgress: { 1: 90, 3: 45 },
    reviews: [
      { courseId: 1, rating: 5, comment: "Great course!", date: "2025-07-01" }
    ],
    quizzes: [
      { id: "quiz1", courseId: 1, score: 85, total: 100, status: "Passed", date: "2025-07-01" }
    ],
    assignments: [
      { id: "assign1", courseId: 3, title: "React UI Task", status: "Graded", grade: "A", submittedAt: "2025-07-06" }
    ],
    enrollmentHistory: [
      { courseId: 1, enrolledAt: "2025-06-28", price: 0 },
      { courseId: 3, enrolledAt: "2025-06-30", price: 20 }
    ],
    achievements: [
      { title: "Fast Learner", date: "2025-07-10", badge: "/images/badges/fast.png" },
      { title: "UI Pro", date: "2025-07-12", badge: "/images/badges/ui-pro.png" }
    ],
    profileCompletion: 70
  },
  {
    id: 202,
    name: "Zain Raza",
    email: "zainraza@gmail.com",
    password: '123456',
    role:"student",
    profileImage: "/images/zain.png",
    enrolledCourses: [2, 4, 5],
    wishlist: [1],
    courseProgress: { 2: 100, 4: 30, 5: 20 },
    reviews: [
      { courseId: 4, rating: 4, comment: "Very informative.", date: "2025-07-05" }
    ],
    quizzes: [
      { id: "quiz2", courseId: 2, score: 70, total: 100, status: "Passed", date: "2025-07-05" }
    ],
    assignments: [
      { id: "assign2", courseId: 5, title: "API Integration", status: "Pending", grade: null, submittedAt: null }
    ],
    enrollmentHistory: [
      { courseId: 2, enrolledAt: "2025-07-01", price: 0 },
      { courseId: 4, enrolledAt: "2025-07-02", price: 15 },
      { courseId: 5, enrolledAt: "2025-07-04", price: 25 }
    ],
    achievements: [
      { title: "Quiz Master", date: "2025-07-06", badge: "/images/badges/quizmaster.png" }
    ],
    profileCompletion: 65
  },
  {
    id: 203,
    name: "Ayesha Malik",
    email: "ayesha.malik@example.com",
    password: '123456',
    role:"student",
    profileImage: "/images/ayesha.png",
    enrolledCourses: [1],
    wishlist: [2, 3],
    courseProgress: { 1: 100 },
    reviews: [
      { courseId: 1, rating: 5, comment: "Loved the practical examples.", date: "2025-06-25" }
    ],
    quizzes: [
      { id: "quiz3", courseId: 1, score: 90, total: 100, status: "Passed", date: "2025-06-20" }
    ],
    assignments: [
      { id: "assign3", courseId: 1, title: "Final Project", status: "Graded", grade: "A+", submittedAt: "2025-06-24" }
    ],
    enrollmentHistory: [
      { courseId: 1, enrolledAt: "2025-06-15", price: 0 }
    ],
    achievements: [
      { title: "Course Finisher", date: "2025-06-26", badge: "/images/badges/finisher.png" }
    ],
    profileCompletion: 85
  },
  {
    id: 204,
    name: "Bilal Ahmed",
    email: "bilal.ahmed@example.com",
    password: '123456',
    role:"student",
    profileImage: "/images/bilal.png",
    enrolledCourses: [2, 5],
    wishlist: [3],
    courseProgress: { 2: 0, 5: 0 },
    reviews: [
      { courseId: 2, rating: 3, comment: "Still starting out.", date: "2025-07-01" }
    ],
    quizzes: [
      { id: "quiz4", courseId: 5, score: 0, total: 100, status: "Not Attempted", date: null }
    ],
    assignments: [
      { id: "assign4", courseId: 2, title: "Intro Task", status: "Pending", grade: null, submittedAt: null }
    ],
    enrollmentHistory: [
      { courseId: 2, enrolledAt: "2025-06-20", price: 10 },
      { courseId: 5, enrolledAt: "2025-06-22", price: 25 }
    ],
    achievements: [
      { title: "Beginner Badge", date: "2025-06-21", badge: "/images/badges/beginner.png" }
    ],
    profileCompletion: 50
  },
  {
    id: 205,
    name: "Hira Fatima",
    email: "hira.fatima@example.com",
    password: '123456',
    role:"student",
    profileImage: "/images/hira.png",
    enrolledCourses: [6],
    wishlist: [1, 4],
    courseProgress: { 6: 10 },
    reviews: [
      { courseId: 6, rating: 4, comment: "Seems promising so far.", date: "2025-07-10" }
    ],
    quizzes: [
      { id: "quiz5", courseId: 6, score: 10, total: 100, status: "In Progress", date: "2025-07-10" }
    ],
    assignments: [
      { id: "assign5", courseId: 6, title: "First Submission", status: "Submitted", grade: "B", submittedAt: "2025-07-11" }
    ],
    enrollmentHistory: [
      { courseId: 6, enrolledAt: "2025-07-08", price: 30 }
    ],
    achievements: [
      { title: "Starter Award", date: "2025-07-12", badge: "/images/badges/starter.png" }
    ],
    profileCompletion: 60
  },
  {
    id: 206,
    name: "Hamza Shaikh",
    email: "hamza.shaikh@example.com",
    password: '123456',
    role:"student",
    profileImage: "/images/hamza.png",
    enrolledCourses: [3, 4],
    wishlist: [5],
    courseProgress: { 3: 75, 4: 20 },
    reviews: [
      { courseId: 3, rating: 4, comment: "Nice structure.", date: "2025-07-07" }
    ],
    quizzes: [
      { id: "quiz6", courseId: 3, score: 75, total: 100, status: "Passed", date: "2025-07-08" }
    ],
    assignments: [
      { id: "assign6", courseId: 3, title: "Layout Task", status: "Graded", grade: "A", submittedAt: "2025-07-09" }
    ],
    enrollmentHistory: [
      { courseId: 3, enrolledAt: "2025-07-01", price: 0 },
      { courseId: 4, enrolledAt: "2025-07-03", price: 15 }
    ],
    achievements: [
      { title: "Layout Champ", date: "2025-07-10", badge: "/images/badges/layout.png" }
    ],
    profileCompletion: 75
  }
];

// Load from localStorage if saved
const storedStudents = JSON.parse(localStorage.getItem("students"));
const allStudents = storedStudents || rawData;

// Save raw if not yet saved
if (!storedStudents) {
  localStorage.setItem("students", JSON.stringify(rawData));
}

// 🔄 Processed Student List
const studentData = enrichStudentData(allStudents);


// Get currently logged in student from localStorage
export function getCurrentStudent() {
  const savedEmail = localStorage.getItem("studentEmail");
  if (!savedEmail) return null;

  const students = JSON.parse(localStorage.getItem("students")) || [];
  return students.find((s) => s.email === savedEmail);
}

// Update current student in localStorage
export function updateCurrentStudent(updatedStudent) {
  const savedEmail = localStorage.getItem("studentEmail");
  if (!savedEmail) return;

  let students = JSON.parse(localStorage.getItem("students")) || [];
  students = students.map((s) =>
    s.email === savedEmail ? updatedStudent : s
  );

  localStorage.setItem("students", JSON.stringify(students));
}

export const updateStudentWishlist = (email, newWishlist) => {
  const allStudents = JSON.parse(localStorage.getItem('students')) || [];
  const index = allStudents.findIndex(s => s.email === email);
  if (index !== -1) {
    allStudents[index].wishlist = newWishlist;
    localStorage.setItem('students', JSON.stringify(allStudents));
    localStorage.setItem('studentEmail', email); // optional but safe to re-store
  }
};

// 🔄 React hook to use student state reactively
export function useStudent() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("studentEmail");
    if (email) {
      const stored = JSON.parse(localStorage.getItem("students")) || [];
      const found = stored.find((s) => s.email === email);
      setStudent(found || null);
    }
  }, []);

  return student;
}
export const studentRawData = rawData;

export default studentData;
