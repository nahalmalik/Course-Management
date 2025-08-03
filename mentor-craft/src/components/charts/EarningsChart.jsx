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

const EarningsChart = ({ data }) => {
  // Group earnings by month + year
  const grouped = data.reduce((acc, item) => {
    const month = item.month || 'Unknown';
    const year = item.year || '0000';
    const key = `${month} ${year}`;
    const earnings = parseFloat(item.earnings) || 0;
    acc[key] = (acc[key] || 0) + earnings;
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
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 900,
      easing: 'easeOutCubic',
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.raw.toFixed(2)}`,
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
          callback: (val) => `$${val}`,
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

export default EarningsChart;
