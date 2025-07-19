import React, { useEffect, useState } from 'react';
import courseData from '../../components/courseData';
import { getCurrentStudent } from '../../contexts/studentData';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistCourses, setWishlistCourses] = useState([]);

  useEffect(() => {
    const student = getCurrentStudent();
    if (student && student.wishlist) {
      const courses = student.wishlist
        .map(id => courseData.find(course => course.id === id))
        .filter(Boolean);
      setWishlistCourses(courses);
    }
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlistCourses.filter(course => course.id !== id);
    setWishlistCourses(updated);

    const student = getCurrentStudent();
    if (student) {
      const newWishlist = student.wishlist.filter(cid => cid !== id);
      student.wishlist = newWishlist;

      // Reflect change in localStorage
      localStorage.setItem('studentEmail', student.email); // re-save if needed
    }
  };

  const handleBuyNow = (course) => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ fontSize: '26px', marginBottom: '30px', color: 'rgb(32, 125, 140)' }}>❤️ My Wishlist</h2>

      {wishlistCourses.length === 0 ? (
        <p style={{ fontSize: '18px' }}>Your wishlist is empty.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {wishlistCourses.map((course) => (
            <div
              key={course.id}
              style={{
                background: '#fff',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <img
                src={course.image}
                alt={course.title}
                style={{
                  width: '100%',
                  height: '180px',
                  objectFit: 'cover',
                }}
              />

              <div style={{ padding: '20px', flexGrow: 1 }}>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{course.title}</h3>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>
                  👨‍🏫 {course.instructor}
                </p>
                <div style={{ fontSize: '13px', color: '#777', marginBottom: '12px' }}>
                  <span>{course.lessons} Lessons</span> • <span>{course.duration}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  <button
                    onClick={() => handleBuyNow(course)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'rgb(32, 125, 140)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      flex: 1,
                    }}
                  >
                    Buy Now
                  </button>
                  <button
                    onClick={() => removeFromWishlist(course.id)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#ccc',
                      color: '#333',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      flex: 1,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
