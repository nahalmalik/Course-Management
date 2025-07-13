import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const EarningsChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Earnings ($)',
        data: [500, 900, 1400, 1000, 1600, 2100, 1800],
        fill: true,
        borderColor: 'rgb(32,125,140)',
        backgroundColor: 'rgba(32,125,140,0.1)',
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(32,125,140)',
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#666',
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
          color: '#666',
        },
        grid: {
          color: '#eee',
        },
      },
    },
  };

  return (
    <div style={{
      background: '#fff',
      padding: '15px 20px',
      borderRadius: 10,
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      marginTop: 30,
      height: 250
    }}>
      <h3 style={{ marginBottom: 10, color: 'rgb(32,125,140)', fontSize: 18 }}>Earnings Over Time</h3>
      <div style={{ height: 180 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default EarningsChart;
