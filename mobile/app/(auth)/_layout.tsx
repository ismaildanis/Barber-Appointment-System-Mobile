import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KvkkModal } from "@/components/ui/KvkkModal";


export default function AuthLayout() {
  const [kvkkVisible, setKvkkVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkKvkk = async () => {
      const v = await AsyncStorage.getItem("kvkkAccepted");
      if (v !== "true") setKvkkVisible(true);
      setChecked(true);
    };
    checkKvkk();
  }, []);

  const handleAccept = async () => {
    await AsyncStorage.setItem("kvkkAccepted", "true");
    setKvkkVisible(false);
  };

  if (!checked) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <KvkkModal visible={kvkkVisible} onAccept={handleAccept} />
    </>
  );
}
