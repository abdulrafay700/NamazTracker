

////////////// =======================================perfect ui end WITH TAOAT EFFECT =============================================================================



// import { useNavigation } from '@react-navigation/native';
// import { useAudioPlayer } from 'expo-audio';
// import { BlurView } from 'expo-blur';
// import * as Haptics from 'expo-haptics';
// import { LinearGradient } from 'expo-linear-gradient';
// import { CheckCircle2, ChevronDown, Plus, RotateCcw, Settings, Smartphone, Target, Volume2, X } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import {
//     Dimensions, Modal, Platform, ScrollView,
//     StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View
// } from 'react-native';
// import Animated, {
//     useAnimatedProps, useAnimatedStyle, useSharedValue,
//     withSequence, withSpring, withTiming
// } from 'react-native-reanimated';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Svg, { Circle } from 'react-native-svg';

// // Backend & Firebase Imports
// import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
// import { listenToZikrChanges, syncZikrToCloud } from '../../_Backend/tasbeehbackend';
// import ZikrManager from '../../components/ZikrManager';
// import { auth, db } from '../../firebaseConfig';

// const { width } = Dimensions.get('window');
// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const CIRCLE_LENGTH = 750; 
// const R = 110; 

// interface Zikr {
//     id: string;
//     arabic: string;
//     translation?: string;
//     transliteration?: string;
//     fixed?: boolean;
// }

// const INITIAL_ZIKRS: Zikr[] = [
//     { id: '1', arabic: "سُبْحَانَ ٱللَّٰهِ", translation: "Glory be to Allah", fixed: true },
//     { id: '2', arabic: "ٱلْحَمْدُ لِلَّٰهِ", translation: "Praise be to Allah", fixed: true },
//     { id: '3', arabic: "اللهُ أَكْبَرُ", translation: "Allah is the Greatest", fixed: true },
//     { id: '4', arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", translation: "There is no god but Allah", fixed: true },
// ];

// export default function TasbeehApp() {
//     const navigation = useNavigation();
    
//     // --- States ---
//     const [zikrs, setZikrs] = useState<Zikr[]>(INITIAL_ZIKRS);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [count, setCount] = useState(0);
//     const [target, setTarget] = useState(33);
//     const [isComplete, setIsComplete] = useState(false); // Rule 6: Track completion for sound
    
//     const [isSoundEnabled, setIsSoundEnabled] = useState(true);
//     const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showListModal, setShowListModal] = useState(false);
//     const [showSettings, setShowSettings] = useState(false);
//     const [showGoalModal, setShowGoalModal] = useState(false);
//     const [customGoal, setCustomGoal] = useState('');

//     // --- Animation Shared Values ---
//     const progress = useSharedValue(0); // Rule 4: Smooth Circle
//     const buttonTranslateY = useSharedValue(0); // Rule 2: 3D Button
//     const completionToastY = useSharedValue(-150); 
//     const syncToastTranslateY = useSharedValue(-100); 
//     const lcdScale = useSharedValue(1); // Rule 2: LCD Zoom
    
//     // --- Audio Setup ---
//     const tapPlayer = useAudioPlayer(require('../../assets/tasbeeh.mp3'));
//     const successPlayer = useAudioPlayer(require('../../assets/success.mp3'));

//     const currentZikr = zikrs[currentIndex] || INITIAL_ZIKRS[0];

//     // --- Rule 3: Sync Toast Logic (Every 10 counts) ---
//     const triggerSyncToast = () => {
//         syncToastTranslateY.value = withSequence(
//             withTiming(60, { duration: 600 }),
//             withTiming(60, { duration: 2000 }),
//             withTiming(-100, { duration: 600 })
//         );
//     };

//     const animatedSyncToastStyle = useAnimatedStyle(() => ({
//         transform: [{ translateY: syncToastTranslateY.value }],
//     }));

//     // --- 1. Load Initial User Settings & Custom Zikrs ---
//     useEffect(() => {
//         const loadInitialData = async () => {
//             if (!auth.currentUser) return;
//             try {
//                 const snap = await getDocs(collection(db, 'users', auth.currentUser.uid, 'zikrs'));
//                 const cloudList: Zikr[] = [];
//                 snap.forEach(d => cloudList.push(d.data() as Zikr));
//                 const fullList = [...INITIAL_ZIKRS, ...cloudList];
//                 setZikrs(fullList);

//                 const session = await getDoc(doc(db, 'users', auth.currentUser.uid, 'settings', 'lastSession'));
//                 if (session.exists()) {
//                     const data = session.data();
//                     setTarget(data.lastTarget || 33);
//                     setIsSoundEnabled(data.sound !== false);
//                     setIsVibrationEnabled(data.vibration !== false);
//                     const idx = fullList.findIndex(z => z.id === data.lastZikrId);
//                     if (idx !== -1) setCurrentIndex(idx);
//                 }
//             } catch (e) { console.log("Init Error", e); }
//         };
//         loadInitialData();
//     }, [auth.currentUser]);

