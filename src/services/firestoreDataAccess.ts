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
import {
  savedTrafficStatSchema,
  type SavedTrafficStats,
  type TrafficStats,
} from '../../shared/models/TrafficStats';

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
