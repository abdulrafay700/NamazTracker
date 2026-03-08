// import { Tabs } from 'expo-router';

// export default function TabLayout() {
//   return (
//     <Tabs screenOptions={{ headerShown: false }}>
//       {/* Ye apke main pages hain jo tabs mein ayenge */}
//       <Tabs.Screen name="home" options={{ title: 'Home' }} />
//       <Tabs.Screen name="tasbeeh" options={{ title: 'Tasbeeh' }} />
//       <Tabs.Screen name="namaztracker" options={{ title: 'Namaz' }} />
      
//       {/* In files ko tabs se hide kar dete hain kyunki ye hidden components hain */}
//       <Tabs.Screen name="ZikrManager" options={{ href: null }} /> 
//     </Tabs>
//   );
// }



import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarStyle: { display: 'none' } // Niche wala bar hide karne ke liye
    }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="tasbeeh" />
      <Tabs.Screen name="namaztracker" />

      {/* Ye line upar nazar aane wale 'index' link ko khatam kar degi */}
      <Tabs.Screen name="index" options={{ href: null }} />
    </Tabs>
  );
}