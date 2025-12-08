import { useUnifiedMe, useUnifiedLogout } from "@/src/hooks/useUnifiedAuth";
import Spinner from "@/components/ui/Spinner";
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CustomerProfile() {

    const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useUnifiedMe();
  const logout = useUnifiedLogout();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Spinner size="large" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.empty}>Profil yüklenemedi. Yenilemeyi deneyin.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        contentContainerStyle={{ gap: 16 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
        </View>

        <Text style={styles.title}>Profil</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Ad Soyad</Text>
          <Text style={styles.value}>{`${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()}</Text>

          <Text style={styles.label}>E-posta</Text>
          <Text style={styles.value}>{data.email ?? "—"}</Text>

          <Text style={styles.label}>Telefon</Text>
          <Text style={styles.value}>{data.phone ?? "—"}</Text>

          <Text style={styles.label}>Rol</Text>
          <Text style={styles.value}>{data.role ?? "customer"}</Text>
        </View>

        <TouchableOpacity
          onPress={() => logout.mutate(undefined)}
          disabled={logout.isPending}
          style={[
            styles.logoutBtn,
            logout.isPending && { opacity: 0.7 },
          ]}
        >
          <Text style={styles.logoutText}>
            {logout.isPending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "transparent", paddingBottom: 90, marginTop: 40 },
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
    logoutBtn: {
        marginTop: 4,
        padding: 14,
        borderRadius: 14,
        backgroundColor: "#ef4444",
    },
    logoutText: { color: "#fff", fontWeight: "800", textAlign: "center" },
    backBtn: {
        padding: 12,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        marginTop: 12,
  },
});
