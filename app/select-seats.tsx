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
  CinemaResponse,
  getCinemas,
  getShowtimesByCinema,
  ShowtimeResponse,
} from "../lib/api";

function readParam(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function toTimeLabel(startTime: string) {
  return startTime.length >= 16 ? startTime.slice(11, 16) : startTime;
}

function toDateLabel(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = date.getDate();

  return `${weekday} ${day}`;
}

export default function SelectSeatsScreen() {
  const params = useLocalSearchParams<{
    movieTitle?: string | string[];
    userId?: string | string[];
  }>();

  const movieTitle = readParam(params.movieTitle, "Dune: Part Two");
  const userId = readParam(params.userId, "usr_001");

  const [cinemas, setCinemas] = useState<CinemaResponse[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [showtimes, setShowtimes] = useState<ShowtimeResponse[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isLoadingCinemas, setIsLoadingCinemas] = useState(true);
  const [isLoadingShowtimes, setIsLoadingShowtimes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCinema = cinemas.find(
    (cinema) => cinema.id === selectedCinemaId,
  );

  useEffect(() => {
    let active = true;

    const loadCinemas = async () => {
      setIsLoadingCinemas(true);
      setError(null);

      try {
        const cinemaList = await getCinemas();
        if (!active) {
          return;
        }

        setCinemas(cinemaList);
        setSelectedCinemaId(cinemaList[0]?.id ?? null);
      } catch (error) {
        if (!active) {
          return;
        }

        setError(
          error instanceof Error ? error.message : "Failed to load cinemas",
        );
      } finally {
        if (active) {
          setIsLoadingCinemas(false);
        }
      }
    };

    loadCinemas();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (selectedCinemaId == null) {
      return;
    }

    let active = true;

    const loadShowtimes = async () => {
      setIsLoadingShowtimes(true);
      setError(null);

      try {
        const showtimeList = await getShowtimesByCinema(selectedCinemaId);
        if (!active) {
          return;
        }

        setShowtimes(showtimeList);
      } catch (error) {
        if (!active) {
          return;
        }

        setShowtimes([]);
        setError(
          error instanceof Error ? error.message : "Failed to load showtimes",
        );
      } finally {
        if (active) {
          setIsLoadingShowtimes(false);
        }
      }
    };

    loadShowtimes();

    return () => {
      active = false;
    };
  }, [selectedCinemaId]);

  const dateOptions = useMemo(() => {
    const uniqueDates = Array.from(
      new Set(
        showtimes
          .map((showtime) => showtime.startTime.slice(0, 10))
          .filter(Boolean),
      ),
    );

    return uniqueDates.sort();
  }, [showtimes]);

  useEffect(() => {
    if (dateOptions.length === 0) {
      setSelectedDateIndex(0);
      return;
    }

    if (selectedDateIndex >= dateOptions.length) {
      setSelectedDateIndex(0);
    }
  }, [dateOptions, selectedDateIndex]);

  const filteredShowtimes = useMemo(() => {
    if (dateOptions.length === 0) {
      return [];
    }

    return showtimes.filter(
      (showtime) =>
        showtime.startTime.slice(0, 10) === dateOptions[selectedDateIndex],
    );
  }, [showtimes, dateOptions, selectedDateIndex]);

  const openSeatMap = (showtime: ShowtimeResponse) => {
    router.push({
      pathname: "/seat-map",
      params: {
        movieTitle,
        cinemaName: selectedCinema?.name ?? "",
        showtimeId: String(showtime.id),
        roomId: String(showtime.roomId ?? 0),
        showtimeDate: showtime.startTime.slice(0, 10),
        showtimeTime: toTimeLabel(showtime.startTime),
        ticketPrice: String(showtime.basePrice),
        userId,
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
            <Text style={styles.title}>Select Cinema</Text>
            <Text style={styles.subtitle}>
              {selectedCinema?.name ?? "Choose a theater"}
            </Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
            <Ionicons name="search" size={18} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Cinemas</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cinemaRow}
          >
            {isLoadingCinemas ? (
              <View style={styles.loaderBox}>
                <Text style={styles.loaderText}>Loading cinemas...</Text>
              </View>
            ) : error ? (
              <View style={styles.loaderBox}>
                <Text style={styles.loaderText}>{error}</Text>
              </View>
            ) : (
              cinemas.map((cinema) => (
                <TouchableOpacity
                  key={cinema.id}
                  style={[
                    styles.cinemaCard,
                    cinema.id === selectedCinemaId && styles.cinemaCardActive,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => setSelectedCinemaId(cinema.id)}
                >
                  <Text
                    style={[
                      styles.cinemaName,
                      cinema.id === selectedCinemaId && styles.cinemaNameActive,
                    ]}
                  >
                    {cinema.name}
                  </Text>
                  <Text style={styles.cinemaLocation}>{cinema.city}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowGap}
          >
            {dateOptions.length === 0 ? (
              <TouchableOpacity style={styles.chip} activeOpacity={0.88}>
                <Text style={styles.chipText}>No dates</Text>
              </TouchableOpacity>
            ) : (
              dateOptions.map((date, idx) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.chip,
                    idx === selectedDateIndex && styles.chipActive,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => setSelectedDateIndex(idx)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      idx === selectedDateIndex && styles.chipTextActive,
                    ]}
                  >
                    {toDateLabel(date)}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Showtimes</Text>
          {isLoadingShowtimes ? (
            <View style={styles.loaderBox}>
              <Text style={styles.loaderText}>Loading showtimes...</Text>
            </View>
          ) : error ? (
            <View style={styles.loaderBox}>
              <Text style={styles.loaderText}>{error}</Text>
            </View>
          ) : filteredShowtimes.length === 0 ? (
            <View style={styles.loaderBox}>
              <Text style={styles.loaderText}>No showtimes available</Text>
            </View>
          ) : (
            <View style={styles.showtimesGrid}>
              {filteredShowtimes.map((showtime) => (
                <TouchableOpacity
                  key={showtime.id}
                  style={styles.showtimeBox}
                  activeOpacity={0.88}
                  onPress={() => openSeatMap(showtime)}
                >
                  <Text style={styles.showtimeTime}>
                    {toTimeLabel(showtime.startTime)}
                  </Text>
                  <Text style={styles.showtimeMeta}>
                    ${showtime.basePrice.toFixed(2)}
                  </Text>
                  <Text style={styles.showtimeStatus}>{showtime.status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 40,
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
    flex: 1,
    alignItems: "center",
    marginHorizontal: 12,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  sectionCard: {
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
  cinemaRow: {
    gap: 10,
  },
  cinemaCard: {
    minWidth: 120,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  cinemaCardActive: {
    borderColor: "#F97316",
    backgroundColor: "#172554",
  },
  cinemaName: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "700",
  },
  cinemaNameActive: {
    color: "#FDE68A",
  },
  cinemaLocation: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 6,
  },
  loaderBox: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "600",
  },
  showtimesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  showtimeBox: {
    width: "48%",
    minHeight: 96,
    marginBottom: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1F2937",
    justifyContent: "space-between",
  },
  showtimeTime: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },
  showtimeMeta: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 8,
  },
  showtimeStatus: {
    color: "#60A5FA",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
  },
});
