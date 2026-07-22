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

export default function MomentDiagramChart({ spanLength = 12.5, maxMoment = 612.4, maxShear = 245.8 }) {
  // Generate 25 data points along the span
  const steps = 25;
  const labels = [];
  const momentValues = [];
  const shearValues = [];

  const w = (8 * maxMoment) / (spanLength * spanLength); // approximate equivalent UDL

  for (let i = 0; i <= steps; i++) {
    const x = (spanLength / steps) * i;
    labels.push(`${x.toFixed(1)}m`);
    // Parabolic bending moment: M(x) = w*x*(L - x)/2
    const M = (w * x * (spanLength - x)) / 2;
    // Linear shear force: V(x) = w*(L/2 - x)
    const V = w * (spanLength / 2 - x);
    momentValues.push(M.toFixed(1));
    shearValues.push(V.toFixed(1));
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Bending Moment M(x) [kN·m]',
        data: momentValues,
        borderColor: '#1C6090',
        backgroundColor: 'rgba(28, 96, 144, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        yAxisID: 'yM',
      },
      {
        label: 'Shear Force V(x) [kN]',
        data: shearValues,
        borderColor: '#00A8CC',
        backgroundColor: 'transparent',
        borderDash: [3, 3],
        tension: 0.1,
        pointRadius: 0,
        yAxisID: 'yV',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: {
        grid: { color: 'rgba(27, 38, 49, 0.06)' },
        ticks: { font: { family: 'JetBrains Mono', size: 10 } },
        title: { display: true, text: 'Span Position x (m)', font: { family: 'Inter', size: 11 } }
      },
      yM: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Bending Moment (kN·m)', font: { family: 'Inter', size: 11 } },
        grid: { color: 'rgba(27, 38, 49, 0.06)' },
        ticks: { font: { family: 'JetBrains Mono', size: 10 } },
      },
      yV: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Shear Force (kN)', font: { family: 'Inter', size: 11 } },
        grid: { drawOnChartArea: false },
        ticks: { font: { family: 'JetBrains Mono', size: 10 } },
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Line data={data} options={options} />
    </div>
  );
}