//     // --- 2. Switch Zikr & Load Count ---
//     useEffect(() => {
//         const loadZikrSpecificCount = async () => {
//             if (!auth.currentUser || !currentZikr) return;
//             try {
//                 const zikrDoc = await getDoc(doc(db, 'users', auth.currentUser.uid, 'tasbeeh', currentZikr.id));
//                 const c = zikrDoc.exists() ? zikrDoc.data().count : 0;
//                 setCount(c);
//                 progress.value = withSpring(target > 0 ? c / target : 0);
//             } catch (e) { console.log("Fetch Count Error", e); }
//         };
//         loadZikrSpecificCount();
//     }, [currentIndex]);

//     // --- 3. Real-time Multi-Device Sync Listener ---
//     useEffect(() => {
//         let unsubscribe: any;
//         if (auth.currentUser && currentZikr) {
//             unsubscribe = listenToZikrChanges(currentZikr.id, (cloudCount) => {
//                 if (cloudCount !== count) {
//                     setCount(cloudCount);
//                     progress.value = withSpring(target > 0 ? cloudCount / target : 0);
//                 }
//             });
//         }
//         return () => unsubscribe && unsubscribe();
//     }, [currentZikr.id, target]);

//     // --- 4. Main Tap Logic (Rule 1 & 2 & 3) ---
//     const handlePress = () => {
//         if (target > 0 && count >= target) return;
        
//         const nextCount = count + 1;
//         setCount(nextCount);
        
//         // Rule 4: Smooth Animation Update
//         progress.value = withSpring(target > 0 ? nextCount / target : 0);
        
//         // Rule 2: Visual Feedbacks (Locked)
//         lcdScale.value = withSequence(withTiming(1.15, { duration: 50 }), withSpring(1));
//         buttonTranslateY.value = withSequence(withTiming(12, { duration: 60 }), withSpring(0));

//         // Feedback: Sound & Haptic
//         if (isVibrationEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//         if (isSoundEnabled) { tapPlayer.seekTo(0); tapPlayer.play(); }

//         // Rule 3: Cloud Sync & Selective Toast
//         if (auth.currentUser) {
//             syncZikrToCloud(currentZikr.id, nextCount, currentZikr.arabic);
//             if (nextCount % 10 === 0) triggerSyncToast();
//         }
//     };

//     // --- 5. Reset Logic (Rule 6 Fix) ---
//     const handleReset = () => {
//         setCount(0); 
//         setIsComplete(false); // Locked: Resetting allows sound to play again
//         completionToastY.value = withSpring(-150);
//         progress.value = withTiming(0);
//         if (auth.currentUser) {
//             syncZikrToCloud(currentZikr.id, 0, currentZikr.arabic);
//             triggerSyncToast();
//         }
//     };

//     // --- 6. Completion & Multi-Round Sound Logic (Rule 1 & 6) ---
//     useEffect(() => {
//         if (target > 0) {
//             if (count >= target && !isComplete) {
//                 setIsComplete(true); // Prevent sound looping
//                 completionToastY.value = withSpring(60);
                
//                 // Rule 1: Instant Sound Play
//                 if (isSoundEnabled) {
//                     successPlayer.seekTo(0);
//                     successPlayer.play();
//                 }
//                 if (isVibrationEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//             } 
//             // Locked: If count is reset or goal increased, ready the sound again
//             else if (count < target) {
//                 setIsComplete(false); 
//                 completionToastY.value = withSpring(-150);
//             }
//         }
//     }, [count, target]);

//     // --- Animation Props & Styles ---
//     const animatedCircleProps = useAnimatedProps(() => ({ strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value) }));
//     const animatedButtonStyle = useAnimatedStyle(() => ({ transform: [{ translateY: buttonTranslateY.value }] }));
//     const animatedCompletionToastStyle = useAnimatedStyle(() => ({ transform: [{ translateY: completionToastY.value }] }));
//     const animatedLcdStyle = useAnimatedStyle(() => ({ transform: [{ scale: lcdScale.value }] }));

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" />

//             {/* SYNC NOTIFICATION (Rule 3) */}
//             <Animated.View style={[styles.syncToast, animatedSyncToastStyle]}>
//                 <BlurView intensity={80} tint="dark" style={styles.blurContent}>
//                     <CheckCircle2 size={16} color="#10b981" />
//                     <Text style={styles.syncToastText}>Cloud Synced Successfully</Text>
//                 </BlurView>
//             </Animated.View>

//             {/* COMPLETION NOTIFICATION */}
//             <Animated.View style={[styles.toast, animatedCompletionToastStyle]}>
//                 <Text style={styles.toastText}>MashaAllah! Target Completed</Text>
//                 <TouchableOpacity onPress={handleReset} style={styles.resetBtnToast}>
//                     <RotateCcw size={16} color="black" />
//                 </TouchableOpacity>
//             </Animated.View>

