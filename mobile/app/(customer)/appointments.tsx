import Dates from "@/components/appointments/Dates";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Spinner from "@/components/ui/Spinner";
import { useAvailableDatesForAppointment, useAvailableHoursForAppointment, useCreateAppointment } from "@/src/hooks/useAppointmentQuery";
import { useGetBarbers } from "@/src/hooks/useBarberQuery";
import { useGetServices } from "@/src/hooks/useServiceQuery";
import { useUnifiedMe } from "@/src/hooks/useUnifiedAuth";
import { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function CustomerAppointments() {
    const { data: services, isLoading: sLoading, refetch: refetchServices } = useGetServices();
    const { data: barbers, isLoading: bLoading, refetch: refetchBarbers } = useGetBarbers();
    const { data: me, isLoading: meLoading, refetch: refetchMe } = useUnifiedMe();
    const { data: availableDates, isLoading: adLoading, refetch: refetchAvailableDates } = useAvailableDatesForAppointment();
    const createAppointment = useCreateAppointment();

    const loading = sLoading || bLoading || meLoading || adLoading;
    const [selectedDate, setSelectedDate] = useState<string>();
    return (
        <SafeAreaView style={{ flex: 1 }}>  
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={() => {
                            refetchServices();
                            refetchBarbers();
                            refetchMe();
                            refetchAvailableDates();
                        }}
                    />
                }
            >
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        <Dates
                            dates={availableDates ?? []}
                            loading={adLoading}
                            selectedDate={selectedDate}
                            onSelect={setSelectedDate}
                        />
                    </>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}