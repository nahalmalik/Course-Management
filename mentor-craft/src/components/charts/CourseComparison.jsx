import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CourseComparison = ({ data }) => {
  // Normalize course name from backend and static sources
  const extractCourseTitle = (item) =>
    item.course_title || item.course || 'Untitled';

  const courses = [...new Set(data.map(extractCourseTitle))];

  const earningsByCourse = courses.map((course) => {
    return data
      .filter((item) => extractCourseTitle(item) === course)
      .reduce((acc, curr) => acc + (parseFloat(curr.earnings) || 0), 0);
  });

  const chartData = {
    labels: courses,
    datasets: [
      {
        label: 'Total Earnings ($)',
        data: earningsByCourse,
        backgroundColor: '#FF9F40',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: 'y',
    animation: {
      duration: 800,
      easing: 'easeOutQuart',
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `$${ctx.raw.toFixed(2)}`,
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 10,
          color: '#333',
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `$${val}`,
        },
        grid: {
          color: '#f2f2f2',
        },
      },
      y: {
        grid: {
          color: '#f2f2f2',
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

export default CourseComparison;
