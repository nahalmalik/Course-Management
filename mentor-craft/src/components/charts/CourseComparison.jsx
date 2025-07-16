// CourseComparison.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,  Filler } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CourseComparison = ({ data }) => {
  const courses = [...new Set(data.map(item => item.course))];

  const earningsByCourse = courses.map(course => {
    return data.filter(item => item.course === course).reduce((acc, curr) => acc + curr.earnings, 0);
  });

  const chartData = {
    labels: courses,
    datasets: [
      {
        label: 'Total Earnings ($)',
        data: earningsByCourse,
        backgroundColor: '#FFA500',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: 'y',
    animation: {
      duration: 700,
      easing: 'easeOutElastic',
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `$${ctx.raw}`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default CourseComparison;
