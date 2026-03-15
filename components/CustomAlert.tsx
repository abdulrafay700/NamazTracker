import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'LOGIN' | 'LOGOUT' | string; // ✨ Type add kiya taake button change ho sakay
}

export const CustomAlert = ({ visible, title, message, onClose, type }: CustomAlertProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>
              {/* ✨ Dynamic Button Text Logic */}
              {type === 'LOGIN' ? 'Marhaban' : 'Ila-Liqa'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  alertBox: { 
    width: Dimensions.get('window').width * 0.85, 
    backgroundColor: '#1c1c1e', 
    borderRadius: 24, 
    padding: 30, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  title: { fontSize: 28, color: '#10b981', fontWeight: 'bold', marginBottom: 12 },
  message: { fontSize: 16, color: '#ccc', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  button: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 15, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});