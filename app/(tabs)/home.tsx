














// import * as Location from 'expo-location';
// import { useRouter } from "expo-router";
// import { Bell, BookOpen, Calculator, Calendar, Clock, HelpingHand, MapPin, Menu, ShieldCheck, Star } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

//       fetchPrayerTimes(latitude, longitude);
//     })();
//   }, []);

//   const fetchPrayerTimes = async (lat: number, lon: number) => {
//     try {
//       const response = await fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${lat},${lon}&method=1`);
//       const data = await response.json();
      
//       if (data.code === 200) {
//         const hijri = data.data.date.hijri;
//         const greg = data.data.date.gregorian;
//         const timings = data.data.timings;
        
//         setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
//         setEnglishDate(`${greg.weekday.en}, ${greg.day} ${greg.month.en}`);

//         // UPCOMING PRAYER LOGIC (1 Hour Before Update)
//         updateUpcomingPrayer(timings);
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//     }
//   };

//   const updateUpcomingPrayer = (timings: any) => {
//     const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
//     const now = new Date();
//     const currentMinutes = now.getHours() * 60 + now.getMinutes();

//     for (let name of prayerOrder) {
//       const [Phours, Pmins] = timings[name].split(':').map(Number);
//       const prayerMinutes = Phours * 60 + Pmins;

//       // Agar namaz ka waqt abhi aaya nahi hai
//       if (prayerMinutes > currentMinutes) {
//         setNextPrayer({ name, time: timings[name] });
//         break;
//       }
//     }
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
//     <View style={styles.mainWrapper}>
//       <StatusBar barStyle="light-content" />
//       <SideDashboard visible={menuVisible} onClose={() => setMenuVisible(false)} />

//       <ScrollView style={styles.mainScroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
//         <View style={styles.topBar}>
//           {/* FIX: Removed unexpected text node here */}
//           <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.burgerBtn}>
//             <Menu size={28} color="#10b981" />
//           </TouchableOpacity>

//           <View style={styles.locationInfo}>
//             <View style={styles.locRow}>
//               <MapPin size={14} color="#10b981" />
//               <Text style={styles.cityText}>{locationName}</Text>
//             </View>
//             <Text style={styles.dateText}>{englishDate}</Text>
//             <Text style={styles.islamicDateText}>{islamicDate}</Text>
//           </View>

//           <TouchableOpacity style={styles.notifBtn}>
//             <Bell size={22} color="#10b981" />
//           </TouchableOpacity>
//         </View>

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
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   // ... Styles are preserved and fixed below
//   heroArabicText: { 
//     color: '#10b981', 
//     fontSize: 28, 
//     fontWeight: 'bold', 
//     textAlign: 'center',
//     // textShadow props replaced with direct textShadow for cleaner code
//     textShadowColor: 'rgba(16, 185, 129, 0.3)',
//     textShadowOffset: {width: 0, height: 0},
//     textShadowRadius: 10
//   },
//   mainWrapper: { flex: 1, backgroundColor: "#000000" },
//   mainScroll: { flex: 1 },
//   container: { padding: 20, paddingTop: 50 },
//   topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25  },
//   burgerBtn: { padding: 5 },
//   locationInfo: { alignItems: 'center' },
//   locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   cityText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
//   dateText: { color: '#A0A0A0', fontSize: 11, marginTop: 2 },
//   islamicDateText: { color: '#10b981', fontSize: 12, fontWeight: '700', marginTop: 1, textTransform: 'uppercase' },
//   notifBtn: { padding: 5 },
//   heroCard: { backgroundColor: '#0a0a0a', padding: 25, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#111', marginBottom: 35 },
//   nextPrayerBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffae00', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 20 },
//   nextPrayerText: { color: '#000', fontSize: 15, fontWeight: '600' },
//   heroSubText: { color: '#666', marginTop: 10, fontSize: 13, fontStyle: 'italic' },
//   grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   card: {
//     backgroundColor: "#111111", width: cardWidth, height: 160, padding: 15, borderRadius: 24, marginBottom: 20,
//     borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", justifyContent: "center", alignItems: "center",
//     elevation: 8, shadowColor: "#10b981", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
//   },
//   iconContainer: { width: 60, height: 60, borderRadius: 20, backgroundColor: "rgba(16, 185, 129, 0.1)", justifyContent: "center", alignItems: "center", marginBottom: 15 },
//   cardText: { fontSize: 15, fontWeight: "700", color: "#ffffff", textAlign: "center", lineHeight: 20 },
//   soonCard: { backgroundColor: "#064e3b", padding: 18, borderRadius: 20, marginTop: 10, alignItems: "center", borderWidth: 1, borderColor: "#10b981" },
//   soonText: { color: "#ffffff", fontSize: 14, fontWeight: "600" },
// });
























