import React from 'react';

const Payouts = () => {
  const payouts = [
    { id: 1, date: '2025-07-10', amount: '$220', status: 'Completed' },
    { id: 2, date: '2025-07-05', amount: '$180', status: 'Completed' },
    { id: 3, date: '2025-06-28', amount: '$240', status: 'Completed' }
  ];

  const containerStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '30px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const headerStyle = {
    background: '#f0f0f0',
    textAlign: 'left',
    padding: '12px',
    fontWeight: '600'
  };

  const cellStyle = {
    padding: '12px',
    borderBottom: '1px solid #eee'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ marginBottom: 16 }}>💸 Recent Payouts</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Amount</th>
            <th style={headerStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map(p => (
            <tr key={p.id}>
              <td style={cellStyle}>{p.date}</td>
              <td style={cellStyle}>{p.amount}</td>
              <td style={cellStyle}>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payouts;
