// import { Audio } from 'expo-av';
// import * as Haptics from 'expo-haptics';
// import {
//     ChevronDown,
//     RotateCcw,
//     Settings,
//     Target,
// } from 'lucide-react-native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//     Dimensions,
//     Platform,
//     Pressable,
//     SafeAreaView,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import Animated, {
//     useAnimatedProps,
//     useAnimatedStyle,
//     useSharedValue,
//     withSequence,
//     withSpring,
//     withTiming,
// } from 'react-native-reanimated';
// import Svg, { Circle } from 'react-native-svg';

// const { width } = Dimensions.get('window');
// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const CIRCLE_LENGTH = 750; 
// const R = 110; 

// const ZIKRS = [
//     { arabic: "سُبْحَانَ ٱللَّٰهِ", transliteration: "SubhanAllah" },
//     { arabic: "ٱلْحَمْدُ لِلَّٰهِ", transliteration: "Alhamdulillah" },
//     { arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", transliteration: "La ilaha illallah" },
//     { arabic: "ٱللَّٰهُ أَكْبَرُ", transliteration: "Allahu Akbar" },
//     { arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", transliteration: "Astaghfirullah" },
// ];

// const TARGETS = [33, 99, 100, 1000, 0];

// export default function DhikrFlowRN() {
//     const [count, setCount] = useState(0);
//     const [target, setTarget] = useState(33);
//     const [zikrIndex, setZikrIndex] = useState(0);
//     const [isComplete, setIsComplete] = useState(false);

//     // Animation Shared Values
//     const progress = useSharedValue(0);
//     const buttonScale = useSharedValue(1);
//     const toastY = useSharedValue(-150);
    
//     // --- WAVE ANIMATION VALUES ---
//     const waveScale = useSharedValue(1);
//     const waveOpacity = useSharedValue(0);

//     const clickSound = useRef<Audio.Sound | null>(null);
//     const completeSound = useRef<Audio.Sound | null>(null);

//     useEffect(() => {
//         loadSounds();
//         return () => {
//             clickSound.current?.unloadAsync();
//             completeSound.current?.unloadAsync();
//         };
//     }, []);

//     useEffect(() => {
//         const percentage = target === 0 ? 0 : count / target;
//         progress.value = withSpring(percentage, { damping: 10, stiffness: 80 });
//         if (target > 0 && count === target) triggerCompletion();
//     }, [count, target]);

//     const loadSounds = async () => {
//         try {
//             const { sound: click } = await Audio.Sound.createAsync(require('../../assets/tasbeeh.mp3'));
//             const { sound: complete } = await Audio.Sound.createAsync(require('../../assets/endtone.mp3'));
//             clickSound.current = click;
//             completeSound.current = complete;
//         } catch (e) { console.log("Sound error"); }
//     };

//     const triggerCompletion = async () => {
//         setIsComplete(true);
//         toastY.value = withSpring(20);
//         if (completeSound.current) await completeSound.current.replayAsync();
//         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//     };

//     const handleIncrement = useCallback(async () => {
//         if (isComplete) return;
//         setCount(prev => prev + 1);

//         // 1. Button Bounce
//         buttonScale.value = withSequence(withTiming(0.92, { duration: 50 }), withSpring(1));

//         // 2. OUTER WAVE EFFECT (Expanding Ripple)
//         waveScale.value = 1; 
//         waveOpacity.value = 0.6; 
//         waveScale.value = withTiming(1.8, { duration: 500 }); // Bahar phailna
//         waveOpacity.value = withTiming(0, { duration: 500 }); // Gayab hona

//         if (clickSound.current) await clickSound.current.replayAsync();
//         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     }, [isComplete]);

//     const handleReset = () => {
//         setCount(0);
//         setIsComplete(false);
//         toastY.value = withSpring(-150);
//         progress.value = withTiming(0);
//     };

//     // Animated Styles
//     const animatedCircleProps = useAnimatedProps(() => ({
//         strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
//     }));

//     const animatedToastStyle = useAnimatedStyle(() => ({
//         transform: [{ translateY: toastY.value }],
//     }));

//     const animatedButtonStyle = useAnimatedStyle(() => ({
//         transform: [{ scale: buttonScale.value }],
//     }));

//     const animatedWaveStyle = useAnimatedStyle(() => ({
//         transform: [{ scale: waveScale.value }],
//         opacity: waveOpacity.value,
//     }));

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" />

//             {/* Notification Toast */}
//             <Animated.View style={[styles.toastContainer, animatedToastStyle]}>
//                 <View style={styles.toast}>
//                     <View>
//                         <Text style={styles.toastLabel}>MASHA-ALLAH</Text>
//                         <Text style={styles.toastText}>Target Completed!</Text>
//                     </View>
//                     <TouchableOpacity onPress={handleReset} style={styles.toastBtn}>
//                         <RotateCcw size={16} color="black" />
//                     </TouchableOpacity>
//                 </View>
//             </Animated.View>

//             <View style={styles.header}>
//                 <View style={styles.headerLeft}>
//                     <Target size={14} color="#10b981" />
//                     <Text style={styles.headerTitle}>DHIKRFLOW</Text>
//                 </View>
//                 <Settings size={20} color="rgba(255,255,255,0.2)" />
//             </View>

//             <View style={styles.main}>
//                 <View style={styles.zikrBox}>
//                     <Text style={styles.arabic}>{ZIKRS[zikrIndex].arabic}</Text>
//                     <Text style={styles.translit}>{ZIKRS[zikrIndex].transliteration}</Text>
//                     <TouchableOpacity onPress={() => { setZikrIndex((zikrIndex + 1) % ZIKRS.length); handleReset(); }} style={styles.changeBtn}>
//                         <Text style={styles.changeTxt}>CHANGE ZIKR</Text>
//                         <ChevronDown size={12} color="gray" />
//                     </TouchableOpacity>
//                 </View>

