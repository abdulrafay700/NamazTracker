import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Home() {
  const router = useRouter();

  const cards = [
    { title: "🕌 Namaz Tracker", route: "/namaz" },
    { title: "🤲 Daily Duain", route: "/duain" },
    { title: "🕋 Hajj & Umrah Duain", route: "/hajj" },
    { title: "📚 Islamic Books", route: "/books" },
    { title: "✨ Wazifa", route: "/wazifa" },
    { title: "📿 Tasbeeh Counter", route: "/tasbeeh" },
    { title: "🚀 More Updates Coming Soon", route: null },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Islamic Companion</Text>

      {cards.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => item.route && router.push(item.route)}
        >
          <Text style={styles.cardText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F4F6F9",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
  },
});