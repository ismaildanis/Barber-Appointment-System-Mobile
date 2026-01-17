import Dates from "@/components/appointments/Dates";
import Hours from "@/components/appointments/Hours";
import Space from "@/components/appointments/Space";
import Spinner from "@/components/ui/Spinner";
import { myColors } from "@/constants/theme";

import { FontAwesome5  } from "@expo/vector-icons";

import { useAvailableDatesForAppointment, useAvailableHoursForAppointment, useCreateAppointment } from "@/src/hooks/useAppointmentQuery";
import { useGetBarbers } from "@/src/hooks/useBarberQuery";
import { useGetServices } from "@/src/hooks/useServiceQuery";
import { useUnifiedMe } from "@/src/hooks/useUnifiedAuth";
import { useBarberStore } from "@/src/store/barberStore";
import { useServiceStore } from "@/src/store/serviceStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, RefreshControl, TouchableOpacity, ScrollView, Text, ImageBackground, Image, View, TextInput, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentSummary from "@/components/appointments/AppointmentSummary";
import { AlertModal } from "@/components/ui/AlertModal";
import { createAppointmentsIndexColors } from "@/constants/theme/createAppt";

type AlertMode = "confirm" | "info-success" | "info-error";

export default function CreateAppointments() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const { barberId, setBarberId } = useBarberStore();
  const { serviceIds, setServiceIds } = useServiceStore();
  
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedHour, setSelectedHour] = useState<string>();

  const safeBarberId = barberId ?? undefined;

  const { data: services, isLoading: sLoading, refetch: refetchServices } = useGetServices();
  const { data: barbers, isLoading: bLoading, refetch: refetchBarbers } = useGetBarbers();
  const { data: availableDates, isLoading: adLoading, refetch: refetchAvailableDates } = useAvailableDatesForAppointment();
  const { data: availableHours, isLoading: ahLoading, refetch: refetchAvailableHours } = useAvailableHoursForAppointment(safeBarberId, selectedDate);
  const createAppointment = useCreateAppointment();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMode, setAlertMode] = useState<AlertMode>("info-success");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [notes, setNotes] = useState<string>();
  const loading = sLoading || bLoading  || adLoading || ahLoading; 

  const topOffset = height > 700 ? Math.min(height * 0.18, 180) : 120; // Büyük ekranlarda %18, küçüklerde 120
  const pillHeight = Math.min(Math.max(height * 0.065, 50), 60); // 50–60 arası, daha küçük
  useEffect(() => {
    barbers?.forEach(b => Image.prefetch(b.image as string));
  }, [barbers]);

  useEffect(() => {
    if (!selectedDate && availableDates?.length) {
      setSelectedDate(availableDates[0]);
    }
    
  }, [availableDates, selectedDate]);

  useEffect(() => {
    if (!barberId && barbers?.length) {
      setBarberId(barbers[0].id)
    }
  }, [barbers, barberId]);

  const onSelect = () => {
    setSelectedHour(undefined);
    router.push("/(customer)/create-appointments/select-service")
  }

  const onClick = () => {
    setAlertTitle("Uyarı");
    setAlertMsg("Randevu oluşturmak istediğinizden emin misiniz?");
    setAlertMode("confirm");
    setAlertVisible(true);
  };

  const onSubmit = () => {
    if (!selectedDate || !barberId || !serviceIds || !selectedHour) return alert("Lütfen gerekli alanları doldurun.");
    createAppointment.mutate({ 
      barberId,
      serviceIds,
      notes,
      appointmentStartAt: `${selectedDate}T${selectedHour}`,
    }, {
      onSuccess: (data) => { ;
        setSelectedDate(undefined);
        setBarberId(null);
        setServiceIds([]);
        setSelectedHour(undefined);
        setNotes(undefined);
        setAlertTitle("Randevunuz Oluşturuldu");
        setAlertMsg("Randevunuz oluşturuldu. Randevu detaylarını Randevularım sayfasından kontrol edebilirsiniz.");
        setAlertMode("info-success");
        setAlertVisible(true);
        
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || err?.message || "Randevu oluşturulamadı.";
        setAlertTitle("Hata");
        setAlertMsg(msg);
        setAlertMode("info-error");
        setAlertVisible(true);
      },
    }
   );

  };


  const selectedServices = services?.filter((s) => serviceIds.includes(s.id)) ?? [];
  const totalDuration = selectedServices.reduce((sum, s) => sum + (s.duration ?? 0), 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + parseFloat((s.price ?? 0)), 0);

  const selected = barbers?.find((b) => b.id === barberId);
  const others = barbers?.filter((b) => b.id !== barberId) ?? [];
  const display = [
    ...(selected ? [selected] : []),
    ...others.slice(0, 1), 
  ];
  const remaining = others.length - 1;

  const onSelectDate = (date: string) => {
    setSelectedHour(undefined);
    setSelectedDate(date);
  }
  const toggleHours = (hour: any) =>
    setSelectedHour((prev) => (prev === hour) ? undefined : hour);
    
  const hero = barbers?.find((b) => b.id === barberId)?.image;
  const heroSource = hero ? { uri: hero, cache: "force-cache" } : require("@/assets/images/default-service.png"); 

  if (!availableDates) return <Spinner />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      {/* Hero foto */}
      <ImageBackground 
        source={heroSource}
        style={{ 
          height: Math.min(height * 0.32, 290), // Ekranın %32'si, max 290
          width: "100%",
          backgroundColor: createAppointmentsIndexColors.imageBackground,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
        resizeMode="contain"
      />

        <TouchableOpacity
          onPress={() => router.push("/(customer)/create-appointments/select-barber")}
          style={{
            backgroundColor: "transparent",
            overflow: "hidden",
            borderRadius: 999,
            top: topOffset,
            position: "absolute",
            right: 8,
            maxWidth: "88%",
            height: pillHeight,
          }}
        >
          <LinearGradient
            colors={createAppointmentsIndexColors.containerGradient}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0, y: 1.3 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              height: pillHeight,
              paddingRight: 16,
              paddingLeft: 6,
              paddingVertical: 5,
              borderRadius: 16,
              shadowColor: "#2b2b2b",
              shadowOpacity: 0.5,
              shadowRadius: 18,
              borderColor: "rgba(255, 255, 255, 0.49)",
            }}
          >
            <View style={{ paddingVertical: 12, paddingHorizontal: 8, backgroundColor:"#C8AA7A", borderWidth: 2, borderColor:"#E4D2AC", borderRadius: 999}}>
              <FontAwesome5 
                name="sync"
                size={18}
                color="#2b2b2b"
                style={{ marginLeft: 4, marginRight: 4 }}
              />
            </View>
            {display?.map((b) => (
              <LinearGradient
                key={b.id}
                colors={["#C8AA7A", "#E4D2AC"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 28,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: b.image, cache: "force-cache" }}
                  style={{ width: 36, height: 36, borderRadius: 24, backgroundColor:"transparent" }}
                />
              </LinearGradient>
            ))}

            {remaining > 0 && (
              <View style={{ paddingHorizontal: 6, paddingVertical: 6, borderRadius: 18, backgroundColor: "#C8AA7A", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#2b2b2b", fontWeight: "700" }}>+{remaining}</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>


        <LinearGradient
            colors={[    "#2c2c2c",
            "#2b2b2b",
            "#2b2b2b"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}

          style={{
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            marginTop: Math.min(height * 0.23, 210), // Ekranın %23'ü, max 210
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
                refetchAvailableDates();
                refetchAvailableHours();
              }}
            />
          }
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
        > 
          <View style={{ flexDirection: "row", justifyContent:"space-between", alignItems: "center", gap: 8, paddingHorizontal: 8 }}>
            <Text style={{ fontWeight: "700", fontSize: 28, color: "#fff" }}>Berber:</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Text style={{ fontWeight: "700", fontSize: 28, color: "#fff" }}>{`${selected?.firstName}`}</Text>
              <Text style={{ fontWeight: "700", fontSize: 28, color: "#fff" }}>{`${selected?.lastName}`}</Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 12,
              height: 1,
              backgroundColor: "#C8AA7A",
              width: "100%",
              opacity: 0.7,
            }}
          />

          <Dates
            dates={availableDates ?? []}
            loading={adLoading}
            selectedDate={selectedDate}
            onSelect={onSelectDate}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onSelect}
            style={{ marginTop: 20, borderRadius: 16, overflow: "hidden" }}
          >
            <LinearGradient
              colors={["#C8AA7A", "#E4D2AC"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                padding: 14,
                borderRadius: 16,
                borderWidth: 3,
                shadowColor: "#C8AA7A",
                shadowOpacity: 0.5,
                shadowRadius: 18,
                borderColor: "rgba(255, 255, 255, 0.49)",
                backgroundColor: "rgba(255, 255, 255, 0.32)",
              }}
            >
              <Text style={{ color: "#1b1b1b", fontSize: 16, fontWeight: "700" }}>Hizmet Seç</Text>
              {selectedServices.length === 0 ? (
                <Text style={{ color: "rgba(27,27,27,0.75)", marginTop: 6 }}>Henüz hizmet seçilmedi</Text>
              ) : (
                <>
                  <Text style={{ color: "#1b1b1b", marginTop: 6 }}>
                    {selectedServices.length} hizmet · {totalDuration} dk · {totalPrice} ₺
                  </Text>
                  {selectedServices.slice(0, 3).map((s) => (
                    <Text key={s.id} style={{ color: "rgba(27,27,27,0.85)", marginTop: 4 }}>
                      • {s.name} ({s.duration} dk)
                    </Text>
                  ))}
                  {selectedServices.length > 3 && (
                    <Text style={{ color: "rgba(27,27,27,0.65)", marginTop: 4 }}>
                      +{selectedServices.length - 3} daha
                    </Text>
                  )}
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>


          <Hours
            hours={availableHours ?? []}
            durationMinutes={totalDuration}
            loading={ahLoading}
            selectedHour={selectedHour}
            onSelect={toggleHours}
          />
          {selectedServices.length > 0 && selectedHour && barberId && (
            <View
              style={{
                marginTop: 20,
                padding: 12,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.12)",
                borderWidth: 1,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff", marginBottom: 8 }}>
                Not (isteğe bağlı)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                multiline
                placeholder="Berber için not bırakabilirsiniz"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={{
                  fontSize: 15,
                  color: "#f3f3f3",
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
              />
            </View>
          )}
        {selectedServices.length > 0 && selectedHour && barberId &&
          <AppointmentSummary
            date={selectedDate}
            time={selectedHour}
            barberName={`${barbers?.find(b => b.id === barberId)?.firstName} ${barbers?.find(b => b.id === barberId)?.lastName}`}
            services={selectedServices.map(s => ({ name: s.name, price: Number(s.price), duration: s.duration }))}
            totalPrice={totalPrice}
            totalDuration={totalDuration}
          />
        }
        {selectedServices.length > 0 && selectedHour && barberId &&
          <TouchableOpacity
            onPress={onClick}
            activeOpacity={0.8}
            disabled={createAppointment.isPending}
            style={{
              marginTop: 20,
              paddingVertical: 24,
              borderRadius: 24,
              backgroundColor: createAppointment.isPending ? "rgba(173,140,87,0.6)" : "#AD8C57",
              opacity: createAppointment.isPending ? 0.8 : 1,
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
              {createAppointment.isPending ? "Randevu Oluşturuluyor..." : "Randevu Oluştur"}
            </Text>
          </TouchableOpacity>
        }
          <Space />
      </ScrollView>
        </LinearGradient>
        <AlertModal
          visible={alertVisible}
          title={alertTitle}
          message={alertMsg}
          onClose={() => {
            setAlertVisible(false);
            if (alertMode === "info-success") router.replace("/(customer)/appointments");
          }}
          onConfirm={() => {
            if (alertMode === "confirm") {
              setAlertVisible(false);
              onSubmit();
            } else {
              setAlertVisible(false);
              if (alertMode === "info-success") router.push("/(customer)/appointments");
            }
          }}
        confirmText={
          alertMode === "confirm"
            ? "Oluştur"
            : alertMode === "info-success"
            ? "Randevularıma Git"
            : "Tamam"
        }          
        cancelText="Kapat"
        />
    </SafeAreaView>
  );
}