//                 {/* Progress Circle */}
//                 <View style={styles.circleWrapper}>
//                     <Svg style={styles.svg} width={width} height={260}>
//                         <Circle cx={width / 2} cy={130} r={R} stroke="rgba(255,255,255,0.05)" strokeWidth={3} fill="none" />
//                         <AnimatedCircle
//                             cx={width / 2} cy={130} r={R}
//                             stroke="#10b981" strokeWidth={5}
//                             strokeDasharray={CIRCLE_LENGTH}
//                             animatedProps={animatedCircleProps}
//                             strokeLinecap="round" fill="none"
//                         />
//                     </Svg>
//                     <View style={styles.lcd}>
//                         <Text style={styles.lcdBg}>88888</Text>
//                         <Text style={styles.lcdMain}>{count.toString().padStart(5, '0')}</Text>
//                         <Text style={styles.targetLabel}>GOAL: {target || '∞'}</Text>
//                     </View>
//                 </View>

//                 {/* --- TAP BUTTON WITH OUTER WAVE --- */}
//                 <View style={styles.buttonContainer}>
//                     {/* Yeh woh wave hai jo click par bahar phailti hai */}
//                     <Animated.View style={[styles.outerWave, animatedWaveStyle]} />
                    
//                     <Animated.View style={[styles.btnOuter, animatedButtonStyle]}>
//                         <Pressable 
//                             onPress={handleIncrement}
//                             style={styles.tapBtn}
//                         >
//                             <Text style={styles.tapTxt}>TAP</Text>
//                         </Pressable>
//                     </Animated.View>
//                 </View>
//             </View>

//             <View style={styles.footer}>
//                 <TouchableOpacity onPress={handleReset} style={styles.footerAction}>
//                     <View style={styles.resetCircle}><RotateCcw size={18} color="white" /></View>
//                     <Text style={styles.resetTxt}>RESET</Text>
//                 </TouchableOpacity>

//                 <View style={styles.targetRow}>
//                     {TARGETS.map(t => (
//                         <TouchableOpacity key={t} onPress={() => { setTarget(t); handleReset(); }} 
//                             style={[styles.tBtn, target === t && styles.tBtnActive]}>
//                             <Text style={[styles.tBtnTxt, target === t && { color: '#10b981' }]}>{t || '∞'}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </View>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#050505' },
//     toastContainer: { position: 'absolute', top: 40, left: 20, right: 20, zIndex: 1000 },
//     toast: { backgroundColor: '#10b981', padding: 18, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//     toastLabel: { fontSize: 9, fontWeight: 'bold', color: 'rgba(0,0,0,0.5)' },
//     toastText: { color: 'black', fontWeight: 'bold', fontSize: 16 },
//     toastBtn: { backgroundColor: 'rgba(0,0,0,0.1)', padding: 10, borderRadius: 12 },
//     header: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, alignItems: 'center' },
//     headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//     headerTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 'bold' },
//     main: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 15 },
//     zikrBox: { alignItems: 'center' },
//     arabic: { fontSize: 34, color: 'white', fontWeight: 'bold' },
//     translit: { fontSize: 14, color: '#10b981', opacity: 0.6, marginTop: 4 },
//     changeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
//     changeTxt: { fontSize: 9, color: 'gray', fontWeight: 'bold' },
//     circleWrapper: { height: 260, width: width, justifyContent: 'center', alignItems: 'center' },
//     svg: { position: 'absolute' },
//     lcd: { alignItems: 'center' },
//     lcdBg: { position: 'absolute', fontSize: 58, color: '#10b981', opacity: 0.05, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
//     lcdMain: { fontSize: 58, color: '#10b981', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
//     targetLabel: { fontSize: 10, color: 'rgba(16, 185, 129, 0.4)', fontWeight: 'bold' },

//     // --- BUTTON & WAVE STYLES ---
//     buttonContainer: {
//         width: 250, // Space for wave to expand
//         height: 200,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     outerWave: {
//         position: 'absolute',
//         width: 150,
//         height: 150,
//         borderRadius: 75,
//         borderWidth: 2,
//         borderColor: '#10b981',
//         backgroundColor: 'rgba(16, 185, 129, 0.15)',
//     },
//     btnOuter: { 
//         width: 150, 
//         height: 150, 
//         borderRadius: 75, 
//         backgroundColor: '#050505',
//         borderWidth: 1, 
//         borderColor: 'rgba(255,255,255,0.1)',
//         overflow: 'hidden',
//         zIndex: 5, // Wave ke upar
//     },
//     tapBtn: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
//     tapTxt: { fontSize: 16, color: 'white', fontWeight: '900', letterSpacing: 3, opacity: 0.8 },

//     footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 30, paddingBottom: 40 },
//     footerAction: { alignItems: 'center', gap: 6 },
//     resetCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
//     resetTxt: { fontSize: 10, color: 'white', fontWeight: 'bold', opacity: 0.6 },
//     targetRow: { flexDirection: 'row', gap: 8 },
//     tBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)' },
//     tBtnActive: { backgroundColor: 'rgba(16,185,129,0.15)', borderWidth: 1, borderColor: '#10b981' },
//     tBtnTxt: { color: 'gray', fontSize: 11, fontWeight: 'bold' }
// });

















//======================================= second best ui========================================

// import { Audio } from 'expo-av';
// import * as Haptics from 'expo-haptics';
// import { ChevronDown, Plus, RotateCcw, Settings, Target, Trash2, X } from 'lucide-react-native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import {
//     Dimensions,
//     Modal, Platform, Pressable, SafeAreaView,
//     ScrollView,
//     StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View
// } from 'react-native';
// import Animated, {
//     useAnimatedProps, useAnimatedStyle, useSharedValue,
//     withSequence, withSpring, withTiming,
// } from 'react-native-reanimated';
// import Svg, { Circle } from 'react-native-svg';

// const { width } = Dimensions.get('window');
// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const CIRCLE_LENGTH = 750; 
// const R = 110; 

// const INITIAL_ZIKRS = [
//     { id: '1', arabic: "سُبْحَانَ ٱللَّٰهِ", translit: "SubhanAllah", fixed: true },
//     { id: '2', arabic: "ٱلْحَمْدُ لِلَّٰهِ", translit: "Alhamdulillah", fixed: true },
//     { id: '3', arabic: "اللهُ أَكْبَرُ", translit: "Allahu Akbar", fixed: true },
//     { id: '4', arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", translit: "La ilaha illallah", fixed: true },
// ];

// export default function TasbeehApp() {
//     const [zikrs, setZikrs] = useState(INITIAL_ZIKRS);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [count, setCount] = useState(0);
//     const [target, setTarget] = useState(33);
//     const [isComplete, setIsComplete] = useState(false);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showListModal, setShowListModal] = useState(false);
//     const [newArabic, setNewArabic] = useState('');
//     const [newTranslit, setNewTranslit] = useState('');

