// purchaseUtils.js

// Get all stored purchases
export const getPurchases = () => {
  const data = localStorage.getItem('purchases');
  return data ? JSON.parse(data) : [];
};

// Save all purchases
export const savePurchases = (purchases) => {
  localStorage.setItem('purchases', JSON.stringify(purchases));
};

// Generate dummy purchases for each course (run once)
export const generateSamplePurchases = (courses) => {
  const existing = getPurchases();
  if (existing.length > 0) return;

  const students = [
    { name: 'Ahmed Ali', email: 'ahmed@student.com' },
    { name: 'Areeba Khan', email: 'areeba@student.com' },
    { name: 'Zainab Iqbal', email: 'zainab@student.com' },
    { name: 'Bilal Saeed', email: 'bilal@student.com' },
  ];

  const dummy = [];

  courses.forEach(course => {
    const randomStudent = students[Math.floor(Math.random() * students.length)];
    dummy.push({
      id: Date.now() + Math.floor(Math.random() * 10000),
      courseId: course.id,
      courseTitle: course.title,
      price: course.price,
      studentName: randomStudent.name,
      studentEmail: randomStudent.email,
      instructorEmail: course.instructorEmail || 'john@mentorcraft.com',
      purchasedAt: new Date().toISOString(),
      orderId: 'ORD' + Math.floor(Math.random() * 100000),
    });
  });

  savePurchases(dummy);
};
