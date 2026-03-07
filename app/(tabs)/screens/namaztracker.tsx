// ============================ perfect code working========================================================

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Location from 'expo-location';
// import { CheckCircle2, Circle, CircleCheck, Clock, Edit3, MapPin, Navigation, Settings, Settings2, X } from 'lucide-react-native';
// import React, { useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, Alert, Animated, Dimensions, Easing, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { Calendar } from 'react-native-calendars';

// const { width } = Dimensions.get('window');

// type NamazName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
// const defaultStatus: Record<NamazName, boolean> = { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };

// export default function NamazFinalApp() {
//   const getLocalDateString = (date: Date) => {
//     const offset = date.getTimezoneOffset();
//     const localDate = new Date(date.getTime() - (offset * 60 * 1000));
//     return localDate.toISOString().split('T')[0];
//   };

//   const todayStr = getLocalDateString(new Date());
//   const [startDate, setStartDate] = useState<string | null>(null);
//   const [selectedDate, setSelectedDate] = useState(todayStr);
//   const [sect, setSect] = useState<'Hanafi' | 'Jafari'>('Hanafi');
  
//   const [city, setCity] = useState('Lahore');
//   const [country, setCountry] = useState('Pakistan');
//   const [showLocModal, setShowLocModal] = useState(false);
//   const [tempCity, setTempCity] = useState('');
//   const [tempCountry, setTempCountry] = useState('');
//   const [loadingLoc, setLoadingLoc] = useState(false);
//   const [islamicDate, setIslamicDate] = useState('-- -- ----');

//   const [markedDates, setMarkedDates] = useState<any>({});
//   const [dayRecords, setDayRecords] = useState<Record<NamazName, boolean>>(defaultStatus);
//   const [rangeStats, setRangeStats] = useState({ totalAda: 0, totalQaza: 0 });
//   const [prayerTimes, setPrayerTimes] = useState<any>(null);
  
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [showResetAlert, setShowResetAlert] = useState(false);
//   const [pendingStatus, setPendingStatus] = useState<Record<NamazName, boolean> | null>(null);
  
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.85)).current;
//   const resetFadeAnim = useRef(new Animated.Value(0)).current;
//   const resetScaleAnim = useRef(new Animated.Value(0.85)).current;

//   // --- Gear Animation Ref ---
//   const gearAnim = useRef(new Animated.Value(0)).current;

//   // --- Start Infinite Spin Logic ---
//   useEffect(() => {
//     const startSpin = () => {
//       gearAnim.setValue(0);
//       Animated.timing(gearAnim, {
//         toValue: 1,
//         duration: 2000, // 2 seconds (Slow & Smooth)
//         easing: Easing.in(Easing.linear), 
//         useNativeDriver: false, // Prevents bundle error
//       }).start(() => startSpin());
//     };
//     startSpin();
//   }, []);

//   const spin = gearAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   const getHeaderInfo = () => {
//     const now = new Date();
//     const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
//     const fullDate = now.toLocaleDateString('en-GB').replace(/\//g, '-');
//     return { dayName, fullDate };
//   };

//   const { dayName, fullDate } = getHeaderInfo();

//   useEffect(() => { loadInitialData(); }, []);
//   useEffect(() => { if (startDate) { refreshAllData(); fetchPrayerTimes(); } }, [selectedDate, sect, startDate, city]);

//   useEffect(() => {
//     if (showConfirm || showResetAlert) {
//       const targetFade = showConfirm ? fadeAnim : resetFadeAnim;
//       const targetScale = showConfirm ? scaleAnim : resetScaleAnim;
//       Animated.parallel([
//         Animated.timing(targetFade, { toValue: 1, duration: 250, useNativeDriver: false }),
//         Animated.spring(targetScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: false })
//       ]).start();
//     }
//   }, [showConfirm, showResetAlert]);

//   const loadInitialData = async () => {
//     const sDate = await AsyncStorage.getItem('tracking_start_date');
//     const sCity = await AsyncStorage.getItem('user_city');
//     const sCountry = await AsyncStorage.getItem('user_country');
//     if (sDate) setStartDate(sDate);
//     if (sCity) setCity(sCity);
//     if (sCountry) setCountry(sCountry);
//   };

//   const detectMyLocation = async () => {
//     setLoadingLoc(true);
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert("Permission Denied", "Please allow location access.");
//         setLoadingLoc(false);
//         return;
//       }
//       let loc = await Location.getCurrentPositionAsync({});
//       let geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
//       if (geo.length > 0) {
//         const newCity = geo[0].city || geo[0].region || 'Karachi';
//         const newCountry = geo[0].country || 'Pakistan';
//         saveLocation(newCity, newCountry);
//       }
//     } catch (e) { Alert.alert("Error", "Could not fetch location."); }
//     setLoadingLoc(false);
//   };

//   const saveLocation = async (newCity: string, newCountry: string) => {
//     setCity(newCity);
//     setCountry(newCountry);
//     await AsyncStorage.setItem('user_city', newCity);
//     await AsyncStorage.setItem('user_country', newCountry);
//     setShowLocModal(false);
//   };

//   const fetchPrayerTimes = async () => {
//     const method = sect === 'Hanafi' ? 1 : 0;
//     try {
//       const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`);
//       const data = await res.json();
//       if (data.code === 200) {
//         setPrayerTimes(data.data.timings);
//         const hijri = data.data.date.hijri;
//         setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year}`);
//       }
//     } catch (e) { console.error(e); }
//   };

//   const refreshAllData = async () => {
//     if (!startDate) return;
//     const markers: any = {};
//     let ada = 0, days = 0;
//     const start = new Date(startDate);
//     const end = new Date(todayStr);

//     for (let d = new Date(start); d <= end; d = new Date(d.setDate(d.getDate() + 1))) {
//       const dStr = getLocalDateString(d);
//       const saved = await AsyncStorage.getItem(`status_${dStr}`);
//       const status = saved ? JSON.parse(saved) : { ...defaultStatus };
//       const count = Object.values(status).filter(Boolean).length;
//       ada += count; days++;

//       markers[dStr] = {
//         customStyles: {
//           container: { backgroundColor: count === 5 ? '#059669' : count > 0 ? '#d97706' : '#dc2626', borderRadius: 8, borderWidth: dStr === selectedDate ? 2 : 0, borderColor: '#fff' },
//           text: { color: '#fff', fontWeight: 'bold' },
//         },
//       };
//     }
//     const curr = await AsyncStorage.getItem(`status_${selectedDate}`);
//     setDayRecords(curr ? JSON.parse(curr) : { ...defaultStatus });
//     setMarkedDates(markers);
//     setRangeStats({ totalAda: ada, totalQaza: days * 5 - ada });
//   };

//   const finalizeSave = async (statusToSave: Record<NamazName, boolean>) => {
//     await AsyncStorage.setItem(`status_${selectedDate}`, JSON.stringify(statusToSave));
//     setDayRecords(statusToSave);
//     setShowConfirm(false);
//     refreshAllData();
//   };

