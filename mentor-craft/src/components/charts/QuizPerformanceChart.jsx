// QuizPerformanceChart.jsx

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend,  Filler} from 'chart.js';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const QuizPerformanceChart = ({ data }) => {
  const grouped = data.reduce((acc, item) => {
    const key = `${item.month} ${item.year}`;
    acc[key] = (acc[key] || []).concat(item.quizAverage);
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const quizAverages = labels.map(key => {
    const values = grouped[key];
    const total = values.reduce((sum, val) => sum + val, 0);
    return total / values.length;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Average Quiz Score (%)',
        data: quizAverages,
        borderColor: '#2A6271',
        backgroundColor: '#2A627180',
        tension: 0.3,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 800,
      easing: 'easeInOutCubic',
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.raw.toFixed(1)}%`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default QuizPerformanceChart;