//     const progress = useSharedValue(0);
//     const buttonScale = useSharedValue(1);
//     const waveScale = useSharedValue(1);
//     const waveOpacity = useSharedValue(0);
//     const toastY = useSharedValue(-150);

//     const soundRef = useRef<Audio.Sound | null>(null);

//     useEffect(() => {
//         loadSound();
//         return () => { soundRef.current?.unloadAsync(); };
//     }, []);

//     async function loadSound() {
//         try {
//             const { sound } = await Audio.Sound.createAsync(require('../../assets/tasbeeh.mp3'));
//             soundRef.current = sound;
//         } catch (e) { console.log("Sound error"); }
//     }

//     const playClick = async () => {
//         try { if (soundRef.current) await soundRef.current.replayAsync(); } catch (e) {}
//     };

//     useEffect(() => {
//         const percentage = target === 0 ? 0 : count / target;
//         progress.value = withSpring(percentage, { damping: 10, stiffness: 80 });
//         if (target > 0 && count === target) {
//             setIsComplete(true);
//             toastY.value = withSpring(20);
//             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//         }
//     }, [count, target]);

//     const handleIncrement = useCallback(async () => {
//         if (isComplete) return;
//         setCount(prev => prev + 1);
//         playClick();
//         buttonScale.value = withSequence(withTiming(0.9, { duration: 50 }), withSpring(1));
//         waveScale.value = 1; waveOpacity.value = 0.6;
//         waveScale.value = withTiming(1.8, { duration: 500 });
//         waveOpacity.value = withTiming(0, { duration: 500 });
//         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     }, [isComplete]);

//     const handleReset = () => {
//         setCount(0); setIsComplete(false);
//         toastY.value = withSpring(-150);
//         progress.value = withTiming(0);
//     };

//     const addZikr = () => {
//         if (newArabic.trim()) {
//             const newItem = { id: Date.now().toString(), arabic: newArabic, translit: newTranslit.trim(), fixed: false };
//             setZikrs([...zikrs, newItem]);
//             setNewArabic(''); setNewTranslit('');
//             setShowAddModal(false);
//         }
//     };

//     const deleteZikrFromList = (id: string) => {
//         if (zikrs.find(z => z.id === id)?.fixed) return;
//         setZikrs(zikrs.filter(z => z.id !== id));
//         setCurrentIndex(0);
//         handleReset();
//     };

//     const animatedCircleProps = useAnimatedProps(() => ({ strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value) }));
//     const animatedButtonStyle = useAnimatedStyle(() => ({ transform: [{ scale: buttonScale.value }] }));
//     const animatedWaveStyle = useAnimatedStyle(() => ({ transform: [{ scale: waveScale.value }], opacity: waveOpacity.value }));
//     const animatedToastStyle = useAnimatedStyle(() => ({ transform: [{ translateY: toastY.value }] }));

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" />

//             <Animated.View style={[styles.toast, animatedToastStyle]}>
//                 <Text style={styles.toastText}>MashaAllah! Target Completed</Text>
//                 <TouchableOpacity onPress={handleReset} style={styles.resetBtnToast}><RotateCcw size={14} color="black" /></TouchableOpacity>
//             </Animated.View>

//             <View style={styles.header}>
//                 <TouchableOpacity style={styles.iconBtn}><Settings size={22} color="rgba(255,255,255,0.4)" /></TouchableOpacity>
//                 <View style={styles.headerCenter}><Target size={14} color="#10b981" /><Text style={styles.headerTitle}>DHIKRFLOW</Text></View>
//                 <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.iconBtn}><Plus size={26} color="#10b981" /></TouchableOpacity>
//             </View>

//             <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowListModal(true)}>
//                 <Text style={styles.dropdownLabel}>MY ZIKR LIST</Text>
//                 <View style={styles.currentZikrRow}>
//                     <Text style={styles.currentZikrText} numberOfLines={1}>{zikrs[currentIndex]?.arabic}</Text>
//                     <ChevronDown size={18} color="#10b981" />
//                 </View>
//             </TouchableOpacity>

//             <View style={styles.main}>
//                 <View style={styles.circleBox}>
//                     <Svg width={width} height={260} style={styles.svg}>
//                         <Circle cx={width/2} cy={130} r={R} stroke="rgba(255,255,255,0.05)" strokeWidth={3} fill="none" />
//                         <AnimatedCircle cx={width/2} cy={130} r={R} stroke="#10b981" strokeWidth={5} strokeDasharray={CIRCLE_LENGTH} animatedProps={animatedCircleProps} strokeLinecap="round" fill="none" />
//                     </Svg>
//                     <View style={styles.lcd}>
//                         <Text style={styles.lcdMain}>{count.toString().padStart(5, '0')}</Text>
//                         <Text style={styles.goalText}>GOAL: {target || '∞'}</Text>
//                     </View>
//                 </View>

//                 <View style={styles.tapArea}>
//                     <Animated.View style={[styles.wave, animatedWaveStyle]} />
//                     <Animated.View style={[styles.btnCircle, animatedButtonStyle]}>
//                         <Pressable onPress={handleIncrement} style={styles.pressable}><Text style={styles.tapLabel}>TAP</Text></Pressable>
//                     </Animated.View>
//                 </View>
//             </View>

//             <View style={styles.footer}>
//                 <View style={styles.footerLeft}>
//                     <TouchableOpacity onPress={handleReset} style={styles.bottomReset}><RotateCcw size={20} color="white" /></TouchableOpacity>
//                     {!zikrs[currentIndex]?.fixed && (
//                         <TouchableOpacity onPress={() => deleteZikrFromList(zikrs[currentIndex].id)} style={styles.deleteBtn}><Trash2 size={20} color="#ef4444" /></TouchableOpacity>
//                     )}
//                 </View>
//                 <View style={styles.targetRow}>
//                     {[33, 99, 100, 0].map(t => (
//                         <TouchableOpacity key={t} onPress={() => {setTarget(t); handleReset();}} style={[styles.tBtn, target === t && styles.tActive]}>
//                             <Text style={[styles.tText, target === t && {color: '#10b981'}]}>{t || '∞'}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </View>

