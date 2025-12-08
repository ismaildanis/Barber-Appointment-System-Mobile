import { ScrollView, RefreshControl, StyleSheet, View, TouchableOpacity } from "react-native";
import ShopHeader from "@/components/customer/ShopHeader";
import ServiceList from "@/components/customer/ServiceList";
import BarberList from "@/components/customer/BarberList";
import Spinner from "@/components/ui/Spinner";
import { useGetServices } from "@/src/hooks/useServiceQuery";
import { useGetBarbers } from "@/src/hooks/useBarberQuery";
import { useUnifiedLogout, useUnifiedMe } from "@/src/hooks/useUnifiedAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import LastAppointmentCard from "@/components/appointments/LastAppointmentCard";
import { useGetCustomerLastAppointment, useGetCustomerScheduledAppointment } from "@/src/hooks/useAppointmentQuery";
import { myColors } from "@/constants/theme";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import ScheduledAppointment from "@/components/appointments/ScheduledAppointment";
import { useRouter } from "expo-router";


export default function CustomerHome() {
  const router = useRouter();
  const { data: services, isLoading: sLoading, refetch: refetchServices } = useGetServices();
  const { data: barbers, isLoading: bLoading, refetch: refetchBarbers } = useGetBarbers();
  const { data: me, isLoading: meLoading, refetch: refetchMe } = useUnifiedMe();
  const { data: lastAppt, isLoading: lastLoading, refetch: refetchLastAppt } = useGetCustomerLastAppointment();
  const { data: ScheduledAppt, isLoading: ScheduledLoading, refetch: refetchScheduledAppt } = useGetCustomerScheduledAppointment();

  const logoutMutation = useUnifiedLogout();

  const loading = sLoading || bLoading || meLoading || lastLoading || ScheduledLoading;

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) {
    return null
  }

  if (!me) return <Spinner />;

  return (
    <LinearGradient
      colors={myColors.mainBackgroundGradient}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}> 
        <>  
      <ShopHeader customer= {me} logout={() => logoutMutation.mutate()}  />
    <ScrollView
      contentContainerStyle={{ paddingBottom: 120 }}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => {
            refetchServices();
            refetchBarbers();
            refetchMe();
            refetchLastAppt();
            refetchScheduledAppt();
          }} 
        />
      }
    >
      {loading ? ( 
        <Spinner />
      ) : (
        <>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => router.push(`/(customer)/appointments/${ScheduledAppt?.id}`)}>
              <ScheduledAppointment scheduledAppt={ScheduledAppt} loading={lastLoading}/>
            </TouchableOpacity>
            <LastAppointmentCard lastAppt={lastAppt} loading={lastLoading} />
            <ServiceList services={services ?? []} loading={sLoading} />
            <BarberList barbers={barbers ?? []} loading={bLoading} />
          </View>
        </>
      )}
    </ScrollView>
    </>
    </SafeAreaView>
    </LinearGradient>
  );
}

export const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 40,
    overflow: "hidden",
  }
});