//   const handleResetConfirm = async () => {
//     await AsyncStorage.removeItem('tracking_start_date');
//     setStartDate(null);
//     setShowResetAlert(false);
//   };

//   const toggleNamaz = async (name: NamazName) => {
//     const isChecking = !dayRecords[name];
//     const newStatus = { ...dayRecords, [name]: isChecking };
//     if (isChecking && Object.values(newStatus).every(Boolean)) {
//       setPendingStatus(newStatus);
//       setShowConfirm(true);
//     } else { await finalizeSave(newStatus); }
//   };

//   if (!startDate) return (
//     <View style={styles.setup}>
//       <View style={styles.setupHeader}>
//         <View style={styles.iconCircleLarge}><Clock size={40} color="#10b981" /></View>
//         <Text style={styles.setupTitle}>Prayer Tracker</Text>
//         <Text style={styles.setupSubTitle}>Welcome! Select a date to start your tracking journey.</Text>
//       </View>
//       <View style={styles.calendarWrapper}>
//         <Text style={styles.calendarLabel}>From which date to start?</Text>
//         <Calendar 
//           maxDate={todayStr} 
//           onDayPress={(day) => { AsyncStorage.setItem('tracking_start_date', day.dateString); setStartDate(day.dateString); }} 
//           theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', todayTextColor: '#10b981', monthTextColor: '#10b981', arrowColor: '#10b981', textDisabledColor: '#222' }} 
//         />
//       </View>
//     </View>
//   );

//   const isAllDone = Object.values(dayRecords).every(Boolean);

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
//       {/* All Modals (Unchanged) */}
//       <Modal visible={showConfirm} transparent animationType="none">
//         <View style={styles.modalOverlay}>
//           <Animated.View style={[styles.sweetAlert, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
//             <View style={styles.iconCircle}><CircleCheck size={40} color="#10b981" /></View>
//             <Text style={styles.alertTitle}>MASHALLAH!</Text>
//             <Text style={styles.alertMsg}>Daily goal reached! Have you completed all 5 prayers?</Text>
//             <View style={styles.alertButtons}>
//               <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={() => setShowConfirm(false)}><Text style={styles.btnTextNo}>Cancel</Text></TouchableOpacity>
//               <TouchableOpacity style={[styles.btn, styles.btnYes]} onPress={() => pendingStatus && finalizeSave(pendingStatus)}><Text style={styles.btnTextYes}>Confirm</Text></TouchableOpacity>
//             </View>
//           </Animated.View>
//         </View>
//       </Modal>

//       <Modal visible={showResetAlert} transparent animationType="none">
//         <View style={styles.modalOverlay}>
//           <Animated.View style={[styles.sweetAlert, { opacity: resetFadeAnim, transform: [{ scale: resetScaleAnim }] }]}>
//             <View style={[styles.iconCircle, { backgroundColor: '#450a0a' }]}><Clock size={40} color="#ef4444" /></View>
//             <Text style={styles.alertTitle}>RESET DATE?</Text>
//             <Text style={styles.alertMsg}>Are you sure to change your namaz track dates?</Text>
//             <View style={styles.alertButtons}>
//               <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={() => setShowResetAlert(false)}><Text style={styles.btnTextNo}>No</Text></TouchableOpacity>
//               <TouchableOpacity style={[styles.btn, { backgroundColor: '#ef4444' }]} onPress={handleResetConfirm}><Text style={styles.btnTextYes}>Yes, Change</Text></TouchableOpacity>
//             </View>
//           </Animated.View>
//         </View>
//       </Modal>

//       <Modal visible={showLocModal} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.locModal}>
//             <View style={styles.modalHeader}><Text style={styles.modalTitle}>Change Location</Text><TouchableOpacity onPress={() => setShowLocModal(false)}><X size={24} color="#444" /></TouchableOpacity></View>
//             <TouchableOpacity style={styles.autoDetectBtn} onPress={detectMyLocation} disabled={loadingLoc}>{loadingLoc ? <ActivityIndicator color="#000" /> : <><Navigation size={18} color="#000" /><Text style={styles.autoDetectText}>Auto-Detect (GPS)</Text></>}</TouchableOpacity>
//             <View style={styles.divider} /><Text style={styles.inputLabel}>Manual City</Text><TextInput style={styles.input} placeholder="e.g. London" value={tempCity} onChangeText={setTempCity} placeholderTextColor="#333" /><Text style={styles.inputLabel}>Manual Country</Text><TextInput style={styles.input} placeholder="e.g. UK" value={tempCountry} onChangeText={setTempCountry} placeholderTextColor="#333" /><TouchableOpacity style={styles.saveLocBtn} onPress={() => saveLocation(tempCity || city, tempCountry || country)}><Text style={styles.saveLocText}>Save Entry</Text></TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => { setTempCity(city); setTempCountry(country); setShowLocModal(true); }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><MapPin size={18} color="#10b981" /><Text style={styles.locLabel}>{city.toUpperCase()}</Text><Edit3 size={14} color="#444" /></View>
//           <Text style={styles.headerDayText}>{dayName}</Text>
//           <Text style={styles.headerDateText}>{fullDate}</Text>
//           <Text style={styles.headerIslamicText}>{islamicDate}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setSect(sect === 'Hanafi' ? 'Jafari' : 'Hanafi')} style={styles.sectBtn}><Text style={sect === 'Hanafi' ? styles.sectBtnText : [styles.sectBtnText, {color: '#f59e0b'}]}>{sect}</Text><Settings2 size={14} color="#10b981" /></TouchableOpacity>
//       </View>

//       <View style={styles.statsContainer}>
//         <View style={styles.statCard}><Text style={[styles.statNum, { color: '#10b981' }]}>{rangeStats.totalAda}</Text><Text style={styles.statLabel}>TOTAL ADA</Text></View>
//         <View style={styles.statCard}><Text style={[styles.statNum, { color: '#ef4444' }]}>{rangeStats.totalQaza}</Text><Text style={styles.statLabel}>TOTAL QAZA</Text></View>
//       </View>

//       <View style={styles.calendarCard}>
//         <View style={{ alignItems: 'center', marginBottom: 5 }}>
//           <Text style={styles.trackingDateLabel}>Tracking Date Start from</Text>
//           <Text style={styles.trackingDateValue}>{startDate?.split('-').reverse().join('/')}</Text>
//         </View>

//         <View style={styles.calendarHeader}>
//           <Text style={styles.calendarCardTitle}>Consistency Map</Text>
          
//           {/* Animated Settings Icon with Static Glow Box */}
//           <TouchableOpacity onPress={() => setShowResetAlert(true)} style={styles.gearWrapper}>
//             <View style={styles.glowBox}>
//               <Animated.View style={{ transform: [{ rotate: spin }] }}>
//                 <Settings size={20} color="#10b981" />
//               </Animated.View>
//             </View>
//           </TouchableOpacity>
//         </View>

