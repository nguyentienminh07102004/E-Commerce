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

const genres = ["Action", "Adventure", "Sci-Fi", "Drama"];

const nowShowing = [
  {
    title: "Dune: Part Two",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80",
    rating: "8.7",
    duration: "2h 46m",
  },
  {
    title: "Furiosa",
    image:
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=700&q=80",
    rating: "7.9",
    duration: "2h 28m",
  },
  {
    title: "The Batman",
    image:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=700&q=80",
    rating: "8.0",
    duration: "2h 56m",
  },
];

const schedules = ["10:00", "12:30", "15:20", "18:40", "20:30"];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.title}>Find Your Movie</Text>
          </View>
          <TouchableOpacity style={styles.avatarButton} activeOpacity={0.8}>
            <Ionicons name="person" size={18} color="#F7EFD8" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <Text style={styles.searchPlaceholder}>
            Search cinema, movie, actor...
          </Text>
        </View>

        <View style={styles.heroCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80",
            }}
            contentFit="cover"
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.badge}>Premiere</Text>
            <Text style={styles.heroTitle}>Interstellar Reborn</Text>
            <Text style={styles.heroSubtitle}>IMAX 3D • 9.1 Rating</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => router.push("/details")}
            >
              <Text style={styles.primaryButtonText}>Book Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Genres</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.genreRow}
        >
          {genres.map((genre, idx) => (
            <TouchableOpacity
              key={genre}
              style={[styles.genreChip, idx === 0 && styles.genreChipActive]}
              activeOpacity={0.85}
            >
              <Text
                style={[styles.genreText, idx === 0 && styles.genreTextActive]}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Now Showing</Text>
          <Text style={styles.sectionLink}>View more</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.posterRow}
        >
          {nowShowing.map((movie) => (
            <TouchableOpacity
              key={movie.title}
              style={styles.posterCard}
              activeOpacity={0.88}
              onPress={() => router.push("/details")}
            >
              <Image
                source={{ uri: movie.image }}
                contentFit="cover"
                style={styles.posterImage}
              />
              <View style={styles.posterInfo}>
                <Text style={styles.posterTitle}>{movie.title}</Text>
                <View style={styles.posterMetaRow}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.posterMeta}>{movie.rating}</Text>
                  <Text style={styles.posterDot}>•</Text>
                  <Text style={styles.posterMeta}>{movie.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today Schedule</Text>
          <Text style={styles.sectionLink}>Cinema 1</Text>
        </View>
        <View style={styles.scheduleWrap}>
          {schedules.map((time, idx) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeChip, idx === 2 && styles.timeChipActive]}
              activeOpacity={0.85}
            >
              <Text
                style={[styles.timeText, idx === 2 && styles.timeTextActive]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#090B13",
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 20,
  },
  header: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 2,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  searchBox: {
    height: 48,
    backgroundColor: "#111827",
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  searchPlaceholder: {
    color: "#64748B",
    fontSize: 14,
  },
  heroCard: {
    height: 230,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#0F172A",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    padding: 18,
    justifyContent: "flex-end",
    backgroundColor: "rgba(5, 10, 24, 0.35)",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#EA580C",
    color: "#FFEDD5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },
  heroTitle: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  heroSubtitle: {
    marginTop: 2,
    color: "#CBD5E1",
    fontSize: 13,
  },
  primaryButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: "#F97316",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: "#FFFBEB",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionHeader: {
    marginTop: -2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionLink: {
    color: "#F97316",
    fontSize: 13,
    fontWeight: "600",
  },
  genreRow: {
    gap: 10,
  },
  genreChip: {
    borderRadius: 12,
    backgroundColor: "#1E293B",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  genreChipActive: {
    backgroundColor: "#F97316",
  },
  genreText: {
    color: "#CBD5E1",
    fontWeight: "600",
  },
  genreTextActive: {
    color: "#FFF7ED",
  },
  posterRow: {
    gap: 12,
  },
  posterCard: {
    width: 162,
    backgroundColor: "#111827",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  posterImage: {
    width: "100%",
    height: 190,
  },
  posterInfo: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 5,
  },
  posterTitle: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "700",
  },
  posterMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  posterMeta: {
    color: "#94A3B8",
    fontSize: 12,
  },
  posterDot: {
    color: "#64748B",
    marginHorizontal: 2,
  },
  scheduleWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeChip: {
    minWidth: 72,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  timeChipActive: {
    backgroundColor: "#F97316",
    borderColor: "#FB923C",
  },
  timeText: {
    color: "#E2E8F0",
    fontWeight: "600",
    fontSize: 13,
  },
  timeTextActive: {
    color: "#FFF7ED",
  },
});
