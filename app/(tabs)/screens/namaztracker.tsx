import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckCircle2, ChevronDown, Circle, CircleCheck, Clock, Settings2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

type NamazName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

const defaultStatus: Record<NamazName, boolean> = {
  Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false
};

export default function NamazFinalApp() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sect, setSect] = useState<'Hanafi' | 'Jafari'>('Hanafi');
  const [markedDates, setMarkedDates] = useState<any>({});
  const [dayRecords, setDayRecords] = useState<Record<NamazName, boolean>>(defaultStatus);
  const [rangeStats, setRangeStats] = useState({ totalAda: 0, totalQaza: 0 });
  const [prayerTimes, setPrayerTimes] = useState<any>(null);

  // Aaj ki date string format mein
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadStartDate();
  }, []);

  useEffect(() => {
    if (startDate) {
      refreshAllData();
      fetchPrayerTimes();
    }
  }, [selectedDate, sect, startDate]);

  const loadStartDate = async () => {
    const saved = await AsyncStorage.getItem('tracking_start_date');
    if (saved) setStartDate(saved);
  };

  const fetchPrayerTimes = async () => {
    const method = sect === 'Hanafi' ? 1 : 0;
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Karachi&country=Pakistan&method=${method}`);
      const data = await res.json();
      setPrayerTimes(data.data.timings);
    } catch (e) { console.log(e); }
  };

  const refreshAllData = async () => {
    if (!startDate) return;
    let markers: any = {};
    let totalAda = 0;
    let totalDays = 0;
    const start = new Date(startDate);
    const today = new Date();

    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const saved = await AsyncStorage.getItem(`status_${dateStr}`);
      const status = saved ? JSON.parse(saved) : defaultStatus;
      const prayedCount = Object.values(status).filter(Boolean).length;
      totalAda += prayedCount;
      totalDays++;

      markers[dateStr] = {
        customStyles: {
          container: {
            backgroundColor: prayedCount === 5 ? '#10b981' : '#ef4444',
            borderRadius: 8,
            borderWidth: dateStr === selectedDate ? 2 : 0,
            borderColor: '#fff'
          },
          text: { color: 'white', fontWeight: 'bold' }
        }
      };
    }

    const currentSaved = await AsyncStorage.getItem(`status_${selectedDate}`);
    setDayRecords(currentSaved ? JSON.parse(currentSaved) : defaultStatus);
    setMarkedDates(markers);
    setRangeStats({ totalAda, totalQaza: totalDays * 5 - totalAda });
  };

  const toggleNamaz = async (name: NamazName) => {
    if (dayRecords[name]) {
      Alert.alert("Already Prayed", "Yeh namaz pehle hi tick ho chuki hai.");
      return;
    }
    const newStatus = { ...dayRecords, [name]: true };
    setDayRecords(newStatus);
    await AsyncStorage.setItem(`status_${selectedDate}`, JSON.stringify(newStatus));
    refreshAllData();
  };

  const handleReset = () => {
    Alert.alert("Change Start Date", "Kya aap start date badalna chahte hain?", [
      { text: "No" },
      { text: "Yes", onPress: async () => { 
        await AsyncStorage.removeItem('tracking_start_date');
        setStartDate(null); 
      }}
    ]);
  };

  // Setup Screen (Sirf pehli baar dikhegi)
  if (!startDate) {
    return (
      <View style={styles.setup}>
        <Text style={styles.setupTitle}>Start Date Select Karein</Text>
        <Calendar
          maxDate={todayStr} // Future dates hide ho jayengi
          onDayPress={(day) => {
            AsyncStorage.setItem('tracking_start_date', day.dateString);
            setStartDate(day.dateString);
          }}
          theme={{ calendarBackground: '#000', dayTextColor: '#fff', todayTextColor: '#10b981', textDisabledColor: '#222' }}
        />
      </View>
    );
  }

  const isComplete = Object.values(dayRecords).every(Boolean);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.locLabel}>Karachi</Text>
          <View style={styles.rangeRow}>
            <Text style={styles.rangeText}>START: {startDate} ➔ TODAY</Text>
            <ChevronDown size={14} color="#ef4444" style={{ marginLeft: 5 }} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSect(sect === 'Hanafi' ? 'Jafari' : 'Hanafi')} style={styles.sectBtn}>
          <Settings2 size={14} color="#10b981" />
          <Text style={styles.sectBtnText}>{sect}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: '#10b981' }]}>{rangeStats.totalAda}</Text>
          <Text style={styles.statLabel}>TOTAL ADA</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: '#ef4444' }]}>{rangeStats.totalQaza}</Text>
          <Text style={styles.statLabel}>TOTAL QAZA</Text>
        </View>
      </View>

      {/* Main Calendar */}
      <Calendar
        markingType="custom"
        markedDates={markedDates}
        maxDate={todayStr} // Aaj se agay ki dates disable hain
        onDayPress={(day) => {
          if (day.dateString <= todayStr) {
            setSelectedDate(day.dateString);
          }
        }}
        theme={{ 
          calendarBackground: '#000', 
          dayTextColor: '#fff', 
          monthTextColor: '#10b981', 
          todayTextColor: '#10b981',
          textDisabledColor: '#222' 
        }}
      />

      {/* Namaz Details Table */}
      <View style={styles.detailContainer}>
        <Text style={styles.detailHeader}>{sect} Times - {selectedDate}</Text>
        
        {selectedDate > todayStr ? (
          <View style={styles.congratulationBox}>
            <Text style={{ color: '#666', textAlign: 'center' }}>Future date record not available.</Text>
          </View>
        ) : isComplete ? (
          <View style={styles.congratulationBox}>
            <CircleCheck size={50} color="#10b981" />
            <Text style={styles.arabicText}>مَاشَاءَ ٱللَّٰهُ</Text>
            <Text style={styles.congratText}>All prayers completed!</Text>
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
  locLabel: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  rangeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  rangeText: { color: '#ef4444', fontSize: 11, fontWeight: 'bold' },
  sectBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 12, borderRadius: 12, height: 40 },
  sectBtnText: { color: '#10b981', marginLeft: 6, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statCard: { flex: 1, backgroundColor: '#080808', padding: 15, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: '#111' },
  statNum: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: '#444', fontSize: 10, fontWeight: 'bold', marginTop: 5 },
  detailContainer: { marginTop: 25, padding: 20, backgroundColor: '#050505', borderRadius: 25 },
  detailHeader: { color: '#10b981', fontSize: 13, fontWeight: 'bold', marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#111' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  nameText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  timeText: { color: '#666', fontSize: 13, marginTop: 4 },
  congratulationBox: { alignItems: 'center', paddingVertical: 50 },
  arabicText: { color: '#10b981', fontSize: 35, marginVertical: 15 },
  congratText: { color: '#fff', textAlign: 'center' }
});