//         <Calendar 
//           markingType="custom" 
//           markedDates={markedDates} 
//           maxDate={todayStr} 
//           onDayPress={(day) => setSelectedDate(day.dateString)} 
//           theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', monthTextColor: '#10b981', todayTextColor: '#10b981', arrowColor: '#10b981', textDisabledColor: 'rgba(255, 255, 255, 0.1)' }} 
//         />
//       </View>

//       <View style={styles.detailContainer}>
//         <View style={styles.detailHeaderRow}><Text style={styles.detailHeader}>Prayer Status</Text><Text style={styles.dateLabel}>{selectedDate === todayStr ? "TODAY" : selectedDate}</Text></View>
//         {isAllDone ? (
//           <View style={styles.congratulationBox}><Text style={styles.arabicText}>مَاشَاءَ ٱللَّٰهُ</Text><Text style={styles.congratText}>All prayers completed for today!</Text><TouchableOpacity style={styles.undoBtn} onPress={() => finalizeSave({...dayRecords, Isha: false})}><Text style={styles.undoBtnText}>Update Log</Text></TouchableOpacity></View>
//         ) : (
//           (Object.keys(defaultStatus) as NamazName[]).map((name) => (
//             <TouchableOpacity key={name} style={styles.detailRow} onPress={() => toggleNamaz(name)}>
//               <View style={styles.rowLeft}><View style={[styles.timeIcon, { backgroundColor: dayRecords[name] ? '#064e3b' : '#111' }]}><Clock size={18} color={dayRecords[name] ? "#10b981" : "#444"} /></View><View style={{ marginLeft: 15 }}><Text style={styles.nameText}>{name}</Text><Text style={styles.timeText}>Athan: {prayerTimes?.[name] || '--:--'}</Text></View></View>
//               {dayRecords[name] ? <CheckCircle2 color="#10b981" size={26} /> : <Circle color="#222" size={26} />}
//             </TouchableOpacity>
//           ))
//         )}
//       </View>
//       <View style={{ height: 100 }} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000', padding: 16 },
//   setup: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 25 },
//   setupHeader: { alignItems: 'center', marginBottom: 30 },
//   iconCircleLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
//   setupTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
//   setupSubTitle: { color: '#777', fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 18, paddingHorizontal: 15 },
//   calendarWrapper: { backgroundColor: '#050505', borderRadius: 25, padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
//   calendarLabel: { color: '#10b981', fontSize: 11, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 45, marginBottom: 25, alignItems: 'flex-start' },
//   locLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   headerDayText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 5 },
//   headerDateText: { color: '#fff', fontSize: 16, marginTop: 2 },
//   headerIslamicText: { color: '#10b981', fontSize: 14, fontWeight: '600', marginTop: 2 },

//   sectBtn: { 
//   flexDirection: 'row', 
//   alignItems: 'center', 
//   backgroundColor: '#0a0a0a', 
//   paddingHorizontal: 12, 
//   borderRadius: 12, 
//   height: 35, 
//   gap: 6,
  
//   // --- Glow Logic ---
//   borderWidth: 1.5,
//   // Border ko bhi green rakhein taake glow natural lage
//   borderColor: '#10b981', 
  
//   // Neon Glow for iOS
//   shadowColor: '#10b981',
//   shadowOffset: { width: 0, height: 0 },
//   shadowOpacity: 0.9, // Thora zyada kar diya taake nazar aaye
//   shadowRadius: 10,
  
//   // Neon Glow for Android
//   elevation: 12, 
// },
//   sectBtnText: { color: '#10b981', fontWeight: 'bold', fontSize: 11 },
//   statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
//   statCard: { flex: 1, backgroundColor: '#0a0a0a', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
//   statNum: { fontSize: 24, fontWeight: 'bold' },
//   statLabel: { color: '#555', fontSize: 8, fontWeight: 'bold', marginTop: 5 },
//   calendarCard: { backgroundColor: '#050505', borderRadius: 25, padding: 10, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
//   trackingDateLabel: { color: '#10b981', fontSize: 18, fontWeight: 'bold' },
//   trackingDateValue: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
//   calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10 },
//   calendarCardTitle: { color: '#444', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
//   // --- Glow Box Style ---
//   gearWrapper: { padding: 5 },
//   glowBox: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
//     backgroundColor: '#0a0a0a',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: '#10b981',
//     // Neon Glow for iOS
//     shadowColor: '#10b981',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 10,
//     // Neon Glow for Android
//     elevation: 10,
//   },

//   detailContainer: { padding: 20, backgroundColor: '#050505', borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', minHeight: 350 },
//   detailHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   detailHeader: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
//   dateLabel: { color: '#10b981', fontSize: 15, fontWeight: 'bold' },
//   detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111' },
//   rowLeft: { flexDirection: 'row', alignItems: 'center' },
//   timeIcon: { padding: 8, borderRadius: 12 },
//   nameText: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   timeText: { color: '#555', fontSize: 11, marginTop: 2 },
//   congratulationBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
//   arabicText: { color: '#10b981', fontSize: 40, fontWeight: 'bold', marginBottom: 10 },
//   congratText: { color: '#999', fontSize: 13, marginBottom: 25 },
//   undoBtn: { backgroundColor: '#111', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
//   undoBtnText: { color: '#10b981', fontWeight: 'bold', fontSize: 12 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
//   sweetAlert: { width: width * 0.8, backgroundColor: '#0a0a0a', borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
//   iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#064e3b', justifyContent: 'center', alignItems: 'center' },
//   alertTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 15 },
//   alertMsg: { color: '#666', textAlign: 'center', marginTop: 10, fontSize: 14, lineHeight: 20 },
//   alertButtons: { flexDirection: 'row', marginTop: 30, width: '100%', gap: 12 },
//   btn: { flex: 1, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
//   btnNo: { backgroundColor: '#1a1a1a' },
//   btnYes: { backgroundColor: '#10b981' },
//   btnTextNo: { color: '#666', fontWeight: 'bold' },
//   btnTextYes: { color: '#000', fontWeight: 'bold' },
//   locModal: { width: width * 0.85, backgroundColor: '#0a0a0a', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
//   autoDetectBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 10 },
//   autoDetectText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
//   divider: { height: 1, backgroundColor: '#222', marginVertical: 15 },
//   inputLabel: { color: '#10b981', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
//   input: { backgroundColor: '#111', borderRadius: 12, padding: 15, color: '#fff', marginBottom: 15, borderWidth: 1, borderColor: '#222' },
//   saveLocBtn: { backgroundColor: '#111', borderRadius: 15, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: '#10b981' },
//   saveLocText: { color: '#10b981', fontWeight: 'bold' }
// });






////// ======================= try to get location from home ======================================/////////////



// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Location from 'expo-location';
// import { CheckCircle2, Circle, CircleCheck, Clock, Edit3, MapPin, Settings, Settings2 } from 'lucide-react-native';
// import React, { useEffect, useRef, useState } from 'react';
// import { Animated, Dimensions, Easing, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { Calendar } from 'react-native-calendars';

// const { width } = Dimensions.get('window');

// type NamazName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
// const defaultStatus: Record<NamazName, boolean> = { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };

