
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircle2, Circle, CircleCheck, Clock, MapPin, Settings2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

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
  
  // Custom Alert & Animation State
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<Record<NamazName, boolean> | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => { loadStartDate(); }, []);
  useEffect(() => { if (startDate) { refreshAllData(); fetchPrayerTimes(); } }, [selectedDate, sect, startDate]);

  // Modal Animation Logic
  useEffect(() => {
    if (showConfirm) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true })
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
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
            backgroundColor: prayedCount === 5 ? '#10b981' : prayedCount > 0 ? '#f59e0b' : '#ef4444', 
            borderRadius: 8, 
            borderWidth: dateStr === selectedDate ? 2 : 0, 
            borderColor: '#fff' 
          },
          text: { color: 'white', fontWeight: 'bold' },
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
    if (selectedDate > todayStr) return;
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
      <Text style={styles.setupTitle}>Select Start Date</Text>
      <Calendar maxDate={todayStr} onDayPress={(day) => { AsyncStorage.setItem('tracking_start_date', day.dateString); setStartDate(day.dateString); }} theme={{ calendarBackground: '#000', dayTextColor: '#fff', todayTextColor: '#10b981' }} />
    </View>
  );

  const isAllDone = Object.values(dayRecords).every(Boolean);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Animated Custom Alert Modal */}
      <Modal visible={showConfirm} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.sweetAlert, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <CircleCheck size={55} color="#10b981" />
            <Text style={styles.alertTitle}>MASHALLAH!</Text>
            <Text style={styles.alertMsg}>Have you completed all your prayers for today?</Text>
            <View style={styles.alertButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnNo]} onPress={() => setShowConfirm(false)}>
                <Text style={styles.btnTextNo}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnYes]} onPress={() => pendingStatus && finalizeSave(pendingStatus)}>
                <Text style={styles.btnTextYes}>Yes, Confirmed</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MapPin size={24} color="#10b981" />
            <Text style={styles.locLabel}>Karachi</Text>
          </View>
          <Text style={styles.rangeText}>STARTED: {startDate}</Text>
        </View>
        <TouchableOpacity onPress={() => setSect(sect === 'Hanafi' ? 'Jafari' : 'Hanafi')} style={styles.sectBtn}>
          <Settings2 size={14} color="#10b981" />
          <Text style={styles.sectBtnText}>{sect}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}><Text style={[styles.statNum, { color: '#10b981' }]}>{rangeStats.totalAda}</Text><Text style={styles.statLabel}>COMPLETED</Text></View>
        <View style={styles.statCard}><Text style={[styles.statNum, { color: '#ef4444' }]}>{rangeStats.totalQaza}</Text><Text style={styles.statLabel}>MISSED</Text></View>
      </View>

      <Calendar markingType="custom" markedDates={markedDates} maxDate={todayStr} onDayPress={(day) => setSelectedDate(day.dateString)} theme={{ calendarBackground: '#000', dayTextColor: '#fff', monthTextColor: '#10b981', todayTextColor: '#10b981' }} />

      <View style={styles.detailContainer}>
        <Text style={styles.detailHeader}>{sect} Times - {selectedDate}</Text>
        
        {isAllDone ? (
          <View style={styles.congratulationBox}>
            <CircleCheck size={60} color="#10b981" />
            <Text style={styles.arabicText}>مَاشَاءَ ٱللَّٰهُ</Text>
            <Text style={styles.congratText}>All prayers completed for today!</Text>
            <TouchableOpacity style={styles.undoBtn} onPress={() => finalizeSave({...dayRecords, Isha: false})}>
              <Text style={styles.undoBtnText}>Edit Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          (Object.keys(defaultStatus) as NamazName[]).map((name) => (
            <TouchableOpacity key={name} style={styles.detailRow} onPress={() => toggleNamaz(name)}>
              <View style={styles.rowLeft}>
                <Clock size={20} color={dayRecords[name] ? "#10b981" : "#444"} />
                <View style={{ marginLeft: 15 }}>
                  <Text style={styles.nameText}>{name}</Text>
                  <Text style={styles.timeText}>Azan: {prayerTimes?.[name] || '--:--'}</Text>
                </View>
              </View>
              {dayRecords[name] ? <CheckCircle2 color="#10b981" size={30} /> : <Circle color="#222" size={30} />}
            </TouchableOpacity>
          ))
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 15 },
  setup: { flex: 1, backgroundColor: '#000', justifyContent: 'center', padding: 25 },
  setupTitle: { color: '#10b981', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginBottom: 25 },
  locLabel: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  rangeText: { color: '#666', fontSize: 11, marginTop: 4 },
  sectBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 12, borderRadius: 12, height: 40 },
  sectBtnText: { color: '#10b981', marginLeft: 6, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statCard: { flex: 1, backgroundColor: '#080808', padding: 15, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: '#111' },
  statNum: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#444', fontSize: 10, fontWeight: 'bold', marginTop: 5 },
  detailContainer: { marginTop: 25, padding: 20, backgroundColor: '#050505', borderRadius: 25, minHeight: 350 },
  detailHeader: { color: '#10b981', fontSize: 13, fontWeight: 'bold', marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#111' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  nameText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  timeText: { color: '#666', fontSize: 13, marginTop: 4 },
  congratulationBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  arabicText: { color: '#10b981', fontSize: 35, fontWeight: 'bold', marginVertical: 15 },
  congratText: { color: '#fff', fontSize: 16, marginBottom: 25 },
  undoBtn: { backgroundColor: '#111', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  undoBtnText: { color: '#10b981', fontWeight: 'bold', fontSize: 12 },
  
  // Custom Animated Alert Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  sweetAlert: { width: '85%', backgroundColor: '#0a0a0a', borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: '#222', shadowColor: '#10b981', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20 },
  alertTitle: { color: '#10b981', fontSize: 24, fontWeight: 'bold', marginTop: 20, letterSpacing: 1 },
  alertMsg: { color: '#999', textAlign: 'center', marginTop: 12, fontSize: 15, lineHeight: 22 },
  alertButtons: { flexDirection: 'row', marginTop: 35, width: '100%', gap: 12 },
  btn: { flex: 1, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  btnNo: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333' },
  btnYes: { backgroundColor: '#10b981' },
  btnTextNo: { color: '#888', fontWeight: 'bold', fontSize: 14 },
  btnTextYes: { color: '#000', fontWeight: 'bold', fontSize: 14 },
});