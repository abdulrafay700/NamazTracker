
// ////======================perfect ui================================================

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as Location from 'expo-location';
// import { CheckCircle2, Circle, CircleCheck, Clock, Edit3, MapPin, Navigation, Settings, Settings2, X } from 'lucide-react-native';
// import React, { useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, Animated, Dimensions, Easing, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  
//   const [city, setCity] = useState('Loading...');
//   const [country, setCountry] = useState('PK'); // Short code
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

//   // --- AUTO SYNC ---
//   useEffect(() => {
//     const loadData = async () => {
//       const sCity = await AsyncStorage.getItem('user_city');
//       const sCountry = await AsyncStorage.getItem('user_country');
//       const sDate = await AsyncStorage.getItem('tracking_start_date');
      
//       if (sDate) setStartDate(sDate);
//       if (sCity) setCity(sCity);
//       if (sCountry) setCountry(sCountry);
      
//       if (!sCity) detectMyLocation();
//     };
//     loadData();
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

//   const detectMyLocation = async () => {
//     setLoadingLoc(true);
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setCity("LAHORE"); setCountry("PK");
//         setLoadingLoc(false);
//         return;
//       }
//       let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
//       let geo = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
//       if (geo.length > 0) {
//         const newCity = (geo[0].city || geo[0].region || 'KARACHI').toUpperCase();
//         const newCountry = (geo[0].isoCountryCode || 'PK').toUpperCase();
//         saveLocation(newCity, newCountry);
//       }
//     } catch (e) { console.log(e); }
//     setLoadingLoc(false);
//   };

//   const saveLocation = async (newCity: string, newCountry: string) => {
//     const ucCity = newCity.toUpperCase();
//     const ucCountry = newCountry.toUpperCase();
//     setCity(ucCity);
//     setCountry(ucCountry);
//     await AsyncStorage.setItem('user_city', ucCity);
//     await AsyncStorage.setItem('user_country', ucCountry);
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

//   const refreshAllData = async () => {
//     if (!startDate) return;
//     const markers: any = {};
//     let ada = 0; let days = 0;
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
//     try {
//       await AsyncStorage.removeItem('tracking_start_date');
//       // Saara puraana record saaf karne ke liye (Optional)
//       // await AsyncStorage.clear(); 
//       setStartDate(null);
//       setShowResetAlert(false);
//     } catch (e) {
//       console.error("Reset Error", e);
//     }
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
      
//       {/* Modals */}
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
//             <TouchableOpacity style={styles.autoDetectBtn} onPress={detectMyLocation} disabled={loadingLoc}>{loadingLoc ? <ActivityIndicator color="#000" /> : <View style={{flexDirection:'row', gap:10}}><Navigation size={18} color="#000" /><Text style={styles.autoDetectText}>Auto-Detect (GPS)</Text></View>}</TouchableOpacity>
//             <View style={styles.divider} /><Text style={styles.inputLabel}>Manual City</Text><TextInput style={styles.input} placeholder="e.g. London" value={tempCity} onChangeText={setTempCity} placeholderTextColor="#333" /><Text style={styles.inputLabel}>Manual Country Code</Text><TextInput style={styles.input} placeholder="e.g. UK" value={tempCountry} onChangeText={setTempCountry} placeholderTextColor="#333" /><TouchableOpacity style={styles.saveLocBtn} onPress={() => saveLocation(tempCity || city, tempCountry || country)}><Text style={styles.saveLocText}>Save Entry</Text></TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => { setTempCity(city); setTempCountry(country); setShowLocModal(true); }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><MapPin size={18} color="#10b981" /><Text style={styles.locLabel}>{city}, {country}</Text><Edit3 size={14} color="#444" /></View>
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
//           <Text style={styles.trackingDateLabel}>Tracking From</Text>
//           <Text style={styles.trackingDateValue}>{startDate?.split('-').reverse().join('/')}</Text>
//         </View>
//         <View style={styles.calendarHeader}>
//           <Text style={styles.calendarCardTitle}>Consistency Map</Text>
//           <TouchableOpacity onPress={() => setShowResetAlert(true)} style={styles.gearWrapper}>
//             <View style={styles.glowBox}>
//               <Animated.View style={{ transform: [{ rotate: spin }] }}>
//                 <Settings size={20} color="#10b981" />
//               </Animated.View>
//             </View>
//           </TouchableOpacity>
//         </View>
//         <Calendar 
//           markingType="custom" markedDates={markedDates} maxDate={todayStr} 
//           onDayPress={(day) => setSelectedDate(day.dateString)} 
//           theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', monthTextColor: '#10b981', todayTextColor: '#10b981', arrowColor: '#10b981', textDisabledColor: 'rgba(255, 255, 255, 0.1)' }} 
//         />
//       </View>

