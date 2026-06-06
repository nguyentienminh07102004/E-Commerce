import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth";

const bookedTickets = [
  {
    id: "MV-2481-9337",
    movie: "Dune: Part Two",
    date: "Tue, 14 Mar",
    time: "18:40",
    seats: "C2, C3",
    cinema: "Cinema 1",
    status: "Upcoming",
  },
  {
    id: "MV-1035-2201",
    movie: "The Batman",
    date: "Sat, 09 Mar",
    time: "20:10",
    seats: "E5, E6",
    cinema: "Cinema 3",
    status: "Watched",
  },
];

export default function ProfileScreen() {
  const { isAuthenticated, fullName, role, signOut, isReady } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {!isAuthenticated ? (
          <View style={styles.authCard}>
            <View style={styles.authHeader}>
              <View style={styles.avatarWrap}>
                <Ionicons name="person" size={28} color="#FFF7ED" />
              </View>
              <View>
                <Text style={styles.authTitle}>Guest account</Text>
                <Text style={styles.authText}>
                  Login to view saved tickets and pay for bookings.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.authButton}
              activeOpacity={0.88}
              onPress={() => router.push("/login")}
              disabled={!isReady}
            >
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryAuthButton}
              activeOpacity={0.88}
              onPress={() => router.push("/register")}
              disabled={!isReady}
            >
              <Text style={styles.secondaryAuthButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.headerCard}>
              <View style={styles.avatarWrap}>
                <Ionicons name="person" size={28} color="#FFF7ED" />
              </View>
              <View>
                <Text style={styles.name}>{fullName ?? "Guest"}</Text>
                <Text style={styles.email}>{role ?? "Member"}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.88}
              onPress={signOut}
            >
              <Ionicons name="log-out-outline" size={18} color="#FCA5A5" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Booked</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>4</Text>
                <Text style={styles.statLabel}>Upcoming</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>Watched</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Booked Tickets</Text>
              <Text style={styles.sectionLink}>History</Text>
            </View>

            <View style={styles.ticketList}>
              {bookedTickets.map((ticket) => {
                const isUpcoming = ticket.status === "Upcoming";
                return (
                  <TouchableOpacity
                    key={ticket.id}
                    style={styles.ticketCard}
                    activeOpacity={0.9}
                  >
                    <View style={styles.ticketTop}>
                      <Text style={styles.movieTitle}>{ticket.movie}</Text>
                      <View
                        style={[
                          styles.statusPill,
                          isUpcoming && styles.statusPillUpcoming,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            isUpcoming && styles.statusTextUpcoming,
                          ]}
                        >
                          {ticket.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.ticketMeta}>
                      {ticket.cinema} • {ticket.date} • {ticket.time}
                    </Text>

                    <View style={styles.ticketBottom}>
                      <View>
                        <Text style={styles.metaLabel}>Seats</Text>
                        <Text style={styles.metaValue}>{ticket.seats}</Text>
                      </View>
                      <View>
                        <Text style={styles.metaLabel}>Booking ID</Text>
                        <Text style={styles.metaValue}>{ticket.id}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.88}>
                <Ionicons
                  name="notifications-outline"
                  size={18}
                  color="#E2E8F0"
                />
                <Text style={styles.actionText}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.88}>
                <Ionicons name="settings-outline" size={18} color="#E2E8F0" />
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.88}>
                <Ionicons
                  name="help-circle-outline"
                  size={18}
                  color="#E2E8F0"
                />
                <Text style={styles.actionText}>Support</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
    gap: 14,
  },
  headerCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F97316",
  },
  name: {
    color: "#F8FAFC",
    fontSize: 17,
    fontWeight: "700",
  },
  email: {
    marginTop: 2,
    color: "#94A3B8",
    fontSize: 12,
  },
  authCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 14,
    gap: 10,
  },
  authHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 2,
  },
  authText: {
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 19,
  },
  authButton: {
    backgroundColor: "#F97316",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  authButtonText: {
    color: "#FFF7ED",
    fontSize: 13,
    fontWeight: "800",
  },
  secondaryAuthButton: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#243041",
  },
  secondaryAuthButtonText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "800",
  },
  logoutButton: {
    backgroundColor: "#1A2435",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#3F1D22",
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    color: "#FCA5A5",
    fontSize: 13,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1F2937",
    alignItems: "center",
    paddingVertical: 12,
  },
  statValue: {
    color: "#FB923C",
    fontSize: 21,
    fontWeight: "800",
  },
  statLabel: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionLink: {
    color: "#F97316",
    fontSize: 12,
    fontWeight: "600",
  },
  ticketList: {
    gap: 10,
  },
  ticketCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 13,
  },
  ticketTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  movieTitle: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#334155",
  },
  statusPillUpcoming: {
    backgroundColor: "rgba(249, 115, 22, 0.2)",
  },
  statusText: {
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextUpcoming: {
    color: "#FDBA74",
  },
  ticketMeta: {
    marginTop: 7,
    color: "#94A3B8",
    fontSize: 12,
  },
  ticketBottom: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    paddingTop: 9,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaLabel: {
    color: "#64748B",
    fontSize: 10,
  },
  metaValue: {
    marginTop: 2,
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "600",
  },
  quickActions: {
    marginTop: 4,
    gap: 8,
  },
  actionBtn: {
    backgroundColor: "#111827",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1F2937",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  actionText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },
});
