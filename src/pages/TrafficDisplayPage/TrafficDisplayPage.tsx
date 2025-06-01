import { useEffect, useState } from 'react';
import { type SavedTrafficStats } from '../../../shared';
import { Box, Container, Typography } from '@mui/material';
import { TrafficStatsChart } from '../../components/dataDisplay';
import { TrafficStatsTable } from '../../components/dataDisplay/table/TrafficStatsTable';
import { SortingSelector, FilterSelector } from '../../components';
import { useTrafficDisplayPageStyles } from './trafficDisplayPageStyles';
import { useTrafficDataContext } from '../../contexts/TrafficDataContext';

export const TrafficDisplayPage = () => {
  const { trafficData, isLoading, isError } = useTrafficDataContext();
  const [filteredData, setFilteredData] =
    useState<SavedTrafficStats[]>(trafficData);
  const [sortedData, setSortedData] =
    useState<SavedTrafficStats[]>(filteredData);

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
                recievedData={trafficData}
                setFilteredData={setFilteredData}
              />
              <SortingSelector
                recievedData={filteredData}
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