//             <Modal visible={showListModal} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={[styles.modalContent, { maxHeight: '75%' }]}>
//                         <View style={styles.modalHeader}><Text style={styles.modalTitle}>Select Zikr</Text><TouchableOpacity onPress={()=>setShowListModal(false)}><X color="white" /></TouchableOpacity></View>
//                         <ScrollView showsVerticalScrollIndicator={false}>
//                             {zikrs.map((item, index) => (
//                                 <TouchableOpacity key={item.id} style={[styles.listItem, currentIndex === index && styles.listActiveItem]} onPress={() => { setCurrentIndex(index); setShowListModal(false); handleReset(); }}>
//                                     <View style={{ flex: 1 }}><Text style={styles.listArabic}>{item.arabic}</Text>{item.translit ? <Text style={styles.listTrans}>{item.translit}</Text> : null}</View>
//                                     {!item.fixed && <TouchableOpacity onPress={() => deleteZikrFromList(item.id)} style={{padding: 10}}><Trash2 size={18} color="#ef4444" /></TouchableOpacity>}
//                                 </TouchableOpacity>
//                             ))}
//                         </ScrollView>
//                     </View>
//                 </View>
//             </Modal>

//             <Modal visible={showAddModal} transparent animationType="fade">
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <View style={styles.modalHeader}><Text style={styles.modalTitle}>New Zikr</Text><TouchableOpacity onPress={()=>setShowAddModal(false)}><X color="white" /></TouchableOpacity></View>
//                         <TextInput placeholder="Arabic Zikr (Zaroori)..." placeholderTextColor="#444" style={styles.input} value={newArabic} onChangeText={setNewArabic} />
//                         <TextInput placeholder="Translation (Optional)..." placeholderTextColor="#444" style={styles.input} value={newTranslit} onChangeText={setNewTranslit} />
//                         <TouchableOpacity style={[styles.saveBtn, {opacity: newArabic ? 1 : 0.5}]} onPress={addZikr} disabled={!newArabic}><Text style={styles.saveTxt}>Add Zikr</Text></TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#050505' },
//     header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 15, alignItems: 'center' },
//     headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//     headerTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
//     iconBtn: { padding: 8 },
//     dropdownTrigger: { alignSelf: 'center', marginTop: 15, backgroundColor: '#0a0a0a', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: '#111', width: width * 0.88 },
//     dropdownLabel: { color: '#10b981', fontSize: 9, fontWeight: 'bold', marginBottom: 4, opacity: 0.7 },
//     currentZikrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//     currentZikrText: { color: 'white', fontSize: 18, fontWeight: 'bold', flex: 1 },
//     main: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     circleBox: { height: 260, width: width, justifyContent: 'center', alignItems: 'center' },
//     svg: { position: 'absolute' },
//     lcd: { alignItems: 'center' },
//     lcdMain: { fontSize: 62, color: '#10b981', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
//     goalText: { fontSize: 10, color: 'rgba(16, 185, 129, 0.3)', fontWeight: 'bold' },
//     tapArea: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center' },
//     wave: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' },
//     btnCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#080808', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', zIndex: 5 },
//     pressable: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
//     tapLabel: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 4 },
//     footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, paddingBottom: 40, alignItems: 'center' },
//     footerLeft: { flexDirection: 'row', gap: 12 },
//     bottomReset: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
//     deleteBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(239, 68, 68, 0.1)', justifyContent: 'center', alignItems: 'center' },
//     targetRow: { flexDirection: 'row', gap: 8 },
//     tBtn: { paddingHorizontal: 15, paddingVertical: 12, borderRadius: 14, backgroundColor: '#111' },
//     tActive: { borderColor: '#10b981', borderWidth: 1 },
//     tText: { color: '#555', fontWeight: 'bold', fontSize: 12 },
//     toast: { position: 'absolute', top: 50, left: 20, right: 20, backgroundColor: '#10b981', padding: 18, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2000 },
//     toastText: { fontWeight: 'bold', color: 'black' },
//     resetBtnToast: { padding: 8, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 10 },
//     modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', padding: 20 },
//     modalContent: { backgroundColor: '#0a0a0a', borderRadius: 30, padding: 25, gap: 15, borderWidth: 1, borderColor: '#151515' },
//     modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
//     modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
//     listItem: { flexDirection: 'row', padding: 20, backgroundColor: '#111', borderRadius: 18, marginBottom: 12, alignItems: 'center' },
//     listActiveItem: { borderColor: '#10b981', borderWidth: 1 },
//     listArabic: { color: 'white', fontSize: 20, fontWeight: 'bold' },
//     listTrans: { color: '#10b981', fontSize: 12, opacity: 0.6, marginTop: 4 },
//     input: { backgroundColor: '#151515', color: 'white', padding: 20, borderRadius: 18 },
//     saveBtn: { backgroundColor: '#10b981', padding: 20, borderRadius: 18, alignItems: 'center' },
//     saveTxt: { fontWeight: 'bold', color: 'black', fontSize: 16 }
// });










// ======================= third ui===========================================================


// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Audio } from 'expo-av';
// import * as Haptics from 'expo-haptics';
// import { LinearGradient } from 'expo-linear-gradient';
// import { ChevronDown, Plus, RotateCcw, Settings, Smartphone, Target, Trash2, Volume2, X } from 'lucide-react-native';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//     Dimensions, Modal, Platform,
//     SafeAreaView,
//     ScrollView,
//     StatusBar, StyleSheet,
//     Switch,
//     Text, TextInput, TouchableOpacity, View
// } from 'react-native';
// import Animated, {
//     useAnimatedProps, useAnimatedStyle, useSharedValue,
//     withSequence,
//     withSpring, withTiming
// } from 'react-native-reanimated';
// import Svg, { Circle } from 'react-native-svg';

// const { width } = Dimensions.get('window');
// const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// const CIRCLE_LENGTH = 750; 
// const R = 110; 

// const INITIAL_ZIKRS = [
//     { id: '1', arabic: "سُبْحَانَ ٱللَّٰهِ", fixed: true },
//     { id: '2', arabic: "ٱلْحَمْدُ لِلَّٰهِ", fixed: true },
//     { id: '3', arabic: "اللهُ أَكْبَرُ", translit: "Allahu Akbar", fixed: true },
//     { id: '4', arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", translit: "La ilaha illallah", fixed: true },
// ];

