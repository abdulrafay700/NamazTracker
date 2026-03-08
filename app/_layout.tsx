// import { Stack } from 'expo-router';
// import { LocationProvider } from '../context/LocationContext';

// export default function RootLayout() {
//   return (
//     <LocationProvider>
//       <Stack screenOptions={{ headerShown: false }}>
//         {/* Sab se pehle Splash (index.tsx) chalegi */}
//         <Stack.Screen name="index" />
//         {/* Phir poora tabs ka group */}
//         <Stack.Screen name="(tabs)" />
//         {/* Auth group (agar hai) */}
//         <Stack.Screen name="(auth)" />
//       </Stack>
//     </LocationProvider>
//   );
// }







import { Stack } from 'expo-router';
import { LocationProvider } from '../context/LocationContext';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['props.pointerEvents is deprecated']);

export default function RootLayout() {
  return (
    <LocationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Iska matlab hai ke app seedha (tabs) folder ko load karegi */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </LocationProvider>
  );
}