/////============= pefect working for web ==============================================


// import * as AuthSession from 'expo-auth-session';
// import * as GoogleAuthSession from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
// import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
// import { useEffect, useState } from 'react';
// import { Alert } from 'react-native';
// import { auth } from '../firebaseConfig'; // Confirm karein ke path sahi hai

// WebBrowser.maybeCompleteAuthSession();

// export const useGoogleAuth = (onSuccess: () => void) => {
//   const [loading, setLoading] = useState(false);

//   // ✨ Mobile (Android) ke liye scheme lazmi hai
//   const redirectUri = AuthSession.makeRedirectUri({
//     scheme: 'namaztracker', 
//     path: 'auth', 
//   });

//   const [request, response, promptAsync] = GoogleAuthSession.useAuthRequest({
//     // Android Client ID (Aapki screenshot wali)
//     androidClientId: "43455085448-mnltjis4q517g1qm0gajimf1i5rtt4jq.apps.googleusercontent.com",
    
//     // Web Client ID (Firebase handler ke liye zaroori)
//     webClientId: "43455085448-fd6imojkjtduu7cvbapjd7nce2cetb7b.apps.googleusercontent.com",
//     iosClientId: '43455085448-3vid2hrpicd10sso5v37v3ge1tv3qdri.apps.googleusercontent.com',
    
//     responseType: "id_token",
//     scopes: ['profile', 'email'],
//     redirectUri,
//     extraParams: {
//       prompt: 'select_account',
//       access_type: 'offline',
//     },
    
//   });

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const params = response.params as any; 
//       const id_token = params.id_token;
      
//       const authentication = response.authentication;
//       const finalToken = id_token || authentication?.idToken;

//       if (finalToken) {
//         loginToFirebase(finalToken);
//       }
//     }
//   }, [response]);

//   const loginToFirebase = async (token: string) => {
//     setLoading(true);
//     try {
//       const credential = GoogleAuthProvider.credential(token);
//       const result = await signInWithCredential(auth, credential);
//       Alert.alert("MashAllah ✨", `Assalam-u-Alaikum ${result.user.displayName}!`);
//       onSuccess();
//     } catch (error) {
//       console.error("Firebase Error:", error);
//       Alert.alert("Login Failed", "Firebase connection failed. Check your SHA-1 and Package Name.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { promptAsync, loading, request };
// };














// /////======================== for native mobile code==============////

import { useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

GoogleSignin.configure({
  webClientId: "43455085448-fd6imojkjtduu7cvbapjd7nce2cetb7b.apps.googleusercontent.com",
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export const useGoogleNativeAuth = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', message: '', actionType: '' });

  const signIn = async (onSuccess: () => void) => {
    try {
      await GoogleSignin.hasPlayServices();
      try { await GoogleSignin.signOut(); } catch (e) {}

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (idToken) {
        const credential = GoogleAuthProvider.credential(idToken);
        const result = await signInWithCredential(auth, credential);

        setAlertData({
          title: "مَا شَاءَ اللّٰهُ",
          message: `Welcome, ${result.user.displayName}. Your spiritual dashboard is ready.`,
          actionType: 'LOGIN'
        });
        setShowAlert(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async (onSuccess: () => void) => {
    try {
      await GoogleSignin.signOut();
      await firebaseSignOut(auth);

      setAlertData({
        title: "فِي أَمَانِ اللّٰه",
        message: "You have been successfully signed out. May your day be blessed.",
        actionType: 'LOGOUT'
      });
      setShowAlert(true);
    } catch (error) {
      console.error(error);
    }
  };

  return { signIn, logout, showAlert, setShowAlert, alertData };
};