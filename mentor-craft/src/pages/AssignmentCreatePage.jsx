import React, { useEffect, useState } from 'react';
import api from '../api'; // your axios instance

const AssignmentCreatePage = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course: '',
    title: '',
    description: '',
    due_date: '',
    file: null,
  });

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/'); // Adjust if needed
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    const data = new FormData();
    data.append('course', formData.course);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('due_date', formData.due_date);
    data.append('file', formData.file);

    try {
      await api.post('/courses/assignments/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Assignment uploaded successfully!');
      setFormData({
        course: '',
        title: '',
        description: '',
        due_date: '',
        file: null,
      });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload assignment');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Upload Assignment</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title || course.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          style={styles.textarea}
          required
        />

        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          type="file"
          name="file"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>📤 Upload Assignment</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '2rem',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '1rem',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  textarea: {
    marginBottom: '1rem',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    height: '100px',
  },
  button: {
    padding: '0.8rem',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default AssignmentCreatePage;
