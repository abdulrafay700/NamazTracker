import { Stack } from 'expo-router';
import { LocationProvider } from '../../context/LocationContext';

export default function RootLayout() {
  return (
    <LocationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 1. Splash Screen */}
        <Stack.Screen name="index" />
        
        {/* 2. Home Screen (Jo tabs ke andar hai) */}
        <Stack.Screen name="(tabs)/home" />
        
        {/* 3. Zikr Manager (Jo tabs ke andar hai) */}
        <Stack.Screen name="(tabs)/ZikrManager" />
      </Stack>
    </LocationProvider>
  );
}