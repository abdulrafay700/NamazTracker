// ======================================= perfect code ==============================================

// import * as Location from 'expo-location';
// import { useRouter } from "expo-router";
// import { Bell, BookOpen, Calculator, Calendar, Clock, HelpingHand, MapPin, Menu, ShieldCheck, Star } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import { Dimensions, Platform, StatusBar as RNStatusBar, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import SideDashboard from './screens/SideDashboard';

// const { width } = Dimensions.get('window');
// const cardWidth = (width - 60) / 2;

// export default function Home() {
//   const router = useRouter();
//   const [menuVisible, setMenuVisible] = useState(false);
  
//   const [locationName, setLocationName] = useState("Loading...");
//   const [islamicDate, setIslamicDate] = useState("");
//   const [englishDate, setEnglishDate] = useState("");
//   const [nextPrayer, setNextPrayer] = useState({ name: "...", time: "..." });

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setLocationName("Permission Denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = location.coords;

//       let address = await Location.reverseGeocodeAsync({ latitude, longitude });
//       if (address.length > 0) {
//         const item = address[0];
//         setLocationName(`${item.city?.toUpperCase() || 'UNKNOWN'}, ${item.isoCountryCode || 'PK'}`);
//       }

//       try {
//         const response = await fetch(
//           `https://api.aladhan.com/v1/timingsByAddress?address=${latitude},${longitude}&method=1`
//         );
//         const data = await response.json();
        
//         if (data.code === 200) {
//           const hijri = data.data.date.hijri;
//           const greg = data.data.date.gregorian;
//           const timings = data.data.timings;
          
//           setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
//           setEnglishDate(`${greg.weekday.en}, ${greg.day} ${greg.month.en}`);
          
//           updateUpcomingPrayer(timings);
//         }
//       } catch (error) {
//         console.error("API Error:", error);
//       }
//     })();
//   }, []);

//   const updateUpcomingPrayer = (timings: any) => {
//     const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
//     const now = new Date();
//     const currentMinutes = now.getHours() * 60 + now.getMinutes();

//     for (let name of prayerOrder) {
//       const timeParts = timings[name].split(':');
//       const pHours = parseInt(timeParts[0], 10);
//       const pMins = parseInt(timeParts[1], 10);
//       const prayerMinutes = pHours * 60 + pMins;

//       if (prayerMinutes > currentMinutes) {
//         setNextPrayer({ name, time: timings[name] });
//         return;
//       }
//     }
//     setNextPrayer({ name: "Fajr", time: timings["Fajr"] });
//   };

//   const cards = [
//     { title: "Namaz\nTracker", icon: <Calendar color="#10b981" size={30} />, route: "/screens/namaztracker" },
//     { title: "Tasbeeh\nCounter", icon: <Calculator color="#10b981" size={30} />, route: "/screens/tasbeeh" },
//     { title: "Daily\nDuain", icon: <HelpingHand color="#10b981" size={30} />, route: "/duain" },
//     { title: "Hajj &\nUmrah", icon: <ShieldCheck color="#10b981" size={30} />, route: "/hajj" },
//     { title: "Islamic\nBooks", icon: <BookOpen color="#10b981" size={30} />, route: "/books" },
//     { title: "Wazifa\nCollection", icon: <Star color="#10b981" size={30} />, route: "/wazifa" },
//   ];

//   return (
//     <SafeAreaView style={styles.mainWrapper}>
//       <StatusBar barStyle="light-content" />
//       <SideDashboard visible={menuVisible} onClose={() => setMenuVisible(false)} />

//       {/* TOP BAR: Ab ye ScrollView se bahar hai, is liye scroll nahi hoga */}
//       <View style={styles.topBar}>
//         <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.burgerBtn}>
//           <Menu size={28} color="#10b981" />
//         </TouchableOpacity>

//         <View style={styles.locationInfo}>
//           <View style={styles.locRow}>
//             <MapPin size={14} color="#10b981" />
//             <Text style={styles.cityText}>{locationName}</Text>
//           </View>
//           <Text style={styles.dateText}>{englishDate}</Text>
//           <Text style={styles.islamicDateText}>{islamicDate}</Text>
//         </View>

//         <TouchableOpacity style={styles.notifBtn}>
//           <Bell size={22} color="#10b981" />
//         </TouchableOpacity>
//       </View>

//       {/* SCROLLABLE CONTENT */}
//       <ScrollView 
//         style={styles.mainScroll} 
//         contentContainerStyle={styles.scrollContent} 
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.heroCard}>
//           <View style={styles.nextPrayerBadge}>
//              <Clock size={14} color="#000" />
//              <Text style={styles.nextPrayerText}>
//                UPCOMING: <Text style={{fontWeight: '800' ,fontSize:16}}>{nextPrayer.name} at {nextPrayer.time}</Text>
//              </Text>
//           </View>
//           <Text style={styles.heroArabicText}>اَلصَّلٰوةُ خَيْرٌ مِّنَ النَّوْمِ</Text>
//           <Text style={styles.heroSubText}>Prayer is better than sleep</Text>
//         </View>