//       <View style={styles.detailContainer}>
//         <View style={styles.detailHeaderRow}><Text style={styles.detailHeader}>Prayer Status</Text><Text style={styles.dateLabel}>{selectedDate === todayStr ? "TODAY" : selectedDate}</Text></View>
//         {isAllDone ? (
//           <View style={styles.congratulationBox}><Text style={styles.arabicText}>مَاشَاءَ ٱللَّٰهُ</Text><Text style={styles.congratText}>All prayers completed!</Text><TouchableOpacity style={styles.undoBtn} onPress={() => finalizeSave({...dayRecords, Isha: false})}><Text style={styles.undoBtnText}>Update Log</Text></TouchableOpacity></View>
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

// // STYLES (Aapke original styles as it is)
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
//   sectBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a0a0a', paddingHorizontal: 12, borderRadius: 12, height: 35, gap: 6, borderWidth: 1.5, borderColor: '#10b981', elevation: 12 },
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
//   gearWrapper: { padding: 5 },
//   glowBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#10b981', elevation: 10 },
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



























////////////////=========================connect database ===================================


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CheckCircle2, Circle, CircleCheck, Clock, CloudCheck, MapPin, Settings, Settings2 } from 'lucide-react-native';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   Easing,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { Calendar } from 'react-native-calendars';

// // Firebase Imports
// import { onAuthStateChanged } from 'firebase/auth';
// import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
// import { auth, db } from '../../../firebaseConfig';

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
//   const [city, setCity] = useState('Loading...');
//   const [country, setCountry] = useState('PK');
//   const [islamicDate, setIslamicDate] = useState('-- -- ----');
//   const [markedDates, setMarkedDates] = useState<any>({});
//   const [dayRecords, setDayRecords] = useState<Record<NamazName, boolean>>(defaultStatus);
//   const [rangeStats, setRangeStats] = useState({ totalAda: 0, totalQaza: 0 });
//   const [prayerTimes, setPrayerTimes] = useState<any>(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [showResetAlert, setShowResetAlert] = useState(false);
//   const [pendingStatus, setPendingStatus] = useState<Record<NamazName, boolean> | null>(null);
//   const [isSyncing, setIsSyncing] = useState(true);

//   // Animations
//   const [showToast, setShowToast] = useState(false);
//   const toastAnim = useRef(new Animated.Value(-100)).current;
//   const gearAnim = useRef(new Animated.Value(0)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.85)).current;

//   const triggerToast = () => {
//     setShowToast(true);
//     Animated.sequence([
//       Animated.timing(toastAnim, { toValue: 60, duration: 500, useNativeDriver: true }),
//       Animated.delay(1500),
//       Animated.timing(toastAnim, { toValue: -100, duration: 500, useNativeDriver: true })
//     ]).start(() => setShowToast(false));
//   };

//   useEffect(() => {
//     const startSpin = () => {
//       gearAnim.setValue(0);
//       Animated.timing(gearAnim, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: false }).start(() => startSpin());
//     };
//     startSpin();
//   }, []);
//   const spin = gearAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

//   const masterSync = async (userId: string) => {
//     setIsSyncing(true);
//     try {
//       const userDoc = await getDoc(doc(db, "users", userId));
//       if (userDoc.exists()) {
//         const cloudDate = userDoc.data().trackingStartDate;
//         if (cloudDate) {
//           await AsyncStorage.setItem('tracking_start_date', cloudDate);
//           setStartDate(cloudDate);
//         }
//       }
//       const logsSnap = await getDocs(collection(db, "users", userId, "prayer_logs"));
//       const allKeys = await AsyncStorage.getAllKeys();
//       const oldKeys = allKeys.filter(k => k.startsWith('status_'));
//       await AsyncStorage.multiRemove(oldKeys);

//       for (const d of logsSnap.docs) {
//         await AsyncStorage.setItem(`status_${d.id}`, JSON.stringify(d.data()));
//       }
//       refreshAllData();
//     } catch (e: any) { console.log("Sync Error:", e.message); }
//     setIsSyncing(false);
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) masterSync(user.uid);
//       else setIsSyncing(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => { if (startDate) { refreshAllData(); fetchPrayerTimes(); } }, [selectedDate, sect, startDate, city]);

