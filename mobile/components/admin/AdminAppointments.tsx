import { Appointment, AppointmentService, Status, statusColor, statusLabel } from "@/src/types/appointment";
import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable, RefreshControl, FlatList, StyleSheet } from "react-native";
import Spinner from "../ui/Spinner";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type AdminAppointmentProps = {
  appointments: Appointment[] | undefined;
  loading?: boolean;
  isRefetching: boolean;
  refetch: () => void;
  status: Status;
  setStatus: (status: Status) => void;
};

export default function AdminAppointments({ appointments, loading, status, setStatus, isRefetching, refetch }: AdminAppointmentProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    if (loading) return <Spinner />;

    return (
        <SafeAreaView style={{  }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#121212",
                    padding: 5,
                    borderRadius: 16,
                }}
            >
                <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff", marginLeft: 10 }}>
                    Randevu Filtre
                </Text>

                <View style={{ backgroundColor: "#AD8C57", borderRadius: 8 }}>
                    <View style={{ padding: 10, borderRadius: 8 }}>
                        <TouchableOpacity
                            onPress={() => setIsOpen(true)}
                            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                            activeOpacity={0.7}
                        >
                            <View style={{ 
                                paddingVertical: 8, 
                                paddingHorizontal: 14, 
                                borderRadius: 8, 
                                backgroundColor: "#1a1a1a",
                                borderWidth: 1,
                                borderColor: "rgba(255,255,255,0.1)"
                            }}>
                                <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600", letterSpacing: 0.3 }}>
                                    {statusLabel[status]}
                                </Text>
                            </View>
                            <Ionicons 
                                name={isOpen ? "chevron-up" : "chevron-down"} 
                                size={20} 
                                color="#121212" 
                            />
                        </TouchableOpacity>

                        <Modal
                            visible={isOpen}
                            onRequestClose={() => setIsOpen(false)}
                            transparent
                            animationType="fade"
                        >
                            <Pressable
                                onPress={() => setIsOpen(false)}
                                style={{ 
                                    flex: 1, 
                                    backgroundColor: "rgba(0,0,0,0.6)", 
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 20
                                }}
                            >
                                <View
                                    style={{
                                        width: "85%",
                                        maxWidth: 400,
                                        backgroundColor: "#1a1a1a",
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: "rgba(173, 140, 87, 0.3)",
                                        overflow: "hidden",
                                        shadowColor: "#AD8C57",
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 16,
                                        elevation: 8,
                                    }}
                                >
                                    <View style={{
                                        paddingVertical: 18,
                                        paddingHorizontal: 20,
                                        backgroundColor: "rgba(173, 140, 87, 0.15)",
                                        borderBottomWidth: 1,
                                        borderBottomColor: "rgba(173, 140, 87, 0.2)"
                                    }}>
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: "700",
                                            color: "#AD8C57",
                                            textAlign: "center",
                                            letterSpacing: 0.5
                                        }}>
                                            Durum Seçin
                                        </Text>
                                    </View>

                                    <View style={{ paddingVertical: 8 }}>
                                        {Object.keys(statusLabel).map((key, index) => {
                                            const value = key as Status;
                                            const selected = value === status;
                                            const isLast = index === Object.keys(statusLabel).length - 1;
                                            
                                            return (
                                                <TouchableOpacity
                                                    key={value}
                                                    onPress={() => {
                                                        setStatus(value);
                                                        setIsOpen(false);
                                                    }}
                                                    activeOpacity={0.7}
                                                    style={{
                                                        paddingVertical: 16,
                                                        paddingHorizontal: 20,
                                                        backgroundColor: selected ? "rgba(173, 140, 87, 0.2)" : "transparent",
                                                        borderLeftWidth: selected ? 4 : 0,
                                                        borderLeftColor: "#AD8C57",
                                                        borderBottomWidth: isLast ? 0 : 1,
                                                        borderBottomColor: "rgba(255,255,255,0.05)",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between"
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: selected ? "#AD8C57" : "rgba(255,255,255,0.9)",
                                                            fontSize: 16,
                                                            fontWeight: selected ? "700" : "500",
                                                            letterSpacing: 0.3
                                                        }}
                                                    >
                                                        {statusLabel[value]}
                                                    </Text>
                                                    {selected && (
                                                        <View style={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: 12,
                                                            backgroundColor: "#AD8C57",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}>
                                                            <Ionicons name="checkmark" size={16} color="#121212" />
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            </Pressable>
                        </Modal>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 12 }}>
                <FlatList
                    data={appointments ?? []}
                    keyExtractor={(item) => String(item.id)}
                    refreshControl={
                        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
                    }
                    contentContainerStyle={{ paddingBottom: 150 }}
                    renderItem={
                        ({ item }) => {
                            const start = item.appointmentStartAt?.slice(0, 16).replace("T", " ");
                            const end = item.appointmentEndAt?.slice(11, 16);
                            const services =
                            item.appointmentServices
                                ?.map((s: AppointmentService) => s.service?.name)
                                .join(", ") || "—";
                            
                            return(
                                <TouchableOpacity
                                    onPress={() => {
                                        router.replace({
                                            pathname: "/(admin)/(tabs)/dashboard/[id]",
                                            params: { id: String(item.id) },
                                        })
                                    }}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        padding: 16,
                                        backgroundColor: "#121212",
                                        borderRadius: 16,
                                        marginBottom: 12,
                                    }}
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
                            )
                        }
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000", paddingBlockEnd: 105 },
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