import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  formatMoney,
  getSeatsByRoom,
  getSoldTickets,
  SeatResponse,
} from "../lib/api";

function readParam(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function rowLabelFromNumber(rowNumber: number) {
  if (rowNumber <= 0) {
    return String(rowNumber);
  }

  const charCode = 64 + rowNumber;
  if (charCode <= 90) {
    return String.fromCharCode(charCode);
  }

  return String(rowNumber);
}

function groupSeatsByRow(seats: SeatResponse[]) {
  return Array.from(
    seats.reduce((groups, seat) => {
      const rowLabel = rowLabelFromNumber(seat.rowNumber);
      const existing = groups.get(rowLabel) ?? [];
      existing.push(seat);
      groups.set(rowLabel, existing);
      return groups;
    }, new Map<string, SeatResponse[]>()),
  )
    .map(([rowLabel, rowSeats]) => ({
      rowLabel,
      seats: rowSeats.sort((left, right) => left.seatNumber - right.seatNumber),
    }))
    .sort((left, right) => left.rowLabel.localeCompare(right.rowLabel));
}

export default function SeatMapScreen() {
  const params = useLocalSearchParams<{
    movieTitle?: string | string[];
    cinemaName?: string | string[];
    showtimeId?: string | string[];
    roomId?: string | string[];
    showtimeDate?: string | string[];
    showtimeTime?: string | string[];
    ticketPrice?: string | string[];
    userId?: string | string[];
  }>();

  const movieTitle = readParam(params.movieTitle, "Dune: Part Two");
  const cinemaName = readParam(params.cinemaName, "Cinema 1");
  const showtimeId = Number(readParam(params.showtimeId, "0"));
  const roomId = Number(readParam(params.roomId, "0"));
  const showtimeDate = readParam(params.showtimeDate, "2026-05-24");
  const showtimeTime = readParam(params.showtimeTime, "18:40");
  const ticketPrice = Number(readParam(params.ticketPrice, "0"));
  const userId = readParam(params.userId, "usr_001");

  const [seatItems, setSeatItems] = useState<SeatResponse[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(true);
  const [seatError, setSeatError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadSeats = async () => {
      setIsLoadingSeats(true);
      setSeatError(null);

      try {
        const [seatData, soldTickets] = await Promise.all([
          getSeatsByRoom(roomId),
          getSoldTickets(showtimeId),
        ]);
        console.log("Seats for room", seatData, soldTickets);
        if (!active) {
          return;
        }

        const seats: SeatResponse[] = Array.isArray(seatData)
          ? seatData
          : (seatData.content ?? []);

        const soldSeatIds = new Set(
          (soldTickets ?? [])
            .filter((ticket) => ticket.isSold)
            .map((ticket) => ticket.seatId.trim()),
        );

        const roomSeats = seats.filter((seat) => {
          const seatNumberKey = String(seat.seatNumber);
          const seatIdKey = String(seat.id);
          return (
            seat.roomId === roomId &&
            !soldSeatIds.has(seatNumberKey) &&
            !soldSeatIds.has(seatIdKey)
          );
        });

        setSeatItems(roomSeats);
        setSelectedSeatIds([]);
      } catch (error) {
        console.error("Failed to load seats", error);
        if (!active) {
          return;
        }

        setSeatItems([]);
        setSeatError(
          error instanceof Error ? error.message : "Failed to load seats",
        );
      } finally {
        if (active) {
          setIsLoadingSeats(false);
        }
      }
    };

    loadSeats();

    return () => {
      active = false;
    };
  }, [roomId, showtimeId]);

  const seatRows = useMemo(() => groupSeatsByRow(seatItems), [seatItems]);

  const selectedSeatItems = useMemo(
    () => seatItems.filter((seat) => selectedSeatIds.includes(seat.id)),
    [seatItems, selectedSeatIds],
  );

  const totalAmount = selectedSeatItems.reduce(
    (sum, seat) => sum + seat.priceMultiplier * ticketPrice,
    0,
  );

  const toggleSeat = (seatId: number) => {
    if (isLoadingSeats) {
      return;
    }

    setSelectedSeatIds((current) =>
      current.includes(seatId)
        ? current.filter((item) => item !== seatId)
        : [...current, seatId],
    );
  };

  const continueToCheckout = () => {
    const selectedSeatLabels = selectedSeatItems.map(
      (seat) => `${rowLabelFromNumber(seat.rowNumber)}${seat.seatNumber}`,
    );
    const selectedSeatPrices = selectedSeatItems.map(
      (seat) => seat.priceMultiplier * ticketPrice,
    );

    router.push({
      pathname: "/checkout",
      params: {
        movieTitle,
        cinemaName,
        showtimeId: String(showtimeId),
        roomId: String(roomId),
        showtimeDate,
        showtimeTime,
        userId,
        selectedSeatIds: selectedSeatIds.join(","),
        selectedSeats: selectedSeatLabels.join(","),
        selectedSeatPrices: selectedSeatPrices.join(","),
        totalAmount: String(totalAmount),
        discountAmount: "0",
        serviceFee: "0",
      },
    });
  };

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
            <Text style={styles.subtitle}>
              {cinemaName} • {showtimeDate} • {showtimeTime}
            </Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
            <Ionicons name="funnel-outline" size={18} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        <View style={styles.seatCard}>
          <View style={styles.screenWrap}>
            <View style={styles.screenArc} />
            <Text style={styles.screenLabel}>SCREEN</Text>
          </View>

          {isLoadingSeats ? (
            <View style={styles.loadingWrap}>
              <Text style={styles.loadingText}>Loading seats...</Text>
            </View>
          ) : seatError ? (
            <View style={styles.loadingWrap}>
              <Text style={styles.loadingText}>{seatError}</Text>
            </View>
          ) : seatRows.length > 0 ? (
            <View style={styles.gridWrap}>
              {seatRows.map((row) => (
                <View key={row.rowLabel} style={styles.seatRow}>
                  <Text style={styles.rowLabel}>{row.rowLabel}</Text>
                  <View style={styles.rowSeatsWrap}>
                    {row.seats.map((seat) => {
                      const isSelected = selectedSeatIds.includes(seat.id);
                      const seatLabel = `${row.rowLabel}${seat.seatNumber}`;

                      return (
                        <TouchableOpacity
                          key={seat.id}
                          style={[
                            styles.seat,
                            seat.type === "VIP" && styles.seatVip,
                            seat.type === "COUPLE" && styles.seatCouple,
                            isSelected && styles.seatSelected,
                          ]}
                          activeOpacity={0.88}
                          onPress={() => toggleSeat(seat.id)}
                        >
                          <Text
                            style={[
                              styles.seatText,
                              seat.type === "VIP" && styles.seatTextVip,
                              seat.type === "COUPLE" && styles.seatTextCouple,
                              isSelected && styles.seatTextSelected,
                            ]}
                          >
                            {seatLabel}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.loadingWrap}>
              <Text style={styles.loadingText}>
                No seats found for this room.
              </Text>
            </View>
          )}

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
              <View style={[styles.legendDot, styles.legendVip]} />
              <Text style={styles.legendText}>VIP</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>
            {selectedSeatIds.length} seats selected
          </Text>
          <Text style={styles.bottomPrice}>{formatMoney(totalAmount)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            !selectedSeatIds.length && styles.primaryBtnDisabled,
          ]}
          activeOpacity={0.88}
          onPress={continueToCheckout}
          disabled={!selectedSeatIds.length}
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
  loadingWrap: {
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },
  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowLabel: {
    width: 16,
    color: "#64748B",
    fontSize: 11,
    fontWeight: "700",
  },
  rowSeatsWrap: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
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
  seatVip: {
    backgroundColor: "#1D4ED8",
    borderColor: "#3B82F6",
  },
  seatCouple: {
    width: 74,
    backgroundColor: "#0F766E",
    borderColor: "#14B8A6",
  },
  seatText: {
    color: "#CBD5E1",
    fontSize: 8,
    fontWeight: "700",
  },
  seatTextSelected: {
    color: "#FFF7ED",
  },
  seatTextVip: {
    color: "#DBEAFE",
  },
  seatTextCouple: {
    color: "#CCFBF1",
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
  legendVip: {
    backgroundColor: "#3B82F6",
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
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    color: "#FFF7ED",
    fontSize: 13,
    fontWeight: "700",
  },
});
