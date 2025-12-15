import { useUnifiedMe, useUnifiedLogout } from "@/src/hooks/useUnifiedAuth";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl, ScrollView } from "react-native";

export default function BarberProfile() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useUnifiedMe();
  const logout = useUnifiedLogout();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Spinner size="large" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Profil</Text>
        <View style={styles.center}>
          <Text style={styles.empty}>Profil yüklenemedi. Yenilemeyi deneyin.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
      >
        <View style={styles.card}>
          <Text style={styles.label}>Ad Soyad</Text>
          <Text style={styles.value}>{`${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()}</Text>

          <Text style={styles.label}>E-posta</Text>
          <Text style={styles.value}>{data.email ?? "—"}</Text>

          <Text style={styles.label}>Telefon</Text>
          <Text style={styles.value}>{data.phone ?? "—"}</Text>

          <Text style={styles.label}>Durum</Text>
          <Text style={styles.value}>{data.active ? "Aktif" : "Aktif Değil"}</Text>
        </View>

        <TouchableOpacity
          style={styles.workingHourBtn}
          onPress={() => router.replace("/(barber)/workingHour")}
        >
          <Text style={styles.workingHourText}>Çalışma Saatlerim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            logout.mutate(undefined, {
              onSuccess: () => router.replace("/(auth)/login"),
            })
          }
          disabled={logout.isPending}
          style={[styles.logoutBtn, logout.isPending && { opacity: 0.7 }]}
        >
          <Text style={styles.logoutText}>
            {logout.isPending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f0f0f" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8, color: "#fff", marginTop: 16 },
  empty: { color: "#ccc", marginTop: 8 },
  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 8,
  },

  label: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  value: { fontSize: 16, fontWeight: "700", color: "#fff" },
  workingHourBtn: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#fbbf24",
    alignItems: "center",
  },
  workingHourText: { color: "#121212", fontWeight: "800" },
  logoutBtn: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#ef4444",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "800", textAlign: "center" },
});
