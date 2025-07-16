import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instructorData from "../components/instructorData";
import { getCurrentUser } from "../contexts/authUtils";

const InstructorProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    website: '',
    phone: '',
    image: '',
  });

  const navigate = useNavigate();

useEffect(() => {
  const user = getCurrentUser();
  if (!user) return;

  // Try to find instructor from dummy data
  const matchedProfile = Object.values(instructorData).find(
    (inst) => inst.email === user.email || inst.name === user.name
  );

  if (matchedProfile) {
    setProfile(matchedProfile);
  } else {
    // Local user (not in dummy list) — check if they edited their profile
    const saved = localStorage.getItem("instructorProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        bio: "",
        image: "",
      });
    }
  }
}, []);



  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.heading}>👤 Instructor Profile</h2>
        <button style={styles.editBtn} onClick={() => navigate('/instructor/settings')}>
          ✏️ Edit Profile
        </button>
      </div>

      <div style={styles.formContainer}>
        <div style={styles.left}>
          <div style={styles.imageBox}>
            {profile.image ? (
              <img src={profile.image} alt="Profile" style={styles.profileImage} />
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
            <div style={styles.readonly}>{profile.phone}</div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Bio:</label>
            <div style={styles.readonly}>{profile.bio}</div>
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
  link: {
    display: 'inline-block',
    color: '#20818f',
    fontWeight: '500',
    textDecoration: 'none',
    backgroundColor: '#eef7f8',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    border: '1px solid #ccc',
  },
};

export default InstructorProfile;
