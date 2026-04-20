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

const dates = ["Sun 12", "Mon 13", "Tue 14", "Wed 15", "Thu 16"];
const times = ["10:00", "12:30", "15:20", "18:40", "20:30"];

const seatGrid = [
  ["A1", "A2", "A3", "", "A4", "A5", "A6", "A7"],
  ["B1", "B2", "B3", "", "B4", "B5", "B6", "B7"],
  ["C1", "C2", "C3", "", "C4", "C5", "C6", "C7"],
  ["D1", "D2", "D3", "", "D4", "D5", "D6", "D7"],
  ["E1", "E2", "E3", "", "E4", "E5", "E6", "E7"],
];

const selected = new Set(["C2", "C3"]);
const booked = new Set(["A2", "B5", "D4", "E1"]);

export default function SelectSeatsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#F8FAFC" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.title}>Select Seats</Text>
            <Text style={styles.subtitle}>Dune: Part Two</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
            <Ionicons name="funnel-outline" size={18} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        <View style={styles.selectionCard}>
          <Text style={styles.sectionTitle}>Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowGap}
          >
            {dates.map((date, idx) => (
              <TouchableOpacity
                key={date}
                style={[styles.chip, idx === 2 && styles.chipActive]}
                activeOpacity={0.88}
              >
                <Text
                  style={[styles.chipText, idx === 2 && styles.chipTextActive]}
                >
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.sectionTitle, styles.timeTitle]}>Showtime</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowGap}
          >
            {times.map((time, idx) => (
              <TouchableOpacity
                key={time}
                style={[styles.chip, idx === 3 && styles.chipActive]}
                activeOpacity={0.88}
              >
                <Text
                  style={[styles.chipText, idx === 3 && styles.chipTextActive]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.seatCard}>
          <View style={styles.screenWrap}>
            <View style={styles.screenArc} />
            <Text style={styles.screenLabel}>SCREEN</Text>
          </View>

          <View style={styles.gridWrap}>
            {seatGrid.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.seatRow}>
                {row.map((seat, seatIndex) => {
                  if (!seat) {
                    return (
                      <View
                        key={`aisle-${rowIndex}-${seatIndex}`}
                        style={styles.aisle}
                      />
                    );
                  }

                  const isSelected = selected.has(seat);
                  const isBooked = booked.has(seat);

                  return (
                    <TouchableOpacity
                      key={seat}
                      style={[
                        styles.seat,
                        isSelected && styles.seatSelected,
                        isBooked && styles.seatBooked,
                      ]}
                      activeOpacity={0.88}
                    >
                      <Text
                        style={[
                          styles.seatText,
                          isSelected && styles.seatTextSelected,
                          isBooked && styles.seatTextBooked,
                        ]}
                      >
                        {seat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendAvailable]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendSelected]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.legendBooked]} />
              <Text style={styles.legendText}>Booked</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>2 seats selected</Text>
          <Text style={styles.bottomPrice}>$24.00</Text>
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.88}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 120,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrap: {
    alignItems: "center",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 2,
  },
  selectionCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 14,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },
  timeTitle: {
    marginTop: 14,
  },
  rowGap: {
    gap: 10,
  },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 11,
    backgroundColor: "#1E293B",
  },
  chipActive: {
    backgroundColor: "#F97316",
  },
  chipText: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#FFF7ED",
  },
  seatCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 14,
  },
  screenWrap: {
    alignItems: "center",
    marginBottom: 14,
  },
  screenArc: {
    width: "88%",
    height: 28,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: "#334155",
  },
  screenLabel: {
    marginTop: 4,
    fontSize: 11,
    letterSpacing: 2,
    color: "#64748B",
  },
  gridWrap: {
    gap: 9,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
  },
  seat: {
    width: 34,
    height: 26,
    borderRadius: 8,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  seatSelected: {
    backgroundColor: "#F97316",
    borderColor: "#FB923C",
  },
  seatBooked: {
    backgroundColor: "#334155",
    borderColor: "#475569",
  },
  seatText: {
    color: "#CBD5E1",
    fontSize: 8,
    fontWeight: "700",
  },
  seatTextSelected: {
    color: "#FFF7ED",
  },
  seatTextBooked: {
    color: "#94A3B8",
  },
  aisle: {
    width: 12,
  },
  legendRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendAvailable: {
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#475569",
  },
  legendSelected: {
    backgroundColor: "#F97316",
  },
  legendBooked: {
    backgroundColor: "#475569",
  },
  legendText: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
  },
  bottomBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },
  bottomPrice: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "800",
  },
  primaryBtn: {
    backgroundColor: "#F97316",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  primaryBtnText: {
    color: "#FFF7ED",
    fontSize: 13,
    fontWeight: "700",
  },
});
