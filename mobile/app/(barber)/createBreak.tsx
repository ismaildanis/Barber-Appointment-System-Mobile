import CreateBreakForm from "@/components/barber/CreateBreakForm";
import { AlertModal } from "@/components/ui/AlertModal";
import { useCreateBreakForBarber } from "@/src/hooks/useAppointmentQuery";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AlertMode = "confirm" | "info-success" | "info-error";

export default function CreateBreak() {
    const router = useRouter();
    const [startMin, setStartMin] = useState<number>();
    const [endMin, setEndMin] = useState<number>();
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMode, setAlertMode] = useState<AlertMode>("info-success");
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMsg, setAlertMsg] = useState("");
    const createBreak = useCreateBreakForBarber();

    const onClick = () => {
        setAlertTitle("Uyarı");
        setAlertMsg("Mola oluşturmak istediğinizden emin misiniz?");
        setAlertMode("confirm");
        setAlertVisible(true);
    };
    const onSubmit = () => {
        if (startMin && endMin) {
            createBreak.mutate({ 
                startMin, endMin 
            },{
                onSuccess: () => {
                    setStartMin(undefined);
                    setEndMin(undefined);
                    setAlertTitle("Başarılı");
                    setAlertMsg("Mola oluşturuldu.");
                    setAlertMode("info-success");
                    setAlertVisible(true);
                },
                onError: (err: any) => {
                    const msg = err?.response?.data?.message || err?.message || "Mola oluşturulamadı.";
                    setAlertTitle("Hata");
                    setAlertMsg(msg);
                    setAlertMode("info-error");
                    setAlertVisible(true);
                }
            }
        );
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#1e1e1e", marginBottom: 60 }}>
            <View style={{ flexDirection: "column", gap: 12, alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                <Text style={{ fontSize: 32,color:"#fff" }}>Mola Oluştur</Text>
                
            </View>
            <View style={{flex:1, marginBottom: 20, justifyContent: "space-between" }}>
                <CreateBreakForm selectedStartMin={startMin} selectedEndMin={endMin} onSelectStartMin={setStartMin} onSelectEndMin={setEndMin}  />
            {startMin && endMin && (
                <TouchableOpacity
                    onPress={onClick}
                    activeOpacity={0.8}
                    disabled={createBreak.isPending}
                    style={{
                        marginBottom: 20,
                        paddingVertical: 20,
                        paddingHorizontal: 20,
                        borderRadius: 24,
                        backgroundColor: createBreak.isPending ? "rgba(173,140,87,0.6)" : "#AD8C57",
                        opacity: createBreak.isPending ? 0.8 : 1,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            textAlign: "center",
                            fontWeight: "800",
                            letterSpacing: 0.3,
                        }}
                    >
                        {createBreak.isPending ? "Mola Oluşturuluyor..." : "Mola Oluştur"}
                    </Text>
                </TouchableOpacity>
            )}
            </View>

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
                    
                }
                }}
                confirmText={
                    alertMode === "confirm"
                    ? "Mola Oluştur"
                    : alertMode === "info-success"
                    ? "Tamam"
                    : "Tamam"
                }          
                cancelText="Kapat"
            />
        </SafeAreaView>
    );
}