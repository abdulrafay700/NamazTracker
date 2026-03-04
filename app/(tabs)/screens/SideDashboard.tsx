


// -------------------working code--------------------------------------------------------------


// import * as Google from 'expo-auth-session/providers/google';
// import * as WebBrowser from 'expo-web-browser';
// import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
// import { LayoutDashboard, LogIn, LogOut, Mail, Palette, ShieldCheck, User, X } from 'lucide-react-native';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Alert, Dimensions, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// // Yahan check kar lein ke path sahi hai (3 steps back if in app/(tabs)/screens/)
// import { auth } from '../../../firebaseConfig';

// const { width } = Dimensions.get('window');

// // Browser session complete karne ke liye
// WebBrowser.maybeCompleteAuthSession();

// interface SideDashboardProps {
//   visible: boolean;
//   onClose: () => void;
// }

// export default function SideDashboard({ visible, onClose }: SideDashboardProps) {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   // Google Authentication Setup
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId: "43455085448-mnltjis4q517g1qm0gajimf1i5rtt4jq.apps.googleusercontent.com",
//     webClientId: "43455085448-fd6imojkjtduu7cvbapjd7nce2cetb7b.apps.googleusercontent.com",
//   });

//   // User ka login status track karne ke liye (Persistence ki wajah se auto-login yahan se hota hai)
//   useEffect(() => {
//     if (!auth) return;
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return unsubscribe;
//   }, []);

//   // Google se response aane par login process
//   useEffect(() => {
//     if (response?.type === 'success') {
//       setLoading(true);
//       const { id_token } = response.params;
//       const credential = GoogleAuthProvider.credential(id_token);
//       signInWithCredential(auth, credential)
//         .then(() => {
//           Alert.alert("Mubarak!", "Aap login ho chuke hain.");
//         })
//         .catch((error) => {
//           Alert.alert("Login Error", error.message);
//         })
//         .finally(() => setLoading(false));
//     }
//   }, [response]);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//     } catch (error) {
//       Alert.alert("Logout Error", "Koshish dubara karein.");
//     }
//   };

//   return (
//     <Modal visible={visible} transparent animationType="fade">
//       <View style={styles.overlay}>
//         {/* Sidebar Content */}
//         <View style={styles.sidebar}>
          
//           <View style={styles.profileSection}>
//             <View style={styles.avatar}>
//               {user?.photoURL ? (
//                 <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
//               ) : (
//                 <User size={40} color="#10b981" />
//               )}
//             </View>
//             <Text style={styles.username}>{user ? user.displayName : "Guest User"}</Text>
//             <Text style={styles.userStatus}>{user ? "Online Mode" : "Offline Mode"}</Text>
//           </View>

//           <View style={styles.divider} />

//           {/* Login/Logout Logic */}
//           {loading ? (
//             <ActivityIndicator size="small" color="#10b981" style={{ marginVertical: 20 }} />
//           ) : !user ? (
//             <TouchableOpacity 
//               style={styles.menuItem} 
//               disabled={!request}
//               onPress={() => promptAsync()}
//             >
//               <LogIn size={22} color="#10b981" />
//               <Text style={styles.menuText}>Login with Google</Text>
//               {!request && <ActivityIndicator size="small" color="#10b981" />}
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
//               <LogOut size={22} color="#ef4444" />
//               <Text style={[styles.menuText, { color: '#ef4444' }]}>Logout Account</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity style={styles.menuItem}>
//             <Mail size={22} color="#10b981" />
//             <Text style={styles.menuText}>Login with Email</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <ShieldCheck size={22} color="#10b981" />
//             <Text style={styles.menuText}>Become a Member (Imam)</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <Palette size={22} color="#10b981" />
//             <Text style={styles.menuText}>Neon Theme Settings</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <LayoutDashboard size={22} color="#10b981" />
//             <Text style={styles.menuText}>Tasbeeh Dashboard</Text>
//           </TouchableOpacity>

