



/////////////////////////  Roll back code again========================================





// import * as Location from 'expo-location';
// import { useRouter } from "expo-router";
// import { Bell, BookOpen, Calculator, Calendar, Clock, HelpingHand, MapPin, Menu, ShieldCheck, Star, X } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Dimensions,
//   Modal,
//   Platform, StatusBar as RNStatusBar, ScrollView,
//   StatusBar, StyleSheet, Text,
//   TextInput,
//   ToastAndroid,
//   TouchableOpacity, View
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import SideDashboard from '../../components/SideDashboard';
// import { useLocation } from '../../context/LocationContext';

// const { width } = Dimensions.get('window');
// const cardWidth = (width - 60) / 2;

// // ... (Saare imports wahi hain jo aapne diye)

// export default function Home() {
//   const router = useRouter();
//   const { location, setLocation } = useLocation(); 
  
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [locModalVisible, setLocModalVisible] = useState(false);
//   const [loadingGPS, setLoadingGPS] = useState(false);
  
//   const [manualCity, setManualCity] = useState("");
//   const [manualCountry, setManualCountry] = useState("");

//   const [islamicDate, setIslamicDate] = useState("-- -- ---- AH");
//   const [englishDate, setEnglishDate] = useState("");
//   const [nextPrayer, setNextPrayer] = useState({ name: "Prayer", time: "--:--" });

//   useEffect(() => {
//     fetchLocationData();
//   }, []);

//   // --- API & Location Logic (No Change) ---
//   const fetchLocationData = async (cityInput?: string, countryInput?: string) => {
//     setLoadingGPS(true);
//     try {
//       if (cityInput) {
//         const cty = cityInput.trim().toUpperCase();
//         const ctr = (countryInput || "PK").trim().toUpperCase().substring(0, 2);
//         updateUIWithLocation(cty, ctr);
//         const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${cty}&country=${ctr}&method=1`).catch(() => null);
//         if (res) handlePrayerResponse(await res.json());
//         return;
//       }
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         updateUIWithLocation("KARACHI", "PK");
//         return;
//       }
//       let userLocation = await Location.getLastKnownPositionAsync({});
//       if (!userLocation) userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
//       const { latitude, longitude } = userLocation.coords;
//       const [geo, res] = await Promise.all([
//         Location.reverseGeocodeAsync({ latitude, longitude }).catch(() => null),
//         fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${latitude},${longitude}&method=1`).catch(() => null)
//       ]);
//       if (geo && geo.length > 0) {
//         const detectedCity = geo[0].city || geo[0].region || "KARACHI";
//         const detectedCountry = geo[0].isoCountryCode || "PK";
//         updateUIWithLocation(detectedCity.toUpperCase(), detectedCountry.toUpperCase().substring(0, 2));
//       }
//       if (res) handlePrayerResponse(await res.json());
//     } catch (error) {
//       if (Platform.OS === 'android') ToastAndroid.show("Connection Error", ToastAndroid.SHORT);
//       updateUIWithLocation("OFFLINE", "PK");
//     } finally {
//       setLoadingGPS(false);
//     }
//   };



//   const updateUIWithLocation = (city: string, country: string) => {
//     setLocation({ city, country }); 
//   };

//   const handlePrayerResponse = (data: any) => {
//     if (data && data.code === 200) {
//       const { hijri, gregorian } = data.data.date;
//       setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
//       setEnglishDate(`${gregorian.weekday.en}, ${gregorian.day} ${gregorian.month.en}`);
//       updateUpcomingPrayer(data.data.timings);
//     }
//   };

//   const updateUpcomingPrayer = (timings: any) => {
//     const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
//     const now = new Date();
//     const currentMinutes = now.getHours() * 60 + now.getMinutes();
//     for (let name of prayerOrder) {
//       const timeParts = timings[name].split(':');
//       const prayerMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
//       if (prayerMinutes > currentMinutes) {
//         setNextPrayer({ name, time: timings[name] });
//         return;
//       }
//     }
//     setNextPrayer({ name: "Fajr", time: timings["Fajr"] });
//   };

//   // --- FIXED ROUTES ---
//   // Expo Router mein agar file (tabs) ke andar hai, to seedha file ka naam likhte hain
//   const cards = [
//     { title: "Namaz\nTracker", icon: <Calendar color="#10b981" size={30} />, route: "namaztracker" },
//     { title: "Tasbeeh\nCounter", icon: <Calculator color="#10b981" size={30} />, route: "tasbeeh" },
//     { title: "Daily\nDuain", icon: <HelpingHand color="#10b981" size={30} />, route: "/duain" },
//     { title: "Hajj &\nUmrah", icon: <ShieldCheck color="#10b981" size={30} />, route: "/hajj" },
//     { title: "Islamic\nBooks", icon: <BookOpen color="#10b981" size={30} />, route: "/books" },
//     { title: "Wazifa\nCollection", icon: <Star color="#10b981" size={30} />, route: "/wazifa" },
//   ];

