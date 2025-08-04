import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../contexts/authUtils";

const StudentSettings = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const token = localStorage.getItem("accessToken");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    image: null,
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/student/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfile((prev) => ({ ...prev, image: file }));
  };

  // ✅ Save to backend (multipart for image)
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("phone", profile.phone);
    formData.append("bio", profile.bio);
    if (profile.image instanceof File) {
      formData.append("image", profile.image);
    }

    try {
      const res = await fetch("http://localhost:8000/api/student/profile/", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("✅ Profile updated successfully!");
        navigate("/student/profile");
      } else {
        alert("❌ Failed to update profile.");
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleChangePassword = () => {
    if (password.trim().length < 6) {
      alert("⚠️ Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      alert("❌ Passwords do not match.");
      return;
    }
    alert("🔐 Password changed (simulated)!");
    setPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("⚠️ Are you sure you want to delete your account?")) {
      logoutUser();
      navigate("/");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>⚙️ Student Settings</h2>

      <div style={styles.form}>
        <div style={styles.imageUploadBox}>
          {profile.image && typeof profile.image === "string" && (
            <img
              src={profile.image}
              alt="Profile"
              style={{ width: 120, height: 120, borderRadius: "50%", marginBottom: 10 }}
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Full Name:</label>
          <input name="name" value={profile.name} disabled style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email:</label>
          <input name="email" value={profile.email} disabled style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Phone:</label>
          <input name="phone" value={profile.phone} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Bio:</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4" style={styles.textarea} />
        </div>

        <div style={styles.btnRow}>
          <button onClick={handleSave} style={styles.saveBtn}>💾 Save Changes</button>
        </div>
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h3 style={styles.heading}>🔐 Change Password (Mock)</h3>
      <div style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>New Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        <button onClick={handleChangePassword} style={styles.saveBtn}>✅ Change Password</button>
      </div>

      <hr style={{ margin: "40px 0" }} />

      <h3 style={{ ...styles.heading, color: "#b00020" }}>❌ Delete Account</h3>
      <button onClick={handleDeleteAccount} style={styles.deleteBtn}>
        🗑️ Delete My Account
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    maxWidth: "700px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: "25px",
  },
  form: {
    background: "#fff",
    padding: "25px 30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    marginBottom: "30px",
  },
  field: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "6px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  saveBtn: {
    marginTop: "10px",
    background: "#1E3A8A",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  restoreBtn: {
    marginTop: "10px",
    background: "#aaaaaa",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    marginLeft: "10px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#b00020",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  imageUploadBox: {
    textAlign: "center",
    marginBottom: "25px",
  },
  btnRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  },
};

export default StudentSettings;
