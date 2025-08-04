import React, { useState } from 'react';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, simulate a successful submission
    setSuccess('Thanks for contacting us! We’ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      {/* Hero */}
      <div style={{
        background: 'url(https://images.unsplash.com/photo-1497493292307-31c376b6e479?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '100px 20px',
        color: '#1E3A8A',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3em', marginBottom: 10 }}>Get In Touch</h1>
        <p style={{ fontSize: '1.2em' }}>We’d love to hear from you. Send us a message below!</p>
      </div>

      {/* Contact Form */}
      <div style={{ maxWidth: 900, margin: '50px auto', display: 'flex', gap: 40, flexWrap: 'wrap', padding: '0 20px' }}>
        <div style={{ flex: '1 1 400px' }}>
          <h2 style={{ color: '#1E3A8A', marginBottom: 20 }}>Send a Message</h2>
          {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required
              style={{ width: '100%', padding: 12, marginBottom: 12, border: '1px solid #ccc', borderRadius: 4 }} />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your Email" required
              style={{ width: '100%', padding: 12, marginBottom: 12, border: '1px solid #ccc', borderRadius: 4 }} />
            <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject"
              style={{ width: '100%', padding: 12, marginBottom: 12, border: '1px solid #ccc', borderRadius: 4 }} />
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Your Message" rows="6" required
              style={{ width: '100%', padding: 12, marginBottom: 12, border: '1px solid #ccc', borderRadius: 4 }}></textarea>
            <button type="submit" style={{
              backgroundColor: '#1E3A8A', color: 'white', border: 'none',
              padding: '12px 24px', borderRadius: 4, cursor: 'pointer'
            }}>
              Submit
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div style={{ flex: '1 1 300px' }}>
          <h2 style={{ color: '#1E3A8A', marginBottom: 20 }}>Contact Info</h2>
          <p><strong>Email:</strong> support@mentorcraft.com</p>
          <p><strong>Phone:</strong> +1 (234) 567-8901</p>
          <p><strong>Address:</strong><br />123 Learning St.<br />Skill City, SC 56789</p>

          {/* Google Map (optional) */}
          <div style={{ marginTop: 20 }}>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0862073126444!2d-122.4199064846786!3d37.77492927975925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085814c9b7aa66b%3A0xfedb745fa23c49f!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1679146117722!5m2!1sen!2sus"
              width="100%" height="220" style={{ border: 0, borderRadius: 8 }} allowFullScreen="" loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
