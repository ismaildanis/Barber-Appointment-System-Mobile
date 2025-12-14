import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Spinner from "@/components/ui/Spinner";
import {
  useGetAdminOneAppointment,
  useMarkCanceledAppointment,
  useMarkCompletedAppointment,
  useMarkNoShowAppointment,
} from "@/src/hooks/useAppointmentQuery";
import { statusColor, statusLabel, Status } from "@/src/types/appointment";
import { AlertModal } from "@/components/ui/AlertModal";

export default function DashboardAppointmentDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const numericId = Number(id);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [pendingAction, setPendingAction] = useState<"complete" | "noshow" | "cancel" | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const { data: appointment, isLoading, refetch, isRefetching } = useGetAdminOneAppointment(numericId);
  const markCompleted = useMarkCompletedAppointment();
  const markNoShow = useMarkNoShowAppointment();
  const markCanceled = useMarkCanceledAppointment();

  const isWorking =
    isRefetching || markCompleted.isPending || markNoShow.isPending || markCanceled.isPending;

  const openConfirm = (action: "complete" | "noshow" | "cancel") => {
    setPendingAction(action);
    if (action === "complete") {
      setAlertTitle("Randevu tamamlandı mı?");
      setAlertMsg("Bu randevuyu tamamlandı olarak işaretleyeceksin.");
    } else if (action === "noshow") {
      setAlertTitle("Gelinmedi olarak işaretle?");
      setAlertMsg("Müşteri randevuya gelmediyse onayla.");
    } else {
      setAlertTitle("İptal edilsin mi?");
      setAlertMsg("İptal sebebini yazdığından emin ol.");
    }
    setAlertVisible(true);
  };

  const handleConfirm = () => {
    if (!pendingAction || !numericId) {
      setAlertVisible(false);
      return;
    }

    if (pendingAction === "complete") {
      markCompleted.mutate(numericId, {
        onSuccess: refetch,
        onSettled: () => setAlertVisible(false),
      });
    } else if (pendingAction === "noshow") {
      markNoShow.mutate(numericId, {
        onSuccess: refetch,
        onSettled: () => setAlertVisible(false),
      });
    } else if (pendingAction === "cancel") {
      if (!cancelReason.trim()) {
        Alert.alert("İptal sebebi gerekli", "Lütfen bir sebep girin.");
        return;
      }
      markCanceled.mutate(numericId, {
        onSuccess: () => {
          refetch();
          setCancelReason("");
        },
        onSettled: () => setAlertVisible(false),
      });
    }
  };

  if (isLoading) return <Spinner />;

  const status = appointment?.status as Status | undefined;
  const date = appointment?.appointmentStartAt?.slice(0, 10);
  const start = appointment?.appointmentStartAt?.slice(11, 16).replace("T", " ");
  const end = appointment?.appointmentEndAt?.slice(11, 16).replace("T", " ");
  const totalPrice = appointment?.appointmentServices?.reduce((sum, s) => sum + (Number(s.service.price) || 0), 0);
  const services =
    appointment?.appointmentServices
      ?.map((s: any) => {
        const price = (s.service as any)?.price ? ` (${(s.service as any).price}₺)` : "";
        const dur = (s.service as any)?.duration ? ` • ${s.service.duration} dk` : "";
        return `${s.service?.name || "—"}${price}${dur}`;
      })
      .join(", ") || "—";
  const customer = appointment?.customer
    ? `${appointment.customer.firstName} ${appointment.customer.lastName}`
    : "—";
  const customerContact = appointment?.customer?.phone || "—";
  const customerContact2 = appointment?.customer?.email || "—";

  const canAct = status === "SCHEDULED" || status === "EXPIRED";

  return (
    <SafeAreaView style={styles.container}>
      {isWorking && <Spinner />}
      <TouchableOpacity onPress={() => router.replace("/(admin)/dashboard")} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Text style={styles.title}>Randevu Detayı</Text>

        <View style={styles.card}>
          <Text style={styles.name}>
            {appointment?.barber?.firstName} {appointment?.barber?.lastName}
          </Text>
          <Text style={styles.meta}>Müşteri: {customer}</Text>
          <Text style={styles.meta}>İletişim: {customerContact}</Text>
          <Text style={styles.meta}>Email: {customerContact2}</Text>
          <Text style={styles.meta}>Tarih: {date}</Text>
          <Text style={styles.meta}>Başlangıç: {start}</Text>
          <Text style={styles.meta}>Bitiş: {end || "—"}</Text>
          <Text style={[styles.meta, { color: status ? statusColor[status] : "#fff" }]}>
            Durum: {status ? statusLabel[status] : "—"}
          </Text>
          {appointment?.cancelReason ? (
            <Text style={styles.meta}>İptal sebebi: {appointment.cancelReason}</Text>
          ) : null}
          <Text style={styles.meta}>Hizmetler: {services}</Text>
          <Text style={styles.meta}>Toplam Fiyat: {totalPrice}₺</Text>
          {appointment?.notes ? <Text style={styles.note}>Not: {appointment.notes}</Text> : null}
        </View>

        <View style={styles.actions}>
          <ActionButton
            label="Tamamlandı"
            icon="checkmark-circle"
            onPress={() => openConfirm("complete")}
            disabled={!canAct}
          />
          <ActionButton
            label="Gelinmedi"
            icon="close-circle"
            onPress={() => openConfirm("noshow")}
            disabled={!canAct}
          />
        </View>

        <View style={styles.cancelBox}>
          <Text style={styles.meta}>İptal sebebi</Text>
          <TextInput
            value={cancelReason}
            onChangeText={setCancelReason}
            placeholder="Sebep yazın"
            placeholderTextColor="rgba(255,255,255,0.5)"
            style={styles.input}
          />
          <ActionButton
            label="İptal Et"
            icon="trash"
            onPress={() => openConfirm("cancel")}
            disabled={!canAct}
            danger
          />
        </View>
      </ScrollView>

      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMsg}
        onClose={() => setAlertVisible(false)}
        onConfirm={handleConfirm}
        confirmText={
          pendingAction === "complete"
            ? "Tamamlandı"
            : pendingAction === "noshow"
            ? "Gelinmedi"
            : "İptal Et"
        }
        cancelText="Kapat"
      />
    </SafeAreaView>
  );
}

function ActionButton({
  label,
  icon,
  onPress,
  disabled,
  danger,
}: {
  label: string;
  icon: any;
  onPress: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.actionBtn,
        danger ? { backgroundColor: "#e35b5b" } : null,
        disabled ? { opacity: 0.5 } : null,
      ]}
    >
      <Ionicons name={icon} size={18} color="#121212" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000" },
  backBtn: { marginBottom: 16, width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  title: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 12 },
  card: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 16,
    gap: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  name: { color: "#fff", fontSize: 18, fontWeight: "700" },
  meta: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  note: { color: "#f3d9a4", fontSize: 13, marginTop: 4 },
  actions: { flexDirection: "row", gap: 10, marginBottom: 16 },
  actionBtn: {
    flex: 1,
    backgroundColor: "#AD8C57",
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  actionText: { color: "#121212", fontSize: 15, fontWeight: "700" },
  cancelBox: {
    backgroundColor: "#121212",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 8,
  },
  input: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
  },
});