//             {/* HEADER SECTION */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.iconBtn}>
//                     <Settings size={22} color="rgba(255,255,255,0.4)" />
//                 </TouchableOpacity>
//                 <View style={styles.headerCenter}>
//                     <Target size={14} color="#10b981" />
//                     <Text style={styles.headerTitle}>DHIKRFLOW</Text>
//                 </View>
//                 <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addZikrHeaderBtn}>
//                     <Plus size={14} color="#050505" strokeWidth={3} />
//                     <Text style={styles.addZikrHeaderText}>Add Zikir</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* CURRENT DHIKR DISPLAY */}
//             <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowListModal(true)}>
//                 <Text style={styles.dropdownLabel}>CURRENT DHIKR</Text>
//                 <View style={styles.currentZikrRow}>
//                     <View style={{ flex: 1 }}>
//                         <Text style={styles.currentZikrText}>{currentZikr.arabic}</Text>
//                         <Text style={styles.currentTranslationText}>{currentZikr.translation || currentZikr.transliteration || ""}</Text>
//                     </View>
//                     <ChevronDown size={18} color="#10b981" />
//                 </View>
//             </TouchableOpacity>

//             {/* MAIN TASBEEH INTERFACE */}
//             <View style={styles.main}>
//                 <View style={styles.circleBox}>
//                     <Svg width={width} height={260} style={styles.svg}>
//                         <Circle cx={width/2} cy={130} r={R} stroke="rgba(255,255,255,0.05)" strokeWidth={3} fill="none" />
//                         {/* Rule 4: Animated Progress Circle */}
//                         <AnimatedCircle cx={width/2} cy={130} r={R} stroke="#10b981" strokeWidth={5} strokeDasharray={CIRCLE_LENGTH} animatedProps={animatedCircleProps} strokeLinecap="round" fill="none" />
//                     </Svg>
//                     <LinearGradient colors={['#0f2019', '#08120e']} style={styles.lcdPanel}>
//                         {/* Rule 2: Animated LCD Scale */}
//                         <Animated.View style={animatedLcdStyle}>
//                             <Text style={styles.lcdMain}>{count.toString().padStart(5, '0')}</Text>
//                         </Animated.View>
//                         <View style={styles.targetIndicator}>
//                             <Text style={styles.targetLabelText}>GOAL</Text>
//                             <Text style={styles.targetValueText}>{target || '∞'}</Text>
//                         </View>
//                     </LinearGradient>
//                 </View>

//                 {/* 3D GLASS BUTTON (Rule 2) */}
//                 <View style={styles.buttonOuterRing}>
//                     <View style={styles.buttonCylinder}>
//                         <Animated.View style={[styles.btn3DMain, animatedButtonStyle]}>
//                             <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.touchable}>
//                                 <LinearGradient colors={['#34d399', '#10b981', '#064e3b']} style={styles.glassEffect}>
//                                     <View style={styles.buttonReflex} />
//                                     <Text style={styles.tapLabelText}>TAP</Text>
//                                 </LinearGradient>
//                             </TouchableOpacity>
//                         </Animated.View>
//                         <View style={styles.buttonDepth} />
//                     </View>
//                 </View>
//             </View>

//             {/* FOOTER CONTROLS */}
//             <View style={styles.footer}>
//                 <TouchableOpacity onPress={handleReset} style={styles.bottomReset}>
//                     <RotateCcw size={22} color="white" />
//                 </TouchableOpacity>
//                 <View style={styles.targetRow}>
//                     {[33, 100, 1000].map(t => (
//                         <TouchableOpacity key={t} onPress={() => setTarget(t)} style={[styles.tBtn, target === t && styles.tActive]}>
//                             <Text style={[styles.tText, target === t && {color: '#10b981'}]}>{t}</Text>
//                         </TouchableOpacity>
//                     ))}
//                     <TouchableOpacity onPress={() => setShowGoalModal(true)} style={[styles.tBtn, ![33, 100, 1000, 0].includes(target) && styles.tActive]}>
//                         <Plus size={14} color={![33, 100, 1000, 0].includes(target) ? '#10b981' : '#444'} />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => setTarget(0)} style={[styles.tBtn, target === 0 && styles.tActive]}>
//                         <Text style={[styles.tText, target === 0 && {color: '#10b981'}]}>∞</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* --- MODALS --- */}
            
//             {/* 1. Settings Modal */}
//             <Modal visible={showSettings} animationType="fade" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>Settings</Text>
//                             <TouchableOpacity onPress={()=>setShowSettings(false)}><X color="white" /></TouchableOpacity>
//                         </View>
//                         <View style={styles.settingRow}>
//                             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
//                                 <Volume2 size={18} color="#10b981" />
//                                 <Text style={{ color: 'white' }}>Sound Effects</Text>
//                             </View>
//                             <Switch value={isSoundEnabled} onValueChange={setIsSoundEnabled} trackColor={{ false: '#222', true: '#10b981' }} />
//                         </View>
//                         <View style={styles.settingRow}>
//                             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
//                                 <Smartphone size={18} color="#10b981" />
//                                 <Text style={{ color: 'white' }}>Haptic Feedback</Text>
//                             </View>
//                             <Switch value={isVibrationEnabled} onValueChange={setIsVibrationEnabled} trackColor={{ false: '#222', true: '#10b981' }} />
//                         </View>
//                     </View>
//                 </View>
//             </Modal>

