import { useRouter } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; 

export default function Home() {
  const router = useRouter();

  const cards = [
    { title: "Namaz\nTracker", emoji: "🕌", route: "/screens/namaztracker" },
    { title: "Daily\nDuain", emoji: "🤲", route: "/duain" },
    { title: "Hajj &\nUmrah", emoji: "🕋", route: "/hajj" },
    { title: "Islamic\nBooks", emoji: "📚", route: "/books" },
    { title: "Wazifa\nCollection", emoji: "✨", route: "/wazifa" },
    { title: "Tasbeeh\nCounter", emoji: "📿", route: "/screens/tasbeeh" },
  ];

  return (
    <ScrollView style={styles.mainScroll} contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.subHeader}>Welcome to</Text>
        <Text style={styles.header}>Islamic Companion</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            style={styles.card}
            onPress={() => item.route && router.push(item.route as any)}
          >
            <View style={styles.iconContainer}>
               <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.soonCard}>
         <Text style={styles.soonText}>🚀 More Updates Coming Soon</Text>
      </TouchableOpacity>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    padding: 20,
    paddingTop: 60,
  },
  headerContainer: {
    marginBottom: 30,
  },
  subHeader: {
    color: "#10b981",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#111111",
    width: cardWidth,
    height: 160,
    padding: 15,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    
    // MOBILE FIX: BoxShadow string hata kar ye use karein
    ...Platform.select({
      ios: {
        shadowColor: "#10b981",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  emoji: {
    fontSize: 28,
  },
  cardText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 20,
  },
  soonCard: {
    backgroundColor: "#064e3b",
    padding: 18,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#10b981",
  },
  soonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});