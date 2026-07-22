import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SHAPWaterfallChart({ features }) {
  const labels = features.map(f => f.feature);
  const dataValues = features.map(f => f.impact);

  const backgroundColors = dataValues.map(val =>
    val >= 0 ? '#00A8CC' : '#4682B4'
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'SHAP Value (Impact on Safety Factor)',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#1B2631',
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw;
            return ` SHAP Impact: ${val > 0 ? '+' : ''}${val.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(27, 38, 49, 0.06)' },
        ticks: { font: { family: 'JetBrains Mono', size: 11 } },
        title: { display: true, text: '← Decreases Capacity | Increases Capacity →', font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 12, weight: '500' } },
      },
    },
  };

  return (
    <div className="w-full h-72">
      <Bar data={data} options={options} />
    </div>
  );
}