//   return (
//     <SafeAreaView style={styles.mainWrapper}>
//       <StatusBar barStyle="light-content" />
//       <SideDashboard visible={menuVisible} onClose={() => setMenuVisible(false)} />

//       {/* Location Modal (Same as yours) */}
//       <Modal visible={locModalVisible} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.locModal}>
//              <View style={styles.modalHeader}>
//                <Text style={styles.modalTitle}>Change Location</Text>
//                <TouchableOpacity onPress={() => setLocModalVisible(false)}><X color="#444" size={24} /></TouchableOpacity>
//              </View>
//              <TouchableOpacity style={styles.autoDetectBtn} onPress={() => { fetchLocationData(); setLocModalVisible(false); }}>
//                {loadingGPS ? <ActivityIndicator color="#000" /> : <Text style={styles.autoDetectText}>Auto-Detect (GPS)</Text>}
//              </TouchableOpacity>
//              <TextInput style={styles.input} placeholder="City (e.g. London)" placeholderTextColor="#333" value={manualCity} onChangeText={setManualCity} />
//              <TextInput style={styles.input} placeholder="Country Code (e.g. UK)" placeholderTextColor="#333" maxLength={2} value={manualCountry} onChangeText={setManualCountry} />
//              <TouchableOpacity style={styles.saveBtn} onPress={() => { fetchLocationData(manualCity, manualCountry); setLocModalVisible(false); }}>
//                <Text style={styles.saveBtnText}>Save Entry</Text>
//              </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Top Bar */}
//       <View style={styles.topBar}>
//         <TouchableOpacity onPress={() => setMenuVisible(true)}><Menu size={28} color="#10b981" /></TouchableOpacity>
//         <TouchableOpacity style={styles.locationInfo} onPress={() => setLocModalVisible(true)}>
//           <View style={styles.locRow}>
//             <MapPin size={14} color="#10b981" />
//             <Text style={styles.cityText}>{location.city}, {location.country}</Text>
//           </View>
//           <Text style={styles.dateText}>{englishDate}</Text>
//           <Text style={styles.islamicDateText}>{islamicDate}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity><Bell size={22} color="#10b981" /></TouchableOpacity>
//       </View>

//       <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         {/* Hero Card */}
//         <View style={styles.heroCard}>
//           <View style={styles.nextPrayerBadge}>
//             <Clock size={14} color="#000" />
//             <Text style={styles.nextPrayerText}>UPCOMING: {nextPrayer.name} at {nextPrayer.time}</Text>
//           </View>
//           <Text style={styles.heroArabicText}>اَلصَّلٰوةُ خَيْرٌ مِّنَ النَّوْمِ</Text>
//           <Text style={styles.heroSubText}>Prayer is better than sleep</Text>
//         </View>

//         {/* Grid Cards */}
//         <View style={styles.grid}>
//           {cards.map((item, index) => (
//             <TouchableOpacity key={index} style={styles.card} onPress={() => router.push(item.route as any)}>
//               <View style={styles.iconContainer}>{item.icon}</View>
//               <Text style={styles.cardText}>{item.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // Styles are the same...

// // Styles wahi hain jo aapne diye thay (No Change)
// const styles = StyleSheet.create({
//   mainWrapper: { flex: 1, backgroundColor: "#000", paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 },
//   topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
//   locationInfo: { flex: 1, alignItems: 'center' },
//   locRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
//   cityText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
//   dateText: { color: '#A0A0A0', fontSize: 11, marginTop: 2 },
//   islamicDateText: { color: '#10b981', fontSize: 12, fontWeight: '700', marginTop: 1 },
//   mainScroll: { flex: 1 },
//   scrollContent: { padding: 20 },
//   heroCard: { backgroundColor: '#0a0a0a', padding: 25, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#111', marginBottom: 35 },
//   nextPrayerBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffae00', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 20 },
//   nextPrayerText: { color: '#000', fontSize: 15 },
//   heroArabicText: { color: '#10b981', fontSize: 28, fontWeight: 'bold' },
//   heroSubText: { color: '#666', marginTop: 10, fontStyle: 'italic', fontSize: 13 },
//   grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   card: { backgroundColor: "#111", width: cardWidth, height: 160, borderRadius: 24, marginBottom: 20, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
//   iconContainer: { width: 60, height: 60, borderRadius: 20, backgroundColor: "rgba(16, 185, 129, 0.1)", justifyContent: "center", alignItems: "center", marginBottom: 15 },
//   cardText: { fontSize: 15, fontWeight: "700", color: "#fff", textAlign: "center" },
//   soonCard: { backgroundColor: "#064e3b", padding: 18, borderRadius: 20, alignItems: "center", marginTop: 10 },
//   soonText: { color: "#fff", fontWeight: "600" },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
//   locModal: { width: '90%', backgroundColor: '#0a0a0a', borderRadius: 25, padding: 25, borderWidth: 1, borderColor: '#111' },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   autoDetectBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
//   autoDetectText: { color: '#000', fontWeight: 'bold' },
//   divider: { height: 1, backgroundColor: '#1a1a1a', marginBottom: 20 },
//   inputLabel: { color: '#10b981', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
//   input: { backgroundColor: '#000', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#1a1a1a' },
//   saveBtn: { borderWidth: 1, borderColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 5 },
//   saveBtnText: { color: '#10b981', fontWeight: 'bold' }
// });
























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
  TouchableOpacity, View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Ye line lazmi honi chahiye
