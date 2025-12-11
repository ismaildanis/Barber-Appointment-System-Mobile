import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Spinner from "@/components/ui/Spinner";
import { useCancelBarberAppointment, useGetBarberOneAppointment } from "@/src/hooks/useAppointmentQuery";
import { statusLabel, statusColor, AppointmentService } from "@/src/types/appointment";
import { Ionicons } from "@expo/vector-icons";

export default function CalendarDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const apptId = Number(id);
  const router = useRouter();

  const { data, isLoading, isError } = useGetBarberOneAppointment(apptId);
  const cancelMutation = useCancelBarberAppointment(apptId);

  if (isLoading) return (
    <View style={styles.container}>
      <Spinner size="large" />
    </View>
  );

  if (isError || !data) return (
    <View style={styles.container}>
      <Text style={styles.empty}>Randevu yüklenemedi.</Text>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(barber)/calendar")}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const services =
    data.appointmentServices?.map((s: AppointmentService) => s.service?.name).join(", ") ||
    "Hizmet bilgisi yok";
  const start = data.appointmentStartAt?.slice(0, 16).replace("T", " ");
  const end = data.appointmentEndAt?.slice(11, 16);
  const badgeColor = statusColor[data.status] || "#a3a3a3";

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(barber)/calendar")}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ gap: 16, paddingTop: 6 }}>
        <Text style={styles.title}>Randevu Detayı</Text>

        <View style={styles.heroCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.time}>{start}{end ? ` - ${end}` : ""}</Text>
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{statusLabel[data.status] || data.status}</Text>
            </View>
          </View>
          <Text style={styles.bigName} numberOfLines={1}>
            {data.customer?.firstName} {data.customer?.lastName}
          </Text>
          <Text style={styles.meta}>Hizmetler: {services}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Notlar</Text>
          <Text style={styles.value}>{data.notes || "—"}</Text>
          {data.cancelReason ? (
            <>
              <Text style={styles.label}>İptal Sebebi</Text>
              <Text style={styles.note}>{data.cancelReason}</Text>
            </>
          ) : null}
        </View>

        {data.status === "SCHEDULED" && (
          <TouchableOpacity
            onPress={() =>
              cancelMutation.mutate(undefined, {
                onSuccess: () => router.back(),
              })
            }
            style={[styles.btnDanger, cancelMutation.isPending && { opacity: 0.7 }]}
            disabled={cancelMutation.isPending}
          >
            <Text style={styles.btnText}>
              {cancelMutation.isPending ? "İptal ediliyor..." : "Randevuyu İptal Et"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#0f0f0f", paddingBottom: 100 },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.10)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 10, marginTop: 20,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#fff", marginBottom: 4 },
  heroCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    gap: 8,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 10,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  time: { fontSize: 18, fontWeight: "800", color: "#fff" },
  bigName: { fontSize: 20, fontWeight: "800", color: "#fff" },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: "#0f0f0f", fontWeight: "800", fontSize: 12 },
  label: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  value: { fontSize: 15, fontWeight: "700", color: "#e5e7eb" },
  meta: { fontSize: 14, color: "rgba(255,255,255,0.9)" },
  note: { fontSize: 13, color: "#fbbf24" },
  btnDanger: { marginTop: 6, padding: 16, borderRadius: 16, backgroundColor: "#ef4444" },
  btnText: { color: "#fff", fontWeight: "800", textAlign: "center" },
  empty: { color: "#ccc" },
});