// export default function NamazFinalApp() {
//   const getLocalDateString = (date: Date) => {
//     const offset = date.getTimezoneOffset();
//     const localDate = new Date(date.getTime() - (offset * 60 * 1000));
//     return localDate.toISOString().split('T')[0];
//   };

//   const todayStr = getLocalDateString(new Date());
//   const [startDate, setStartDate] = useState<string | null>(null);
//   const [selectedDate, setSelectedDate] = useState(todayStr);
//   const [sect, setSect] = useState<'Hanafi' | 'Jafari'>('Hanafi');
  
//   // Default values
//   const [city, setCity] = useState('Loading...');
//   const [country, setCountry] = useState('Pakistan');
//   const [showLocModal, setShowLocModal] = useState(false);
//   const [tempCity, setTempCity] = useState('');
//   const [tempCountry, setTempCountry] = useState('');
//   const [loadingLoc, setLoadingLoc] = useState(false);
//   const [islamicDate, setIslamicDate] = useState('-- -- ----');

//   const [markedDates, setMarkedDates] = useState<any>({});
//   const [dayRecords, setDayRecords] = useState<Record<NamazName, boolean>>(defaultStatus);
//   const [rangeStats, setRangeStats] = useState({ totalAda: 0, totalQaza: 0 });
//   const [prayerTimes, setPrayerTimes] = useState<any>(null);
  
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [showResetAlert, setShowResetAlert] = useState(false);
//   const [pendingStatus, setPendingStatus] = useState<Record<NamazName, boolean> | null>(null);
  
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.85)).current;
//   const resetFadeAnim = useRef(new Animated.Value(0)).current;
//   const resetScaleAnim = useRef(new Animated.Value(0.85)).current;
//   const gearAnim = useRef(new Animated.Value(0)).current;

//   // --- Gear Animation ---
//   useEffect(() => {
//     const startSpin = () => {
//       gearAnim.setValue(0);
//       Animated.timing(gearAnim, {
//         toValue: 1,
//         duration: 2000,
//         easing: Easing.linear, 
//         useNativeDriver: false,
//       }).start(() => startSpin());
//     };
//     startSpin();
//   }, []);

//   const spin = gearAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   const getHeaderInfo = () => {
//     const now = new Date();
//     const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
//     const fullDate = now.toLocaleDateString('en-GB').replace(/\//g, '-');
//     return { dayName, fullDate };
//   };

//   const { dayName, fullDate } = getHeaderInfo();

//   // --- AUTO SYNC LOCATION FROM HOME SCREEN ---
//   useEffect(() => {
//     const loadSharedLocation = async () => {
//       try {
//         const savedCity = await AsyncStorage.getItem('user_city');
//         const savedCountry = await AsyncStorage.getItem('user_country');
//         const sDate = await AsyncStorage.getItem('tracking_start_date');
        
//         if (sDate) setStartDate(sDate);
        
//         // Agar home screen ne location save ki hai, toh wahi utha lo
//         if (savedCity) {
//           setCity(savedCity);
//           if (savedCountry) setCountry(savedCountry);
//         } else {
//           // Agar home screen par bhi nahi mili (pehli baar app khuli), toh auto-detect kar lo
//           detectMyLocation();
//         }
//       } catch (e) {
//         console.error("Storage Error", e);
//       }
//     };
    
//     loadSharedLocation();
//     loadInitialData(); 
//   }, []);

//   useEffect(() => { if (startDate) { refreshAllData(); fetchPrayerTimes(); } }, [selectedDate, sect, startDate, city]);

//   useEffect(() => {
//     if (showConfirm || showResetAlert) {
//       const targetFade = showConfirm ? fadeAnim : resetFadeAnim;
//       const targetScale = showConfirm ? scaleAnim : resetScaleAnim;
//       Animated.parallel([
//         Animated.timing(targetFade, { toValue: 1, duration: 250, useNativeDriver: false }),
//         Animated.spring(targetScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: false })
//       ]).start();
//     }
//   }, [showConfirm, showResetAlert]);

//   const loadInitialData = async () => {
//     const sDate = await AsyncStorage.getItem('tracking_start_date');
//     if (sDate) setStartDate(sDate);
//   };

//   const detectMyLocation = async () => {
//     setLoadingLoc(true);
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setCity("Lahore"); // Fallback
//         setLoadingLoc(false);
//         return;
//       }
//       // High speed detection
//       let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
//       let geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
//       if (geo.length > 0) {
//         const newCity = geo[0].city || geo[0].region || 'Karachi';
//         const newCountry = geo[0].country || 'Pakistan';
//         saveLocation(newCity, newCountry);
//       }
//     } catch (e) { console.log("Loc Error", e); }
//     setLoadingLoc(false);
//   };

//   const saveLocation = async (newCity: string, newCountry: string) => {
//     setCity(newCity);
//     setCountry(newCountry);
//     await AsyncStorage.setItem('user_city', newCity);
//     await AsyncStorage.setItem('user_country', newCountry);
//     setShowLocModal(false);
//   };

//   const fetchPrayerTimes = async () => {
//     if (city === 'Loading...') return;
//     const method = sect === 'Hanafi' ? 1 : 0;
//     try {
//       const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`);
//       const data = await res.json();
//       if (data.code === 200) {
//         setPrayerTimes(data.data.timings);
//         const hijri = data.data.date.hijri;
//         setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year}`);
//       }
//     } catch (e) { console.error(e); }
//   };

//   // refreshAllData, finalizeSave, toggleNamaz, etc. (Baqi Logic SAME rahay gi)
//   const refreshAllData = async () => {
//     if (!startDate) return;
//     const markers: any = {};
//     let ada = 0, days = 0;
//     const start = new Date(startDate);
//     const end = new Date(todayStr);

//     for (let d = new Date(start); d <= end; d = new Date(d.setDate(d.getDate() + 1))) {
//       const dStr = getLocalDateString(d);
//       const saved = await AsyncStorage.getItem(`status_${dStr}`);
//       const status = saved ? JSON.parse(saved) : { ...defaultStatus };
//       const count = Object.values(status).filter(Boolean).length;
//       ada += count; days++;

//       markers[dStr] = {
//         customStyles: {
//           container: { backgroundColor: count === 5 ? '#059669' : count > 0 ? '#d97706' : '#dc2626', borderRadius: 8, borderWidth: dStr === selectedDate ? 2 : 0, borderColor: '#fff' },
//           text: { color: '#fff', fontWeight: 'bold' },
//         },
//       };
//     }
//     const curr = await AsyncStorage.getItem(`status_${selectedDate}`);
//     setDayRecords(curr ? JSON.parse(curr) : { ...defaultStatus });
//     setMarkedDates(markers);
//     setRangeStats({ totalAda: ada, totalQaza: days * 5 - ada });
//   };

//   const finalizeSave = async (statusToSave: Record<NamazName, boolean>) => {
//     await AsyncStorage.setItem(`status_${selectedDate}`, JSON.stringify(statusToSave));
//     setDayRecords(statusToSave);
//     setShowConfirm(false);
//     refreshAllData();
//   };

