import React, { useEffect, useState } from 'react';
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
  Legend,
  AreaChart, Area,
  defs, linearGradient
} from 'recharts';

const EarningsChart = ({ zero = false }) => {
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'

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

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 20, left: 0, bottom: 0 }
    };

    const gradientDefs = (
      <defs>
        <linearGradient id="earnGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#208088" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#208088" stopOpacity={0.2} />
        </linearGradient>
      </defs>
    );

    if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value}`} />
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
                stroke="none"
              />
            ) : null
          )}
          {gradientDefs}
        </BarChart>
      );
    }

    return (
      <LineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />
        <Line
          type="monotone"
          dataKey="earnings"
          stroke="#208088"
          strokeWidth={3}
          dot={{ r: 5 }}
          activeDot={{ r: 7 }}
          animationDuration={1000}
        />
        {chartData.map((d, i) =>
          d.month === currentMonth ? (
            <ReferenceDot
              key={i}
              x={d.month}
              y={d.earnings}
              r={8}
              fill="#ff9900"
              stroke="none"
              isFront
            />
          ) : null
        )}
        {gradientDefs}
      </LineChart>
    );
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Earnings Overview</h3>
        <div className="chart-controls">
          <button onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}>
            🔁 {chartType === 'line' ? 'Switch to Bar' : 'Switch to Line'}
          </button>
          <button onClick={handleExportCSV}>⬇️ Export CSV</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