import { SafeAreaView } from 'react-native-safe-area-context';
import SideDashboard from '../../components/SideDashboard';
import { useLocation } from '../../context/LocationContext';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

export default function Home() {
  const router = useRouter();
  
  // Context se location, setter aur trigger nikaal rahe hain
  const { location, setLocation, triggerErrorToast } = useLocation(); 
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [locModalVisible, setLocModalVisible] = useState(false);
  const [loadingGPS, setLoadingGPS] = useState(false);
  
  const [manualCity, setManualCity] = useState("");
  const [manualCountry, setManualCountry] = useState("");

  const [islamicDate, setIslamicDate] = useState("-- -- ---- AH");
  const [englishDate, setEnglishDate] = useState("");
  const [nextPrayer, setNextPrayer] = useState({ name: "Prayer", time: "--:--" });

  useEffect(() => {
    // Initial fetch on mount
    fetchLocationData();
  }, []);

  // --- API & Location Logic ---
 

const fetchLocationData = async (cityInput?: string, countryInput?: string) => {
  setLoadingGPS(true);
  try {
    if (cityInput) {
      const cty = cityInput.trim().toUpperCase();
      const ctr = (countryInput || "PK").trim().toUpperCase().substring(0, 2);
      setLocation({ city: cty, country: ctr });
      
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${cty}&country=${ctr}&method=1`).catch(() => null);
      if (res) handlePrayerResponse(await res.json());
      return;
    }

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocation({ city: "KARACHI", country: "PK" });
      return;
    }

    let userLocation = await Location.getLastKnownPositionAsync({});
    if (!userLocation) userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });

    const { latitude, longitude } = userLocation.coords;

    const res = await fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${latitude},${longitude}&method=1`).catch(() => null);
    const geo = await Location.reverseGeocodeAsync({ latitude, longitude }).catch(() => null);

    if (geo && geo.length > 0) {
      setLocation({ 
        city: (geo[0].city || geo[0].region || "KARACHI").toUpperCase(), 
        country: (geo[0].isoCountryCode || "PK").toUpperCase() // <-- Short Code (PK)
      });
    }

    if (res && res.ok) {
      handlePrayerResponse(await res.json());
    } else {
      if (triggerErrorToast) triggerErrorToast();
      // Persistence check for offline
      const saved = await AsyncStorage.getItem('user_location');
      if(!saved) setLocation({ city: "OFFLINE", country: ".." });
    }

  } catch (error) {
    if (triggerErrorToast) triggerErrorToast();
  } finally {
    setLoadingGPS(false);
  }
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
        <View style={styles.heroCard}>
          <View style={styles.nextPrayerBadge}>
            <Clock size={14} color="#000" />
            <Text style={styles.nextPrayerText}>UPCOMING: {nextPrayer.name} at {nextPrayer.time}</Text>
          </View>
          <Text style={styles.heroArabicText}>اَلصَّلٰوةُ خَيْرٌ مِّنَ النَّوْمِ</Text>
          <Text style={styles.heroSubText}>Prayer is better than sleep</Text>
        </View>

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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  locModal: { width: '90%', backgroundColor: '#0a0a0a', borderRadius: 25, padding: 25, borderWidth: 1, borderColor: '#111' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  autoDetectBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  autoDetectText: { color: '#000', fontWeight: 'bold' },
  input: { backgroundColor: '#000', color: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#1a1a1a' },
  saveBtn: { borderWidth: 1, borderColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 5 },
  saveBtnText: { color: '#10b981', fontWeight: 'bold' }
});