import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { Bell, BookOpen, Calculator, Calendar, Clock, HelpingHand, MapPin, Menu, ShieldCheck, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, StatusBar as RNStatusBar, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SideDashboard from './screens/SideDashboard';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

export default function Home() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  
  const [locationName, setLocationName] = useState("Loading...");
  const [islamicDate, setIslamicDate] = useState("");
  const [englishDate, setEnglishDate] = useState("");
  const [nextPrayer, setNextPrayer] = useState({ name: "...", time: "..." });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationName("Permission Denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      let address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address.length > 0) {
        const item = address[0];
        setLocationName(`${item.city?.toUpperCase() || 'UNKNOWN'}, ${item.isoCountryCode || 'PK'}`);
      }

      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByAddress?address=${latitude},${longitude}&method=1`
        );
        const data = await response.json();
        
        if (data.code === 200) {
          const hijri = data.data.date.hijri;
          const greg = data.data.date.gregorian;
          const timings = data.data.timings;
          
          setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);
          setEnglishDate(`${greg.weekday.en}, ${greg.day} ${greg.month.en}`);
          
          updateUpcomingPrayer(timings);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    })();
  }, []);

  const updateUpcomingPrayer = (timings: any) => {
    const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let name of prayerOrder) {
      const timeParts = timings[name].split(':');
      const pHours = parseInt(timeParts[0], 10);
      const pMins = parseInt(timeParts[1], 10);
      const prayerMinutes = pHours * 60 + pMins;

      if (prayerMinutes > currentMinutes) {
        setNextPrayer({ name, time: timings[name] });
        return;
      }
    }
    setNextPrayer({ name: "Fajr", time: timings["Fajr"] });
  };

  const cards = [
    { title: "Namaz\nTracker", icon: <Calendar color="#10b981" size={30} />, route: "/screens/namaztracker" },
    { title: "Tasbeeh\nCounter", icon: <Calculator color="#10b981" size={30} />, route: "/screens/tasbeeh" },
    { title: "Daily\nDuain", icon: <HelpingHand color="#10b981" size={30} />, route: "/duain" },
    { title: "Hajj &\nUmrah", icon: <ShieldCheck color="#10b981" size={30} />, route: "/hajj" },
    { title: "Islamic\nBooks", icon: <BookOpen color="#10b981" size={30} />, route: "/books" },
    { title: "Wazifa\nCollection", icon: <Star color="#10b981" size={30} />, route: "/wazifa" },
  ];

  return (
    <SafeAreaView style={styles.mainWrapper}>
      <StatusBar barStyle="light-content" />
      <SideDashboard visible={menuVisible} onClose={() => setMenuVisible(false)} />

      {/* TOP BAR: Ab ye ScrollView se bahar hai, is liye scroll nahi hoga */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.burgerBtn}>
          <Menu size={28} color="#10b981" />
        </TouchableOpacity>

        <View style={styles.locationInfo}>
          <View style={styles.locRow}>
            <MapPin size={14} color="#10b981" />
            <Text style={styles.cityText}>{locationName}</Text>
          </View>
          <Text style={styles.dateText}>{englishDate}</Text>
          <Text style={styles.islamicDateText}>{islamicDate}</Text>
        </View>

        <TouchableOpacity style={styles.notifBtn}>
          <Bell size={22} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView 
        style={styles.mainScroll} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.nextPrayerBadge}>
             <Clock size={14} color="#000" />
             <Text style={styles.nextPrayerText}>
               UPCOMING: <Text style={{fontWeight: '800' ,fontSize:16}}>{nextPrayer.name} at {nextPrayer.time}</Text>
             </Text>
          </View>
          <Text style={styles.heroArabicText}>اَلصَّلٰوةُ خَيْرٌ مِّنَ النَّوْمِ</Text>
          <Text style={styles.heroSubText}>Prayer is better than sleep</Text>
        </View>

        <View style={styles.grid}>
          {cards.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={styles.card}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={styles.iconContainer}>{item.icon}</View>
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.soonCard}>
           <Text style={styles.soonText}>🚀 More Updates Coming Soon</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
 mainWrapper: { 
    flex: 1, 
    backgroundColor: "#000000",
    // Android ke liye status bar height aur iOS ke liye 0
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 
  },
  
  // Header Section Fixed
  topBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#000',
    zIndex: 10,
    // iOS ke liye mazeed safety agar notch ka masla ho
    marginTop: Platform.OS === 'ios' ? 10 : 0, 
  },
  
  locationInfo: { flex: 1, alignItems: 'center' },
  burgerBtn: { width: 40, alignItems: 'flex-start' },
  notifBtn: { width: 40, alignItems: 'flex-end' },
  
  mainScroll: { flex: 1 },
 scrollContent: { 
    padding: 20, 
    paddingTop: 10 
  }, // Padding kam kar di kyunke header bahar hai
  
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cityText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  dateText: { color: '#A0A0A0', fontSize: 11, marginTop: 2 },
  islamicDateText: { color: '#10b981', fontSize: 12, fontWeight: '700', marginTop: 1, textTransform: 'uppercase' },
  
  heroCard: { backgroundColor: '#0a0a0a', padding: 25, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: '#111', marginBottom: 35 },
  nextPrayerBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffae00', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, marginBottom: 20 },
  nextPrayerText: { color: '#000', fontSize: 15, fontWeight: '600' },
  heroArabicText: { color: '#10b981', fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  heroSubText: { color: '#666', marginTop: 10, fontSize: 13, fontStyle: 'italic' },
  
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    backgroundColor: "#111111", width: cardWidth, height: 160, padding: 15, borderRadius: 24, marginBottom: 20,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", justifyContent: "center", alignItems: "center",
  },
  iconContainer: { width: 60, height: 60, borderRadius: 20, backgroundColor: "rgba(16, 185, 129, 0.1)", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  cardText: { fontSize: 15, fontWeight: "700", color: "#ffffff", textAlign: "center" },
  soonCard: { backgroundColor: "#064e3b", padding: 18, borderRadius: 20, marginTop: 10, alignItems: "center", borderWidth: 1, borderColor: "#10b981" },
  soonText: { color: "#ffffff", fontSize: 14, fontWeight: "600" },

});

