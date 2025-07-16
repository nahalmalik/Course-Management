// EnrollmentChart.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,  Filler} from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EnrollmentChart = ({ data }) => {
  const grouped = data.reduce((acc, item) => {
    const key = `${item.month} ${item.year}`;
    acc[key] = (acc[key] || 0) + item.enrollments;
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
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.raw} students`,
        },
      },
    },
    animation: {
      duration: 900,
      easing: 'easeOutBounce',
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default EnrollmentChart;
