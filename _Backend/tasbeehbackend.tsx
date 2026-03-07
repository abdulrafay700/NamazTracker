import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

// 1. Har Tap par Data Save/Sync karne ka function
export const syncZikrToCloud = async (zikrId: string, count: number, arabic: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const docRef = doc(db, "users", user.uid, "tasbeeh", zikrId);
        await setDoc(docRef, {
            count: count,
            arabic: arabic,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
    } catch (error) {
        console.error("Sync Error:", error);
    }
};

// 2. Real-time Listener (Dusri window mein data update karne ke liye)
export const listenToZikrChanges = (zikrId: string, callback: (count: number) => void) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const docRef = doc(db, "users", user.uid, "tasbeeh", zikrId);
    
    // Yeh function database mein hone wali har tabdeeli ko foran pakarta hai
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            callback(data.count || 0);
        }
    });
};