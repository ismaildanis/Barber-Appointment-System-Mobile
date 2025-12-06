import Barbers from "@/components/appointments/Barbers";
import Dates from "@/components/appointments/Dates";
import Hours from "@/components/appointments/Hours";
import Services from "@/components/appointments/Service";
import Space from "@/components/appointments/Space";
import Spinner from "@/components/ui/Spinner";
import { myColors } from "@/constants/theme";

import { useAvailableDatesForAppointment, useAvailableHoursForAppointment, useCreateAppointment } from "@/src/hooks/useAppointmentQuery";
import { useGetBarbers } from "@/src/hooks/useBarberQuery";
import { useGetServices } from "@/src/hooks/useServiceQuery";
import { useUnifiedMe } from "@/src/hooks/useUnifiedAuth";
import { useAppointmentStore } from "@/src/store/appointmentStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, RefreshControl, TouchableOpacity, View, ScrollView, Text, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomerAppointments() {
  const router = useRouter();
  const { barberId, setBarberId } = useAppointmentStore();
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedService, setSelectedService] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = useState<string>();

  const safeBarberId = barberId ?? undefined;

  const { data: services, isLoading: sLoading, refetch: refetchServices } = useGetServices();
  const { data: barbers, isLoading: bLoading, refetch: refetchBarbers } = useGetBarbers();
  const { data: me, isLoading: meLoading, refetch: refetchMe } = useUnifiedMe();
  const { data: availableDates, isLoading: adLoading, refetch: refetchAvailableDates } = useAvailableDatesForAppointment();
  const { data: availableHours, isLoading: ahLoading, refetch: refetchAvailableHours } = useAvailableHoursForAppointment(safeBarberId, selectedDate);
  const createAppointment = useCreateAppointment();

  const loading = sLoading || bLoading || meLoading || adLoading || ahLoading; 
  
  useEffect(() => {
    if (!selectedDate && availableDates?.length) {
      setSelectedDate(availableDates[0]);
    }
    
  }, [availableDates, selectedDate]);

  useEffect(() => {
    if (!barberId) {
      router.push("/(customer)/appointments/select-barber");
    }
  }, [barberId]);

  const onSubmit = () => {
    if (!selectedDate || !barberId || !selectedService || !selectedHour) return alert("Lütfen gerekli alanları doldurun.");
    createAppointment.mutate({ 
      barberId,
      serviceIds: selectedService,
      appointmentStartAt: `${selectedDate}T${selectedHour}` 
    }, {
      onSuccess: (data) => { ;
        setSelectedDate(undefined);
        setBarberId(null);
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

  const durationMinutes = services       //süre toplamı 
    ?.filter((s) => selectedService.includes(s.id)) 
    .reduce((sum, s) => sum + s.duration, 0) ?? 0;

  const toggleService = (id: number) => // ekle ve cikar
    setSelectedService((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleHours = (hour: any) =>
    setSelectedHour((prev) => (prev === hour) ? undefined : hour);
    

  if (!availableDates) return <Spinner />;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      {/* Hero foto */}
      <ImageBackground
        source={{ uri: "http://192.168.1.141:3001/uploads/services/default-service.png" }} // berber foto
        style={{ 
          height: 290, 
          width: "100%", 
          backgroundColor: "rgba(255, 255, 255, 0.86)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
        resizeMode="contain"
      />

        <LinearGradient
            colors={[    "#2c2c2c",
            "#2b2b2b",
            "#2b2b2b"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}

          style={{
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            marginTop: 210,
            padding: 20,
            paddingTop: 32,

            shadowColor: "#000",
            shadowOpacity: 3,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 6 },
        
            elevation: 0,
          }}
        >
        <ScrollView
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
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <Dates
            dates={availableDates ?? []}
            loading={adLoading}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />

          <Barbers
            barbers={barbers ?? []}
            loading={bLoading}
            selectedBarber={safeBarberId}
            onSelect={setBarberId}
          />

          {/* <Services
            services={services ?? []}
            loading={sLoading}
            selectedService={selectedService}
            onSelect={toggleService}
          /> */}

          <Hours
            hours={availableHours ?? []}
            durationMinutes={durationMinutes}
            loading={ahLoading}
            selectedHour={selectedHour}
            onSelect={toggleHours}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            style={{ marginTop: 8, backgroundColor: "rgba(255,255,255,0.14)", borderRadius: 16, padding: 12 }}
          >
            <Button
              title={createAppointment.isPending ? "Randevu Oluşturuluyor..." : "Randevu Oluştur"}
              onPress={onSubmit}
              disabled={createAppointment.isPending}
            />
          </TouchableOpacity>

          <Space />
      </ScrollView>
        </LinearGradient>
    </SafeAreaView>
  );
}