// export default function TasbeehApp() {
//     // --- States ---
//     const [zikrs, setZikrs] = useState(INITIAL_ZIKRS);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [count, setCount] = useState(0);
//     const [target, setTarget] = useState(33);
//     const [isComplete, setIsComplete] = useState(false);
//     const [isSoundEnabled, setIsSoundEnabled] = useState(true);
//     const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
    
//     // UI States
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [showListModal, setShowListModal] = useState(false);
//     const [showSettings, setShowSettings] = useState(false);
//     const [newArabic, setNewArabic] = useState('');

//     // --- Animations ---
//     const progress = useSharedValue(0);
//     const buttonTranslateY = useSharedValue(0); 
//     const toastY = useSharedValue(-150);
//     const soundRef = useRef<Audio.Sound | null>(null);

//     // --- Persistence (Saving Data) ---
//     useEffect(() => {
//         loadData();
//         loadSound();
//     }, []);

//     useEffect(() => {
//         saveData();
//     }, [count, zikrs, isSoundEnabled, isVibrationEnabled]);

//     const loadData = async () => {
//         try {
//             const savedCount = await AsyncStorage.getItem('tasbeeh_count');
//             const savedZikrs = await AsyncStorage.getItem('tasbeeh_zikrs');
//             const savedSettings = await AsyncStorage.getItem('tasbeeh_settings');
            
//             if (savedCount) setCount(parseInt(savedCount));
//             if (savedZikrs) setZikrs(JSON.parse(savedZikrs));
//             if (savedSettings) {
//                 const { sound, vibe } = JSON.parse(savedSettings);
//                 setIsSoundEnabled(sound);
//                 setIsVibrationEnabled(vibe);
//             }
//         } catch (e) { console.log("Load Error", e); }
//     };

//     const saveData = async () => {
//         try {
//             await AsyncStorage.setItem('tasbeeh_count', count.toString());
//             await AsyncStorage.setItem('tasbeeh_zikrs', JSON.stringify(zikrs));
//             await AsyncStorage.setItem('tasbeeh_settings', JSON.stringify({ sound: isSoundEnabled, vibe: isVibrationEnabled }));
//         } catch (e) { console.log("Save Error", e); }
//     };

//     async function loadSound() {
//         try {
//             const { sound } = await Audio.Sound.createAsync(require('../../assets/tasbeeh.mp3'));
//             soundRef.current = sound;
//         } catch (e) {}
//     }

//     // --- Main Logic ---
//     useEffect(() => {
//         const percentage = target === 0 ? 0 : count / target;
//         progress.value = withSpring(percentage);
//         if (target > 0 && count >= target && !isComplete) {
//             setIsComplete(true);
//             toastY.value = withSpring(Platform.OS === 'android' ? 50 : 60);
//             if (isVibrationEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//         }
//     }, [count, target]);

//     const handlePress = () => {
//         if (target > 0 && count >= target) return;

//         setCount(prev => prev + 1);
//         if (isVibrationEnabled) Haptics.selectionAsync();
//         if (isSoundEnabled && soundRef.current) soundRef.current.replayAsync();

//         buttonTranslateY.value = withSequence(
//             withTiming(12, { duration: 60 }),
//             withSpring(0, { damping: 12, stiffness: 120 })
//         );
//     };

//     const handleReset = () => {
//         setCount(0);
//         setIsComplete(false);
//         toastY.value = withSpring(-150);
//         progress.value = withTiming(0);
//     };

//     // --- Styles ---
//     const animatedCircleProps = useAnimatedProps(() => ({
//         strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
//     }));
//     const animatedButtonStyle = useAnimatedStyle(() => ({
//         transform: [{ translateY: buttonTranslateY.value }],
//     }));
//     const animatedToastStyle = useAnimatedStyle(() => ({
//         transform: [{ translateY: toastY.value }],
//     }));

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" />

//             {/* Success Toast */}
//             <Animated.View style={[styles.toast, animatedToastStyle]}>
//                 <Text style={styles.toastText}>Goal Completed! Alhamdulillah</Text>
//                 <TouchableOpacity onPress={handleReset} style={styles.resetBtnToast}>
//                     <RotateCcw size={14} color="black" />
//                 </TouchableOpacity>
//             </Animated.View>

//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.iconBtn}>
//                     <Settings size={22} color="rgba(255,255,255,0.4)" />
//                 </TouchableOpacity>
//                 <View style={styles.headerCenter}>
//                     <Target size={14} color="#10b981" />
//                     <Text style={styles.headerTitle}>DHIKRFLOW</Text>
//                 </View>
//                 <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addZikrHeaderBtn}>
//                     <Plus size={16} color="#050505" strokeWidth={3} />
//                     <Text style={styles.addZikrHeaderText}>ADD ZIKR</Text>
//                 </TouchableOpacity>
//             </View>

//             {/* Zikr Selection Display */}
//             <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowListModal(true)}>
//                 <Text style={styles.dropdownLabel}>CURRENT DHIKR</Text>
//                 <View style={styles.currentZikrRow}>
//                     <Text style={styles.currentZikrText} numberOfLines={1}>{zikrs[currentIndex]?.arabic}</Text>
//                     <ChevronDown size={18} color="#10b981" />
//                 </View>
//             </TouchableOpacity>

//             <View style={styles.main}>
//                 {/* LCD & Progress */}
//                 <View style={styles.circleBox}>
//                     <Svg width={width} height={260} style={styles.svg}>
//                         <Circle cx={width/2} cy={130} r={R} stroke="rgba(255,255,255,0.05)" strokeWidth={3} fill="none" />
//                         <AnimatedCircle cx={width/2} cy={130} r={R} stroke="#10b981" strokeWidth={5} strokeDasharray={CIRCLE_LENGTH} animatedProps={animatedCircleProps} strokeLinecap="round" fill="none" />
//                     </Svg>
//                     <LinearGradient colors={['#0f2019', '#08120e']} style={styles.lcdPanel}>
//                         <Text style={styles.lcdMain}>{count.toString().padStart(5, '0')}</Text>
//                         <View style={styles.targetIndicator}>
//                             <Text style={styles.targetLabelText}>GOAL</Text>
//                             <Text style={styles.targetValueText}>{target || '∞'}</Text>
//                         </View>
//                     </LinearGradient>
//                 </View>

