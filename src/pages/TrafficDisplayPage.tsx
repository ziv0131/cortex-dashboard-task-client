import React, { useEffect, useMemo, useState } from 'react';
import { getTrafficStats } from '../services/firestoreDataAccess';
import { type TrafficStats } from '../../shared';
import { Box, Container, Radio, RadioGroup, Typography } from '@mui/material';
import { TrafficStatsChart } from '../components/dataDisplay';
import { TrafficStatsTable } from '../components/dataDisplay/TrafficStatsTable';
import type { SortingOption } from '../models';
import { SortingSelector } from '../components';

export const TrafficDisplayPage = () => {
  const [trafficData, setTrafficData] = useState<TrafficStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [sortStatus, setSortStatus] = useState<SortingOption>('date');

  const trafficSortedByDate = useMemo(
    () => trafficData.sort((a, b) => a.date.getTime() - b.date.getTime()),
    [trafficData]
  );

  const trafficSortedByVisits = useMemo(
    () => trafficData.sort((a, b) => a.visits - b.visits),
    [trafficData]
  );

  const sortedDataDict = {
    none: trafficData,
    date: trafficSortedByDate,
    visits: trafficSortedByVisits,
  };

  useEffect(() => {
    getTrafficStats()
      .then((data) => {
        setTrafficData(data);
      })
      .catch((error) => {
        console.error(error);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Container>
      <Box>
        <SortingSelector
          sortStatus={sortStatus}
          setSortStatus={setSortStatus}
        />
      </Box>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : isError ? (
        <Typography>Failed to Load the data for the chart</Typography>
      ) : (
        <div>
          <TrafficStatsChart trafficData={sortedDataDict[sortStatus]} />
          <TrafficStatsTable trafficData={sortedDataDict[sortStatus]} />
        </div>
      )}
    </Container>
  );
};
