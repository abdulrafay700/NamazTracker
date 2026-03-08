// // LocationContext.tsx
// import React, { createContext, useContext, useState, ReactNode } from 'react';

// const LocationContext = createContext<any>(null); 

// export const LocationProvider = ({ children }: { children: ReactNode }) => {
//   // Shuru mein hum khali chor sakte hain ya default rakh sakte hain
//   const [location, setLocation] = useState({ city: 'Loading...', country: '..' });

//   return (
//     <LocationContext.Provider value={{ location, setLocation }}>
//       {children}
//     </LocationContext.Provider>
//   );
// };

// export const useLocation = () => {
//   const context = useContext(LocationContext);
//   if (!context) throw new Error("useLocation must be used within a LocationProvider");
//   return context;
// };

// export default function LocationContextDummy() { return null; }







import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { AlertCircle } from 'lucide-react-native'; // Icon ke liye

const { width } = Dimensions.get('window');
const LocationContext = createContext<any>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState({ city: 'Detecting...', country: '..' });
  const [showToast, setShowToast] = useState(false);

  // --- Animation Values ---
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-30)).current;

  // --- BIG DATA CLOUD API KEY ---
  const API_KEY = "bdc_43d80688c3334ad8b97ef17f3d737e45";

  // --- Toast Show/Hide Logic ---
  const triggerErrorToast = () => {
    setShowToast(true);
    // Animation IN
    Animated.parallel([
      Animated.timing(toastOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(toastTranslateY, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();

    // 4 seconds baad Hide
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(toastTranslateY, { toValue: -30, duration: 400, useNativeDriver: true }),
      ]).start(() => setShowToast(false));
    }, 4000);
  };

  useEffect(() => {
    (async () => {
      try {
        // 1. Permission Check
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocation({ city: 'Permission Denied', country: 'Error' });
          return;
        }

        // 2. Lat/Long Get
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { latitude, longitude } = loc.coords;

        // 3. API Fetch
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=${API_KEY}`
        );

        if (!response.ok) throw new Error("Network issue");

        const data = await response.json();
        
        // 4. Update State
        setLocation({
          city: data.city || data.locality || "Unknown City",
          country: data.countryName || "Unknown Country"
        });

      } catch (err) {
        console.log("Location Error:", err);
        // Error par toast trigger hoga
        triggerErrorToast();
        setLocation({ city: 'Network Error', country: 'Offline' });
      }
    })();
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      <View style={{ flex: 1 }}>
        {children}

        {/* --- CUSTOM ANIMATED TOAST UI --- */}
        {showToast && (
          <Animated.View 
            style={[
              styles.toastContainer, 
              { 
                opacity: toastOpacity, 
                transform: [{ translateY: toastTranslateY }] 
              }
            ]}
          >
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

// --- STYLES ---
const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60, // Screen ke top se thora neechay
    width: width,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    backgroundColor: '#1f2937', // Dark Greyish Black
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    gap: 12,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toastTitle: {
    color: '#f3f4f6',
    fontSize: 14,
    fontWeight: '700',
  },
  toastSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
  },
});

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used within a LocationProvider");
  return context;
};

export default function LocationContextDummy() { return null; }