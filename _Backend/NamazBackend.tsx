//     import { db, auth } from '../firebaseConfig'; // Aapki firebase config file
// import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// export const NamazBackend = {
//   // 1. Start Date Save/Get (Calendar initialization)
//   saveStartDate: async (date: string) => {
//     const userId = auth.currentUser?.uid;
//     if (!userId) return;
//     await setDoc(doc(db, "users", userId), { trackingStartDate: date }, { merge: true });
//   },

//   // 2. Daily Prayer Status Sync (Tap hone par cloud pe save)
//   syncDailyStatus: async (date: string, status: any) => {
//     const userId = auth.currentUser?.uid;
//     if (!userId) return;
//     const dayRef = doc(db, "users", userId, "prayer_logs", date);
//     await setDoc(dayRef, { ...status, updatedAt: new Date().toISOString() });
//   },

//   // 3. Pura Data Fetch Karna (New device login par)
//   fetchAllHistory: async () => {
//     const userId = auth.currentUser?.uid;
//     if (!userId) return { logs: {}, startDate: null };
    
//     // User profile se start date uthana
//     const userSnap = await getDoc(doc(db, "users", userId));
//     const startDate = userSnap.exists() ? userSnap.data().trackingStartDate : null;

//     // Saari history fetch karna
//     const logsSnap = await getDocs(collection(db, "users", userId, "prayer_logs"));
//     const logs: any = {};
//     logsSnap.forEach((doc) => {
//       logs[doc.id] = doc.data();
//     });

//     return { logs, startDate };
//   }
// };







/// NamazBackend.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export type NamazName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
export const defaultStatus: Record<NamazName, boolean> = { 
  Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false 
};

export const getLocalDateString = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

// 1. Save Start Date (Cloud + Local)
export const saveStartDate = async (date: string) => {
  await AsyncStorage.setItem('tracking_start_date', date);
  const userId = auth.currentUser?.uid;
  if (userId) {
    await setDoc(doc(db, "users", userId), { trackingStartDate: date }, { merge: true });
  }
};

// 2. Sync Daily Status (Offline First)
export const syncDailyStatus = async (date: string, status: Record<NamazName, boolean>) => {
  try {
    // Pehle local save karein taake offline mein data rahe
    await AsyncStorage.setItem(`status_${date}`, JSON.stringify(status));
    
    // Agar login hai to cloud pe bheinjein
    const userId = auth.currentUser?.uid;
    if (userId) {
      const dayRef = doc(db, "users", userId, "prayer_logs", date);
      await setDoc(dayRef, { ...status, updatedAt: new Date().toISOString() }, { merge: true });
    }
    return true;
  } catch (e) {
    console.error("Sync Error:", e);
    return false;
  }
};

// 3. Fetch All History (Jab naya login ho)
export const fetchAllHistory = async (setStartDate: Function) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  try {
    const userSnap = await getDoc(doc(db, "users", userId));
    if (userSnap.exists()) {
      const cloudDate = userSnap.data().trackingStartDate;
      if (cloudDate) {
        await AsyncStorage.setItem('tracking_start_date', cloudDate);
        setStartDate(cloudDate);
      }
    }

    const logsSnap = await getDocs(collection(db, "users", userId, "prayer_logs"));
    for (const d of logsSnap.docs) {
      await AsyncStorage.setItem(`status_${d.id}`, JSON.stringify(d.data()));
    }
  } catch (e) {
    console.error("Fetch Error:", e);
  }
};