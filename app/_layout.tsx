import { Stack } from 'expo-router';
import { LocationProvider } from '../context/LocationContext';

// 'export default' likhna lazmi hai
export default function RootLayout() {
  return (
    <LocationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </LocationProvider>
  );
}