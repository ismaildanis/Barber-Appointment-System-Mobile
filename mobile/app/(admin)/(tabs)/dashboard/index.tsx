import { useRouter } from "expo-router";
import { Button as RNButton, View } from "react-native";
import { useUnifiedLogout, useUnifiedMe } from "@/src/hooks/useUnifiedAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import AdminHeader from "@/components/admin/AdminHeader";
import { useGetAdminAppointments, useGetAdminOneAppointment } from "@/src/hooks/useAppointmentQuery";
import Spinner from "@/components/ui/Spinner";
import { Status } from "@/src/types/appointment";
import { useEffect, useState } from "react";
import AdminAppointments from "@/components/admin/AdminAppointments";
import { myColors } from "@/constants/theme";

export default function AdminDashboard() {
  const router = useRouter();
  const logout = useUnifiedLogout();
  const [status, setStatus] = useState<Status>("SCHEDULED");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = selectedDate.toISOString().split('T')[0];
  const { data: me, isLoading: meloading, isError: meError, refetch: meRefetch, isRefetching: meRefetching } = useUnifiedMe();
  const { data: allAppointments, isLoading: aLoading, isError: aError, refetch: aRefetch, isRefetching: aRefetching } = useGetAdminAppointments(status, formattedDate);
  const laoding = meloading || aLoading;


  useEffect(() => {
      aRefetch();
  }, [status, formattedDate, aRefetch])
  
  if (laoding) return <Spinner />;
  
  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: myColors.mainBackground }}>
      <View>
        <AdminHeader admin={me} laoding={meloading} />
      </View>
      <View style={{ flex: 1 }}>
        <AdminAppointments appointments={allAppointments} loading={aLoading} status={status} setStatus={setStatus} isRefetching={aRefetching} refetch={aRefetch} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </View>
    </SafeAreaView>
  );
}
