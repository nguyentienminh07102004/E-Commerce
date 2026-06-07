import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { LoginResponse, loginUser, RegisterRequest, registerUser } from "./api";

const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";
const USER_NAME_KEY = "auth.fullName";
const USER_ROLE_KEY = "auth.role";
const USER_AVATAR_KEY = "auth.avatar";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  fullName: string | null;
  role: string | null;
  avatar: string | null;
  isReady: boolean;
};

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<LoginResponse>;
  signUp: (payload: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function persistAuth(session: LoginResponse) {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken);
  await SecureStore.setItemAsync(USER_NAME_KEY, session.fullName);
  await SecureStore.setItemAsync(USER_ROLE_KEY, session.role);
  await SecureStore.setItemAsync(USER_AVATAR_KEY, session.avatar ?? "");
}

async function clearAuth() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_NAME_KEY),
    SecureStore.deleteItemAsync(USER_ROLE_KEY),
    SecureStore.deleteItemAsync(USER_AVATAR_KEY),
  ]);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    refreshToken: null,
    fullName: null,
    role: null,
    avatar: null,
    isReady: false,
  });

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const [accessToken, refreshToken, fullName, role, avatar] =
        await Promise.all([
          SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
          SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
          SecureStore.getItemAsync(USER_NAME_KEY),
          SecureStore.getItemAsync(USER_ROLE_KEY),
          SecureStore.getItemAsync(USER_AVATAR_KEY),
        ]);

      if (!active) {
        return;
      }

      setState({
        accessToken,
        refreshToken,
        fullName,
        role,
        avatar: avatar || null,
        isReady: true,
      });
    };

    hydrate();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.accessToken),
      signIn: async (email, password) => {
        const session = await loginUser({ email, password });
        await persistAuth(session);
        setState({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          fullName: session.fullName,
          role: session.role,
          avatar: session.avatar,
          isReady: true,
        });
        return session;
      },
      signUp: async (payload) => {
        await registerUser(payload);
      },
      signOut: async () => {
        await clearAuth();
        setState({
          accessToken: null,
          refreshToken: null,
          fullName: null,
          role: null,
          avatar: null,
          isReady: true,
        });
        router.replace("/(tabs)");
      },
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
