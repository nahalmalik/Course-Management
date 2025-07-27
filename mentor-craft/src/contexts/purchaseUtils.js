const STORAGE_KEY = 'purchases';

// --- Full static purchase data for students
const defaultPurchases = [
  // --- Sara Khan ---
  {
    id: 101,
    studentEmail: "sarakhan@gmail.com",
    studentName: "Sara Khan",
    courseId: 1,
    courseTitle: "Complete React Bootcamp",
    instructorName: "John Doe",
    instructorEmail: "john@mentorcraft.com",
    price: "$0",
    purchasedAt: "2025-06-28T10:00:00",
    thumbnail: "/images/react-course.jpg",
    rating: 5.0,
  },
  {
    id: 102,
    studentEmail: "sarakhan@gmail.com",
    studentName: "Sara Khan",
    courseId: 4,
    courseTitle: "Digital Marketing Mastery",
    instructorName: "Sara Ahmed",
    instructorEmail: "sara@mentorcraft.com",
    price: "$20",
    purchasedAt: "2025-06-30T14:30:00",
    thumbnail: "/images/js-advanced.jpg",
    rating: 4.5,
  },

  // --- Zain Ali ---
  {
    id: 201,
    studentEmail: "zainali@gmail.com",
    studentName: "Zain Ali",
    courseId: 3,
    courseTitle: "Advanced CSS Animations",
    instructorName: "Emily Carter",
    instructorEmail: "emily@mentorcraft.com",
    price: "$29",
    purchasedAt: "2025-06-22T11:45:00",
    thumbnail: "/images/css-course.jpg",
    rating: 4.8,
  },
  {
    id: 202,
    studentEmail: "zainali@gmail.com",
    studentName: "Zain Ali",
    courseId: 5,
    courseTitle: "Python for Data Science",
    instructorName: "Ali Raza",
    instructorEmail: "ali@mentorcraft.com",
    price: "$40",
    purchasedAt: "2025-06-25T09:15:00",
    thumbnail: "/images/python-data.jpg",
    rating: 4.7,
  },

  // --- Ayesha Noor ---
  {
    id: 301,
    studentEmail: "ayeshasoft@gmail.com",
    studentName: "Ayesha Noor",
    courseId: 7,
    courseTitle: "Mastering JavaScript ES6+",
    instructorName: "Mike Johnson",
    instructorEmail: "mike@mentorcraft.com",
    price: "$39",
    purchasedAt: "2025-06-18T13:20:00",
    thumbnail: "/images/js-es6.jpg",
    rating: 4.9,
  },
  {
    id: 302,
    studentEmail: "ayeshasoft@gmail.com",
    studentName: "Ayesha Noor",
    courseId: 10,
    courseTitle: "UI/UX Design with Figma",
    instructorName: "Nora James",
    instructorEmail: "nora@mentorcraft.com",
    price: "$35",
    purchasedAt: "2025-06-20T10:00:00",
    thumbnail: "/images/figma-course.jpg",
    rating: 4.6,
  },

  // --- Bilal Ahmed ---
  {
    id: 401,
    studentEmail: "bilaltech@gmail.com",
    studentName: "Bilal Ahmed",
    courseId: 2,
    courseTitle: "Fullstack Web Development",
    instructorName: "John Doe",
    instructorEmail: "john@mentorcraft.com",
    price: "$59",
    purchasedAt: "2025-06-12T12:00:00",
    thumbnail: "/images/fullstack.jpg",
    rating: 4.7,
  },
  {
    id: 402,
    studentEmail: "bilaltech@gmail.com",
    studentName: "Bilal Ahmed",
    courseId: 6,
    courseTitle: "WordPress Theme Development",
    instructorName: "Ali Raza",
    instructorEmail: "ali@mentorcraft.com",
    price: "$25",
    purchasedAt: "2025-06-15T09:30:00",
    thumbnail: "/images/wordpress.jpg",
    rating: 4.4,
  }
];

// --- Get all purchase records
export const getPurchases = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPurchases));
    return defaultPurchases;
  }
  return JSON.parse(data);
};

// --- Save purchases to localStorage
const savePurchases = (purchases) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
};

// --- Add a new purchase
export const addPurchase = (purchase) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.userType !== 'student') return;

  const allPurchases = getPurchases();

  const enrichedPurchase = {
    ...purchase,
    studentEmail: user.email.toLowerCase(),
    studentName: user.name || user.email.split('@')[0],
    purchasedAt: new Date().toISOString(),
    id: Date.now(),
  };

  allPurchases.push(enrichedPurchase);
  savePurchases(allPurchases);
};

// --- Get purchases of currently logged-in student
export const getStudentPurchases = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.userType !== 'student') return [];

  const studentEmail = user.email.toLowerCase();
  return getPurchases().filter(
    (p) => p.studentEmail?.toLowerCase() === studentEmail
  );
};

// --- Check if course is already purchased
export const hasPurchasedCourse = (courseId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.userType !== 'student') return false;

  const studentEmail = user.email.toLowerCase();
  return getPurchases().some(
    (p) => p.courseId === courseId && p.studentEmail?.toLowerCase() === studentEmail
  );
};

// --- Generate test data manually
export function generateSamplePurchases() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPurchases));
}
// --- Get purchases made on instructor's courses
export const getInstructorPurchases = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.userType !== 'instructor') return [];

  const instructorEmail = user.email.toLowerCase();
  return getPurchases().filter(
    (p) => p.instructorEmail?.toLowerCase() === instructorEmail
  );
};
