import { ScrollView, RefreshControl, StyleSheet, View } from "react-native";
import Logo from "../../assets/logo/a.svg";

import ShopHeader from "@/components/customer/ShopHeader";
import ServiceList from "@/components/customer/ServiceList";
import BarberList from "@/components/customer/BarberList";
import Spinner from "@/components/ui/Spinner";
import { useGetServices } from "@/src/hooks/useServiceQuery";
import { useGetBarbers } from "@/src/hooks/useBarberQuery";
import { useUnifiedMe } from "@/src/hooks/useUnifiedAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import LastAppointmentCard from "@/components/appointments/LastAppointmentCard";
import { useGetCustomerLastAppointment } from "@/src/hooks/useAppointmentQuery";
import { myColors } from "@/constants/theme";
import { LinearGradient } from 'expo-linear-gradient';
import OwnerLogo from "@/components/customer/OwnerLogo";


export default function CustomerHome() {
  const { data: services, isLoading: sLoading, refetch: refetchServices } = useGetServices();
  const { data: barbers, isLoading: bLoading, refetch: refetchBarbers } = useGetBarbers();
  const { data: me, isLoading: meLoading, refetch: refetchMe } = useUnifiedMe();
  const { data: lastAppt, isLoading: lastLoading, refetch: refetchLastAppt } = useGetCustomerLastAppointment();

  const loading = sLoading || bLoading || meLoading || lastLoading;
  
  return (
    <LinearGradient
      colors={myColors.mainBackgroundGradient}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}> 
        <>  
      <ShopHeader customer= {me} />
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
          }} 
        />
      }
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <View style={styles.container}>
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
    paddingTop: 40,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 40,
    overflow: "hidden",
  }
});