import { useRouter } from "expo-router";
import { ScrollView, View, Text, StyleSheet, RefreshControl } from "react-native";
import { useGetBarberTodayAppointments } from "@/src/hooks/useAppointmentQuery";
import { SafeAreaView } from "react-native-safe-area-context";
import TodayAppointmentCard from "@/components/barber/TodayAppointmentCard";
import { useMemo } from "react";
import { todayAppointmentsColors } from "@/constants/theme/barber/todayAppt";

export default function TodayAppointments() {
  const router = useRouter();
  const { data: todayAppointments, isLoading, isError, refetch, isRefetching } = useGetBarberTodayAppointments();
  const today = useMemo(
      () =>
          new Intl.DateTimeFormat("en-CA", {
          timeZone: "Europe/Istanbul",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          }).format(new Date()),
      []
  );
  const hasData = !!todayAppointments?.length;
  const total = hasData ? todayAppointments!.length : 0;
  const planned = hasData ? todayAppointments!.filter((a) => a.status === "SCHEDULED").length : 0;
  const done = hasData ? todayAppointments!.filter((a) => a.status === "COMPLETED").length : 0;
  const cancelled = hasData ? todayAppointments!.filter((a) => a.status === "CANCELLED").length : 0;
  const weekday = new Date(today)
    .toLocaleDateString("tr-TR", { weekday: "long" })
    .replace(".", "");

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: todayAppointmentsColors.containerBackground }}>

        <View style={{flexDirection: "row",justifyContent: "center",alignItems: "center", marginBottom: 12} }>
          <Text style={{color: "#fff", fontSize: 16, fontWeight: "900"}}>Günün Randevuları</Text>
        </View>

        <View style={{flexDirection: "row",justifyContent: "center",alignItems: "center", marginBottom: 12} }>
          <Text style={{color: "#a3a3a3", fontSize: 16, fontWeight: "700"}}>Tarih: {today.slice(0, 10)} -- {weekday}</Text>
        </View>
        
        <View style={styles.summary}>
          <Text style={styles.summaryText}>Toplam: {total}</Text>
          <Text style={styles.summaryText}>Planlı: {planned}</Text>
          <Text style={styles.summaryText}>Tamamlandı: {done}</Text>
          <Text style={styles.summaryText}>İptal: {cancelled}</Text>
        </View>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <TodayAppointmentCard todayAppointments={todayAppointments} loading={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: todayAppointmentsColors.containerBackground, justifyContent: "center" },
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
