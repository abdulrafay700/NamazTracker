import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/home");
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Container for Shadow */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🕌</Text>
      </View>
      <Text style={styles.title}>Namaz Tracker</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2954",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    // Yahan humne modern boxShadow use kiya hai glow effect ke liye
    boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.3)",
    marginBottom: 20,
  },
  logo: {
    fontSize: 70,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    // Text par bhi shadow de sakte hain
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
  },
});