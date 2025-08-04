import React, { useEffect, useState } from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
  Legend,
  defs, linearGradient
} from 'recharts';

const EarningsChart = ({ zero = false }) => {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    const storedEarnings = JSON.parse(localStorage.getItem('instructorEarnings'));

    if (zero) {
      setChartData([
        { month: 'Jan', earnings: 0 },
        { month: 'Feb', earnings: 0 },
        { month: 'Mar', earnings: 0 },
        { month: 'Apr', earnings: 0 },
        { month: 'May', earnings: 0 },
        { month: 'Jun', earnings: 0 }
      ]);
    } else if (storedEarnings && storedEarnings.length > 0) {
      setChartData(storedEarnings);
    } else {
      const defaultData = [
        { month: 'Jan', earnings: 540 },
        { month: 'Feb', earnings: 620 },
        { month: 'Mar', earnings: 480 },
        { month: 'Apr', earnings: 720 },
        { month: 'May', earnings: 960 },
        { month: 'Jun', earnings: 1020 }
      ];
      localStorage.setItem('instructorEarnings', JSON.stringify(defaultData));
      setChartData(defaultData);
    }
  }, [zero]);

  const currentMonth = new Date().toLocaleString('default', { month: 'short' });

  const handleExportCSV = () => {
    const csv = `Month,Earnings\n${chartData
      .map(d => `${d.month},${d.earnings}`)
      .join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'earnings.csv';
    a.click();
  };

  const gradientDefs = (
    <defs>
      <linearGradient id="earnGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4EB4F6" stopOpacity={0.8} />
        <stop offset="100%" stopColor="#4EB4F6" stopOpacity={0.2} />
      </linearGradient>
    </defs>
  );

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 20, left: 0, bottom: 0 }
    };

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          {gradientDefs}
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={value => `$${value}`} />
          <Legend />
          <Bar dataKey="earnings" fill="url(#earnGradient)" />
          {chartData.map((d, i) =>
            d.month === currentMonth ? (
              <ReferenceDot
                key={i}
                x={d.month}
                y={d.earnings}
                r={8}
                fill="#ff9900"
              />
            ) : null
          )}
        </BarChart>
      );
    }

    return (
      <LineChart {...commonProps}>
        {gradientDefs}
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={value => `$${value}`} />
        <Legend />
        <Line
          type="monotone"
          dataKey="earnings"
          stroke="#208088"
          strokeWidth={3}
          dot={{ r: 5 }}
          activeDot={{ r: 7 }}
        />
        {chartData.map((d, i) =>
          d.month === currentMonth ? (
            <ReferenceDot
              key={i}
              x={d.month}
              y={d.earnings}
              r={8}
              fill="#ff9900"
              isFront
            />
          ) : null
        )}
      </LineChart>
    );
  };

  // ✅ Inline Modern Styles
  const containerStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '30px'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333'
  };

  const buttonGroup = {
    display: 'flex',
    gap: '10px'
  };

  const buttonStyle = {
    padding: '8px 16px',
    background: '#1E3A8A',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>📈 Earnings Overview</h3>
        <div style={buttonGroup}>
          <button style={buttonStyle} onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}>
            {chartType === 'line' ? 'Switch to Bar' : 'Switch to Line'}
          </button>
          <button style={buttonStyle} onClick={handleExportCSV}>Export CSV</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
