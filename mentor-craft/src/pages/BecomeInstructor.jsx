import React, { useState } from 'react';
import { loginUser } from '../contexts/authUtils';
import { useNavigate } from 'react-router-dom';

const logo = 'https://cdn-icons-png.flaticon.com/512/3135/3135789.png';
const heroImg = 'https://cdn.pixabay.com/photo/2015/07/17/22/43/student-849825_1280.jpg';

const benefits = [
  {
    img: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    title: 'Teach what you love',
    text: 'Use your expertise to create impactful courses.',
  },
  {
    img: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png',
    title: 'Build your brand',
    text: 'Grow your audience and credibility.',
  },
  {
    img: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
    title: 'Earn revenue',
    text: 'Monetize your skills with every enrollment.',
  },
];

const faqs = [
  {
    question: 'Do I need teaching experience?',
    answer: 'No! Anyone with knowledge and passion can teach on Mentor Craft.'
  },
  {
    question: 'How much can I earn?',
    answer: 'Earnings vary by course popularity, reviews, and engagement.'
  },
  {
    question: 'What tools do I need?',
    answer: 'A laptop, internet, and a willingness to share knowledge.'
  }
];

const testimonials = [
  {
    name: 'Sarah Khan',
    quote: 'Mentor Craft gave me the platform to reach thousands of students globally.',
    img: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Ali Raza',
    quote: 'It feels amazing to earn while helping others learn.',
    img: 'https://randomuser.me/api/portraits/men/33.jpg'
  },
  {
    name: 'Ayesha Malik',
    quote: 'The tools and support made course creation super easy.',
    img: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

const BecomeInstructor = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', bio: '', expertise: '' });
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  const handleStart = () => setShowForm(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, bio, expertise } = form;
    if (!name || !email || !bio || !expertise) {
      setError('Please fill all fields');
      return;
    }
    loginUser('instructor', email);
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <div style={{ backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '100px 20px', textAlign: 'center', color: '#fff' }}>
        <img src={logo} alt="Mentor Craft" style={{ width: 100, marginBottom: 20 }} />
        <h1 style={{ fontSize: '3em', margin: 0 }}>Share your knowledge with the world</h1>
        <p style={{ fontSize: '1.2em', margin: '20px 0' }}>Join as an instructor and start teaching today.</p>
        <button onClick={handleStart} style={{ padding: '15px 30px', fontSize: '1em', backgroundColor: 'rgb(32,125,140)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Register Now</button>
      </div>

      {/* Instructor Stats */}
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <h2 style={{ color: 'rgb(32,125,140)' }}>Join 10,000+ instructors worldwide</h2>
        <p style={{ color: '#666' }}>Trusted by educators from over 50 countries</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 40, padding: '0 20px' }}>
        {benefits.map((b, i) => (
          <div key={i} style={{ width: 280, margin: 15, padding: 20, textAlign: 'center', borderRadius: 8, backgroundColor: '#fafafa', animation: 'fadeIn 0.8s ease forwards', animationDelay: `${i * 0.2}s`, opacity: 0 }}>
            <img src={b.img} alt="" style={{ width: 60, marginBottom: 15 }} />
            <h3 style={{ fontSize: '1.3em', marginBottom: 10, color: 'rgb(32,125,140)' }}>{b.title}</h3>
            <p style={{ fontSize: '0.95em', lineHeight: 1.4 }}>{b.text}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ maxWidth: 600, margin: '60px auto', padding: 20, backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: 'rgb(32,125,140)', textAlign: 'center' }}>Apply to Teach</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <input style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ccc', borderRadius: 4 }} type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ccc', borderRadius: 4 }} type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <textarea style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ccc', borderRadius: 4 }} placeholder="Short Bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            <input style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ccc', borderRadius: 4 }} type="text" placeholder="Expertise (e.g., Web Dev, AI)" value={form.expertise} onChange={e => setForm({ ...form, expertise: e.target.value })} />
            <button type="submit" style={{ width: '100%', padding: 12, backgroundColor: 'rgb(32,125,140)', color: '#fff', border: 'none', borderRadius: 6, marginTop: 10 }}>Submit Application</button>
          </form>
        </div>
      )}

      {/* Video Section */}
      <div style={{ maxWidth: 800, margin: '60px auto', textAlign: 'center' }}>
        <h2 style={{ color: 'rgb(32,125,140)', marginBottom: 20 }}>Watch how easy it is to get started</h2>
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/qv6UVOQ0F44"
          title="Instructor Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ borderRadius: 10 }}
        ></iframe>
      </div>

      <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ color: 'rgb(32,125,140)', textAlign: 'center', marginBottom: 30 }}>Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: 15, borderBottom: '1px solid #ddd', paddingBottom: 10 }}>
            <button onClick={() => setExpanded(expanded === i ? null : i)} style={{ background: 'none', border: 'none', color: 'rgb(42,98,113)', fontWeight: 'bold', fontSize: 16, textAlign: 'left', width: '100%', cursor: 'pointer', padding: '10px 0' }}>{faq.question}</button>
            {expanded === i && <p style={{ marginTop: 8, color: '#555', transition: 'max-height 0.3s ease' }}>{faq.answer}</p>}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1000, margin: '60px auto', padding: '0 20px' }}>
        <h2 style={{ color: 'rgb(32,125,140)', textAlign: 'center', marginBottom: 30 }}>What Our Instructors Say</h2>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 30 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ flex: '1 1 0', maxWidth: 300, padding: 20, background: '#f9f9f9', borderRadius: 8, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <img src={t.img} alt={t.name} style={{ width: 60, height: 60, borderRadius: '50%', marginBottom: 10 }} />
              <p style={{ fontStyle: 'italic', fontSize: 15, color: '#444' }}>
                "{t.quote}"
              </p>
              <h4 style={{ marginTop: 10, fontSize: 16, color: 'rgb(42,98,113)' }}>{t.name}</h4>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BecomeInstructor;
