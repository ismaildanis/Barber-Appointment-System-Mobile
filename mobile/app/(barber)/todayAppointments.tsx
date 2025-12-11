import { useRouter } from "expo-router";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { useGetBarberTodayAppointments } from "@/src/hooks/useAppointmentQuery";
import Spinner from "@/components/ui/Spinner";
import { statusLabel, statusColor, AppointmentService } from "@/src/types/appointment";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TodayAppointments() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useGetBarberTodayAppointments();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Spinner size="large" />
      </View>
    );
  }

  const hasData = !!data?.length;
  const total = hasData ? data!.length : 0;
  const planned = hasData ? data!.filter((a) => a.status === "SCHEDULED").length : 0;
  const done = hasData ? data!.filter((a) => a.status === "COMPLETED").length : 0;
  const cancelled = hasData ? data!.filter((a) => a.status === "CANCELLED").length : 0;

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <Text style={styles.title}>Bugünkü Randevular</Text>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>Toplam: {total}</Text>
          <Text style={styles.summaryText}>Planlı: {planned}</Text>
          <Text style={styles.summaryText}>Tamamlandı: {done}</Text>
          <Text style={styles.summaryText}>İptal: {cancelled}</Text>
        </View>

        {!hasData || isError ? (
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 40 }}>
            <Text style={{ color: "#a3a3a3", fontSize: 16, fontWeight: "700", textAlign: "center" }}>
              {isError ? "Randevular yüklenemedi. Yenilemeyi deneyin." : "Bugün için randevu bulunamadı."}
            </Text>
          </View>
        ) : (
          data!.map((item) => {
            const timeRange = `${item.appointmentStartAt?.slice(11, 16)} - ${item.appointmentEndAt?.slice(11, 16)}`;
            const services =
              item.appointmentServices?.map((s: AppointmentService) => s.service?.name).join(", ") || "Hizmet bilgisi yok";

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: "/(barber)/calendar/[id]",
                    params: { id: String(item.id) },
                  })
                }
                style={styles.card}
                activeOpacity={0.8}
              >
                <View style={styles.rowBetween}>
                  <Text style={styles.time}>{timeRange}</Text>
                  <View style={[styles.badge, { backgroundColor: statusColor[item.status] || "#a3a3a3" }]}>
                    <Text style={styles.badgeText}>{statusLabel[item.status] || item.status}</Text>
                  </View>
                </View>
                <Text style={styles.name} numberOfLines={1}>
                  {item.customer?.firstName} {item.customer?.lastName}
                </Text>
                <Text style={styles.meta} numberOfLines={2}>
                  {services}
                </Text>
                {item.notes ? <Text style={styles.note}>Not: {item.notes}</Text> : null}
                <View style={styles.detailRow}>
                  <Text style={styles.detailText}>Detay</Text>
                  <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#0f0f0f", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "800", color: "#fff", marginBottom: 8 },
  empty: { color: "#ccc" },
  summary: {
    flexDirection: "row",
    gap: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  summaryText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  card: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 6,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  time: { fontSize: 16, fontWeight: "700", color: "#fff" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: "#0f0f0f", fontWeight: "800", fontSize: 12 },
  name: { fontSize: 15, fontWeight: "700", color: "#fff" },
  meta: { fontSize: 13, color: "rgba(255,255,255,0.85)" },
  note: { fontSize: 12, color: "#fbbf24" },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  detailText: { color: "#d1d5db", fontSize: 13, fontWeight: "700" },
});