//           {/* Close Button */}
//           <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
//             <X size={24} color="#ef4444" />
//             <Text style={styles.closeBtnText}>Close Menu</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Outside Area Click to Close */}
//         <TouchableOpacity style={styles.outsideArea} activeOpacity={1} onPress={onClose} />
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', flexDirection: 'row' },
//   sidebar: { 
//     width: width * 0.78, 
//     backgroundColor: '#050505', 
//     height: '100%', 
//     padding: 25, 
//     borderRightWidth: 1.5, 
//     borderColor: '#10b981',
//     paddingTop: Platform.OS === 'ios' ? 60 : 40,
//     shadowColor: '#10b981',
//     shadowOffset: { width: 5, height: 0 },
//     shadowOpacity: 0.3,
//     shadowRadius: 15,
//     elevation: 20,
//   },
//   outsideArea: { flex: 1 },
//   profileSection: { alignItems: 'center', marginBottom: 10 },
//   avatar: { 
//     width: 80, height: 80, borderRadius: 40, 
//     backgroundColor: '#111', justifyContent: 'center', 
//     alignItems: 'center', borderWidth: 2, borderColor: '#10b981',
//     overflow: 'hidden'
//   },
//   profilePic: { width: '100%', height: '100%' },
//   username: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 15 },
//   userStatus: { color: '#10b981', fontSize: 12, marginTop: 5, opacity: 0.7 },
//   divider: { height: 1, backgroundColor: '#222', marginVertical: 20 },
//   menuItem: { 
//     flexDirection: 'row', alignItems: 'center', 
//     paddingVertical: 18, gap: 15, borderBottomWidth: 0.5, borderBottomColor: '#111' 
//   },
//   menuText: { color: '#eee', fontSize: 15, fontWeight: '500' },
//   closeBtn: { marginTop: 'auto', marginBottom: 40, flexDirection: 'row', alignItems: 'center', gap: 10 },
//   closeBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 }
// });




























import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import { LayoutDashboard, LogIn, LogOut, Mail, Palette, ShieldCheck, User, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../../firebaseConfig';

const { width } = Dimensions.get('window');

WebBrowser.maybeCompleteAuthSession();

interface SideDashboardProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideDashboard({ visible, onClose }: SideDashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "43455085448-mnltjis4q517g1qm0gajimf1i5rtt4jq.apps.googleusercontent.com",
    webClientId: "43455085448-fd6imojkjtduu7cvbapjd7nce2cetb7b.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // FIXED GOOGLE LOGIN LOGIC
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      if (!id_token) {
        Alert.alert("Error", "Google ID Token not found. Try again.");
        return;
      }

      setLoading(true);
      const credential = GoogleAuthProvider.credential(id_token);
      
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert("Mubarak!", "Aap login ho chuke hain.");
          onClose(); // Auto close sidebar on success
        })
        .catch((error) => {
          console.error("Firebase Signin Error:", error);
          Alert.alert("Login Error", error.message);
        })
        .finally(() => setLoading(false));
    }
  }, [response]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      Alert.alert("Logged Out", "Aapka account sign out ho gaya hai.");
    } catch (error) {
      Alert.alert("Logout Error", "Koshish dubara karein.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.profilePic} />
              ) : (
                <User size={40} color="#10b981" />
              )}
            </View>
            <Text style={styles.username}>{user ? user.displayName : "Guest User"}</Text>
            <Text style={styles.userStatus}>{user ? "Online Mode" : "Offline Mode"}</Text>
          </View>

          <View style={styles.divider} />

          {loading ? (
            <ActivityIndicator size="large" color="#10b981" style={{ marginVertical: 20 }} />
          ) : (
            <>
              {!user ? (
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => promptAsync()}
                  disabled={!request}
                >
                  <LogIn size={22} color="#10b981" />
                  <Text style={styles.menuText}>Login with Google</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                  <LogOut size={22} color="#ef4444" />
                  <Text style={[styles.menuText, { color: '#ef4444' }]}>Logout Account</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <TouchableOpacity style={styles.menuItem}>
            <Mail size={22} color="#10b981" />
            <Text style={styles.menuText}>Login with Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <ShieldCheck size={22} color="#10b981" />
            <Text style={styles.menuText}>Become a Member (Imam)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Palette size={22} color="#10b981" />
            <Text style={styles.menuText}>Neon Theme Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <LayoutDashboard size={22} color="#10b981" />
            <Text style={styles.menuText}>Tasbeeh Dashboard</Text>
          </TouchableOpacity>

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

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', flexDirection: 'row' },
  sidebar: { 
    width: width * 0.78, 
    backgroundColor: '#050505', 
    height: '100%', 
    padding: 25, 
    borderRightWidth: 1.5, 
    borderColor: '#10b981',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  outsideArea: { flex: 1 },
  profileSection: { alignItems: 'center', marginBottom: 10 },
  avatar: { 
    width: 80, height: 80, borderRadius: 40, 
    backgroundColor: '#111', justifyContent: 'center', 
    alignItems: 'center', borderWidth: 2, borderColor: '#10b981',
    overflow: 'hidden'
  },
  profilePic: { width: '100%', height: '100%' },
  username: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  userStatus: { color: '#10b981', fontSize: 12, marginTop: 5, opacity: 0.7 },
  divider: { height: 1, backgroundColor: '#222', marginVertical: 20 },
  menuItem: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingVertical: 18, gap: 15, borderBottomWidth: 0.5, borderBottomColor: '#111' 
  },
  menuText: { color: '#eee', fontSize: 15, fontWeight: '500' },
  closeBtn: { marginTop: 'auto', marginBottom: 40, flexDirection: 'row', alignItems: 'center', gap: 10 },
  closeBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 }
});