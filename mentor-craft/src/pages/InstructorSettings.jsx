import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../contexts/authUtils";
import instructorData from "../components/instructorData";

const InstructorSettings = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    bio: "",
    image: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("instructorProfile");
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      const dummy = Object.values(instructorData).find(
        (inst) => inst.email === user?.email || inst.name === user?.name
      );
      setProfile(
        dummy || {
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          website: "",
          bio: "",
          image: "",
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("instructorProfile", JSON.stringify(profile));
    alert("✅ Profile updated successfully!");
    navigate("/instructor/profile");
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
      localStorage.removeItem("instructorProfile");
      logoutUser();
      navigate("/");
    }
  };

  const handleRestoreDefault = () => {
    const fallback = Object.values(instructorData).find(
      (inst) => inst.email === user?.email || inst.name === user?.name
    );
    if (fallback) {
      setProfile(fallback);
      localStorage.setItem("instructorProfile", JSON.stringify(fallback));
      alert("♻️ Default profile restored!");
    } else {
      setProfile({
        name: "",
        email: user?.email || "",
        phone: "",
        website: "",
        bio: "",
        image: "",
      });
      localStorage.removeItem("instructorProfile");
      alert("🧹 Profile reset to blank!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>⚙️ Instructor Settings</h2>

      <div style={styles.form}>
        <div style={styles.imageUploadBox}>
          {profile.image && (
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
          <input name="name" value={profile.name} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email:</label>
          <input name="email" value={profile.email} onChange={handleChange} style={styles.input} disabled />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Phone:</label>
          <input name="phone" value={profile.phone} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Website:</label>
          <input name="website" value={profile.website} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Bio:</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4" style={styles.textarea} />
        </div>

        <div style={styles.btnRow}>
          <button onClick={handleSave} style={styles.saveBtn}>💾 Save Changes</button>
          <button onClick={handleRestoreDefault} style={styles.restoreBtn}>♻️ Restore Default</button>
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
    color: "#20818f",
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
    background: "#20818f",
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

export default InstructorSettings;
