import { Appointment, AppointmentService, Status, statusColor, statusLabel } from "@/src/types/appointment";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, TouchableOpacity, RefreshControl, FlatList, StyleSheet } from "react-native";
import Spinner from "../ui/Spinner";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "@/constants/theme";
import FilterModal from "../ui/FilterModal";

type AdminAppointmentProps = {
  appointments: Appointment[] | undefined;
  loading?: boolean;
  isRefetching: boolean;
  refetch: () => void;
  status: Status;
  setStatus: (status: Status) => void;
};

export default function AdminAppointments({
  appointments,
  loading,
  status,
  setStatus,
  isRefetching,
  refetch,
}: AdminAppointmentProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = Object.entries(statusLabel).map(([value, label]) => ({
    value: value as Status,
    label,
  }));

  if (loading) return <Spinner />;

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", color: themeColors.text }}>
          Randevu
        </Text>
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 14, fontWeight: "600", color: themeColors.primary }}>
            {statusLabel[status]}
          </Text>
          <Ionicons name="chevron-down" size={20} color={themeColors.primary} />
        </TouchableOpacity>
      </View>

      <FilterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Durum Seçin"
        options={statusOptions}
        selectedValue={status}
        onSelect={setStatus}
      />

      <FlatList
        data={appointments}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={themeColors.primary}
            colors={[themeColors.primary]}
          />
        }
        contentContainerStyle={{ paddingBottom: 150 }}
        renderItem={({ item }) => {
          const start = item.appointmentStartAt?.slice(0, 16).replace("T", " ");
          const end = item.appointmentEndAt?.slice(11, 16);
          const services =
            item.appointmentServices
              ?.map((s: AppointmentService) => s.service?.name)
              .join(", ") || "—";

          return (
            <TouchableOpacity
              onPress={() => {
                router.replace({
                  pathname: "/(admin)/(tabs)/dashboard/[id]",
                  params: { id: String(item.id) },
                });
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                backgroundColor: themeColors.surface,
                borderRadius: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: themeColors.border,
              }}
            >
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.cardTitle}>
                  {item.barber?.firstName} {item.barber?.lastName}
                </Text>
                <Text style={styles.meta}>
                  {start} {end ? `- ${end}` : ""}
                </Text>
                <Text style={styles.meta}>
                  Durum:{" "}
                  <Text style={{ color: statusColor[item.status] }}>
                    {statusLabel[item.status] || item.status}
                  </Text>
                </Text>
                {item.status === "CANCELLED" ? (
                  <Text style={styles.note}>
                    İptal sebebi: {item.cancelReason ? item.cancelReason : "Belirtilmedi"}
                  </Text>
                ) : null}
                <Text style={styles.meta}>Hizmetler: {services}</Text>
                {item.notes ? <Text style={styles.note}>Not: {item.notes}</Text> : null}
              </View>
              <View style={styles.detailBadge}>
                <Ionicons name="chevron-forward" size={18} color="#121212" />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#12121245",
    paddingBlockEnd: 105,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: themeColors.text,
  },
  meta: {
    fontSize: 13,
    color: themeColors.textMuted,
  },
  note: {
    marginTop: 3,
    fontSize: 12,
    color: themeColors.warning,
  },
  detailBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: themeColors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});