//         <View style={styles.grid}>
//           {cards.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               activeOpacity={0.7}
//               style={styles.card}
//               onPress={() => item.route && router.push(item.route as any)}
//             >
//               <View style={styles.iconContainer}>{item.icon}</View>
//               <Text style={styles.cardText}>{item.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <TouchableOpacity style={styles.soonCard}>
//            <Text style={styles.soonText}>🚀 More Updates Coming Soon</Text>
//         </TouchableOpacity>
//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//  mainWrapper: { 
//     flex: 1, 
//     backgroundColor: "#000000",
//     // Android ke liye status bar height aur iOS ke liye 0
//     paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 
//   },
  
//   // Header Section Fixed
//   topBar: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: '#000',
//     zIndex: 10,
//     // iOS ke liye mazeed safety agar notch ka masla ho
//     marginTop: Platform.OS === 'ios' ? 10 : 0, 
//   },
  
//   locationInfo: { flex: 1, alignItems: 'center' },
//   burgerBtn: { width: 40, alignItems: 'flex-start' },
//   notifBtn: { width: 40, alignItems: 'flex-end' },
  
//   mainScroll: { flex: 1 },
//  scrollContent: { 
//     padding: 20, 
//     paddingTop: 10 
//   }, // Padding kam kar di kyunke header bahar hai
  
//   locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   cityText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
//   dateText: { color: '#A0A0A0', fontSize: 11, marginTop: 2 },
//   islamicDateText: { color: '#10b981', fontSize: 12, fontWeight: '700', marginTop: 1, textTransform: 'uppercase' },
  
//   heroCard: { backgroundColor: '#0a0a0a', padding: 25, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#111', marginBottom: 35 },
//   nextPrayerBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffae00', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 20 },
//   nextPrayerText: { color: '#000', fontSize: 15, fontWeight: '600' },
//   heroArabicText: { color: '#10b981', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
//   heroSubText: { color: '#666', marginTop: 10, fontSize: 13, fontStyle: 'italic' },
  
//   grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   card: {
//     backgroundColor: "#111111", width: cardWidth, height: 160, padding: 15, borderRadius: 24, marginBottom: 20,
//     borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", justifyContent: "center", alignItems: "center",
//   },
//   iconContainer: { width: 60, height: 60, borderRadius: 20, backgroundColor: "rgba(16, 185, 129, 0.1)", justifyContent: "center", alignItems: "center", marginBottom: 15 },
//   cardText: { fontSize: 15, fontWeight: "700", color: "#ffffff", textAlign: "center" },
//   soonCard: { backgroundColor: "#064e3b", padding: 18, borderRadius: 20, marginTop: 10, alignItems: "center", borderWidth: 1, borderColor: "#10b981" },
//   soonText: { color: "#ffffff", fontSize: 14, fontWeight: "600" },

// });



























//=============================try to get fast speed location=================================================/

// import * as Location from 'expo-location';
// import { useRouter } from "expo-router";
// import { Bell, BookOpen, Calculator, Calendar, Clock, HelpingHand, MapPin, Menu, ShieldCheck, Star } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import { Dimensions, Platform, StatusBar as RNStatusBar, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import SideDashboard from './screens/SideDashboard';

