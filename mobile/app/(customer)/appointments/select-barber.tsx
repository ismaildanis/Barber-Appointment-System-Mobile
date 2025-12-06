import { Button, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppointmentStore } from "@/src/store/appointmentStore";
import { useGetBarbers } from "@/src/hooks/useBarberQuery";
import { useRouter } from "expo-router";
import Spinner from "@/components/ui/Spinner";
import BarberList from "@/components/customer/BarberList";

export default function SelectBarber() {
    const router = useRouter();
    const { data: barbers, isLoading, refetch, error } = useGetBarbers();
    const { barberId, setBarberId } = useAppointmentStore();
    
    const onSelect = (id: number) => {
        setBarberId(id);
        router.replace("/(customer)/appointments");
    };
    if (isLoading || !barbers) return <Spinner size={"large"}/>

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={() => {refetch()}}
                        />
                    }
                >
                <BarberList barbers={barbers} selectedId={barberId ?? null} onSelect={onSelect} />
                    
                </ScrollView>
            </>
        </SafeAreaView>
    )

}