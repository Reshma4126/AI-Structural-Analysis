import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SensitivityCurveChart({ dataPoints }) {
  const labels = dataPoints.map(p => `${p.depth}mm`);
  const safetyFactors = dataPoints.map(p => p.safetyFactor);
  const stressLevels = dataPoints.map(p => p.stress);

  const data = {
    labels,
    datasets: [
      {
        label: 'Overall Safety Factor',
        data: safetyFactors,
        borderColor: '#00A8CC',
        backgroundColor: 'rgba(0, 168, 204, 0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#00A8CC',
        pointRadius: 4,
        yAxisID: 'ySF',
      },
      {
        label: 'Stress Utilization (%)',
        data: stressLevels,
        borderColor: '#4682B4',
        borderDash: [4, 4],
        tension: 0.3,
        pointBackgroundColor: '#4682B4',
        pointRadius: 3,
        yAxisID: 'yStress',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Inter', size: 12 } },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(27, 38, 49, 0.06)' },
        ticks: { font: { family: 'JetBrains Mono', size: 11 } },
        title: { display: true, text: 'Beam Depth (d)', font: { family: 'Inter', size: 11 } },
      },
      ySF: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Safety Factor (SF)', font: { family: 'Inter', size: 11 } },
        grid: { color: 'rgba(27, 38, 49, 0.06)' },
        ticks: { font: { family: 'JetBrains Mono', size: 11 } },
      },
      yStress: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Stress Utilization (%)', font: { family: 'Inter', size: 11 } },
        grid: { drawOnChartArea: false },
        ticks: { font: { family: 'JetBrains Mono', size: 11 } },
      },
    },
  };

  return (
    <div className="w-full h-72">
      <Line data={data} options={options} />
    </div>
  );
}
