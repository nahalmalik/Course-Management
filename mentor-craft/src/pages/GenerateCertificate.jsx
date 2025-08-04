// src/pages/GenerateCertificate.jsx

import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../contexts/authUtils';
import courseData from '../components/courseData';
import { getEnrollments } from '../components/enrollmentUtils';
import { saveGeneratedCertificate } from '../contexts/certificateUtils';
import toast from 'react-hot-toast';
import certTemplate from '../assets/certificate-template.png';

const GenerateCertificate = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [previewData, setPreviewData] = useState(null);

  const instructor = getCurrentUser();

  useEffect(() => {
    if (instructor) {
      const ownCourses = courseData.filter(
        c => c.instructorEmail === instructor.email
      );
      setCourses(ownCourses);
    }
  }, [instructor]);

  useEffect(() => {
    if (selectedCourse) {
      const enrolled = getEnrollments().filter(
        e => e.title === selectedCourse && e.instructorEmail === instructor.email
      );
      setStudents(enrolled);
    } else {
      setStudents([]);
    }
  }, [selectedCourse]);

  const handleGenerate = () => {
    if (!selectedStudent || !selectedCourse) {
      toast.error("Please select both course and student.");
      return;
    }
    toast.success(`📩 Certificate sent to ${selectedStudent.email}`);
console.log(`📨 Email simulation: Certificate sent to ${selectedStudent.email}`);


    const cert = {
      studentEmail: selectedStudent.email,
      course: selectedCourse,
      studentName: selectedStudent.student,
      generatedAt: new Date().toISOString(),
    };

    saveGeneratedCertificate(selectedStudent.email, cert);
    toast.success("🎉 Certificate generated & sent to student!");
    setPreviewData(cert);
    
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = certTemplate;
    link.download = 'mentorcraft-certificate.jpg';
    link.click();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎓 Generate Certificate</h2>

      <div style={styles.formRow}>
        <label style={styles.label}>Select Course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Choose Course --</option>
          {courses.map((course, i) => (
            <option key={i} value={course.title}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.formRow}>
        <label style={styles.label}>Select Student:</label>
        <select
          value={selectedStudent.email || ''}
          onChange={(e) =>
            setSelectedStudent(
              students.find((s) => s.email === e.target.value)
            )
          }
          style={styles.select}
          disabled={!selectedCourse}
        >
          <option value="">-- Choose Student --</option>
          {students.map((student, i) => (
            <option key={i} value={student.email}>
              {student.student} ({student.email})
            </option>
          ))}
        </select>
      </div>

      <button style={styles.button} onClick={handleGenerate}>
        🎉 Generate Certificate
      </button>

     {previewData && (
  <div style={styles.previewBox}>
    <h4 style={{ color: "#1E3A8A" }}>Preview:</h4>
    <div style={styles.certificateWrapper}>
      <img src={certTemplate} alt="Certificate" style={styles.certBackground} />
      <div style={styles.overlay}>
        <h2 style={styles.name}>{previewData.studentName}</h2>
        <p style={styles.course}>{previewData.course}</p>
        <p style={styles.date}>{new Date(previewData.generatedAt).toDateString()}</p>
      </div>
    </div>

    <button style={styles.downloadBtn} onClick={handleDownload}>
      ⬇️ Download Certificate
    </button>
  </div>
)}

    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '700px',
    margin: 'auto',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '26px',
    fontWeight: '600',
    marginBottom: '30px',
    color: '#1E3A8A',
  },
  formRow: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '500',
    color: '#555',
    marginBottom: '8px',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '12px 18px',
    backgroundColor: '#1E3A8A',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '10px',
  },
  previewBox: {
    marginTop: '40px',
    borderTop: '1px solid #eee',
    paddingTop: '20px',
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  downloadBtn: {
    marginTop: '10px',
    padding: '10px 16px',
    fontSize: '14px',
    backgroundColor: '#1E3A8A',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
    certificateWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '700px',
    margin: 'auto',
  },
  certBackground: {
    width: '100%',
    display: 'block',
    borderRadius: '8px',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    textAlign: 'center',
    paddingTop: '32%',
    color: '#333',
    pointerEvents: 'none',
  },
  name: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E3A8A',
    margin: '0',
  },
  course: {
    fontSize: '18px',
    color: '#444',
    margin: '10px 0',
  },
  date: {
    fontSize: '14px',
    color: '#666',
  },

};

export default GenerateCertificate;
