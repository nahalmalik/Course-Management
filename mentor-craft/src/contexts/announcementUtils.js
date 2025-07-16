// announcementUtils.js

// 🔹 Get all announcements from localStorage
export const getAnnouncements = () => {
  const data = localStorage.getItem('announcements');
  return data ? JSON.parse(data) : [];
};

// 🔹 Save announcements to localStorage
export const saveAnnouncements = (data) => {
  localStorage.setItem('announcements', JSON.stringify(data));
};

// 🔹 Add a new announcement
export const addAnnouncement = (announcement) => {
  const existing = getAnnouncements();
  const updated = [...existing, announcement];
  saveAnnouncements(updated);
};

// 🔹 Delete an announcement by ID
export const deleteAnnouncement = (id) => {
  const existing = getAnnouncements();
  const updated = existing.filter(a => a.id !== id);
  saveAnnouncements(updated);
};

// 🔹 Generate dummy announcements for all courses (only once)
export const generateSampleAnnouncements = (courseData) => {
  const already = localStorage.getItem('announcements');
  if (already) return;

  const dummy = courseData.map(course => ({
    id: Date.now() + Math.floor(Math.random() * 10000),
    courseId: course.id,
    courseTitle: course.title,
    message: `📢 Welcome to ${course.title}! Let’s get started with the course.`,
    date: new Date().toISOString(),
    instructorEmail: course.instructorEmail || "john@mentorcraft.com"
  }));

  saveAnnouncements(dummy);
};
