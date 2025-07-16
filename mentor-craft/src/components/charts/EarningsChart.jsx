// EarningsChart.jsx

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,  Filler } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EarningsChart = ({ data }) => {
  const grouped = data.reduce((acc, item) => {
    const key = `${item.month} ${item.year}`;
    acc[key] = (acc[key] || 0) + item.earnings;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const earnings = Object.values(grouped);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Earnings ($)',
        data: earnings,
        backgroundColor: '#207D8C',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: ctx => `$${ctx.raw}`,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default EarningsChart;
