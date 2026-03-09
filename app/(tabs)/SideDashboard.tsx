import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  CheckCircle2,
  CloudOff,
  LayoutDashboard, LogOut, Mail, Palette,
  ShieldCheck, User, X
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';
import { GoogleLoginButton } from '../../components/GoogleLoginButton';

const { width } = Dimensions.get('window');

// ✨ Yeh interface missing tha, isliye error aa raha tha
interface SideDashboardProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideDashboard({ visible, onClose }: SideDashboardProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Logged Out", "Account sign out ho gaya.");
    } catch (error) {
      Alert.alert("Error", "Logout failed.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          
          {/* --- Profile Section --- */}
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
              ) : (
                <User size={40} color="#10b981" />
              )}
            </View>
            <Text style={styles.username}>{user ? user.displayName : "Guest User"}</Text>
            
            {!user ? (
              <View style={styles.syncBoxWarning}>
                <CloudOff size={14} color="#ff9900" />
                <Text style={styles.syncTextWarning}>Not Synced. Login to save data.</Text>
              </View>
            ) : (
              <View style={styles.syncBoxSuccess}>
                <CheckCircle2 size={14} color="#10b981" />
                <Text style={styles.syncTextSuccess}>Data Synced to Cloud</Text>
              </View>
            )}

            <View style={styles.statusRow}>
               <View style={[styles.dot, { backgroundColor: user ? '#10b981' : '#ef4444' }]} />
               <Text style={styles.statusText}>{user ? "Online Mode" : "Offline Mode"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* --- Login / Logout Logic --- */}
          {!user ? (
            <View>
              {/* Ab humne Google Login Button ko component mein move kar diya hai */}
              <GoogleLoginButton onFinished={onClose} />
              <Text style={styles.trustMessage}>
                🔒 Login to keep your Tasbeeh & Prayer records safe.
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <LogOut size={22} color="#ef4444" />
              <Text style={[styles.menuText, { color: '#ef4444' }]}>Logout Account</Text>
            </TouchableOpacity>
          )}

          {/* --- Other Menu Items --- */}
          <TouchableOpacity style={styles.menuItem}><Mail size={22} color="#10b981" /><Text style={styles.menuText}>Login with Email</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}><ShieldCheck size={22} color="#10b981" /><Text style={styles.menuText}>Become a Member (Imam)</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}><Palette size={22} color="#10b981" /><Text style={styles.menuText}>Neon Theme Settings</Text></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}><LayoutDashboard size={22} color="#10b981" /><Text style={styles.menuText}>Tasbeeh Dashboard</Text></TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={24} color="#ef4444" />
            <Text style={styles.closeBtnText}>Close Menu</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.outsideArea} activeOpacity={1} onPress={onClose} />
      </View>
    </Modal>
  );
}

// --- Styles Same Rahenge ---
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', flexDirection: 'row' },
  sidebar: { width: width * 0.78, backgroundColor: '#050505', height: '100%', padding: 25, borderRightWidth: 1.5, borderColor: '#10b981', paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  outsideArea: { flex: 1 },
  profileSection: { alignItems: 'center', marginBottom: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#10b981', overflow: 'hidden' },
  profilePic: { width: '100%', height: '100%' },
  username: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  syncBoxWarning: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255, 153, 0, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 8, borderWidth: 0.5, borderColor: '#ff9900' },
  syncTextWarning: { color: '#ff9900', fontSize: 10, fontWeight: '600' },
  syncBoxSuccess: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  syncTextSuccess: { color: '#10b981', fontSize: 10, fontWeight: '600' },
  trustMessage: { color: '#666', fontSize: 10, textAlign: 'center', marginTop: 5, marginBottom: 10, paddingHorizontal: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#10b981' },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, gap: 15, borderBottomWidth: 0.5, borderBottomColor: '#111' },
  menuText: { color: '#eee', fontSize: 15, fontWeight: '500' },
  closeBtn: { marginTop: 'auto', marginBottom: 40, flexDirection: 'row', alignItems: 'center', gap: 10 },
  closeBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 }
});