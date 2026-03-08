




// import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
// import { View, Text, Animated, StyleSheet, Dimensions, Platform } from 'react-native';
// import * as Location from 'expo-location';
// import { AlertCircle } from 'lucide-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width } = Dimensions.get('window');
// const LocationContext = createContext<any>(null);

// export const LocationProvider = ({ children }: { children: ReactNode }) => {
//   const [location, setLocationState] = useState({ city: 'Loading...', country: '..' });
//   const [showToast, setShowToast] = useState(false);

//   // --- Animation Values ---
//   const toastOpacity = useRef(new Animated.Value(0)).current;
//   const toastTranslateY = useRef(new Animated.Value(-30)).current;

//   const API_KEY = "bdc_43d80688c3334ad8b97ef17f3d737e45";

//   // --- Custom Toast Logic ---
//   const triggerErrorToast = () => {
//     setShowToast(true);
//     Animated.parallel([
//       Animated.timing(toastOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
//       Animated.timing(toastTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
//     ]).start();

//     setTimeout(() => {
//       Animated.parallel([
//         Animated.timing(toastOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
//         Animated.timing(toastTranslateY, { toValue: -30, duration: 400, useNativeDriver: true }),
//       ]).start(() => setShowToast(false));
//     }, 4000);
//   };

//   // --- Persistent Location Setter ---
//   const setLocation = async (newLoc: { city: string, country: string }) => {
//     setLocationState(newLoc);
//     try {
//       await AsyncStorage.setItem('user_location', JSON.stringify(newLoc));
//     } catch (e) {
//       console.log("Storage Save Error:", e);
//     }
//   };

//   useEffect(() => {
//     const initializeLocation = async () => {
//       try {
//         // 1. Check if location is already saved in memory
//         const saved = await AsyncStorage.getItem('user_location');
//         if (saved) {
//           setLocationState(JSON.parse(saved));
//           // Agar data mil gaya, toh GPS chalane ki foran zaroorat nahi
//           return;
//         }

//         // 2. No saved data? Request GPS
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//           setLocation({ city: 'Permission Denied', country: 'Error' });
//           return;
//         }

//         let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        
//         // 3. Fetch from Big Data Cloud
//         const response = await fetch(
//           `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}&localityLanguage=en&key=${API_KEY}`
//         );

//         if (!response.ok) throw new Error("Network issue");

//         const data = await response.json();
//         const detectedLoc = {
//           city: data.city || data.locality || "Unknown City",
//           country: data.FCode || "PK"
//         };

//         setLocation(detectedLoc);

//       } catch (err) {
//         console.log("Location Flow Error:", err);
//         // Toast show karein aur purana data ya default dikhayein
//         triggerErrorToast();
//         // Agar network error ho aur saved data bhi na ho:
//         const savedBackup = await AsyncStorage.getItem('user_location');
//         if (!savedBackup) {
//           setLocationState({ city: 'Network Error', country: 'Offline' });
//         }
//       }
//     };

//     initializeLocation();
//   }, []);

//   return (
    
//     <LocationContext.Provider value={{ location, setLocation }}>
//       <View style={{ flex: 1 }}>
//         {children}

//         {/* --- CUSTOM ANIMATED TOAST UI --- */}
//         {showToast && (
//           <Animated.View 
//             style={[
//               styles.toastContainer, 
//               { 
//                 opacity: toastOpacity, 
//                 transform: [{ translateY: toastTranslateY }] 
//               }
//             ]}
//           >
//             <View style={styles.toastContent}>
//               <AlertCircle size={18} color="#ef4444" />
//               <View>
//                 <Text style={styles.toastTitle}>Location Error</Text>
//                 <Text style={styles.toastSubtitle}>Check internet / can't get location</Text>
//               </View>
//             </View>
//           </Animated.View>
//         )}
//       </View>
//     </LocationContext.Provider>
//   );
// };

// // ... Styles (Same as you provided)

// // --- STYLES ---
// const styles = StyleSheet.create({
//   toastContainer: {
//     position: 'absolute',
//     top: 60, // Screen ke top se thora neechay
//     width: width,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     zIndex: 9999,
//   },
//   toastContent: {
//     flexDirection: 'row',
//     backgroundColor: '#1f2937', // Dark Greyish Black
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 14,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#374151',
//     gap: 12,
//     elevation: 5, // Android shadow
//     shadowColor: '#000', // iOS shadow
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   toastTitle: {
//     color: '#f3f4f6',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   toastSubtitle: {
//     color: '#9ca3af',
//     fontSize: 12,
//   },
// });

// export const useLocation = () => {
//   const context = useContext(LocationContext);
//   if (!context) throw new Error("useLocation must be used within a LocationProvider");
//   return context;
// };

// export default function LocationContextDummy() { return null; }

























import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { AlertCircle } from 'lucide-react-native';
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const LocationContext = createContext<any>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocationState] = useState({ city: 'Loading...', country: '..' });
  const [showToast, setShowToast] = useState(false);

  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-30)).current;

  const API_KEY = "bdc_43d80688c3334ad8b97ef17f3d737e45";

  const triggerErrorToast = () => {
    setShowToast(true);
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(toastTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(toastTranslateY, { toValue: -30, duration: 400, useNativeDriver: true }),
      ]).start(() => setShowToast(false));
    }, 4000);
  };

  const setLocation = async (newLoc: { city: string, country: string }) => {
    setLocationState(newLoc);
    try {
      await AsyncStorage.setItem('user_location', JSON.stringify(newLoc));
    } catch (e) {
      console.log("Storage Save Error:", e);
    }
  };

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const saved = await AsyncStorage.getItem('user_location');
        if (saved) {
          setLocationState(JSON.parse(saved));
          return;
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocation({ city: 'KARACHI', country: 'PK' });
          return;
        }

        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}&localityLanguage=en&key=${API_KEY}`
        );

        if (!response.ok) throw new Error("Network issue");

        const data = await response.json();
        const detectedLoc = {
          city: data.city || data.locality || "Unknown City",
          country: data.countryCode || "PK" // <-- Back to Country Code (PK)
        };

        setLocation(detectedLoc);

      } catch (err) {
        triggerErrorToast();
        const savedBackup = await AsyncStorage.getItem('user_location');
        if (!savedBackup) {
          setLocationState({ city: 'Offline', country: 'Error' });
        }
      }
    };

    initializeLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation, triggerErrorToast }}>
      <View style={{ flex: 1 }}>
        {children}
        {showToast && (
          <Animated.View style={[styles.toastContainer, { opacity: toastOpacity, transform: [{ translateY: toastTranslateY }] }]}>
            <View style={styles.toastContent}>
              <AlertCircle size={18} color="#ef4444" />
              <View>
                <Text style={styles.toastTitle}>Location Error</Text>
                <Text style={styles.toastSubtitle}>Check internet / can't get location</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </LocationContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: { position: 'absolute', top: 60, width: width, paddingHorizontal: 20, alignItems: 'center', zIndex: 9999 },
  toastContent: { flexDirection: 'row', backgroundColor: '#1f2937', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, alignItems: 'center', borderWidth: 1, borderColor: '#374151', gap: 12, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 },
  toastTitle: { color: '#f3f4f6', fontSize: 14, fontWeight: '700' },
  toastSubtitle: { color: '#9ca3af', fontSize: 12 },
});

export const useLocation = () => useContext(LocationContext);