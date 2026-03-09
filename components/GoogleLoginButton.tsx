import { LogIn } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export const GoogleLoginButton = ({ onFinished }: { onFinished: () => void }) => {
  const { promptAsync, loading, request } = useGoogleAuth(onFinished);

  if (loading) return <ActivityIndicator color="#10b981" />;

  return (
    <TouchableOpacity 
      style={styles.btn} 
      onPress={() => promptAsync()} 
      disabled={!request}
    >
      <LogIn size={22} color="#10b981" />
      <Text style={styles.text}>Login with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, gap: 15 },
  text: { color: '#eee', fontSize: 15, fontWeight: '500' }
});