//                 {/* 3D MECHANICAL BUTTON */}
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

//             {/* Footer */}
//             <View style={styles.footer}>
//                 <TouchableOpacity onPress={handleReset} style={styles.bottomReset}>
//                     <RotateCcw size={22} color="white" />
//                 </TouchableOpacity>
//                 <View style={styles.targetRow}>
//                     {[33, 99, 100, 0].map(t => (
//                         <TouchableOpacity key={t} onPress={() => {setTarget(t); handleReset();}} style={[styles.tBtn, target === t && styles.tActive]}>
//                             <Text style={[styles.tText, target === t && {color: '#10b981'}]}>{t || '∞'}</Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>
//             </View>

//             {/* Modals: List, Add, Settings */}
//             <Modal visible={showListModal} animationType="slide" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={[styles.modalContent, { maxHeight: '70%' }]}>
//                         <View style={styles.modalHeader}><Text style={styles.modalTitle}>Select Dhikr</Text><TouchableOpacity onPress={()=>setShowListModal(false)}><X color="white" /></TouchableOpacity></View>
//                         <ScrollView>{zikrs.map((item, index) => (
//                             <TouchableOpacity key={item.id} style={[styles.listItem, currentIndex === index && styles.listActiveItem]} onPress={() => { setCurrentIndex(index); setShowListModal(false); handleReset(); }}>
//                                 <Text style={styles.listArabic}>{item.arabic}</Text>
//                                 {!item.fixed && <TouchableOpacity onPress={() => setZikrs(zikrs.filter(z => z.id !== item.id))}><Trash2 size={18} color="#ef4444" /></TouchableOpacity>}
//                             </TouchableOpacity>
//                         ))}</ScrollView>
//                     </View>
//                 </View>
//             </Modal>

//             <Modal visible={showSettings} animationType="fade" transparent>
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <View style={styles.modalHeader}><Text style={styles.modalTitle}>Settings</Text><TouchableOpacity onPress={()=>setShowSettings(false)}><X color="white" /></TouchableOpacity></View>
//                         <View style={styles.settingRow}><View style={styles.settingLeft}><Volume2 size={18} color="#10b981"/><Text style={styles.settingText}>Sound</Text></View><Switch value={isSoundEnabled} onValueChange={setIsSoundEnabled} trackColor={{ false: '#222', true: '#10b981' }} thumbColor="white" /></View>
//                         <View style={styles.settingRow}><View style={styles.settingLeft}><Smartphone size={18} color="#10b981"/><Text style={styles.settingText}>Vibration</Text></View><Switch value={isVibrationEnabled} onValueChange={setIsVibrationEnabled} trackColor={{ false: '#222', true: '#10b981' }} thumbColor="white" /></View>
//                         <TouchableOpacity style={styles.doneBtn} onPress={() => setShowSettings(false)}><Text style={styles.doneTxt}>Close</Text></TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>

//             <Modal visible={showAddModal} transparent animationType="fade">
//                 <View style={styles.modalOverlay}>
//                     <View style={styles.modalContent}>
//                         <View style={styles.modalHeader}><Text style={styles.modalTitle}>Add New</Text><TouchableOpacity onPress={()=>setShowAddModal(false)}><X color="white" /></TouchableOpacity></View>
//                         <TextInput placeholder="Type Arabic..." placeholderTextColor="#444" style={styles.input} value={newArabic} onChangeText={setNewArabic} />
//                         <TouchableOpacity style={styles.doneBtn} onPress={() => { if(newArabic){setZikrs([...zikrs, {id:Date.now().toString(), arabic:newArabic, fixed:false}]); setNewArabic(''); setShowAddModal(false); } }}><Text style={styles.doneTxt}>Save Dhikr</Text></TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>

//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#050505' },
//     header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 45 : 20, alignItems: 'center' },
//     headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//     headerTitle: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
//     iconBtn: { padding: 8 },
//     addZikrHeaderBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, gap: 5 },
//     addZikrHeaderText: { color: '#050505', fontSize: 11, fontWeight: '900' },
//     dropdownTrigger: { alignSelf: 'center', marginTop: 15, backgroundColor: '#0a0a0a', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 20, borderWidth: 1, borderColor: '#151515', width: '90%' },
//     dropdownLabel: { color: '#10b981', fontSize: 8, fontWeight: 'bold', opacity: 0.6 },
//     currentZikrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//     currentZikrText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
//     main: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     circleBox: { height: 260, justifyContent: 'center', alignItems: 'center' },
//     svg: { position: 'absolute' },
//     lcdPanel: { width: 220, height: 115, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)', justifyContent: 'center', alignItems: 'center' },
//     lcdMain: { fontSize: 52, color: '#10b981', fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace' },
//     targetIndicator: { position: 'absolute', bottom: 12, right: 18, flexDirection: 'row', alignItems: 'baseline', gap: 4 },
//     targetLabelText: { color: '#10b981', fontSize: 7, fontWeight: '900', opacity: 0.5 },
//     targetValueText: { color: '#10b981', fontSize: 13, fontWeight: 'bold' },
//     buttonOuterRing: { width: 190, height: 190, borderRadius: 95, backgroundColor: '#080808', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#111', marginTop: 20 },
//     buttonCylinder: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#020202', overflow: 'hidden', justifyContent: 'center' },
//     btn3DMain: { width: 140, height: 140, borderRadius: 70, alignSelf: 'center', zIndex: 10 },
//     touchable: { width: '100%', height: '100%' },
//     glassEffect: { width: '100%', height: '100%', borderRadius: 70, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)' },
//     buttonReflex: { position: 'absolute', top: 10, width: '60%', height: '20%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50 },
//     buttonDepth: { position: 'absolute', bottom: 0, width: 140, height: 140, borderRadius: 70, backgroundColor: '#022c22', alignSelf: 'center', zIndex: 5 },
//     tapLabelText: { color: 'white', fontSize: 24, fontWeight: '900', letterSpacing: 4 },
//     footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, paddingBottom: 40, alignItems: 'center' },
//     bottomReset: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
//     targetRow: { flexDirection: 'row', gap: 8 },
//     tBtn: { paddingHorizontal: 15, paddingVertical: 12, borderRadius: 14, backgroundColor: '#0a0a0a' },
//     tActive: { borderColor: '#10b981', borderWidth: 1 },
//     tText: { color: '#444', fontWeight: 'bold', fontSize: 12 },
//     toast: { position: 'absolute', left: 20, right: 20, backgroundColor: '#10b981', padding: 18, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2000 },
//     toastText: { fontWeight: 'bold', color: '#050505' },
//     resetBtnToast: { padding: 8, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 10 },
//     modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 25 },
//     modalContent: { backgroundColor: '#0a0a0a', borderRadius: 30, padding: 25, gap: 15, borderWidth: 1, borderColor: '#181818' },
//     modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
//     modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
//     settingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#111' },
//     settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//     settingText: { color: 'white', fontSize: 16 },
//     listItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#111', borderRadius: 20, marginBottom: 12, alignItems: 'center' },
//     listActiveItem: { borderColor: '#10b981', borderWidth: 1 },
//     listArabic: { color: 'white', fontSize: 22, fontWeight: 'bold' },
//     input: { backgroundColor: '#151515', color: 'white', padding: 20, borderRadius: 18, fontSize: 16, marginBottom: 10 },
//     doneBtn: { backgroundColor: '#10b981', padding: 18, borderRadius: 18, alignItems: 'center' },
//     doneTxt: { fontWeight: 'bold', color: 'black', fontSize: 16 }
// });