//             {/* 2. Zikr List Modal */}
//             <Modal visible={showListModal} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={[styles.modalContent, { maxHeight: '75%' }]}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>Select Zikir</Text>
//                             <TouchableOpacity onPress={()=>setShowListModal(false)}><X color="white" /></TouchableOpacity>
//                         </View>
//                         <ScrollView>
//                             {zikrs.map((item, index) => (
//                                 <View key={item.id} style={[styles.listItem, currentIndex === index && styles.listActiveItem]}>
//                                     <TouchableOpacity style={{ flex: 1 }} onPress={() => { setCurrentIndex(index); setShowListModal(false); }}>
//                                         <Text style={styles.listArabic}>{item.arabic}</Text>
//                                         <Text style={styles.listTranslation}>{item.translation || item.transliteration || ""}</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             ))}
//                         </ScrollView>
//                     </View>
//                 </View>
//             </Modal>

//             {/* 3. Custom Goal Modal */}
//             <Modal visible={showGoalModal} transparent animationType="fade">
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <View style={styles.modalHeader}>
//                             <Text style={styles.modalTitle}>Set Custom Goal</Text>
//                             <TouchableOpacity onPress={()=>setShowGoalModal(false)}><X color="white" /></TouchableOpacity>
//                         </View>
//                         <TextInput placeholder="Target..." placeholderTextColor="#444" keyboardType="numeric" style={styles.input} value={customGoal} onChangeText={setCustomGoal} />
//                         <TouchableOpacity style={styles.doneBtn} onPress={() => { if(customGoal){ setTarget(parseInt(customGoal)); setShowGoalModal(false); setCustomGoal(''); } }}>
//                             <Text style={styles.doneTxt}>Set Target</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>

//             {/* 4. Custom Zikr Manager Component */}
//             <ZikrManager visible={showAddModal} onClose={() => setShowAddModal(false)} zikrs={zikrs.filter(z => !z.fixed)} onAdd={(ar, tr) => setZikrs([...zikrs, {id: Date.now().toString(), arabic: ar, transliteration: tr, fixed: false}])} onDelete={(id) => setZikrs(prev => prev.filter(z => z.id !== id))} />

//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#050505' },
//     header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 10, alignItems: 'center' },
//     headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//     headerTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
//     iconBtn: { padding: 5 },
//     addZikrHeaderBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, gap: 5 },
//     addZikrHeaderText: { color: '#050505', fontSize: 11, fontWeight: 'bold' },
//     dropdownTrigger: { alignSelf: 'center', marginTop: 15, backgroundColor: '#0a0a0a', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#151515', width: '90%' },
//     dropdownLabel: { color: '#10b981', fontSize: 8, fontWeight: 'bold', opacity: 0.6, marginBottom: 4 },
//     currentZikrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//     currentZikrText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
//     currentTranslationText: { color: '#10b981', fontSize: 12, opacity: 0.7, fontStyle: 'italic' },
//     main: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     circleBox: { height: 260, justifyContent: 'center', alignItems: 'center' },
//     svg: { position: 'absolute' },
//     lcdPanel: { width: 200, height: 100, borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(16,185,129,0.1)' },
//     lcdMain: { fontSize: 48, color: '#10b981', fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace' },
//     targetIndicator: { position: 'absolute', bottom: 10, right: 15, flexDirection: 'row', alignItems: 'baseline', gap: 4 },
//     targetLabelText: { color: '#10b981', fontSize: 7, fontWeight: '900', opacity: 0.5 },
//     targetValueText: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },
//     buttonOuterRing: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#080808', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#111', marginTop: 20 },
//     buttonCylinder: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#020202', overflow: 'hidden', justifyContent: 'center' },
//     btn3DMain: { width: 140, height: 140, borderRadius: 70, alignSelf: 'center', zIndex: 10 },
//     touchable: { width: '100%', height: '100%' },
//     glassEffect: { width: '100%', height: '100%', borderRadius: 70, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
//     buttonReflex: { position: 'absolute', top: 10, width: '60%', height: '20%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50 },
//     buttonDepth: { position: 'absolute', bottom: 0, width: 140, height: 140, borderRadius: 70, backgroundColor: '#022c22', alignSelf: 'center', zIndex: 5 },
//     tapLabelText: { color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: 3 },
//     footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, paddingBottom: 40, alignItems: 'center' },
//     bottomReset: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
//     targetRow: { flexDirection: 'row', gap: 8 },
//     tBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: '#0a0a0a', minWidth: 42, alignItems: 'center' },
//     tActive: { borderColor: '#10b981', borderWidth: 1 },
//     tText: { color: '#444', fontWeight: 'bold', fontSize: 11 },
//     toast: { position: 'absolute', left: 20, right: 20, backgroundColor: '#10b981', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2000 },
//     toastText: { fontWeight: 'bold', color: 'black' },
//     resetBtnToast: { padding: 5 },
//     syncToast: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center', zIndex: 9999 },
//     blurContent: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.8)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)' },
//     syncToastText: { color: 'white', fontSize: 13, fontWeight: '600' },
//     modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 20 },
//     modalContent: { backgroundColor: '#0a0a0a', borderRadius: 25, padding: 20, gap: 10, borderWidth: 1, borderColor: '#181818' },
//     modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
//     modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
//     settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#151515' },
//     listItem: { flexDirection: 'row', padding: 15, backgroundColor: '#111', borderRadius: 15, marginBottom: 10, alignItems: 'center' },
//     listActiveItem: { borderColor: '#10b981', borderWidth: 1 },
//     listArabic: { color: 'white', fontSize: 18, fontWeight: 'bold' },
//     listTranslation: { color: '#666', fontSize: 11, fontStyle: 'italic' },
//     input: { backgroundColor: '#151515', color: 'white', padding: 15, borderRadius: 12, marginBottom: 5 },
//     doneBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
//     doneTxt: { fontWeight: 'bold', color: 'black' }
// });































