/////============= pefect working for web==============================================


// import * as AuthSession from 'expo-auth-session';
// import * as GoogleAuthSession from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
// import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
// import { useEffect, useState } from 'react';
// import { Alert } from 'react-native';
// import { auth } from '../firebaseConfig';

// WebBrowser.maybeCompleteAuthSession();

// export const useGoogleAuth = (onSuccess: () => void) => {
//   const [loading, setLoading] = useState(false);

//   // ✨ Wahi redirect logic jo aapka working tha
//   const redirectUri = AuthSession.makeRedirectUri({
//     path: 'auth', 
//   });

//   const [request, response, promptAsync] = GoogleAuthSession.useAuthRequest({
//     androidClientId: "43455085448-mnltjis4q517g1qm0gajimf1i5rtt4jq.apps.googleusercontent.com",
//     webClientId: "43455085448-fd6imojkjtduu7cvbapjd7nce2cetb7b.apps.googleusercontent.com",
//     responseType: "id_token",
//     scopes: ['profile', 'email'],
//     redirectUri,
//     extraParams: {
//       prompt: 'select_account',
//     },
//   });

//   useEffect(() => {
//     // ✨ TypeScript Fix: Check karein ke response 'success' hai
//     if (response?.type === 'success') {
//       // params ko 'any' cast kar rahe hain taake 'id_token' ka error khatam ho jaye bina logic badle
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
//       Alert.alert("Login Failed", "Firebase connection failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { promptAsync, loading, request };
// };




















import * as AuthSession from 'expo-auth-session';
import * as GoogleAuthSession from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { auth } from '../firebaseConfig'; // Confirm karein ke path sahi hai

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  // ✨ Mobile (Android) ke liye scheme lazmi hai
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'namaztracker', 
    path: 'auth', 
  });

  const [request, response, promptAsync] = GoogleAuthSession.useAuthRequest({
    // Android Client ID (Aapki screenshot wali)
    androidClientId: "43455085448-mnltjis4q517g1qm0gajimf1i5rtt4jq.apps.googleusercontent.com",
    
    // Web Client ID (Firebase handler ke liye zaroori)
    webClientId: "43455085448-fd6imojkjtduu7cvbapjd7nce2cetb7b.apps.googleusercontent.com",
    iosClientId: '43455085448-3vid2hrpicd10sso5v37v3ge1tv3qdri.apps.googleusercontent.com',
    
    responseType: "id_token",
    scopes: ['profile', 'email'],
    redirectUri,
    extraParams: {
      prompt: 'select_account',
    },
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const params = response.params as any; 
      const id_token = params.id_token;
      
      const authentication = response.authentication;
      const finalToken = id_token || authentication?.idToken;

      if (finalToken) {
        loginToFirebase(finalToken);
      }
    }
  }, [response]);

  const loginToFirebase = async (token: string) => {
    setLoading(true);
    try {
      const credential = GoogleAuthProvider.credential(token);
      const result = await signInWithCredential(auth, credential);
      Alert.alert("MashAllah ✨", `Assalam-u-Alaikum ${result.user.displayName}!`);
      onSuccess();
    } catch (error) {
      console.error("Firebase Error:", error);
      Alert.alert("Login Failed", "Firebase connection failed. Check your SHA-1 and Package Name.");
    } finally {
      setLoading(false);
    }
  };

  return { promptAsync, loading, request };
};