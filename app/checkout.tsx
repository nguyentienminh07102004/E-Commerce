import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    createBooking,
    createBookingDetail,
    createPayment,
    formatMoney,
    seatLabelToSeatId,
} from "../lib/api";
import { useAuth } from "../lib/auth";

const paymentMethods = [
  // {
  //   id: "MOMO",
  //   label: "MoMo Wallet",
  //   detail: "Connected",
  //   icon: "wallet-outline",
  // },
  {
    id: "VNPAY",
    label: "VNPAY",
    detail: "Fast checkout",
    icon: "card-outline",
  },
  // {
  //   id: "CASH",
  //   label: "Cash",
  //   detail: "Pay at counter",
  //   icon: "cash-outline",
  // },
] as const;

function readParam(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export default function CheckoutScreen() {
  const params = useLocalSearchParams<{
    movieTitle?: string | string[];
    cinemaName?: string | string[];
    showtimeId?: string | string[];
    roomId?: string | string[];
    showtimeDate?: string | string[];
    showtimeTime?: string | string[];
    userId?: string | string[];
    selectedSeatIds?: string | string[];
    selectedSeats?: string | string[];
    selectedSeatPrices?: string | string[];
    totalAmount?: string | string[];
    discountAmount?: string | string[];
    serviceFee?: string | string[];
  }>();

  const movieTitle = readParam(params.movieTitle, "Dune: Part Two");
  const cinemaName = readParam(params.cinemaName, "Cinema 1");
  const showtimeId = Number(readParam(params.showtimeId, "30"));
  const roomId = readParam(params.roomId, "10");
  const showtimeDate = readParam(params.showtimeDate, "Tue, 14 Mar");
  const showtimeTime = readParam(params.showtimeTime, "18:40");
  const userId = readParam(params.userId, "usr_001");
  const selectedSeatIds = readParam(params.selectedSeatIds, "")
    .split(",")
    .filter(Boolean)
    .map((seatId) => Number(seatId));
  const selectedSeats = readParam(params.selectedSeats, "C2,C3")
    .split(",")
    .filter(Boolean);
  const selectedSeatPrices = readParam(params.selectedSeatPrices, "")
    .split(",")
    .filter(Boolean)
    .map((price) => Number(price));
  const discountAmount = Number(readParam(params.discountAmount, "0"));
  const serviceFee = Number(readParam(params.serviceFee, "0"));
  const ticketPrice = selectedSeatPrices[0] ?? 12000;
  const derivedTotalAmount =
    selectedSeatPrices.length > 0
      ? selectedSeatPrices.reduce((sum, price) => sum + price, 0) + serviceFee
      : selectedSeats.length * 12000 + serviceFee;
  const totalAmount = Number(
    readParam(params.totalAmount, String(derivedTotalAmount)),
  );
  const finalAmount = Math.max(totalAmount - discountAmount, 0);
  const { isAuthenticated, isReady } = useAuth();

  const [selectedMethodId, setSelectedMethodId] =
    useState<(typeof paymentMethods)[number]["id"]>("VNPAY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedMethod =
    paymentMethods.find((method) => method.id === selectedMethodId) ??
    paymentMethods[0];

  const buildCheckoutReturnPath = () => {
    const paramsMap = new URLSearchParams({
      movieTitle,
      cinemaName,
      showtimeId: String(showtimeId),
      roomId,
      showtimeDate,
      showtimeTime,
      userId,
      selectedSeatIds: selectedSeatIds.join(","),
      selectedSeats: selectedSeats.join(","),
      selectedSeatPrices: selectedSeatPrices.join(","),
      totalAmount: String(totalAmount),
      discountAmount: String(discountAmount),
      serviceFee: String(serviceFee),
    });

    return `/checkout?${paramsMap.toString()}`;
  };

  const handlePayNow = async () => {
    if (isSubmitting) {
      return;
    }

    if (!isAuthenticated) {
      router.push({
        pathname: "/login",
        params: { returnTo: buildCheckoutReturnPath() },
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const booking = await createBooking({
        userId,
        showtimeId,
        promotionId: null,
        totalAmount,
        discountAmount,
        finalAmount,
        status: "PENDING",
        qrCode: `BK-${showtimeId}-${Date.now().toString(36).toUpperCase()}`,
      });

      await Promise.all(
        selectedSeats.map((seatLabel, index) =>
          createBookingDetail({
            bookingId: booking.id,
            seatId: selectedSeatIds[index] ?? seatLabelToSeatId(seatLabel),
            priceAtTime: selectedSeatPrices[index] ?? 12000,
          }),
        ),
      );

      const payment = await createPayment({
        method: selectedMethod.id,
        amount: finalAmount,
        transactionId: `TX-${Date.now().toString(36).toUpperCase()}`,
        status: "SUCCESS",
        bookingId: booking.id,
      });

      const paymentUrl = payment.paymentUrl;

      Linking.openURL(paymentUrl);

      // router.replace({
      //   pathname: "/ticket",
      //   params: {
      //     bookingId: String(booking.id),
      //     qrCode: booking.qrCode,
      //     paymentId: String(payment.id),
      //     paymentMethod: payment.method,
      //     movieTitle,
      //     cinemaName,
      //     showtimeDate,
      //     showtimeTime,
      //     selectedSeats: selectedSeats.join(", "),
      //     roomId,
      //     finalAmount: String(finalAmount),
      //   },
      // });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Payment failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Text style={styles.headerTitle}>Checkout</Text>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.85}>
            <Ionicons name="ellipsis-horizontal" size={18} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        <View style={styles.ticketCard}>
          <Text style={styles.movieTitle}>{movieTitle}</Text>
          <Text style={styles.movieMeta}>
            {cinemaName} • {showtimeDate} • {showtimeTime}
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Seats</Text>
            <Text style={styles.infoValue}>{selectedSeats.join(", ")}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ticket Price</Text>
            <Text style={styles.infoValue}>
              {formatMoney(ticketPrice)} x {selectedSeats.length}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service Fee</Text>
            <Text style={styles.infoValue}>{formatMoney(serviceFee)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatMoney(finalAmount)}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Text style={styles.sectionLink}>Add new</Text>
          </View>

          <View style={styles.methodList}>
            {paymentMethods.map((method) => {
              const selected = method.id === selectedMethodId;

              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodItem,
                    selected && styles.methodItemSelected,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => setSelectedMethodId(method.id)}
                >
                  <View style={styles.methodLeft}>
                    <View
                      style={[
                        styles.methodIconWrap,
                        selected && styles.methodIconWrapSelected,
                      ]}
                    >
                      <Ionicons
                        name={method.icon}
                        size={17}
                        color={selected ? "#FFF7ED" : "#CBD5E1"}
                      />
                    </View>
                    <View>
                      <Text style={styles.methodTitle}>{method.label}</Text>
                      <Text style={styles.methodSub}>{method.detail}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.radioOuter,
                      selected && styles.radioOuterSelected,
                    ]}
                  >
                    {selected ? <View style={styles.radioInner} /> : null}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <TouchableOpacity style={styles.promoRow} activeOpacity={0.88}>
            <View style={styles.promoLeft}>
              <View style={styles.tagBubble}>
                <Ionicons name="pricetag" size={15} color="#FDBA74" />
              </View>
              <View>
                <Text style={styles.promoTitle}>MOVIE20</Text>
                <Text style={styles.promoSub}>20% off for premium members</Text>
              </View>
            </View>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Amount to Pay</Text>
          <Text style={styles.bottomPrice}>{formatMoney(finalAmount)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, isSubmitting && styles.payButtonDisabled]}
          activeOpacity={0.88}
          onPress={handlePayNow}
          disabled={isSubmitting}
        >
          <Text style={styles.payText}>
            {!isReady
              ? "Loading..."
              : isSubmitting
                ? "Processing..."
                : isAuthenticated
                  ? "Pay Now"
                  : "Login to Pay"}
          </Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
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
  ticketCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 16,
  },
  movieTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
  },
  movieMeta: {
    color: "#94A3B8",
    marginTop: 2,
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 14,
    backgroundColor: "#263244",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    color: "#94A3B8",
    fontSize: 13,
  },
  infoValue: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#263244",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "600",
  },
  totalValue: {
    color: "#FB923C",
    fontSize: 22,
    fontWeight: "800",
  },
  sectionCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionLink: {
    color: "#F97316",
    fontSize: 12,
    fontWeight: "600",
  },
  methodList: {
    gap: 9,
  },
  methodItem: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: "#1A2435",
    borderWidth: 1,
    borderColor: "#263244",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  methodItemSelected: {
    borderColor: "#FB923C",
    backgroundColor: "rgba(249, 115, 22, 0.12)",
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  methodIconWrap: {
    width: 33,
    height: 33,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22314A",
  },
  methodIconWrapSelected: {
    backgroundColor: "#F97316",
  },
  methodTitle: {
    color: "#F1F5F9",
    fontSize: 13,
    fontWeight: "700",
  },
  methodSub: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#64748B",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#FB923C",
  },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#FB923C",
  },
  promoRow: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#263244",
    backgroundColor: "#1A2435",
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  promoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tagBubble: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(249, 115, 22, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  promoTitle: {
    color: "#F1F5F9",
    fontSize: 13,
    fontWeight: "700",
  },
  promoSub: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 2,
  },
  applyText: {
    color: "#FB923C",
    fontSize: 12,
    fontWeight: "700",
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
  payButton: {
    backgroundColor: "#F97316",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  payText: {
    color: "#FFF7ED",
    fontSize: 13,
    fontWeight: "700",
  },
  payButtonDisabled: {
    opacity: 0.55,
  },
  errorBox: {
    backgroundColor: "rgba(248, 113, 113, 0.12)",
    borderColor: "rgba(248, 113, 113, 0.35)",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 12,
    fontWeight: "600",
  },
});