import { useNavigation } from '@react-navigation/native';
import { useAudioPlayer } from 'expo-audio';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle2, ChevronDown, Plus, RotateCcw, Settings, Smartphone, Target, Volume2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions, Modal, Platform, ScrollView,
    StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Animated, {
    useAnimatedProps, useAnimatedStyle, useSharedValue,
    withSequence, withSpring, withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

// Backend & Firebase Imports
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { listenToZikrChanges, syncZikrToCloud } from '../../_Backend/tasbeehbackend';
import ZikrManager from '../../components/ZikrManager';
import { auth, db } from '../../firebaseConfig';

const { width } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const CIRCLE_LENGTH = 750; 
const R = 110; 

interface Zikr {
    id: string;
    arabic: string;
    translation?: string;
    transliteration?: string;
    fixed?: boolean;
}

const INITIAL_ZIKRS: Zikr[] = [
    { id: '1', arabic: "سُبْحَانَ ٱللَّٰهِ", translation: "Glory be to Allah", fixed: true },
    { id: '2', arabic: "ٱلْحَمْدُ لِلَّٰهِ", translation: "Praise be to Allah", fixed: true },
    { id: '3', arabic: "اللهُ أَكْبَرُ", translation: "Allah is the Greatest", fixed: true },
    { id: '4', arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", translation: "There is no god but Allah", fixed: true },
];

export default function TasbeehApp() {
    const navigation = useNavigation();
    
    // --- States ---
    const [zikrs, setZikrs] = useState<Zikr[]>(INITIAL_ZIKRS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(33);
    const [isComplete, setIsComplete] = useState(false); 
    
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
    const [isSyncToastEnabled, setIsSyncToastEnabled] = useState(true); // NEW: Toggle State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [customGoal, setCustomGoal] = useState('');

    // --- Animation Shared Values (LOCKED) ---
    const progress = useSharedValue(0); 
    const circleScale = useSharedValue(1); // Rule 1
    const buttonTranslateY = useSharedValue(0); // Rule 2
    const completionToastY = useSharedValue(-150); 
    const syncToastTranslateY = useSharedValue(-100); 
    const lcdScale = useSharedValue(1); 
    
    // --- Audio Setup ---
    const tapPlayer = useAudioPlayer(require('../../assets/tasbeeh.mp3'));
    const successPlayer = useAudioPlayer(require('../../assets/success.mp3'));

    const currentZikr = zikrs[currentIndex] || INITIAL_ZIKRS[0];

    // --- Rule 3: Sync Toast Logic (Selective Toggle) ---
    const triggerSyncToast = () => {
        if (!isSyncToastEnabled) return; // Feature: Animation toggle check
        syncToastTranslateY.value = withSequence(
            withTiming(60, { duration: 600 }),
            withTiming(60, { duration: 2000 }),
            withTiming(-100, { duration: 600 })
        );
    };

    const animatedSyncToastStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: syncToastTranslateY.value }],
    }));

    // --- 1. Load Initial User Settings & Custom Zikrs ---
    useEffect(() => {
        const loadInitialData = async () => {
            if (!auth.currentUser) return;
            try {
                const snap = await getDocs(collection(db, 'users', auth.currentUser.uid, 'zikrs'));
                const cloudList: Zikr[] = [];
                snap.forEach(d => cloudList.push(d.data() as Zikr));
                const fullList = [...INITIAL_ZIKRS, ...cloudList];
                setZikrs(fullList);

                const session = await getDoc(doc(db, 'users', auth.currentUser.uid, 'settings', 'lastSession'));
                if (session.exists()) {
                    const data = session.data();
                    setTarget(data.lastTarget || 33);
                    setIsSoundEnabled(data.sound !== false);
                    setIsVibrationEnabled(data.vibration !== false);
                    setIsSyncToastEnabled(data.syncToast !== false); // Load toggle state
                    const idx = fullList.findIndex(z => z.id === data.lastZikrId);
                    if (idx !== -1) setCurrentIndex(idx);
                }
            } catch (e) { console.log("Init Error", e); }
        };
        loadInitialData();
    }, [auth.currentUser]);

    // --- 2. Switch Zikr & Load Count ---
    useEffect(() => {
        const loadZikrSpecificCount = async () => {
            if (!auth.currentUser || !currentZikr) return;
            try {
                const zikrDoc = await getDoc(doc(db, 'users', auth.currentUser.uid, 'tasbeeh', currentZikr.id));
                const c = zikrDoc.exists() ? zikrDoc.data().count : 0;
                setCount(c);
                progress.value = withSpring(target > 0 ? c / target : 0);
            } catch (e) { console.log("Fetch Count Error", e); }
        };
        loadZikrSpecificCount();
    }, [currentIndex]);

    // --- 3. Real-time Multi-Device Sync Listener ---
    useEffect(() => {
        let unsubscribe: any;
        if (auth.currentUser && currentZikr) {
            unsubscribe = listenToZikrChanges(currentZikr.id, (cloudCount) => {
                if (cloudCount !== count) {
                    setCount(cloudCount);
                    progress.value = withSpring(target > 0 ? cloudCount / target : 0);
                }
            });
        }
        return () => unsubscribe && unsubscribe();
    }, [currentZikr.id, target]);

    // --- 4. Main Tap Logic (Rule 1 & 2 & 3 LOCKED) ---
    // const handlePress = () => {
    //     if (target > 0 && count >= target) return;
        
    //     const nextCount = count + 1;
    //     setCount(nextCount);
        
    //     progress.value = withSpring(target > 0 ? nextCount / target : 0);
        
    //     // Rule 1: Circle Animation Bounce
    //     circleScale.value = withSequence(withTiming(1.08, { duration: 50 }), withSpring(1));
        
    //     lcdScale.value = withSequence(withTiming(1.15, { duration: 50 }), withSpring(1));
    //     buttonTranslateY.value = withSequence(withTiming(12, { duration: 60 }), withSpring(0));

    //     if (isVibrationEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    //     if (isSoundEnabled) { tapPlayer.seekTo(0); tapPlayer.play(); }

    //     if (auth.currentUser) {
    //         syncZikrToCloud(currentZikr.id, nextCount, currentZikr.arabic);
    //         if (nextCount % 10 === 0) triggerSyncToast();
    //     }
    // };

    const handlePress = () => {
    if (target > 0 && count >= target) return;
    
    const nextCount = count + 1;
    const nextProgress = target > 0 ? nextCount / target : 0;
    const jumpProgress = target > 0 ? (nextCount + 0.5) / target : 0; // Small jump forward

    setCount(nextCount);
    
    // Ring Animation: Move slightly ahead then settle at the actual value
    progress.value = withSequence(
        withTiming(jumpProgress, { duration: 60 }),
        withSpring(nextProgress)
    );
    
    // Keep the LCD (number) bounce
    lcdScale.value = withSequence(withTiming(1.15, { duration: 50 }), withSpring(1));
    buttonTranslateY.value = withSequence(withTiming(12, { duration: 60 }), withSpring(0));

    if (isVibrationEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isSoundEnabled) { tapPlayer.seekTo(0); tapPlayer.play(); }

    if (auth.currentUser) {
        syncZikrToCloud(currentZikr.id, nextCount, currentZikr.arabic);
        if (nextCount % 10 === 0) triggerSyncToast();
    }
};
    // --- 5. Reset Logic (Rule 4 Fix) ---
    const handleReset = () => {
        setCount(0); 
        setIsComplete(false); 
        completionToastY.value = withSpring(-150);
        progress.value = withTiming(0);
        if (auth.currentUser) {
            syncZikrToCloud(currentZikr.id, 0, currentZikr.arabic);
            triggerSyncToast();
        }
    };

    // --- 6. Completion Logic (Rule 4) ---
    useEffect(() => {
        if (target > 0) {
            if (count >= target && !isComplete) {
                setIsComplete(true);
                completionToastY.value = withSpring(60);
                
                if (isSoundEnabled) {
                    successPlayer.seekTo(0);
                    successPlayer.play();
                }
                if (isVibrationEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } 
            else if (count < target) {
                setIsComplete(false); 
                completionToastY.value = withSpring(-150);
            }
        }
    }, [count, target]);

    // --- Animation Styles ---
    const animatedCircleProps = useAnimatedProps(() => ({ strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value) }));
    const animatedCircleStyle = useAnimatedStyle(() => ({ transform: [{ scale: circleScale.value }] })); // Rule 1 Lock
    const animatedButtonStyle = useAnimatedStyle(() => ({ transform: [{ translateY: buttonTranslateY.value }] }));
    const animatedCompletionToastStyle = useAnimatedStyle(() => ({ transform: [{ translateY: completionToastY.value }] }));
    const animatedLcdStyle = useAnimatedStyle(() => ({ transform: [{ scale: lcdScale.value }] }));

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* SYNC NOTIFICATION */}
            <Animated.View style={[styles.syncToast, animatedSyncToastStyle]}>
                <BlurView intensity={80} tint="dark" style={styles.blurContent}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <Text style={styles.syncToastText}>Cloud Synced Successfully</Text>
                </BlurView>
            </Animated.View>

            {/* COMPLETION NOTIFICATION */}
            <Animated.View style={[styles.toast, animatedCompletionToastStyle]}>
                <Text style={styles.toastText}>MashaAllah! Target Completed</Text>
                <TouchableOpacity onPress={handleReset} style={styles.resetBtnToast}>
                    <RotateCcw size={16} color="black" />
                </TouchableOpacity>
            </Animated.View>

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.iconBtn}>
                    <Settings size={22} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Target size={14} color="#10b981" />
                    <Text style={styles.headerTitle}>DHIKRFLOW</Text>
                </View>
                <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addZikrHeaderBtn}>
                    <Plus size={14} color="#050505" strokeWidth={3} />
                    <Text style={styles.addZikrHeaderText}>Add Zikir</Text>
                </TouchableOpacity>
            </View>

            {/* DROPDOWN */}
            <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowListModal(true)}>
                <Text style={styles.dropdownLabel}>CURRENT DHIKR</Text>
                <View style={styles.currentZikrRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.currentZikrText}>{currentZikr.arabic}</Text>
                        <Text style={styles.currentTranslationText}>{currentZikr.translation || currentZikr.transliteration || ""}</Text>
                    </View>
                    <ChevronDown size={18} color="#10b981" />
                </View>
            </TouchableOpacity>

            {/* MAIN UI */}
            <View style={styles.main}>
                <View style={styles.circleBox}>
                    <Animated.View style={[styles.svgContainer, animatedCircleStyle]}>
                        <Svg width={width} height={260}>
                            <Circle cx={width/2} cy={130} r={R} stroke="rgba(255,255,255,0.05)" strokeWidth={3} fill="none" />
                            <AnimatedCircle cx={width/2} cy={130} r={R} stroke="#10b981" strokeWidth={5} strokeDasharray={CIRCLE_LENGTH} animatedProps={animatedCircleProps} strokeLinecap="round" fill="none" />
                        </Svg>
                    </Animated.View>
                    
                    <LinearGradient colors={['#0f2019', '#08120e']} style={styles.lcdPanel}>
                        <Animated.View style={animatedLcdStyle}>
                            <Text style={styles.lcdMain}>{count.toString().padStart(5, '0')}</Text>
                        </Animated.View>
                        <View style={styles.targetIndicator}>
                            <Text style={styles.targetLabelText}>GOAL</Text>
                            <Text style={styles.targetValueText}>{target || '∞'}</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* 3D BUTTON */}
                <View style={styles.buttonOuterRing}>
                    <View style={styles.buttonCylinder}>
                        <Animated.View style={[styles.btn3DMain, animatedButtonStyle]}>
                            <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.touchable}>
                                <LinearGradient colors={['#34d399', '#10b981', '#064e3b']} style={styles.glassEffect}>
                                    <View style={styles.buttonReflex} />
                                    <Text style={styles.tapLabelText}>TAP</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                        <View style={styles.buttonDepth} />
                    </View>
                </View>
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleReset} style={styles.bottomReset}>
                    <RotateCcw size={22} color="white" />
                </TouchableOpacity>
                <View style={styles.targetRow}>
                    {[33, 100, 1000].map(t => (
                        <TouchableOpacity key={t} onPress={() => setTarget(t)} style={[styles.tBtn, target === t && styles.tActive]}>
                            <Text style={[styles.tText, target === t && {color: '#10b981'}]}>{t}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setShowGoalModal(true)} style={[styles.tBtn, ![33, 100, 1000, 0].includes(target) && styles.tActive]}>
                        <Plus size={14} color={![33, 100, 1000, 0].includes(target) ? '#10b981' : '#444'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setTarget(0)} style={[styles.tBtn, target === 0 && styles.tActive]}>
                        <Text style={[styles.tText, target === 0 && {color: '#10b981'}]}>∞</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* SETTINGS MODAL (Updated with Toggle) */}
            <Modal visible={showSettings} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Settings</Text>
                            <TouchableOpacity onPress={()=>setShowSettings(false)}><X color="white" /></TouchableOpacity>
                        </View>
                        
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelGroup}>
                                <Volume2 size={18} color="#10b981" />
                                <Text style={{ color: 'white' }}>Sound Effects</Text>
                            </View>
                            <Switch value={isSoundEnabled} onValueChange={setIsSoundEnabled} trackColor={{ false: '#222', true: '#10b981' }} />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelGroup}>
                                <Smartphone size={18} color="#10b981" />
                                <Text style={{ color: 'white' }}>Haptic Feedback</Text>
                            </View>
                            <Switch value={isVibrationEnabled} onValueChange={setIsVibrationEnabled} trackColor={{ false: '#222', true: '#10b981' }} />
                        </View>

                        {/* NEW: Sync Toast Toggle Setting */}
                        <View style={styles.settingRow}>
                            <View style={styles.settingLabelGroup}>
                                <CheckCircle2 size={18} color="#10b981" />
                                <Text style={{ color: 'white' }}>Sync Toasted Animation</Text>
                            </View>
                            <Switch value={isSyncToastEnabled} onValueChange={setIsSyncToastEnabled} trackColor={{ false: '#222', true: '#10b981' }} />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* List and Goal Modals stay same */}
            <Modal visible={showListModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '75%' }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Zikir</Text>
                            <TouchableOpacity onPress={()=>setShowListModal(false)}><X color="white" /></TouchableOpacity>
                        </View>
                        <ScrollView>
                            {zikrs.map((item, index) => (
                                <View key={item.id} style={[styles.listItem, currentIndex === index && styles.listActiveItem]}>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { setCurrentIndex(index); setShowListModal(false); }}>
                                        <Text style={styles.listArabic}>{item.arabic}</Text>
                                        <Text style={styles.listTranslation}>{item.translation || item.transliteration || ""}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal visible={showGoalModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Set Custom Goal</Text>
                            <TouchableOpacity onPress={()=>setShowGoalModal(false)}><X color="white" /></TouchableOpacity>
                        </View>
                        <TextInput placeholder="Target..." placeholderTextColor="#444" keyboardType="numeric" style={styles.input} value={customGoal} onChangeText={setCustomGoal} />
                        <TouchableOpacity style={styles.doneBtn} onPress={() => { if(customGoal){ setTarget(parseInt(customGoal)); setShowGoalModal(false); setCustomGoal(''); } }}>
                            <Text style={styles.doneTxt}>Set Target</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ZikrManager visible={showAddModal} onClose={() => setShowAddModal(false)} zikrs={zikrs.filter(z => !z.fixed)} onAdd={(ar, tr) => setZikrs([...zikrs, {id: Date.now().toString(), arabic: ar, transliteration: tr, fixed: false}])} onDelete={(id) => setZikrs(prev => prev.filter(z => z.id !== id))} />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050505' },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 10, alignItems: 'center' },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    headerTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
    iconBtn: { padding: 5 },
    addZikrHeaderBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, gap: 5 },
    addZikrHeaderText: { color: '#050505', fontSize: 11, fontWeight: 'bold' },
    dropdownTrigger: { alignSelf: 'center', marginTop: 15, backgroundColor: '#0a0a0a', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#151515', width: '90%' },
    dropdownLabel: { color: '#10b981', fontSize: 8, fontWeight: 'bold', opacity: 0.6, marginBottom: 4 },
    currentZikrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    currentZikrText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    currentTranslationText: { color: '#10b981', fontSize: 12, opacity: 0.7, fontStyle: 'italic' },
    main: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    circleBox: { height: 260, justifyContent: 'center', alignItems: 'center', width: '100%' },
    svgContainer: { position: 'absolute', width: '100%', alignItems: 'center' },
    lcdPanel: { width: 200, height: 100, borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(16,185,129,0.1)' },
    lcdMain: { fontSize: 48, color: '#10b981', fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace' },
    targetIndicator: { position: 'absolute', bottom: 10, right: 15, flexDirection: 'row', alignItems: 'baseline', gap: 4 },
    targetLabelText: { color: '#10b981', fontSize: 7, fontWeight: '900', opacity: 0.5 },
    targetValueText: { color: '#10b981', fontSize: 12, fontWeight: 'bold' },
    buttonOuterRing: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#080808', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#111', marginTop: 20 },
    buttonCylinder: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#020202', overflow: 'hidden', justifyContent: 'center' },
    btn3DMain: { width: 140, height: 140, borderRadius: 70, alignSelf: 'center', zIndex: 10 },
    touchable: { width: '100%', height: '100%' },
    glassEffect: { width: '100%', height: '100%', borderRadius: 70, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
    buttonReflex: { position: 'absolute', top: 10, width: '60%', height: '20%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50 },
    buttonDepth: { position: 'absolute', bottom: 0, width: 140, height: 140, borderRadius: 70, backgroundColor: '#022c22', alignSelf: 'center', zIndex: 5 },
    tapLabelText: { color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: 3 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, paddingBottom: 40, alignItems: 'center' },
    bottomReset: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
    targetRow: { flexDirection: 'row', gap: 8 },
    tBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: '#0a0a0a', minWidth: 42, alignItems: 'center' },
    tActive: { borderColor: '#10b981', borderWidth: 1 },
    tText: { color: '#444', fontWeight: 'bold', fontSize: 11 },
    toast: { position: 'absolute', left: 20, right: 20, backgroundColor: '#10b981', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2000 },
    toastText: { fontWeight: 'bold', color: 'black' },
    resetBtnToast: { padding: 5 },
    syncToast: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center', zIndex: 9999 },
    blurContent: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.8)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)' },
    syncToastText: { color: 'white', fontSize: 13, fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#0a0a0a', borderRadius: 25, padding: 20, gap: 10, borderWidth: 1, borderColor: '#181818' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
    modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#151515' },
    settingLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    listItem: { flexDirection: 'row', padding: 15, backgroundColor: '#111', borderRadius: 15, marginBottom: 10, alignItems: 'center' },
    listActiveItem: { borderColor: '#10b981', borderWidth: 1 },
    listArabic: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    listTranslation: { color: '#666', fontSize: 11, fontStyle: 'italic' },
    input: { backgroundColor: '#151515', color: 'white', padding: 15, borderRadius: 12, marginBottom: 5 },
    doneBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    doneTxt: { fontWeight: 'bold', color: 'black' }
});

















