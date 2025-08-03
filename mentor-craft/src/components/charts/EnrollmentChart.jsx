import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EnrollmentChart = ({ data }) => {
  // Group enrollments by month-year
  const grouped = data.reduce((acc, item) => {
    const month = item.month || 'Unknown';
    const year = item.year || '0000';
    const key = `${month} ${year}`;
    const enrollments = parseInt(item.enrollments) || 0;
    acc[key] = (acc[key] || 0) + enrollments;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const enrollments = Object.values(grouped);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Enrollments',
        data: enrollments,
        backgroundColor: '#54BAB9',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 900,
      easing: 'easeOutBounce',
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} students`,
        },
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#444',
          padding: 10,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: '#f0f0f0',
        },
      },
      x: {
        grid: {
          color: '#f0f0f0',
        },
      },
    },
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '12px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default EnrollmentChart;
