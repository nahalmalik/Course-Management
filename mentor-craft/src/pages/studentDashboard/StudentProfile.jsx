import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../contexts/authUtils';
import studentData from '../../contexts/studentData'; // adjust path as needed

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    image: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
  const user = getCurrentUser();
  if (!user) return;

  const savedProfile = localStorage.getItem('studentProfile');

  if (savedProfile) {
    setProfile(JSON.parse(savedProfile));
  } else {
    // Try to match with studentData
    const matchedStudent = studentData.find(
      (s) => s.email.toLowerCase() === user.email.toLowerCase()
    );

    // If found in studentData, use it
    if (matchedStudent) {
      setProfile({
        name: matchedStudent.name,
        email: matchedStudent.email,
        phone: matchedStudent.phone || '',
        bio: matchedStudent.bio || '',
        image: matchedStudent.image || '',
      });
    } else {
      // Otherwise, use only current user details
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        bio: '',
        image: '',
      });
    }
  }
}, []);


  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.heading}>🎓 My Profile</h2>
        <button
          style={styles.editBtn}
          onClick={() => navigate('/student/settings')}
        >
          ✏️ Edit Profile
        </button>
      </div>

      <div style={styles.formContainer}>
        <div style={styles.left}>
          <div style={styles.imageBox}>
            {profile.image ? (
              <img
                src={profile.image}
                alt="Profile"
                style={styles.profileImage}
              />
            ) : (
              <div style={styles.placeholder}>No Image</div>
            )}
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name:</label>
            <div style={styles.readonly}>{profile.name}</div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email:</label>
            <div style={styles.readonly}>{profile.email}</div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Phone:</label>
            <div style={styles.readonly}>{profile.phone || 'N/A'}</div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Bio:</label>
            <div style={styles.readonly}>{profile.bio || 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#f7f9fc',
    minHeight: '100vh',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  heading: {
    fontSize: '28px',
    color: '#20818f',
    fontWeight: '600',
  },
  editBtn: {
    padding: '10px 16px',
    backgroundColor: '#20818f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  formContainer: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    background: '#fff',
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  },
  left: {
    flex: '1',
    minWidth: '220px',
    textAlign: 'center',
  },
  imageBox: {
    position: 'relative',
  },
  profileImage: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #20818f',
    marginBottom: '10px',
  },
  placeholder: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: '#ddd',
    lineHeight: '200px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
    margin: 'auto',
    marginBottom: '10px',
  },
  right: {
    flex: '2',
    minWidth: '300px',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#333',
    fontWeight: '600',
    fontSize: '14px',
  },
  readonly: {
    padding: '10px',
    backgroundColor: '#f3f3f3',
    borderRadius: '6px',
    border: '1px solid #ccc',
    color: '#444',
    fontSize: '14px',
  },
};

export default StudentProfile;
