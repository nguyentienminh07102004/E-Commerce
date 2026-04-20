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

const paymentMethods = [
  {
    id: "visa",
    label: "Visa",
    detail: "**** 4819",
    icon: "card-outline",
  },
  {
    id: "momo",
    label: "MoMo Wallet",
    detail: "Connected",
    icon: "wallet-outline",
  },
  {
    id: "apple",
    label: "Apple Pay",
    detail: "Tap to pay",
    icon: "logo-apple",
  },
] as const;

export default function CheckoutScreen() {
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
          <Text style={styles.movieTitle}>Dune: Part Two</Text>
          <Text style={styles.movieMeta}>Cinema 1 • Tue 14 Mar • 15:50</Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Seats</Text>
            <Text style={styles.infoValue}>B2, B3</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ticket Price</Text>
            <Text style={styles.infoValue}>$12.00 x 2</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service Fee</Text>
            <Text style={styles.infoValue}>$2.00</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$26.00</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Text style={styles.sectionLink}>Add new</Text>
          </View>

          <View style={styles.methodList}>
            {paymentMethods.map((method, idx) => {
              const selected = idx === 0;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodItem,
                    selected && styles.methodItemSelected,
                  ]}
                  activeOpacity={0.88}
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
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Amount to Pay</Text>
          <Text style={styles.bottomPrice}>$26.00</Text>
        </View>
        <TouchableOpacity
          style={styles.payButton}
          activeOpacity={0.88}
          onPress={() => router.push("/ticket")}
        >
          <Text style={styles.payText}>Pay Now</Text>
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
});
