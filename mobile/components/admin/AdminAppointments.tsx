import { Appointment, Status, statusLabel } from "@/src/types/appointment";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import Spinner from "../ui/Spinner";

type AdminAppointmentProps = {
  appointments: Appointment[] | undefined;
  loading?: boolean;
  status: Status;
  setStatus: (status: Status) => void;
};

export default function AdminAppointments({ appointments, loading, status, setStatus}: AdminAppointmentProps) {
    const [isOpen, setIsOpen] = useState(false);
    if (loading) return <Spinner />;
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#121212",
                padding: 5,
                marginTop: 20,
                borderRadius: 16,
            }}
        >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>
                Randevu Filtre
            </Text>

            <View style={{ backgroundColor: "#AD8C57", borderRadius: 16 }}>
                <View style={{ padding: 16, borderRadius: 16 }}>
                    <TouchableOpacity
                        onPress={() => setIsOpen(true)}
                        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                        activeOpacity={0.8}
                    >
                        <View style={{ padding: 8, borderRadius: 16, backgroundColor: "#121212" }}>
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                            {statusLabel[status]}
                        </Text>
                        </View>
                        <Ionicons name="chevron-down" size={24} color="#121212" />
                    </TouchableOpacity>

                    <Modal
                        visible={isOpen}
                        onRequestClose={() => setIsOpen(false)}
                        transparent
                        animationType="fade"
                    >
                        <Pressable
                            onPress={() => setIsOpen(false)}
                            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
                        >
                            <View
                                style={{
                                margin: 24,
                                paddingVertical: 8,
                                backgroundColor: "white",
                                borderRadius: 12,
                                gap: 4,
                                }}
                            >
                                {Object.keys(statusLabel).map((key) => {
                                    const value = key as Status;
                                    const selected = value === status;
                                    return (
                                        <TouchableOpacity
                                        key={value}
                                        onPress={() => {
                                            setStatus(value);
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            paddingVertical: 12,
                                            paddingHorizontal: 16,
                                            backgroundColor: selected ? "#EFE2CF" : "white",
                                        }}
                                        >
                                        <Text
                                            style={{
                                            color: "#000",
                                            fontSize: 16,
                                            fontWeight: selected ? "700" : "500",
                                            }}
                                        >
                                            {statusLabel[value]}
                                        </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </Pressable>
                    </Modal>
                </View>
            </View>
        </View>
    );
}
