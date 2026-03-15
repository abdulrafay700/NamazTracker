

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ─────────────────────────────────────────────────────────────────────────────
// TRICK: TypeScript bypass using 'any' - runtime par ye module mil jata hai
// ─────────────────────────────────────────────────────────────────────────────
import * as firebaseAuth from 'firebase/auth';
const { getReactNativePersistence } = firebaseAuth as any;

const firebaseConfig = {
  apiKey: "AIzaSyDHK7kOQy5UeK-vbMECo4NEWUKYgoSRP1I",
  authDomain: "islamic-companion-a14ea.firebaseapp.com",
  projectId: "islamic-companion-a14ea",
  storageBucket: "islamic-companion-a14ea.firebasestorage.app",
  messagingSenderId: "43455085448",
  appId: "1:43455085448:web:d0e99d52717df6f8f8983d",
};

// 1. App Initialize (Check if already exists)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Auth Logic with Persistence
let auth: Auth;

// Agar pehle se koi app nahi thi (pehli baar initialize ho rahi hai)
if (getApps().length === 0) {
  try {
    if (getReactNativePersistence) {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } else {
      auth = getAuth(app);
    }
  } catch (error) {
    auth = getAuth(app);
  }
} else {
  // Agar app pehle se initialized hai, toh simple getAuth use karein
  auth = getAuth(app);
}

// 3. Firestore Initialize
const db = getFirestore(app);

export { auth, db };









// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getApp, getApps, initializeApp } from 'firebase/app';
// import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// // @ts-ignore - TypeScript ko ignore karne ke liye taake build fail na ho
// import { getReactNativePersistence } from 'firebase/auth/react-native';

// const firebaseConfig = {
//   apiKey: "AIzaSyDHK7kOQy5UeK-vbMECo4NEWUKYgoSRP1I",
//   authDomain: "islamic-companion-a14ea.firebaseapp.com",
//   projectId: "islamic-companion-a14ea",
//   storageBucket: "islamic-companion-a14ea.firebasestorage.app",
//   messagingSenderId: "43455085448",
//   appId: "1:43455085448:web:d0e99d52717df6f8f8983d",
// };

// // 1. App Initialize
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// // 2. Auth Logic with Persistence
// let auth: Auth;

// if (getApps().length === 0) {
//   try {
//     auth = initializeAuth(app, {
//       persistence: getReactNativePersistence(AsyncStorage),
//     });
//   } catch (error) {
//     auth = getAuth(app);
//   }
// } else {
//   auth = getAuth(app);
// }

// // 3. Firestore Initialize
// const db = getFirestore(app);

// export { auth, db };