// const { width } = Dimensions.get('window');
// const cardWidth = (width - 60) / 2;

// export default function Home() {
//   const router = useRouter();
//   const [menuVisible, setMenuVisible] = useState(false);
  
//   const [locationName, setLocationName] = useState("Loading...");
//   const [islamicDate, setIslamicDate] = useState("");
//   const [englishDate, setEnglishDate] = useState("");
//   const [nextPrayer, setNextPrayer] = useState({ name: "...", time: "..." });

//   useEffect(() => {
//     const fetchLocationData = async () => {
//       try {
//         // 1. Tezi se Permission check karein
//         let { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//           setLocationName("Permission Denied");
//           return;
//         }

//         // 2. FAST FIX: Pehle Last Known Position check karein (Instant loading ke liye)
//         let location = await Location.getLastKnownPositionAsync({});
        
//         // Agar last known nahi mili, toh Low Accuracy ke sath current position lain
//         if (!location) {
//           location = await Location.getCurrentPositionAsync({
//             accuracy: Location.Accuracy.Low, // Sab se fast mode
//           });
//         }

//         const { latitude, longitude } = location.coords;

//         // 3. Parallel Execution: Location name aur Prayer times sath sath load karein
//         Promise.all([
//            Location.reverseGeocodeAsync({ latitude, longitude }),
//            fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${latitude},${longitude}&method=1`)
//         ]).then(async ([address, response]) => {
//             // Set City Name
//             if (address && address.length > 0) {
//               const item = address[0];
//               setLocationName(`${item.city?.toUpperCase() || 'UNKNOWN'}, ${item.isoCountryCode || 'PK'}`);
//             }

//             // Set Prayer Data
//             const data = await response.json();
//             if (data.code === 200) {
//               const { hijri, gregorian } = data.data.date;
//               const timings = data.data.timings;
              
//               setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
//               setEnglishDate(`${gregorian.weekday.en}, ${gregorian.day} ${gregorian.month.en}`);
//               updateUpcomingPrayer(timings);
//             }
//         });

//       } catch (error) {
//         console.error("Location/API Error:", error);
//         setLocationName("Offline");
//       }
//     };

//     fetchLocationData();
//   }, []);

//   const updateUpcomingPrayer = (timings: any) => {
//     const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
//     const now = new Date();
//     const currentMinutes = now.getHours() * 60 + now.getMinutes();

//     for (let name of prayerOrder) {
//       const timeParts = timings[name].split(':');
//       const pHours = parseInt(timeParts[0], 10);
//       const pMins = parseInt(timeParts[1], 10);
//       const prayerMinutes = pHours * 60 + pMins;

//       if (prayerMinutes > currentMinutes) {
//         setNextPrayer({ name, time: timings[name] });
//         return;
//       }
//     }
//     setNextPrayer({ name: "Fajr", time: timings["Fajr"] });
//   };

//   const cards = [
//     { title: "Namaz\nTracker", icon: <Calendar color="#10b981" size={30} />, route: "/screens/namaztracker" },
//     { title: "Tasbeeh\nCounter", icon: <Calculator color="#10b981" size={30} />, route: "/screens/tasbeeh" },
//     { title: "Daily\nDuain", icon: <HelpingHand color="#10b981" size={30} />, route: "/duain" },
//     { title: "Hajj &\nUmrah", icon: <ShieldCheck color="#10b981" size={30} />, route: "/hajj" },
//     { title: "Islamic\nBooks", icon: <BookOpen color="#10b981" size={30} />, route: "/books" },
//     { title: "Wazifa\nCollection", icon: <Star color="#10b981" size={30} />, route: "/wazifa" },
//   ];

//   return (
//     <SafeAreaView style={styles.mainWrapper}>
//       <StatusBar barStyle="light-content" />
//       <SideDashboard visible={menuVisible} onClose={() => setMenuVisible(false)} />

//       <View style={styles.topBar}>
//         <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.burgerBtn}>
//           <Menu size={28} color="#10b981" />
//         </TouchableOpacity>

