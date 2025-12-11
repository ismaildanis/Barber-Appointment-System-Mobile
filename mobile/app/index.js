import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useRootNavigationState, useRouter } from "expo-router";
import { ThemedView } from "@/components/themed-view";
import { useUnifiedMe } from "@/src/hooks/useUnifiedAuth";

export default function Index() {
  const router = useRouter();
  const nav = useRootNavigationState();
  const { data, isLoading, isError } = useUnifiedMe();

  useEffect(() => {
    if (!nav?.key || isLoading) return;

    if (isError || !data) {
      router.replace("/(auth)/login");
      return;
    }

    if (data.role === "customer") router.replace("/(customer)/home");
    else if (data.role === "admin") router.replace("/(admin)/dashboard");
    else if (data.role === "barber") router.replace("/(barber)/todayAppointments");
    else router.replace("/(auth)/login");
  }, [nav, isLoading, isError, data, router]);

  return (
    <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
    </ThemedView>
  );
}
