import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../contexts/authUtils';
import { getPurchases, generateSamplePurchases } from '../contexts/purchaseUtils';
import courseData from '../components/courseData';
import { Link } from 'react-router-dom';

const InstructorPurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      generateSamplePurchases(courseData);
      const all = getPurchases();
      const mine = all.filter(p => p.instructorEmail === user.email);
      setPurchases(mine);
    }
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>💰 Purchase History</h2>

      {purchases.length === 0 ? (
        <p style={styles.empty}>No purchases found for your courses.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Student</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Course</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Date</th>
              
            </tr>
          </thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p.id}>
                <td style={styles.td}>{p.studentName}</td>
                <td style={styles.td}>{p.studentEmail}</td>
                <td style={styles.td}>{p.courseTitle}</td>
                <td style={styles.td}>{p.price}</td>
                <td style={styles.td}>{new Date(p.purchasedAt).toLocaleDateString()}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    maxWidth: '95%',
    margin: 'auto',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    fontSize: '28px',
    fontWeight: 600,
    marginBottom: '25px',
    color: '#20818f'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fefefe',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  th: {
    backgroundColor: '#20818f',
    color: '#fff',
    padding: '12px',
    fontSize: '14px',
    textAlign: 'left',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#333',
  },
  empty: {
    padding: '30px',
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic'
  },
  linkBtn: {
    padding: '6px 14px',
    background: '#20818f',
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px'
  }
};

export default InstructorPurchaseHistory;