//         <View style={styles.locationInfo}>
//           <View style={styles.locRow}>
//             <MapPin size={14} color="#10b981" />
//             <Text style={styles.cityText}>{locationName}</Text>
//           </View>
//           <Text style={styles.dateText}>{englishDate}</Text>
//           <Text style={styles.islamicDateText}>{islamicDate}</Text>
//         </View>

//         <TouchableOpacity style={styles.notifBtn}>
//           <Bell size={22} color="#10b981" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView 
//         style={styles.mainScroll} 
//         contentContainerStyle={styles.scrollContent} 
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.heroCard}>
//           <View style={styles.nextPrayerBadge}>
//              <Clock size={14} color="#000" />
//              <Text style={styles.nextPrayerText}>
//                UPCOMING: <Text style={{fontWeight: '800' ,fontSize:16}}>{nextPrayer.name} at {nextPrayer.time}</Text>
//              </Text>
//           </View>
//           <Text style={styles.heroArabicText}>اَلصَّلٰوةُ خَيْرٌ مِّنَ النَّوْمِ</Text>
//           <Text style={styles.heroSubText}>Prayer is better than sleep</Text>
//         </View>

//         <View style={styles.grid}>
//           {cards.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               activeOpacity={0.7}
//               style={styles.card}
//               onPress={() => item.route && router.push(item.route as any)}
//             >
//               <View style={styles.iconContainer}>{item.icon}</View>
//               <Text style={styles.cardText}>{item.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <TouchableOpacity style={styles.soonCard}>
//            <Text style={styles.soonText}>🚀 More Updates Coming Soon</Text>
//         </TouchableOpacity>
//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // Styles remain identical to your requirement
// const styles = StyleSheet.create({
//  mainWrapper: { 
//     flex: 1, 
//     backgroundColor: "#000000",
//     paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 
//   },
//   topBar: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     backgroundColor: '#000',
//     zIndex: 10,
//     marginTop: Platform.OS === 'ios' ? 10 : 0, 
//   },
//   locationInfo: { flex: 1, alignItems: 'center' },
//   burgerBtn: { width: 40, alignItems: 'flex-start' },
//   notifBtn: { width: 40, alignItems: 'flex-end' },
//   mainScroll: { flex: 1 },
//  scrollContent: { padding: 20, paddingTop: 10 }, 
//   locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   cityText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
//   dateText: { color: '#A0A0A0', fontSize: 11, marginTop: 2 },
//   islamicDateText: { color: '#10b981', fontSize: 12, fontWeight: '700', marginTop: 1, textTransform: 'uppercase' },
//   heroCard: { backgroundColor: '#0a0a0a', padding: 25, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#111', marginBottom: 35 },
//   nextPrayerBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffae00', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 20 },
//   nextPrayerText: { color: '#000', fontSize: 15, fontWeight: '600' },
//   heroArabicText: { color: '#10b981', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
//   heroSubText: { color: '#666', marginTop: 10, fontSize: 13, fontStyle: 'italic' },
//   grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   card: {
//     backgroundColor: "#111111", width: cardWidth, height: 160, padding: 15, borderRadius: 24, marginBottom: 20,
//     borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", justifyContent: "center", alignItems: "center",
//   },
//   iconContainer: { width: 60, height: 60, borderRadius: 20, backgroundColor: "rgba(16, 185, 129, 0.1)", justifyContent: "center", alignItems: "center", marginBottom: 15 },
//   cardText: { fontSize: 15, fontWeight: "700", color: "#ffffff", textAlign: "center" },
//   soonCard: { backgroundColor: "#064e3b", padding: 18, borderRadius: 20, marginTop: 10, alignItems: "center", borderWidth: 1, borderColor: "#10b981" },
//   soonText: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
// });





/////////////////////////  Roll back code again========================================





