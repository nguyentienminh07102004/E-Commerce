import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "auth.accessToken";

export type MetaData = {
  totalPage?: number;
  currentPage?: number;
  pageSize?: number;
};

type ApiResponse<T> = {
  data: T;
  statusCode?: number;
  metaData?: MetaData;
  success?: boolean;
  message?: string;
};

type PageResponse<T> = {
  content: T[];
  pageable?: unknown;
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export type SeatResponse = {
  id: number;
  seatNumber: number;
  rowNumber: number;
  roomId: number;
  type: "STANDARD" | "VIP" | "COUPLE";
  priceMultiplier: number;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
};

export type MovieResponse = {
  id: number;
  title: string;
  genre: string;
  duration: number;
  director: string;
  cast: string;
  description: string;
  posterMediaId: string | null;
  releaseDate: string;
  status: "COMING_SOON" | "NOW_SHOWING" | "ENDED";
  teaserUrl: string | null;
  reviewUrl: string | null;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
};

export type ShowtimeResponse = {
  id: number;
  startTime: string;
  endTime?: string;
  movieId?: number;
  roomId?: number;
  cinemaId?: number;
  movieName?: string;
  roomName?: string;
  cinemaName?: string;
  basePrice: number;
  totalSeats?: number;
  availableSeats: number;
  status: "SCHEDULED" | "ONGOING" | "ENDED" | "CANCELLED";
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
};

export type TicketSoldResponse = {
  showtimeId: number;
  seatId: string;
  type: string;
  price: number;
  isSold: boolean;
};

export type CinemaResponse = {
  id: number;
  name: string;
  address: string;
  city: string;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
};

export type BookingCreatePayload = {
  userId: string;
  showtimeId: number;
  seatIds: number[];
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  qrCode: string;
};

export type BookingResponse = BookingCreatePayload & {
  id: number;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
};

export type BookingDetailCreatePayload = {
  bookingId: number;
  seatId: number;
  priceAtTime: number;
};

export type BookingDetailResponse = BookingDetailCreatePayload & {
  id: number;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
};

export type PaymentCreatePayload = {
  method: "VNPAY" | "MOMO" | "ZALOPAY" | "CASH";
  amount: number;
  transactionId: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  bookingId: number;
};

export type PaymentResponse = PaymentCreatePayload & {
  id: number;
  paidAt?: string;
  createdAt?: string;
  paymentUrl: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  role: string;
  fullName: string;
  avatar: string | null;
};

export type RegisterRequest = {
  email: string;
  phone: string;
  fullName: string;
  password: string;
};

export type RegisterResponse = {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
  isLock?: boolean;
};

const defaultBaseUrl = "http://172.17.48.1:8889/api";

function getExpoHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest?.debuggerHost ??
    process.env.EXPO_DEBUGGER_HOST;

  if (!hostUri) {
    return null;
  }

  return hostUri
    .replace(/^exp:\/\//, "")
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .split(":")[0];
}

function getApiHost() {
  if (Platform.OS === "web") {
    return "localhost";
  }

  const expoHost = getExpoHost();

  if (!expoHost) {
    return null;
  }

  if (
    Platform.OS === "android" &&
    (expoHost === "localhost" || expoHost === "127.0.0.1")
  ) {
    return "192.168.0.103";
  }

  return expoHost;
}

function resolveApiBaseUrl() {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

  if (envBaseUrl) {
    return envBaseUrl;
  }

  const apiHost = getApiHost();

  if (apiHost) {
    return `http://${apiHost}:8889/api`;
  }

  return defaultBaseUrl;
}

const apiBaseUrl = resolveApiBaseUrl();

console.log("Resolved API Base URL:", apiBaseUrl);

function unwrapResponse<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    typeof (payload as ApiResponse<T>).data !== "undefined"
  ) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    // AbortError from fetch has name 'AbortError'
    if ((error as any).name === "AbortError") {
      return "Request timed out after 5000ms";
    }

    return error.message;
  }

  return "Unknown request error";
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...((init?.headers as Record<string, string>) ?? {}),
    };

    const res = await fetch(`${apiBaseUrl}${path}`, {
      method: (init?.method as string) ?? "GET",
      headers,
      body: init?.body as any,
    });

    const text = await res.text();
    let payload: unknown;
    try {
      payload = text ? JSON.parse(text) : undefined;
    } catch {
      payload = text;
    }

    if (!res.ok) {
      const msg =
        typeof payload === "string"
          ? payload
          : ((payload as any)?.message ?? res.statusText);
      throw new Error(msg);
    }

    return unwrapResponse<T>(payload);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  } finally {
  }
}

export async function getMovies({
  page = 0,
  size = 10,
}: {
  page?: number;
  size?: number;
}) {
  return requestJson<MovieResponse[]>(`/v1/movies?page=${page}&size=${size}`);
}

export async function getShowtimes() {
  return requestJson<ShowtimeResponse[]>("/v1/showtimes");
}

export async function getShowtimesByCinema(cinemaId: number) {
  return requestJson<ShowtimeResponse[]>(`/v1/showtimes?cinemaId=${cinemaId}`);
}

export async function getCinemas() {
  return requestJson<CinemaResponse[]>("/v1/cinemas");
}

export async function getSeatsByRoom(roomId: number) {
  return requestJson<SeatResponse[] | PageResponse<SeatResponse>>(
    `/v1/seats/${roomId}`,
  );
}

export async function getSeats() {
  return requestJson<PageResponse<SeatResponse>>("/v1/seats");
}

export async function getSoldTickets(showtimeId: number) {
  return requestJson<TicketSoldResponse[]>(
    `/v1/tickets/sold?showtimeId=${showtimeId}`,
  );
}

async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function createBooking(payload: BookingCreatePayload) {
  const accessToken = await getAccessToken();

  return requestJson<BookingResponse>("/v1/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : undefined,
  });
}

export async function createBookingDetail(payload: BookingDetailCreatePayload) {
  return requestJson<BookingDetailResponse>("/v1/booking-details", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createPayment(payload: PaymentCreatePayload) {
  return requestJson<PaymentResponse>("/v1/payments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginRequest) {
  return requestJson<LoginResponse>("/v1/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload: RegisterRequest) {
  return requestJson<RegisterResponse>("/v1/users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function seatLabelToSeatId(seatLabel: string) {
  const match = /^([A-Z]+)(\d+)$/i.exec(seatLabel.trim());

  if (!match) {
    return 0;
  }

  const rowLabel = match[1].toUpperCase();
  const seatNumber = Number(match[2]);
  const rowIndex = rowLabel.charCodeAt(0) - 64;

  return rowIndex * 100 + seatNumber;
}

export function formatMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}
