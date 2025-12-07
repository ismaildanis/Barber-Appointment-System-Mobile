// app/(customer)/(modals)/appointment/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetCustomerOneAppointment, useCancelCustomerAppointment } from "@/src/hooks/useAppointmentQuery";
import { statusLabel, statusColor, AppointmentService } from "@/src/types/appointment";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import Spinner from "@/components/ui/Spinner";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const apptId = Number(id);
  const router = useRouter();
  const { data, isLoading, isError } = useGetCustomerOneAppointment(apptId);
  const cancelMutation = useCancelCustomerAppointment(apptId);

  if (isLoading) return <ThemedView style={styles.container}><Spinner size="large" /></ThemedView>;
  if (isError || !data) return <ThemedView style={styles.container}><ThemedText>Randevu bulunamadı.</ThemedText></ThemedView>;

  const services = data.appointmentServices?.map((s: AppointmentService) => s.service?.name).join(", ") || "—";
  const start = data.appointmentStartAt?.slice(0, 16).replace("T", " ");
  const end = data.appointmentEndAt?.slice(11, 16);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ gap: 10 }}>
        <ThemedText style={styles.title}>Randevu Detayı</ThemedText>
        <Text style={styles.meta}>Berber: {data.barber?.firstName} {data.barber?.lastName}</Text>
        <Text style={styles.meta}>Tarih/Saat: {start} {end ? `- ${end}` : ""}</Text>
        <Text style={[styles.meta, { color: statusColor[data.status] }]}>
          Durum: {statusLabel[data.status] || data.status}
        </Text>
        {data.status === "CANCELLED" && (
          <Text style={styles.meta}>İptal sebebi: {data.cancelReason ?? "Belirtilmedi"}</Text>
        )}
        <Text style={styles.meta}>Hizmetler: {services}</Text>
        {data.notes ? <Text style={styles.note}>Not: {data.notes}</Text> : null}

        {data.status === "SCHEDULED" && (
          <TouchableOpacity
            onPress={() => cancelMutation.mutate(undefined, { onSuccess: () => router.back() })}
            style={styles.btnDanger}
            disabled={cancelMutation.isPending}
          >
            <Text style={styles.btnText}>
              {cancelMutation.isPending ? "İptal ediliyor..." : "Randevuyu İptal Et"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000", paddingBlockEnd: 105 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 8, color: "#fff", marginTop: 40 },
  meta: { fontSize: 14, color: "rgba(255,255,255,0.9)" },
  note: { marginTop: 6, fontSize: 13, color: "#f3d9a4" },
  btnDanger: { marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: "#ef4444" },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