import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { Bell, BookOpen, Calculator, Calendar, Clock, HelpingHand, MapPin, Menu, ShieldCheck, Star, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform, StatusBar as RNStatusBar, ScrollView,
  StatusBar, StyleSheet, Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SideDashboard from '../../components/SideDashboard';
import { useLocation } from '../../context/LocationContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

// ... (Saare imports wahi hain jo aapne diye)

export default function Home() {
  const router = useRouter();
  const { location, setLocation } = useLocation(); 
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [locModalVisible, setLocModalVisible] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);
  
  const [manualCity, setManualCity] = useState("");
  const [manualCountry, setManualCountry] = useState("");

  const [islamicDate, setIslamicDate] = useState("-- -- ---- AH");
  const [englishDate, setEnglishDate] = useState("");
  const [nextPrayer, setNextPrayer] = useState({ name: "Prayer", time: "--:--" });

  useEffect(() => {
    fetchLocationData();
  }, []);

  // --- API & Location Logic (No Change) ---
  const fetchLocationData = async (cityInput?: string, countryInput?: string) => {
    setLoadingGPS(true);
    try {
      if (cityInput) {
        const cty = cityInput.trim().toUpperCase();
        const ctr = (countryInput || "PK").trim().toUpperCase().substring(0, 2);
        updateUIWithLocation(cty, ctr);
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${cty}&country=${ctr}&method=1`).catch(() => null);
        if (res) handlePrayerResponse(await res.json());
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        updateUIWithLocation("KARACHI", "PK");
        return;
      }
      let userLocation = await Location.getLastKnownPositionAsync({});
      if (!userLocation) userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      const { latitude, longitude } = userLocation.coords;
      const [geo, res] = await Promise.all([
        Location.reverseGeocodeAsync({ latitude, longitude }).catch(() => null),
        fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${latitude},${longitude}&method=1`).catch(() => null)
      ]);
      if (geo && geo.length > 0) {
        const detectedCity = geo[0].city || geo[0].region || "KARACHI";
        const detectedCountry = geo[0].isoCountryCode || "PK";
        updateUIWithLocation(detectedCity.toUpperCase(), detectedCountry.toUpperCase().substring(0, 2));
      }
      if (res) handlePrayerResponse(await res.json());
    } catch (error) {
      if (Platform.OS === 'android') ToastAndroid.show("Connection Error", ToastAndroid.SHORT);
      updateUIWithLocation("OFFLINE", "PK");
    } finally {
      setLoadingGPS(false);
    }
  };

  const updateUIWithLocation = (city: string, country: string) => {
    setLocation({ city, country }); 
  };

  const handlePrayerResponse = (data: any) => {
    if (data && data.code === 200) {
      const { hijri, gregorian } = data.data.date;
      setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
      setEnglishDate(`${gregorian.weekday.en}, ${gregorian.day} ${gregorian.month.en}`);
      updateUpcomingPrayer(data.data.timings);
    }
  };

  const updateUpcomingPrayer = (timings: any) => {
    const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (let name of prayerOrder) {
      const timeParts = timings[name].split(':');
      const prayerMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
      if (prayerMinutes > currentMinutes) {
        setNextPrayer({ name, time: timings[name] });
        return;
      }
    }
    setNextPrayer({ name: "Fajr", time: timings["Fajr"] });
  };

  // --- FIXED ROUTES ---
  // Expo Router mein agar file (tabs) ke andar hai, to seedha file ka naam likhte hain
  const cards = [
    { title: "Namaz\nTracker", icon: <Calendar color="#10b981" size={30} />, route: "namaztracker" },
    { title: "Tasbeeh\nCounter", icon: <Calculator color="#10b981" size={30} />, route: "tasbeeh" },
    { title: "Daily\nDuain", icon: <HelpingHand color="#10b981" size={30} />, route: "/duain" },
    { title: "Hajj &\nUmrah", icon: <ShieldCheck color="#10b981" size={30} />, route: "/hajj" },
    { title: "Islamic\nBooks", icon: <BookOpen color="#10b981" size={30} />, route: "/books" },
    { title: "Wazifa\nCollection", icon: <Star color="#10b981" size={30} />, route: "/wazifa" },
  ];

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <StatusBar barStyle="light-content" />
      <SideDashboard visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* Location Modal (Same as yours) */}
      <Modal visible={locModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.locModal}>
             <View style={styles.modalHeader}>
               <Text style={styles.modalTitle}>Change Location</Text>
               <TouchableOpacity onPress={() => setLocModalVisible(false)}><X color="#444" size={24} /></TouchableOpacity>
             </View>
             <TouchableOpacity style={styles.autoDetectBtn} onPress={() => { fetchLocationData(); setLocModalVisible(false); }}>
               {loadingGPS ? <ActivityIndicator color="#000" /> : <Text style={styles.autoDetectText}>Auto-Detect (GPS)</Text>}
             </TouchableOpacity>
             <TextInput style={styles.input} placeholder="City (e.g. London)" placeholderTextColor="#333" value={manualCity} onChangeText={setManualCity} />
             <TextInput style={styles.input} placeholder="Country Code (e.g. UK)" placeholderTextColor="#333" maxLength={2} value={manualCountry} onChangeText={setManualCountry} />
             <TouchableOpacity style={styles.saveBtn} onPress={() => { fetchLocationData(manualCity, manualCountry); setLocModalVisible(false); }}>
               <Text style={styles.saveBtnText}>Save Entry</Text>
             </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}><Menu size={28} color="#10b981" /></TouchableOpacity>
        <TouchableOpacity style={styles.locationInfo} onPress={() => setLocModalVisible(true)}>
          <View style={styles.locRow}>
            <MapPin size={14} color="#10b981" />
            <Text style={styles.cityText}>{location.city}, {location.country}</Text>
          </View>
          <Text style={styles.dateText}>{englishDate}</Text>
          <Text style={styles.islamicDateText}>{islamicDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity><Bell size={22} color="#10b981" /></TouchableOpacity>
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.nextPrayerBadge}>
            <Clock size={14} color="#000" />
            <Text style={styles.nextPrayerText}>UPCOMING: {nextPrayer.name} at {nextPrayer.time}</Text>
          </View>
          <Text style={styles.heroArabicText}>اَلصَّلٰوةُ خَيْرٌ مِّنَ النَّوْمِ</Text>
          <Text style={styles.heroSubText}>Prayer is better than sleep</Text>
        </View>

        {/* Grid Cards */}
        <View style={styles.grid}>
          {cards.map((item, index) => (
            <TouchableOpacity key={index} style={styles.card} onPress={() => router.push(item.route as any)}>
              <View style={styles.iconContainer}>{item.icon}</View>
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles are the same...

// Styles wahi hain jo aapne diye thay (No Change)
const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: "#000", paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  locationInfo: { flex: 1, alignItems: 'center' },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cityText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  dateText: { color: '#A0A0A0', fontSize: 11, marginTop: 2 },
  islamicDateText: { color: '#10b981', fontSize: 12, fontWeight: '700', marginTop: 1 },
  mainScroll: { flex: 1 },
  scrollContent: { padding: 20 },
  heroCard: { backgroundColor: '#0a0a0a', padding: 25, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#111', marginBottom: 35 },
  nextPrayerBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffae00', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 20 },
  nextPrayerText: { color: '#000', fontSize: 15 },
  heroArabicText: { color: '#10b981', fontSize: 28, fontWeight: 'bold' },
  heroSubText: { color: '#666', marginTop: 10, fontStyle: 'italic', fontSize: 13 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { backgroundColor: "#111", width: cardWidth, height: 160, borderRadius: 24, marginBottom: 20, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  iconContainer: { width: 60, height: 60, borderRadius: 20, backgroundColor: "rgba(16, 185, 129, 0.1)", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  cardText: { fontSize: 15, fontWeight: "700", color: "#fff", textAlign: "center" },
  soonCard: { backgroundColor: "#064e3b", padding: 18, borderRadius: 20, alignItems: "center", marginTop: 10 },
  soonText: { color: "#fff", fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  locModal: { width: '90%', backgroundColor: '#0a0a0a', borderRadius: 25, padding: 25, borderWidth: 1, borderColor: '#111' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  autoDetectBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  autoDetectText: { color: '#000', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#1a1a1a', marginBottom: 20 },
  inputLabel: { color: '#10b981', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#000', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#1a1a1a' },
  saveBtn: { borderWidth: 1, borderColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 5 },
  saveBtnText: { color: '#10b981', fontWeight: 'bold' }
});