// ================================ fourth ui =======================
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown, Plus, RotateCcw, Settings, Smartphone, Target, Trash2, Volume2, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions, Modal, Platform, SafeAreaView, ScrollView,
    StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Animated, {
    useAnimatedProps, useAnimatedStyle, useSharedValue,
    withSequence, withSpring, withTiming
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const CIRCLE_LENGTH = 750; 
const R = 110; 

const INITIAL_ZIKRS = [
    { id: '1', arabic: "سُبْحَانَ ٱللَّٰهِ", translation: "Glory be to Allah", fixed: true },
    { id: '2', arabic: "ٱلْحَمْدُ لِلَّٰهِ", translation: "Praise be to Allah", fixed: true },
    { id: '3', arabic: "اللهُ أَكْبَرُ", translation: "Allah is the Greatest", fixed: true },
    { id: '4', arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", translation: "There is no god but Allah", fixed: true },
];

export default function TasbeehApp() {
    const [zikrs, setZikrs] = useState(INITIAL_ZIKRS);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [count, setCount] = useState(0);
    const [target, setTarget] = useState(33);
    const [isComplete, setIsComplete] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [newArabic, setNewArabic] = useState('');
    const [newTranslation, setNewTranslation] = useState('');

    const progress = useSharedValue(0);
    const buttonTranslateY = useSharedValue(0); 
    const toastY = useSharedValue(-150);
    const soundRef = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        loadData();
        loadSound();
    }, []);

    const loadData = async () => {
        try {
            const savedCount = await AsyncStorage.getItem('tasbeeh_count');
            const savedZikrs = await AsyncStorage.getItem('tasbeeh_zikrs');
            const savedSettings = await AsyncStorage.getItem('tasbeeh_settings');
            if (savedCount) setCount(parseInt(savedCount));
            if (savedZikrs) {
                const parsed = JSON.parse(savedZikrs);
                setZikrs([...INITIAL_ZIKRS, ...parsed.filter((z: any) => !z.fixed)]);
            }
            if (savedSettings) {
                const { sound, vibe } = JSON.parse(savedSettings);
                setIsSoundEnabled(sound ?? true); 
                setIsVibrationEnabled(vibe ?? true);
            }
        } catch (e) {}
    };

    const saveData = async () => {
        try {
            await AsyncStorage.setItem('tasbeeh_count', count.toString());
            await AsyncStorage.setItem('tasbeeh_zikrs', JSON.stringify(zikrs.filter(z => !z.fixed)));
            await AsyncStorage.setItem('tasbeeh_settings', JSON.stringify({ sound: isSoundEnabled, vibe: isVibrationEnabled }));
        } catch (e) {}
    };

    async function loadSound() {
        try {
            const { sound } = await Audio.Sound.createAsync(require('../../assets/tasbeeh.mp3'));
            soundRef.current = sound;
        } catch (e) {}
    }

    useEffect(() => {
        const percentage = target === 0 ? 0 : count / target;
        progress.value = withSpring(percentage, { damping: 15, stiffness: 120 });
        if (target > 0 && count >= target && !isComplete) {
            setIsComplete(true);
            toastY.value = withSpring(60);
            if (isVibrationEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        saveData();
    }, [count, target, isSoundEnabled, isVibrationEnabled]);

    const handlePress = () => {
        if (target > 0 && count >= target) return;
        setCount(prev => prev + 1);
        
        if (isVibrationEnabled) Haptics.selectionAsync();
        if (isSoundEnabled && soundRef.current) {
            soundRef.current.replayAsync();
        }

        buttonTranslateY.value = withSequence(
            withTiming(12, { duration: 60 }),
            withSpring(0, { damping: 10, stiffness: 200 })
        );
    };

    const handleReset = () => {
        setCount(0); setIsComplete(false);
        toastY.value = withSpring(-150);
        progress.value = withTiming(0);
    };

    const animatedCircleProps = useAnimatedProps(() => ({ strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value) }));
    const animatedButtonStyle = useAnimatedStyle(() => ({ transform: [{ translateY: buttonTranslateY.value }] }));
    const animatedToastStyle = useAnimatedStyle(() => ({ transform: [{ translateY: toastY.value }] }));

    const currentZikr = zikrs[currentIndex] || INITIAL_ZIKRS[0];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <Animated.View style={[styles.toast, animatedToastStyle]}>
                <Text style={styles.toastText}>Goal Completed! Alhamdulillah</Text>
                <TouchableOpacity onPress={handleReset} style={styles.resetBtnToast}><RotateCcw size={14} color="black" /></TouchableOpacity>
            </Animated.View>

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

            <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setShowListModal(true)}>
                <Text style={styles.dropdownLabel}>CURRENT DHIKR</Text>
                <View style={styles.currentZikrRow}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.currentZikrText}>{currentZikr.arabic}</Text>
                        <Text style={styles.currentTranslationText}>{currentZikr.translation}</Text>
                    </View>
                    <ChevronDown size={18} color="#10b981" />
                </View>
            </TouchableOpacity>

            <View style={styles.main}>
                <View style={styles.circleBox}>
                    <Svg width={width} height={260} style={styles.svg}>
                        <Circle cx={width/2} cy={130} r={R} stroke="rgba(255,255,255,0.05)" strokeWidth={3} fill="none" />
                        <AnimatedCircle cx={width/2} cy={130} r={R} stroke="#10b981" strokeWidth={5} strokeDasharray={CIRCLE_LENGTH} animatedProps={animatedCircleProps} strokeLinecap="round" fill="none" />
                    </Svg>
                    <LinearGradient colors={['#0f2019', '#08120e']} style={styles.lcdPanel}>
                        <Text style={styles.lcdMain}>{count.toString().padStart(5, '0')}</Text>
                        <View style={styles.targetIndicator}><Text style={styles.targetLabelText}>GOAL</Text><Text style={styles.targetValueText}>{target || '∞'}</Text></View>
                    </LinearGradient>
                </View>

                <View style={styles.buttonOuterRing}>
                    <View style={styles.buttonCylinder}>
                        <Animated.View style={[styles.btn3DMain, animatedButtonStyle]}>
                            <TouchableOpacity activeOpacity={1} onPress={handlePress} style={styles.touchable}>
                                <LinearGradient colors={['#34d399', '#10b981', '#064e3b']} style={styles.glassEffect}>
                                    <View style={styles.buttonReflex} /><Text style={styles.tapLabelText}>TAP</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                        {/* FIX: div changed to View */}
                        <View style={styles.buttonDepth} />
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={handleReset} style={styles.bottomReset}><RotateCcw size={22} color="white" /></TouchableOpacity>
                <View style={styles.targetRow}>
                    {[33, 99, 100, 0].map(t => (
                        <TouchableOpacity key={t} onPress={() => {setTarget(t); handleReset();}} style={[styles.tBtn, target === t && styles.tActive]}>
                            <Text style={[styles.tText, target === t && {color: '#10b981'}]}>{t || '∞'}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Modals remain the same */}
            <Modal visible={showSettings} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}><Text style={styles.modalTitle}>Settings</Text><TouchableOpacity onPress={()=>setShowSettings(false)}><X color="white" /></TouchableOpacity></View>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}><Volume2 size={18} color="#10b981"/><Text style={styles.settingText}>Sound Effect</Text></View>
                            <Switch value={isSoundEnabled} onValueChange={setIsSoundEnabled} trackColor={{ false: '#222', true: '#10b981' }} thumbColor="white" />
                        </View>
                        <View style={styles.settingRow}>
                            <View style={styles.settingLeft}><Smartphone size={18} color="#10b981"/><Text style={styles.settingText}>Vibration</Text></View>
                            <Switch value={isVibrationEnabled} onValueChange={setIsVibrationEnabled} trackColor={{ false: '#222', true: '#10b981' }} thumbColor="white" />
                        </View>
                        <TouchableOpacity style={styles.doneBtn} onPress={() => setShowSettings(false)}><Text style={styles.doneTxt}>Close</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={showListModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { maxHeight: '75%' }]}>
                        <View style={styles.modalHeader}><Text style={styles.modalTitle}>Select Zikir</Text><TouchableOpacity onPress={()=>setShowListModal(false)}><X color="white" /></TouchableOpacity></View>
                        <ScrollView showsVerticalScrollIndicator={false}>{zikrs.map((item, index) => (
                            <TouchableOpacity key={item.id} style={[styles.listItem, currentIndex === index && styles.listActiveItem]} onPress={() => { setCurrentIndex(index); setShowListModal(false); handleReset(); }}>
                                <View style={{ flex: 1 }}><Text style={styles.listArabic}>{item.arabic}</Text><Text style={styles.listTranslation}>{item.translation}</Text></View>
                                {!item.fixed && <TouchableOpacity onPress={() => setZikrs(zikrs.filter(z => z.id !== item.id))}><Trash2 size={18} color="#ef4444" /></TouchableOpacity>}
                            </TouchableOpacity>
                        ))}</ScrollView>
                    </View>
                </View>
            </Modal>

            <Modal visible={showAddModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Zikir</Text>
                        <TextInput placeholder="Arabic Text..." placeholderTextColor="#444" style={styles.input} value={newArabic} onChangeText={setNewArabic} />
                        <TextInput placeholder="Translation..." placeholderTextColor="#444" style={styles.input} value={newTranslation} onChangeText={setNewTranslation} />
                        <TouchableOpacity style={styles.doneBtn} onPress={() => { if(newArabic){ setZikrs([...zikrs, {id:Date.now().toString(), arabic:newArabic, translation:newTranslation, fixed:false}]); setShowAddModal(false); setNewArabic(''); setNewTranslation(''); } }}><Text style={styles.doneTxt}>Save</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

// Styles remain exactly as pichle code mein thay
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
    circleBox: { height: 260, justifyContent: 'center', alignItems: 'center' },
    svg: { position: 'absolute' },
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
    tBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: '#0a0a0a' },
    tActive: { borderColor: '#10b981', borderWidth: 1 },
    tText: { color: '#444', fontWeight: 'bold', fontSize: 11 },
    toast: { position: 'absolute', left: 20, right: 20, backgroundColor: '#10b981', padding: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2000 },
    toastText: { fontWeight: 'bold', color: 'black' },
    resetBtnToast: { padding: 5 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#0a0a0a', borderRadius: 25, padding: 20, gap: 10, borderWidth: 1, borderColor: '#181818' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
    modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#111' },
    settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingText: { color: 'white', fontSize: 16 },
    listItem: { flexDirection: 'row', padding: 15, backgroundColor: '#111', borderRadius: 15, marginBottom: 10, alignItems: 'center' },
    listActiveItem: { borderColor: '#10b981', borderWidth: 1 },
    listArabic: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    listTranslation: { color: '#666', fontSize: 11, fontStyle: 'italic' },
    input: { backgroundColor: '#151515', color: 'white', padding: 15, borderRadius: 12, marginBottom: 5 },
    doneBtn: { backgroundColor: '#10b981', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    doneTxt: { fontWeight: 'bold', color: 'black' }
});