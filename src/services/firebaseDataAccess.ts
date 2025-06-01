import axios from 'axios';
import {
  savedTrafficStatSchema,
  type SavedTrafficStats,
  type TrafficStats,
} from '../../shared/models/TrafficStats';
import { NoRecievedIdError } from '../errors';
import { formatDateString } from '../utils';

const getHeaders = (idToken: string) => ({
  Authorization: `Bearer ${idToken}`,
  'Content-Type': 'application/json',
});

const axiosInstance = axios.create({
  maxRedirects: 0,
});

const baseUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL;

export const getTrafficStats = async (idToken: string) => {
  const recievedData: any[] = (
    await axiosInstance.get(`${baseUrl}/trafficStats`, {
      headers: getHeaders(idToken),
    })
  ).data;
  let validTrafficStats: SavedTrafficStats[] = [];
  recievedData.forEach((item) => {
    const result = savedTrafficStatSchema.safeParse(item);
    if (!result.success) {
      console.warn(`document: ${item?.id} was invalid: ${result.error.errors}`);
    } else {
      validTrafficStats.push(result.data);
    }
  });

  return validTrafficStats;
};

export const postTrafficStat = async (
  trafficStat: TrafficStats,
  idToken: string
) => {
  const formattedTrafficStat = {
    ...trafficStat,
    date: formatDateString(trafficStat.date),
  };
  const response = await axiosInstance.post(
    `${baseUrl}/trafficStats/add`,
    formattedTrafficStat,
    {
      headers: getHeaders(idToken),
    }
  );

  if (response.status !== 201) {
    const status = response.status;
    const { errorMessage } = response.data;
    throw new Error(
      `${
        errorMessage || 'Failed to add traffic stat'
      }. returned with status code: ${status}`
    );
  }

  const { id } = response.data;
  if (id) {
    console.log(`Traffic stat added successfully with the id: ${id}`);
    return id;
  }
  throw new NoRecievedIdError();
};

export const putTrafficStat = async (
  trafficStat: SavedTrafficStats,
  idToken: string
) => {
  const formattedTrafficStat = {
    ...trafficStat,
    date: formatDateString(trafficStat.date),
  };
  const response = await axiosInstance.put(
    `${baseUrl}/trafficStats/update/${trafficStat.id}`,
    formattedTrafficStat,
    {
      headers: getHeaders(idToken),
    }
  );

  if (response.status !== 200) {
    const status = response.status;
    const { errorMessage } = await response.data;
    throw new Error(
      `${
        errorMessage || 'Failed to update traffic stat'
      }. returned with status code: ${status}`
    );
  }
  console.log('Traffic stat updated successfully:');
};

export const removeTrafficStat = async (id: string, idToken: string) => {
  const response = await axiosInstance.delete(
    `${baseUrl}/trafficStats/delete/${id}`,
    {
      headers: getHeaders(idToken),
    }
  );

  if (response.status !== 200) {
    const status = response.status;
    const { errorMessage } = await response.data;
    throw new Error(
      `${
        errorMessage || 'Failed to delete traffic stat'
      }. returned with status code: ${status}`
    );
  }
  console.log('Traffic stat was deleted successfully:');
};
