// import React, { useState } from 'react';
// import { 
//   View, Text, StyleSheet, Modal, TextInput, 
//   TouchableOpacity, FlatList, SafeAreaView 
// } from 'react-native';
// import { X, Plus, Trash2, BookOpen } from 'lucide-react-native';

// interface Zikr {
//   id: string;
//   arabic: string;
//   transliteration: string;
// }

// interface Props {
//   visible: boolean;
//   onClose: () => void;
//   zikrs: Zikr[];
//   onAdd: (arabic: string, translit: string) => void;
//   onDelete: (id: string) => void;
// }

// export default function ZikrManager({ visible, onClose, zikrs, onAdd, onDelete }: Props) {
//   const [newArabic, setNewArabic] = useState('');
//   const [newTranslit, setNewTranslit] = useState('');

//   const handleAdd = () => {
//     if (newArabic && newTranslit) {
//       onAdd(newArabic, newTranslit);
//       setNewArabic('');
//       setNewTranslit('');
//     }
//   };

//   return (
//     <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
//       <SafeAreaView style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Manage Zikr List</Text>
//           <TouchableOpacity onPress={onClose}>
//             <X color="white" size={24} />
//           </TouchableOpacity>
//         </View>

//         {/* Input Form */}
//         <View style={styles.form}>
//           <TextInput 
//             placeholder="Arabic Text..." 
//             placeholderTextColor="#666"
//             style={styles.input}
//             value={newArabic}
//             onChangeText={setNewArabic}
//           />
//           <TextInput 
//             placeholder="Transliteration..." 
//             placeholderTextColor="#666"
//             style={styles.input}
//             value={newTranslit}
//             onChangeText={setNewTranslit}
//           />
//           <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
//             <Plus size={20} color="black" />
//             <Text style={styles.addBtnText}>Add to My List</Text>
//           </TouchableOpacity>
//         </View>

//         {/* List */}
//         <FlatList 
//           data={zikrs}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ padding: 20 }}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.cardArabic}>{item.arabic}</Text>
//                 <Text style={styles.cardTranslit}>{item.transliteration}</Text>
//               </View>
//               <TouchableOpacity onPress={() => onDelete(item.id)}>
//                 <Trash2 size={20} color="#ef4444" />
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       </SafeAreaView>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#050505' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#111' },
//   title: { color: 'white', fontSize: 20, fontWeight: 'bold' },
//   form: { padding: 20, gap: 10, backgroundColor: '#0a0a0a' },
//   input: { backgroundColor: '#151515', color: 'white', padding: 15, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#222' },
//   addBtn: { backgroundColor: '#10b981', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 12, gap: 8, marginTop: 5 },
//   addBtnText: { fontWeight: 'bold', color: 'black' },
//   card: { flexDirection: 'row', backgroundColor: '#111', padding: 18, borderRadius: 15, marginBottom: 12, alignItems: 'center', borderLeftWidth: 3, borderLeftColor: '#10b981' },
//   cardArabic: { color: 'white', fontSize: 20, fontWeight: 'bold' },
//   cardTranslit: { color: '#10b981', fontSize: 13, marginTop: 4 }
// });





// /////============================ now with database=====================================
import { doc, setDoc } from 'firebase/firestore';
import { Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { syncZikrToCloud } from '../../_Backend/tasbeehbackend';
import { auth, db } from '../../firebaseConfig';

interface Zikr {
  id: string;
  arabic: string;
  translation?: string;
  transliteration?: string;
  fixed?: boolean;
}

interface ZikrManagerProps {
  visible: boolean;
  onClose: () => void;
  zikrs: Zikr[];
  onAdd: (arabic: string, translit: string) => void;
  onDelete: (id: string) => void;
}

export default function ZikrManager({ visible, onClose, zikrs, onAdd, onDelete }: ZikrManagerProps) {
  const [newArabic, setNewArabic] = useState('');
  const [newTranslit, setNewTranslit] = useState('');

  const handleAdd = async () => {
    if (newArabic) {
      const tempId = Date.now().toString();
      onAdd(newArabic, newTranslit); 

      if (auth.currentUser) {
        try {
          await syncZikrToCloud(tempId, 0, newArabic); 
          await setDoc(doc(db, 'users', auth.currentUser.uid, 'zikrs', tempId), {
            arabic: newArabic,
            transliteration: newTranslit || "",
            id: tempId,
            fixed: false
          });
        } catch (e) { console.log("Cloud Add Error", e); }
      }
      setNewArabic(''); setNewTranslit('');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.centeredView}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Manage Your Zikr</Text>
              <TouchableOpacity onPress={onClose}><X color="white" size={24} /></TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <TextInput 
                placeholder="Arabic Text (Required)" 
                placeholderTextColor="#666" 
                style={styles.input} 
                value={newArabic} 
                onChangeText={setNewArabic} 
              />
              <TextInput 
                placeholder="Translation (Optional)" 
                placeholderTextColor="#666" 
                style={styles.input} 
                value={newTranslit} 
                onChangeText={setNewTranslit} 
              />
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Plus size={20} color="black" />
                <Text style={styles.addBtnText}>Add to List</Text>
              </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList 
              data={zikrs}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 300 }} // List ki height limit taake modal screen se bahar na jaye
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardArabic}>{item.arabic}</Text>
                    <Text style={styles.cardTranslit}>{item.translation || item.transliteration || ""}</Text>
                  </View>
                  <TouchableOpacity onPress={() => onDelete(item.id)}>
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)', // Background thora dark aur blurred effect ke liye
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        width: '90%',
        maxWidth: 400,
    },
    modalContent: {
        backgroundColor: '#0a0a0a',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#1a1a1a',
        overflow: 'hidden',
        paddingBottom: 20,
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 20, 
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a'
    },
    title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    form: { padding: 20, gap: 10 },
    input: { 
        backgroundColor: '#151515', 
        color: 'white', 
        padding: 15, 
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#222'
    },
    addBtn: { 
        backgroundColor: '#10b981', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        padding: 15, 
        borderRadius: 12, 
        gap: 8,
        marginTop: 5
    },
    addBtnText: { fontWeight: 'bold', color: 'black' },
    card: { 
        flexDirection: 'row', 
        backgroundColor: '#111', 
        padding: 15, 
        borderRadius: 15, 
        marginHorizontal: 20, 
        marginBottom: 10, 
        alignItems: 'center',
        borderLeftWidth: 3,
        borderLeftColor: '#10b981'
    },
    cardArabic: { color: 'white', fontSize: 18, fontWeight: '600' },
    cardTranslit: { color: '#10b981', fontSize: 11, marginTop: 2 }
});