//   const handleResetConfirm = async () => {
//     await AsyncStorage.removeItem('tracking_start_date');
//     setStartDate(null);
//     setShowResetAlert(false);
//   };

//   const toggleNamaz = async (name: NamazName) => {
//     const isChecking = !dayRecords[name];
//     const newStatus = { ...dayRecords, [name]: isChecking };
//     if (isChecking && Object.values(newStatus).every(Boolean)) {
//       setPendingStatus(newStatus);
//       setShowConfirm(true);
//     } else { await finalizeSave(newStatus); }
//   };

//   if (!startDate) return (
//     <View style={styles.setup}>
//       <View style={styles.setupHeader}>
//         <View style={styles.iconCircleLarge}><Clock size={40} color="#10b981" /></View>
//         <Text style={styles.setupTitle}>Prayer Tracker</Text>
//         <Text style={styles.setupSubTitle}>Welcome! Select a date to start your tracking journey.</Text>
//       </View>
//       <View style={styles.calendarWrapper}>
//         <Text style={styles.calendarLabel}>From which date to start?</Text>
//         <Calendar 
//           maxDate={todayStr} 
//           onDayPress={(day) => { AsyncStorage.setItem('tracking_start_date', day.dateString); setStartDate(day.dateString); }} 
//           theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', todayTextColor: '#10b981', monthTextColor: '#10b981', arrowColor: '#10b981', textDisabledColor: '#222' }} 
//         />
//       </View>
//     </View>
//   );

//   const isAllDone = Object.values(dayRecords).every(Boolean);

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
//       {/* Modals and UI content (Keep your original JSX here) */}
//       {/* ... Copy paste the entire return content from your original code here ... */}
//       {/* Bas Header mein location display automatically update ho jaye gi */}
      
//       <Modal visible={showConfirm} transparent animationType="none">
//         <View style={styles.modalOverlay}>
//           <Animated.View style={[styles.sweetAlert, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
//             <View style={styles.iconCircle}><CircleCheck size={40} color="#10b981" /></View>
//             <Text style={styles.alertTitle}>MASHALLAH!</Text>
//             <Text style={styles.alertMsg}>Daily goal reached! Have you completed all 5 prayers?</Text>
//             <View style={styles.alertButtons}>
//               <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={() => setShowConfirm(false)}><Text style={styles.btnTextNo}>Cancel</Text></TouchableOpacity>
//               <TouchableOpacity style={[styles.btn, styles.btnYes]} onPress={() => pendingStatus && finalizeSave(pendingStatus)}><Text style={styles.btnTextYes}>Confirm</Text></TouchableOpacity>
//             </View>
//           </Animated.View>
//         </View>
//       </Modal>

//       {/* [Baqi saara UI code as it is paste kar dein jo aapne upar diya tha] */}
      
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => { setTempCity(city); setTempCountry(country); setShowLocModal(true); }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><MapPin size={18} color="#10b981" /><Text style={styles.locLabel}>{city.toUpperCase()}</Text><Edit3 size={14} color="#444" /></View>
//           <Text style={styles.headerDayText}>{dayName}</Text>
//           <Text style={styles.headerDateText}>{fullDate}</Text>
//           <Text style={styles.headerIslamicText}>{islamicDate}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setSect(sect === 'Hanafi' ? 'Jafari' : 'Hanafi')} style={styles.sectBtn}><Text style={sect === 'Hanafi' ? styles.sectBtnText : [styles.sectBtnText, {color: '#f59e0b'}]}>{sect}</Text><Settings2 size={14} color="#10b981" /></TouchableOpacity>
//       </View>

//       {/* stats, calendar consistency map, and prayer status detail sections... */}
//       {/* ... keeping the rest of your original UI code ... */}
//       <View style={styles.statsContainer}>
//          <View style={styles.statCard}><Text style={[styles.statNum, { color: '#10b981' }]}>{rangeStats.totalAda}</Text><Text style={styles.statLabel}>TOTAL ADA</Text></View>
//          <View style={styles.statCard}><Text style={[styles.statNum, { color: '#ef4444' }]}>{rangeStats.totalQaza}</Text><Text style={styles.statLabel}>TOTAL QAZA</Text></View>
//       </View>

//       <View style={styles.calendarCard}>
//          <View style={{ alignItems: 'center', marginBottom: 5 }}>
//            <Text style={styles.trackingDateLabel}>Tracking Date Start from</Text>
//            <Text style={styles.trackingDateValue}>{startDate?.split('-').reverse().join('/')}</Text>
//          </View>
//          <View style={styles.calendarHeader}>
//            <Text style={styles.calendarCardTitle}>Consistency Map</Text>
//            <TouchableOpacity onPress={() => setShowResetAlert(true)} style={styles.gearWrapper}>
//              <View style={styles.glowBox}>
//                <Animated.View style={{ transform: [{ rotate: spin }] }}>
//                  <Settings size={20} color="#10b981" />
//                </Animated.View>
//              </View>
//            </TouchableOpacity>
//          </View>
//          <Calendar 
//            markingType="custom" 
//            markedDates={markedDates} 
//            maxDate={todayStr} 
//            onDayPress={(day) => setSelectedDate(day.dateString)} 
//            theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', monthTextColor: '#10b981', todayTextColor: '#10b981', arrowColor: '#10b981', textDisabledColor: 'rgba(255, 255, 255, 0.1)' }} 
//          />
//       </View>

//       <View style={styles.detailContainer}>
//          <View style={styles.detailHeaderRow}><Text style={styles.detailHeader}>Prayer Status</Text><Text style={styles.dateLabel}>{selectedDate === todayStr ? "TODAY" : selectedDate}</Text></View>
//          {isAllDone ? (
//            <View style={styles.congratulationBox}><Text style={styles.arabicText}>مَاشَاءَ ٱللَّٰهُ</Text><Text style={styles.congratText}>All prayers completed for today!</Text><TouchableOpacity style={styles.undoBtn} onPress={() => finalizeSave({...dayRecords, Isha: false})}><Text style={styles.undoBtnText}>Update Log</Text></TouchableOpacity></View>
//          ) : (
//            (Object.keys(defaultStatus) as NamazName[]).map((name) => (
//              <TouchableOpacity key={name} style={styles.detailRow} onPress={() => toggleNamaz(name)}>
//                <View style={styles.rowLeft}><View style={[styles.timeIcon, { backgroundColor: dayRecords[name] ? '#064e3b' : '#111' }]}><Clock size={18} color={dayRecords[name] ? "#10b981" : "#444"} /></View><View style={{ marginLeft: 15 }}><Text style={styles.nameText}>{name}</Text><Text style={styles.timeText}>Athan: {prayerTimes?.[name] || '--:--'}</Text></View></View>
//                {dayRecords[name] ? <CheckCircle2 color="#10b981" size={26} /> : <Circle color="#222" size={26} />}
//              </TouchableOpacity>
//            ))
//          )}
//       </View>

