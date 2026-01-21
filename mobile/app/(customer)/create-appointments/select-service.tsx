import Services from "@/components/appointments/Service";
import { useGetServices } from "@/src/hooks/useServiceQuery";
import { useHourStore } from "@/src/store/hourStore";
import { useServiceStore } from "@/src/store/serviceStore";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function SelectService() {
    const router = useRouter();
    const { data: services, isLoading, refetch, error } = useGetServices();
    const { serviceIds, setServiceIds, toggleService } = useServiceStore();
    const hideIdsRef = useRef<number[]>(serviceIds);

    const onSave = () => {
        router.back();
    };
    const onCancel = () => {
        setServiceIds(hideIdsRef.current);
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#121212" }} >
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />
                }
            >
            <Services 
                services={services}
                loading={isLoading}
                selectedService={serviceIds} 
                onSelect={toggleService}  
            />
            </ScrollView>
            <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 2, marginTop: 12 }}>
            <TouchableOpacity
                onPress={onSave}
                style={{ flex: 1, padding: 14, borderRadius: 14, backgroundColor: "#E4D2AC" }}
            >
                <Text style={{ color: "#121212", textAlign: "center", fontWeight: "700" }}>
                Kaydet
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onCancel}
                style={{ flex: 1, padding: 14, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.12)" }}
            >
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
                İptal
                </Text>
            </TouchableOpacity>
            </View>
  
            <View style={{ padding: 30 }}>

            </View>
        </SafeAreaView >
    );
}