//   const fetchPrayerTimes = async () => {
//     try {
//       const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${sect === 'Hanafi' ? 1 : 0}`);
//       const data = await res.json();
//       if (data.code === 200) {
//         setPrayerTimes(data.data.timings);
//         setIslamicDate(`${data.data.date.hijri.day} ${data.data.date.hijri.month.en} ${data.data.date.hijri.year}`);
//       }
//     } catch (e) { console.log(e); }
//   };

//   const refreshAllData = async () => {
//     if (!startDate) return;
//     const markers: any = {};
//     let ada = 0; let qaza = 0;
//     const allKeys = await AsyncStorage.getAllKeys();
    
//     // Cloud-First approach for Markers
//     const startObj = new Date(startDate); const endObj = new Date(todayStr);
//     for (let d = new Date(startObj); d <= endObj; d = new Date(d.setDate(d.getDate() + 1))) {
//       const dStr = getLocalDateString(d);
//       const saved = await AsyncStorage.getItem(`status_${dStr}`);
      
//       if (saved) {
//         const status = JSON.parse(saved);
//         const count = Object.values(status).filter(Boolean).length;
//         ada += count;
//         qaza += (5 - count);
//         markers[dStr] = {
//           customStyles: {
//             container: { 
//               backgroundColor: count === 5 ? '#059669' : count > 0 ? '#d97706' : '#dc2626', 
//               borderRadius: 10, 
//               borderWidth: dStr === selectedDate ? 2 : 0, 
//               borderColor: '#fff',
//               elevation: 5
//             },
//             text: { color: '#fff', fontWeight: 'bold' },
//           },
//         };
//       } else {
//         qaza += 5;
//         markers[dStr] = { customStyles: { container: { backgroundColor: '#dc2626', borderRadius: 10 }, text: { color: '#fff' } } };
//       }
//     }
    
//     const curr = await AsyncStorage.getItem(`status_${selectedDate}`);
//     setDayRecords(curr ? JSON.parse(curr) : { ...defaultStatus });
//     setMarkedDates(markers);
//     setRangeStats({ totalAda: ada, totalQaza: qaza });
//   };

//   const finalizeSave = async (statusToSave: Record<NamazName, boolean>) => {
//     const userId = auth.currentUser?.uid;
//     if (!userId) return;
//     try {
//       // Step 1: Instant Local Update
//       await AsyncStorage.setItem(`status_${selectedDate}`, JSON.stringify(statusToSave));
//       setDayRecords(statusToSave);
      
//       // Step 2: Instant Cloud Sync (Matches colors across devices)
//       await setDoc(doc(db, "users", userId, "prayer_logs", selectedDate), statusToSave, { merge: true }); 
      
//       triggerToast();
//       setShowConfirm(false);
//       refreshAllData();
//     } catch (e) { console.log(e); }
//   };

//   const toggleNamaz = async (name: NamazName) => {
//     const isChecking = !dayRecords[name];
//     const newStatus = { ...dayRecords, [name]: isChecking };
//     if (isChecking && Object.values(newStatus).every(Boolean)) {
//       setPendingStatus(newStatus); setShowConfirm(true);
//       Animated.parallel([
//         Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: false }),
//         Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: false })
//       ]).start();
//     } else { await finalizeSave(newStatus); }
//   };

//   if (!startDate || isSyncing) return (
//     <View style={styles.setup}>
//       {isSyncing ? <ActivityIndicator size="large" color="#10b981" /> : (
//         <View style={styles.calendarWrapper}>
//           <Text style={styles.setupTitle}>Select Tracking Start Date</Text>
//           <Calendar maxDate={todayStr} onDayPress={async (day) => {
//             const userId = auth.currentUser?.uid;
//             if (userId) await setDoc(doc(db, "users", userId), { trackingStartDate: day.dateString }, { merge: true });
//             await AsyncStorage.setItem('tracking_start_date', day.dateString);
//             setStartDate(day.dateString);
//           }} theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', todayTextColor: '#10b981', monthTextColor: '#10b981', arrowColor: '#10b981' }} />
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: '#000' }}>
//       <Animated.View style={[styles.toastContainer, { transform: [{ translateY: toastAnim }] }]}>
//          <CloudCheck size={18} color="#000" />
//          <Text style={styles.toastText}>Cloud Synced</Text>
//       </Animated.View>

