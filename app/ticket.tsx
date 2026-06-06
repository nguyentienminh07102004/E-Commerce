import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function readParam(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export default function TicketScreen() {
  const params = useLocalSearchParams<{
    bookingId?: string | string[];
    qrCode?: string | string[];
    paymentMethod?: string | string[];
    movieTitle?: string | string[];
    cinemaName?: string | string[];
    showtimeDate?: string | string[];
    showtimeTime?: string | string[];
    selectedSeats?: string | string[];
    finalAmount?: string | string[];
  }>();

  const bookingId = readParam(params.bookingId, "MV-2481-9337");
  const qrCode = readParam(params.qrCode, "QR-123");
  const paymentMethod = readParam(params.paymentMethod, "MOMO");
  const movieTitle = readParam(params.movieTitle, "Dune: Part Two");
  const cinemaName = readParam(params.cinemaName, "Cinema 1");
  const showtimeDate = readParam(params.showtimeDate, "Tue, 14 Mar");
  const showtimeTime = readParam(params.showtimeTime, "18:40");
  const selectedSeats = readParam(params.selectedSeats, "C2, C3");
  const finalAmount = readParam(params.finalAmount, "$26.00");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.85}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#F8FAFC" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Ticket</Text>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
            <Ionicons name="share-social-outline" size={18} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        <View style={styles.successBox}>
          <View style={styles.successIconWrap}>
            <Ionicons name="checkmark" size={24} color="#FFF7ED" />
          </View>
          <Text style={styles.successTitle}>Booking Successful</Text>
          <Text style={styles.successSub}>
            Your booking is confirmed via {paymentMethod}. Enjoy the movie
            night.
          </Text>
        </View>

        <View style={styles.ticketCard}>
          <View style={styles.topSection}>
            <Text style={styles.movieTitle}>{movieTitle}</Text>
            <Text style={styles.movieMeta}>{cinemaName}</Text>
          </View>

          <View style={styles.rowWrap}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{showtimeDate}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>{showtimeTime}</Text>
            </View>
          </View>

          <View style={styles.rowWrap}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Cinema</Text>
              <Text style={styles.value}>{cinemaName}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Seats</Text>
              <Text style={styles.value}>{selectedSeats}</Text>
            </View>
          </View>

          <View style={styles.rowWrap}>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>{finalAmount}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Booking Method</Text>
              <Text style={styles.value}>{paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.perforation}>
            <View style={styles.holeLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.holeRight} />
          </View>

          <View style={styles.barcodeWrap}>
            <View style={styles.barcode}>
              {Array.from({ length: 42 }).map((_, idx) => (
                <View
                  key={`bar-${idx}`}
                  style={[
                    styles.bar,
                    idx % 3 === 0 && styles.barWide,
                    idx % 4 === 0 && styles.barTall,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.bookingCode}>BOOKING ID: {bookingId}</Text>
            <Text style={styles.bookingCode}>QR: {qrCode}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.88}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Text style={styles.secondaryButtonText}>View In Profile</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  headerTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
  },
  successBox: {
    backgroundColor: "#111827",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  successIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  successTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },
  successSub: {
    marginTop: 4,
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 12,
  },
  ticketCard: {
    backgroundColor: "#111827",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1F2937",
    overflow: "hidden",
  },
  topSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  movieTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
  },
  movieMeta: {
    marginTop: 3,
    color: "#94A3B8",
    fontSize: 13,
  },
  rowWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
  },
  infoBlock: {
    width: "46%",
  },
  label: {
    color: "#64748B",
    fontSize: 11,
    marginBottom: 2,
  },
  value: {
    color: "#F1F5F9",
    fontSize: 14,
    fontWeight: "700",
  },
  perforation: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  holeLeft: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#090B13",
    marginLeft: -9,
  },
  dashedLine: {
    flex: 1,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#334155",
  },
  holeRight: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#090B13",
    marginRight: -9,
  },
  barcodeWrap: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  barcode: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    height: 52,
  },
  bar: {
    width: 2,
    height: 30,
    backgroundColor: "#E2E8F0",
  },
  barWide: {
    width: 3,
  },
  barTall: {
    height: 44,
  },
  bookingCode: {
    marginTop: 10,
    color: "#94A3B8",
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#111827",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#263244",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "700",
  },
});
