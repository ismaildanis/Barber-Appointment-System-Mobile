import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useGetCustomerOneAppointment,
  useCancelCustomerAppointment,
} from "@/src/hooks/useAppointmentQuery";
import { statusLabel, statusColor, AppointmentService } from "@/src/types/appointment";
import Spinner from "@/components/ui/Spinner";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { AlertModal } from "@/components/ui/AlertModal";
import { SafeAreaView } from "react-native-safe-area-context";

type AlertMode = "confirm" | "info-success" | "info-error";


export default function AppointmentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const apptId = Number(id);
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useGetCustomerOneAppointment(apptId);
  const cancelMutation = useCancelCustomerAppointment(apptId);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMode, setAlertMode] = useState<AlertMode>("info-success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  if (isLoading) return <View style={styles.container}><Spinner size="large" /></View>;
  if (isError || !data) return <View style={[styles.container, { marginTop: 20 }]}><Text>Randevu yükleme hatası. Lütfen sayfayı yenileyiniz veya uygulamayı tekrardan başlatınız.</Text></View>;

  const fmtTR = (iso?: string, withTime = true) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("tr-TR", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: withTime ? "2-digit" : undefined,
      minute: withTime ? "2-digit" : undefined,
    });
  };
  const services =
    data.appointmentServices?.map((s: AppointmentService) => s.service?.name).join(", ") || "—";
  const startFull = fmtTR(data.appointmentStartAt);
  const endOnly = data.appointmentEndAt ? fmtTR(data.appointmentEndAt).split(" ")[1] : "";
  const created = fmtTR(data.createdAt);
  const updated = fmtTR(data.updatedAt);
  const canCancel = data.status === "SCHEDULED";

  const onClick = () => {
    setAlertTitle("Uyarı");
    setAlertMsg("Randevunuzu iptal etmek istediğinizden emin misiniz?");
    setAlertMode("confirm");
    setAlertVisible(true);
  };

  const onSubmit = () => {
    cancelMutation.mutate(undefined, { 
      onSuccess: () => { 
        setAlertTitle("Randevu İptali Başarılı");
        setAlertMsg("Randevunuzu iptal ettiniz. Yeni randevunuzu Randevu Oluştur sayfasından alabilirsiniz");
        setAlertMode("info-success");
        setAlertVisible(true);
      }, 
      onError: (err: any) => {
        const msg = err?.response?.data?.message || err?.message || "Randevu İptal Edilemedi.";
        setAlertTitle("Hata");
        setAlertMsg(msg);
        setAlertMode("info-error");
        setAlertVisible(true);
      }
    })
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView refreshControl={
        <RefreshControl 
          refreshing={isLoading}
          onRefresh={() => {refetch()}}
        />
      }>
      <View style={{flexDirection: "column", alignItems: "flex-start", marginTop: 16}}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(customer)/appointments")}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ gap: 14, paddingTop: 8 }}>
        <Text style={styles.title}>Randevu Detayı</Text>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>
              {data.barber?.firstName} {data.barber?.lastName}
            </Text>
            <View style={[styles.badge, { backgroundColor: statusColor[data.status] }]}>
              <Text style={styles.badgeText}>{statusLabel[data.status] || data.status}</Text>
            </View>
          </View>

          <Text style={styles.meta}>
            Tarih/Saat: {startFull} {endOnly ? `- ${endOnly}` : ""}
          </Text>
          {data.status === "CANCELLED" && (
            <Text style={styles.meta}>İptal sebebi: {data.cancelReason ?? "Belirtilmedi"}</Text>
          )}
          <Text style={styles.meta}>Hizmetler: {services}</Text>
          {data.notes ? <Text style={styles.note}>Not: {data.notes}</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.metaSmall}>Oluşturulma: {created}</Text>
          <Text style={styles.metaSmall}>Güncellenme: {updated}</Text>
        </View>

        {canCancel && (
          <TouchableOpacity
            onPress={onClick}
            style={styles.btnDanger}
            disabled={cancelMutation.isPending}
          >
            <Text style={styles.btnText}>
              {cancelMutation.isPending ? "İptal ediliyor..." : "Randevuyu İptal Et"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMsg}
        onClose={() => setAlertVisible(false)}
        onConfirm={() => {
          if (alertMode === "confirm") {
            setAlertVisible(false);
            onSubmit();
          } else {
            setAlertVisible(false);
            if (alertMode === "info-success") router.back();
          }
        }}
      confirmText={
        alertMode === "confirm"
          ? "Randevuyu iptal Et"
          : alertMode === "info-success"
          ? "Randevularım"
          : "Tamam"
      }          
      cancelText="Kapat"
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f0f0f", paddingBottom: 90 },
  backBtn: {
    padding: 12,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    marginTop: 12,
  },
  title: { fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 4 },
  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: "#0f0f0f", fontWeight: "800", fontSize: 12 },
  meta: { fontSize: 14, color: "rgba(255,255,255,0.9)" },
  metaSmall: { fontSize: 13, color: "rgba(255,255,255,0.75)" },
  note: { marginTop: 6, fontSize: 13, color: "#f3d9a4" },
  btnDanger: { marginTop: 8, padding: 14, borderRadius: 14, backgroundColor: "#ef4444" },
  btnText: { color: "#fff", fontWeight: "800", textAlign: "center" },
});
