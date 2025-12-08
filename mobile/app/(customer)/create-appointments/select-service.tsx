import Services from "@/components/appointments/Service";
import { useGetServices } from "@/src/hooks/useServiceQuery";
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
        <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "#000" }} >
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

            <TouchableOpacity
                onPress={onSave}
                style={{ marginTop: 12, padding: 14, borderRadius: 14, backgroundColor: "#AD8C57" }}
            >
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
                    Kaydet
                </Text>

            </TouchableOpacity>
            <TouchableOpacity
                onPress={onCancel}
                style={{ marginTop: 10, padding: 14, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.12)" }}
            >
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "700" }}>
                İptal
                </Text>
            </TouchableOpacity>

            <View style={{ padding: 30 }}>

            </View>
        </SafeAreaView >
    );
}