//       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//         <Modal visible={showConfirm} transparent animationType="fade">
//           <View style={styles.modalOverlay}>
//             <Animated.View style={[styles.sweetAlert, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
//               <View style={styles.iconCircle}><CircleCheck size={40} color="#10b981" /></View>
//               <Text style={styles.alertTitle}>MASHALLAH!</Text>
//               <Text style={styles.alertMsg}>Daily goal reached! All 5 prayers done?</Text>
//               <View style={styles.alertButtons}>
//                 <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={() => setShowConfirm(false)}><Text style={styles.btnTextNo}>No</Text></TouchableOpacity>
//                 <TouchableOpacity style={[styles.btn, styles.btnYes]} onPress={() => pendingStatus && finalizeSave(pendingStatus)}><Text style={styles.btnTextYes}>Yes</Text></TouchableOpacity>
//               </View>
//             </Animated.View>
//           </View>
//         </Modal>

//         <Modal visible={showResetAlert} transparent animationType="fade">
//           <View style={styles.modalOverlay}>
//             <View style={styles.sweetAlert}>
//               <Text style={styles.alertTitle}>Reset Tracker?</Text>
//               <Text style={styles.alertMsg}>This will allow you to pick a new start date for tracking.</Text>
//               <View style={styles.alertButtons}>
//                 <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={() => setShowResetAlert(false)}><Text style={styles.btnTextNo}>Cancel</Text></TouchableOpacity>
//                 <TouchableOpacity style={[styles.btn, { backgroundColor: '#ef4444' }]} onPress={() => {setStartDate(null); setShowResetAlert(false);}}><Text style={styles.btnTextYes}>Reset</Text></TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>

//         <View style={styles.header}>
//           <View>
//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><MapPin size={16} color="#10b981" /><Text style={styles.locLabel}>{city}</Text></View>
//             <Text style={styles.headerDayText}>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</Text>
//             <Text style={styles.headerIslamicText}>{islamicDate}</Text>
//           </View>
//           <TouchableOpacity onPress={() => setSect(sect === 'Hanafi' ? 'Jafari' : 'Hanafi')} style={styles.sectBtn}><Text style={styles.sectBtnText}>{sect}</Text><Settings2 size={14} color="#10b981" /></TouchableOpacity>
//         </View>

//         <View style={styles.statsContainer}>
//           <View style={styles.statCard}><Text style={[styles.statNum, { color: '#10b981' }]}>{rangeStats.totalAda}</Text><Text style={styles.statLabel}>ADA</Text></View>
//           <View style={styles.statCard}><Text style={[styles.statNum, { color: '#ef4444' }]}>{rangeStats.totalQaza}</Text><Text style={styles.statLabel}>QAZA</Text></View>
//         </View>

//         <View style={styles.calendarCard}>
//           <View style={styles.calendarHeader}>
//             <Text style={styles.calendarCardTitle}>Consistency Map</Text>
//             <TouchableOpacity onPress={() => setShowResetAlert(true)}>
//               <Animated.View style={{ transform: [{ rotate: spin }] }}><Settings size={20} color="#10b981" /></Animated.View>
//             </TouchableOpacity>
//           </View>
//           <Calendar 
//             markingType="custom" markedDates={markedDates} minDate={startDate} maxDate={todayStr}
//             onDayPress={(day) => setSelectedDate(day.dateString)}
//             theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', monthTextColor: '#10b981', todayTextColor: '#10b981', arrowColor: '#10b981', textDisabledColor: 'rgba(255,255,255,0.05)' }} 
//           />
//         </View>

