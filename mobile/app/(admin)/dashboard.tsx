import { useRouter } from "expo-router";
import { Button as RNButton, View } from "react-native";
import { useUnifiedLogout, useUnifiedMe } from "@/src/hooks/useUnifiedAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import AdminHeader from "@/components/admin/AdminHeader";
import { useGetAdminAppointments, useGetAdminOneAppointment } from "@/src/hooks/useAppointmentQuery";
import Spinner from "@/components/ui/Spinner";
import { Status } from "@/src/types/appointment";
import { useState } from "react";
import AdminAppointments from "@/components/admin/AdminAppointments";

export default function AdminDashboard() {
  const router = useRouter();
  const logout = useUnifiedLogout();
  const [status, setStatus] = useState<Status>('SCHEDULED');
  const { data: me, isLoading: meloading, isError: meError, refetch: meRefetch, isRefetching: meRefetching } = useUnifiedMe();
  const { data: allAppointments, isLoading: aLoading, isError: aError, refetch: aRefetch, isRefetching: aRefetching } = useGetAdminAppointments(status);
  //const { data: appointment, isLoading: oneLoading, isError: oneError, refetch: oneRefetch, isRefetching: oneRefetching } = useGetAdminOneAppointment();
  const laoding = meloading || aLoading;
  const onLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => router.replace("/(auth)/login"),
    });
  };

  if (laoding) return <Spinner />;
  
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <View>
        <AdminHeader admin={me} laoding={meloading} />
      </View>
      <View>
        <AdminAppointments appointments={allAppointments} loading={aLoading} status={status} setStatus={setStatus} />
      </View>
    </SafeAreaView>
  );
}
