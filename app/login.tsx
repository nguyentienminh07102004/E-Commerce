import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../lib/auth";

function readParam(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export default function LoginScreen() {
  const params = useLocalSearchParams<{
    returnTo?: string | string[];
    email?: string | string[];
  }>();
  const returnTo = readParam(params.returnTo, "/(tabs)");
  const initialEmail = readParam(params.email, "");
  const { signIn, isReady, isAuthenticated } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0,
    [email, password],
  );

  const handleLogin = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      debugger;
      await signIn(email.trim(), password);
      router.replace(returnTo as any);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(returnTo as any);
    }
  }, [isAuthenticated, returnTo]);

  if (!isReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerLoading}>
          <ActivityIndicator color="#F97316" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.hero}>
            <View style={styles.iconBubble}>
              <Ionicons name="ticket" size={26} color="#FFF7ED" />
            </View>
            <Text style={styles.title}>Sign in to book</Text>
            <Text style={styles.subtitle}>
              Login is required before payment so your booking can be saved.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#64748B"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
            />

            <Text style={[styles.fieldLabel, styles.fieldSpacing]}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              placeholderTextColor="#64748B"
              style={styles.input}
              secureTextEntry
              textContentType="password"
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!canSubmit || isSubmitting) && styles.primaryButtonDisabled,
              ]}
              activeOpacity={0.9}
              onPress={handleLogin}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF7ED" />
              ) : (
                <Text style={styles.primaryButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              activeOpacity={0.85}
              onPress={() =>
                router.push({
                  pathname: "/register",
                  params: { returnTo, email },
                })
              }
            >
              <Text style={styles.linkText}>Create new account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: "#090B13",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical: 24,
    justifyContent: "center",
    gap: 18,
  },
  centerLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    alignItems: "center",
    gap: 10,
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: "#111827",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#1F2937",
    padding: 16,
  },
  fieldLabel: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  fieldSpacing: {
    marginTop: 14,
  },
  input: {
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#243041",
    borderRadius: 14,
    color: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 12,
    marginTop: 12,
    marginBottom: 2,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#F97316",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: "#FFF7ED",
    fontSize: 14,
    fontWeight: "800",
  },
  linkButton: {
    marginTop: 14,
    alignItems: "center",
  },
  linkText: {
    color: "#FDBA74",
    fontSize: 13,
    fontWeight: "700",
  },
});
