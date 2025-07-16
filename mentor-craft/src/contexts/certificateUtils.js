// certificateUtils.js

export const saveGeneratedCertificate = (studentEmail, certificateData) => {
  const existing = JSON.parse(localStorage.getItem("certificates") || "{}");
  const updated = {
    ...existing,
    [studentEmail]: [...(existing[studentEmail] || []), certificateData],
  };
  localStorage.setItem("certificates", JSON.stringify(updated));
};

export const getStudentCertificates = (email) => {
  const all = JSON.parse(localStorage.getItem("certificates") || "{}");
  return all[email] || [];
};
