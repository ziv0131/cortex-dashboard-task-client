import { useCallback, useEffect, useState } from 'react';
import { getTrafficStats } from '../services/firebaseDataAccess';
import type { SavedTrafficStats } from '../../shared';

export const useFetchTrafficData = (idToken: string) => {
  const [trafficData, setTrafficData] = useState<SavedTrafficStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(() => {
    getTrafficStats(idToken)
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

  useEffect(() => {
    fetchData();
  }, []);

  return { trafficData, setTrafficData, isLoading, isError, fetchData };
};
