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


//////////////////===============================================================================






import { LogIn } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGoogleAuth } from '../hooks/useGoogleAuth'; // Confirm karein ke path sahi hai

interface GoogleLoginButtonProps {
  onFinished: () => void;
}

export const GoogleLoginButton = ({ onFinished }: GoogleLoginButtonProps) => {
  const { promptAsync, loading, request } = useGoogleAuth(onFinished);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#10b981" size="small" />
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.btn, !request && styles.disabledBtn]} 
      onPress={() => {
        if (request) {
          promptAsync();
        }
      }} 
      disabled={!request || loading}
    >
      <LogIn size={22} color="#10b981" />
      <Text style={styles.text}>Login with Google</Text>
    </TouchableOpacity>
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
    backgroundColor: 'transparent' // Ya jo bhi aapka theme ho
  },
  disabledBtn: {
    opacity: 0.5
  },
  text: { 
    color: '#eee', 
    fontSize: 15, 
    fontWeight: '500' 
  },
  loaderContainer: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center'
  }
});