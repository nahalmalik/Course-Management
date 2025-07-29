import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, getAccessToken } from "../contexts/authUtils";
import instructorData from "../components/instructorData";

const InstructorSettings = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const token = getAccessToken();

  const [profile, setProfile] = useState({
    phone: "",
    website: "",
    bio: "",
    image: null,
    name: "",
    email: ""
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || user.role !== 'instructor') return;
      try {
        const res = await fetch("http://localhost:8000/api/instructor/profile/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
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
  if (file) {
    setProfile((prev) => ({ ...prev, image: file }));
  }
};

const handleSave = async () => {
  try {
    const formData = new FormData();

    // Only send writable fields
    if (profile.phone) formData.append("phone", profile.phone);
    if (profile.website) formData.append("website", profile.website);
    if (profile.bio) formData.append("bio", profile.bio);

    // Only send image if it's a File object (not a base64 string)
    if (profile.image && typeof profile.image !== "string") {
      formData.append("image", profile.image);
    }

    const res = await fetch("http://localhost:8000/api/instructor/profile/", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const resData = await res.json();
    if (!res.ok) {
      console.error("Backend error:", resData);
      alert("❌ Failed to save profile. Check console for details.");
      return;
    }

    alert("✅ Profile updated successfully!");
    navigate("/instructor/profile");
  } catch (err) {
    console.error("Network or logic error:", err);
    alert("❌ Error saving profile.");
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

  const handleRestoreDefault = () => {
    const fallback = Object.values(instructorData).find(
      (inst) => inst.email === user?.email || inst.name === user?.name
    );
    if (fallback) {
      setProfile({
        phone: fallback.phone || "",
        website: fallback.website || "",
        bio: fallback.bio || "",
        image: fallback.image || "",
        name: fallback.name || "",
        email: fallback.email || ""
      });
      alert("♻️ Default profile restored!");
    } else {
      setProfile({
        phone: "",
        website: "",
        bio: "",
        image: null,
        name: user?.name || "",
        email: user?.email || ""
      });
      alert("🧹 Profile reset to blank!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>⚙️ Instructor Settings</h2>

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
          <input value={profile.name || ""} disabled style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email:</label>
          <input value={profile.email || ""} disabled style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Phone:</label>
          <input name="phone" value={profile.phone} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Website:</label>
          <input name="website" placeholder="http://example.com" value={profile.website} onChange={handleChange} style={styles.input} />
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
