import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import Spinner from "@/components/ui/Spinner";
import { useCancelBarberAppointment, useGetBarberOneAppointment } from "@/src/hooks/useAppointmentQuery";
import { statusLabel, statusColor, AppointmentService } from "@/src/types/appointment";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function CalendarDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const apptId = Number(id);
  const router = useRouter();
  const [reasonOpen, setReasonOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { data, isLoading, isError, refetch } = useGetBarberOneAppointment(apptId);
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
     <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 24 }}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(barber)/calendar")}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
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
              <Text style={styles.label}>İptal Sebebi:</Text>
              <Text style={styles.note}>{data.cancelReason}</Text>
            </>
          ) : null}
        </View>

        {data.status === "SCHEDULED" && (
          <TouchableOpacity
            onPress={() => setReasonOpen(true)}
            style={[styles.btnDanger, cancelMutation.isPending && { opacity: 0.7 }]}
            disabled={cancelMutation.isPending}
          >
            <Text style={styles.btnText}>
              Randevuyu İptal Et
            </Text>
          </TouchableOpacity>
        )}

        <Modal transparent visible={reasonOpen} animationType="slide" onRequestClose={() => setReasonOpen(false)}>
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: "flex-end" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            
          >
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>İptal Sebebi</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Sebep yazın (Opsiyonel)..."
                placeholderTextColor="#6b7280"
                value={reason}
                onChangeText={setReason}
                multiline
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setReasonOpen(false)}>
                  <Text style={styles.cancelText}>Vazgeç</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => {
                    const payload = reason.trim() ? { cancelReason: reason.trim() } : {};

                    cancelMutation.mutate(payload, {
                      onSuccess: () => {
                        setReason("");
                        setReasonOpen(false);
                        router.replace("/(barber)/calendar");
                        refetch();
                      },
                    });
                  }}
                >
                  <Text style={styles.confirmText}>
                    {cancelMutation.isPending ? "İptal ediliyor..." : "İptal Et"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#0f0f0f", paddingBottom: 100 },
  backBtn: {
      padding: 12,
      borderRadius: 18,
      backgroundColor: "rgba(255,255,255,0.08)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      marginTop: 12,
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
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#1a1a1a", padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 8 },
  modalInput: { backgroundColor: "#111", color: "#fff", borderRadius: 10, padding: 12, minHeight: 80 },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 12 },
  cancelBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.08)" },
  confirmBtn: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: "#ef4444" },
  cancelText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  confirmText: { color: "#fff", textAlign: "center", fontWeight: "700" },

});