//         <View style={styles.detailContainer}>
//           <Text style={styles.dateLabel}>{selectedDate === todayStr ? "TODAY" : selectedDate}</Text>
//           {Object.values(dayRecords).every(Boolean) ? (
//             <View style={styles.congratulationBox}><Text style={styles.arabicText}>مَاشَاءَ ٱللَّٰهُ</Text><Text style={styles.congratText}>All prayers completed!</Text></View>
//           ) : (
//             (Object.keys(defaultStatus) as NamazName[]).map((name) => (
//               <TouchableOpacity key={name} style={styles.detailRow} onPress={() => toggleNamaz(name)}>
//                 <View style={styles.rowLeft}>
//                   <Clock size={18} color={dayRecords[name] ? "#10b981" : "#333"} />
//                   <Text style={[styles.nameText, { marginLeft: 12 }]}>{name}</Text>
//                 </View>
//                 {dayRecords[name] ? <CheckCircle2 color="#10b981" size={26} /> : <Circle color="#222" size={26} />}
//               </TouchableOpacity>
//             ))
//           )}
//         </View>
//         <View style={{height: 50}} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   toastContainer: { position: 'absolute', top: 0, alignSelf: 'center', backgroundColor: '#10b981', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 9999, elevation: 15 },
//   toastText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
//   container: { flex: 1, padding: 16 },
//   setup: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 25 },
//   setupTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
//   calendarWrapper: { backgroundColor: '#050505', borderRadius: 25, padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 45, marginBottom: 25 },
//   locLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
//   headerDayText: { color: '#fff', fontSize: 24, fontWeight: '800' },
//   headerIslamicText: { color: '#10b981', fontSize: 14, fontWeight: '500' },
//   sectBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a0a0a', paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#10b981', height: 38 },
//   sectBtnText: { color: '#10b981', fontWeight: 'bold', marginRight: 5, fontSize: 12 },
//   statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
//   statCard: { flex: 1, backgroundColor: '#0a0a0a', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
//   statNum: { fontSize: 26, fontWeight: 'bold' },
//   statLabel: { color: '#555', fontSize: 10, fontWeight: 'bold', marginTop: 4 },
//   calendarCard: { backgroundColor: '#050505', borderRadius: 25, padding: 10, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
//   calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, alignItems: 'center' },
//   calendarCardTitle: { color: '#333', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
//   detailContainer: { padding: 22, backgroundColor: '#050505', borderRadius: 25, minHeight: 320, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
//   dateLabel: { color: '#10b981', fontSize: 16, fontWeight: 'bold', marginBottom: 18 },
//   detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#111' },
//   rowLeft: { flexDirection: 'row', alignItems: 'center' },
//   nameText: { color: '#fff', fontSize: 16, fontWeight: '600' },
//   congratulationBox: { alignItems: 'center', paddingVertical: 45 },
//   arabicText: { color: '#10b981', fontSize: 42, fontWeight: 'bold' },
//   congratText: { color: '#666', fontSize: 13, marginTop: 12 },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center' },
//   sweetAlert: { width: width * 0.85, backgroundColor: '#0a0a0a', borderRadius: 30, padding: 25, alignItems: 'center', borderWidth: 1, borderColor: '#10b981' },
//   iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center' },
//   alertTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 15 },
//   alertMsg: { color: '#888', textAlign: 'center', marginTop: 10, fontSize: 14, lineHeight: 20 },
//   alertButtons: { flexDirection: 'row', marginTop: 30, gap: 12, width: '100%' },
//   btn: { flex: 1, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
//   btnNo: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333' },
//   btnYes: { backgroundColor: '#10b981' },
//   btnTextNo: { color: '#777', fontWeight: 'bold', fontSize: 14 },
//   btnTextYes: { color: '#000', fontWeight: 'bold', fontSize: 14 }
// });

////////////////=====================PERFECT END DATEBASE WORKING ==========================================























////============================ PERFECT WORKING ANNYY THING ================================================================

// imp










































import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { CheckCircle2, Circle, CircleCheck, Clock, Edit3, MapPin, Navigation, Settings, Settings2, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, Easing, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth, db } from '../../../firebaseConfig';
import { useLocation } from '../../../context/LocationContext'; // Global Location Import

const { width } = Dimensions.get('window');

type NamazName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
const defaultStatus: Record<NamazName, boolean> = { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };

