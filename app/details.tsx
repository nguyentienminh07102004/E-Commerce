import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const cast = [
  {
    name: "Timothee Chalamet",
    role: "Paul Atreides",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Zendaya",
    role: "Chani",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Rebecca Ferguson",
    role: "Lady Jessica",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
];

const chips = ["Sci-Fi", "Adventure", "IMAX 3D", "PG-13"];

export default function DetailsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1500&q=80",
            }}
            contentFit="cover"
            style={styles.heroImage}
          />

          <View style={styles.heroOverlay}>
            <View style={styles.topRow}>
              <TouchableOpacity
                style={styles.iconButton}
                activeOpacity={0.85}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={19} color="#F8FAFC" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
                <Ionicons name="bookmark-outline" size={18} color="#F8FAFC" />
              </TouchableOpacity>
            </View>

            <View style={styles.scorePill}>
              <Ionicons name="star" size={12} color="#FCD34D" />
              <Text style={styles.scoreText}>8.7</Text>
            </View>

            <Text style={styles.title}>Dune: Part Two</Text>
            <Text style={styles.meta}>166 min • 2026 • Denis Villeneuve</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.chipsRow}>
            {chips.map((chip) => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.paragraph}>
            Paul Atreides unites with Chani and the Fremen while seeking revenge
            against the conspirators who destroyed his family. Faced with a
            choice between love and the fate of the universe, he strives to
            prevent a terrible future only he can foresee.
          </Text>

          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <Text style={styles.linkText}>See all</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.castRow}
          >
            {cast.map((person) => (
              <View key={person.name} style={styles.castCard}>
                <Image
                  source={{ uri: person.image }}
                  contentFit="cover"
                  style={styles.castImage}
                />
                <Text style={styles.castName}>{person.name}</Text>
                <Text style={styles.castRole}>{person.role}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>Trailer</Text>
            <Text style={styles.linkText}>HD</Text>
          </View>

          <TouchableOpacity style={styles.trailerCard} activeOpacity={0.9}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80",
              }}
              contentFit="cover"
              style={styles.trailerImage}
            />
            <View style={styles.trailerOverlay}>
              <View style={styles.playButton}>
                <Ionicons name="play" size={18} color="#0B1220" />
              </View>
              <Text style={styles.trailerText}>Official Trailer 2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.priceValue}>$12.00</Text>
        </View>
        <TouchableOpacity
          style={styles.buyButton}
          activeOpacity={0.88}
          onPress={() => router.push("/select-seats")}
        >
          <Text style={styles.buyText}>Choose Seats</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#090B13",
  },
  container: {
    paddingBottom: 120,
  },
  hero: {
    height: 360,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "rgba(6, 11, 22, 0.4)",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(203, 213, 225, 0.28)",
    backgroundColor: "rgba(2, 6, 23, 0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  scorePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.35)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scoreText: {
    color: "#FEF3C7",
    fontWeight: "700",
    fontSize: 12,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  meta: {
    color: "#CBD5E1",
    fontSize: 13,
    marginTop: -6,
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 18,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#111827",
    borderColor: "#1F2937",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  paragraph: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
    marginTop: -10,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: -8,
  },
  linkText: {
    color: "#F97316",
    fontSize: 13,
    fontWeight: "600",
  },
  castRow: {
    gap: 12,
  },
  castCard: {
    width: 122,
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  castImage: {
    width: "100%",
    height: 112,
    borderRadius: 11,
    marginBottom: 8,
  },
  castName: {
    color: "#F1F5F9",
    fontSize: 12,
    fontWeight: "700",
  },
  castRole: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },
  trailerCard: {
    height: 170,
    borderRadius: 18,
    overflow: "hidden",
  },
  trailerImage: {
    width: "100%",
    height: "100%",
  },
  trailerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(2, 6, 23, 0.4)",
  },
  playButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  trailerText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
  },
  bottomBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
    backgroundColor: "#111827",
    borderColor: "#1F2937",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },
  priceValue: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "800",
  },
  buyButton: {
    backgroundColor: "#F97316",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buyText: {
    color: "#FFF7ED",
    fontWeight: "700",
    fontSize: 13,
  },
});
