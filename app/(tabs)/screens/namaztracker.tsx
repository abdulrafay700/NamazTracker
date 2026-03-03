import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircle2, Circle, CircleCheck, Clock, MapPin, Settings2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const { width } = Dimensions.get('window');

type NamazName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

const defaultStatus: Record<NamazName, boolean> = {
  Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false,
};

export default function NamazFinalApp() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sect, setSect] = useState<'Hanafi' | 'Jafari'>('Hanafi');
  const [markedDates, setMarkedDates] = useState<any>({});
  const [dayRecords, setDayRecords] = useState<Record<NamazName, boolean>>(defaultStatus);
  const [rangeStats, setRangeStats] = useState({ totalAda: 0, totalQaza: 0 });
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Record<NamazName, boolean> | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.85));

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => { loadStartDate(); }, []);
  useEffect(() => { if (startDate) { refreshAllData(); fetchPrayerTimes(); } }, [selectedDate, sect, startDate]);

  useEffect(() => {
    if (showConfirm) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true })
      ]).start();
    }
  }, [showConfirm]);

  const loadStartDate = async () => {
    const saved = await AsyncStorage.getItem('tracking_start_date');
    if (saved) setStartDate(saved);
  };

  const fetchPrayerTimes = async () => {
    const method = sect === 'Hanafi' ? 1 : 0;
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Karachi&country=Pakistan&method=${method}`);
      const data = await res.json();
      if (data.code === 200) setPrayerTimes(data.data.timings);
    } catch (e) { console.error(e); }
  };

  const refreshAllData = async () => {
    if (!startDate) return;
    const markers: any = {};
    let totalAda = 0, totalDays = 0;
    const start = new Date(startDate), end = new Date(todayStr);

    for (let d = new Date(start); d <= end; d = new Date(d.setDate(d.getDate() + 1))) {
      const dateStr = d.toISOString().split('T')[0];
      const saved = await AsyncStorage.getItem(`status_${dateStr}`);
      const status = saved ? JSON.parse(saved) : { ...defaultStatus };
      const prayedCount = Object.values(status).filter(Boolean).length;
      totalAda += prayedCount; totalDays++;
      
      markers[dateStr] = {
        customStyles: {
          container: { 
            backgroundColor: prayedCount === 5 ? '#059669' : prayedCount > 0 ? '#d97706' : '#dc2626', 
            borderRadius: 8, // <--- Date Box Shape (Boxy Look)
            borderWidth: dateStr === selectedDate ? 2 : 0,
            borderColor: '#fff',
            elevation: 4,
            shadowColor: '#fff',
            shadowOpacity: 0.1
          },
          text: { color: '#fff', fontWeight: 'bold' },
        },
      };
    }
    const currentSaved = await AsyncStorage.getItem(`status_${selectedDate}`);
    setDayRecords(currentSaved ? JSON.parse(currentSaved) : { ...defaultStatus });
    setMarkedDates(markers);
    setRangeStats({ totalAda, totalQaza: totalDays * 5 - totalAda });
  };

  const finalizeSave = async (statusToSave: Record<NamazName, boolean>) => {
    await AsyncStorage.setItem(`status_${selectedDate}`, JSON.stringify(statusToSave));
    setDayRecords(statusToSave);
    setShowConfirm(false);
    refreshAllData();
  };

  const toggleNamaz = async (name: NamazName) => {
    const isChecking = !dayRecords[name];
    const newStatus = { ...dayRecords, [name]: isChecking };
    if (isChecking && Object.values(newStatus).every(Boolean)) {
      setPendingStatus(newStatus);
      setShowConfirm(true);
    } else {
      await finalizeSave(newStatus);
    }
  };

  if (!startDate) return (
    <View style={styles.setup}>
      <Text style={styles.setupTitle}>Prayer Tracker</Text>
      <Text style={styles.setupSub}>Set your journey start date</Text>
      <Calendar 
        maxDate={todayStr} 
        onDayPress={(day) => { AsyncStorage.setItem('tracking_start_date', day.dateString); setStartDate(day.dateString); }} 
        theme={{ calendarBackground: '#000', dayTextColor: '#fff', todayTextColor: '#10b981' }} 
      />
    </View>
  );

  const isAllDone = Object.values(dayRecords).every(Boolean);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* GLASSY ANIMATED MODAL */}
      <Modal visible={showConfirm} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.sweetAlert, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.iconCircle}>
              <CircleCheck size={40} color="#10b981" />
            </View>
            <Text style={styles.alertTitle}>MASHALLAH!</Text>
            <Text style={styles.alertMsg}>Daily goal reached! Have you completed all 5 prayers?</Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={() => setShowConfirm(false)}>
                <Text style={styles.btnTextNo}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnYes]} onPress={() => pendingStatus && finalizeSave(pendingStatus)}>
                <Text style={styles.btnTextYes}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <MapPin size={18} color="#10b981" />
            <Text style={styles.locLabel}>Karachi, PK</Text>
          </View>
          <Text style={styles.rangeText}>LOGGING SINCE: {startDate}</Text>
        </View>
        <TouchableOpacity onPress={() => setSect(sect === 'Hanafi' ? 'Jafari' : 'Hanafi')} style={styles.sectBtn}>
          <Text style={styles.sectBtnText}>{sect}</Text>
          <Settings2 size={14} color="#10b981" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: '#10b981' }]}>{rangeStats.totalAda}</Text>
          <Text style={styles.statLabel}>COMPLETED</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: '#ef4444' }]}>{rangeStats.totalQaza}</Text>
          <Text style={styles.statLabel}>MISSED</Text>
        </View>
      </View>

      {/* CALENDAR WITH GLASS BORDER & FUTURE DATES BLOCKED */}
      <View style={styles.calendarCard}>
        <Calendar 
          markingType="custom" 
          markedDates={markedDates} 
          maxDate={todayStr} 
          disableAllTouchEventsForDisabledDays={true} 
          onDayPress={(day) => setSelectedDate(day.dateString)} 
          theme={{ 
            calendarBackground: 'transparent', 
            dayTextColor: '#fff', 
            monthTextColor: '#10b981', 
            todayTextColor: '#10b981',
            textDisabledColor: '#1a1a1a', 
            arrowColor: '#10b981',
            textDayFontWeight: 'bold',
          }} 
        />
      </View>

      <View style={styles.detailContainer}>
        <View style={styles.detailHeaderRow}>
          <Text style={styles.detailHeader}>Prayer Schedule</Text>
          <Text style={styles.dateLabel}>{selectedDate}</Text>
        </View>
        
        {isAllDone ? (
          <View style={styles.congratulationBox}>
            <Text style={styles.arabicText}>مَاشَاءَ ٱللَّٰهُ</Text>
            <Text style={styles.congratText}>All prayers completed for today!</Text>
            <TouchableOpacity style={styles.undoBtn} onPress={() => finalizeSave({...dayRecords, Isha: false})}>
              <Text style={styles.undoBtnText}>Update Log</Text>
            </TouchableOpacity>
          </View>
        ) : (
          (Object.keys(defaultStatus) as NamazName[]).map((name) => (
            <TouchableOpacity key={name} style={styles.detailRow} onPress={() => toggleNamaz(name)}>
              <View style={styles.rowLeft}>
                <View style={[styles.timeIcon, { backgroundColor: dayRecords[name] ? '#064e3b' : '#111' }]}>
                  <Clock size={18} color={dayRecords[name] ? "#10b981" : "#444"} />
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Text style={styles.nameText}>{name}</Text>
                  <Text style={styles.timeText}>Athan: {prayerTimes?.[name] || '--:--'}</Text>
                </View>
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
  setupTitle: { color: '#10b981', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  setupSub: { color: '#444', textAlign: 'center', marginBottom: 20, marginTop: 5 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 45, marginBottom: 25, alignItems: 'center' },
  locLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  rangeText: { color: '#444', fontSize: 9, marginTop: 4, fontWeight: 'bold' },
  sectBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0a0a0a', paddingHorizontal: 12, borderRadius: 12, height: 35, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 6 },
  sectBtnText: { color: '#10b981', fontWeight: 'bold', fontSize: 11 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#0a0a0a', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statNum: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#555', fontSize: 8, fontWeight: 'bold', marginTop: 5 },
  calendarCard: { backgroundColor: '#050505', borderRadius: 25, padding: 10, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  detailContainer: { padding: 20, backgroundColor: '#050505', borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', minHeight: 350 },
  detailHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  detailHeader: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  dateLabel: { color: '#10b981', fontSize: 10, fontWeight: 'bold' },
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
  sweetAlert: { width: width * 0.8, backgroundColor: '#0a0a0a', borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#064e3b', justifyContent: 'center', alignItems: 'center' },
  alertTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 15 },
  alertMsg: { color: '#666', textAlign: 'center', marginTop: 10, fontSize: 14 },
  alertButtons: { flexDirection: 'row', marginTop: 30, width: '100%', gap: 12 },
  btn: { flex: 1, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  btnNo: { backgroundColor: '#1a1a1a' },
  btnYes: { backgroundColor: '#10b981' },
  btnTextNo: { color: '#666', fontWeight: 'bold' },
  btnTextYes: { color: '#000', fontWeight: 'bold' },
});