export default function NamazFinalApp() {
  const { location, setLocation } = useLocation(); // Home wali location yahan mil rahi hai
  
  const getLocalDateString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

  const todayStr = getLocalDateString(new Date());
  const [startDate, setStartDate] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [sect, setSect] = useState<'Hanafi' | 'Jafari'>('Hanafi');
  
  // States shifted to use Global Context or Local Fallbacks
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
      Animated.timing(gearAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: false }).start(() => startSpin());
    };
    startSpin();
  }, []);

  const spin = gearAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  useEffect(() => {
    const loadData = async () => {
      const sDate = await AsyncStorage.getItem('tracking_start_date');
      if (sDate) setStartDate(sDate);

      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const cloudDate = userSnap.data().trackingStartDate;
          if (cloudDate) {
            setStartDate(cloudDate);
            await AsyncStorage.setItem('tracking_start_date', cloudDate);
          }
        }
        const logsRef = collection(db, "users", user.uid, "prayer_logs");
        const logsSnap = await getDocs(logsRef);
        logsSnap.forEach(async (doc) => {
          await AsyncStorage.setItem(`status_${doc.id}`, JSON.stringify(doc.data()));
        });
      }
      refreshAllData();
    };
    loadData();
  }, []);

  // Jab bhi Global Location ya Date badle, times update hon
  useEffect(() => { 
    if (startDate) { 
        refreshAllData(); 
        fetchPrayerTimes(); 
    } 
  }, [selectedDate, sect, startDate, location]); // location dependancy added

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
      if (status !== 'granted') { setLoadingLoc(false); return; }
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
    const ucCountry = newCountry.toUpperCase().substring(0, 2);
    // HOME KO BHI UPDATE KAREGA
    setLocation({ city: ucCity, country: ucCountry }); 
    await AsyncStorage.setItem('user_city', ucCity);
    await AsyncStorage.setItem('user_country', ucCountry);
    setShowLocModal(false);
  };

  const fetchPrayerTimes = async () => {
    if (!location.city) return;
    const method = sect === 'Hanafi' ? 1 : 0;
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${location.city}&country=${location.country}&method=${method}`);
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
    setRangeStats({ totalAda: ada, totalQaza: (days * 5) - ada });
  };

  const finalizeSave = async (statusToSave: Record<NamazName, boolean>) => {
    await AsyncStorage.setItem(`status_${selectedDate}`, JSON.stringify(statusToSave));
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, "users", user.uid, "prayer_logs", selectedDate), statusToSave, { merge: true });
      } catch (e) { console.log("Cloud sync failed"); }
    }
    setDayRecords(statusToSave);
    setShowConfirm(false);
    refreshAllData();
  };

  const handleResetConfirm = async () => {
    await AsyncStorage.removeItem('tracking_start_date');
    setStartDate(null);
    setShowResetAlert(false);
  };

  const toggleNamaz = async (name: NamazName) => {
    const isChecking = !dayRecords[name];
    const newStatus = { ...dayRecords, [name]: isChecking };
    const doneCount = Object.values(newStatus).filter(Boolean).length;

    if (isChecking && doneCount === 5) {
      setPendingStatus(newStatus);
      setShowConfirm(true);
    } else {
      await finalizeSave(newStatus);
    }
  };

  if (!startDate) return (
    <View style={styles.setup}>
      <View style={styles.setupHeader}>
        <View style={styles.iconCircleLarge}><Clock size={40} color="#10b981" /></View>
        <Text style={styles.setupTitle}>Prayer Tracker</Text>
        <Text style={styles.setupSubTitle}>Select a date to start your tracking journey.</Text>
      </View>
      <View style={styles.calendarWrapper}>
        <Calendar 
          maxDate={todayStr} 
          onDayPress={async (day) => {
            setStartDate(day.dateString);
            await AsyncStorage.setItem('tracking_start_date', day.dateString);
            if (auth.currentUser) {
              await setDoc(doc(db, "users", auth.currentUser.uid), { trackingStartDate: day.dateString }, { merge: true });
            }
          }} 
          theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', todayTextColor: '#10b981', monthTextColor: '#10b981', arrowColor: '#10b981', textDisabledColor: '#222' }} 
        />
      </View>
    </View>
  );

  const isAllDone = Object.values(dayRecords).every(Boolean);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* All Modals */}
      <Modal visible={showConfirm} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.sweetAlert, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.iconCircle}><CircleCheck size={40} color="#10b981" /></View>
            <Text style={styles.alertTitle}>MASHALLAH!</Text>
            <Text style={styles.alertMsg}>Daily goal reached! Have you completed all 5 prayers?</Text>
            <div style={styles.alertButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={() => setShowConfirm(false)}><Text style={styles.btnTextNo}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnYes]} onPress={() => pendingStatus && finalizeSave(pendingStatus)}><Text style={styles.btnTextYes}>Confirm</Text></TouchableOpacity>
            </div>
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
            <View style={styles.divider} /><Text style={styles.inputLabel}>Manual City</Text><TextInput style={styles.input} placeholder="e.g. London" value={tempCity} onChangeText={setTempCity} placeholderTextColor="#333" /><Text style={styles.inputLabel}>Country Code</Text><TextInput style={styles.input} placeholder="e.g. UK" value={tempCountry} onChangeText={setTempCountry} placeholderTextColor="#333" /><TouchableOpacity style={styles.saveLocBtn} onPress={() => saveLocation(tempCity || location.city, tempCountry || location.country)}><Text style={styles.saveLocText}>Save Entry</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header - Now uses location from Context */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowLocModal(true)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><MapPin size={18} color="#10b981" /><Text style={styles.locLabel}>{location.city}, {location.country}</Text><Edit3 size={14} color="#444" /></View>
          <Text style={styles.headerDayText}>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</Text>
          <Text style={styles.headerDateText}>{new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}</Text>
          <Text style={styles.headerIslamicText}>{islamicDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSect(sect === 'Hanafi' ? 'Jafari' : 'Hanafi')} style={styles.sectBtn}>
          <Text style={styles.sectBtnText}>{sect}</Text><Settings2 size={14} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}><Text style={[styles.statNum, { color: '#10b981' }]}>{rangeStats.totalAda}</Text><Text style={styles.statLabel}>TOTAL ADA</Text></View>
        <View style={styles.statCard}><Text style={[styles.statNum, { color: '#ef4444' }]}>{rangeStats.totalQaza}</Text><Text style={styles.statLabel}>TOTAL QAZA</Text></View>
      </View>

      {/* Calendar */}
      <View style={styles.calendarCard}>
        <View style={{ alignItems: 'center', marginBottom: 5 }}>
          <Text style={styles.trackingDateLabel}>Tracking From</Text>
          <Text style={styles.trackingDateValue}>{startDate?.split('-').reverse().join('/')}</Text>
        </View>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarCardTitle}>Consistency Map</Text>
          <TouchableOpacity onPress={() => setShowResetAlert(true)} style={styles.gearWrapper}>
            <View style={styles.glowBox}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}><Settings size={20} color="#10b981" /></Animated.View>
            </View>
          </TouchableOpacity>
        </View>
        <Calendar 
          markingType="custom" 
          markedDates={markedDates} 
          minDate={startDate || undefined}
          maxDate={todayStr} 
          onDayPress={(day) => setSelectedDate(day.dateString)} 
          theme={{ calendarBackground: 'transparent', dayTextColor: '#fff', monthTextColor: '#10b981', todayTextColor: '#10b981', arrowColor: '#10b981', textDisabledColor: 'rgba(255, 255, 255, 0.1)' }} 
        />
      </View>

      {/* Detail List */}
      <View style={styles.detailContainer}>
        <View style={styles.detailHeaderRow}><Text style={styles.detailHeader}>Prayer Status</Text><Text style={styles.dateLabel}>{selectedDate === todayStr ? "TODAY" : selectedDate.split('-').reverse().join('/')}</Text></View>
        {isAllDone ? (
          <View style={styles.congratulationBox}>
            <Text style={styles.arabicText}>مَاشَاءَ ٱللَّٰهُ</Text>
            <Text style={styles.congratText}>All prayers completed!</Text>
            <TouchableOpacity style={styles.undoBtn} onPress={() => finalizeSave({...dayRecords, Isha: false})}>
              <Text style={styles.undoBtnText}>Update Log</Text>
            </TouchableOpacity>
          </View>
        ) : (
          (['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as NamazName[]).map((name) => (
            <TouchableOpacity key={name} style={styles.detailRow} onPress={() => toggleNamaz(name)}>
              <View style={styles.rowLeft}>
                <View style={[styles.timeIcon, { backgroundColor: dayRecords[name] ? '#064e3b' : '#111' }]}><Clock size={18} color={dayRecords[name] ? "#10b981" : "#444"} /></View>
                <View style={{ marginLeft: 15 }}><Text style={styles.nameText}>{name}</Text><Text style={styles.timeText}>Athan: {prayerTimes?.[name] || '--:--'}</Text></View>
              </View>
              {dayRecords[name] ? <CheckCircle2 color="#10b981" size={26} /> : <Circle color="#222" size={26} />}
            </TouchableOpacity>
          ))
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  setup: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 25 },
  setupHeader: { alignItems: 'center', marginBottom: 30 },
  iconCircleLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  setupTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  setupSubTitle: { color: '#777', fontSize: 13, textAlign: 'center', marginTop: 10, lineHeight: 18, paddingHorizontal: 15 },
  calendarWrapper: { backgroundColor: '#050505', borderRadius: 25, padding: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
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