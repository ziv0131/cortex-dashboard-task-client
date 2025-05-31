import { db } from '../firebase';
import {
  collection,
  setDoc,
  doc,
  addDoc,
  getCountFromServer,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import axios from 'axios';
import {
  savedTrafficStatSchema,
  type SavedTrafficStats,
  type TrafficStats,
} from '../../shared/models/TrafficStats';
import { NoRecievedIdError } from '../errors';

const collectionRef = collection(db, 'trafficStats');

export const getTrafficStats = async () => {
  const snapshot = await getDocs(collectionRef);
  const data: SavedTrafficStats[] = [];
  snapshot.forEach((doc) => {
    const result = savedTrafficStatSchema.safeParse({
      id: doc.id,
      ...doc.data(),
    });
    if (!result.success) {
      console.warn(
        `document: ${doc.id} was invalid: ${result.error.errors.reduce(
          (acc: string, error) => (acc += `${error.message};`),
          ''
        )}`
      );
    } else {
      data.push(result.data);
    }
  });

  return data;
};

export const postTrafficStat = async (trafficStat: TrafficStats) => {
  const response = await axios.post(
    `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-${
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    }.cloudfunctions.net/trafficStats/add`,
    {
      headers: {
        // implement auth
      },
      body: JSON.stringify(trafficStat),
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

export const updateTrafficStat = async (trafficStat: SavedTrafficStats) => {
  const response = await axios.put(
    `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-${
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    }.cloudfunctions.net/trafficStats/update`,
    {
      headers: {
        // implement auth
      },
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

export const removeTrafficStat = async (id: string) => {
  const response = await axios.delete(
    `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-${
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    }.cloudfunctions.net/trafficStats/delete`,
    {
      params: {
        id,
      },
      headers: {
        // implement auth
      },
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