//       <View style={{ height: 100 }} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000', padding: 16 },
//   setup: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 25 },
//   setupHeader: { alignItems: 'center', marginBottom: 30 },
//   iconCircleLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
//   setupTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
//   setupSubTitle: { color: '#777', fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 18, paddingHorizontal: 15 },
//   calendarWrapper: { backgroundColor: '#050505', borderRadius: 25, padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
//   calendarLabel: { color: '#10b981', fontSize: 11, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 45, marginBottom: 25, alignItems: 'flex-start' },
//   locLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   headerDayText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 5 },
//   headerDateText: { color: '#fff', fontSize: 16, marginTop: 2 },
//   headerIslamicText: { color: '#10b981', fontSize: 14, fontWeight: '600', marginTop: 2 },

//   sectBtn: { 
//   flexDirection: 'row', 
//   alignItems: 'center', 
//   backgroundColor: '#0a0a0a', 
//   paddingHorizontal: 12, 
//   borderRadius: 12, 
//   height: 35, 
//   gap: 6,
  
//   // --- Glow Logic ---
//   borderWidth: 1.5,
//   // Border ko bhi green rakhein taake glow natural lage
//   borderColor: '#10b981', 
  
//   // Neon Glow for iOS
//   shadowColor: '#10b981',
//   shadowOffset: { width: 0, height: 0 },
//   shadowOpacity: 0.9, // Thora zyada kar diya taake nazar aaye
//   shadowRadius: 10,
  
//   // Neon Glow for Android
//   elevation: 12, 
// },
//   sectBtnText: { color: '#10b981', fontWeight: 'bold', fontSize: 11 },
//   statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
//   statCard: { flex: 1, backgroundColor: '#0a0a0a', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
//   statNum: { fontSize: 24, fontWeight: 'bold' },
//   statLabel: { color: '#555', fontSize: 8, fontWeight: 'bold', marginTop: 5 },
//   calendarCard: { backgroundColor: '#050505', borderRadius: 25, padding: 10, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
//   trackingDateLabel: { color: '#10b981', fontSize: 18, fontWeight: 'bold' },
//   trackingDateValue: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
//   calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10 },
//   calendarCardTitle: { color: '#444', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
//   // --- Glow Box Style ---
//   gearWrapper: { padding: 5 },
//   glowBox: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
//     backgroundColor: '#0a0a0a',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: '#10b981',
//     // Neon Glow for iOS
//     shadowColor: '#10b981',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 10,
//     // Neon Glow for Android
//     elevation: 10,
//   },

//   detailContainer: { padding: 20, backgroundColor: '#050505', borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', minHeight: 350 },
//   detailHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   detailHeader: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
//   dateLabel: { color: '#10b981', fontSize: 15, fontWeight: 'bold' },
//   detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111' },
//   rowLeft: { flexDirection: 'row', alignItems: 'center' },
//   timeIcon: { padding: 8, borderRadius: 12 },
//   nameText: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   timeText: { color: '#555', fontSize: 11, marginTop: 2 },
//   congratulationBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
//   arabicText: { color: '#10b981', fontSize: 40, fontWeight: 'bold', marginBottom: 10 },
//   congratText: { color: '#999', fontSize: 13, marginBottom: 25 },
//   undoBtn: { backgroundColor: '#111', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
//   undoBtnText: { color: '#10b981', fontWeight: 'bold', fontSize: 12 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
//   sweetAlert: { width: width * 0.8, backgroundColor: '#0a0a0a', borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
//   iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#064e3b', justifyContent: 'center', alignItems: 'center' },
//   alertTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 15 },
//   alertMsg: { color: '#666', textAlign: 'center', marginTop: 10, fontSize: 14, lineHeight: 20 },
//   alertButtons: { flexDirection: 'row', marginTop: 30, width: '100%', gap: 12 },
//   btn: { flex: 1, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
//   btnNo: { backgroundColor: '#1a1a1a' },
//   btnYes: { backgroundColor: '#10b981' },
//   btnTextNo: { color: '#666', fontWeight: 'bold' },
//   btnTextYes: { color: '#000', fontWeight: 'bold' },
//   locModal: { width: width * 0.85, backgroundColor: '#0a0a0a', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
//   modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
//   modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
//   autoDetectBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 10 },
//   autoDetectText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
//   divider: { height: 1, backgroundColor: '#222', marginVertical: 15 },
//   inputLabel: { color: '#10b981', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
//   input: { backgroundColor: '#111', borderRadius: 12, padding: 15, color: '#fff', marginBottom: 15, borderWidth: 1, borderColor: '#222' },
//   saveLocBtn: { backgroundColor: '#111', borderRadius: 15, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: '#10b981' },
//   saveLocText: { color: '#10b981', fontWeight: 'bold' }
// });




































