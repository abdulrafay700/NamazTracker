////////////////// ========================== perfect working for web================================


// import { LogIn } from 'lucide-react-native';
// import React from 'react';
// import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { useGoogleAuth } from '../hooks/useGoogleAuth';

// export const GoogleLoginButton = ({ onFinished }: { onFinished: () => void }) => {
//   const { promptAsync, loading, request } = useGoogleAuth(onFinished);

//   if (loading) return <ActivityIndicator color="#10b981" />;

//   return (
//     <TouchableOpacity 
//       style={styles.btn} 
//       onPress={() => promptAsync()} 
//       disabled={!request}
//     >
//       <LogIn size={22} color="#10b981" />
//       <Text style={styles.text}>Login with Google</Text>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   btn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, gap: 15 },
//   text: { color: '#eee', fontSize: 15, fontWeight: '500' }
// });












































// /////======================== for native mobile code==============////
import { LogIn, LogOut } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useGoogleNativeAuth } from '../hooks/useGoogleAuth';
import { CustomAlert } from './CustomAlert';

interface GoogleLoginButtonProps {
  onFinished: () => void;
}

export const GoogleLoginButton = ({ onFinished }: GoogleLoginButtonProps) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [user, setUser] = useState<any>(auth.currentUser);

  // Sync user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  const { signIn, logout, showAlert, setShowAlert, alertData } = useGoogleNativeAuth();

  const handlePress = async () => {
    setLocalLoading(true);
    try {
      if (user) {
        await logout(() => {
            // Logout ke baad dashboard close kar dein
            onFinished();
        });
      } else {
        await signIn(() => {
            // Login ke baad dashboard close kar dein
            onFinished();
        });
      }
    } finally {
      setLocalLoading(false);
    }
  };

  if (localLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#10b981" size="small" />
      </View>
    );
  }

  return (
    <View>
      <TouchableOpacity 
        style={styles.btn} 
        onPress={handlePress}
        disabled={localLoading}
      >
        {user ? (
          <>
            <LogOut size={22} color="#ef4444" />
            <Text style={[styles.text, { color: '#ef4444' }]}>Sign Out Account</Text>
          </>
        ) : (
          <>
            <LogIn size={22} color="#10b981" />
            <Text style={styles.text}>Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

    <CustomAlert 
      visible={showAlert}
      title={alertData.title}
      message={alertData.message}
      type={alertData.actionType} // ✨ Ye bata raha hai ke button par kya likhna hai
      onClose={() => {
        setShowAlert(false);
        onFinished();
      }}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  btn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 18, 
    paddingHorizontal: 20,
    gap: 15,
    borderRadius: 12,
  },
  text: { 
    color: '#eee', 
    fontSize: 15, 
    fontWeight: '600',
  },
  loaderContainer: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center'
  }
});