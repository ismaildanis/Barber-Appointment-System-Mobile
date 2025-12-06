import Barbers from "@/components/appointments/Barbers";
import Dates from "@/components/appointments/Dates";
import Hours from "@/components/appointments/Hours";
import Services from "@/components/appointments/Service";
import Space from "@/components/appointments/Space";
import Spinner from "@/components/ui/Spinner";
import { useAvailableDatesForAppointment, useAvailableHoursForAppointment, useCreateAppointment } from "@/src/hooks/useAppointmentQuery";
import { useGetBarbers } from "@/src/hooks/useBarberQuery";
import { useGetServices } from "@/src/hooks/useServiceQuery";
import { useUnifiedMe } from "@/src/hooks/useUnifiedAuth";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomerAppointments() {
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedBarber, setSelectedBarber] = useState<number>();
  const [selectedService, setSelectedService] = useState<number>();
  const [selectedHour, setSelectedHour] = useState<string>();

  const { data: services, isLoading: sLoading, refetch: refetchServices } = useGetServices();
  const { data: barbers, isLoading: bLoading, refetch: refetchBarbers } = useGetBarbers();
  const { data: me, isLoading: meLoading, refetch: refetchMe } = useUnifiedMe();
  const { data: availableDates, isLoading: adLoading, refetch: refetchAvailableDates } = useAvailableDatesForAppointment();
  const { data: availableHours, isLoading: ahLoading, refetch: refetchAvailableHours } = useAvailableHoursForAppointment(selectedBarber, selectedDate);
  const createAppointment = useCreateAppointment();

  const loading = sLoading || bLoading || meLoading || adLoading || ahLoading;

  const toYMD = (d: Date) => d.toISOString().slice(0, 10);

  // Türkiye saatiyle bugün
  useEffect(() => {
    if (!selectedDate && availableDates?.length) {
      const now = new Date();
      const trNow = new Date(now.getTime() + 3 * 60 * 60 * 1000); // UTC+3
      const today = toYMD(trNow);
      const match = availableDates.find((d: string) => d.startsWith(today));
      setSelectedDate(match ?? availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  // İlk berberi seç
  useEffect(() => {
    if (!selectedBarber && barbers?.length) {
      setSelectedBarber(barbers[0].id);
    }
  }, [barbers, selectedBarber]);

  if (!availableDates) return <Spinner />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={[1]} // dummy
        keyExtractor={() => "header"}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              refetchServices();
              refetchBarbers();
              refetchMe();
              refetchAvailableDates();
              refetchAvailableHours();
            }}
          />
        }
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <Dates
              dates={availableDates ?? []}
              loading={adLoading}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />

            <Barbers
              barbers={barbers ?? []}
              loading={bLoading}
              selectedBarber={selectedBarber}
              onSelect={setSelectedBarber}
            />

            <Services
              services={services ?? []}
              loading={sLoading}
              selectedService={selectedService}
              onSelect={setSelectedService}
            />

            <Hours
              hours={availableHours ?? []}
              durationMinutes={services?.find((s) => s.id === selectedService)?.duration ?? 0}
              loading={ahLoading}
              selectedHour={selectedHour}
              onSelect={setSelectedHour}
            />

            <Space />
          </>
        }
      />
    </SafeAreaView>
  );
}
