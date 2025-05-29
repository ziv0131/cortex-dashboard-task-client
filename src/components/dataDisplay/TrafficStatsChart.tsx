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
import { type TrafficStats } from '../../../shared';
import { formatDateString } from '../../utils';
import { Container } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TrafficStatsBarChartProps {
  trafficData: TrafficStats[];
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'User traffic per day',
    },
    legend: {
      position: 'top' as const,
    },
  },
};

export const TrafficStatsChart = React.memo(
  ({ trafficData }: TrafficStatsBarChartProps) => {
    const chartData = {
      labels: trafficData.map(({ date }) => formatDateString(date)),
      datasets: [
        {
          label: 'Daily visits',
          data: trafficData.map(({ visits }) => visits),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
    return (
      <Container sx={{ width: '500px', height: '500px' }}>
        <Bar data={chartData} options={options} />
      </Container>
    );
  }
);
