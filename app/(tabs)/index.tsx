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
      <Text style={styles.logo}>🕌</Text>
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
  logo: {
    fontSize: 70,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
  },
});