import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { CheckCircle2, Circle, CircleCheck, Clock, Edit3, MapPin, Navigation, Settings, Settings2, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Easing, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const { width } = Dimensions.get('window');

type NamazName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
const defaultStatus: Record<NamazName, boolean> = { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };

export default function NamazFinalApp() {
  const getLocalDateString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const todayStr = getLocalDateString(new Date());
  const [startDate, setStartDate] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [sect, setSect] = useState<'Hanafi' | 'Jafari'>('Hanafi');
  
  const [city, setCity] = useState('Loading...');
  const [country, setCountry] = useState('PK'); // Short code
  const [showLocModal, setShowLocModal] = useState(false);
  const [tempCity, setTempCity] = useState('');
  const [tempCountry, setTempCountry] = useState('');
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [islamicDate, setIslamicDate] = useState('-- -- ----');

  const [markedDates, setMarkedDates] = useState<any>({});
  const [dayRecords, setDayRecords] = useState<Record<NamazName, boolean>>(defaultStatus);
  const [rangeStats, setRangeStats] = useState({ totalAda: 0, totalQaza: 0 });
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Record<NamazName, boolean> | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const resetFadeAnim = useRef(new Animated.Value(0)).current;
  const resetScaleAnim = useRef(new Animated.Value(0.85)).current;
  const gearAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startSpin = () => {
      gearAnim.setValue(0);
      Animated.timing(gearAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear, 
        useNativeDriver: false,
      }).start(() => startSpin());
    };
    startSpin();
  }, []);

  const spin = gearAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getHeaderInfo = () => {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = now.toLocaleDateString('en-GB').replace(/\//g, '-');
    return { dayName, fullDate };
  };

  const { dayName, fullDate } = getHeaderInfo();

  // --- AUTO SYNC ---
  useEffect(() => {
    const loadData = async () => {
      const sCity = await AsyncStorage.getItem('user_city');
      const sCountry = await AsyncStorage.getItem('user_country');
      const sDate = await AsyncStorage.getItem('tracking_start_date');
      
      if (sDate) setStartDate(sDate);
      if (sCity) setCity(sCity);
      if (sCountry) setCountry(sCountry);
      
      if (!sCity) detectMyLocation();
    };
    loadData();
  }, []);

  useEffect(() => { if (startDate) { refreshAllData(); fetchPrayerTimes(); } }, [selectedDate, sect, startDate, city]);

  useEffect(() => {
    if (showConfirm || showResetAlert) {
      const targetFade = showConfirm ? fadeAnim : resetFadeAnim;
      const targetScale = showConfirm ? scaleAnim : resetScaleAnim;
      Animated.parallel([
        Animated.timing(targetFade, { toValue: 1, duration: 250, useNativeDriver: false }),
        Animated.spring(targetScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: false })
      ]).start();
    }
  }, [showConfirm, showResetAlert]);

  const detectMyLocation = async () => {
    setLoadingLoc(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCity("LAHORE"); setCountry("PK");
        setLoadingLoc(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      let geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      if (geo.length > 0) {
        const newCity = (geo[0].city || geo[0].region || 'KARACHI').toUpperCase();
        const newCountry = (geo[0].isoCountryCode || 'PK').toUpperCase();
        saveLocation(newCity, newCountry);
      }
    } catch (e) { console.log(e); }
    setLoadingLoc(false);
  };

  const saveLocation = async (newCity: string, newCountry: string) => {
    const ucCity = newCity.toUpperCase();
    const ucCountry = newCountry.toUpperCase();
    setCity(ucCity);
    setCountry(ucCountry);
    await AsyncStorage.setItem('user_city', ucCity);
    await AsyncStorage.setItem('user_country', ucCountry);
    setShowLocModal(false);
  };

  const fetchPrayerTimes = async () => {
    if (city === 'Loading...') return;
    const method = sect === 'Hanafi' ? 1 : 0;
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`);
      const data = await res.json();
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
        const hijri = data.data.date.hijri;
        setIslamicDate(`${hijri.day} ${hijri.month.en} ${hijri.year}`);
      }
    } catch (e) { console.error(e); }
  };

  const refreshAllData = async () => {
    if (!startDate) return;
    const markers: any = {};
    let ada = 0; let days = 0;
    const start = new Date(startDate);
    const end = new Date(todayStr);

    for (let d = new Date(start); d <= end; d = new Date(d.setDate(d.getDate() + 1))) {
      const dStr = getLocalDateString(d);
      const saved = await AsyncStorage.getItem(`status_${dStr}`);
      const status = saved ? JSON.parse(saved) : { ...defaultStatus };
      const count = Object.values(status).filter(Boolean).length;
      ada += count; days++;

      markers[dStr] = {
        customStyles: {
          container: { backgroundColor: count === 5 ? '#059669' : count > 0 ? '#d97706' : '#dc2626', borderRadius: 8, borderWidth: dStr === selectedDate ? 2 : 0, borderColor: '#fff' },
          text: { color: '#fff', fontWeight: 'bold' },
        },
      };
    }
    const curr = await AsyncStorage.getItem(`status_${selectedDate}`);
    setDayRecords(curr ? JSON.parse(curr) : { ...defaultStatus });
    setMarkedDates(markers);
    setRangeStats({ totalAda: ada, totalQaza: days * 5 - ada });
  };

  const finalizeSave = async (statusToSave: Record<NamazName, boolean>) => {
    await AsyncStorage.setItem(`status_${selectedDate}`, JSON.stringify(statusToSave));
    setDayRecords(statusToSave);
    setShowConfirm(false);
    refreshAllData();
  };

  const handleResetConfirm = async () => {
    try {
      await AsyncStorage.removeItem('tracking_start_date');
      // Saara puraana record saaf karne ke liye (Optional)
      // await AsyncStorage.clear(); 
      setStartDate(null);
      setShowResetAlert(false);
    } catch (e) {
      console.error("Reset Error", e);
    }
  };

  const toggleNamaz = async (name: NamazName) => {
    const isChecking = !dayRecords[name];
    const newStatus = { ...dayRecords, [name]: isChecking };
    if (isChecking && Object.values(newStatus).every(Boolean)) {
      setPendingStatus(newStatus);
      setShowConfirm(true);
    } else { await finalizeSave(newStatus); }
  };

  if (!startDate) return (
    <View style={styles.setup}>
      <View style={styles.setupHeader}>
        <View style={styles.iconCircleLarge}><Clock size={40} color="#10b981" /></View>
        <Text style={styles.setupTitle}>Prayer Tracker</Text>
        <Text style={styles.setupSubTitle}>Welcome! Select a date to start your tracking journey.</Text>
      </View>
      <View style={styles.calendarWrapper}>
        <Text style={styles.calendarLabel}>From which date to start?</Text>
        <Calendar 
          maxDate={todayStr} 
          onDayPress={(day) => { AsyncStorage.setItem('tracking_start_date', day.dateString); setStartDate(day.dateString); }} 
          theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', todayTextColor: '#10b981', monthTextColor: '#10b981', arrowColor: '#10b981', textDisabledColor: '#222' }} 
        />
      </View>
    </View>
  );

  const isAllDone = Object.values(dayRecords).every(Boolean);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Modals */}
      <Modal visible={showConfirm} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.sweetAlert, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.iconCircle}><CircleCheck size={40} color="#10b981" /></View>
            <Text style={styles.alertTitle}>MASHALLAH!</Text>
            <Text style={styles.alertMsg}>Daily goal reached! Have you completed all 5 prayers?</Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={() => setShowConfirm(false)}><Text style={styles.btnTextNo}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnYes]} onPress={() => pendingStatus && finalizeSave(pendingStatus)}><Text style={styles.btnTextYes}>Confirm</Text></TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={showResetAlert} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.sweetAlert, { opacity: resetFadeAnim, transform: [{ scale: resetScaleAnim }] }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#450a0a' }]}><Clock size={40} color="#ef4444" /></View>
            <Text style={styles.alertTitle}>RESET DATE?</Text>
            <Text style={styles.alertMsg}>Are you sure to change your namaz track dates?</Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={() => setShowResetAlert(false)}><Text style={styles.btnTextNo}>No</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#ef4444' }]} onPress={handleResetConfirm}><Text style={styles.btnTextYes}>Yes, Change</Text></TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={showLocModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.locModal}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Change Location</Text><TouchableOpacity onPress={() => setShowLocModal(false)}><X size={24} color="#444" /></TouchableOpacity></View>
            <TouchableOpacity style={styles.autoDetectBtn} onPress={detectMyLocation} disabled={loadingLoc}>{loadingLoc ? <ActivityIndicator color="#000" /> : <View style={{flexDirection:'row', gap:10}}><Navigation size={18} color="#000" /><Text style={styles.autoDetectText}>Auto-Detect (GPS)</Text></View>}</TouchableOpacity>
            <View style={styles.divider} /><Text style={styles.inputLabel}>Manual City</Text><TextInput style={styles.input} placeholder="e.g. London" value={tempCity} onChangeText={setTempCity} placeholderTextColor="#333" /><Text style={styles.inputLabel}>Manual Country Code</Text><TextInput style={styles.input} placeholder="e.g. UK" value={tempCountry} onChangeText={setTempCountry} placeholderTextColor="#333" /><TouchableOpacity style={styles.saveLocBtn} onPress={() => saveLocation(tempCity || city, tempCountry || country)}><Text style={styles.saveLocText}>Save Entry</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { setTempCity(city); setTempCountry(country); setShowLocModal(true); }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><MapPin size={18} color="#10b981" /><Text style={styles.locLabel}>{city}, {country}</Text><Edit3 size={14} color="#444" /></View>
          <Text style={styles.headerDayText}>{dayName}</Text>
          <Text style={styles.headerDateText}>{fullDate}</Text>
          <Text style={styles.headerIslamicText}>{islamicDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSect(sect === 'Hanafi' ? 'Jafari' : 'Hanafi')} style={styles.sectBtn}><Text style={sect === 'Hanafi' ? styles.sectBtnText : [styles.sectBtnText, {color: '#f59e0b'}]}>{sect}</Text><Settings2 size={14} color="#10b981" /></TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}><Text style={[styles.statNum, { color: '#10b981' }]}>{rangeStats.totalAda}</Text><Text style={styles.statLabel}>TOTAL ADA</Text></View>
        <View style={styles.statCard}><Text style={[styles.statNum, { color: '#ef4444' }]}>{rangeStats.totalQaza}</Text><Text style={styles.statLabel}>TOTAL QAZA</Text></View>
      </View>

      <View style={styles.calendarCard}>
        <View style={{ alignItems: 'center', marginBottom: 5 }}>
          <Text style={styles.trackingDateLabel}>Tracking From</Text>
          <Text style={styles.trackingDateValue}>{startDate?.split('-').reverse().join('/')}</Text>
        </View>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarCardTitle}>Consistency Map</Text>
          <TouchableOpacity onPress={() => setShowResetAlert(true)} style={styles.gearWrapper}>
            <View style={styles.glowBox}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Settings size={20} color="#10b981" />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
        <Calendar 
          markingType="custom" markedDates={markedDates} maxDate={todayStr} 
          onDayPress={(day) => setSelectedDate(day.dateString)} 
          theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', monthTextColor: '#10b981', todayTextColor: '#10b981', arrowColor: '#10b981', textDisabledColor: 'rgba(255, 255, 255, 0.1)' }} 
        />
      </View>

      <View style={styles.detailContainer}>
        <View style={styles.detailHeaderRow}><Text style={styles.detailHeader}>Prayer Status</Text><Text style={styles.dateLabel}>{selectedDate === todayStr ? "TODAY" : selectedDate}</Text></View>
        {isAllDone ? (
          <View style={styles.congratulationBox}><Text style={styles.arabicText}>مَاشَاءَ ٱللَّٰهُ</Text><Text style={styles.congratText}>All prayers completed!</Text><TouchableOpacity style={styles.undoBtn} onPress={() => finalizeSave({...dayRecords, Isha: false})}><Text style={styles.undoBtnText}>Update Log</Text></TouchableOpacity></View>
        ) : (
          (Object.keys(defaultStatus) as NamazName[]).map((name) => (
            <TouchableOpacity key={name} style={styles.detailRow} onPress={() => toggleNamaz(name)}>
              <View style={styles.rowLeft}><View style={[styles.timeIcon, { backgroundColor: dayRecords[name] ? '#064e3b' : '#111' }]}><Clock size={18} color={dayRecords[name] ? "#10b981" : "#444"} /></View><View style={{ marginLeft: 15 }}><Text style={styles.nameText}>{name}</Text><Text style={styles.timeText}>Athan: {prayerTimes?.[name] || '--:--'}</Text></View></View>
              {dayRecords[name] ? <CheckCircle2 color="#10b981" size={26} /> : <Circle color="#222" size={26} />}
            </TouchableOpacity>
          ))
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// STYLES (Aapke original styles as it is)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  setup: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 25 },
  setupHeader: { alignItems: 'center', marginBottom: 30 },
  iconCircleLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  setupTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  setupSubTitle: { color: '#777', fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 18, paddingHorizontal: 15 },
  calendarWrapper: { backgroundColor: '#050505', borderRadius: 25, padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  calendarLabel: { color: '#10b981', fontSize: 11, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 45, marginBottom: 25, alignItems: 'flex-start' },
  locLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerDayText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 5 },
  headerDateText: { color: '#fff', fontSize: 16, marginTop: 2 },
  headerIslamicText: { color: '#10b981', fontSize: 14, fontWeight: '600', marginTop: 2 },
  sectBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a0a0a', paddingHorizontal: 12, borderRadius: 12, height: 35, gap: 6, borderWidth: 1.5, borderColor: '#10b981', elevation: 12 },
  sectBtnText: { color: '#10b981', fontWeight: 'bold', fontSize: 11 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#0a0a0a', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statNum: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#555', fontSize: 8, fontWeight: 'bold', marginTop: 5 },
  calendarCard: { backgroundColor: '#050505', borderRadius: 25, padding: 10, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  trackingDateLabel: { color: '#10b981', fontSize: 18, fontWeight: 'bold' },
  trackingDateValue: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10 },
  calendarCardTitle: { color: '#444', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  gearWrapper: { padding: 5 },
  glowBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#10b981', elevation: 10 },
  detailContainer: { padding: 20, backgroundColor: '#050505', borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', minHeight: 350 },
  detailHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  detailHeader: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  dateLabel: { color: '#10b981', fontSize: 15, fontWeight: 'bold' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#111' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  timeIcon: { padding: 8, borderRadius: 12 },
  nameText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  timeText: { color: '#555', fontSize: 11, marginTop: 2 },
  congratulationBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  arabicText: { color: '#10b981', fontSize: 40, fontWeight: 'bold', marginBottom: 10 },
  congratText: { color: '#999', fontSize: 13, marginBottom: 25 },
  undoBtn: { backgroundColor: '#111', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  undoBtnText: { color: '#10b981', fontWeight: 'bold', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
  sweetAlert: { width: width * 0.8, backgroundColor: '#0a0a0a', borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#064e3b', justifyContent: 'center', alignItems: 'center' },
  alertTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 15 },
  alertMsg: { color: '#666', textAlign: 'center', marginTop: 10, fontSize: 14, lineHeight: 20 },
  alertButtons: { flexDirection: 'row', marginTop: 30, width: '100%', gap: 12 },
  btn: { flex: 1, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  btnNo: { backgroundColor: '#1a1a1a' },
  btnYes: { backgroundColor: '#10b981' },
  btnTextNo: { color: '#666', fontWeight: 'bold' },
  btnTextYes: { color: '#000', fontWeight: 'bold' },
  locModal: { width: width * 0.85, backgroundColor: '#0a0a0a', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  autoDetectBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 10 },
  autoDetectText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 15 },
  inputLabel: { color: '#10b981', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
  input: { backgroundColor: '#111', borderRadius: 12, padding: 15, color: '#fff', marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  saveLocBtn: { backgroundColor: '#111', borderRadius: 15, padding: 18, alignItems: 'center', borderWidth: 1, borderColor: '#10b981' },
  saveLocText: { color: '#10b981', fontWeight: 'bold' }
});