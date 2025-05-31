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

const trafficData = [
  { date: '2025-03-02', visits: 140 },
  { date: '2025-03-03', visits: 98 },
  { date: '2025-03-04', visits: 132 },
  { date: '2025-03-05', visits: 101 },
  { date: '2025-03-06', visits: 87 },
  { date: '2025-03-07', visits: 94 },
  { date: '2025-03-08', visits: 178 },
  { date: '2025-03-09', visits: 164 },
  { date: '2025-03-10', visits: 112 },
  { date: '2025-03-11', visits: 106 },
  { date: '2025-03-12', visits: 133 },
  { date: '2025-03-13', visits: 90 },
  { date: '2025-03-14', visits: 124 },
  { date: '2025-03-15', visits: 110 },
  { date: '2025-03-16', visits: 175 },
  { date: '2025-03-17', visits: 188 },
  { date: '2025-03-18', visits: 147 },
  { date: '2025-03-19', visits: 133 },
  { date: '2025-03-20', visits: 119 },
  { date: '2025-03-21', visits: 102 },
  { date: '2025-03-22', visits: 111 },
  { date: '2025-03-23', visits: 154 },
  { date: '2025-03-24', visits: 162 },
  { date: '2025-03-25', visits: 120 },
  { date: '2025-03-26', visits: 108 },
  { date: '2025-03-27', visits: 113 },
  { date: '2025-03-28', visits: 95 },
  { date: '2025-03-29', visits: 142 },
  { date: '2025-03-30', visits: 170 },
  { date: '2025-03-31', visits: 128 },
  { date: '2025-04-01', visits: 105 },
  { date: '2025-04-02', visits: 87 },
  { date: '2025-04-03', visits: 156 },
  { date: '2025-04-04', visits: 131 },
  { date: '2025-04-05', visits: 122 },
  { date: '2025-04-06', visits: 149 },
  { date: '2025-04-07', visits: 95 },
  { date: '2025-04-08', visits: 143 },
  { date: '2025-04-09', visits: 137 },
  { date: '2025-04-10', visits: 128 },
  { date: '2025-04-11', visits: 109 },
  { date: '2025-04-12', visits: 117 },
  { date: '2025-04-13', visits: 138 },
  { date: '2025-04-14', visits: 160 },
  { date: '2025-04-15', visits: 151 },
  { date: '2025-04-16', visits: 100 },
  { date: '2025-04-17', visits: 134 },
  { date: '2025-04-18', visits: 141 },
  { date: '2025-04-19', visits: 108 },
  { date: '2025-04-20', visits: 157 },
  { date: '2025-04-21', visits: 120 },
  { date: '2025-04-22', visits: 99 },
  { date: '2025-04-23', visits: 126 },
  { date: '2025-04-24', visits: 153 },
  { date: '2025-04-25', visits: 115 },
  { date: '2025-04-26', visits: 130 },
  { date: '2025-04-27', visits: 98 },
  { date: '2025-04-28', visits: 118 },
  { date: '2025-04-29', visits: 167 },
  { date: '2025-04-30', visits: 148 },
];

export const getLocalTrafficData = async () => {
  return trafficData.map(({ date, visits }) => ({
    date: new Date(date),
    visits,
  }));
};

const collRef = collection(db, 'trafficStats');

export const insertTrafficData = async () => {
  let insertedCounter = 0;
  const colRef = collection(db, 'trafficStats');

  for (let entry of trafficData) {
    try {
      await addDoc(colRef, entry);
      insertedCounter++;
    } catch (error) {
      console.error(error);
    }
  }

  return insertedCounter === trafficData.length;
};

export const getDocumentCount = async () => {
  try {
    const snapshot = await getCountFromServer(collRef);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error fetching document count:', error);
  }
};

export const deleteDuplicates = async () => {
  const snapshot = await getDocs(collRef);
  const dateMap = new Map<string, string[]>();

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const date = data.date;
    if (dateMap.has(date)) {
      dateMap.get(date)!.push(docSnap.id);
    } else {
      dateMap.set(date, [docSnap.id]);
    }
  });

  for (const [date, ids] of dateMap.entries()) {
    if (ids.length > 1) {
      // Keep the first document, delete the rest
      const [_keepId, ...deleteIds] = ids;
      for (const id of deleteIds) {
        await deleteDoc(doc(db, 'trafficStats', id));
        return true;
      }
    }
  }
};
