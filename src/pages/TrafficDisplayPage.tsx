import { useContext, useEffect, useState } from 'react';
import { getTrafficStats } from '../services/firebaseDataAccess';
import { type TrafficStats } from '../../shared';
import { Box, Container, Typography } from '@mui/material';
import { TrafficStatsChart } from '../components/dataDisplay';
import { TrafficStatsTable } from '../components/dataDisplay/table/TrafficStatsTable';
import { SortingSelector, FilterSelector } from '../components';
import { getLocalTrafficData } from '../data/insertData';
import { useTrafficDisplayPageStyles } from './trafficDisplayPageStyles';
import { useTrafficDataContext } from '../contexts/TrafficDataContext';

export const TrafficDisplayPage = () => {
  const { trafficData, isLoading, isError } = useTrafficDataContext();
  const [filteredData, setFilteredData] = useState<TrafficStats[]>(trafficData);
  const [sortedData, setSortedData] = useState<TrafficStats[]>(filteredData);

  useEffect(() => {
    setFilteredData(trafficData);
  }, [trafficData]);

  useEffect(() => {
    setSortedData(filteredData);
  }, [filteredData]);

  const classes = useTrafficDisplayPageStyles();

  return (
    <Container className={classes.pageContainer}>
      {isLoading ? (
        <Typography variant='h1' className={classes.loadingMessage}>
          Loading...
        </Typography>
      ) : isError ? (
        <Typography className={classes.errorMessage}>
          Failed to Load the data for the chart
        </Typography>
      ) : (
        <>
          <Box className={classes.upperPageContainer}>
            <Box className={classes.sortingAndFilteringContainer}>
              <FilterSelector
                recievedData={filteredData}
                setFilteredData={setFilteredData}
              />
              <SortingSelector
                recievedData={sortedData}
                setSortedData={setSortedData}
              />
            </Box>
            <TrafficStatsChart trafficData={sortedData} />
          </Box>
          <TrafficStatsTable trafficData={sortedData} />
        </>
      )}
    </Container>
  );
};
