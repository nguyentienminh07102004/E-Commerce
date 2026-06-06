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

export default function RegisterScreen() {
  const params = useLocalSearchParams<{
    returnTo?: string | string[];
    email?: string | string[];
  }>();
  const returnTo = readParam(params.returnTo, "/(tabs)");
  const initialEmail = readParam(params.email, "");
  const { signUp, isReady, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canSubmit = useMemo(
    () =>
      fullName.trim().length > 0 &&
      email.trim().length > 0 &&
      phone.trim().length > 0 &&
      password.trim().length > 0,
    [fullName, email, phone, password],
  );

  const handleRegister = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      setSuccessMessage("Account created. Please login to continue.");
      router.replace({
        pathname: "/login",
        params: { returnTo, email: email.trim() },
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Register failed",
      );
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
              <Ionicons name="person-add" size={26} color="#FFF7ED" />
            </View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Register first, then login before you pay for tickets.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.fieldLabel}>Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nguyen Van A"
              placeholderTextColor="#64748B"
              style={styles.input}
              autoCapitalize="words"
            />

            <Text style={[styles.fieldLabel, styles.fieldSpacing]}>Email</Text>
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

            <Text style={[styles.fieldLabel, styles.fieldSpacing]}>Phone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="0900000000"
              placeholderTextColor="#64748B"
              style={styles.input}
              keyboardType="phone-pad"
            />

            <Text style={[styles.fieldLabel, styles.fieldSpacing]}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor="#64748B"
              style={styles.input}
              secureTextEntry
              textContentType="newPassword"
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!canSubmit || isSubmitting) && styles.primaryButtonDisabled,
              ]}
              activeOpacity={0.9}
              onPress={handleRegister}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFF7ED" />
              ) : (
                <Text style={styles.primaryButtonText}>Register</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              activeOpacity={0.85}
              onPress={() =>
                router.replace({
                  pathname: "/login",
                  params: { returnTo, email },
                })
              }
            >
              <Text style={styles.linkText}>
                Already have an account? Login
              </Text>
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
  },
  successText: {
    color: "#86EFAC",
    fontSize: 12,
    marginTop: 12,
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
