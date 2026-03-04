


























// ---------------------------working code--------------------------------

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth"; // Simple getAuth
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDHK7kOQy5UeK-vbMECo4NEWUKYgoSRP1I",
//   authDomain: "islamic-companion-a14ea.firebaseapp.com",
//   projectId: "islamic-companion-a14ea",
//   storageBucket: "islamic-companion-a14ea.firebasestorage.app",
//   messagingSenderId: "43455085448",
//   appId: "1:43455085448:web:d0e99d52717df6f8f8983d",
//   measurementId: "G-9LTZK98EFF"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Simple export bina persistence ke (abhi ke liye error hatane ke liye)
// export const auth = getAuth(app);
// export const db = getFirestore(app);








































// gemini code
// firebaseConfig.ts
// --------------------------------------------working code ---------------------------------


// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDHK7kOQy5UeK-vbMECo4NEWUKYgoSRP1I",
//   authDomain: "islamic-companion-a14ea.firebaseapp.com",
//   projectId: "islamic-companion-a14ea",
//   storageBucket: "islamic-companion-a14ea.appspot.com",
//   messagingSenderId: "43455085448",
//   appId: "1:43455085448:web:d0e99d52717df6f8f8983d",
//   measurementId: "G-9LTZK98EFF"
// };

// const app = initializeApp(firebaseConfig);

// // ✅ SIMPLE AUTH (No persistence error)
// export const auth = getAuth(app);

// export const db = getFirestore(app); 



// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { initializeApp } from "firebase/app";

// // Firebase Auth imports
// import { initializeAuth } from "firebase/auth";

// // @ts-ignore - getReactNativePersistence exists in RN bundle but often missing from TS definitions
// import { getReactNativePersistence } from "firebase/auth";

// // Firestore
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDHK7kOQy5UeK-vbMECo4NEWUKYgoSRP1I",
//   authDomain: "islamic-companion-a14ea.firebaseapp.com",
//   projectId: "islamic-companion-a14ea",
//   storageBucket: "islamic-companion-a14ea.firebasestorage.app",
//   messagingSenderId: "43455085448",
//   appId: "1:43455085448:web:d0e99d52717df6f8f8983d",
// };

// // Initialize Firebase App
// const app = initializeApp(firebaseConfig);

// // Auth with persistence (React Native / Expo friendly)
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// // Agar sirf getAuth use karna ho to (fallback):
// // export const auth = getAuth(app); // lekin persistence ke liye upar wala behtar

// // Firestore
// export const db = getFirestore(app);
















  









// ---------------------------perfect working---------------------------------------
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHK7kOQy5UeK-vbMECo4NEWUKYgoSRP1I",
  authDomain: "islamic-companion-a14ea.firebaseapp.com",
  projectId: "islamic-companion-a14ea",
  storageBucket: "islamic-companion-a14ea.firebasestorage.app",
  messagingSenderId: "43455085448",
  appId: "1:43455085448:web:d0e99d52717df6f8f8983d",
};

// Step 1: Initialize App safely
let app: FirebaseApp;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// Step 2: Initialize Auth safely (Avoids 'undefined' error)
let auth: Auth;
try {
    // React Native ke liye persistence ke saath initialize karein
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} catch (e) {
    // Agar pehle se initialized hai toh simple getAuth use karein
    auth = getAuth(app);
}

const db: Firestore = getFirestore(app);

export { auth, db };










































