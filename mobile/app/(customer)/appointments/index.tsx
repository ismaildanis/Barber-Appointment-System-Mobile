import { useGetCustomerAppointments } from "@/src/hooks/useAppointmentQuery";
import { AppointmentService, Appointment, statusLabel, statusColor } from "@/src/types/appointment";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Spinner from "@/components/ui/Spinner";
import { FlatList, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CustomerAppointments() {
  const { data, isLoading, isError, isRefetching, refetch, error} = useGetCustomerAppointments();
    const router = useRouter();
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Spinner size="large" />
      </ThemedView>
    );
  }

  if (!data?.length) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Randevularım</ThemedText>
        <ThemedText style={styles.empty}>Henüz randevu bulunamadı.</ThemedText>
      </ThemedView>
    ); 
  }

  if(isError) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Randevularım</ThemedText>
        <ThemedText style={styles.empty}>Randevu yükleme hatası. Lütfen sayfayı yenileyiniz veya uygulamayı tekrardan başlatınız.</ThemedText>
      </ThemedView>
    ); 
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Randevularım</ThemedText>
      <FlatList
        data={data as Appointment[]}
        keyExtractor={(item) => String(item.id)}
          refreshControl={
                <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const start = item.appointmentStartAt?.slice(0, 16).replace("T", " ");
          const end = item.appointmentEndAt?.slice(11, 16);
          const services =
            item.appointmentServices
              ?.map((s: AppointmentService) => s.service?.name)
              .join(", ") || "—";

          return (
            <TouchableOpacity onPress={() => router.push({
                pathname: "/(customer)/appointments/[id]",
                params: { id: String(item.id) },
                })} style={styles.card}
                >
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.cardTitle}>
                  {item.barber?.firstName} {item.barber?.lastName}
                </Text>
                <Text style={styles.meta}>
                  {start} {end ? `- ${end}` : ""}
                </Text>
                <Text style={[styles.meta, { color: statusColor[item.status] }]}>Durum: {statusLabel[item.status] || item.status}</Text>
                {item.status === "CANCELLED" ? <Text style={styles.meta}>İptal sebebi: {item.cancelReason ? item.cancelReason : "Belirtilmedi"} </Text> : null}
                <Text style={styles.meta}>Hizmetler: {services}</Text>
              {item.notes ? <Text style={styles.note}>Not: {item.notes}</Text> : null}
              </View>
                <View style={styles.detailBadge}>
                    <Ionicons name="chevron-forward" size={18} color="#2b2b2b" />
                </View>
            </TouchableOpacity>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000", paddingBlockEnd: 105 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "#fff", marginTop: 40 },
  empty: { color: "#ccc", marginTop: 8 },
  card: {
    flexDirection: "row", alignItems: "center",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  meta: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  note: { marginTop: 3, fontSize: 12, color: "#f3d9a4" },
  detailBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#C8AA7A",
    alignItems: "center",
    justifyContent: "center",
},
});
