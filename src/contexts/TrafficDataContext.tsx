import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { SavedTrafficStats, TrafficStats } from '../../shared';
import {
  getTrafficStats,
  postTrafficStat,
  removeTrafficStat,
} from '../services/firebaseDataAccess';
import { useFetchTrafficData } from '../hooks/useFetchTrafficData';
import { NoRecievedIdError } from '../errors';

export const TrafficDataContext = createContext<
  | {
      trafficData: SavedTrafficStats[];
      isError: boolean;
      isLoading: boolean;
      addTrafficStat: (trafficStat: TrafficStats) => Promise<string>;
      updateTrafficStat: (trafficStat: SavedTrafficStats) => Promise<string>;
      deleteTrafficStat: (id: string) => Promise<string>;
    }
  | undefined
>(undefined);

interface ContextProviderProps {
  children: ReactNode;
}

export const useTrafficDataContext = () => {
  const context = useContext(TrafficDataContext);
  if (!context) {
    throw new Error(
      'useTrafficDataContext must be used within a MyContextProvider'
    );
  }
  return context;
};

export const TrafficDataProvider = ({ children }: ContextProviderProps) => {
  const { trafficData, setTrafficData, isLoading, isError, fetchData } =
    useFetchTrafficData();

  const addTrafficStat = useCallback(async (trafficStat: TrafficStats) => {
    try {
      const id = await postTrafficStat(trafficStat);
      setTrafficData([...trafficData, { id, ...trafficStat }]);
      return '';
    } catch (error) {
      if (error instanceof NoRecievedIdError) {
        fetchData();
        return '';
      }
      const baseErrorMessage = 'There was an error adding the traffic stat';
      console.error(`${baseErrorMessage}: `, error);
      return baseErrorMessage;
    }
  }, []);

  const updateTrafficStat = useCallback(
    async (trafficStat: SavedTrafficStats) => {
      try {
        await postTrafficStat(trafficStat);
        setTrafficData([...trafficData, trafficStat]);
        return '';
      } catch (error) {
        const baseErrorMessage = 'There was an error updating the traffic stat';
        console.error(`${baseErrorMessage}: `, error);
        return baseErrorMessage;
      }
    },
    []
  );

  const deleteTrafficStat = useCallback(async (id: string) => {
    try {
      await removeTrafficStat(id);
      setTrafficData(trafficData.filter((ts) => ts.id !== id));
      return '';
    } catch (error) {
      const baseErrorMessage = 'There was an error deleting the traffic stat';
      console.error(`${baseErrorMessage}: `, error);
      return baseErrorMessage;
    }
  }, []);

  return (
    <TrafficDataContext.Provider
      value={{
        trafficData,
        isLoading,
        isError,
        addTrafficStat,
        updateTrafficStat,
        deleteTrafficStat,
      }}
    >
      {children}
    </TrafficDataContext.Provider>
  );
};
