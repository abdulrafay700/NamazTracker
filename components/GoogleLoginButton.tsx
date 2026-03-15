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

  import { LogIn } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// ✨ Naya hook name import karein
import { useGoogleNativeAuth } from '../hooks/useGoogleAuth';

interface GoogleLoginButtonProps {
  onFinished: () => void;
}

export const GoogleLoginButton = ({ onFinished }: GoogleLoginButtonProps) => {
  const [localLoading, setLocalLoading] = useState(false);
  
  // ✨ useGoogleNativeAuth use karein jo humne abhi banaya hai
  const { signIn } = useGoogleNativeAuth(onFinished);

  const handlePress = async () => {
    setLocalLoading(true);
    try {
      await signIn();
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
    <TouchableOpacity 
      style={styles.btn} 
      onPress={handlePress}
      disabled={localLoading}
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
    backgroundColor: 'transparent'
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