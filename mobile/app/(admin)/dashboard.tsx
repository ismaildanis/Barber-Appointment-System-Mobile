import { useRouter } from "expo-router";
import { Button as RNButton } from "react-native";
import { useUnifiedLogout } from "@/src/hooks/useUnifiedAuth";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function AdminDashboard() {
  const router = useRouter();
  const logout = useUnifiedLogout();

  const onLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => router.replace("/(auth)/login"),
    });
  };

  return (
    <ThemedView>
      <ThemedText>AdminDashboard</ThemedText>
      <ThemedView style={{ width: "90%" ,alignSelf:"center" }}>
        <RNButton
          title={logout.isPending ? "Çıkış yapılıyor..." : "Logout"}
          onPress={onLogout}
          disabled={logout.isPending}
        />
      </ThemedView>
    </ThemedView>
  );
}
