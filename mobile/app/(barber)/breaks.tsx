import Spinner from "@/components/ui/Spinner";
import { todayAppointmentsColors } from "@/constants/theme/barber/todayAppt";
import { dayOfWeekLabel } from "@/src/types/workingHour";
import { useDeleteBreakForBarber, useGetBreaksForBarber } from "@/src/hooks/useAppointmentQuery";
import { GetBreaksForBarber } from "@/src/types/appointment";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, ScrollView, RefreshControl, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

const formatTime = (m: number) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
};

export default function Breaks() {
  const router = useRouter();
  const { data, isLoading, isRefetching, refetch } = useGetBreaksForBarber();
  const deleteBreak = useDeleteBreakForBarber();


    const onDelete = (id: number) => {
        Alert.alert(
            "Uyarı", "Molayı silmek istediginizden emin misiniz?"
        ,[
            { text: "Vazgeç", style: "cancel" },
            {
                text: "Sil",
                style: "destructive",
                onPress: () => {
                    deleteBreak.mutate(id, { onSuccess: () => refetch() },);
                },
            },
        ])

    }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: todayAppointmentsColors.containerBackground }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(barber)/createBreak")}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Molalarım</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.replace("/(barber)/createBreak")}>
          <Ionicons name="add" size={20} color="#0f0f0f" />
          <Text style={styles.addBtnText}>Ekle</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <Spinner />
        </View>
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
          {data?.length === 0 ? (
            <View style={[styles.center, { marginTop: 32 }]}>
              <Text style={styles.muted}>Henüz mola yok, yukarıdan ekleyin.</Text>
            </View>
          ) : (
            data?.map((b: GetBreaksForBarber) => (
              <View key={b.id} style={styles.card}>
                <View>
                  <Text style={styles.day}>{dayOfWeekLabel[b.workingHour.dayOfWeek]}</Text>
                  <Text style={styles.time}>
                    {formatTime(b.startMin)} - {formatTime(b.endMin)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => onDelete(b.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash" size={18} color="#fff" />
                  <Text style={styles.deleteText}>Sil</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  backBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#E4D2AC",
    alignItems: "center",
  },
  addBtnText: { color: "#0f0f0f", fontWeight: "700" },
  title: { color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: 0.3 },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  day: { color: "#E4D2AC", fontWeight: "700", marginBottom: 4 },
  time: { color: "#fff", fontSize: 16, fontWeight: "700" },
  deleteBtn: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#e53935",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteText: { color: "#fff", fontWeight: "700" },
  muted: { color: "rgba(255,255,255,0.6)", fontSize: 15 },
  center: { justifyContent: "center", alignItems: "center", flex: 1 },
});
