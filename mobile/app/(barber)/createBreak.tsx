import CreateBreakForm from "@/components/barber/CreateBreakForm";
import { AlertModal } from "@/components/ui/AlertModal";
import { todayAppointmentsColors } from "@/constants/theme/barber/todayAppt";
import { useCreateBreakForBarber } from "@/src/hooks/useAppointmentQuery";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
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
        <SafeAreaView style={{ flex: 1, backgroundColor: todayAppointmentsColors.containerBackground, marginBottom: 60, padding: 16 }}>
            <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "space-between", 
                marginTop: 16,
                marginBottom: 20
            }}>
                <Text style={{ fontSize: 28, color: "#fff", fontWeight: "700" }}>Mola Oluştur</Text> 
                
                <TouchableOpacity 
                    onPress={() => router.replace("/(barber)/breaks")} 
                    style={{ 
                        paddingHorizontal: 16, 
                        paddingVertical: 10, 
                        borderRadius: 12, 
                        backgroundColor: "#E4D2AC",
                        elevation: 2, 
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4
                    }}
                >
                    <Text style={{ color: "#121212", fontSize: 14, fontWeight: "700" }}>Molalarım</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, marginBottom: 20, justifyContent: "space-between" }}>
                <CreateBreakForm selectedStartMin={startMin} selectedEndMin={endMin} onSelectStartMin={setStartMin} onSelectEndMin={setEndMin}  />

            <View style={{
                backgroundColor: '#121212',
                borderLeftWidth: 4,
                borderLeftColor: '#E4D2AC',
                paddingHorizontal: 16,
                paddingVertical: 12,
                alignSelf: 'center',
                borderRadius: 8,
                marginTop: 10,
                marginBottom: 20,
                width: '90%'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ color: '#E4D2AC', fontWeight: 'bold', fontSize: 14 }}>ÖNEMLİ BİLGİ</Text>
                </View>
                <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 20 }}>
                    Mola oluşturduğunuzda bu saat aralığında bulunan <Text style={{ fontWeight: 'bold', color: '#fff' }}>tüm randevular iptal edilir</Text> ve yeni randevu alınamaz.
                </Text>
            </View>
            {startMin && endMin && (
                <TouchableOpacity
                    onPress={onClick}
                    activeOpacity={0.8}
                    disabled={createBreak.isPending}
                    style={{
                        marginBottom: 20,
                        paddingVertical: 16,
                        paddingHorizontal: 20,
                        borderRadius: 24,
                        backgroundColor: createBreak.isPending ? "rgba(173,140,87,0.6)" : "#E4D2AC",
                        opacity: createBreak.isPending ? 0.8 : 1,
                    }}
                >
                    <Text
                        style={{
                            color: "#121212",
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