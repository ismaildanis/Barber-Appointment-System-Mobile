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
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomerAppointments() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedBarber, setSelectedBarber] = useState<number>();
  const [selectedService, setSelectedService] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>();

  const { data: services, isLoading: sLoading, refetch: refetchServices } = useGetServices();
  const { data: barbers, isLoading: bLoading, refetch: refetchBarbers } = useGetBarbers();
  const { data: me, isLoading: meLoading, refetch: refetchMe } = useUnifiedMe();
  const { data: availableDates, isLoading: adLoading, refetch: refetchAvailableDates } = useAvailableDatesForAppointment();
  const { data: availableHours, isLoading: ahLoading, refetch: refetchAvailableHours } = useAvailableHoursForAppointment(selectedBarber, selectedDate);
  const createAppointment = useCreateAppointment();

  const loading = sLoading || bLoading || meLoading || adLoading || ahLoading; 


  const durationMinutes = services       //süre toplamı 
    ?.filter((s) => selectedService.includes(s.id)) 
    .reduce((sum, s) => sum + s.duration, 0) ?? 0;

  const toggleService = (id: number) => // ekle ve cikar
    setSelectedService((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );

  const onSubmit = () => {
    if (!selectedDate || !selectedBarber || !selectedService || !selectedHour) return alert("Lütfen gerekli alanları doldurun.");
    createAppointment.mutate({ 
      barberId: selectedBarber,
      serviceIds: selectedService,
      appointmentStartAt: `${selectedDate}T${selectedHour}` 
    }, {
      onSuccess: (data) => { ;
        setSelectedDate(undefined);
        setSelectedBarber(undefined);
        setSelectedService([]);
        setSelectedHour(undefined);
        alert("Randevu oluşturuldu.");
        router.replace("/(customer)/profile");
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Randevu oluşturulamadı.";
        alert(msg);
      },
    }
   );

  };
  useEffect(() => {
    if (!selectedDate && availableDates?.length) {
      setSelectedDate(availableDates[0]);
    }
    
  }, [availableDates, selectedDate]);

  useEffect(() => {
    if (!selectedBarber && barbers?.length) {
      setSelectedBarber(barbers[0].id);
    }
  }, [barbers, selectedBarber]);

  if (!availableDates) return <Spinner />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={[1]}
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
              onSelect={toggleService}
            />

            <Hours
              hours={availableHours ?? []}
              durationMinutes={durationMinutes}
              loading={ahLoading}
              selectedHour={selectedHour}
              onSelect={setSelectedHour}
            />
            <TouchableOpacity activeOpacity={0.8} style={{ marginTop: 16, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16 }}>
              <Button
                title={createAppointment.isPending ? "Randevu Oluşturuluyor..." : "Randevu Oluştur"}
                onPress={onSubmit}
                disabled={createAppointment.isPending}
              />
            </TouchableOpacity>
            <Space />
          </>
        }
      />
    </SafeAreaView>
  );
}
