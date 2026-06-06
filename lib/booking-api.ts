import Constants from "expo-constants";
import { Platform } from "react-native";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  metaData: unknown;
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
  seatNumber: string;
  rowLabel: string;
  roomId: number;
  type: "STANDARD" | "VIP" | "COUPLE";
  basePrice: number;
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
  endTime: string;
  movieId: number;
  roomId: number;
  basePrice: number;
  availableSeats: number;
  status: "SCHEDULED" | "ONGOING" | "ENDED" | "CANCELLED";
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
};

export type BookingCreatePayload = {
  userId: string;
  showtimeId: number;
  promotionId: number | null;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
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

const defaultBaseUrl = "http://192.168.0.103:8080/api";

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
    return "10.0.2.2";
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
    const apiPort = process.env.EXPO_PUBLIC_API_PORT ?? "8080";

    return `http://172.17.48.1:${apiPort}/api`;
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

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
      signal: controller.signal,
    });

    clearTimeout(timeout);

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
    clearTimeout(timeout);
  }
}

export async function getMovies() {
  return requestJson<PageResponse<MovieResponse>>("/v1/movies");
}

export async function getShowtimes() {
  return requestJson<PageResponse<ShowtimeResponse>>("/v1/showtimes");
}

export async function getSeats() {
  return requestJson<PageResponse<SeatResponse>>("/v1/seats");
}

export async function createBooking(payload: BookingCreatePayload) {
  return requestJson<BookingResponse>("/v1/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
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
