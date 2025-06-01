import { useEffect, useState } from 'react';
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
import { type TrafficStats } from '../../../../shared';
import { Box, Container, Typography } from '@mui/material';
import { ChartAggregationSelector } from './ChartAggregation/ChartAggregationSelector';
import type { ChartTrafficStats } from './ChartTrafficStats';
import { useChartStyles } from './chartStyles';
import { formatDateString } from '../../../utils';

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

export const TrafficStatsChart = ({
  trafficData,
}: TrafficStatsBarChartProps) => {
  const [chartTitle, setChartTitle] = useState<string>('daily user traffic');
  const [displayedTrafficStats, setDisplayedTrafficStats] = useState<
    ChartTrafficStats[]
  >(
    trafficData.map(({ date, visits }) => ({
      dateTitle: formatDateString(date),
      visits,
    }))
  );

  useEffect(() => {}, [displayedTrafficStats]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  const classes = useChartStyles(displayedTrafficStats.length);

  const chartData = {
    labels: displayedTrafficStats.map(({ dateTitle }) => dateTitle),
    datasets: [
      {
        data: displayedTrafficStats.map(({ visits }) => visits),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <Container className={classes.chartAreaContainer}>
      <Typography variant='h5' sx={{ alignSelf: 'center' }}>
        {chartTitle}
      </Typography>
      <Box className={classes.chartOutterContainer}>
        <Box className={classes.chartInnerContainer}>
          <Bar data={chartData} options={options} />
        </Box>
      </Box>
      <ChartAggregationSelector
        recievedData={trafficData}
        setChartTrafficData={setDisplayedTrafficStats}
        setChartTitle={setChartTitle}
      />
    </Container>
  );
};
