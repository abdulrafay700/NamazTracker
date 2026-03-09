


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getApp, getApps, initializeApp } from 'firebase/app';
// import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// // ─────────────────────────────────────────────────────────────────────────────
// // TRICK: TypeScript ko bypass karne ke liye hum 'any' cast use karenge
// // kyunki Firebase v10 ki types mein getReactNativePersistence kabhi milta hai kabhi nahi
// // ─────────────────────────────────────────────────────────────────────────────
// import * as firebaseAuth from 'firebase/auth';
// const { getReactNativePersistence } = firebaseAuth as any;

// const firebaseConfig = {
//   apiKey: "AIzaSyDHK7kOQy5UeK-vbMECo4NEWUKYgoSRP1I",
//   authDomain: "islamic-companion-a14ea.firebaseapp.com",
//   projectId: "islamic-companion-a14ea",
//   storageBucket: "islamic-companion-a14ea.firebasestorage.app",
//   messagingSenderId: "43455085448",
//   appId: "1:43455085448:web:d0e99d52717df6f8f8983d",
// };

//   // 1. App Initialize karein
//   const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

//   // 2. Auth Logic with Persistence
//   let auth: Auth;

//   if (getApps().length > 0) {
//     auth = getAuth(app);
//   } else {
//     try {
//       // Agar getReactNativePersistence mil jata hai (jo ke runtime pe mil jayega)
//       if (getReactNativePersistence) {
//         auth = initializeAuth(app, {
//           persistence: getReactNativePersistence(AsyncStorage),
//         });
//       } else {
//         auth = getAuth(app);
//       }
//     } catch (error) {
//       // Agar already initialized ka error aaye
//       auth = getAuth(app);
//     }
//   }

//   const db = getFirestore(app);

//   export { auth, db };




















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
