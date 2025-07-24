const STORAGE_KEY = 'purchases';

// --- Default static purchase data
const defaultPurchases = [
  // Sara Khan
  {
    id: 101,
    studentEmail: "sarakhan@gmail.com",
    studentName: "Sara Khan",
    courseId: 1,
    courseTitle: "React for Beginners",
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
    courseId: 3,
    courseTitle: "JavaScript Advanced Concepts",
    instructorName: "Jane Smith",
    instructorEmail: "jane@mentorcraft.com",
    price: "$20",
    purchasedAt: "2025-06-30T14:30:00",
    thumbnail: "/images/js-advanced.jpg",
    rating: 4.5,
  },
  // ... other users (Zain, Ayesha, Bilal, etc.)
  // Include the full list you shared
];

// --- Get all purchase records
export const getPurchases = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Seed initial purchases
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPurchases));
    return defaultPurchases;
  }
  return JSON.parse(data);
};

// --- Save to localStorage
const savePurchases = (purchases) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
};

// --- Add new purchase
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

// --- Generate test data (for instructors/testing)
export function generateSamplePurchases() {
  const fakePurchases = [
    {
      id: 1,
      studentName: 'Sara Khan',
      studentEmail: 'sarakhan@gmail.com',
      studentThumb: '/static/media/user1.png',
      rating: 4.8,
      courseTitle: 'Advanced CSS Animations',
      courseId: 3,
      instructorName: 'Emily Carter',
      instructorEmail: 'emily@mentorcraft.com',
      price: '$29',
      purchasedAt: '2024-12-10T09:00:00Z',
    },
    {
      id: 2,
      studentName: 'Sara Khan',
      studentEmail: 'sarakhan@gmail.com',
      studentThumb: '/static/media/user1.png',
      rating: 4.9,
      courseTitle: 'Mastering JavaScript ES6+',
      courseId: 7,
      instructorName: 'Mike Johnson',
      instructorEmail: 'mike@mentorcraft.com',
      price: '$39',
      purchasedAt: '2024-12-12T14:22:00Z',
    },
    // Add more sample purchases...
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(fakePurchases));
}
