// LearningProgressChart.js
import React, { useState, useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const sampleData = [
  { course: 'React Basics', progress: 80 },
  { course: 'Python 101', progress: 60 },
  { course: 'CSS Mastery', progress: 90 },
  { course: 'UX/UI Design', progress: 40 },
  { course: 'JavaScript Pro', progress: 70 }
];

const LearningProgressChart = () => {
  const [chartType, setChartType] = useState('bar');
  const chartRef = useRef();

  const chartData = {
    labels: sampleData.map(item => item.course),
    datasets: [
      {
        label: 'Average Progress (%)',
        data: sampleData.map(item => item.progress),
        backgroundColor: 'rgba(30, 58, 138, 0.7)',
        borderColor: '#1E3A8A',
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  const handleDownload = () => {
    const chart = chartRef.current;
    if (!chart) return;

    const url = chart.toBase64Image();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progress_chart.png';
    a.click();
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={{ color: '#1E3A8A' }}>📈 Learning Progress</h3>
        <div>
          <button style={styles.btn} onClick={() => setChartType('bar')}>Bar</button>
          <button style={styles.btn} onClick={() => setChartType('line')}>Line</button>
          <button style={styles.downloadBtn} onClick={handleDownload}>Download</button>
        </div>
      </div>

      {chartType === 'bar' ? (
        <Bar ref={chartRef} data={chartData} options={chartOptions} />
      ) : (
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: 30
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center'
  },
  btn: {
    marginRight: 10,
    background: '#3B82F6',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 6,
    cursor: 'pointer'
  },
  downloadBtn: {
    background: '#1E3A8A',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 6,
    cursor: 'pointer'
  }
};

export default LearningProgressChart;
