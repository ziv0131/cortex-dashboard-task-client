import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import {
  savedTrafficStatSchema,
  type SavedTrafficStats,
  type TrafficStats,
} from '../../shared/models/TrafficStats';
import { NoRecievedIdError } from '../errors';

const collectionRef = collection(db, 'trafficStats');

const getHeaders = (idToken: string) => ({
  Authorization: `Bearer ${idToken}`,
  'Content-Type': 'application/json',
});

const baseUrl = `https://${import.meta.env.VITE_FIREBASE_REGION}-${
  import.meta.env.VITE_FIREBASE_PROJECT_ID
}.cloudfunctions.net/`;

export const getTrafficStats = async (idToken: string) => {
  const recievedData: any[] = await axios.get(`${baseUrl}trafficStats`, {
    headers: getHeaders(idToken),
  });
  let validTrafficStats: SavedTrafficStats[] = [];
  recievedData.forEach((item) => {
    const result = savedTrafficStatSchema.safeParse({ item });
    if (!result.success) {
      console.warn(
        `document: ${item?.id} was invalid: ${result.error.errors.reduce(
          (acc: string, error) => (acc += `${error.message};`),
          ''
        )}`
      );
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
  const response = await axios.post(`${baseUrl}/trafficStats/add`, {
    headers: getHeaders(idToken),
    body: JSON.stringify(trafficStat),
  });

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

export const updateTrafficStat = async (
  trafficStat: SavedTrafficStats,
  idToken: string
) => {
  const response = await axios.put(
    `${baseUrl}/trafficStats/update`,
    {
      headers: getHeaders(idToken),
      body: JSON.stringify(trafficStat),
    },
    {
      params: {
        id: trafficStat.id,
      },
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
  const response = await axios.delete(`${baseUrl}/trafficStats/delete`, {
    params: {
      id,
    },

    headers: getHeaders(idToken),
  });

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
